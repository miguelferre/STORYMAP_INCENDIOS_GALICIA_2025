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

import json
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
PROC = ROOT / "data" / "processed"


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
