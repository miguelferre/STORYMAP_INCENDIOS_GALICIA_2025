# Notas de seguridade

## Token de Mapbox

`config.js` carga un token público de Mapbox (`pk.eyJ1IjoibWlndWVsLWZlcnIi...`). Es un token *cliente* pensado para correr en navegador, así que aparecer en el HTML no es un fallo en sí. Lo que sí conviene es restringirlo para que no pueda usarse desde otro dominio:

1. Entrar en https://account.mapbox.com/access-tokens/
2. Editar el token y añadir en **URL restrictions**:
   - `https://miguelferre.github.io/*`
   - `http://localhost:*`
   - `http://127.0.0.1:*`
3. Tras el cambio, rotar el token (revoke y crear uno nuevo) y actualizar `config.js`.

## Datos personales

No se han detectado correos, teléfonos ni rutas locales con identificadores personales en el repositorio público.

## Datos crudos

Los archivos en `data/raw/` no se versionan (ver `.gitignore`) salvo el ODS de PrazaGal, que es CC BY-NC-SA 4.0 y es la pieza diferencial del análisis.
