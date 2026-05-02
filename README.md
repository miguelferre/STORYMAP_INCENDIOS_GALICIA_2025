# Storymap — incendios forestais en Galicia, verán 2025

[![Deploy](https://img.shields.io/badge/deploy-GitHub_Pages-2EA44F)](https://miguelferre.github.io/STORYMAP_INCENDIOS_GALICIA_2025/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Content: CC BY 4.0](https://img.shields.io/badge/Contenido-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Languages: ES · GL](https://img.shields.io/badge/idiomas-ES%20%C2%B7%20GL-orange.svg)](#)

Pieza divulgativa que reconstruye el verano de incendios de Galicia 2025 a partir de datos abiertos: el incendio de Larouco–Seadur (31.778 ha, el mayor de la historia gallega) y los más de 1.400 fuegos que lo acompañaron. La intención es doble: contarle al público no especializado **qué pasó y por qué**, y al mismo tiempo dejar visible el pipeline geoespacial completo —desde el dato bruto hasta el render web— como demostración técnica.

**Despliegue**: [miguelferre.github.io/STORYMAP_INCENDIOS_GALICIA_2025](https://miguelferre.github.io/STORYMAP_INCENDIOS_GALICIA_2025/) · idiomas ES/GL.

## Capítulos

1. **Un verán para reaccionar** — Larouco–Seadur en contexto, comparado con superficies municipales europeas.
2. **O día que se xuntou todo** — cronología PrazaGal: 100.000 hectáreas en una semana del 8 al 15 de agosto.
3. **A pegada do lume** — análisis post-incendio con dNBR Sentinel-2 (Microsoft Planetary Computer), reclasificación Key & Benson 2006.
4. **Tendencia: máis lume e máis grande** — serie oficial Xunta + EFFIS desde 1968 con heatmap distrito × año.
5. **Por que Galicia e o Noroeste** — capas Mapbox de geología, vegetación (IET-Xunta 2011, 8 clases divulgativas), clima y geografía.
6. **As causas detrás do lume** — 81.643 partes oficiales EGIF Ourense 1968-2022 con motivaciones detalladas de los intencionados.
7. **De quén son os montes que arden** — cruce PrazaGal × parroquias × CMVMC. El 22 % del territorio gallego es monte vecinal en mano común; concentra el 39 % de las hectáreas estimadas quemadas.
8. **Afastámonos do monte** — comparador 1957/2021 sobre Cimadevila.
9. **O verán alárgase…** — heatmap de temperaturas histórico (Flourish, pendiente de sustituir).

## Stack

- **Frontend**: Mapbox GL JS 3.8 + Scrollama; tipografía editorial; charts nativas con [Observable Plot](https://observablehq.com/plot) (sin iframes externos salvo uno residual).
- **Procesado geoespacial**: Python 3.13 + `geopandas`, `rasterio`, `xarray`, `rioxarray`, `shapely`, `pystac-client`, `planetary-computer`, `pandas`.
- **Hosting**: GitHub Pages (estático).
- **Tests**: `playwright` recorre los capítulos en escritorio (1280×800) y móvil (390×844) en ES y GL, captura por capítulo y registra errores de consola, fallos de red y problemas de render.

## Pipelines (`scripts/`)

| # | Script | Salida |
|---|---|---|
| 01 | `01_prepara_prazagal.py` | `prazagal_2025.csv/parquet` (1.475 incendios PrazaGal) |
| 02 | `02_descarga_lumes_distrito.py` | XLSX anuales Medio Rural 2018-2025 |
| 03-04 | `03_serie_oficial.py` + `04_dataset_grafica_tendencia.py` | Serie Xunta + JSON gráfica de tendencia |
| 05-07 | `05_*` `06_*` `07_dataset_grafica_causas.py` | Parsea XML EGIF Ourense 1968-2022 → JSON causas |
| 08-09 | `08_*` `09_extrae_causas_miteco.py` | Extrae cuadros 7.x del informe MITECO 2006-2015 |
| 10-11 | `10_descarga_propiedade.py` + `11_overlay_propiedade.py` | Parroquias IGE + CMVMC, overlay por parroquia |
| 12-13 | `12_descarga_vegetacion.py` + `13_procesa_vegetacion.py` | Mapa Usos do Solo IET 2011 → 8 clases |
| 14 | `14_dnbr_larouco.py` | dNBR Sentinel-2 sobre Larouco-Seadur (MPC) |
| 15 | `15_cronoloxia.py` | Cronología diaria PrazaGal verano 2025 |

Todos los scripts son idempotentes: pueden re-ejecutarse sin re-descargar lo que ya está en `data/raw/`.

## Reproducibilidad

```bash
python -m venv .venv && source .venv/bin/activate   # o .venv\Scripts\activate en Windows
pip install geopandas pandas pystac-client planetary-computer rasterio rioxarray shapely

# Regenera todos los datasets
for s in scripts/0*.py scripts/1*.py; do python "$s"; done

# Sirve el storymap en local
python -m http.server 8000
# abre http://127.0.0.1:8000
```

Test visual:

```bash
npm install
node scripts/teste_visual.js   # capturas en data/teste_visual/
```

## Datos y licencias

Lista completa en [`DATA_SOURCES.md`](DATA_SOURCES.md). Resumen:

- Datos abiertos de la Consellería do Medio Rural (Xunta de Galicia) y del IET.
- ODS de PrazaGal (CC BY-NC-SA 4.0) obtenido vía Lei de Transparencia — la pieza diferencial del análisis.
- EGIF / MITECO (estadística estatal de incendios forestales).
- Sentinel-2 L2A vía Microsoft Planetary Computer (Copernicus Programme).
- Cartografía base © Xunta de Galicia (uso no comercial).

Código bajo licencia MIT (ver `LICENSE`). El contenido editorial (texto, figuras propias) se libera bajo CC BY 4.0.

## Créditos

Storymap original (capítulos visuales y narrativa de partida): equipo del [Desafío 2 RACE](Desafio%202/) del que parte este trabajo.

Las iteraciones técnicas posteriores —pipelines geoespaciales, sustitución de iframes Flourish por charts nativos, capítulos nuevos de propiedad del monte y dNBR Sentinel-2— las firma Miguel Ferreiro García.

## Estructura del repositorio

```
.
├── index.html                # entrada principal (Mapbox GL + Scrollama)
├── config.js                 # capítulos del storymap (orden, descripciones, callbacks)
├── i18n.js                   # cadenas en ES/GL
├── assets/
│   ├── charts/*.js           # componentes Observable Plot (causas, comparador, dNBR…)
│   └── data/                 # datasets ligeros servidos al frontend
├── data/
│   ├── raw/                  # descargas crudas (gitignored, regenerable con scripts/)
│   ├── processed/            # datasets intermedios
│   └── teste_visual/         # capturas Playwright (gitignored)
├── scripts/
│   ├── 01–15_*.py            # pipelines geoespaciales reproducibles
│   └── teste_visual.js       # test visual Playwright
├── notebooks/                # análisis y notas de trabajo
├── CHANGELOG.md / DATA_SOURCES.md / SECURITY.md / LICENSE
└── package.json              # scripts npm: serve, test:visual
```

## Notas

- El token de Mapbox (`config.js`) es un token público restringido por dominio. Detalles en [`SECURITY.md`](SECURITY.md).
- Hay un iframe Flourish residual (heatmap temperaturas 1940-2024) cuyo reemplazo nativo requiere descarga AEMET con API key. Pendiente para próxima iteración.
- Capturas de las gráficas y mapas nativos en `data/teste_visual/` (no versionado).
- Análisis estético en curso: ver [`notebooks/analisis_estetico.md`](notebooks/analisis_estetico.md).
