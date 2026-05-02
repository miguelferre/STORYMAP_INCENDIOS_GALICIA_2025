"""Reclasifica o Mapa de Usos do Solo (IET-Xunta 2011, escala 1:250k) a 8 categorías
divulgativas e exporta un GeoJSON ligero para o storymap.

As 20 categorías nativas da columna LENDA25 redúcense a:
  1. Frondosas autóctonas (caducifolias)
  2. Eucalipto (puro + mestura con coníferas)
  3. Piñeiro / coníferas
  4. Mato (matorral)
  5. Mixto arbóreo (mestura de especies arbóreas)
  6. Agrícola e mosaicos rurais
  7. Urbano e artificial
  8. Auga e outros (humidais, costa, extracción)

Faise dissolve por categoría e simplifícase a 0,001° (~110 m) para reducir peso.
Saída: assets/data/vegetacion_galicia.geojson + data/processed/ copia.
"""

from __future__ import annotations

import sys
from pathlib import Path

import geopandas as gpd

sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "vegetacion" / "uso_25" / "USO_A_25.shp"
PROC = ROOT / "data" / "processed"
ASSETS = ROOT / "assets" / "data"

MAPEO = {
    # Bosque autóctono = frondosas caducifolias + mestura natural arbórea
    "Especies caducifolias": "autoctono",
    "Mestura de especies arbóreas": "autoctono",
    "Mato e especies arbóreas": "autoctono",
    # Plantacións = eucalipto + coníferas (incluso mestura), narrativamente
    # son a peza clave do combustible forestal galego.
    "Eucalipto": "plantacion",
    "Eucalipto e coníferas": "plantacion",
    "Coníferas": "plantacion",
    # Matorral natural
    "Mato": "mato",
    "Mato e rochedo": "mato",
    # Agrario + urbano + outros (auga, humidais, praias, extracción) = non monte combustible
    "Cultivos e prados": "agrario_outros",
    "Mosaico de cultivos e especies arbóreas": "agrario_outros",
    "Mosaico de agrícola e mato": "agrario_outros",
    "Mosaico agrícola e urbano": "agrario_outros",
    "Viñedo e cultivos leñosos": "agrario_outros",
    "Coberturas artificiais": "agrario_outros",
    "Zonas urbanas": "agrario_outros",
    "Zonas de extracción ou vertido": "agrario_outros",
    "Augas cotinentais": "agrario_outros",
    "Augas mariñas": "agrario_outros",
    "Humidais": "agrario_outros",
    "Praias e cantís": "agrario_outros",
}

ETIQUETAS = {
    "autoctono": "Bosque autóctono",
    "plantacion": "Plantacións (eucalipto, coníferas)",
    "mato": "Matorral",
    "agrario_outros": "Agrario, urbano e outros",
}


def main() -> None:
    print("Cargando shapefile...")
    g = gpd.read_file(RAW)
    print(f"  {len(g):,} teselas cargadas")
    g["categoria"] = g["LENDA25"].map(MAPEO)
    sen_match = g[g["categoria"].isna()]["LENDA25"].unique().tolist()
    if sen_match:
        print(f"  AVISO categorías sen mapeo: {sen_match}")
        g["categoria"] = g["categoria"].fillna("outros")

    print("make_valid (en EPSG:25829 para filtrar por área en m²)...")
    g["geometry"] = g.geometry.make_valid()
    g["area_m2"] = g.geometry.area

    # Filtra teselas pequenas (<100 ha = 1 km²) — son ruído visual no mapa de Galicia
    # e disparan o peso do GeoJSON. As 30k teselas redúcense a ~6k mantendo a
    # silueta xeral de cada categoría.
    g = g[g["area_m2"] >= 1_000_000].copy()
    print(f"  {len(g):,} teselas tras filtrar <100 ha")

    g = g.to_crs(4326)

    print("Dissolve por categoría...")
    diss = g[["categoria", "geometry"]].dissolve(by="categoria").reset_index()

    print("Simplificación 0.004° (~440 m)...")
    diss["geometry"] = diss.geometry.simplify(0.004, preserve_topology=True)
    diss["etiqueta"] = diss["categoria"].map(ETIQUETAS)

    out = ASSETS / "vegetacion_galicia.geojson"
    out.unlink(missing_ok=True)
    diss[["categoria", "etiqueta", "geometry"]].to_file(out, driver="GeoJSON")
    print(f"  {len(diss)} categorías -> {out.name} ({out.stat().st_size/1024:.0f} KB)")
    # copia tamén a data/processed/ para coherencia con outros scripts
    PROC.mkdir(parents=True, exist_ok=True)
    (PROC / "vegetacion_galicia.geojson").unlink(missing_ok=True)
    diss[["categoria", "etiqueta", "geometry"]].to_file(
        PROC / "vegetacion_galicia.geojson", driver="GeoJSON"
    )

    print()
    print("Distribución de superficie por categoría (km²):")
    g_eq = g.to_crs(25829)
    g_eq["categoria"] = g["categoria"].values
    superficie = (
        g_eq.assign(km2=g_eq.geometry.area / 1_000_000)
        .groupby("categoria")["km2"]
        .sum()
        .sort_values(ascending=False)
    )
    for cat, km2 in superficie.items():
        print(f"  {ETIQUETAS.get(cat, cat):<28} {km2:>9,.0f} km²")


if __name__ == "__main__":
    main()
