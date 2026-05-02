/**
 * "De quén son os montes que arden?" — propiedade do monte e exposición ao lume.
 *
 * Cruce de PrazaGal × parroquias (IGE/Xunta) × MVMC (Oficina Virtual do Medio
 * Rural, marzo 2024). Pipeline en scripts/10_*.py e 11_*.py.
 *
 * Renderiza dous paneis con Observable Plot:
 *   - Panel A: coroplético Galicia coloreado por % superficie MVMC do concello,
 *              con puntos por parroquia afectada (raio = ha queimadas).
 *   - Panel B: barras apiladas comparando a fracción MVMC en a) superficie de
 *              Galicia b) ha estimadas queimadas en 2025.
 */
(function (global) {
  const COR_FILL_DOM = [0, 5, 15, 30, 50, 80];
  const COR_FILL_RNG = ["#1a1a1a", "#3b1f0d", "#7a3a14", "#c25f1c", "#ee8c2a", "#fbd45a"];
  const COR_PUNTO = "#FF3B00";
  const COR_PUNTO_BORDE = "rgba(255,255,255,0.92)";

  const TEXTOS = {
    es: {
      titulo: "De quién son los montes que arden",
      subtitulo:
        "Los montes vecinales en mano común (MVMC) ocupan el 22% de Galicia, pero concentran el 39% de la superficie estimada quemada en 2025: una incidencia que casi duplica lo que les correspondería por superficie.",
      panel_mapa: "% del concello clasificado como MVMC",
      panel_mapa_nota:
        "Cada punto naranja es una parroquia donde PrazaGal documenta al menos un incendio en 2025; el tamaño es proporcional a las hectáreas quemadas.",
      panel_compara: "Distribución por régimen de propiedad",
      pie:
        "Fuentes: Rexistro de Montes Vecinais en Man Común (Xunta de Galicia, marzo 2024); Mapa de Parroquias (IET, Xunta); incendios 2025 vía PrazaGal (CC-BY-NC-SA). Las hectáreas por régimen son una estimación a escala parroquial: dentro de cada parroquia se reparte el área quemada proporcionalmente al peso del MVMC.",
      legend_label: "% MVMC",
      barras: {
        territorio: "Superficie de Galicia",
        queimadas: "Hectáreas quemadas en 2025 (estim.)",
        mvmc: "Monte vecinal en mano común",
        outras: "Otras propiedades (privadas, públicas, sin titular)",
      },
      tooltip_concello: (d) =>
        `${d.properties.CONCELLO}\n${d.properties.mvmc_pct.toFixed(1)}% MVMC` +
        (d.properties.ha_quemadas > 0
          ? `\n${Math.round(d.properties.ha_quemadas).toLocaleString("es")} ha quemadas en 2025`
          : ""),
      tooltip_parr: (d) =>
        `${d.PARROQUIA} (${d.CONCELLO})\n${Math.round(d.ha_quemadas).toLocaleString("es")} ha quemadas\nMVMC en la parroquia: ${d.mvmc_pct.toFixed(1)}%`,
    },
    gl: {
      titulo: "De quén son os montes que arden",
      subtitulo:
        "Os montes veciñais en man común (MVMC) ocupan o 22% de Galicia, pero concentran o 39% da superficie estimada queimada en 2025: unha incidencia que case duplica o que lles correspondería por superficie.",
      panel_mapa: "% do concello clasificado como MVMC",
      panel_mapa_nota:
        "Cada punto laranxa é unha parroquia onde PrazaGal documenta polo menos un lume en 2025; o tamaño é proporcional ás hectáreas queimadas.",
      panel_compara: "Distribución por réxime de propiedade",
      pie:
        "Fontes: Rexistro de Montes Veciñais en Man Común (Xunta de Galicia, marzo 2024); Mapa de Parroquias (IET, Xunta); lumes 2025 vía PrazaGal (CC-BY-NC-SA). As hectáreas por réxime son unha estimación á escala parroquial: dentro de cada parroquia repártese a área queimada proporcionalmente ao peso do MVMC.",
      legend_label: "% MVMC",
      barras: {
        territorio: "Superficie de Galicia",
        queimadas: "Hectáreas queimadas en 2025 (estim.)",
        mvmc: "Monte veciñal en man común",
        outras: "Outras propiedades (privadas, públicas, sen titular)",
      },
      tooltip_concello: (d) =>
        `${d.properties.CONCELLO}\n${d.properties.mvmc_pct.toFixed(1)}% MVMC` +
        (d.properties.ha_quemadas > 0
          ? `\n${Math.round(d.properties.ha_quemadas).toLocaleString("gl")} ha queimadas en 2025`
          : ""),
      tooltip_parr: (d) =>
        `${d.PARROQUIA} (${d.CONCELLO})\n${Math.round(d.ha_quemadas).toLocaleString("gl")} ha queimadas\nMVMC na parroquia: ${d.mvmc_pct.toFixed(1)}%`,
    },
  };

  let cache = null;
  let cargaPromesa = null;

  function cargar() {
    if (cache) return Promise.resolve(cache);
    if (cargaPromesa) return cargaPromesa;
    cargaPromesa = Promise.all([
      fetch("assets/data/propiedade_galicia.geojson").then((r) => r.json()),
      fetch("assets/data/propiedade_puntos.json").then((r) => r.json()),
      fetch("assets/data/propiedade_resumo.json").then((r) => r.json()),
    ]).then(([galicia, puntos, resumo]) => {
      cache = { galicia, puntos, resumo };
      return cache;
    });
    return cargaPromesa;
  }

  function panelMapa(galicia, puntos, ancho, lang) {
    const Plot = global.Plot;
    const t = TEXTOS[lang] || TEXTOS.es;
    const alto = Math.round(ancho * 0.65);
    return Plot.plot({
      width: ancho,
      height: alto,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 30,
      projection: { type: "mercator", domain: galicia, inset: 8 },
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.86)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "11.5px",
        overflow: "visible",
      },
      color: {
        type: "threshold",
        domain: COR_FILL_DOM.slice(1),
        range: COR_FILL_RNG,
        legend: true,
        label: t.legend_label,
        style: { color: "rgba(255,255,255,0.86)" },
      },
      r: { range: [1.2, 14], domain: [0, 25000] },
      marks: [
        // Coroplético sin tooltip propio para evitar dos popups simultáneos
        // cuando el cursor cae sobre una parroquia con incendio (el del punto
        // es más específico y ya incluye el % MVMC de la parroquia).
        Plot.geo(galicia, {
          fill: (d) => d.properties.mvmc_pct,
          stroke: "rgba(255,255,255,0.18)",
          strokeWidth: 0.4,
        }),
        Plot.dot(puntos.filter((d) => d.ha_quemadas >= 1), {
          x: "lon",
          y: "lat",
          r: "ha_quemadas",
          fill: COR_PUNTO,
          fillOpacity: 0.78,
          stroke: COR_PUNTO_BORDE,
          strokeOpacity: 0.9,
          strokeWidth: 0.7,
          tip: true,
          title: t.tooltip_parr,
        }),
      ],
    });
  }

  function panelCompara(resumo, ancho, lang) {
    const Plot = global.Plot;
    const t = TEXTOS[lang] || TEXTOS.es;
    const G = resumo.galicia;
    const I = resumo.incendios_2025;
    const datos = [
      { categoria: t.barras.territorio, regime: t.barras.mvmc, pct: G.pct_mvmc_galicia, ha: G.area_mvmc_ha, total: G.area_total_ha },
      { categoria: t.barras.territorio, regime: t.barras.outras, pct: 100 - G.pct_mvmc_galicia, ha: G.area_total_ha - G.area_mvmc_ha, total: G.area_total_ha },
      { categoria: t.barras.queimadas, regime: t.barras.mvmc, pct: I.pct_quemadas_mvmc_estimado, ha: I.ha_estimadas_mvmc, total: I.ha_quemadas_total },
      { categoria: t.barras.queimadas, regime: t.barras.outras, pct: 100 - I.pct_quemadas_mvmc_estimado, ha: I.ha_estimadas_non_mvmc, total: I.ha_quemadas_total },
    ];
    return Plot.plot({
      width: ancho,
      height: 180,
      marginLeft: 200,
      marginRight: 28,
      marginTop: 14,
      marginBottom: 36,
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.86)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "11.5px",
        overflow: "visible",
      },
      x: { label: "%", domain: [0, 100], grid: true, tickFormat: (n) => `${n}%` },
      y: { label: null },
      color: {
        domain: [t.barras.mvmc, t.barras.outras],
        range: ["#F44E11", "#5C5147"],
        legend: true,
        label: null,
        style: { color: "rgba(255,255,255,0.86)" },
      },
      marks: [
        Plot.barX(datos, {
          x: "pct",
          y: "categoria",
          fill: "regime",
          tip: true,
          title: (d) =>
            `${d.categoria}\n${d.regime}: ${d.pct.toFixed(1)}%\n${Math.round(d.ha).toLocaleString(lang)} ha de ${Math.round(d.total).toLocaleString(lang)} ha totais`,
        }),
        Plot.text(
          datos.filter((d) => d.regime === t.barras.mvmc),
          {
            x: (d) => d.pct / 2,
            y: "categoria",
            text: (d) => `${d.pct.toFixed(1)}%`,
            fill: "white",
            fontWeight: 700,
            fontSize: 12,
          }
        ),
        Plot.ruleX([0], { stroke: "rgba(255,255,255,0.45)" }),
      ],
    });
  }

  function pintar(host, j, lang) {
    const t = TEXTOS[lang] || TEXTOS.es;
    const slot = host.querySelector(".propiedade-paneles");
    if (!slot) return;
    const ancho = Math.max(
      320,
      Math.min(slot.clientWidth || host.clientWidth || 720, 920)
    );
    slot.innerHTML = "";

    const tA = document.createElement("p");
    tA.className = "propiedade-subtitulo";
    tA.textContent = t.panel_mapa;
    slot.appendChild(tA);
    slot.appendChild(panelMapa(j.galicia, j.puntos, ancho, lang));
    const notaMapa = document.createElement("p");
    notaMapa.className = "propiedade-nota";
    notaMapa.textContent = t.panel_mapa_nota;
    slot.appendChild(notaMapa);

    const tB = document.createElement("p");
    tB.className = "propiedade-subtitulo";
    tB.textContent = t.panel_compara;
    slot.appendChild(tB);
    slot.appendChild(panelCompara(j.resumo, ancho, lang));
  }

  function render(host, lang) {
    if (!host) return;
    const t = TEXTOS[lang] || TEXTOS.es;
    host.classList.add("propiedade-bloque");
    host.innerHTML = `
      <header class="propiedade-cabecera">
        <h3>${t.titulo}</h3>
        <p>${t.subtitulo}</p>
      </header>
      <div class="propiedade-paneles"></div>
      <p class="propiedade-pie">${t.pie}</p>
    `;
    cargar()
      .then((j) => {
        const dibuxar = () => pintar(host, j, lang);
        const intento = () => {
          const slot = host.querySelector(".propiedade-paneles");
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
            if (host.querySelector(".propiedade-paneles")) dibuxar();
          });
          ro.observe(host);
        }
      })
      .catch((err) => {
        const slot = host.querySelector(".propiedade-paneles");
        if (slot)
          slot.innerHTML = `<div class="propiedade-erro">No se pudo cargar el dataset de propiedad: ${err.message}</div>`;
      });
  }

  global.PropiedadeMonte = { render };
})(window);
