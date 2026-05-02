"""Carga y limpia el listado de incendios 2025 publicado por Praza.gal vía Lei de Transparencia.

Fuente: https://praza.gal/politica/todos-os-incendios-de-2025-en-galicia-liberamos-os-datos
Licencia: CC BY-NC-SA 4.0 (reconocer Praza Pública).

Salida:
  data/processed/prazagal_2025.parquet   (registro completo limpio)
  data/processed/prazagal_2025.csv       (mismo, en CSV utf-8)
  data/processed/prazagal_resumo.json    (agregados para el frontend del storymap)
"""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "data" / "raw" / "prazagal_incendios_2025.ods"
OUT = ROOT / "data" / "processed"
OUT.mkdir(parents=True, exist_ok=True)


def cargar() -> pd.DataFrame:
    df = pd.read_excel(SRC, engine="odf")
    df = df.rename(
        columns={
            "Data": "data",
            "Hora": "hora",
            "Concello": "concello",
            "Parroquia": "parroquia",
            "Hectáreas": "hectareas",
        }
    )
    # El ODS publicado por Praza.gal incluye filas vacías y un pie de fuente
    # ("Fonte: Xunta / Petición de Praza.gal..."). Las descartamos para que
    # el parseo de fecha no tropiece.
    df = df.dropna(subset=["data", "concello", "parroquia"])
    df["data"] = pd.to_datetime(df["data"]).dt.date
    df["hora"] = df["hora"].astype(str).str.slice(0, 8)
    df["concello"] = df["concello"].astype(str).str.strip()
    df["parroquia"] = df["parroquia"].astype(str).str.strip()
    df["hectareas"] = pd.to_numeric(df["hectareas"], errors="coerce").fillna(0.0)
    df["mes"] = pd.to_datetime(df["data"]).dt.month
    df["semana_ano"] = pd.to_datetime(df["data"]).dt.isocalendar().week.astype(int)
    return df


def resumo(df: pd.DataFrame) -> dict:
    serie_diaria = (
        df.groupby("data")
        .agg(num_incendios=("hectareas", "count"), hectareas=("hectareas", "sum"))
        .reset_index()
    )
    serie_diaria["data"] = serie_diaria["data"].astype(str)

    por_concello = (
        df.groupby("concello")
        .agg(num_incendios=("hectareas", "count"), hectareas=("hectareas", "sum"))
        .sort_values("hectareas", ascending=False)
        .reset_index()
    )

    por_parroquia = (
        df.groupby(["concello", "parroquia"])
        .agg(num_incendios=("hectareas", "count"), hectareas=("hectareas", "sum"))
        .sort_values("hectareas", ascending=False)
        .reset_index()
    )

    return {
        "metadata": {
            "fonte": "Praza.gal vía Lei de Transparencia (PRAZA-GAL-LT-2026)",
            "licenza": "CC BY-NC-SA 4.0",
            "url_fonte": "https://praza.gal/politica/todos-os-incendios-de-2025-en-galicia-liberamos-os-datos",
            "rexistros": int(len(df)),
            "data_minima": str(df["data"].min()),
            "data_maxima": str(df["data"].max()),
            "hectareas_totais": round(float(df["hectareas"].sum()), 2),
            "concellos_afectados": int(df["concello"].nunique()),
            "parroquias_afectadas": int(df["parroquia"].nunique()),
        },
        "serie_diaria": serie_diaria.to_dict(orient="records"),
        "top_concellos": por_concello.head(30).to_dict(orient="records"),
        "top_parroquias": por_parroquia.head(30).to_dict(orient="records"),
    }


def main() -> None:
    df = cargar()
    df.to_parquet(OUT / "prazagal_2025.parquet", index=False)
    df.to_csv(OUT / "prazagal_2025.csv", index=False, encoding="utf-8")

    payload = resumo(df)
    with open(OUT / "prazagal_resumo.json", "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"OK | {len(df)} rexistros")
    print(f"    {payload['metadata']['hectareas_totais']:,.0f} ha totais")
    print(f"    {payload['metadata']['concellos_afectados']} concellos afectados")
    print(f"    rango: {payload['metadata']['data_minima']} -> {payload['metadata']['data_maxima']}")


if __name__ == "__main__":
    main()
