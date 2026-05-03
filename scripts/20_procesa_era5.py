"""Procesa ERA5 horario → agregados diarios → JSON para el chart de clima.

Entrada:  data/raw/era5/era5_galicia_agosto2025.nc
Salidas:
  assets/data/era5_agosto2025.json  — serie diaria para Observable Plot
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import xarray as xr

ERA5_DIR = Path(__file__).parent.parent / "data" / "raw" / "era5"
RAW_INSTANT = ERA5_DIR / "data_stream-oper_stepType-instant.nc"
RAW_ACCUM   = ERA5_DIR / "data_stream-oper_stepType-accum.nc"
OUT_JSON = Path(__file__).parent.parent / "assets" / "data" / "era5_agosto2025.json"


def kelvin_a_celsius(k: float) -> float:
    return round(k - 273.15, 1)


def main() -> None:
    if not RAW_INSTANT.exists():
        print(f"No encontrado: {RAW_INSTANT}\nEjecuta primero 19_descarga_era5_agosto.py")
        return

    ds_i = xr.open_dataset(RAW_INSTANT)   # t2m, u10, v10
    ds_a = xr.open_dataset(RAW_ACCUM)     # tp (acumulada)
    ds = xr.merge([ds_i, ds_a])
    print("Variables:", list(ds.data_vars))
    print("Dims:", dict(ds.sizes))

    # Media espacial sobre la bbox (Galicia completa)
    # Detectar nombre de dimensiones espaciales
    spa = [d for d in ds.dims if d not in ("valid_time", "time", "step", "number")]
    t2m = ds["t2m"].mean(dim=spa)
    tp  = ds["tp"].mean(dim=spa)
    u10 = ds["u10"].mean(dim=spa)
    v10 = ds["v10"].mean(dim=spa)

    # Velocidad del viento (m/s)
    ws = np.sqrt(u10 ** 2 + v10 ** 2)

    registros = []
    tiempo = t2m.coords["valid_time"].values
    for fecha in np.unique(tiempo.astype("datetime64[D]")):
        mask = tiempo.astype("datetime64[D]") == fecha
        fecha_str = str(fecha)

        tmax = kelvin_a_celsius(float(t2m.values[mask].max()))
        tmin = kelvin_a_celsius(float(t2m.values[mask].min()))
        tmedia = kelvin_a_celsius(float(t2m.values[mask].mean()))
        # ERA5 tp es acumulado desde medianoche: el total diario = suma de incrementos horarios
        precip_mm = round(float(tp.values[mask].sum()) * 1000, 2)
        viento_ms = round(float(ws.values[mask].mean()), 1)

        registros.append({
            "fecha": fecha_str,
            "tmax": tmax,
            "tmin": tmin,
            "tmedia": tmedia,
            "precip_mm": max(precip_mm, 0),
            "viento_ms": viento_ms,
        })

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(registros, ensure_ascii=False, indent=2), encoding="utf-8")
    ds_i.close(); ds_a.close()

    print(f"\nJSON → {OUT_JSON} ({len(registros)} días)")
    print("Muestra:")
    for r in registros[10:14]:
        print(f"  {r['fecha']}  Tmax={r['tmax']}°C  P={r['precip_mm']}mm  V={r['viento_ms']}m/s")


if __name__ == "__main__":
    main()
