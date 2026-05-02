"""Descarga o informe MITECO «Os incendios forestais en España. Decenio 2006-2015».

Este informe é a fonte real do gráfico de motivacións do storymap (que
ata agora se atribuía a unha serie 1968-2020). Pídese só unha vez: se o
PDF xa existe, sáltase a descarga.

Saída: data/raw/miteco_decenio_2006_2015.pdf
"""

from __future__ import annotations

from pathlib import Path
import urllib.request

URL = (
    "https://www.miteco.gob.es/content/dam/miteco/es/biodiversidad/"
    "temas/incendios-forestales/incendios-decenio-2006-2015_tcm30-521617.pdf"
)
DEST = Path(__file__).resolve().parents[1] / "data" / "raw" / "miteco_decenio_2006_2015.pdf"


def main() -> None:
    DEST.parent.mkdir(parents=True, exist_ok=True)
    if DEST.exists() and DEST.stat().st_size > 1_000_000:
        print(f"Xa existe: {DEST} ({DEST.stat().st_size/1024/1024:.1f} MB)")
        return
    print(f"Descargando {URL}")
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as resp, open(DEST, "wb") as f:
        f.write(resp.read())
    print(f"Gardado en {DEST} ({DEST.stat().st_size/1024/1024:.1f} MB)")


if __name__ == "__main__":
    main()
