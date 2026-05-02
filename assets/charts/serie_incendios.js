/**
 * Gráfica comparada da tendencia de incendios en Galicia.
 *
 * Substitúe o iframe Flourish 25013636. Toma os datos de
 * /assets/data/tendencia_serie.json e renderiza dous paneis con
 * Observable Plot:
 *   - Número de incendios (barras = oficial Xunta, liña = EFFIS satélite)
 *   - Hectáreas afectadas (mesma codificación)
 *
 * O contraste barras vs liña fai visible nun golpe de vista canto
 * subestima o satélite o reconto oficial.
 */
(function (global) {
  const COLORES = {
    oficial: "#F44E11",
    satelital: "#9CC5F0",
    apuntamento: "rgba(255,255,255,0.55)",
    texto: "rgba(255,255,255,0.86)",
    silueta: "rgba(255,255,255,0.45)",
  };

  const TEXTOS = {
    es: {
      titulo: "El dato oficial cuenta lo que el satélite no ve",
      subtitulo:
        "Mismo año, mismo territorio. EFFIS solo detecta los incendios visibles desde el espacio (en general, los mayores de 30 ha). El registro oficial de la Xunta los recoge todos.",
      panel_num: "Número de incendios al año",
      panel_ha: "Hectáreas afectadas al año",
      leyenda_oficial: "Xunta de Galicia (registro oficial)",
      leyenda_satelital: "Copernicus EFFIS (detección satelital)",
      pie:
        "Fuentes: Consellería do Medio Rural (hojas anuales por distrito) y Copernicus EFFIS Burned Area.",
      eje_anos: "año",
    },
    gl: {
      titulo: "O dato oficial conta o que o satélite non ve",
      subtitulo:
        "Mesmo ano, mesmo territorio. EFFIS só detecta os incendios visibles dende o espazo (en xeral, maiores de 30 ha). O rexistro oficial da Xunta recólleos todos.",
      panel_num: "Número de incendios ao ano",
      panel_ha: "Hectáreas afectadas ao ano",
      leyenda_oficial: "Xunta de Galicia (rexistro oficial)",
      leyenda_satelital: "Copernicus EFFIS (detección satelital)",
      pie:
        "Fontes: Consellería do Medio Rural (follas anuais por distrito) e Copernicus EFFIS Burned Area.",
      eje_anos: "ano",
    },
  };

  let datos = null;
  let cargaPromesa = null;

  function cargar() {
    if (datos) return Promise.resolve(datos);
    if (cargaPromesa) return cargaPromesa;
    cargaPromesa = fetch("assets/data/tendencia_serie.json")
      .then((r) => {
        if (!r.ok) throw new Error(`tendencia_serie.json HTTP ${r.status}`);
        return r.json();
      })
      .then((j) => {
        datos = j;
        return j;
      });
    return cargaPromesa;
  }

  function panel(serie, campo, titulo, formato, ancho, lang) {
    const Plot = global.Plot;
    const oficial = serie.filter((d) => d.fonte === "oficial");
    const satelital = serie.filter((d) => d.fonte === "satelital");

    const anos = [...new Set(serie.map((d) => d.ano))].sort();

    return Plot.plot({
      marginLeft: 72,
      marginRight: 16,
      marginTop: 30,
      marginBottom: 30,
      width: ancho,
      height: 230,
      style: {
        background: "transparent",
        color: COLORES.texto,
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "12px",
        overflow: "visible",
      },
      x: {
        type: "band",
        domain: anos,
        label: null,
        tickFormat: (d) => `${d}`,
      },
      y: {
        label: titulo,
        labelAnchor: "top",
        labelOffset: 60,
        grid: true,
        tickFormat: formato,
        nice: true,
      },
      marks: [
        Plot.barY(oficial, {
          x: "ano",
          y: campo,
          fill: COLORES.oficial,
          inset: 1,
          title: (d) =>
            `${d.ano}\nXunta (oficial): ${campo === "num_incendios" ? d.num_incendios.toLocaleString(lang) + " incendios" : Math.round(d.ha_total).toLocaleString(lang) + " ha"}`,
        }),
        Plot.line(satelital, {
          x: "ano",
          y: campo,
          stroke: COLORES.satelital,
          strokeWidth: 2,
          strokeOpacity: 0.65,
          curve: "monotone-x",
        }),
        Plot.dot(satelital, {
          x: "ano",
          y: campo,
          fill: COLORES.satelital,
          stroke: "rgba(15,18,28,0.95)",
          strokeWidth: 1.5,
          r: 5,
          title: (d) =>
            `${d.ano}\nEFFIS (satélite): ${campo === "num_incendios" ? d.num_incendios.toLocaleString(lang) + " incendios" : Math.round(d.ha_total).toLocaleString(lang) + " ha"}`,
        }),
        Plot.ruleY([0], { stroke: COLORES.silueta }),
      ],
    });
  }

  function leyenda(lang) {
    const t = TEXTOS[lang] || TEXTOS.es;
    const wrap = document.createElement("div");
    wrap.className = "tendencia-leyenda";
    wrap.innerHTML = `
      <span><i style="background:${COLORES.oficial}; border-radius:2px"></i>${t.leyenda_oficial}</span>
      <span><i style="background:${COLORES.satelital}; border-radius:50%"></i>${t.leyenda_satelital}</span>
    `;
    return wrap;
  }

  function pintar(host, serie, lang) {
    const t = TEXTOS[lang] || TEXTOS.es;
    const paneles = host.querySelector(".tendencia-paneles");
    if (!paneles) return;

    const ancho = Math.max(
      320,
      Math.min(paneles.clientWidth || host.clientWidth || 720, 920)
    );

    paneles.innerHTML = "";
    paneles.appendChild(panel(serie, "num_incendios", t.panel_num, (n) => n.toLocaleString(lang), ancho, lang));
    paneles.appendChild(
      panel(
        serie,
        "ha_total",
        t.panel_ha,
        (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`),
        ancho,
        lang
      )
    );
  }

  function render(host, lang) {
    if (!host) return;
    const t = TEXTOS[lang] || TEXTOS.es;

    host.classList.add("tendencia-bloque");
    host.innerHTML = `
      <header class="tendencia-cabecera">
        <h3>${t.titulo}</h3>
        <p>${t.subtitulo}</p>
      </header>
      <div class="tendencia-leyenda-host"></div>
      <div class="tendencia-paneles"></div>
      <p class="tendencia-pie">${t.pie}</p>
    `;
    host.querySelector(".tendencia-leyenda-host").appendChild(leyenda(lang));

    cargar()
      .then((j) => {
        const dibuxar = () => pintar(host, j.serie, lang);
        // Intento inicial protexido contra ancho cero (host aínda non visible).
        const intento = () => {
          const paneles = host.querySelector(".tendencia-paneles");
          if (!paneles) return;
          const w = paneles.clientWidth;
          if (w < 200) {
            requestAnimationFrame(intento);
            return;
          }
          dibuxar();
        };
        intento();

        if (!host._observado) {
          host._observado = true;
          const ro = new ResizeObserver(() => {
            if (host.querySelector(".tendencia-paneles")) dibuxar();
          });
          ro.observe(host);
        }
      })
      .catch((err) => {
        const paneles = host.querySelector(".tendencia-paneles");
        if (paneles)
          paneles.innerHTML = `<div class="tendencia-erro">No se pudo cargar la serie de incendios: ${err.message}</div>`;
      });
  }

  global.SerieIncendios = { render };
})(window);
