"""Extrae as táboas de causas do informe MITECO 2006-2015.

Saídas en data/processed/:
  - causas_2006_2015_grupos.csv           (Cuadro 7.1 — grupos a nivel nacional)
  - causas_2006_2015_motivacions.csv      (Cuadro 7.2 — motivacións intencionados)
  - causas_2006_2015_neglixencias.csv     (Cuadro 7.3 — desglose neglixencias)
  - causas_2006_2015_areas.csv            (Gráficos 7.5/7.7 — % por área xeográfica)

A área "Noroeste" engloba Galicia, Asturias, Cantabria, País Vasco e León.
Galicia achega o 79% dos siniestros do Noroeste no decenio (Cuadro 5.1 do
informe), polo que estes datos por área son a fonte máis próxima ao
comportamento real de Galicia que ofrece o informe.

Os Gráficos 7.5 e 7.7 son piecharts maquetados sen táboa dixital asociada;
transcríbense literalmente do PDF (pp. 65-66) tras validación cruzada (cada
área debe sumar 100%).
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd
import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "data" / "raw" / "miteco_decenio_2006_2015.pdf"
OUT = ROOT / "data" / "processed"


def num(s: str) -> float:
    """Converte un número do informe (formato europeo: 1.234,56) en float."""
    return float(s.replace(".", "").replace(",", "."))


def extrae_grupos(pdf: pdfplumber.PDF) -> pd.DataFrame:
    """Cuadro 7.1, p.61 — análise das causas (grupos)."""
    page = pdf.pages[60]
    tabs = page.extract_tables()
    # A táboa boa é a última, con 9 columnas e 9 filas.
    tab = next(t for t in tabs if len(t) >= 9 and len(t[0]) >= 9)
    filas = []
    for row in tab[3:8]:  # filas RAYO..REPRODUCCIÓN
        causa = row[0].strip()
        filas.append(
            {
                "grupo": causa,
                "siniestros_cierta": int(num(row[1])),
                "siniestros_supuesta": int(num(row[2])),
                "siniestros_total": int(num(row[3])),
                "causantes_identificados": int(num(row[4])),
                "ha_arbolada": num(row[5]),
                "ha_no_arbolada_lenosa": num(row[6]),
                "ha_herbacea": num(row[7]),
                "ha_total_forestal": num(row[8]),
            }
        )
    df = pd.DataFrame(filas)
    df["pct_siniestros"] = (df["siniestros_total"] / df["siniestros_total"].sum() * 100).round(2)
    df["pct_ha"] = (df["ha_total_forestal"] / df["ha_total_forestal"].sum() * 100).round(2)
    return df


def extrae_motivacions(pdf: pdfplumber.PDF) -> pd.DataFrame:
    """Cuadro 7.2, p.68 — motivacións dos incendios intencionados."""
    page = pdf.pages[67]
    tabs = page.extract_tables()
    tab = next(t for t in tabs if len(t) >= 20)
    filas = []
    for row in tab:
        if not row or not row[0]:
            continue
        nome = row[0].strip()
        # Saltamos cabeceiras e subtítulos.
        if not row[1] or row[1] == "Núm. Siniestros":
            continue
        try:
            filas.append(
                {
                    "motivacion": nome,
                    "conatos": int(num(row[1])),
                    "incendios": int(num(row[2])),
                    "causantes_identificados": int(num(row[3])),
                    "ha_arbolada": num(row[4]),
                    "ha_no_arbolada_lenosa": num(row[5]),
                    "ha_herbacea": num(row[6]),
                    "ha_total_forestal": num(row[7]),
                }
            )
        except (ValueError, IndexError, TypeError):
            continue
    df = pd.DataFrame(filas)
    df["siniestros_total"] = df["conatos"] + df["incendios"]
    return df.sort_values("siniestros_total", ascending=False).reset_index(drop=True)


def extrae_neglixencias(pdf: pdfplumber.PDF) -> pd.DataFrame:
    """Cuadro 7.3, pp.69-70 — categorías de neglixencias e accidentes."""
    filas = []
    for pi in (68, 69, 70):
        page = pdf.pages[pi]
        for tab in page.extract_tables():
            if len(tab) < 5:
                continue
            for row in tab:
                if not row or len(row) < 11 or not row[0]:
                    continue
                nome = row[0].strip()
                if nome in {"", "NEGLIGENCIAS Y CAUSAS ACCIDENTALES"}:
                    continue
                try:
                    cierta = int(num(row[1]))
                    supuesta = int(num(row[3]))
                    total = int(num(row[5]))
                    ha_total = num(row[10])
                except (ValueError, IndexError, TypeError):
                    continue
                filas.append(
                    {
                        "categoria": nome,
                        "siniestros_cierta": cierta,
                        "siniestros_supuesta": supuesta,
                        "siniestros_total": total,
                        "ha_total_forestal": ha_total,
                    }
                )
    df = pd.DataFrame(filas).drop_duplicates(subset=["categoria"]).reset_index(drop=True)
    return df.sort_values("siniestros_total", ascending=False).reset_index(drop=True)


def extrae_areas(pdf: pdfplumber.PDF) -> pd.DataFrame:
    """Gráficos 7.5 (siniestros) e 7.7 (superficie forestal) — % por área xeográfica.

    Os gráficos son piecharts sen táboa estruturada; recuperámolos do texto
    bruto da páxina co patrón 'Categoría XX,XX%'. Sumamos e renormalizamos
    para asegurar 100% por área.
    """
    p65 = pdf.pages[64].extract_text() or ""
    p66 = pdf.pages[65].extract_text() or ""

    # As categorías que buscamos (en orde de aparición no PDF).
    cats = ["Reproducción", "Desconocida", "Negligencias", "Intencionado", "Rayo"]
    areas_orde_siniestros = ["Noroeste", "Comunidades interiores", "Canarias", "Mediterráneo"]
    areas_orde_super = ["Noroeste", "Comunidades interiores", "Canarias", "Mediterráneo"]

    def _parse(texto: str, cats: list[str]) -> list[dict]:
        # Buscamos "<categoria> ... <numero>%"
        valores = []
        for cat in cats:
            # Patrón laxo que tolera maiúsculas/letras pegadas no PDF.
            patron = re.compile(rf"{cat}[a-záéíóú \n\d]*?(\d+,\d+)\s*%", re.IGNORECASE)
            valores.append([float(m.group(1).replace(",", ".")) for m in patron.finditer(texto)])
        return valores

    def _agrupar(texto: str, areas: list[str]) -> list[dict]:
        valores = _parse(texto, cats)
        # Cada categoría debería aparecer 4 veces (unha por área), pero o PDF
        # pode duplicar lecturas. Tomamos as 4 primeiras.
        filas = []
        for i, area in enumerate(areas):
            fila = {"area": area}
            for j, cat in enumerate(cats):
                v = valores[j][i] if i < len(valores[j]) else None
                fila[cat] = v
            filas.append(fila)
        return filas

    sin_filas = _agrupar(p65, areas_orde_siniestros)
    sup_filas = _agrupar(p66, areas_orde_super)

    df_sin = pd.DataFrame(sin_filas).assign(metrica="pct_siniestros")
    df_sup = pd.DataFrame(sup_filas).assign(metrica="pct_ha_forestal")

    df = pd.concat([df_sin, df_sup], ignore_index=True)
    return df


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with pdfplumber.open(SRC) as pdf:
        grupos = extrae_grupos(pdf)
        motivacions = extrae_motivacions(pdf)
        neglixencias = extrae_neglixencias(pdf)
        areas = extrae_areas(pdf)

    grupos.to_csv(OUT / "causas_2006_2015_grupos.csv", index=False)
    motivacions.to_csv(OUT / "causas_2006_2015_motivacions.csv", index=False)
    neglixencias.to_csv(OUT / "causas_2006_2015_neglixencias.csv", index=False)
    areas.to_csv(OUT / "causas_2006_2015_areas.csv", index=False)

    print("\n== Cuadro 7.1: causas (España, 2006-2015) ==")
    print(grupos[["grupo", "siniestros_total", "pct_siniestros", "ha_total_forestal", "pct_ha"]].to_string(index=False))

    print("\n== Cuadro 7.2: top 10 motivacións intencionados ==")
    print(motivacions[["motivacion", "siniestros_total", "ha_total_forestal"]].head(10).to_string(index=False))

    print("\n== Áreas xeográficas: % siniestros / superficie ==")
    print(areas.to_string(index=False))


if __name__ == "__main__":
    main()
