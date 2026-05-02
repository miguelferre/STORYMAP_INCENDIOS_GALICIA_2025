"""Constrúe a serie anual oficial Galicia 2018-2025 a partir dos XLSX da Consellería do Medio Rural.

Cada hoxa "Lumes-AAAA-por-Distrito.xlsx" trae:
  - fila Galicia con totais (n.º lumes, superficie arborada, superficie rasa, superficie total)
  - desagregación por provincia
  - desagregación por distrito forestal

Saída:
  data/processed/serie_galicia_oficial.csv
  data/processed/serie_galicia_oficial.json   (para o frontend Observable Plot)
  data/processed/serie_distrito_oficial.csv   (panel longo para mapa coroplético)

A partir do 2019 publican "Superficie total". No 2018 só hai arborada+rasa, así que
sumamos ambas. Para 2017 e anteriores hai PDF: aínda non se procesa neste script.
"""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "data" / "raw" / "medio_rural"
OUT = ROOT / "data" / "processed"
OUT.mkdir(parents=True, exist_ok=True)


def cabeceira(df: pd.DataFrame) -> dict[str, int]:
    """Localiza as columnas relevantes na fila de cabeceiras (a 2.ª)."""
    header_raw = df.iloc[1]
    mapping: dict[str, int] = {}
    for idx, raw in header_raw.items():
        if not isinstance(raw, str):
            continue
        val = raw.strip().lower()
        if not val:
            continue
        if "lume" in val and "n" in val:
            mapping["num"] = idx
        elif val.startswith("superficie total"):
            mapping["total"] = idx
        elif "arborada" in val:
            mapping["arborada"] = idx
        elif "rasa" in val:
            mapping["rasa"] = idx
        elif val == "provincia":
            mapping["provincia"] = idx
        elif "distrito" in val:
            mapping["distrito"] = idx
    return mapping


def le_xlsx(path: Path, ano: int) -> tuple[dict, list[dict]]:
    df = pd.read_excel(path, header=None)
    cols = cabeceira(df)
    if "num" not in cols:
        raise RuntimeError(f"Non se atoparon columnas en {path}")

    # Fila Galicia (a 3.ª, índice 2): primeira coluna = "Galicia", o resto totais.
    galicia_row = df.iloc[2]
    num = int(galicia_row[cols["num"]])
    arborada = float(galicia_row.get(cols.get("arborada", -1), 0) or 0)
    rasa = float(galicia_row.get(cols.get("rasa", -1), 0) or 0)
    total = float(galicia_row[cols["total"]]) if "total" in cols else round(arborada + rasa, 2)

    galicia_total = {
        "ano": ano,
        "num_incendios": num,
        "ha_arborada": round(arborada, 2),
        "ha_rasa": round(rasa, 2),
        "ha_total": round(total, 2),
    }

    # Detalle por distrito: filas onde a columna distrito ten valor non baleiro.
    distritos: list[dict] = []
    if "distrito" in cols:
        provincia_actual = None
        for _, row in df.iloc[3:].iterrows():
            prov = row[cols.get("provincia", -1)] if "provincia" in cols else None
            distrito = row[cols["distrito"]] if "distrito" in cols else None
            if pd.notna(prov):
                provincia_actual = str(prov).strip()
            if pd.notna(distrito) and str(distrito).strip():
                arb = row.get(cols.get("arborada", -1), 0) or 0
                ra = row.get(cols.get("rasa", -1), 0) or 0
                tot = (
                    row[cols["total"]]
                    if "total" in cols and pd.notna(row.get(cols["total"]))
                    else float(arb) + float(ra)
                )
                distritos.append(
                    {
                        "ano": ano,
                        "provincia": provincia_actual,
                        "distrito": str(distrito).strip(),
                        "num_incendios": int(row[cols["num"]]) if pd.notna(row[cols["num"]]) else 0,
                        "ha_arborada": round(float(arb), 2),
                        "ha_rasa": round(float(ra), 2),
                        "ha_total": round(float(tot), 2),
                    }
                )
    return galicia_total, distritos


def main() -> None:
    serie: list[dict] = []
    panel: list[dict] = []
    for path in sorted(SRC.glob("lumes_*.xlsx")):
        ano = int(path.stem.split("_")[1])
        gal, dist = le_xlsx(path, ano)
        serie.append(gal)
        panel.extend(dist)

    serie_df = pd.DataFrame(serie).sort_values("ano")
    serie_df.to_csv(OUT / "serie_galicia_oficial.csv", index=False)
    with open(OUT / "serie_galicia_oficial.json", "w", encoding="utf-8") as f:
        json.dump(serie_df.to_dict(orient="records"), f, ensure_ascii=False, indent=2)

    panel_df = pd.DataFrame(panel).sort_values(["ano", "provincia", "distrito"])
    panel_df.to_csv(OUT / "serie_distrito_oficial.csv", index=False)

    print("Serie oficial Galicia (Xunta de Galicia, Consellería do Medio Rural):")
    print(serie_df.to_string(index=False))
    print()
    print(f"Distritos no panel longo: {len(panel_df)} filas, {panel_df['distrito'].nunique()} distritos únicos")


if __name__ == "__main__":
    main()
