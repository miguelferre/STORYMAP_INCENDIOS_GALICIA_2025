/**
 * "O dÃ­a que se xuntou todo" â€” cronoloxÃ­a dos lumes PrazaGal en xuÃ±o-outubro 2025.
 *
 * Pipeline: scripts/15_cronoloxia.py agrega o ODS de PrazaGal por dÃ­a e exporta
 * un JSON con (a) totais diarios e (b) os 35 incendios â‰¥100 ha do perÃ­odo.
 *
 * Renderiza un Ãºnico panel cunha cuadrÃ­cula de celas (Plot.rectY) por dÃ­a sobre
 * a serie de hectÃ¡reas totais, e un scatter superposto cos grandes incendios
 * (raio = ha). Marca con anotaciÃ³ns os tres dÃ­as pico do 12-15 agosto.
 */
(function (global) {
  const TEXTOS = {
    es: {
      titulo: "El dÃ­a que se juntÃ³ todo",
      subtitulo:
        "Cada barra es la suma de hectÃ¡reas reportadas por PrazaGal ese dÃ­a. Los cÃ­rculos son los 35 incendios que superaron las 100 ha. Entre el 8 y el 15 de agosto, Galicia perdiÃ³ en torno a 100.000 hectÃ¡reas en menos de una semana.",
      pico_12: "12 ago â€” 32 lumes, 48.949 ha",
      pico_13: "13 ago â€” Larouco-Seadur, 23.527 ha",
      pico_15: "15 ago â€” 34 lumes, 14.241 ha",
      pie:
        "Fuente: PrazaGal vÃ­a Lei de Transparencia (CC-BY-NC-SA), agregado por dÃ­a. PerÃ­odo julio-octubre 2025.",
      overview_y: "ha (escala raÃ­z)",
      eje_y: "HectÃ¡reas quemadas / dÃ­a",
      zoom_titulo: "Zoom: 5 al 22 de agosto, la semana en que ardiÃ³ todo",
      tooltip_dia: (d) =>
        `${d.data_str}\n${d.n_incendios} lumes â€” ${Math.round(d.ha_total).toLocaleString("es")} ha\nMaior: ${d.top_concello} / ${d.top_parroquia} (${Math.round(d.top_ha).toLocaleString("es")} ha)`,
      tooltip_grande: (d) =>
        `${d.concello} â€” ${d.parroquia}\n${d.data_str}: ${Math.round(d.hectareas).toLocaleString("es")} ha`,
    },
    gl: {
      titulo: "O dÃ­a que se xuntou todo",
      subtitulo:
        "Cada barra Ã© a suma de hectÃ¡reas reportadas por PrazaGal ese dÃ­a. Os cÃ­rculos son os 35 lumes que pasaron das 100 ha. Entre o 8 e o 15 de agosto, Galicia perdeu arredor de 100.000 hectÃ¡reas en menos dunha semana.",
      pico_12: "12 ago â€” 32 lumes, 48.949 ha",
      pico_13: "13 ago â€” Larouco-Seadur, 23.527 ha",
      pico_15: "15 ago â€” 34 lumes, 14.241 ha",
      pie:
        "Fonte: PrazaGal vÃ­a Lei de Transparencia (CC-BY-NC-SA), agregada por dÃ­a. PerÃ­odo xullo-outubro 2025.",
      overview_y: "ha (escala raÃ­z)",
      eje_y: "HectÃ¡reas queimadas / dÃ­a",
      zoom_titulo: "Zoom: do 5 ao 22 de agosto, a semana na que ardeu todo",
      tooltip_dia: (d) =>
        `${d.data_str}\n${d.n_incendios} lumes â€” ${Math.round(d.ha_total).toLocaleString("gl")} ha\nMaior: ${d.top_concello} / ${d.top_parroquia} (${Math.round(d.top_ha).toLocaleString("gl")} ha)`,
      tooltip_grande: (d) =>
        `${d.concello} â€” ${d.parroquia}\n${d.data_str}: ${Math.round(d.hectareas).toLocaleString("gl")} ha`,
    },
  };

  let cache = null;
  let cargaPromesa = null;

  function cargar() {
    if (cache) return Promise.resolve(cache);
    if (cargaPromesa) return cargaPromesa;
    cargaPromesa = fetch("assets/data/cronoloxia.json")
      .then((r) => r.json())
      .then((j) => {
        cache = j;
        // Convirte data_str a Date para Plot.
        cache.diario.forEach((d) => (d.fecha = new Date(d.data_str + "T00:00:00")));
        cache.grandes.forEach((d) => (d.fecha = new Date(d.data_str + "T00:00:00")));
        return cache;
      });
    return cargaPromesa;
  }

  // Panel superior: visiÃ³n do verÃ¡n enteiro (Xul-Out), barras a escala
  // sqrt para que os dÃ­as pequenos non desaparezan baixo o pico do 12 ago.
  // Sen tooltips nin anotaciÃ³ns; serve de contexto.
  function panelOverview(j, ancho, lang) {
    const Plot = global.Plot;
    const t = TEXTOS[lang] || TEXTOS.es;
    return Plot.plot({
      width: ancho,
      height: 110,
      marginLeft: 56,
      marginRight: 18,
      marginTop: 8,
      marginBottom: 22,
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.7)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "10.5px",
        overflow: "hidden",
      },
      x: {
        label: null,
        type: "time",
        grid: false,
        domain: [new Date("2025-07-01T00:00:00"), new Date("2025-10-01T00:00:00")],
        clip: true,
      },
      y: {
        label: t.overview_y,
        labelAnchor: "top",
        labelOffset: 36,
        type: "sqrt",
        grid: false,
      },
      marks: [
        Plot.rectY(j.diario, {
          x: "fecha",
          y: "ha_total",
          interval: "day",
          fill: "rgba(244, 78, 17, 0.7)",
          stroke: "rgba(244, 78, 17, 0.9)",
          strokeWidth: 0.3,
        }),
        // Sombreado do tramo do panel detalle.
        Plot.rect([{
          x1: new Date("2025-08-05T00:00:00"),
          x2: new Date("2025-08-22T00:00:00"),
          y1: 0,
          y2: 50000,
        }], {
          x1: "x1", x2: "x2", y1: "y1", y2: "y2",
          fill: "rgba(255, 220, 130, 0.18)",
          stroke: "rgba(255, 220, 130, 0.55)",
          strokeWidth: 0.8,
          strokeDasharray: "3 3",
        }),
        Plot.ruleY([0], { stroke: "rgba(255,255,255,0.35)" }),
      ],
    });
  }

  // Panel detalle: zoom Ã¡ semana crÃ­tica (5-22 ago), barras + grandes
  // incendios + anotaciÃ³ns. SÃ³ Plot.rectY ten tip activo, asÃ­ evÃ­tase
  // o solapamento de dous tooltips simultÃ¡neos.
  function panelDetalle(j, ancho, lang) {
    const Plot = global.Plot;
    const t = TEXTOS[lang] || TEXTOS.es;
    const inicio = new Date("2025-08-05T00:00:00");
    const fin = new Date("2025-08-22T00:00:00");
    const enRango = (d) => d.fecha >= inicio && d.fecha <= fin;
    const diarioZoom = j.diario.filter(enRango);
    const grandesZoom = j.grandes.filter(enRango);
    const anotacions = [
      { fecha: new Date("2025-08-12T00:00:00"), txt: t.pico_12, ha: 48949 },
      { fecha: new Date("2025-08-13T00:00:00"), txt: t.pico_13, ha: 25338 },
      { fecha: new Date("2025-08-15T00:00:00"), txt: t.pico_15, ha: 14241 },
    ];
    return Plot.plot({
      width: ancho,
      height: 340,
      marginLeft: 56,
      marginRight: 18,
      marginTop: 28,
      marginBottom: 38,
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.86)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "11.5px",
        overflow: "visible",
      },
      x: {
        label: null,
        type: "time",
        grid: false,
        domain: [inicio, fin],
        clip: true,
        tickFormat: "%d %b",
      },
      y: {
        label: t.eje_y,
        labelAnchor: "top",
        labelOffset: 36,
        grid: true,
        nice: true,
      },
      r: { range: [2, 14], domain: [100, 25000] },
      marks: [
        Plot.rectY(diarioZoom, {
          x: "fecha",
          y: "ha_total",
          interval: "day",
          fill: "rgba(244, 78, 17, 0.55)",
          stroke: "rgba(244, 78, 17, 0.85)",
          strokeWidth: 0.4,
          tip: true,
          title: t.tooltip_dia,
        }),
        Plot.dot(grandesZoom, {
          x: "fecha",
          y: "hectareas",
          r: "hectareas",
          fill: "rgba(255, 220, 130, 0.78)",
          stroke: "rgba(255, 200, 60, 0.95)",
          strokeWidth: 0.7,
          tip: true,
          title: t.tooltip_grande,
        }),
        Plot.text(anotacions, {
          x: "fecha",
          y: "ha",
          text: "txt",
          dy: -10,
          textAnchor: "middle",
          fontWeight: 600,
          fill: "rgba(255,255,255,0.92)",
          stroke: "rgba(0,0,0,0.6)",
          strokeWidth: 4,
          paintOrder: "stroke",
        }),
        Plot.ruleY([0], { stroke: "rgba(255,255,255,0.45)" }),
      ],
    });
  }

  function pintar(host, j, lang) {
    const slot = host.querySelector(".cronoloxia-paneles");
    if (!slot) return;
    const ancho = Math.max(320, Math.min(slot.clientWidth || host.clientWidth || 720, 920));
    slot.innerHTML = "";
    slot.appendChild(panelOverview(j, ancho, lang));
    const t = TEXTOS[lang] || TEXTOS.es;
    const sub = document.createElement("p");
    sub.className = "cronoloxia-subtitulo";
    sub.textContent = t.zoom_titulo;
    slot.appendChild(sub);
    slot.appendChild(panelDetalle(j, ancho, lang));
  }

  function render(host, lang) {
    if (!host) return;
    const t = TEXTOS[lang] || TEXTOS.es;
    host.classList.add("cronoloxia-bloque");
    host.innerHTML = `
      <header class="cronoloxia-cabecera">
        <h3>${t.titulo}</h3>
        <p>${t.subtitulo}</p>
      </header>
      <div class="cronoloxia-paneles"></div>
      <p class="cronoloxia-pie">${t.pie}</p>
    `;
    cargar()
      .then((j) => {
        const dibuxar = () => pintar(host, j, lang);
        const intento = () => {
          const slot = host.querySelector(".cronoloxia-paneles");
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
            if (host.querySelector(".cronoloxia-paneles")) dibuxar();
          });
          ro.observe(host);
        }
      })
      .catch((err) => {
        const slot = host.querySelector(".cronoloxia-paneles");
        if (slot)
          slot.innerHTML = `<div class="cronoloxia-erro">No se pudo cargar la cronologÃ­a: ${err.message}</div>`;
      });
  }

  global.Cronoloxia = { render };
})(window);
