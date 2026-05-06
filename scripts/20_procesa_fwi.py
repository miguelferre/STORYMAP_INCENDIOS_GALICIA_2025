"""Procesa el NetCDF de FWI y genera dos salidas para el storymap.

Entradas:
  data/raw/fwi/fwi_galicia_agosto2025.nc

Salidas:
  assets/data/fwi_serie.json   — serie diaria de FWI medio sobre Galicia,
                                  para el chart Observable Plot en el tab Clima.
  assets/fwi_pico.png          — mapa raster del FWI del día pico (12 ago),
                                  georeferenciado para overlay en Mapbox.
"""

from __future__ import annotations

import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import numpy as np
import xarray as xr

RAW = Path(__file__).parent.parent / "data" / "raw" / "fwi" / "fwi_galicia_agosto2025.nc"
ASSETS_DATA = Path(__file__).parent.parent / "assets" / "data"
ASSETS_IMGS = Path(__file__).parent.parent / "assets"

ASSETS_DATA.mkdir(parents=True, exist_ok=True)

# Día pico del evento
PICO = "2025-08-12"

# Paleta FWI: verde → amarillo → naranja → rojo → violeta
# Categorías estándar EFFIS: Muy bajo / Bajo / Moderado / Alto / Muy alto / Extremo
FWI_BOUNDS = [0, 5.2, 11.2, 21.3, 38.0, 50.0, 200]
FWI_COLORS = ["#1a9641", "#a6d96a", "#ffffbf", "#fdae61", "#f46d43", "#a50026"]
FWI_LABELS = ["Muy bajo", "Bajo", "Moderado", "Alto", "Muy alto", "Extremo"]


def cargar(path: Path) -> xr.Dataset:
    ds = xr.open_dataset(path)
    # Normalizar nombre de variable (puede ser 'fwi' o 'fire_weather_index')
    for var_candidate in ["fwi", "fire_weather_index", "FWI"]:
        if var_candidate in ds:
            return ds.rename({var_candidate: "fwi"})
    # Si no hay match exacto, usar la primera variable no-coord
    data_vars = list(ds.data_vars)
    print(f"Variables en el NetCDF: {data_vars}")
    return ds.rename({data_vars[0]: "fwi"})


def serie_json(ds: xr.Dataset) -> None:
    """Media espacial diaria de FWI sobre la bbox → JSON para el chart."""
    fwi_diario = ds["fwi"].mean(dim=["latitude", "longitude"])

    registros = []
    for t in fwi_diario.time.values:
        fecha = str(t)[:10]
        valor = float(fwi_diario.sel(time=t).values)
        registros.append({"fecha": fecha, "fwi": round(valor, 2)})

    out = ASSETS_DATA / "fwi_serie.json"
    out.write_text(json.dumps(registros, ensure_ascii=False), encoding="utf-8")
    print(f"Serie JSON → {out} ({len(registros)} días)")


def mapa_pico_png(ds: xr.Dataset) -> None:
    """Mapa PNG del FWI en el día pico para overlay raster en Mapbox."""
    try:
        fwi_pico = ds["fwi"].sel(time=PICO, method="nearest")
    except Exception:
        # Fallback: primer tiempo disponible
        fwi_pico = ds["fwi"].isel(time=0)
        print(f"Aviso: no se encontró {PICO}, usando primer timestep disponible.")

    lons = fwi_pico.longitude.values if "longitude" in fwi_pico.coords else fwi_pico.lon.values
    lats = fwi_pico.latitude.values if "latitude" in fwi_pico.coords else fwi_pico.lat.values
    datos = fwi_pico.values

    # Orientar norte-arriba
    if lats[0] < lats[-1]:
        datos = datos[::-1, :]
        lats = lats[::-1]

    cmap = mcolors.LinearSegmentedColormap.from_list(
        "fwi", list(zip(np.array(FWI_BOUNDS[:-1]) / FWI_BOUNDS[-2], FWI_COLORS))
    )
    norm = mcolors.BoundaryNorm(FWI_BOUNDS, cmap.N)

    fig, ax = plt.subplots(figsize=(8, 6), dpi=150)
    ax.imshow(
        datos,
        extent=[lons.min(), lons.max(), lats.min(), lats.max()],
        cmap=cmap,
        norm=norm,
        origin="upper",
        aspect="auto",
        interpolation="bilinear",
    )
    ax.axis("off")
    fig.patch.set_alpha(0)
    ax.patch.set_alpha(0)
    fig.subplots_adjust(left=0, right=1, top=1, bottom=0)

    out = ASSETS_IMGS / "fwi_pico.png"
    fig.savefig(out, dpi=150, bbox_inches="tight", pad_inches=0, transparent=True)
    plt.close(fig)
    print(f"Mapa PNG → {out}")

    # Guardar bbox para el overlay Mapbox
    bbox = {
        "coordinates": [
            [float(lons.min()), float(lats.max())],  # top-left
            [float(lons.max()), float(lats.max())],  # top-right
            [float(lons.max()), float(lats.min())],  # bottom-right
            [float(lons.min()), float(lats.min())],  # bottom-left
        ],
        "fecha": PICO,
        "variable": "fire_weather_index",
    }
    bbox_out = ASSETS_DATA / "fwi_pico_bbox.json"
    bbox_out.write_text(json.dumps(bbox, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"BBox JSON → {bbox_out}")


def main() -> None:
    if not RAW.exists():
        print(f"No se encontró {RAW}. Ejecuta primero 19_descarga_fwi.py")
        return

    ds = cargar(RAW)
    print(f"Dataset cargado: {dict(ds.dims)}")
    print(f"Período: {str(ds.time.values[0])[:10]} → {str(ds.time.values[-1])[:10]}")
    print(f"FWI range: {float(ds['fwi'].min()):.1f} – {float(ds['fwi'].max()):.1f}")

    serie_json(ds)
    mapa_pico_png(ds)
    ds.close()


if __name__ == "__main__":
    main()
