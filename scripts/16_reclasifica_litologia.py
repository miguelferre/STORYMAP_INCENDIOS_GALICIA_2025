"""Reclasifica o Mapa Xeolóxico do IGME 1:1.000.000 (1994) a 3 grupos divulgativos
para o tab "Xeoloxía" do storymap.

As ~15 unidades litolóxicas presentes en Galicia agrúpanse en:
  - acidas:        granitoides, gneisses, migmatitas, metasedimentarias siliciclásticas
                   (cuarcitas, pizarras, micaesquistos, filitas).
  - basicas:       serpentinitas, peridotitas, rochas básicas/ultrabásicas, vulcanitas
                   e tamén dolomías/calizas (carbonatadas), seguindo a agrupación
                   "rochas básicas/carbonatadas" do plan editorial.
  - sedimentarios: depósitos detríticos recentes ou pouco consolidados (gravas,
                   conglomerados con arxilas, evaporitas, formacións con carbón
                   das fosas terciarias de As Pontes / Monforte).

Pasos:
  1. Le o shapefile geopb_1000.shp (encoding latin1, EPSG:23030 = ED50 UTM30N).
  2. Reproxecta a EPSG:4326.
  3. Recorta polo perímetro de Galicia (dissolve de propiedade_galicia.geojson).
  4. Aplica o mapeo LITOLOGIA -> {acidas, basicas, sedimentarios}.
  5. Filtra polígonos minúsculos (<5 ha) que son ruído visual.
  6. Dissolve por categoría e simplifica a 0.001° (~110 m).
  7. Exporta assets/data/litologia_galicia.geojson + copia a data/processed/.

Fonte: Mapa Xeolóxico de España e Portugal 1:1.000.000 (IGME, 1994).
       https://info.igme.es/cartografiadigital/datos/geologicos1M/Geologico1000_(1994)/shapes/geologico_1000_shapes.zip
"""

from __future__ import annotations

import sys
import warnings
from pathlib import Path

import geopandas as gpd

sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
warnings.filterwarnings("ignore", category=RuntimeWarning)

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "litologia" / "geologico_1000_shapes" / "geopb_1000.shp"
GAL = ROOT / "data" / "processed" / "propiedade_galicia.geojson"
PROC = ROOT / "data" / "processed"
ASSETS = ROOT / "assets" / "data"

MAPEO_LITOLOGIA = {
    # acidas: granitoides, gneisses, migmatitas, metased siliciclásticas
    "Otros granitoides": "acidas",
    "Granitoides de dos micas": "acidas",
    "Gneisses": "acidas",
    "Migmatitas, mármoles y granitoides indiferenciados": "acidas",
    "Cuarcitas, pizarras, areniscas y calizas": "acidas",
    "Pizarras, grauwackas, cuarcitas y conglomerados": "acidas",
    "Micaesquistos, filitas, areniscas, mármoles, calizas, dolomías y margas": "acidas",
    "Areniscas, pizarras y calizas": "acidas",
    # basicas: ultramáficas, vulcanitas e carbonatadas
    "Serpentinitas y peridotitas. Rocas básicas y ultrabásicas": "basicas",
    "Vulcanitas y rocas volcanoclásticas": "basicas",
    "Dolomías, calizas y margas. Areniscas": "basicas",
    "Calizas, dolomías y margas. Areniscas y conglomerados": "basicas",
    "Calizas detríticas, calcarenitas, margas, arcillas y calizas": "basicas",
    # sedimentarios: detríticos recentes ou de fosas terciarias
    "Gravas, conglomerados, arenas y limos": "sedimentarios",
    "Areniscas, conglomerados, arcillas; calizas y evaporitas": "sedimentarios",
    "Conglomerados, areniscas, arcillas y calizas. Evaporitas": "sedimentarios",
    "Conglomerados, areniscas, calizas, yesos y arcillas versicolores": "sedimentarios",
    "Conglomerados, areniscas, pizarras y calizas. Carbón": "sedimentarios",
    "Conglomerados, areniscas y lutitas": "sedimentarios",
}

ETIQUETAS = {
    "acidas": "Rochas ácidas (granitos, esquistos)",
    "basicas": "Rochas básicas e carbonatadas",
    "sedimentarios": "Depósitos sedimentarios recentes",
}


