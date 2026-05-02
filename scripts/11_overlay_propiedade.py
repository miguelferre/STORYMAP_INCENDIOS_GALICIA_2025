"""Cruza as 1.478 entradas PrazaGal 2025 coas parroquias galegas e a capa MVMC.

Para cada parroquia con incendios PrazaGal 2025:
- Calcula a fracción de superficie clasificada como MVMC.
- Estima a exposición do lume sobre MVMC asumindo distribución proporcional dentro da
  parroquia: `ha_mvmc_est = ha_quemadas × fracción_mvmc`. É unha aproximación honesta
  á escala parroquial (sen perímetros precisos do incendio, é o máximo posible).

Saídas:
- `data/processed/propiedade_parroquia.geojson` (parroquias afectadas, EPSG:4326,
  xeometría simplificada para servir en web).
- `data/processed/propiedade_resumo.json` (totais Galicia + incendios 2025).

Notas:
- Empate texto-a-texto entre PrazaGal e o shapefile usando normalización ASCII +
  lowercase de (CONCELLO, PARROQUIA). Caso medio: ~95% match.
- Fila orfas de PrazaGal sen parroquia identificable son listadas para inspección.
"""

from __future__ import annotations

import json
import sys
import unicodedata
from pathlib import Path

import geopandas as gpd
import pandas as pd

sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "propiedade"
PROC = ROOT / "data" / "processed"


ARTIGOS = {"a", "o", "as", "os", "la", "el", "las", "los"}


def normaliza(s: object) -> str:
    if not isinstance(s, str):
        return ""
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii").lower()
    s = s.replace(",", " ").replace("(", " ").replace(")", " ").replace("'", " ")
    tokens = [t for t in s.split() if t]
    while tokens and tokens[0] in ARTIGOS:
        tokens.pop(0)
    while tokens and tokens[-1] in ARTIGOS:
        tokens.pop()
    return "".join("".join(c for c in t if c.isalnum()) for t in tokens)


