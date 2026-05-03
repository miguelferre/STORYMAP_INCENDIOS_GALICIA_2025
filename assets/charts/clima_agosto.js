/**
 * Condiciones meteorológicas del evento agosto 2025 — ERA5 reanalysis.
 * Dos paneles: temperatura máxima diaria y precipitación acumulada.
 * Datos: scripts/19+20, fuente ERA5 ECMWF vía CDS API.
 */
(function (global) {
  const TEXTOS = {
    es: {
      titulo: "Las condiciones que lo hicieron posible",
      subtitulo_temp: "Temperatura máxima diaria (°C) — media sobre Galicia",
      subtitulo_prec: "Precipitación diaria (mm) — media sobre Galicia",
      eje_temp: "Tmax (°C)",
      eje_prec: "Precip. (mm)",
      pico: "12 ago — pico del evento",
      fuente: "Fuente: ERA5 reanalysis (ECMWF/Copernicus). Media espacial sobre la bbox de Galicia (41.8°N–43.8°N, 9.4°W–6.7°W). Resolución ~31 km.",
      tooltip_temp: (d) => `${d.fecha}\nTmax: ${d.tmax}°C\nTmin: ${d.tmin}°C`,
      tooltip_prec: (d) => `${d.fecha}\nPrecipitación: ${d.precip_mm} mm`,
    },
    gl: {
      titulo: "As condicións que o fixeron posible",
      subtitulo_temp: "Temperatura máxima diaria (°C) — media sobre Galicia",
      subtitulo_prec: "Precipitación diaria (mm) — media sobre Galicia",
      eje_temp: "Tmax (°C)",
      eje_prec: "Precipitación (mm)",
      pico: "12 ago — pico do evento",
      fuente: "Fonte: ERA5 reanalysis (ECMWF/Copernicus). Media espacial sobre a bbox de Galicia (41.8°N–43.8°N, 9.4°W–6.7°W). Resolución ~31 km.",
      tooltip_temp: (d) => `${d.fecha}\nTmax: ${d.tmax}°C\nTmin: ${d.tmin}°C`,
      tooltip_prec: (d) => `${d.fecha}\nPrecipitación: ${d.precip_mm} mm`,
    },
  };

  let cache = null;
  let cargaPromesa = null;

  function cargar() {
    if (cache) return Promise.resolve(cache);
    if (cargaPromesa) return cargaPromesa;
    cargaPromesa = fetch("assets/data/era5_agosto2025.json")
      .then((r) => r.json())
      .then((j) => {
        j.forEach((d) => (d._fecha = new Date(d.fecha + "T12:00:00")));
        cache = j;
        return j;
      });
    return cargaPromesa;
  }

  function panelTemp(datos, ancho, lang) {
    const Plot = global.Plot;
    const t = TEXTOS[lang] || TEXTOS.es;
    const pico = new Date("2025-08-12T12:00:00");

    return Plot.plot({
      width: ancho,
      height: 200,
      marginLeft: 48,
      marginRight: 16,
      marginTop: 20,
      marginBottom: 32,
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.85)",
        fontFamily: "system-ui,-apple-system,sans-serif",
        fontSize: "11px",
        overflow: "hidden",
      },
      x: { type: "band", domain: datos.map((d) => d.fecha), tickRotate: -45,
           ticks: datos.filter((_, i) => i % 4 === 0).map((d) => d.fecha),
           label: null },
      y: { label: t.eje_temp, labelAnchor: "top", labelOffset: 32,
           domain: [15, Math.ceil(Math.max(...datos.map((d) => d.tmax)) / 5) * 5],
           grid: true },
      marks: [
        Plot.barY(datos, {
          x: "fecha", y: "tmax",
          fill: (d) => d.fecha === "2025-08-12" ? "#F44E11" : "rgba(244,78,17,0.5)",
          tip: true, title: t.tooltip_temp,
        }),
        Plot.ruleX([{ fecha: "2025-08-12" }], {
          x: "fecha", stroke: "#F44E11", strokeWidth: 1.5,
          strokeDasharray: "4 3",
        }),
        Plot.text([{ fecha: "2025-08-12", y: Math.max(...datos.map((d) => d.tmax)) }], {
          x: "fecha", y: "y", text: () => t.pico,
          dy: -8, fontSize: 10, fill: "rgba(255,255,255,0.75)",
          textAnchor: "middle",
        }),
        Plot.ruleY([0], { stroke: "rgba(255,255,255,0.3)" }),
      ],
    });
  }

  function panelPrec(datos, ancho, lang) {
    const Plot = global.Plot;
    const t = TEXTOS[lang] || TEXTOS.es;

    return Plot.plot({
      width: ancho,
      height: 160,
      marginLeft: 48,
      marginRight: 16,
      marginTop: 12,
      marginBottom: 32,
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.85)",
        fontFamily: "system-ui,-apple-system,sans-serif",
        fontSize: "11px",
        overflow: "hidden",
      },
      x: { type: "band", domain: datos.map((d) => d.fecha), tickRotate: -45,
           ticks: datos.filter((_, i) => i % 4 === 0).map((d) => d.fecha),
           label: null },
      y: { label: t.eje_prec, labelAnchor: "top", labelOffset: 32,
           grid: true, nice: true },
      marks: [
        Plot.barY(datos, {
          x: "fecha", y: "precip_mm",
          fill: "rgba(100,180,255,0.7)",
          stroke: "rgba(100,180,255,0.9)", strokeWidth: 0.4,
          tip: true, title: t.tooltip_prec,
        }),
        Plot.ruleY([0], { stroke: "rgba(255,255,255,0.3)" }),
      ],
    });
  }

  function pintar(host, datos, lang) {
    const slot = host.querySelector(".clima-agosto-paneles");
    if (!slot) return;
    const ancho = Math.max(280, Math.min(slot.clientWidth || 680, 860));
    const t = TEXTOS[lang] || TEXTOS.es;
    slot.innerHTML = "";

    const lTemp = document.createElement("p");
    lTemp.className = "clima-agosto-label";
    lTemp.textContent = t.subtitulo_temp;
    slot.appendChild(lTemp);
    slot.appendChild(panelTemp(datos, ancho, lang));

    const lPrec = document.createElement("p");
    lPrec.className = "clima-agosto-label";
    lPrec.textContent = t.subtitulo_prec;
    slot.appendChild(lPrec);
    slot.appendChild(panelPrec(datos, ancho, lang));
  }

  function render(host, lang) {
    if (!host) return;
    const t = TEXTOS[lang] || TEXTOS.es;
    host.classList.add("clima-agosto-bloque");
    host.innerHTML = `
      <header class="clima-agosto-cabecera">
        <h3>${t.titulo}</h3>
      </header>
      <div class="clima-agosto-paneles"></div>
      <p class="clima-agosto-pie">${t.fuente}</p>
    `;
    cargar().then((datos) => {
      const slot = host.querySelector(".clima-agosto-paneles");
      const dibuxar = () => pintar(host, datos, lang);
      const intento = () => {
        if (!slot) return;
        if ((slot.clientWidth || 0) < 200) { requestAnimationFrame(intento); return; }
        dibuxar();
      };
      intento();
      if (!host._observado) {
        host._observado = true;
        new ResizeObserver(() => { if (host.querySelector(".clima-agosto-paneles")) dibuxar(); }).observe(host);
      }
    }).catch((err) => {
      const slot = host.querySelector(".clima-agosto-paneles");
      if (slot) slot.innerHTML = `<p style="color:rgba(255,100,100,0.8)">Error cargando datos ERA5: ${err.message}</p>`;
    });
  }

  global.ClimaAgosto = { render };
})(window);
