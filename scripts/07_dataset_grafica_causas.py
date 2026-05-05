"""Constrúe o JSON que alimenta a gráfica de causas do storymap.

Saída:
  - data/processed/causas_ourense.json   (esquema en metadatos.notas)
  - assets/data/causas_ourense.json      (mesmo ficheiro, servido polo navegador)

Estrutura:
  {
    "metadatos": {...},
    "serie_anual": [{"ano": int, "grupo": str, "num_incendios": int, "ha_total": float}],
    "motivacions": [{"grupo_motivacion": str, "num_incendios": int, "ha_total": float, "pct": float}]
  }

Os datos veñen do EGIF (servicio.mapa.gob.es/incendios/Search/Publico),
descarga manual en formato XML para a provincia de Ourense, anos
1968–2022. Procesado por scripts 05 (descomprime) e 07 (extrae).

A gráfica vive en /assets/charts/causas.js (Observable Plot, mesmo patrón
que serie_incendios.js).
"""

from __future__ import annotations

import importlib.util
import json
from collections import defaultdict
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
PROC = ROOT / "data" / "processed"

# Importar le_pifs e MOTIVACIONS do script 06 (nome con número non é importable directo)
_spec = importlib.util.spec_from_file_location(
    "extrae_causas", Path(__file__).parent / "06_extrae_causas_egif.py"
)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
le_pifs = _mod.le_pifs
MOTIVACIONS = _mod.MOTIVACIONS

DECENIOS_ORDEN = ["1968-1979", "1980-1989", "1990-1999", "2000-2009", "2010-2022"]

# Nombres canónicos de los grupos de motivación (Unicode limpio, independiente del CSV)
GRUPOS_MOTIV = {
    "Intencionado sen motivación recoñecida": "Intencionado sen motivación recoñecida",
    "Prácticas agrícolas e gandeiras": "Prácticas agrícolas e gandeiras",
    "Caza": "Caza",
    "Vandalismo": "Vandalismo",
    "Piromanía": "Piromanía",
    "Desacordos e protestas": "Desacordos e protestas",
    "Vinganzas e disputas": "Vinganzas e disputas",
    "Propiedade": "Propiedade",
    "Beneficio económico": "Beneficio económico",
    "Outras motivacións": "Outras motivacións",
    "Forzas de orde público": "Forzas de orde público",
    "Pesca": "Outras motivacións",
    "Control de animais": "Outras motivacións",
}


def _decenio(ano: int) -> str:
    if ano < 1980:
        return "1968-1979"
    if ano < 1990:
        return "1980-1989"
    if ano < 2000:
        return "1990-1999"
    if ano < 2010:
        return "2000-2009"
    return "2010-2022"


def _grupo_motiv(idm: int, idcausa: int) -> str:
    clave = idm if (idm and idm in _mod.MOTIVACIONS) else idcausa
    raw = _mod.MOTIVACIONS.get(clave, ("Intencionado sen motivación recoñecida", ""))[0]
    # Normalizar a nombre canónico por si el XML trajo encoding roto
    for canon in GRUPOS_MOTIV:
        if raw.lower().replace("\xad", "") == canon.lower():
            return GRUPOS_MOTIV[canon]
    return GRUPOS_MOTIV.get(raw, "Outras motivacións")


