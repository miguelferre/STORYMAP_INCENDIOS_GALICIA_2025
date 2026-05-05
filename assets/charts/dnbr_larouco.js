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
        "Diferencia del Normalized Burn Ratio (dNBR) sobre Sentinel-2 (24 jul vs 10 oct 2025), reclasificada según Key & Benson 2006. Sobre el dNBR superponemos la capa SILVIS Global WUI 2020 (Schug et al. 2023, ráster 10 m): bordes amarillos y cian marcan núcleos rurales en contacto con el monte combustible.",
      panel_mapa: "Severidad reclasificada (clases moderada-baja, moderada-alta y alta)",
      panel_barras: "Hectáreas por clase de severidad",
      sev_titulo: "Severidad dNBR",
      wui_titulo: "Wildland-Urban Interface",
      wui_forestal: "WUI forestal-matorral",
      wui_pradeira: "WUI pradera",
      pie:
        "Datos: Sentinel-2 L2A (Copernicus / Microsoft Planetary Computer); Wildland-Urban Interface: Schug et al. 2023 (DOI 10.5281/zenodo.7941460).",
    },
    gl: {
      titulo: "A pegada do lume",
      subtitulo:
        "Diferenza do Normalized Burn Ratio (dNBR) sobre Sentinel-2 (24 xul vs 10 out 2025), reclasificada segundo Key & Benson 2006. Sobre o dNBR superpoñemos a capa SILVIS Global WUI 2020 (Schug et al. 2023, ráster 10 m): bordes amarelos e cian marcan núcleos rurais en contacto co monte combustible.",
      panel_mapa: "Severidade reclasificada (clases moderada-baixa, moderada-alta e alta)",
      panel_barras: "Hectáreas por clase de severidade",
      sev_titulo: "Severidade dNBR",
      wui_titulo: "Wildland-Urban Interface",
      wui_forestal: "WUI forestal-matorral",
      wui_pradeira: "WUI pradeira",
      pie:
        "Datos: Sentinel-2 L2A (Copernicus / Microsoft Planetary Computer); Wildland-Urban Interface: Schug et al. 2023 (DOI 10.5281/zenodo.7941460).",
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
    const datos = resumo.clases.filter((c) => c.indice >= 3).map((c) => ({
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
    if (!slot) {
      return;
    }
    // El mapa de severidad ahora se renderiza como capa Mapbox sobre el
    // basemap real (DNBR_LAROUCO en index.html). Aquí ya no pintamos un
    // mapa SVG; el panel del capítulo sólo conserva la leyenda de severidad
    // como ayuda al lector.
    slot.innerHTML = "";
    const lex = document.createElement("div");
    lex.className = "dnbr-leyenda";
    lex.innerHTML = `
      <div class="dnbr-leyenda-grupo">
        <span class="dnbr-leyenda-titulo">${t.sev_titulo}</span>
        <span><i style="background:#fdae61"></i>${tr(lang, "Severidade moderada-baixa")}</span>
        <span><i style="background:#d73027"></i>${tr(lang, "Severidade moderada-alta")}</span>
        <span><i style="background:#7f1d1d"></i>${tr(lang, "Severidade alta")}</span>
      </div>
      <div class="dnbr-leyenda-grupo">
        <span class="dnbr-leyenda-titulo">${t.wui_titulo}</span>
        <span><i class="dnbr-leyenda-linea" style="border-color:#c084fc"></i>${t.wui_forestal}</span>
        <span><i class="dnbr-leyenda-linea" style="border-color:#38bdf8"></i>${t.wui_pradeira}</span>
      </div>
    `;
    slot.appendChild(lex);

    // Las barras siguen renderizándose: si hay host externo (lateral derecho),
    // ahí; si no, al final del bloque del capítulo.
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
      const anchoBars = Math.max(320, Math.min(slot.clientWidth || host.clientWidth || 720, 920));
      slot.appendChild(panelBarras(j.resumo, anchoBars, lang));
    }
  }

  function render(host, lang) {
    if (!host) return;
    const t = TEXTOS[lang] || TEXTOS.es;
    // O capítulo xa ten o título e a explicación na propia card. Aquí só
    // renderizamos a leyenda compacta (severidade dNBR + WUI) e a cita.
    host.classList.add("dnbr-bloque", "dnbr-bloque-compacto");
    host.innerHTML = `
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
