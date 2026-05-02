/**
 * "A pegada do lume" — análise post-incendio Larouco-Seadur con dNBR Sentinel-2.
 *
 * Pipeline en scripts/14_dnbr_larouco.py: dúas escenas Sentinel-2 L2A vía
 * Microsoft Planetary Computer (xullo 2025 pre, outubro 2025 post),
 * NBR = (B08 - B12)/(B08 + B12), dNBR = NBRpre - NBRpost, reclasificación
 * Key & Benson (2006) en seis niveis de severidade.
 *
 * Renderiza dous paneis con Observable Plot:
 *   - Panel A: mapa coas clases de severidade moderada-baixa, moderada-alta
 *              e alta vectorizadas sobre o bbox do incendio.
 *   - Panel B: barras horizontales coa distribución de hectáreas por clase.
 */
(function (global) {
  const ETIQUETAS = {
    es: {
      "Rebrote post-lume": "Rebrote post-fuego",
      "Non queimado": "No quemado",
      "Severidade baixa": "Severidad baja",
      "Severidade moderada-baixa": "Severidad moderada-baja",
      "Severidade moderada-alta": "Severidad moderada-alta",
      "Severidade alta": "Severidad alta",
    },
    gl: {
      "Rebrote post-lume": "Rebrote post-lume",
      "Non queimado": "Non queimado",
      "Severidade baixa": "Severidade baixa",
      "Severidade moderada-baixa": "Severidade moderada-baixa",
      "Severidade moderada-alta": "Severidade moderada-alta",
      "Severidade alta": "Severidade alta",
    },
  };

  function tr(lang, etq) {
    const tabla = ETIQUETAS[lang] || ETIQUETAS.es;
    return tabla[etq] || etq;
  }

  const TEXTOS = {
    es: {
      titulo: "La huella del fuego",
      subtitulo:
        "Diferencia del Normalized Burn Ratio (dNBR) calculada con Sentinel-2 sobre el perímetro Larouco-Seadur: imagen pre-fuego del 24 de julio de 2025 contra una imagen post-fuego del 10 de octubre de 2025. La rampa de severidad sigue la clasificación Key & Benson (2006).",
      panel_mapa: "Severidad reclasificada (clases moderada-baja, moderada-alta y alta)",
      panel_barras: "Hectáreas por clase de severidad",
      pie:
        "Datos: Sentinel-2 L2A (Copernicus) servidos por Microsoft Planetary Computer. Cálculo dNBR + reclasificación KB-2006 con rasterio + xarray.",
    },
    gl: {
      titulo: "A pegada do lume",
      subtitulo:
        "Diferenza do Normalized Burn Ratio (dNBR) calculada con Sentinel-2 sobre o perímetro Larouco-Seadur: imaxe pre-lume do 24 de xullo de 2025 fronte a unha imaxe post-lume do 10 de outubro de 2025. A rampa de severidade segue a clasificación Key & Benson (2006).",
      panel_mapa: "Severidade reclasificada (clases moderada-baixa, moderada-alta e alta)",
      panel_barras: "Hectáreas por clase de severidade",
      pie:
        "Datos: Sentinel-2 L2A (Copernicus) servidos por Microsoft Planetary Computer. Cálculo dNBR + reclasificación KB-2006 con rasterio + xarray.",
    },
  };

  let cache = null;
  let cargaPromesa = null;

  function cargar() {
    if (cache) return Promise.resolve(cache);
    if (cargaPromesa) return cargaPromesa;
    cargaPromesa = Promise.all([
      fetch("assets/data/dnbr_larouco_clases.geojson").then((r) => r.json()),
      fetch("assets/data/dnbr_larouco_resumo.json").then((r) => r.json()),
    ]).then(([clases, resumo]) => {
      cache = { clases, resumo };
      return cache;
    });
    return cargaPromesa;
  }

  function panelMapa(clases, resumo, ancho, lang) {
    const Plot = global.Plot;
    const claves = ["Severidade moderada-baixa", "Severidade moderada-alta", "Severidade alta"];
    const ordeColor = claves.map((k) => tr(lang, k));
    const cores = ["#fdae61", "#d73027", "#7f1d1d"];
    return Plot.plot({
      width: ancho,
      height: Math.round(ancho * 0.7),
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 30,
      projection: { type: "mercator", domain: clases, inset: 14 },
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.86)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "11.5px",
        overflow: "visible",
      },
      color: {
        domain: ordeColor,
        range: cores,
        legend: true,
        label: null,
        style: { color: "rgba(255,255,255,0.86)" },
      },
      marks: [
        Plot.geo({ type: "Sphere" }, { fill: "rgba(15,18,28,0.55)", stroke: "none" }),
        Plot.graticule({ stroke: "rgba(255,255,255,0.08)", strokeWidth: 0.5 }),
        Plot.geo(clases, {
          fill: (d) => tr(lang, d.properties.etiqueta),
          stroke: "rgba(0,0,0,0.4)",
          strokeWidth: 0.3,
          tip: true,
          title: (d) => tr(lang, d.properties.etiqueta),
        }),
      ],
    });
  }

  function panelBarras(resumo, ancho, lang) {
    const Plot = global.Plot;
    const datos = resumo.clases.filter((c) => c.indice >= 1).map((c) => ({
      ...c,
      etq: tr(lang, c.etiqueta),
    }));
    return Plot.plot({
      width: ancho,
      height: 240,
      marginLeft: 200,
      marginRight: 60,
      marginTop: 14,
      marginBottom: 36,
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.86)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "11.5px",
        overflow: "visible",
      },
      x: { label: "ha", labelAnchor: "right", grid: true,
           tickFormat: (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`) },
      y: { label: null, domain: datos.map((d) => d.etq) },
      marks: [
        Plot.barX(datos, {
          x: "ha",
          y: "etq",
          fill: (d) => d.color,
          tip: true,
          title: (d) => `${d.etq}\n${Math.round(d.ha).toLocaleString(lang)} ha (${d.pct_valido.toFixed(1)}% del bbox)`,
        }),
        Plot.text(datos, {
          x: "ha",
          y: "etq",
          text: (d) => `${Math.round(d.ha).toLocaleString(lang)} ha`,
          dx: 6,
          textAnchor: "start",
          fill: "rgba(255,255,255,0.92)",
        }),
        Plot.ruleX([0], { stroke: "rgba(255,255,255,0.45)" }),
      ],
    });
  }

  function pintar(host, j, lang) {
    const t = TEXTOS[lang] || TEXTOS.es;
    const slot = host.querySelector(".dnbr-paneles");
    if (!slot) return;
    const ancho = Math.max(320, Math.min(slot.clientWidth || host.clientWidth || 720, 920));
    slot.innerHTML = "";

    const tA = document.createElement("p");
    tA.className = "dnbr-subtitulo";
    tA.textContent = t.panel_mapa;
    slot.appendChild(tA);
    slot.appendChild(panelMapa(j.clases, j.resumo, ancho, lang));

    // Si existe un host externo visible para las barras (`#grafica-dnbr-bars`),
    // renderiza ahí; si no (móvil con desktop-expl oculto, o sin host), las
    // pinta debajo del mapa.
    const barsHost = document.getElementById("grafica-dnbr-bars");
    const barsHostVisible = barsHost && barsHost.offsetParent !== null;
    if (barsHostVisible) {
      barsHost.classList.add("dnbr-bloque-bars");
      barsHost.innerHTML = "";
      const tB = document.createElement("p");
      tB.className = "dnbr-subtitulo";
      tB.textContent = t.panel_barras;
      barsHost.appendChild(tB);
      const anchoB = Math.max(280, Math.min(barsHost.clientWidth || 420, 600));
      barsHost.appendChild(panelBarras(j.resumo, anchoB, lang));
    } else {
      const tB = document.createElement("p");
      tB.className = "dnbr-subtitulo";
      tB.textContent = t.panel_barras;
      slot.appendChild(tB);
      slot.appendChild(panelBarras(j.resumo, ancho, lang));
    }
  }

  function render(host, lang) {
    if (!host) return;
    const t = TEXTOS[lang] || TEXTOS.es;
    host.classList.add("dnbr-bloque");
    host.innerHTML = `
      <header class="dnbr-cabecera">
        <h3>${t.titulo}</h3>
        <p>${t.subtitulo}</p>
      </header>
      <div class="dnbr-paneles"></div>
      <p class="dnbr-pie">${t.pie}</p>
    `;
    cargar()
      .then((j) => {
        const dibuxar = () => pintar(host, j, lang);
        const intento = () => {
          const slot = host.querySelector(".dnbr-paneles");
          if (!slot) return;
          if ((slot.clientWidth || 0) < 200) {
            requestAnimationFrame(intento);
            return;
          }
          dibuxar();
        };
        intento();
        if (!host._observado) {
          host._observado = true;
          const ro = new ResizeObserver(() => {
            if (host.querySelector(".dnbr-paneles")) dibuxar();
          });
          ro.observe(host);
        }
      })
      .catch((err) => {
        const slot = host.querySelector(".dnbr-paneles");
        if (slot)
          slot.innerHTML = `<div class="dnbr-erro">No se pudo cargar el dataset dNBR: ${err.message}</div>`;
      });
  }

  global.DnbrLarouco = { render };
})(window);
