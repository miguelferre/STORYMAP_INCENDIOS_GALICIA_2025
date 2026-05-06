"""Descarga Fire Weather Index (FWI) del CEMS vía CDS API.

Dataset: cems-fire-historical (v4.1, ERA5-based reanalysis)
Período:  1 ago – 20 ago 2025  (ventana amplia para ver contexto + pico)
Área:     Galicia bbox N=43.8 W=-9.4 S=41.8 E=-6.7
Variables: fire_weather_index, fine_fuel_moisture_code, drought_code

Salida: data/raw/fwi/fwi_galicia_agosto2025.nc
"""

from __future__ import annotations

from pathlib import Path

import cdsapi

OUT_DIR = Path(__file__).parent.parent / "data" / "raw" / "fwi"
OUT_FILE = OUT_DIR / "fwi_galicia_agosto2025.nc"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if OUT_FILE.exists():
        print(f"Ya existe {OUT_FILE}, omitiendo descarga.")
        return

    client = cdsapi.Client()

    # Días: 01-20 de agosto 2025
    days = [f"{d:02d}" for d in range(1, 21)]

    print("Solicitando FWI a CDS API…")
    client.retrieve(
        "cems-fire-historical-v1",
        {
            "product_type": "reanalysis",
            "variable": [
                "fire_weather_index",
                "fine_fuel_moisture_code",
                "drought_code",
            ],
            "year": "2025",
            "month": "08",
            "day": days,
            # CDS espera [N, W, S, E]
            "area": [43.8, -9.4, 41.8, -6.7],
            "format": "netcdf",
        },
        str(OUT_FILE),
    )
    print(f"Descargado → {OUT_FILE} ({OUT_FILE.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
