"""Descomprime o paquete XML descargado dende o EGIF (servicio.mapa.gob.es).

Entrada esperada en `data/raw/egif_ourense/Xml_*.zip` (entrega anidada do
portal: un ZIP que contén dous ZIPs, cada un cun XML grande). Saída plana:
`data/raw/egif_ourense/Xml_*_<n>.xml`.

Idempotente: se os XMLs xa están extraídos, sáltase a operación.
"""

from __future__ import annotations

import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "data" / "raw" / "egif_ourense"


def descomprime(zip_path: Path, dest: Path) -> list[Path]:
    saidas = []
    with zipfile.ZipFile(zip_path) as zf:
        for nome in zf.namelist():
            if nome.endswith(".xml"):
                destino = dest / Path(nome).name
                if not destino.exists():
                    with zf.open(nome) as src, open(destino, "wb") as out:
                        out.write(src.read())
                saidas.append(destino)
            elif nome.endswith(".zip"):
                destino = dest / Path(nome).name
                if not destino.exists():
                    with zf.open(nome) as src, open(destino, "wb") as out:
                        out.write(src.read())
                # recursión
                saidas.extend(descomprime(destino, dest))
    return saidas


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    zips = sorted(DEST.glob("Xml_*.zip"))
    if not zips:
        # Tamén toleramos que veña no directorio raíz do proxecto.
        zips = sorted(ROOT.parent.glob("Xml_*.zip"))
    if not zips:
        raise SystemExit("Non se atopa ningún Xml_*.zip — descarga o paquete EGIF a data/raw/egif_ourense/")

    xmls = []
    for zp in zips:
        xmls.extend(descomprime(zp, DEST))

    xmls = sorted({p for p in xmls if p.suffix == ".xml"})
    print(f"XMLs dispoñibles ({len(xmls)}):")
    for p in xmls:
        print(f"  {p}  ({p.stat().st_size/1024/1024:.1f} MB)")


if __name__ == "__main__":
    main()
