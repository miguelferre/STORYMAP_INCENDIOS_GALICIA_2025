"""Recorta o ráster SILVIS Global WUI 2020 ao bbox de Larouco-Seadur,
binariza WUI vs non-WUI por subgrupo (forestal-matorral / pradería) e
vectoriza a polígonos GeoJSON para o storymap.

Saída:
  - assets/data/wui_larouco.geojson : 2 categorías de WUI sobre o bbox.
  - imprime totais en hectáreas por clase.

Estratexia:
  1. Identifica os tiles SILVIS (Equi7Grid Europe, EPSG:27704) que intersectan
     o bbox Larouco-Seadur. Cada tile son 100 km × 100 km a 10 m de resolución.
  2. Fai mosaic dos tiles intersectados e recorta ao bbox.
  3. Reclasifica:
       1,2 -> 'wui_forestal'   (intermix + interface forest/shrub/wetland)
       3,4 -> 'wui_pradeira'   (intermix + interface grassland)
       resto -> 0 (descartado)
  4. Polygoniza con rasterio.features.shapes, filtra slivers <0,5 ha,
     simplifica e reproxecta a EPSG:4326.

Bbox Larouco-Seadur: [-7.30, 42.30, -6.85, 42.62]  (mesmo que dNBR Larouco)
"""

from __future__ import annotations

import sys
from pathlib import Path

import geopandas as gpd
import numpy as np
import rasterio
import rasterio.merge
import rasterio.warp
from rasterio.features import shapes
from shapely.geometry import box, shape

sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "raw" / "silvis_wui" / "EU"
ASSETS = ROOT / "assets" / "data"
PROC = ROOT / "data" / "processed"

BBOX = (-7.30, 42.30, -6.85, 42.62)  # lonmin, latmin, lonmax, latmax (EPSG:4326)

CLASES = {
    1: "wui_forestal",
    2: "wui_forestal",
    3: "wui_pradeira",
    4: "wui_pradeira",
}
ETIQUETAS = {
    "wui_forestal": "WUI forestal-matorral",
    "wui_pradeira": "WUI pradeira",
}


def tiles_que_intersectan(bbox_lonlat: tuple) -> list[Path]:
    """Devolve a lista de tiles SILVIS que intersectan o bbox dado en EPSG:4326."""
    target = box(*bbox_lonlat)
    matches = []
    for tile in sorted(RAW_DIR.rglob("WUI.tif")):
        with rasterio.open(tile) as ds:
            try:
                lonmin, latmin, lonmax, latmax = rasterio.warp.transform_bounds(
                    ds.crs, "EPSG:4326", *ds.bounds
                )
            except Exception:
                continue
            if box(lonmin, latmin, lonmax, latmax).intersects(target):
                matches.append(tile)
    return matches


def main() -> None:
    if not RAW_DIR.exists():
        raise FileNotFoundError(
            f"Non existe {RAW_DIR}. Executa scripts/17_descarga_silvis_wui.py primeiro."
        )

    print(f"Buscando tiles SILVIS que cubran o bbox {BBOX}...")
    tiles = tiles_que_intersectan(BBOX)
    if not tiles:
        raise SystemExit("Ningún tile cubre o bbox Larouco")
    print(f"  {len(tiles)} tiles atopados:")
    for t in tiles:
        print(f"    {t.parent.name}")

    # Reproxecta o bbox a CRS do mosaic (todos os tiles comparten EPSG:27704)
    with rasterio.open(tiles[0]) as ref:
        ref_crs = ref.crs
    xs = [BBOX[0], BBOX[2]]
    ys = [BBOX[1], BBOX[3]]
    xs_dst, ys_dst = rasterio.warp.transform("EPSG:4326", ref_crs, xs, ys)
    bbox_raster = (min(xs_dst), min(ys_dst), max(xs_dst), max(ys_dst))
    print(f"  bbox Larouco en {ref_crs.to_string()}: {bbox_raster}")

    print("Facendo mosaic dos tiles e recortando ao bbox...")
    srcs = [rasterio.open(t) for t in tiles]
    try:
        arr, win_transform = rasterio.merge.merge(srcs, bounds=bbox_raster)
    finally:
        for s in srcs:
            s.close()
    arr = arr[0]  # primeira (e única) banda
    win_crs = ref_crs

    print(f"  array recortado: {arr.shape}, valores únicos: {sorted(np.unique(arr).tolist())}")

    print()
    print("Reclasificando a wui_forestal / wui_pradeira...")
    out = np.zeros(arr.shape, dtype=np.uint8)
    out[(arr == 1) | (arr == 2)] = 1  # wui_forestal
    out[(arr == 3) | (arr == 4)] = 2  # wui_pradeira

    pixel_area_m2 = abs(win_transform.a * win_transform.e)
    ha_per_pixel = pixel_area_m2 / 10_000

    n_for = int((out == 1).sum())
    n_pra = int((out == 2).sum())
    print(f"  wui_forestal: {n_for:>10,} píxeles  ({n_for*ha_per_pixel:>9,.1f} ha)")
    print(f"  wui_pradeira: {n_pra:>10,} píxeles  ({n_pra*ha_per_pixel:>9,.1f} ha)")
    print(f"  resto:        {int((out == 0).sum()):>10,} píxeles (non-WUI ou non clasificado)")

    print()
    print("Vectorizando...")
    polys = []
    for clase_idx, etiqueta_clave in [(1, "wui_forestal"), (2, "wui_pradeira")]:
        mask = (out == clase_idx).astype(np.uint8)
        if not mask.any():
            continue
        for geom, _ in shapes(mask, mask=mask == 1, transform=win_transform):
            polys.append({
                "geometry": shape(geom),
                "categoria": etiqueta_clave,
                "etiqueta": ETIQUETAS[etiqueta_clave],
            })

    if not polys:
        print("  ningunha xeometría WUI no bbox.")
        return

    gdf = gpd.GeoDataFrame(polys, crs=win_crs)
    print(f"  {len(gdf):,} polígonos extraídos")

    print("Filtrando slivers (<0,5 ha) e simplificando...")
    gdf["area_ha"] = gdf.geometry.area / 10_000
    gdf = gdf[gdf["area_ha"] >= 0.5].copy()
    print(f"  {len(gdf):,} polígonos tras filtro")

    gdf = gdf.to_crs(4326)
    gdf["geometry"] = gdf.geometry.simplify(0.0001, preserve_topology=True)
    gdf["geometry"] = gdf.geometry.make_valid()

    try:
        gdf = gdf.dissolve(by="categoria", as_index=False,
                           aggfunc={"etiqueta": "first"})
    except Exception as e:
        print(f"  AVISO dissolve fallou ({e}); exporto sen disolver")

    out_gj = ASSETS / "wui_larouco.geojson"
    out_gj.unlink(missing_ok=True)
    gdf[["categoria", "etiqueta", "geometry"]].to_file(out_gj, driver="GeoJSON")
    print(f"GeoJSON: {len(gdf)} categorías -> {out_gj.name} "
          f"({out_gj.stat().st_size/1024:.0f} KB)")

    PROC.mkdir(parents=True, exist_ok=True)
    (PROC / "wui_larouco.geojson").unlink(missing_ok=True)
    gdf[["categoria", "etiqueta", "geometry"]].to_file(
        PROC / "wui_larouco.geojson", driver="GeoJSON"
    )


if __name__ == "__main__":
    main()
