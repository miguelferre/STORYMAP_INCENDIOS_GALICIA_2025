# Changelog

Iteraciones técnicas sobre el storymap original. La sección "feedback" recoge las tres revisiones públicas (señaladas en la propia página) y las propuestas del feedback experto recibido por el autor.

## 2026-05-02 — Cuarta iteración (rediseño técnico)

Cuatro commits encadenados en un mismo día (`5c7e36f`, `368cab2`, `8b93384`, `c1f8c74`) más una quinta entrega (`be8100f`) cerrando los puntos críticos del rediseño:

- **B.1 — Capítulo "De quén son os montes que arden?"**: cruce 1.475 incendios PrazaGal × 3.785 parroquias × 3.290 montes vecinales en mano común. Match texto-a-texto al 98,2 %. El 22,3 % del territorio gallego es MVMC pero concentra el 39 % de las hectáreas estimadas quemadas: ratio de 1,76× sobre lo proporcional. Mapa coroplético + scatter de incendios + barras comparativas en Observable Plot.
- **A.2 — Capa de vegetación con año declarado**: sustitución de la antigua capa SERGAS USOURENSE (sin año de referencia, una de las tres revisiones públicamente señaladas) por el Mapa de Usos do Solo del IET-Xunta 2011, escala 1:250.000, reclasificado a 8 clases divulgativas (frondosas autóctonas, eucaliptal, piñeiro, mato, mestura arbórea, agrícola, urbano, auga). Servida como source Mapbox propia (3,7 MB lazy-load).
- **Iframes Flourish nativos**: comparador de ciudades (Larouco vs 22 ciudades) y heatmap distrito × año (19 distritos × 2018-2025) reescritos con Observable Plot. Tres charts nativos previas (`serie_incendios.js`, `causas.js`, `propiedade.js`) ya servían de referencia.
- **B.2 — Capítulo "A pegada do lume"**: análisis post-incendio reproducible con dNBR Sentinel-2 vía Microsoft Planetary Computer. Pre-fuego 24 jul (0,1 % nubes), post-fuego 10 oct (0,0 % nubes). Reclasificación Key & Benson 2006: 24.451 ha quemadas detectadas (consistente con los 31.778 ha oficiales considerando bbox), 457 ha de severidad alta como puntos críticos para validación de modelos de propagación.
- **Capítulo "O día que se xuntou todo"**: cronología PrazaGal del verano 2025 con anotaciones sobre el 12-15 agosto, donde se concentran ~100.000 ha en una sola semana.

Documentación añadida: `README.md`, `DATA_SOURCES.md`, `LICENSE` (MIT código + CC BY 4.0 contenido), este `CHANGELOG.md`.

## 2026-05-01 — Tercera iteración (causas EGIF)

- **A.3 — Sustitución del gráfico de causas Flourish** por la serie EGIF Ourense 1968-2022 con dos paneles Observable Plot (evolución anual apilada por grupo de causa + barras horizontales con motivaciones de los intencionados). Pipeline `scripts/05`/`07`/`09` parsea 81.643 partes oficiales del XML del portal EGIF y mapea `idcausa` + `idmotivacion` según el manual EGIF v3.6. Commit `071fc88`.

## 2026-04-30 — Segunda iteración (tendencia EFFIS → Xunta)

- **A.1 — Sustitución del gráfico de tendencia** EFFIS por la serie oficial de la Consellería do Medio Rural (XLSX abiertos 2018-2025), unida con la serie EGIF a largo plazo. Observable Plot embebido reemplaza al iframe Flourish. Pipeline `scripts/01-04`. Commit `f4445b1`.
- Pipeline reproducible con PrazaGal versionado (CC BY-NC-SA), test visual Playwright en `scripts/teste_visual.js`.
- `SECURITY.md` con nota sobre el token Mapbox.

## Antes — Storymap base

Versión inicial del Desafío 2 RACE: capítulos visuales originales (Larouco, Cimadevila 1957/2021, comparador de ciudades, heatmap de temperaturas), iframes Flourish para la mayoría de gráficas, capa SERGAS de vegetación sin año declarado.

## Pendiente

- **B.3** — Análisis FWI (Fire Weather Index) sobre el evento 12-15 ago 2025. CEMS Fire Danger Indices NetCDF + WRF 1 km MeteoGalicia.
- **B.4** — Exposición WUI (Wildland-Urban Interface) sobre el perímetro Larouco con SILVIS Global WUI 2020.
- **Heatmap temperaturas** — sustitución del último iframe Flourish residual; requiere AEMET API key.
- **Token Mapbox** — placeholder + GitHub Action que substituya el token desde un secret en build.
