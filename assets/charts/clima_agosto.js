(function (global) {
  const TEXTOS = {
    es: {
      label_temp:    "Temperatura diaria (°C) — interior de Ourense, zona del incendio",
      label_precip:  "Precipitación diaria (mm) — interior de Ourense",
      leyenda_max:   "Tmax",
      leyenda_media: "Tmedia",
      leyenda_min:   "Tmin",
      ref_temp:      "30 °C",
      ref_precip:    "~0.8 mm/día\nmedia agosto",
      pico_calor:    "Pico de calor\n10 ago — 33.7 °C",
      pico_evento:   "12 ago\npico del evento",
      pie: "Fuente: ERA5, ECMWF/Copernicus. Media espacial zona interior de Ourense (42,0–42,5°N, 7,75–7,0°W). Resolución ~31 km.",
      tip_temp:  (d) => `${d.fecha}\nTmax: ${d.tmax} °C\nTmedia: ${d.tmedia} °C\nTmin: ${d.tmin} °C`,
      tip_prec:  (d) => `${d.fecha}\nPrecipitación: ${d.precip_mm} mm`,
    },
    gl: {
      label_temp:    "Temperatura diaria (°C) — interior de Ourense, zona do incendio",
      label_precip:  "Precipitación diaria (mm) — interior de Ourense",
      leyenda_max:   "Tmax",
      leyenda_media: "Tmedia",
      leyenda_min:   "Tmin",
      ref_temp:      "30 °C",
      ref_precip:    "~0.8 mm/día\nmedia agosto",
      pico_calor:    "Pico de calor\n10 ago — 33.7 °C",
      pico_evento:   "12 ago\npico do evento",
      pie: "Fonte: ERA5, ECMWF/Copernicus. Media espacial zona interior de Ourense (42,0–42,5°N, 7,75–7,0°W). Resolución ~31 km.",
      tip_temp:  (d) => `${d.fecha}\nTmax: ${d.tmax} °C\nTmedia: ${d.tmedia} °C\nTmin: ${d.tmin} °C`,
      tip_prec:  (d) => `${d.fecha}\nPrecipitación: ${d.precip_mm} mm`,
    },
  };

  const STYLE = {
    background: "transparent",
    color: "rgba(255,255,255,0.82)",
    fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
    fontSize: "11.5px",
    overflow: "visible",
  };

  const DIAS_TICKS = ["2025-08-01","2025-08-05","2025-08-10","2025-08-12","2025-08-15","2025-08-20"];
  const PRECIP_REF = 0.8; // mm/día media histórica agosto Ourense interior

  let cache = null;

  function cargar() {
    if (cache) return Promise.resolve(cache);
    return fetch("assets/data/era5_agosto2025.json")
      .then((r) => r.json())
      .then((j) => { cache = j; return j; });
  }

  function leyendaTemp(t) {
    const div = document.createElement("div");
    div.className = "clima-agosto-leyenda";
    div.innerHTML =
      `<span style="color:#F44E11;font-weight:700;">─ ${t.leyenda_max}</span>` +
      `<span style="color:rgba(244,78,17,0.6);margin-left:14px;">── ${t.leyenda_media}</span>` +
      `<span style="color:rgba(244,78,17,0.35);margin-left:14px;">▒ ${t.leyenda_min}–Max</span>`;
    return div;
  }

  function panelTemp(datos, ancho, t) {
    const Plot = global.Plot;
    const meses = datos.map((d) => d.fecha);
    const yMax = Math.ceil(Math.max(...datos.map((d) => d.tmax)) / 2) * 2 + 2;

    return Plot.plot({
      width: ancho, height: 210,
      marginLeft: 44, marginRight: 16, marginTop: 10, marginBottom: 4,
      style: STYLE,
      x: { label: null, type: "band", domain: meses, tickSize: 0, tickFormat: () => "" },
      y: { label: null, grid: true, domain: [10, yMax] },
      marks: [
        // Banda Tmin–Tmax
        Plot.rect(datos, {
          x: "fecha", y1: "tmin", y2: "tmax",
          fill: "rgba(244,78,17,0.18)", inset: 1,
        }),
        // Línea Tmedia (tenue, discontinua)
        Plot.line(datos, {
          x: "fecha", y: "tmedia",
          stroke: "rgba(244,78,17,0.55)", strokeWidth: 1.5,
          strokeDasharray: "4 3", curve: "monotone-x",
        }),
        // Línea Tmax (principal)
        Plot.line(datos, {
          x: "fecha", y: "tmax",
          stroke: "#F44E11", strokeWidth: 2.2, curve: "monotone-x",
        }),
        Plot.dot(datos, {
          x: "fecha", y: "tmax", r: 2.8,
          fill: "#F44E11", stroke: "rgba(0,0,0,0.35)", strokeWidth: 0.5,
          tip: true, title: t.tip_temp,
        }),
        // Referencia 30°C
        Plot.ruleY([30], { stroke: "rgba(255,200,80,0.45)", strokeWidth: 1, strokeDasharray: "2 4" }),
        Plot.text([{ f: "2025-08-20", y: 30 }], {
          x: "f", y: "y", text: () => t.ref_temp,
          dx: 2, dy: -6, fill: "rgba(255,200,80,0.7)", fontSize: 9.5, textAnchor: "end",
        }),
        // Pico calor
        Plot.ruleX([{ f: "2025-08-10" }], {
          x: "f", stroke: "rgba(255,200,80,0.7)", strokeWidth: 1, strokeDasharray: "3 3",
        }),
        Plot.text([{ f: "2025-08-10", y: yMax - 0.5 }], {
          x: "f", y: "y", text: () => t.pico_calor,
          fill: "rgba(255,200,80,0.9)", fontSize: 9.5, textAnchor: "middle", lineAnchor: "top",
        }),
        // Pico evento
        Plot.ruleX([{ f: "2025-08-12" }], {
          x: "f", stroke: "#F44E11", strokeWidth: 1.5, strokeDasharray: "4 3",
        }),
        Plot.ruleY([0], { stroke: "rgba(255,255,255,0.25)" }),
      ],
    });
  }

  function panelPrecip(datos, ancho, t) {
    const Plot = global.Plot;
    const meses = datos.map((d) => d.fecha);
    const yMax = Math.max(Math.ceil(Math.max(...datos.map((d) => d.precip_mm)) * 2) / 2 + 0.3, PRECIP_REF * 2.5);

    return Plot.plot({
      width: ancho, height: 170,
      marginLeft: 44, marginRight: 16, marginTop: 6, marginBottom: 30,
      style: STYLE,
      x: {
        label: null, type: "band", domain: meses, tickSize: 3,
        ticks: DIAS_TICKS,
        tickFormat: (f) => f.slice(8), // día: "01", "05"…
      },
      y: { label: null, grid: true, domain: [0, yMax] },
      marks: [
        // Referencia media histórica
        Plot.ruleY([PRECIP_REF], {
          stroke: "rgba(66,165,245,0.5)", strokeWidth: 1, strokeDasharray: "3 4",
        }),
        Plot.text([{ f: "2025-08-19", y: PRECIP_REF }], {
          x: "f", y: "y", text: () => t.ref_precip,
          dx: 4, dy: -4, fill: "rgba(66,165,245,0.75)", fontSize: 9, textAnchor: "start",
        }),
        // Barras diarias
        Plot.barY(datos, {
          x: "fecha", y: "precip_mm",
          fill: (d) => d.precip_mm < 0.1 ? "rgba(66,165,245,0.25)" : "rgba(66,165,245,0.75)",
          stroke: "rgba(66,165,245,0.7)", strokeWidth: 0.4,
          tip: true, title: t.tip_prec,
        }),
        // Pico evento
        Plot.ruleX([{ f: "2025-08-12" }], {
          x: "f", stroke: "#F44E11", strokeWidth: 1.5, strokeDasharray: "4 3",
        }),
        Plot.text([{ f: "2025-08-12", y: yMax * 0.55 }], {
          x: "f", y: "y", text: () => t.pico_evento,
          fill: "#F44E11", fontSize: 10, fontWeight: 600, textAnchor: "middle",
        }),
        Plot.ruleY([0], { stroke: "rgba(255,255,255,0.25)" }),
      ],
    });
  }

  function mkLabel(txt) {
    const p = document.createElement("p");
    p.className = "clima-agosto-label";
    p.textContent = txt;
    return p;
  }

  function pintar(host, datos, lang) {
    const t = TEXTOS[lang] || TEXTOS.es;
    const ancho = Math.max(280,
      host.getBoundingClientRect().width ||
      (host.parentElement && host.parentElement.getBoundingClientRect().width) ||
      host.clientWidth || 560
    );

    host.innerHTML = "";
    host.appendChild(mkLabel(t.label_temp));
    host.appendChild(leyendaTemp(t));
    host.appendChild(panelTemp(datos, ancho, t));
    const lblPrecip = mkLabel(t.label_precip);
    lblPrecip.style.marginTop = "52px";
    host.appendChild(lblPrecip);
    host.appendChild(panelPrecip(datos, ancho, t));

    const pie = document.createElement("p");
    pie.className = "clima-agosto-pie";
    pie.textContent = t.pie;
    host.appendChild(pie);
  }

  function render(host, lang) {
    if (!host || host._era5Rendered) return;
    host._era5Rendered = true;
    cargar()
      .then((j) => { pintar(host, j, lang); })
      .catch((err) => {
        host.innerHTML = `<div style="color:rgba(255,150,150,0.9);padding:8px">Error: ${err.message}</div>`;
      });
    if (!host._observado) {
      host._observado = true;
      new ResizeObserver(() => {
        if (cache) { host._era5Rendered = false; pintar(host, cache, lang); host._era5Rendered = true; }
      }).observe(host);
    }
  }

  global.ClimaAgosto = { render };
})(window);
