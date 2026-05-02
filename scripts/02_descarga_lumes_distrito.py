"""Descarga las hojas anuales oficiais "Lumes-AAAA-por-Distrito" da Consellería do Medio Rural.

Son las estadísticas oficiais da Xunta a nivel distrito forestal. Cubren 2018-2025 en
formato XLSX descargable directo. Quédanse en data/raw/medio_rural/ (versionado é opcional,
de momento gitignored xunto co resto de raw).

Para 2016-2017 só hai PDF; só os indexamos pero non se descargan automáticamente aquí.
"""

from __future__ import annotations

import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "data" / "raw" / "medio_rural"
DEST.mkdir(parents=True, exist_ok=True)

URLS = {
    2025: "https://mediorural.xunta.gal/sites/default/files/estatisticas/2025/Lumes-2025-por-Distrito.xlsx",
    2024: "https://mediorural.xunta.gal/sites/default/files/estatisticas/2024/Lumes-2024-por-Distrito.xlsx",
    2023: "https://mediorural.xunta.gal/sites/default/files/estatisticas/2023/lumes-2023-por-distrito.xlsx",
    2022: "https://mediorural.xunta.gal/sites/default/files/estatisticas/2021/Lumes_2022_por_Distrito.xlsx",
    2021: "https://mediorural.xunta.gal/sites/default/files/estatisticas/2021/Lumes_2021_por_Distrito.xlsx",
    2020: "https://mediorural.xunta.gal/sites/default/files/estatisticas/2020/Lumes_2020_por_Distrito.xlsx",
    2019: "https://mediorural.xunta.gal/sites/default/files/estatisticas/2019/Lumes_2019_por_Distrito.xlsx",
    2018: "https://mediorural.xunta.gal/sites/default/files/estatisticas/2018/Lumes_2018_por_Distrito.xlsx",
}


def main() -> None:
    for ano, url in URLS.items():
        out = DEST / f"lumes_{ano}.xlsx"
        if out.exists() and out.stat().st_size > 1000:
            print(f"  {ano}: xa descargado ({out.stat().st_size:,} bytes)")
            continue
        print(f"  {ano}: descargando...")
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as resp, open(out, "wb") as f:
            f.write(resp.read())
        print(f"  {ano}: {out.stat().st_size:,} bytes -> {out.name}")


if __name__ == "__main__":
    main()
