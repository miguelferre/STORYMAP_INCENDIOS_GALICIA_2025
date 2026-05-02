# Fuentes de datos

Inventario detallado de los datasets utilizados, sus URL de origen y la licencia bajo la que se redistribuyen.

## Incendios

### PrazaGal — listado de incendios 2025

- **Qué**: 1.475 incendios documentados por PrazaGal vía Lei de Transparencia, con fecha, hora, concello, parroquia y hectáreas.
- **URL**: distribuido inicialmente como ODS adjunto a la petición. Local en `data/raw/prazagal_incendios_2025.ods`.
- **Licencia**: CC BY-NC-SA 4.0.
- **Cobertura**: 2025-01-01 a 2025-12-31 con concentración brutal del 8 al 15 de agosto.
- **Atribución requerida**: "Datos: PrazaGal vía Lei de Transparencia (CC-BY-NC-SA)".

### Hojas oficiales Lumes-AAAA-por-Distrito

- **Qué**: estadística oficial Xunta por distrito forestal, totales anuales 2018-2025.
- **URL**: `https://mediorural.xunta.gal/sites/default/files/estatisticas/AAAA/Lumes-AAAA-por-Distrito.xlsx`
- **Licencia**: datos abiertos Xunta de Galicia (Lei 14/2013, reutilización con atribución).

### EGIF — Estadística General de Incendios Forestales

- **Qué**: 81.643 partes oficiales (PIF) de Ourense 1968-2022, con `idcausa` e `idmotivacion`.
- **URL**: portal `servicio.mapa.gob.es/incendios/Search/Publico` (descarga XML por provincia).
- **Catálogo de motivaciones**: manual EGIF v3.6, p. 18 (`data/raw/egif_instrucciones.pdf`).
- **Licencia**: datos abiertos MITECO/MAPA.

### Informe MITECO decenio 2006-2015

- **Qué**: cuadros 7.1/7.2/7.3 de causas, motivaciones, áreas geográficas a nivel estatal y de Galicia.
- **URL**: `https://www.miteco.gob.es/content/dam/miteco/es/biodiversidad/temas/incendios-forestales/incendios-decenio-2006-2015_tcm30-521617.pdf`
- **Uso**: complementario al EGIF (datos preprocesados en `data/processed/causas_2006_2015_*.csv`, no integrados todavía al chart).

## Cartografía base

### Mapa de Parroquias 1:25.000

- **Qué**: 3.785 parroquias gallegas con código INE de concello y advocación.
- **URL**: `https://visorgis.cmati.xunta.es/cdix/descargas/visor_basico/Parroquias.zip`
- **Productor**: Instituto de Estudos do Territorio (IET, Xunta de Galicia).
- **Licencia**: datos abiertos Xunta de Galicia, uso no comercial con atribución.

### CMVMC — Rexistro de Montes Veciñais en Man Común

- **Qué**: 3.290 montes vecinales clasificados, 661.232 ha (marzo 2024).
- **URL**: `https://ovmediorural.xunta.gal/sites/default/files/Situacion_Localizacion_MVMC_MARZO_2024.zip`
- **Productor**: Oficina Virtual do Medio Rural (Xunta).
- **Licencia**: © Xunta de Galicia, uso no comercial. Cita obligatoria.
- **Limitación declarada por el productor**: cartografía orientativa, no presume derechos de propiedad.

### Mapa de Usos do Solo (IET) — escala 1:250.000, 2011

- **Qué**: 30.047 teselas con leyenda LENDA25 de 20 categorías, reclasificadas a 8 clases divulgativas.
- **URL**: `https://visorgis.cmati.xunta.es/cdix/descargas/visor_basico/usos_solo.zip`
- **Productor**: Instituto de Estudos do Territorio (IET, Xunta de Galicia).
- **Año de referencia**: 2011-06-20 (declarado en metadatos del shapefile).
- **Licencia**: datos abiertos Xunta de Galicia.

### Mapa Geológico de España 1:1.000.000 (IGME, 1994)

- **Qué**: 15.804 polígonos litoestratigráficos del Macizo Hespérico (España + Baleares), atributos `LITOLOGIA`, `LITOGEN_CL`, `DOMINIO`, `EON_ERA`, etc.
- **URL**: `https://info.igme.es/cartografiadigital/datos/geologicos1M/Geologico1000_(1994)/shapes/geologico_1000_shapes.zip`
- **Productor**: Instituto Geológico y Minero de España (IGME).
- **CRS original**: EPSG:23030 (ED50 UTM30N), encoding cp850.
- **Reclasificación**: las ~15 unidades presentes en Galicia se agrupan en 3 clases divulgativas (`acidas`, `basicas`, `sedimentarios`) en `scripts/16_reclasifica_litologia.py`. Salida: `assets/data/litologia_galicia.geojson` (~800 KB).
- **Licencia**: cartografía oficial IGME, redistribución libre con atribución.

## Teledetección

### Sentinel-2 L2A — Microsoft Planetary Computer

- **Qué**: imágenes multiespectrales de Copernicus, resolución 10 m (B08 NIR) y 20 m (B12 SWIR2).
- **STAC API**: `https://planetarycomputer.microsoft.com/api/stac/v1`, colección `sentinel-2-l2a`.
- **Escenas usadas**:
  - Pre-fuego: `S2A_MSIL2A_20250724T112131_R037_T29TPG` (24 jul 2025, 0,1 % nubes)
  - Post-fuego: `S2C_MSIL2A_20251010T112131_R037_T29TPG` (10 oct 2025, 0,0 % nubes)
- **Licencia**: Copernicus Open Data (gratuita, atribución a la Comisión Europea / ESA).
- **Reutilización**: el repackaging via MPC requiere atribución a Microsoft Planetary Computer.

### Reclasificación de severidad

- **Origen**: Key, C.H. & Benson, N.C. (2006). *Landscape Assessment: Sampling and Analysis Methods*. USDA Forest Service General Technical Report RMRS-GTR-164-CD.
- **Umbrales aplicados (sobre dNBR continuo)**: regrowth ≤ −0.25 < no quemado < 0.10 < severidad baja < 0.27 < moderada-baja < 0.44 < moderada-alta < 0.66 < alta.

## Otras

### Comparador de superficies municipales (`assets/cities.csv`)

- **Origen**: superficies municipales del INE (España), Eurostat (Europa).
- **Productor**: compilación propia.
- **Uso libre con atribución**.

### Fondo cartográfico Mapbox

- **Estilo personalizado**: `mapbox://styles/miguel-ferr/cmf4jek5100hv01plgk8pe1lg`
- **Token**: token público de cliente con restricción de dominio (`miguelferre.github.io/*` + `localhost`).
- **Licencia**: Mapbox standard pricing/free tier; atribución en footer del mapa.

## Datos crudos no versionados

`data/raw/` está en `.gitignore` salvo `prazagal_incendios_2025.ods` (la pieza diferencial). Lo demás se regenera ejecutando los scripts en orden:

| Carpeta | Reproducible con |
|---|---|
| `data/raw/medio_rural/` | `scripts/02_descarga_lumes_distrito.py` |
| `data/raw/egif_ourense/` | descarga manual del XML EGIF + `scripts/05_descomprime_egif_xml.py` |
| `data/raw/propiedade/` | `scripts/10_descarga_propiedade.py` |
| `data/raw/vegetacion/` | `scripts/12_descarga_vegetacion.py` |
| `data/processed/dnbr_larouco_2025.tif` | `scripts/14_dnbr_larouco.py` (~21 MB) |
