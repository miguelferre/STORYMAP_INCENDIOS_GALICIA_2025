"""Reclasifica o Mapa de Usos do Solo (IET-Xunta 2011, 1:500.000) a 7 categorías
divulgativas e exporta un GeoJSON ligero para o storymap.

Categorías:
  autoctono     — caducifolias e frondosas nativas
  eucalipto     — eucalipto puro e mestura dominada por eucalipto
  pineiro       — piñeiro / coníferas
  mato          — matorral natural e pasteiros arbustivos
  agrario       — cultivos, prados, viñedos, mosaicos rurais
  urbano        — asentamentos, áreas industriais, explotacións mineiras
  augas_rochedo — zonas de auga, areais, marismas e rochedos costeiros

Estratexia: simplificación por polígono ANTES do dissolve (reduce complexidade),
closing morfolóxico ±750 m tralo dissolve (enche buracos, suaviza contornos).
"""

from __future__ import annotations

import sys
import warnings
from pathlib import Path

import geopandas as gpd

sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
warnings.filterwarnings("ignore", category=RuntimeWarning)

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "vegetacion" / "uso_500" / "USO_A_500.shp"
PROC = ROOT / "data" / "processed"
ASSETS = ROOT / "assets" / "data"

MAPEO = {
    "cadu":       "autoctono",
    "cadupiñe":   "autoctono",
    "eu":         "eucalipto",
    "eupiñe":     "eucalipto",
    "piñe":       "pineiro",
    "mato":       "mato",
    "matoarbo":   "mato",
    "pasarbus":   "mato",
    "culfo":      "agrario",
    "culfoef":    "agrario",
    "culanu":     "agrario",
    "culamvi":    "agrario",
    "prmcaef":    "agrario",
    "vimca":      "agrario",
    "zapai":      "urbano",
    "exmin":      "urbano",
    "praduarmar": "augas_rochedo",
    "zoagui":     "augas_rochedo",
}

ETIQUETAS = {
    "autoctono":     "Bosque autóctono",
    "eucalipto":     "Eucalipto",
    "pineiro":       "Piñeiro / Coníferas",
    "mato":          "Matorral",
    "agrario":       "Agrario e rural",
    "urbano":        "Urbano e industrial",
    "augas_rochedo": "Augas e rochedo",
}

MIN_HA = 100
PRE_SIMPLIFY = 0.001
CLOSE_M = 750
POST_SIMPLIFY = 0.002


def main() -> None:
    print("Cargando USO_A_500.shp (1:500k)...")
    g = gpd.read_file(RAW)
    print(f"  {len(g):,} polígonos, CRS: {g.crs}")

    print(f"Filtrando polígonos <{MIN_HA} ha...")
    g["geometry"] = g.geometry.make_valid()
    g["area_ha"] = g.geometry.area / 10_000
    g = g[g["area_ha"] >= MIN_HA].copy()
    print(f"  {len(g):,} polígonos tras filtro")

    print("Mapeando ACRONIMO25 -> 7 categorías...")
    g["categoria"] = g["ACRONIMO25"].map(MAPEO)
    sen_match = g[g["categoria"].isna()]["ACRONIMO25"].unique().tolist()
    if sen_match:
        print(f"  AVISO sen mapeo: {sen_match}")
        g["categoria"] = g["categoria"].fillna("agrario")

    print(f"Simplificando por polígono {PRE_SIMPLIFY}° en EPSG:4326...")
    g = g.to_crs(4326)
    g["geometry"] = g.geometry.make_valid()
    g["geometry"] = g.geometry.simplify(PRE_SIMPLIFY, preserve_topology=True)
    g["geometry"] = g.geometry.make_valid()
    g = g[~g.geometry.is_empty].copy()

    print("Dissolve por categoría...")
    diss = g[["categoria", "geometry"]].dissolve(by="categoria").reset_index()
    diss["geometry"] = diss.geometry.make_valid()
    print(f"  {len(diss)} features")

    print(f"Closing morfolóxico ±{CLOSE_M} m (enche buracos, suaviza contornos)...")
    diss_eq = diss.to_crs(25829)
    diss_eq["geometry"] = diss_eq.geometry.buffer(CLOSE_M)
    diss_eq["geometry"] = diss_eq.geometry.buffer(-CLOSE_M)
    diss_eq["geometry"] = diss_eq.geometry.make_valid()
    diss = diss_eq.to_crs(4326)

    # Clip por prioridade: cada categoría cede terreo ás de maior prioridade para
    # eliminar solapamentos. O buffer closing expande cada categoría de forma
    # independente e pode crear zonas compartidas que producen blends de cor.
    # Orde de maior a menor prioridade (as primeiras "corten" ás seguintes):
    print("Clip por prioridade (eliminando solapamentos)...")
    PRIORITY = ['augas_rochedo', 'urbano', 'autoctono', 'eucalipto', 'pineiro', 'mato', 'agrario']
    geom_dict = {row["categoria"]: row.geometry for _, row in diss.iterrows()}
    clean_rows = []
    accumulated = None
    for cat in PRIORITY:
        if cat not in geom_dict:
            continue
        geom = geom_dict[cat]
        if accumulated is not None:
            try:
                geom = geom.difference(accumulated)
                geom = geom.make_valid() if hasattr(geom, "make_valid") else geom
            except Exception as exc:
                print(f"    AVISO difference {cat}: {exc}")
        if accumulated is None:
            accumulated = geom
        else:
            try:
                accumulated = accumulated.union(geom).make_valid()
            except Exception:
                accumulated = accumulated.union(geom)
        if not geom.is_empty:
            clean_rows.append({"categoria": cat, "geometry": geom})
    import geopandas as _gpd
    diss = _gpd.GeoDataFrame(clean_rows, crs="EPSG:4326")

    print(f"Simplificación final {POST_SIMPLIFY}°...")
    diss["geometry"] = diss.geometry.simplify(POST_SIMPLIFY, preserve_topology=True)
    diss["geometry"] = diss.geometry.make_valid()
    diss = diss[~diss.geometry.is_empty].copy()
    diss["etiqueta"] = diss["categoria"].map(ETIQUETAS)

    out = ASSETS / "vegetacion_galicia.geojson"
    out.unlink(missing_ok=True)
    diss[["categoria", "etiqueta", "geometry"]].to_file(out, driver="GeoJSON")
    kb = out.stat().st_size / 1024
    print(f"  {len(diss)} categorías -> {out.name} ({kb:.0f} KB)")

    PROC.mkdir(parents=True, exist_ok=True)
    (PROC / "vegetacion_galicia.geojson").unlink(missing_ok=True)
    diss[["categoria", "etiqueta", "geometry"]].to_file(
        PROC / "vegetacion_galicia.geojson", driver="GeoJSON"
    )

    print()
    print("Distribución de superficie por categoría (km²):")
    g_eq = g.to_crs(25829).copy()
    g_eq["categoria"] = g["categoria"].values
    superficie = (
        g_eq.assign(km2=g_eq.geometry.area / 1_000_000)
        .groupby("categoria")["km2"]
        .sum()
        .sort_values(ascending=False)
    )
    total = superficie.sum()
    for cat, km2 in superficie.items():
        pct = 100 * km2 / total if total else 0
        print(f"  {ETIQUETAS.get(cat, cat):<28} {km2:>9,.0f} km²  ({pct:.1f}%)")


if __name__ == "__main__":
    main()
