(function (global) {
  const FASE_ACUM = [3, 4, 5, 6, 7, 8];   // Oct 24 – Mar 25
  const FASE_SECA = [1, 2, 11, 12, 13];    // Ago-Sep 24, Jun-Ago 25

  const TEXTOS = {
    es: {
      precip_label: "Precipitación (mm)",
      temp_label:   "Tª media (°C)",
      ndvi_label:   "NDVI — vegetación",
      fase_acum:    "Acumulación de combustible",
      fase_seca:    "Fase seca → riesgo de incendio",
      pie:          "Fuente: MeteoGalicia (Tª y precipitación, estación Larouco) · NASA AppEEARS / MODIS (NDVI, producto MOD13Q1).",
      tip_precip:   (d) => `${d.mes} — ${d.precip} mm`,
      tip_temp:     (d) => `${d.mes} — ${d.temp} °C`,
      tip_ndvi:     (d) => `${d.mes} — NDVI ${d.ndvi.toFixed(3)}`,
    },
    gl: {
      precip_label: "Precipitación (mm)",
      temp_label:   "Tª media (°C)",
      ndvi_label:   "NDVI — vexetación",
      fase_acum:    "Acumulación de combustible",
      fase_seca:    "Fase seca → risco de incendio",
      pie:          "Fonte: MeteoGalicia (Tª e precipitación, estación Larouco) · NASA AppEEARS / MODIS (NDVI, produto MOD13Q1).",
      tip_precip:   (d) => `${d.mes} — ${d.precip} mm`,
      tip_temp:     (d) => `${d.mes} — ${d.temp} °C`,
      tip_ndvi:     (d) => `${d.mes} — NDVI ${d.ndvi.toFixed(3)}`,
    },
  };

  const STYLE_BASE = {
    background: "transparent",
    color: "rgba(255,255,255,0.82)",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    fontSize: "11.5px",
    overflow: "visible",
  };

  let cache = null;

  function cargar() {
    if (cache) return Promise.resolve(cache);
    return fetch("assets/data/clima_larouco.json")
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then((j) => { cache = j; return j; });
  }

  function faseBands(datos, yMin, yMax) {
    const Plot = global.Plot;
    const bandsAcum = datos.filter((d) => FASE_ACUM.includes(d.orden))
      .map((d) => ({ mes: d.mes, y1: yMin, y2: yMax }));
    const bandsSeca = datos.filter((d) => FASE_SECA.includes(d.orden))
      .map((d) => ({ mes: d.mes, y1: yMin, y2: yMax }));
    return [
      Plot.rectY(bandsAcum, { x: "mes", y1: "y1", y2: "y2", fill: "rgba(66,165,245,0.10)", inset: 0 }),
      Plot.rectY(bandsSeca, { x: "mes", y1: "y1", y2: "y2", fill: "rgba(239,83,80,0.13)", inset: 0 }),
    ];
  }

  // Etiqueta de fase como marca de texto centrada en la banda
  function faseLabels(datos, yPos, t) {
    const Plot = global.Plot;
    // Centro de la banda de acumulación: entre orden 5 (Dic 24) y 6 (Ene 25) → usar Dic 24
    const mesAcum = datos.find((d) => d.orden === 5)?.mes;
    // Centro de la banda de fase seca visible (Jun-Ago 25): orden 12 = Jul 25
    const mesSeca = datos.find((d) => d.orden === 12)?.mes;
    const labels = [];
    if (mesAcum) labels.push({ mes: mesAcum, y: yPos, txt: t.fase_acum, color: "rgba(100,181,246,0.95)" });
    if (mesSeca) labels.push({ mes: mesSeca, y: yPos, txt: t.fase_seca, color: "rgba(239,100,80,0.95)" });
    return Plot.text(labels, {
      x: "mes", y: "y", text: "txt", fill: "color",
      fontSize: 12, fontWeight: 600, textAnchor: "middle",
    });
  }

  function panelPrecip(datos, ancho, t) {
    const Plot = global.Plot;
    const meses = datos.map((d) => d.mes);
    return Plot.plot({
      width: ancho, height: 160,
      marginLeft: 44, marginRight: 16, marginTop: 28, marginBottom: 4,
      style: STYLE_BASE,
      x: { label: null, type: "band", domain: meses, tickSize: 0, tickFormat: () => "" },
      y: { label: null, grid: true, nice: true, domain: [0, 100] },
      marks: [
        ...faseBands(datos, 0, 100),
        faseLabels(datos, 102, t),
        Plot.barY(datos, {
          x: "mes", y: "precip",
          fill: "rgba(66,165,245,0.65)", stroke: "rgba(66,165,245,0.9)", strokeWidth: 0.5,
          tip: true, title: t.tip_precip,
        }),
        Plot.ruleY([0], { stroke: "rgba(255,255,255,0.3)" }),
      ],
    });
  }

  function panelTemp(datos, ancho, t) {
    const Plot = global.Plot;
    const meses = datos.map((d) => d.mes);
    return Plot.plot({
      width: ancho, height: 140,
      marginLeft: 44, marginRight: 16, marginTop: 6, marginBottom: 4,
      style: STYLE_BASE,
      x: { label: null, type: "band", domain: meses, tickSize: 0, tickFormat: () => "" },
      y: { label: null, grid: true, nice: true, domain: [0, 26] },
      marks: [
        ...faseBands(datos, 0, 26),
        Plot.areaY(datos, { x: "mes", y: "temp", fill: "rgba(239,83,80,0.18)", curve: "monotone-x" }),
        Plot.line(datos, { x: "mes", y: "temp", stroke: "#ef5350", strokeWidth: 2.2, curve: "monotone-x" }),
        Plot.dot(datos, {
          x: "mes", y: "temp", r: 3.5,
          fill: "#ef5350", stroke: "rgba(0,0,0,0.4)", strokeWidth: 0.5,
          tip: true, title: t.tip_temp,
        }),
        Plot.ruleY([0], { stroke: "rgba(255,255,255,0.3)" }),
      ],
    });
  }

  function panelNDVI(datos, ancho, t) {
    const Plot = global.Plot;
    const meses = datos.map((d) => d.mes);
    return Plot.plot({
      width: ancho, height: 150,
      marginLeft: 44, marginRight: 16, marginTop: 6, marginBottom: 30,
      style: STYLE_BASE,
      x: { label: null, type: "band", domain: meses, tickSize: 3 },
      y: { label: null, grid: true, domain: [0.24, 0.50], tickFormat: (v) => v.toFixed(2) },
      marks: [
        ...faseBands(datos, 0.24, 0.50),
        Plot.areaY(datos, { x: "mes", y: "ndvi", y1: 0.24, fill: "rgba(102,187,106,0.22)", curve: "monotone-x" }),
        Plot.line(datos, { x: "mes", y: "ndvi", stroke: "#66bb6a", strokeWidth: 2.2, curve: "monotone-x" }),
        Plot.dot(datos, {
          x: "mes", y: "ndvi", r: 3.5,
          fill: "#66bb6a", stroke: "rgba(0,0,0,0.4)", strokeWidth: 0.5,
          tip: true, title: t.tip_ndvi,
        }),
        Plot.ruleY([0.24], { stroke: "rgba(255,255,255,0.3)" }),
      ],
    });
  }

  function label(text, cls) {
    const p = document.createElement("p");
    p.className = "clima-panel-label " + (cls || "");
    p.textContent = text;
    return p;
  }

  function pintar(host, datos, lang) {
    const t = TEXTOS[lang] || TEXTOS.es;
    const ancho = Math.max(280,
      host.getBoundingClientRect().width ||
      (host.parentElement && host.parentElement.getBoundingClientRect().width) ||
      host.clientWidth || 480
    );

    host.innerHTML = "";
    host.appendChild(label(t.precip_label));
    host.appendChild(panelPrecip(datos, ancho, t));
    host.appendChild(label(t.temp_label));
    host.appendChild(panelTemp(datos, ancho, t));
    host.appendChild(label(t.ndvi_label));
    host.appendChild(panelNDVI(datos, ancho, t));

    const pie = document.createElement("p");
    pie.className = "clima-larouco-pie";
    pie.textContent = t.pie;
    host.appendChild(pie);
  }

  function render(host, lang) {
    if (!host || host._climaRendered) return;
    host._climaRendered = true;
    cargar()
      .then((j) => { pintar(host, j, lang); })
      .catch((err) => {
        host.innerHTML = `<div style="color:rgba(255,180,180,0.9);padding:12px">Error: ${err.message}</div>`;
      });
    if (!host._observado) {
      host._observado = true;
      new ResizeObserver(() => {
        if (cache) { host._climaRendered = false; pintar(host, cache, lang); host._climaRendered = true; }
      }).observe(host);
    }
  }

  global.ClimaLarouco = { render };
})(window);
