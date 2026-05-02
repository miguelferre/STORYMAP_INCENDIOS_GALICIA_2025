"""Constrúe o JSON que alimenta a gráfica de tendencias do storymap.

Combina:
  - Serie oficial Xunta (Consellería do Medio Rural) 2018-2025
  - Serie EFFIS (detección satelital) 2016-2025, do CSV existente no repo

Saída: data/processed/tendencia_serie.json

A gráfica vive en /assets/charts/serie_incendios.js (Observable Plot).
"""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "processed"


def main() -> None:
    oficial = pd.read_csv(OUT / "serie_galicia_oficial.csv")
    effis = pd.read_csv(ROOT / "assets" / "Resumen_anual_de_incendios_en_Galicia.csv")
    effis = effis.rename(
        columns={"YEAR": "ano", "num_incendios": "num", "area_total_ha": "ha"}
    )

    serie = []
    for _, row in oficial.iterrows():
        serie.append(
            {
                "ano": int(row["ano"]),
                "fonte": "oficial",
                "num_incendios": int(row["num_incendios"]),
                "ha_total": float(row["ha_total"]),
            }
        )
    for _, row in effis.iterrows():
        serie.append(
            {
                "ano": int(row["ano"]),
                "fonte": "satelital",
                "num_incendios": int(row["num"]),
                "ha_total": float(row["ha"]),
            }
        )

    payload = {
        "metadatos": {
            "titulo": "Incendios en Galicia: dato oficial fronte a detección satelital",
            "fontes": [
                {
                    "id": "oficial",
                    "nome": "Xunta de Galicia · Consellería do Medio Rural",
                    "detalle": "Lumes-AAAA-por-Distrito (estatísticas oficiais)",
                    "url": "https://mediorural.xunta.gal/es/recursos/estadisticas/estadisticas-forestales/incendios-forestales",
                    "cobertura": "2018-2025",
                },
                {
                    "id": "satelital",
                    "nome": "Copernicus EFFIS",
                    "detalle": "Burned Area satelital (Sentinel-2)",
                    "url": "https://forest-fire.emergency.copernicus.eu/",
                    "cobertura": "2016-2025",
                },
            ],
            "nota": (
                "EFFIS só detecta incendios visibles por satélite (en xeral, >30 ha). "
                "O dato oficial inclúe os pequenos e curtos, que son a maioría."
            ),
        },
        "serie": sorted(serie, key=lambda r: (r["ano"], r["fonte"])),
    }

    with open(OUT / "tendencia_serie.json", "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    # Tamén deixamos unha copia servida desde assets/, que é a que carga o navegador.
    served = ROOT / "assets" / "data" / "tendencia_serie.json"
    served.parent.mkdir(parents=True, exist_ok=True)
    with open(served, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    df = pd.DataFrame(payload["serie"])
    pivote = df.pivot(index="ano", columns="fonte", values="num_incendios").fillna(0).astype(int)
    pivote["razon"] = (pivote.get("oficial", 0) / pivote.get("satelital", 1)).round(1)
    print("Comparativa nº incendios (oficial / satelital):")
    print(pivote.to_string())


if __name__ == "__main__":
    main()
