"""Descarga e descomprime o tile europeo do dataset SILVIS Global WUI 2020
(Schug et al. 2023, DOI 10.5281/zenodo.7941460).

Idempotente:
  - Se 'data/raw/silvis_wui/EU.zip' xa existe co MD5 oficial, salta a descarga.
  - Se o directorio 'data/raw/silvis_wui/EU/' xa existe e non está baleiro,
    salta a descompresión.

A descarga son ~1,8 GB e o ZIP non se versiona (data/raw/* está en .gitignore).
A descompresión pode ocupar varios GB.

Clases do raster (uint8):
  1 = Forest/Shrubland/Wetland-dominated Intermix WUI
  2 = Forest/Shrubland/Wetland-dominated Interface WUI
  3 = Grassland-dominated Intermix WUI
  4 = Grassland-dominated Interface WUI
  5 = Non-WUI: Forest/Shrub/Wetland-dominated
  6 = Non-WUI: Grassland-dominated
  7 = Non-WUI: Urban
  8 = Non-WUI: Other
"""

from __future__ import annotations

import hashlib
import sys
import urllib.request
from pathlib import Path
from zipfile import ZipFile

sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "silvis_wui"
ZIP_PATH = RAW / "EU.zip"
UNZIP_DIR = RAW / "EU"

URL = "https://zenodo.org/records/7941460/files/EU.zip"
MD5_EXPECTED = "6cd8533360d3453a9461f4ed9fcb666b"
EXPECTED_SIZE = 1_899_270_491


def md5_of(path: Path, chunk: int = 1024 * 1024) -> str:
    h = hashlib.md5()
    with path.open("rb") as f:
        while True:
            buf = f.read(chunk)
            if not buf:
                break
            h.update(buf)
    return h.hexdigest()


def download(url: str, dst: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "incendios-storymap/0.1"})
    with urllib.request.urlopen(req) as resp:
        total = int(resp.headers.get("Content-Length", 0))
        downloaded = 0
        chunk = 1024 * 1024
        last_pct = -1
        with dst.open("wb") as out:
            while True:
                buf = resp.read(chunk)
                if not buf:
                    break
                out.write(buf)
                downloaded += len(buf)
                if total:
                    pct = int(100 * downloaded / total)
                    if pct != last_pct and pct % 5 == 0:
                        mb = downloaded / 1024 / 1024
                        print(f"  {pct:3d}%  ({mb:>7,.0f} MB)")
                        last_pct = pct


def main() -> None:
    RAW.mkdir(parents=True, exist_ok=True)

    if ZIP_PATH.exists():
        size = ZIP_PATH.stat().st_size
        if size == EXPECTED_SIZE:
            print(f"ZIP xa existe ({size/1e9:.2f} GB), verificando MD5...")
            md5 = md5_of(ZIP_PATH)
            if md5 == MD5_EXPECTED:
                print(f"  MD5 OK ({md5}). Saltando descarga.")
            else:
                print(f"  MD5 NON coincide ({md5}). Re-descargando...")
                ZIP_PATH.unlink()
        else:
            print(f"ZIP existe pero tamaño non esperado ({size} != {EXPECTED_SIZE}). Re-descargando.")
            ZIP_PATH.unlink()

    if not ZIP_PATH.exists():
        print(f"Descargando {URL} -> {ZIP_PATH} (~1,8 GB)")
        download(URL, ZIP_PATH)
        md5 = md5_of(ZIP_PATH)
        if md5 != MD5_EXPECTED:
            raise RuntimeError(f"MD5 non coincide tras descarga: {md5} != {MD5_EXPECTED}")
        print(f"  MD5 OK ({md5}).")

    if UNZIP_DIR.exists() and any(UNZIP_DIR.iterdir()):
        print(f"Directorio xa descomprimido en {UNZIP_DIR}, omitindo unzip.")
    else:
        UNZIP_DIR.mkdir(parents=True, exist_ok=True)
        print(f"Descomprimindo en {UNZIP_DIR}...")
        with ZipFile(ZIP_PATH) as zf:
            for name in zf.namelist():
                print(f"  extraendo {name} ({zf.getinfo(name).file_size/1e6:.1f} MB)")
            zf.extractall(UNZIP_DIR)

    print()
    print("Contido final:")
    for p in sorted(RAW.rglob("*")):
        if p.is_file():
            print(f"  {p.relative_to(RAW)}  ({p.stat().st_size/1e6:,.1f} MB)")


if __name__ == "__main__":
    main()
