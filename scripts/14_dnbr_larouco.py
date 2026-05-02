"""dNBR (differential Normalized Burn Ratio) sobre o perímetro Larouco-Seadur 2025.

Pipeline reproducible:
1. Conecta ao STAC API de Microsoft Planetary Computer (público, sen login).
2. Busca a mellor escena Sentinel-2 L2A pre-lume (xullo 2025) e post-lume
   (setembro-outubro 2025) sobre o bbox de Larouco-Seadur, escollendo a de
   menor cobertura de nubes.
3. Le bandas B08 (NIR, 10 m) e B12 (SWIR2, 20 m, resamplea a 10 m via xarray
   reindex_like). Calcula NBR = (B08 - B12) / (B08 + B12) en ambas datas e
   dNBR = NBRpre - NBRpost.
4. Clasifica segundo Key & Benson (2006) en 6 niveis e estatísticas por clase.
5. Exporta:
   - data/processed/dnbr_larouco_2025.tif (COG con dNBR continuo)
   - assets/data/dnbr_larouco_clases.geojson (vector simplificado por clase)
   - assets/data/dnbr_larouco_resumo.json (totais por clase + metadatos)

Bbox aproximado escollido para cubrir 31.778 ha do gran lume + cinta de
seguridade.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import geopandas as gpd
import numpy as np
import planetary_computer
import pystac_client
import rasterio
import rioxarray  # noqa: F401  (rexistra accesor .rio en xarray)
import xarray as xr
from rasterio.features import shapes
from shapely.geometry import shape

sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]

ROOT = Path(__file__).resolve().parents[1]
PROC = ROOT / "data" / "processed"
ASSETS = ROOT / "assets" / "data"
PROC.mkdir(parents=True, exist_ok=True)

# Bbox xeográfico (lon, lat) que cobre Larouco-Seadur con marxe.
BBOX = [-7.30, 42.30, -6.85, 42.62]

# Xanelas temporais. O lume foi entre 12-18 agosto 2025; pre = primeira metade
# de xullo (estado vexetativo previo), post = entre 5 e 30 outubro (vexetación
# xa post-lume, cinzas asentadas, mais antes da rebrota tardía).
PRE_RANGE = "2025-07-01/2025-07-25"
POST_RANGE = "2025-10-01/2025-10-31"

# Limiares Key & Benson (2006) sobre dNBR.
KB_BREAKS = [-1, -0.25, 0.10, 0.27, 0.44, 0.66, 2]
KB_LABELS = [
    "Rebrote post-lume",
    "Non queimado",
    "Severidade baixa",
    "Severidade moderada-baixa",
    "Severidade moderada-alta",
    "Severidade alta",
]
KB_COLORS = ["#1b9e77", "#bababa", "#fee08b", "#fdae61", "#d73027", "#7f1d1d"]


def busca_mellor(catalog: pystac_client.Client, datetime_range: str, intentos: int = 4):
    """Busca a escena Sentinel-2 L2A con menor cobertura de nubes no rango.
    Reintenta varias veces porque o STAC de MPC dá timeouts intermitentes."""
    import time as _time
    for tent in range(intentos):
        try:
            search = catalog.search(
                collections=["sentinel-2-l2a"],
                bbox=BBOX,
                datetime=datetime_range,
                max_items=80,
            )
            items = list(search.items())
            items.sort(key=lambda it: it.properties.get("eo:cloud_cover", 100))
            return items[0] if items else None
        except Exception as e:
            if tent == intentos - 1:
                raise
            print(f"  reintentando ({tent + 1}/{intentos}): {e}")
            _time.sleep(3)
    return None


def le_banda(item, banda: str, bbox_xy: tuple) -> xr.DataArray:
    """Le unha banda Sentinel-2 desde MPC, reproxecta ao bbox e EPSG:32629."""
    asset = planetary_computer.sign(item.assets[banda])
    da = rioxarray.open_rasterio(asset.href, masked=True).squeeze()
    # Recorta ao bbox xeográfico (re-proyecta despois ao CRS común UTM 29N).
    da = da.rio.clip_box(*bbox_xy, crs="EPSG:4326")
    return da.astype("float32")


def main() -> None:
    print(f"Conectando a Microsoft Planetary Computer STAC API")
    catalog = pystac_client.Client.open(
        "https://planetarycomputer.microsoft.com/api/stac/v1",
        modifier=planetary_computer.sign_inplace,
    )

    print(f"Buscando escena pre-lume ({PRE_RANGE})...")
    pre = busca_mellor(catalog, PRE_RANGE)
    if pre is None:
        raise SystemExit("Sen escena pre-lume dispoñible")
    print(f"  pre: {pre.id} - nubes={pre.properties.get('eo:cloud_cover'):.1f}%")

    print(f"Buscando escena post-lume ({POST_RANGE})...")
    post = busca_mellor(catalog, POST_RANGE)
    if post is None:
        raise SystemExit("Sen escena post-lume dispoñible")
    print(f"  post: {post.id} - nubes={post.properties.get('eo:cloud_cover'):.1f}%")

    print("Lendo bandas B08 (NIR) e B12 (SWIR2) das dúas datas...")
    bbox_xy = tuple(BBOX)  # minx, miny, maxx, maxy
    pre_b08 = le_banda(pre, "B08", bbox_xy)
    pre_b12 = le_banda(pre, "B12", bbox_xy)
    post_b08 = le_banda(post, "B08", bbox_xy)
    post_b12 = le_banda(post, "B12", bbox_xy)

    print("Aliñando B12 (20 m) coa rejilla de B08 (10 m)...")
    pre_b12 = pre_b12.rio.reproject_match(pre_b08)
    post_b12 = post_b12.rio.reproject_match(post_b08)
    post_b08 = post_b08.rio.reproject_match(pre_b08)
    post_b12 = post_b12.rio.reproject_match(pre_b08)

    print("Calculando NBR pre/post e dNBR...")
    nbr_pre = (pre_b08 - pre_b12) / (pre_b08 + pre_b12)
    nbr_post = (post_b08 - post_b12) / (post_b08 + post_b12)
    dnbr = nbr_pre - nbr_post

    out_tif = PROC / "dnbr_larouco_2025.tif"
    print(f"Gardando dNBR en {out_tif.name}...")
    dnbr.rio.write_crs(pre_b08.rio.crs, inplace=True)
    dnbr.rio.to_raster(
        out_tif,
        compress="DEFLATE",
        dtype="float32",
        tiled=True,
        BIGTIFF="IF_SAFER",
    )

    print("Reclasificando segundo Key & Benson 2006...")
    arr = dnbr.values
    valid = ~np.isnan(arr)
    pixel_m2 = abs(dnbr.rio.resolution()[0] * dnbr.rio.resolution()[1])
    ha_per_pixel = pixel_m2 / 10000.0

    clase_arr = np.full(arr.shape, -1, dtype=np.int8)
    for i in range(len(KB_BREAKS) - 1):
        mask = valid & (arr >= KB_BREAKS[i]) & (arr < KB_BREAKS[i + 1])
        clase_arr[mask] = i
    clase_arr[~valid] = -1

    resumo = {
        "metadatos": {
            "pre_scene": pre.id,
            "post_scene": post.id,
            "pre_nubes_pct": float(pre.properties.get("eo:cloud_cover", 0)),
            "post_nubes_pct": float(post.properties.get("eo:cloud_cover", 0)),
            "bbox_lonlat": BBOX,
            "fonte": "Sentinel-2 L2A vía Microsoft Planetary Computer",
            "limiares_kb": dict(zip(KB_LABELS, [
                {"min": KB_BREAKS[i], "max": KB_BREAKS[i + 1]} for i in range(len(KB_LABELS))
            ])),
            "ha_per_pixel": ha_per_pixel,
        },
        "clases": [],
    }
    print()
    print(f"{'Clase':<32} {'píxeles':>12} {'ha':>12} {'%':>6}")
    total_validos = int(valid.sum())
    for i, etq in enumerate(KB_LABELS):
        n = int((clase_arr == i).sum())
        ha = n * ha_per_pixel
        pct = 100 * n / total_validos if total_validos else 0
        resumo["clases"].append({
            "etiqueta": etq,
            "color": KB_COLORS[i],
            "indice": i,
            "pixeles": n,
            "ha": round(ha, 1),
            "pct_valido": round(pct, 2),
            "dnbr_min": KB_BREAKS[i],
            "dnbr_max": KB_BREAKS[i + 1],
        })
        print(f"  {etq:<30} {n:>12,} {ha:>12,.1f} {pct:>5.1f}%")

    out_resumo = ASSETS / "dnbr_larouco_resumo.json"
    out_resumo.write_text(json.dumps(resumo, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nResumen -> {out_resumo.name}")

    print("Vectorizando clases queimadas (severidades 2-5) a GeoJSON...")
    transform = dnbr.rio.transform()
    crs = dnbr.rio.crs
    polys = []
    # Só vectoriza clases 3-5 (mod-baixa, mod-alta, alta) — son as que conta o
    # mapa visual; severidade baixa (clase 2) inclúese só en cifras agregadas.
    for i in range(3, 6):
        mask = (clase_arr == i).astype(np.uint8)
        if not mask.any():
            continue
        for geom, _ in shapes(mask, mask=mask == 1, transform=transform):
            polys.append({
                "geometry": shape(geom),
                "clase_idx": i,
                "etiqueta": KB_LABELS[i],
                "color": KB_COLORS[i],
            })
    if polys:
        gdf = gpd.GeoDataFrame(polys, crs=crs)
        # Filtra polígonos diminutos (<5 ha) ANTES de reproxectar.
        gdf = gdf[gdf.geometry.area >= 50000].copy()
        gdf = gdf.to_crs(4326)
        gdf["geometry"] = gdf.geometry.simplify(0.0008, preserve_topology=True)
        gdf["geometry"] = gdf.geometry.make_valid()
        try:
            gdf = gdf.dissolve(by="clase_idx", as_index=False,
                               aggfunc={"etiqueta": "first", "color": "first"})
        except Exception as e:
            print(f"  AVISO dissolve fallou ({e}); exporto sen disolver")
        out_gj = ASSETS / "dnbr_larouco_clases.geojson"
        out_gj.unlink(missing_ok=True)
        gdf.to_file(out_gj, driver="GeoJSON")
        print(f"GeoJSON: {len(gdf)} clases queimadas -> {out_gj.name} "
              f"({out_gj.stat().st_size/1024:.0f} KB)")
    else:
        print("  ningunha clase queimada extraída")


if __name__ == "__main__":
    main()
