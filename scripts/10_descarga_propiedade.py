"""Descarga as capas vectoriais necesarias para o capítulo de propiedade do monte.

Capas:
- **Parroquias** (1:25.000, 2021): Centro de Descargas da Xunta, IET. Inclúe poboación
  do Padrón 2019 nos atributos. Polígonos das parroquias galegas.
- **MVMC** (Montes Veciñais en Man Común, marzo 2024): Oficina Virtual do Medio Rural,
  Xunta de Galicia. Polígonos dos montes clasificados como veciñais en man común.
  © Xunta de Galicia, uso non comercial.

As dúas se distribúen como ZIP que contén un Shapefile en ETRS89/UTM 29N. Quedan
en data/raw/propiedade/ (gitignored, ~50 MB).
"""

from __future__ import annotations

import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "data" / "raw" / "propiedade"
DEST.mkdir(parents=True, exist_ok=True)

FONTES = {
    "parroquias": (
        "https://visorgis.cmati.xunta.es/cdix/descargas/visor_basico/Parroquias.zip",
        "parroquias.zip",
    ),
    "mvmc": (
        "https://ovmediorural.xunta.gal/sites/default/files/Situacion_Localizacion_MVMC_MARZO_2024.zip",
        "mvmc.zip",
    ),
}


def descarga(url: str, destino: Path) -> None:
    if destino.exists() and destino.stat().st_size > 1000:
        print(f"  xa descargado ({destino.stat().st_size:,} bytes): {destino.name}")
        return
    print(f"  descargando {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as resp, open(destino, "wb") as f:
        f.write(resp.read())
    print(f"  {destino.stat().st_size:,} bytes -> {destino.name}")


def descomprime(zip_path: Path, subdir: str) -> None:
    out = DEST / subdir
    if out.exists() and any(out.iterdir()):
        return
    out.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path) as zf:
        zf.extractall(out)
    print(f"  descomprimido en {out}")


def main() -> None:
    for nome, (url, fname) in FONTES.items():
        zip_path = DEST / fname
        descarga(url, zip_path)
        descomprime(zip_path, nome)


if __name__ == "__main__":
    main()
