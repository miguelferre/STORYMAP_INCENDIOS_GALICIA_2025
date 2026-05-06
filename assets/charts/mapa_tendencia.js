/**
 * Heatmap distrito forestal × ano dos lumes en Galicia (2018-2025).
 *
 * Substitúe os iframes Flourish 25015393 (escritorio) e 26398232 (móbil), que
 * mostraban un mapa de burbullas non reproducible. A versión nativa cruza os
 * 19 distritos forestais con anos 2018-2025 e colorea por hectáreas totais
 * queimadas, deixando moi visible a concentración en Ourense e o salto de 2025.
 *
 * Datos: data/processed/serie_distrito_oficial.csv (XLSX abertos da Consellería
 * do Medio Rural, scripts/02-04).
 */
(function (global) {
  const TEXTOS = {
    es: {
      titulo: "Distritos forestales: el reparto del fuego",
      subtitulo:
        "Cada celda es la superficie quemada en uno de los 19 distritos forestales de Galicia en un año concreto. Los cinco distritos de Ourense (Verín-Viana, Valdeorras-Trives, Miño-Arnoia, A Limia, O Ribeiro-Arenteiro) concentran la actividad año tras año. El verano de 2025 colorea casi toda la columna.",
      eje_y: "Distrito forestal",
      eje_x: "Año",
      pie:
        "Fuente: estadísticas oficiales de incendios por distrito (Consellería do Medio Rural, Xunta de Galicia, 2018-2025).",
      legend: "Hectáreas quemadas",
    },
    gl: {
      titulo: "Distritos forestais: o reparto do lume",
      subtitulo:
        "Cada cela é a superficie queimada nun dos 19 distritos forestais de Galicia nun ano concreto. Os cinco distritos de Ourense (Verín-Viana, Valdeorras-Trives, Miño-Arnoia, A Limia, O Ribeiro-Arenteiro) concentran a actividade ano tras ano. O verán de 2025 colorea case toda a columna.",
      eje_y: "Distrito forestal",
      eje_x: "Ano",
      pie:
        "Fonte: estatísticas oficiais de lumes por distrito (Consellería do Medio Rural, Xunta de Galicia, 2018-2025).",
      legend: "Hectáreas queimadas",
    },
  };

  // Encurtar nomes longos de distrito para que caiban no eixe.
  const ABREV = {
    "BERGANTIÑOS-MARIÑAS CORUÑESAS": "Bergantiños-Mariñas",
    "SANTIAGO-MESETA INTERIOR": "Santiago-Meseta",
    "FONSAGRADA-OS ANCARES": "Fonsagrada-Ancares",
    "VALDEORRAS-TRIVES": "Valdeorras-Trives",
    "O RIBEIRO-ARENTEIRO": "O Ribeiro-Arenteiro",
    "O CONDADO-A PARADANTA": "Condado-Paradanta",
    "A MARIÑA LUCENSE": "A Mariña Lucense",
    "TERRA DE LEMOS": "Terra de Lemos",
    "VIGO-BAIXO MIÑO": "Vigo-Baixo Miño",
    "MIÑO-ARNOIA": "Miño-Arnoia",
  };

  function bonito(s) {
    if (ABREV[s]) return ABREV[s];
    // Pasa a "Title Case" suave.
    return s
      .toLowerCase()
      .split(" ")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  }

  let datos = null;
  let cargaPromesa = null;

  function parseCsv(txt) {
    const lineas = txt.trim().split(/\r?\n/);
    const cols = lineas[0].split(",");
    return lineas.slice(1).map((l) => {
      const partes = l.split(",");
      const obj = {};
      cols.forEach((c, i) => (obj[c.trim()] = partes[i] !== undefined ? partes[i].trim() : ""));
      obj.ano = parseInt(obj.ano, 10);
      obj.num_incendios = parseInt(obj.num_incendios, 10);
      obj.ha_arborada = parseFloat(obj.ha_arborada);
      obj.ha_rasa = parseFloat(obj.ha_rasa);
      obj.ha_total = parseFloat(obj.ha_total);
      return obj;
    });
  }

  function cargar() {
    if (datos) return Promise.resolve(datos);
    if (cargaPromesa) return cargaPromesa;
    cargaPromesa = fetch("data/processed/serie_distrito_oficial.csv")
      .then((r) => r.text())
      .then((t) => {
        datos = parseCsv(t);
        return datos;
      });
    return cargaPromesa;
  }

  function panel(items, ancho, lang) {
    const Plot = global.Plot;
    const t = TEXTOS[lang] || TEXTOS.es;
    // Orde Y: distritos por total acumulado (descendente).
    const acum = {};
    for (const d of items) acum[d.distrito] = (acum[d.distrito] || 0) + d.ha_total;
    const distritosOrde = Object.keys(acum).sort((a, b) => acum[b] - acum[a]);
    const datosT = items.map((d) => ({
      ano: d.ano,
      distrito: d.distrito,
      etq: bonito(d.distrito),
      provincia: d.provincia,
      num_incendios: d.num_incendios,
      ha_total: d.ha_total,
      ha_arborada: d.ha_arborada,
    }));
    const dominioY = distritosOrde.map(bonito);

    const isMobile = ancho < 480;
    return Plot.plot({
      width: ancho,
      height: Math.max(isMobile ? 300 : 380, dominioY.length * (isMobile ? 16 : 22) + 80),
      marginLeft: isMobile ? 90 : 170,
      marginRight: 14,
      marginTop: 14,
      marginBottom: 40,
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.86)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: isMobile ? "9px" : "11.5px",
        overflow: "visible",
      },
      x: { label: t.eje_x, type: "band", tickFormat: (d) => `${d}` },
      y: { label: null, domain: dominioY },
      color: {
        type: "sqrt",
        scheme: "ylorrd",
        legend: true,
        label: t.legend,
        style: { color: "rgba(255,255,255,0.86)" },
      },
      marks: [
        Plot.cell(datosT, {
          x: "ano",
          y: "etq",
          fill: "ha_total",
          stroke: "rgba(0,0,0,0.5)",
          strokeWidth: 0.6,
          tip: true,
          title: (d) =>
            `${d.etq} (${d.provincia}) — ${d.ano}\n${Math.round(d.ha_total).toLocaleString(lang)} ha (${d.num_incendios.toLocaleString(lang)} lumes)\nArborada: ${Math.round(d.ha_arborada).toLocaleString(lang)} ha`,
        }),
      ],
    });
  }

  function pintar(host, items, lang) {
    const t = TEXTOS[lang] || TEXTOS.es;
    const slot = host.querySelector(".tendencia-paneles");
    if (!slot) return;
    const ancho = Math.max(320, Math.min(slot.clientWidth || host.clientWidth || 720, 920));
    slot.innerHTML = "";
    slot.appendChild(panel(items, ancho, lang));
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
      <div class="tendencia-paneles"></div>
      <p class="tendencia-pie">${t.pie}</p>
    `;
    cargar()
      .then((items) => {
        const dibuxar = () => pintar(host, items, lang);
        const intento = () => {
          const slot = host.querySelector(".tendencia-paneles");
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
            if (host.querySelector(".tendencia-paneles")) dibuxar();
          });
          ro.observe(host);
        }
      })
      .catch((err) => {
        const slot = host.querySelector(".tendencia-paneles");
        if (slot)
          slot.innerHTML = `<div class="tendencia-erro">No se pudo cargar el dataset: ${err.message}</div>`;
      });
  }

  global.MapaTendencia = { render };
})(window);
