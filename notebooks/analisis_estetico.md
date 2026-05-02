# Análisis estético del storymap

Documento de trabajo: auditoría del estado actual y propuesta de mejoras tomando como referencia *Saving the Nile* de Al Jazeera (2020).

## 1. Lo que hace bien la pieza de Al Jazeera

- **Tipografía editorial sobria.** Display serif para titulares (cierre dramático), sans humanista para cuerpo y captions. Solo dos familias en toda la pieza.
- **Paleta restringida.** Un beige cálido como base, un naranja terracota para el elemento focal (el Nilo, su cuenca, el conflicto) y un azul agua reservado al objeto de la historia. El resto de la página vive en grises neutros.
- **Mapas embutidos como cinemática.** Casi todos los mapas son a pantalla completa, con etiquetas mínimas y un único elemento destacado. Las leyendas son tenues y se sitúan debajo a la derecha, no compiten con el mapa.
- **Cards y bloques de texto con peso visual claro.** El texto narrativo nunca está sobre la imagen — siempre en un costado, con un ancho máximo cómodo (~60ch).
- **Transiciones lentas y deliberadas.** Cada sección respira. El usuario rara vez ve dos elementos cambiando a la vez.
- **Un único acento cromático para el "personaje" del reportaje.** En *Saving the Nile* es el río en azul. En nuestro caso debería ser el **fuego** (naranja-rojo).

## 2. Estado actual del storymap (mayo 2026)

### Tipografía
- Mezcla de tres familias: `Georgia/Cambria` (cabeceras de cards), `system-ui/Segoe UI` (cuerpo), y los `<h2>` de los capítulos heredan del CSS general.
- Inconsistencia: el h3 de "Larouco vs. el callejero" (Georgia) contrasta con los h2 sans-serif de "Una tendencia en aumento". Decide y unifica.
- Tamaños: cuerpo de párrafo a 16px en escritorio es correcto; 1.8 de line-height puede ser excesivo (Al Jazeera usa ~1.55). Bajar a 1.6 ganará densidad sin perder respiración.

### Paleta
- El acento naranja `#F44E11` está bien elegido y coherente con los datasets del fuego.
- Sobreuso de azul claro `#9CC5F0` y verde `#4FB7B3` al mismo tiempo en gráficos distintos. Reducirlo a UN segundo color (gris o azul, pero no ambos).
- Las leyendas de los mapas Mapbox compiten cromáticamente con el mosaico de polígonos. Bajar saturación general de la capa de vegetación a opacity 0.45-0.50.

### Layout
- El bloque de portada del primer capítulo y el cierre tienen estéticas distintas. El **cierre con tarjeta de texto contenida es claramente más fuerte**: hereda esa estética para la portada (tarjeta translúcida con padding generoso, max-width controlado, blur de fondo).
- La superposición `mobile-expl` / `desktop-expl` duplica texto en HTML — no es un problema visual pero sí mantenibilidad. A futuro, párrafo único con `display` controlado por media query.
- Los iframes Flourish que quedan (mapas de calor de temperatura) tienen una estética distinta a las gráficas nativas. Si no se sustituyen, al menos se les puede aplicar un wrap con el mismo `.tendencia-bloque` que iguala fondo y borde.

### Gráficos nativos (Observable Plot)
- Los `.tendencia-bloque`, `.causas-bloque`, `.dnbr-bloque`, `.cronoloxia-bloque` comparten estructura y estilo. Bien.
- Pero la jerarquía visual interna es confusa: `cabecera h3 + p + leyenda + paneles + pie`. Al Jazeera reduce esto a `título corto + chart + caption tenue`. La descripción del gráfico debería ser parte del texto narrativo del capítulo, no del componente.
- Tipografía de los Plot: `system-ui` — dejarlo, pero subir a 12px cuerpo y 12.5px ejes para ganar legibilidad. Inter como primer fallback ya añadido en serie_incendios.

### Mapas Mapbox (capítulo "¿Por qué Galicia y el Noroeste?")
- **Geología**: el ráster de litología sigue siendo el dato bruto del IGME. Visualmente: **demasiados colores muy saturados** (rosa, morado, naranja, verde) sin jerarquía. Propuesta: agrupar los 8+ litotipos en 3 grandes clases — *rocas ácidas* (granitos + metamórficas felsicas), *rocas básicas/carbonatadas*, *depósitos sedimentarios* — con tres colores tierra y leyenda corta. Si no se reclasifica el dato, al menos bajar opacidad a 0.50 para que el relieve mande.
- **Vegetación**: tras quitar los outlines blancos en esta iteración, el mosaico debería leerse mejor. Si sigue siendo demasiado fragmentado, considerar generalizar geometrías a tolerancia 200 m antes de servir el GeoJSON.
- **Geografía**: correcto — relieve hillshade. Mejora opcional: añadir un graticule sutil 0.5° y una línea más marcada en la frontera Galicia-Castilla y León-Portugal para anclar la lectura.
- **Transición Geología → Vegetación → Clima → Geografía**: hoy son cuatro tabs sin transición. La pieza ganaría mucho con un fade de 400 ms entre capas y un texto auxiliar a la izquierda que cambie con el mismo tempo.

### Tarjeta de portada vs. tarjeta de cierre
- La de cierre (cimadevila + texto en cuadro) está mejor compuesta: el texto vive dentro de un panel con fondo `rgba(15,18,28,0.45)` y borde sutil. Aplicar el mismo patrón a la primera diapositiva.

## 3. Plan de mejora priorizado

| Prio | Cambio | Esfuerzo | Riesgo |
|---|---|---|---|
| 1 | Unificar tipografía (cabeceras de capítulo y de gráfico bajo una sola familia serif o sans, no ambas) | bajo | bajo |
| 2 | Aplicar la card del cierre a la portada del primer capítulo | bajo | bajo |
| 3 | Bajar opacidad de la capa de vegetación a 0.50 y comprobar legibilidad | bajo | bajo |
| 4 | Reclasificar litología a 3 grandes grupos cromáticos | medio | medio (requiere reprocesar dato) |
| 5 | Estandarizar acento cromático: naranja `#F44E11` solo para fuego, gris neutro `#6E7A8A` para todo lo demás (ciudades, MVMC, líneas auxiliares) | medio | medio (toca todos los charts) |
| 6 | Añadir transiciones suaves entre tabs Geología/Vegetación/Clima/Geografía | medio | medio |
| 7 | Reemplazar iframes restantes (heatmap temperaturas) por componente nativo Plot con la misma estética | alto | bajo |
| 8 | Repaso global de line-height a 1.6 y max-width 60ch en bloques de texto | bajo | bajo |

## 4. Lo que NO conviene tocar

- La paleta del dNBR (rampa amarillo→rojo→granate) es estándar científico y debe quedarse.
- El comparador de ciudades en barras horizontales — es la lectura más rápida posible.
- La cronología PrazaGal — funciona bien narrativamente.

## 5. Siguiente paso recomendado

Hacer una iteración corta enfocada solo en (1), (2) y (3): tipografía única + card de portada + opacidad vegetación. Es el cambio que más sube la calidad percibida con menos riesgo. (4)-(6) entran en una segunda iteración si queda tiempo de sesión.
