(function (global) {
  const MESES = {
    es: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
    gl: ["Xan","Feb","Mar","Abr","Mai","Xuñ","Xul","Ago","Set","Out","Nov","Dec"],
  };

  const TEXTOS = {
    es: {
      subtitulo: "Anomalía de temperatura mensual en Galicia respecto a la media 1991-2020.",
      linea_label: "Anomalía media Jun-Sep (ºC)",
      linea_media: "Media móvil 5 años",
      pie: "Fuente: ERA5, ECMWF/Copernicus. Temperatura mensual a 2 m, media espacial Galicia (41,7–42,5°N, 8,3–7,1°W). Anomalía respecto a 1991-2020.",
      frio: "Más frío",
      calido: "Más cálido",
    },
    gl: {
      subtitulo: "Anomalía de temperatura mensual en Galicia respecto á media 1991-2020.",
      linea_label: "Anomalía media Xuñ-Set (ºC)",
      linea_media: "Media móbil 5 anos",
      pie: "Fuente: ERA5, ECMWF/Copernicus. Temperatura mensual a 2 m, media espacial Galicia (41,7–42,5°N, 8,3–7,1°W). Anomalía respecto a 1991-2020.",
      frio: "Máis frío",
      calido: "Máis cálido",
    },
  };

  const ANO_INI = 1950;

  let cache = null;
  let cargaPromesa = null;

  function cargar() {
    if (cache) return Promise.resolve(cache);
    if (cargaPromesa) return cargaPromesa;
    cargaPromesa = fetch("assets/data/temperatura_mensual.json")
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then((j) => { cache = j; return j; });
    return cargaPromesa;
  }

  // Media móvil simple de ventana `n`
  function mediaMovil(arr, n) {
    return arr.map((_, i) => {
      const ini = Math.max(0, i - Math.floor(n / 2));
      const fin = Math.min(arr.length, ini + n);
      const vals = arr.slice(ini, fin);
      return vals.reduce((s, v) => s + v, 0) / vals.length;
    });
  }

  function pintarHeatmap(datos, ancho, lang) {
    const Plot = global.Plot;
    const t = TEXTOS[lang] || TEXTOS.es;
    const meses = MESES[lang] || MESES.es;
    const filtrado = datos.filter((d) => d.ano >= ANO_INI);
    const anos = Array.from(new Set(filtrado.map((d) => d.ano))).sort((a, b) => a - b);

    return Plot.plot({
      width: ancho,
      height: 380,
      marginLeft: 38,
      marginRight: 16,
      marginTop: 10,
      marginBottom: 28,
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.82)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "11.5px",
        overflow: "visible",
      },
      x: {
        label: null,
        type: "band",
        domain: anos,
        ticks: anos.filter((a) => a % 10 === 0),
        tickFormat: (d) => String(d),
        tickSize: 3,
      },
      y: {
        label: null,
        type: "band",
        domain: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        tickFormat: (m) => meses[m - 1],
        tickSize: 0,
      },
      color: {
        type: "diverging",
        pivot: 0,
        domain: [-3, 5],
        scheme: "RdBu",
        reverse: true,
        legend: true,
        label: `${t.frio} ← anomalía (ºC) → ${t.calido}`,
      },
      marks: [
        Plot.rect(filtrado, {
          x: "ano",
          y: "mes",
          fill: "anomalia",
          inset: 0.3,
          tip: true,
          title: (d) => {
            const mes = meses[d.mes - 1];
            const signo = d.anomalia > 0 ? "+" : "";
            return `${mes} ${d.ano}\n${d.t_media.toFixed(1)} ºC  (${signo}${d.anomalia.toFixed(2)} ºC vs 1991-2020)`;
          },
        }),
      ],
    });
  }

  function pintarLinea(datos, ancho, lang) {
    const Plot = global.Plot;
    const t = TEXTOS[lang] || TEXTOS.es;

    // Anomalía media Jun-Sep por año, desde 1950
    const verano = datos.filter((d) => d.ano >= ANO_INI && d.mes >= 6 && d.mes <= 9);
    const porAno = new Map();
    verano.forEach((d) => {
      if (!porAno.has(d.ano)) porAno.set(d.ano, []);
      porAno.get(d.ano).push(d.anomalia);
    });
    const serie = Array.from(porAno.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([ano, vals]) => ({ ano, anomalia: vals.reduce((s, v) => s + v, 0) / vals.length }));

    const mms = mediaMovil(serie.map((d) => d.anomalia), 5);
    const serieMM = serie.map((d, i) => ({ ano: d.ano, mm: mms[i] }));

    return Plot.plot({
      width: ancho,
      height: 140,
      marginLeft: 38,
      marginRight: 16,
      marginTop: 12,
      marginBottom: 32,
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.75)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "11px",
        overflow: "visible",
      },
      x: {
        label: null,
        tickFormat: (d) => String(d),
        grid: false,
      },
      y: {
        label: t.linea_label,
        labelAnchor: "top",
        labelOffset: 34,
        grid: true,
        tickFormat: (v) => (v > 0 ? "+" : "") + v.toFixed(1),
        zero: true,
      },
      marks: [
        Plot.ruleY([0], { stroke: "rgba(255,255,255,0.3)", strokeWidth: 1 }),
        Plot.areaY(serie, {
          x: "ano",
          y: "anomalia",
          fill: (d) => (d.anomalia >= 0 ? "rgba(239,83,80,0.25)" : "rgba(66,165,245,0.25)"),
          curve: "monotone-x",
        }),
        Plot.line(serieMM, {
          x: "ano",
          y: "mm",
          stroke: "#ef5350",
          strokeWidth: 2.2,
          curve: "monotone-x",
        }),
        Plot.dot(serie, {
          x: "ano",
          y: "anomalia",
          r: 1.8,
          fill: (d) => (d.anomalia >= 0 ? "#ef5350" : "#42a5f5"),
          opacity: 0.7,
        }),
      ],
    });
  }

  function anchoDisponible(host) {
    // Medir el contenedor real renderizado, sin cap artificial
    const rectHost = host.getBoundingClientRect().width;
    if (rectHost > 100) return rectHost;
    const rectParent = host.parentElement && host.parentElement.getBoundingClientRect().width;
    if (rectParent > 100) return rectParent;
    return host.clientWidth || window.innerWidth * 0.62 || 720;
  }

  function pintar(host, datos, lang) {
    const t = TEXTOS[lang] || TEXTOS.es;
    const ancho = Math.max(320, anchoDisponible(host));

    host.innerHTML = "";

    const sub = document.createElement("p");
    sub.className = "heatmap-temp-subtitulo";
    sub.textContent = t.subtitulo;
    host.appendChild(sub);

    host.appendChild(pintarHeatmap(datos, ancho, lang));

    const sep = document.createElement("p");
    sep.className = "heatmap-temp-subtitulo";
    sep.style.marginTop = "18px";
    sep.textContent = (lang === "gl") ? "Anomalía media de verán (Xuñ–Set) e tendencia a 5 anos" : "Anomalía media de verano (Jun–Sep) y tendencia a 5 años";
    host.appendChild(sep);

    host.appendChild(pintarLinea(datos, ancho, lang));

    const pie = document.createElement("p");
    pie.className = "heatmap-temp-pie";
    pie.textContent = t.pie;
    host.appendChild(pie);
  }

  function render(host, lang) {
    if (!host || host._heatmapRendered) return;
    host._heatmapRendered = true;
    cargar()
      .then((j) => { pintar(host, j, lang); })
      .catch((err) => {
        host.innerHTML = `<div class="heatmap-temp-erro">No se pudieron cargar los datos: ${err.message}</div>`;
      });
    if (!host._observado) {
      host._observado = true;
      new ResizeObserver(() => {
        if (cache) {
          host._heatmapRendered = false;
          pintar(host, cache, lang);
          host._heatmapRendered = true;
        }
      }).observe(host);
    }
  }

  global.HeatmapTemp = { render };
})(window);
