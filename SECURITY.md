# Notas de seguridade

## Token de Mapbox

El token de Mapbox **no está en el repositorio**. `config.js` contiene solo el placeholder `__MAPBOX_TOKEN__`. El workflow de GitHub Actions (`.github/workflows/deploy.yml`) lo sustituye en tiempo de deploy usando el secret `MAPBOX_TOKEN` configurado en el repositorio.

Para preview local, copiar el token en `.env` (fichero excluido por `.gitignore`) y sustituir el placeholder en `config.js` antes de arrancar el servidor. Nunca hacer commit de `config.js` con el token real.

Restricciones recomendadas para el token en https://account.mapbox.com/access-tokens/:
- `https://miguelferre.github.io/*`
- `http://localhost:*`
- `http://127.0.0.1:*`

## Datos personales

No se han detectado correos, teléfonos ni rutas locales con identificadores personales en el repositorio público.

## Datos crudos

Los archivos en `data/raw/` no se versionan (ver `.gitignore`) salvo el ODS de PrazaGal, que es CC BY-NC-SA 4.0 y es la pieza diferencial del análisis.
