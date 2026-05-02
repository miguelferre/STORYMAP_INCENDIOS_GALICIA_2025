"""Extrae as causas dos partes EGIF de Ourense (XMLs do MITECO/MAPA).

Le os XMLs xa descomprimidos (ver `05_descomprime_egif_xml.py`) e produce
dúas táboas en `data/processed/`:

  - causas_ourense_grupo_anual.csv   (ano × grupo de causa: nº incendios e ha)
  - causas_ourense_motivacions.csv   (motivacións intencionados, agregado total
                                      e desglose 1968-2022, ordenado por nº)

A clasificación parte do código EGIF `idcausa`:

  - 100..199  → Rayo
  - 200..399  → Negligencias e accidentes
  - 400       → Intencionado (sen motivación detallada)
  - 401..499  → Intencionado, con motivación recoñecida (catálogo p.18 do
                manual EGIF)
  - 500..599  → Causa descoñecida
  - 600..699  → Reproducción de incendio anterior

Catálogo de motivacións transcrito do *Parte de Incendio Forestal —
Instrucciones de relleno v3.6* (Comité de Lucha contra Incendios Forestales,
MITECO 2011), pp. 18-19.

Os datos publicados pola Xunta na anualidade 2025 amosan algunha desviación
fronte a EGIF; aquí respéctase a cifra EGIF como serie histórica
homologable a outras provincias e países.
"""

from __future__ import annotations

from collections import defaultdict
from pathlib import Path

import pandas as pd
from lxml import etree

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "data" / "raw" / "egif_ourense"
OUT = ROOT / "data" / "processed"

# Códigos de motivación dos incendios intencionados (catálogo EGIF, p.18 do manual
# + ampliacións detectadas no XML de Ourense 1968-2022).
MOTIVACIONS = {
    400: ("Intencionado sen motivación recoñecida", "Intencionado sen motivación recoñecida"),
    401: ("Prácticas agrícolas e gandeiras", "Quemas agrícolas que se descontrolan"),
    402: ("Prácticas agrícolas e gandeiras", "Quemas gandeiras que se descontrolan"),
    403: ("Prácticas agrícolas e gandeiras", "Outras quemas agro-gandeiras"),
    404: ("Prácticas agrícolas e gandeiras", "Eliminar vexetación de montes en explotación"),
    405: ("Prácticas agrícolas e gandeiras", "Manter o monte libre de vexetación (paisaxe tradicional)"),
    411: ("Caza", "Para facilitar ou favorecer a caza"),
    412: ("Caza", "Conflitos cinexéticos"),
    421: ("Pesca", "Para facilitar a pesca"),
    431: ("Propiedade", "Disputas pola titularidade dos montes"),
    432: ("Propiedade", "Modificación do uso do solo"),
    433: ("Propiedade", "Modificación da linde da propiedade"),
    434: ("Propiedade", "Eliminar vexetación forestal en lindes"),
    441: ("Beneficio económico", "Modificar o prezo da madeira"),
    442: ("Beneficio económico", "Salarios na extinción ou restauración"),
    443: ("Beneficio económico", "Forzar resolución de Consorcios"),
    444: ("Beneficio económico", "Favorecer produtos do monte (setas, esp.)"),
    451: ("Desacordos e protestas", "Crear malestar e alarma social"),
    452: ("Desacordos e protestas", "Animadversión contra repoboacións"),
    453: ("Desacordos e protestas", "Rechazo a Espazos Naturais Protexidos"),
    461: ("Vinganzas e disputas", "Represalia por reducir inversións nos montes"),
    462: ("Vinganzas e disputas", "Resentimento contra expropiacións"),
    463: ("Vinganzas e disputas", "Represalia por multas"),
    464: ("Vinganzas e disputas", "Vinganzas persoais"),
    471: ("Forzas de orde público", "Distraer á Garda Civil ou Policía"),
    472: ("Forzas de orde público", "Reclamar presenza policial"),
    473: ("Control de animais", "Control de animais (coellos, lobos…)"),
    481: ("Piromanía", "Pirómanos"),
    482: ("Vandalismo", "Vandalismo"),
    483: ("Piromanía", "Outras condutas asociadas a piromanía"),
    499: ("Outras motivacións", "Outras motivacións intencionadas"),
}