def main() -> None:
    df_grupo = pd.read_csv(PROC / "causas_ourense_grupo_anual.csv")
    df_mot = pd.read_csv(PROC / "causas_ourense_motivacions.csv")

    # Reagrupamos as motivacións polos grupos do catálogo (non por etiqueta detallada)
    # para que o gráfico sexa lexible: 9 grupos máximo.
    motiv_agg = (
        df_mot.groupby("grupo_motivacion", as_index=False)[["num_incendios", "ha_total"]]
        .sum()
        .sort_values("num_incendios", ascending=False)
        .reset_index(drop=True)
    )
    total_intenc = int(motiv_agg["num_incendios"].sum())
    motiv_agg["pct"] = (motiv_agg["num_incendios"] / total_intenc * 100).round(2)
    # Filtramos motivacións testemuñais (< 0,1% do total de intencionados) para
    # que o panel non rotule liñas residuais con "0,0%".
    motiv_agg = motiv_agg[motiv_agg["pct"] >= 0.1].reset_index(drop=True)

    serie_anual = [
        {
            "ano": int(r["ano"]),
            "grupo": str(r["grupo"]),
            "num_incendios": int(r["num_incendios"]),
            "ha_total": float(round(r["ha_total"], 1)),
        }
        for _, r in df_grupo.iterrows()
    ]

    motivacions = [
        {
            "grupo_motivacion": str(r["grupo_motivacion"]),
            "num_incendios": int(r["num_incendios"]),
            "ha_total": float(round(r["ha_total"], 1)),
            "pct": float(r["pct"]),
        }
        for _, r in motiv_agg.iterrows()
    ]

    # Motivacións por decenio — lemos directamente os XML para ter o ano por PIF
    xml_dir = ROOT / "data" / "raw" / "egif_ourense"
    xml_paths = sorted(xml_dir.glob("Xml_*.xml"))
    dec_acc = defaultdict(lambda: defaultdict(lambda: {"n": 0, "ha": 0.0}))
    for anio, idcausa, idm, ha_arb, ha_no_arb in le_pifs(xml_paths):
        if not (400 <= idcausa < 500):
            continue
        dec = _decenio(anio)
        grupo_mot = _grupo_motiv(idm, idcausa)
        dec_acc[dec][grupo_mot]["n"] += 1
        dec_acc[dec][grupo_mot]["ha"] += ha_arb + ha_no_arb

    motivacions_decenio = []
    for dec in DECENIOS_ORDEN:
        grupos = dec_acc.get(dec, {})
        total_dec = sum(v["n"] for v in grupos.values()) or 1
        filas = sorted(grupos.items(), key=lambda x: -x[1]["n"])
        for grupo_mot, vals in filas:
            pct = round(vals["n"] / total_dec * 100, 2)
            if pct < 0.5:
                continue
            motivacions_decenio.append({
                "decenio": dec,
                "grupo_motivacion": grupo_mot,
                "num_incendios": vals["n"],
                "ha_total": round(vals["ha"], 1),
                "pct": pct,
            })

    payload = {
        "metadatos": {
            "titulo": "Causas dos incendios forestais en Ourense (1968-2022)",
            "rango": [int(df_grupo["ano"].min()), int(df_grupo["ano"].max())],
            "total_pifs": int(df_grupo["num_incendios"].sum()),
            "fonte": {
                "nome": "EGIF — Estadística General de Incendios Forestales",
                "organismo": "MITECO / MAPA",
                "url": "https://servicio.mapa.gob.es/incendios/Search/Publico",
                "descarga": "Exportación XML, provincia 32 (Ourense), todos os anos dispoñibles",
            },
            "metodoloxia": (
                "Cada parte de incendio inclúe un código de causa (idcausa) e, para "
                "intencionados, un código de motivación (idmotivacion). "
                "Os grupos resúmense en 5 categorías (Rayo / Negligencias e accidentes "
                "/ Intencionado / Causa descoñecida / Reproducción) e as motivacións "
                "agréganse segundo o catálogo do Comité de Lucha contra Incendios "
                "Forestales (manual EGIF v3.6, p.18). Aproximadamente o 49% dos "
                "intencionados teñen código de motivación 400 ('sen motivación recoñecida') "
                "—reflicte a dificultade habitual da investigación destes incendios."
            ),
            "esquema": {
                "serie_anual": "ano × grupo de causa (5 grupos)",
                "motivacions": "agregado de motivacións dos intencionados (8 grupos)",
            },
        },
        "serie_anual": serie_anual,
        "motivacions": motivacions,
        "motivacions_decenio": motivacions_decenio,
    }

    PROC.mkdir(parents=True, exist_ok=True)
    out_proc = PROC / "causas_ourense.json"
    out_proc.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    served = ROOT / "assets" / "data" / "causas_ourense.json"
    served.parent.mkdir(parents=True, exist_ok=True)
    served.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Gardado: {out_proc}")
    print(f"Gardado: {served}")
    print(f"Total PIFs: {payload['metadatos']['total_pifs']:,}")
    print(f"Rango: {payload['metadatos']['rango']}")
    print(f"Filas serie_anual: {len(serie_anual)}, motivacions: {len(motivacions)}")


if __name__ == "__main__":
    main()
