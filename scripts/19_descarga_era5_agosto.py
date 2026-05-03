"""Descarga ERA5 horario para agosto 2025 sobre Galicia via CDS API.

Variables:
  - 2m_temperature           → temperatura máxima diaria
  - total_precipitation      → precipitación diaria acumulada
  - 10m_u_component_of_wind  → componente U del viento
  - 10m_v_component_of_wind  → componente V del viento

Período: 1-20 agosto 2025 (ventana pre-evento + pico + caída)
Área:    Galicia  N=43.8  W=-9.4  S=41.8  E=-6.7
Resolución ERA5: ~31 km, horario → se agrega a diario en script 20.

Salida: data/raw/era5/era5_galicia_agosto2025.nc
"""

from __future__ import annotations

from pathlib import Path

import cdsapi

OUT_DIR = Path(__file__).parent.parent / "data" / "raw" / "era5"
OUT_FILE = OUT_DIR / "era5_galicia_agosto2025.nc"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if OUT_FILE.exists():
        print(f"Ya existe {OUT_FILE}, omitiendo descarga.")
        return

    client = cdsapi.Client()

    dias = [f"{d:02d}" for d in range(1, 21)]
    horas = [f"{h:02d}:00" for h in range(24)]

    print("Solicitando ERA5 a CDS (puede tardar 2-5 min)…")
    client.retrieve(
        "reanalysis-era5-single-levels",
        {
            "product_type": "reanalysis",
            "variable": [
                "2m_temperature",
                "total_precipitation",
                "10m_u_component_of_wind",
                "10m_v_component_of_wind",
            ],
            "year": "2025",
            "month": "08",
            "day": dias,
            "time": horas,
            "area": [43.8, -9.4, 41.8, -6.7],
            "format": "netcdf",
        },
        str(OUT_FILE),
    )
    print(f"Descargado → {OUT_FILE} ({OUT_FILE.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