def grupo(idcausa: int) -> str:
    if 100 <= idcausa < 200:
        return "Rayo"
    if 200 <= idcausa < 400:
        return "Negligencias e accidentes"
    if idcausa == 400 or 401 <= idcausa < 500:
        return "Intencionado"
    if 500 <= idcausa < 600:
        return "Causa descoñecida"
    if 600 <= idcausa < 700:
        return "Reproducción"
    return "Outros / sen clasificar"


def _to_float(s: str | None) -> float:
    if not s:
        return 0.0
    try:
        return float(s)
    except ValueError:
        return 0.0


def le_pifs(xml_paths: list[Path]):
    """Yields (anio, idcausa, idmotivacion, ha_arbolada, ha_no_arbolada) por cada PIF."""
    for fp in xml_paths:
        ctx = etree.iterparse(str(fp), events=("end",), tag="Pif")
        for _, el in ctx:
            anio_txt = el.findtext("pif_comun/anio")
            causa_txt = el.findtext("pif_causa/idcausa")
            motiv_txt = el.findtext("pif_causa/idmotivacion")
            ha_arb = _to_float(el.findtext("pif_perdidas/superficiearboladatotal"))
            ha_no_arb = _to_float(el.findtext("pif_perdidas/superficienoarboladatotal"))
            prov = el.findtext("pif_localizacion/idprovincia")
            if anio_txt and causa_txt and prov == "32":  # 32 = Ourense
                idm = int(motiv_txt) if motiv_txt else 0
                yield int(anio_txt), int(causa_txt), idm, ha_arb, ha_no_arb
            el.clear()
            while el.getprevious() is not None:
                del el.getparent()[0]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    xmls = sorted(SRC_DIR.rglob("Xml_*_*.xml"))
    if not xmls:
        raise SystemExit(f"Non se atopan XMLs en {SRC_DIR}. Executa 05_descomprime_egif_xml.py")
    print(f"Lendo {len(xmls)} XMLs…")

    # Acumuladores: (ano, grupo) → {n, ha_total}
    grupo_anual = defaultdict(lambda: {"num_incendios": 0, "ha_total": 0.0})
    motivacions = defaultdict(lambda: {"num_incendios": 0, "ha_total": 0.0})

    for anio, idc, idm, ha_arb, ha_no_arb in le_pifs(xmls):
        g = grupo(idc)
        ha = ha_arb + ha_no_arb
        ga = grupo_anual[(anio, g)]
        ga["num_incendios"] += 1
        ga["ha_total"] += ha
        if g == "Intencionado":
            grupo_motiv, etiq = MOTIVACIONS.get(idm, ("Outras motivacións", f"Código {idm} (sen catálogo)"))
            m = motivacions[(grupo_motiv, etiq)]
            m["num_incendios"] += 1
            m["ha_total"] += ha

    # ---- Táboa 1: grupo × ano ----
    df_grupo = pd.DataFrame(
        [
            {"ano": ano, "grupo": g, "num_incendios": v["num_incendios"], "ha_total": round(v["ha_total"], 2)}
            for (ano, g), v in grupo_anual.items()
        ]
    ).sort_values(["ano", "grupo"]).reset_index(drop=True)
    df_grupo.to_csv(OUT / "causas_ourense_grupo_anual.csv", index=False)

    # ---- Táboa 2: motivacións agregadas ----
    df_mot = pd.DataFrame(
        [
            {"grupo_motivacion": gm, "motivacion": etq, "num_incendios": v["num_incendios"], "ha_total": round(v["ha_total"], 2)}
            for (gm, etq), v in motivacions.items()
        ]
    ).sort_values("num_incendios", ascending=False).reset_index(drop=True)
    df_mot.to_csv(OUT / "causas_ourense_motivacions.csv", index=False)

    # ---- Resumos en consola ----
    print("\n== Distribución por grupo de causa (toda a serie) ==")
    resumo_grupo = df_grupo.groupby("grupo")[["num_incendios", "ha_total"]].sum().sort_values("num_incendios", ascending=False)
    resumo_grupo["pct_n"] = (resumo_grupo["num_incendios"] / resumo_grupo["num_incendios"].sum() * 100).round(2)
    resumo_grupo["pct_ha"] = (resumo_grupo["ha_total"] / resumo_grupo["ha_total"].sum() * 100).round(2)
    print(resumo_grupo.to_string())

    print(f"\nRango temporal: {df_grupo['ano'].min()}–{df_grupo['ano'].max()}, total PIFs: {df_grupo['num_incendios'].sum():,}")

    print("\n== Top 10 motivacións (incendios intencionados) ==")
    print(df_mot.head(10).to_string(index=False))


if __name__ == "__main__":
    main()
