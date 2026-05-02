"""Descarga o Mapa de Usos do Solo de Galicia (IET, Xunta) escala 1:250.000.

Fonte: Centro de Descargas da Xunta — Instituto de Estudos do Territorio. Substitúe
a capa SERGAS USOURENSE actual, que carecía de ano de referencia. Esta cartografía
ten ano declarado (xuño 2011) e leyenda LENDA25 con 20 categorías agrupables a
clases divulgativas (frondosas, eucaliptal, piñeiro, mato, agrícola, urbano, etc.).

Estrutura do ZIP: contén tres ZIP internos a tres escalas (1:1M, 1:500K, 1:250K).
Usamos a 1:250K (44 MB descomprimido, ~30k teselas) por dar boa resolución sen
inflar o peso web. Quedan en data/raw/vegetacion/ (gitignored).
"""

from __future__ import annotations

import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "data" / "raw" / "vegetacion"
DEST.mkdir(parents=True, exist_ok=True)

URL = "https://visorgis.cmati.xunta.es/cdix/descargas/visor_basico/usos_solo.zip"


def descarga(url: str, destino: Path) -> None:
    if destino.exists() and destino.stat().st_size > 1000:
        print(f"  xa descargado ({destino.stat().st_size:,} bytes): {destino.name}")
        return
    print(f"  descargando {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=180) as resp, open(destino, "wb") as f:
        f.write(resp.read())
    print(f"  {destino.stat().st_size:,} bytes -> {destino.name}")


def descomprime(zip_path: Path, target_dir: Path, esperado: str | None = None) -> None:
    if target_dir.exists() and any(target_dir.iterdir()):
        if esperado and (target_dir / esperado).exists():
            return
    target_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path) as zf:
        zf.extractall(target_dir)
    print(f"  descomprimido en {target_dir}")


def main() -> None:
    zip_path = DEST / "usos_solo.zip"
    descarga(URL, zip_path)
    descomprime(zip_path, DEST)  # extrae os tres ZIP internos
    interno = DEST / "USO_A_25.zip"
    descomprime(interno, DEST / "uso_25", esperado="USO_A_25.shp")


if __name__ == "__main__":
    main()