def main() -> None:
    print("Cargando parroquias...")
    par = gpd.read_file(RAW / "parroquias" / "Parroquias.shp").to_crs(25829)
    par["area_ha"] = par.geometry.area / 10000
    par["key"] = par["CONCELLO"].map(normaliza) + "|" + par["PARROQUIA"].map(normaliza)

    print("Cargando MVMC e calculando overlay (pode tardar)...")
    mvmc = gpd.read_file(RAW / "mvmc" / "Situacion_Localizacion_MVMC_MARZO_2024.shp").to_crs(25829)
    par["geometry"] = par.geometry.make_valid()
    mvmc["geometry"] = mvmc.geometry.make_valid()
    par_mvmc = par[["CODPARRO", "geometry"]].copy()
    inter = gpd.overlay(par_mvmc, mvmc[["geometry"]], how="intersection", keep_geom_type=True)
    inter["mvmc_ha"] = inter.geometry.area / 10000
    mvmc_por_parr = inter.groupby("CODPARRO")["mvmc_ha"].sum().reset_index()
    par = par.merge(mvmc_por_parr, on="CODPARRO", how="left")
    par["mvmc_ha"] = par["mvmc_ha"].fillna(0)
    par["mvmc_pct"] = par["mvmc_ha"] / par["area_ha"] * 100

    print("Cruzando con PrazaGal...")
    prz = pd.read_csv(PROC / "prazagal_2025.csv")
    prz["key"] = prz["concello"].map(normaliza) + "|" + prz["parroquia"].map(normaliza)
    agg = (
        prz.groupby("key")
        .agg(incendios=("hectareas", "count"), ha_quemadas=("hectareas", "sum"))
        .reset_index()
    )

    keys_par = set(par["key"])
    sen_match = agg[~agg["key"].isin(keys_par)]
    if len(sen_match) > 0:
        ha_orfa = sen_match["ha_quemadas"].sum()
        print(f"  AVISO: {len(sen_match)} chaves PrazaGal sen parroquia ({ha_orfa:.0f} ha orfas)")
        print(sen_match.head(5).to_string(index=False))
    pct_match = (1 - len(sen_match) / len(agg)) * 100
    print(f"  Match: {len(agg) - len(sen_match)}/{len(agg)} ({pct_match:.1f}%)")

    par = par.merge(agg, on="key", how="left")
    par["incendios"] = par["incendios"].fillna(0).astype(int)
    par["ha_quemadas"] = par["ha_quemadas"].fillna(0)
    par["ha_mvmc_est"] = par["ha_quemadas"] * par["mvmc_pct"] / 100
    par["ha_non_mvmc_est"] = par["ha_quemadas"] - par["ha_mvmc_est"]

    # GeoJSON 1 — Galicia agregada por concello (contexto coroplético lixeiro).
    # Disolve as parroquias por (CODCONC, CONCELLO) e suma área e MVMC.
    par_4326 = par.to_crs(4326)
    conc = (
        par_4326.dissolve(by="CODCONC", aggfunc={"CONCELLO": "first", "area_ha": "sum",
                                                  "mvmc_ha": "sum", "ha_quemadas": "sum"})
        .reset_index()
    )
    conc["mvmc_pct"] = (conc["mvmc_ha"] / conc["area_ha"] * 100).round(1)
    conc["ha_quemadas"] = conc["ha_quemadas"].round(1)
    conc["geometry"] = conc.geometry.simplify(0.002, preserve_topology=True)
    out_galicia = PROC / "propiedade_galicia.geojson"
    out_galicia.unlink(missing_ok=True)
    conc[["CODCONC", "CONCELLO", "mvmc_pct", "ha_quemadas", "geometry"]].to_file(
        out_galicia, driver="GeoJSON"
    )
    print(f"GeoJSON Galicia (concellos): {len(conc)} -> {out_galicia.name} "
          f"({out_galicia.stat().st_size/1024:.0f} KB)")

    # JSON 2 — só centroides das parroquias afectadas (puntos para superpoñer no mapa).
    afect = par[par["incendios"] > 0].copy().to_crs(4326)
    afect["lon"] = afect.geometry.centroid.x.round(4)
    afect["lat"] = afect.geometry.centroid.y.round(4)
    centroides = afect[
        ["CODPARRO", "CONCELLO", "PARROQUIA", "lon", "lat", "mvmc_pct",
         "incendios", "ha_quemadas", "ha_mvmc_est"]
    ].copy()
    for c in ("mvmc_pct", "ha_quemadas", "ha_mvmc_est"):
        centroides[c] = centroides[c].round(2)
    out_pts = PROC / "propiedade_puntos.json"
    centroides.to_json(out_pts, orient="records", force_ascii=False)
    print(f"JSON puntos: {len(centroides)} centroides -> {out_pts.name} "
          f"({out_pts.stat().st_size/1024:.0f} KB)")
    # Limpa o GeoJSON antigo se segue presente.
    (PROC / "propiedade_parroquia.geojson").unlink(missing_ok=True)

    total_galicia_ha = par["area_ha"].sum()
    total_mvmc_galicia_ha = par["mvmc_ha"].sum()
    total_ha_quemadas = par["ha_quemadas"].sum()
    total_mvmc_quemadas = par["ha_mvmc_est"].sum()

    top_parr = (
        afect.sort_values("ha_mvmc_est", ascending=False)
        .head(10)[["CONCELLO", "PARROQUIA", "mvmc_pct", "ha_quemadas", "ha_mvmc_est"]]
        .to_dict("records")
    )
    resumo = {
        "galicia": {
            "parroquias": int(len(par)),
            "area_total_ha": round(total_galicia_ha, 1),
            "area_mvmc_ha": round(total_mvmc_galicia_ha, 1),
            "pct_mvmc_galicia": round(total_mvmc_galicia_ha / total_galicia_ha * 100, 2),
        },
        "incendios_2025": {
            "parroquias_afectadas": int((par["incendios"] > 0).sum()),
            "incendios_total": int(par["incendios"].sum()),
            "ha_quemadas_total": round(total_ha_quemadas, 1),
            "ha_estimadas_mvmc": round(total_mvmc_quemadas, 1),
            "ha_estimadas_non_mvmc": round(total_ha_quemadas - total_mvmc_quemadas, 1),
            "pct_quemadas_mvmc_estimado": (
                round(total_mvmc_quemadas / total_ha_quemadas * 100, 2)
                if total_ha_quemadas > 0
                else 0
            ),
            "match_prazagal_pct": round(pct_match, 2),
            "ha_orfas_sen_match": round(sen_match["ha_quemadas"].sum() if len(sen_match) else 0, 1),
        },
        "top_parroquias_mvmc_quemadas": top_parr,
    }
    out_json = PROC / "propiedade_resumo.json"
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(resumo, f, ensure_ascii=False, indent=2)
    print(json.dumps(resumo["galicia"], ensure_ascii=False, indent=2))
    print(json.dumps(resumo["incendios_2025"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
