"""Agrega PrazaGal por día e prepara dataset para a gráfica de cronoloxía.

Saída:
- data/processed/cronoloxia_diaria.json: array de obxectos con
  {data, n_incendios, ha_total, top_concello, top_parroquia, top_ha}.
- assets/data/cronoloxia.json: copia para o frontend.

Foco: período onde hai actividade real (xullo-outubro 2025). Os 365 días
do ano enteiros teñen ruído de fondo; restrinximos a 2025-06-01 a 2025-10-31
para que o eixe temporal sexa lexible no gráfico.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pandas as pd

sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]

ROOT = Path(__file__).resolve().parents[1]
PROC = ROOT / "data" / "processed"
ASSETS = ROOT / "assets" / "data"


def main() -> None:
    df = pd.read_csv(PROC / "prazagal_2025.csv")
    df["data"] = pd.to_datetime(df["data"])
    inicio = pd.Timestamp("2025-06-01")
    fin = pd.Timestamp("2025-10-31")
    df = df[(df["data"] >= inicio) & (df["data"] <= fin)]

    # Para cada día, total + maior incendio.
    diario = (
        df.groupby("data")
        .agg(
            n_incendios=("hectareas", "count"),
            ha_total=("hectareas", "sum"),
            top_ha=("hectareas", "max"),
        )
        .reset_index()
    )

    # Incorpora o nome do incendio máis grande de cada día.
    idx_top = df.loc[df.groupby("data")["hectareas"].idxmax()].set_index("data")
    diario = diario.merge(
        idx_top[["concello", "parroquia"]].rename(
            columns={"concello": "top_concello", "parroquia": "top_parroquia"}
        ),
        left_on="data",
        right_index=True,
        how="left",
    )

    diario["data_str"] = diario["data"].dt.strftime("%Y-%m-%d")
    diario["ha_total"] = diario["ha_total"].round(1)
    diario["top_ha"] = diario["top_ha"].round(1)

    # Inclúe tamén os incendios individuais ≥100 ha do período (para destacalos
    # como puntos no scatter).
    grandes = df[df["hectareas"] >= 100].copy()
    grandes["data_str"] = grandes["data"].dt.strftime("%Y-%m-%d")
    grandes_payload = grandes[["data_str", "concello", "parroquia", "hectareas"]].to_dict("records")

    out = {
        "diario": diario[
            ["data_str", "n_incendios", "ha_total", "top_ha", "top_concello", "top_parroquia"]
        ].to_dict("records"),
        "grandes": grandes_payload,
        "totais": {
            "incendios": int(len(df)),
            "ha_total": round(float(df["hectareas"].sum()), 1),
            "dias_con_actividade": int(diario["n_incendios"].gt(0).sum()),
            "rango": [str(inicio.date()), str(fin.date())],
        },
    }
    print("Totais período:")
    print(json.dumps(out["totais"], ensure_ascii=False, indent=2))
    print(f"Incendios ≥100 ha: {len(grandes)}")
    print()
    print("Top 5 días por hectáreas:")
    for d in sorted(out["diario"], key=lambda x: -x["ha_total"])[:5]:
        print(
            f"  {d['data_str']}: {d['n_incendios']} lumes, {d['ha_total']:,.0f} ha "
            f"(top: {d['top_concello']}/{d['top_parroquia']} {d['top_ha']:,.0f} ha)"
        )

    out_proc = PROC / "cronoloxia_diaria.json"
    out_assets = ASSETS / "cronoloxia.json"
    out_proc.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    out_assets.write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    print(f"\n-> {out_proc.name} ({out_proc.stat().st_size/1024:.0f} KB)")
    print(f"-> {out_assets.name} ({out_assets.stat().st_size/1024:.0f} KB)")


if __name__ == "__main__":
    main()
