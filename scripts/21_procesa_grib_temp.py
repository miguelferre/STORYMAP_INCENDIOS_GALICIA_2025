"""Lee data.grib (ERA5 t2m mensual 1940-2025, bbox Galicia 4×6),
calcula la media espacial por mes/año y exporta temperatura y anomalía
respecto a la climatología 1991-2020.

Salida: assets/data/temperatura_mensual.json
  [{ano, mes, t_media, anomalia}]  — t en ºC, anomalia en ºC
"""
from __future__ import annotations

import json
from pathlib import Path

import cfgrib
import numpy as np
import pandas as pd

ROOT   = Path(__file__).resolve().parents[1]
GRIB   = ROOT.parent / "Desafio 2" / "data.grib"
OUT    = ROOT / "assets" / "data" / "temperatura_mensual.json"

CLIM_INI, CLIM_FIN = 1991, 2020


def main() -> None:
    ds = cfgrib.open_dataset(str(GRIB))
    t2m = ds["t2m"] - 273.15  # K → ºC

    # Media espacial sobre el bbox Galicia
    t_galicia = t2m.mean(dim=["latitude", "longitude"])

    times = pd.DatetimeIndex(ds["time"].values)
    df = pd.DataFrame({
        "ano": times.year,
        "mes": times.month,
        "t_media": t_galicia.values.astype(float),
    })

    # Climatología 1991-2020 por mes
    clim = (
        df[df["ano"].between(CLIM_INI, CLIM_FIN)]
        .groupby("mes")["t_media"]
        .mean()
    )
    df["anomalia"] = df["t_media"] - df["mes"].map(clim)

    records = [
        {
            "ano": int(r.ano),
            "mes": int(r.mes),
            "t_media": round(float(r.t_media), 2),
            "anomalia": round(float(r.anomalia), 2),
        }
        for r in df.itertuples()
    ]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(records, ensure_ascii=False), encoding="utf-8")
    print(f"Exportado: {OUT}  ({len(records)} filas)")
    print(f"Rango: {df.ano.min()}-{df.ano.max()}, anomalía máx: {df.anomalia.max():.2f}ºC")


if __name__ == "__main__":
    main()