def fallback(litologia) -> str:
    """Asigna unha categoría a litoloxías non listadas usando keywords."""
    if not isinstance(litologia, str):
        return "acidas"
    s = litologia.lower()
    if any(k in s for k in ("serpentin", "peridoti", "ultrabási", "vulcani", "volcanocl")):
        return "basicas"
    if s.startswith("dolom") or s.startswith("caliza"):
        return "basicas"
    if any(k in s for k in ("granit", "gneis", "migmati", "esquist", "filita", "cuarcit", "pizarra")):
        return "acidas"
    if any(k in s for k in ("grava", "arena", "conglomera", "evaporita", "yeso", "carbón", "arcilla", "lutita")):
        return "sedimentarios"
    return "acidas"  # default razoable para Galicia (dominio plutónico-metamórfico)


def main() -> None:
    print("Cargando shapefile IGME 1:1M...")
    # Codificación cp850 (DOS Spanish): así as letras acentuadas decoden ben
    # e as claves do dicionario MAPEO_LITOLOGIA coinciden exactamente.
    g = gpd.read_file(RAW, encoding="cp850")
    print(f"  {len(g):,} polígonos no Macizo Hespérico (España + Baleares)")
    print(f"  CRS orixinal: {g.crs}")

    g = g.to_crs(4326)

    print("Cargando perímetro de Galicia (dissolve concellos)...")
    gal = gpd.read_file(GAL).to_crs(4326)
    boundary = gal.dissolve().geometry.iloc[0]

    print("Recortando a Galicia...")
    g_gal = g[g.intersects(boundary)].copy()
    g_gal["geometry"] = g_gal.geometry.intersection(boundary)
    g_gal = g_gal[~g_gal.geometry.is_empty].copy()
    print(f"  {len(g_gal):,} polígonos en Galicia")

    print("Aplicando mapeo litoloxía -> 3 categorías...")
    g_gal["categoria"] = g_gal["LITOLOGIA"].map(MAPEO_LITOLOGIA)
    sen_match = g_gal[g_gal["categoria"].isna()]["LITOLOGIA"].dropna().unique().tolist()
    if sen_match:
        print(f"  {len(sen_match)} litoloxías sen mapeo explícito, aplicando fallback:")
        for lit in sen_match:
            cat = fallback(lit)
            print(f"    '{lit[:60]}...' -> {cat}")
        g_gal["categoria"] = g_gal["categoria"].fillna(g_gal["LITOLOGIA"].apply(fallback))

    g_gal = g_gal[g_gal["categoria"].notna()].copy()

    print("Filtrando slivers (<5 ha)...")
    g_eq = g_gal.to_crs(25829)
    g_gal["area_ha"] = g_eq.geometry.area / 10_000
    g_gal = g_gal[g_gal["area_ha"] >= 5].copy()
    print(f"  {len(g_gal):,} polígonos tras filtro")

    print("Dissolve por categoría...")
    diss = g_gal[["categoria", "geometry"]].dissolve(by="categoria").reset_index()

    print("Simplificación 0.001° (~110 m)...")
    diss["geometry"] = diss.geometry.simplify(0.001, preserve_topology=True)
    diss["etiqueta"] = diss["categoria"].map(ETIQUETAS)

    out = ASSETS / "litologia_galicia.geojson"
    out.unlink(missing_ok=True)
    diss[["categoria", "etiqueta", "geometry"]].to_file(out, driver="GeoJSON")
    print(f"  {len(diss)} categorías -> {out.name} ({out.stat().st_size/1024:.0f} KB)")

    PROC.mkdir(parents=True, exist_ok=True)
    (PROC / "litologia_galicia.geojson").unlink(missing_ok=True)
    diss[["categoria", "etiqueta", "geometry"]].to_file(
        PROC / "litologia_galicia.geojson", driver="GeoJSON"
    )

    print()
    print("Distribución de superficie por categoría (km²):")
    g_eq = g_gal.to_crs(25829)
    g_eq["categoria"] = g_gal["categoria"].values
    superficie = (
        g_eq.assign(km2=g_eq.geometry.area / 1_000_000)
        .groupby("categoria")["km2"]
        .sum()
        .sort_values(ascending=False)
    )
    total = superficie.sum()
    for cat, km2 in superficie.items():
        pct = 100 * km2 / total if total else 0
        print(f"  {ETIQUETAS.get(cat, cat):<40} {km2:>9,.0f} km²  ({pct:.1f}%)")


if __name__ == "__main__":
    main()
