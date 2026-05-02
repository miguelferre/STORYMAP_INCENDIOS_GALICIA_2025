/**
 * "O día que se xuntou todo" — cronoloxía dos lumes PrazaGal en xuño-outubro 2025.
 *
 * Pipeline: scripts/15_cronoloxia.py agrega o ODS de PrazaGal por día e exporta
 * un JSON con (a) totais diarios e (b) os 35 incendios ≥100 ha do período.
 *
 * Renderiza un único panel cunha cuadrícula de celas (Plot.rectY) por día sobre
 * a serie de hectáreas totais, e un scatter superposto cos grandes incendios
 * (raio = ha). Marca con anotacións os tres días pico do 12-15 agosto.
 */
(function (global) {
  const TEXTOS = {
    es: {
      titulo: "El día que se juntó todo",
      subtitulo:
        "Cada barra es la suma de hectáreas reportadas por PrazaGal ese día. Los círculos son los 35 incendios que superaron las 100 ha. Entre el 8 y el 15 de agosto, Galicia perdió en torno a 100.000 hectáreas en menos de una semana.",
      pico_12: "12 ago — 32 lumes, 48.949 ha",
      pico_13: "13 ago — Larouco-Seadur, 23.527 ha",
      pico_15: "15 ago — 34 lumes, 14.241 ha",
      pie:
        "Fuente: PrazaGal vía Lei de Transparencia (CC-BY-NC-SA), agregado por día. Período junio-octubre 2025.",
      eje_y: "Hectáreas quemadas / día",
      tooltip_dia: (d) =>
        `${d.data_str}\n${d.n_incendios} lumes — ${Math.round(d.ha_total).toLocaleString("es")} ha\nMaior: ${d.top_concello} / ${d.top_parroquia} (${Math.round(d.top_ha).toLocaleString("es")} ha)`,
      tooltip_grande: (d) =>
        `${d.concello} — ${d.parroquia}\n${d.data_str}: ${Math.round(d.hectareas).toLocaleString("es")} ha`,
    },
    gl: {
      titulo: "O día que se xuntou todo",
      subtitulo:
        "Cada barra é a suma de hectáreas reportadas por PrazaGal ese día. Os círculos son os 35 lumes que pasaron das 100 ha. Entre o 8 e o 15 de agosto, Galicia perdeu arredor de 100.000 hectáreas en menos dunha semana.",
      pico_12: "12 ago — 32 lumes, 48.949 ha",
      pico_13: "13 ago — Larouco-Seadur, 23.527 ha",
      pico_15: "15 ago — 34 lumes, 14.241 ha",
      pie:
        "Fonte: PrazaGal vía Lei de Transparencia (CC-BY-NC-SA), agregada por día. Período xuño-outubro 2025.",
      eje_y: "Hectáreas queimadas / día",
      tooltip_dia: (d) =>
        `${d.data_str}\n${d.n_incendios} lumes — ${Math.round(d.ha_total).toLocaleString("gl")} ha\nMaior: ${d.top_concello} / ${d.top_parroquia} (${Math.round(d.top_ha).toLocaleString("gl")} ha)`,
      tooltip_grande: (d) =>
        `${d.concello} — ${d.parroquia}\n${d.data_str}: ${Math.round(d.hectareas).toLocaleString("gl")} ha`,
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

  function panel(j, ancho, lang) {
    const Plot = global.Plot;
    const t = TEXTOS[lang] || TEXTOS.es;
    const anotacions = [
      { fecha: new Date("2025-08-12T00:00:00"), txt: t.pico_12, ha: 48949 },
      { fecha: new Date("2025-08-13T00:00:00"), txt: t.pico_13, ha: 25338 },
      { fecha: new Date("2025-08-15T00:00:00"), txt: t.pico_15, ha: 14241 },
    ];
    return Plot.plot({
      width: ancho,
      height: 420,
      marginLeft: 56,
      marginRight: 18,
      marginTop: 22,
      marginBottom: 38,
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.86)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "11.5px",
        overflow: "visible",
      },
      x: { label: null, type: "time", grid: false },
      y: {
        label: t.eje_y,
        labelAnchor: "top",
        labelOffset: 36,
        grid: true,
        nice: true,
      },
      r: { range: [2, 14], domain: [100, 25000] },
      marks: [
        Plot.rectY(j.diario, {
          x: "fecha",
          y: "ha_total",
          interval: "day",
          fill: "rgba(244, 78, 17, 0.55)",
          stroke: "rgba(244, 78, 17, 0.85)",
          strokeWidth: 0.4,
          tip: true,
          title: t.tooltip_dia,
        }),
        Plot.dot(j.grandes, {
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
    slot.appendChild(panel(j, ancho, lang));
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
          slot.innerHTML = `<div class="cronoloxia-erro">No se pudo cargar la cronología: ${err.message}</div>`;
      });
  }

  global.Cronoloxia = { render };
})(window);
