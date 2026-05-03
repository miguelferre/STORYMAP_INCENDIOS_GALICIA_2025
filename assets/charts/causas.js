/**
 * GrÃ¡fica de causas dos incendios forestais en Ourense.
 *
 * SubstitÃºe os iframes Flourish 25942041 (evoluciÃ³n anual de causas) e
 * 25510523 (motivaciÃ³ns dos intencionados). Os datos veÃ±en do EGIF
 * (servicio.mapa.gob.es/incendios/Search/Publico, descarga XML
 * provincia 32, 1968-2022) procesados polos scripts 05/07/08.
 *
 * Renderiza dous paneis con Observable Plot:
 *   - Panel A: barras apiladas anuais por grupo de causa (Rayo / Negligencias /
 *              Intencionado / DescoÃ±ecida / ReproducciÃ³n).
 *   - Panel B: barras horizontais coas motivaciÃ³ns dos intencionados,
 *              agrupadas e ordenadas por nÂº de incendios.
 */
(function (global) {
  // Paleta de causas: naranja para Intencionado (la causa-personaje, la
  // dominante en toda la serie), tonos diferenciables y de menor saturaciÃ³n
  // para el resto. Cada grupo no-intencionado tiene un matiz propio para que
  // las barras apiladas se distingan, sin que ningÃºn color compita con el
  // naranja del fuego.
  const COR_GRUPO = {
    "Intencionado": "#F44E11",
    "Causa descoÃ±ecida": "#6B9DC6",
    "Negligencias e accidentes": "#D9A03B",
    "ReproducciÃ³n": "#8B7AA8",
    "Rayo": "#65A864",
  };

  // MotivaciÃ³ns dos intencionados: misma lÃ³gica. La motivaciÃ³n dominante
  // (prÃ¡cticas agrÃ­colas) hereda el naranja del Intencionado para enlazar
  // visualmente ambos grÃ¡ficos. El resto reutiliza los matices del primer
  // grÃ¡fico, ordenados por prevalencia.
  const COR_MOTIV = {
    "Intencionado sen motivaciÃ³n recoÃ±ecida": "rgba(244,78,17,0.32)",
    "PrÃ¡cticas agrÃ­colas e gandeiras": "#F44E11",
    "Caza": "#D9A03B",
    "Vandalismo": "#8B7AA8",
    "PiromanÃ­a": "#B91C1C",
    "Desacordos e protestas": "#6B9DC6",
    "Vinganzas e disputas": "#C66640",
    "Propiedade": "#65A864",
    "Beneficio econÃ³mico": "#A88A3F",
    "Outras motivaciÃ³ns": "#6F6E7B",
    "Forzas de orde pÃºblico": "#475569",
  };

  const ORDE_GRUPOS = [
    "Intencionado",
    "Causa descoÃ±ecida",
    "Negligencias e accidentes",
    "ReproducciÃ³n",
    "Rayo",
  ];

  const TEXTOS = {
    es: {
      titulo: "MÃ¡s de cinco dÃ©cadas de incendios en Ourense",
      subtitulo:
        "Cada barra reÃºne todos los partes oficiales (PIF) registrados en la provincia ese aÃ±o. La intencionalidad domina toda la serie; el resto de causas apenas asoma.",
      panel_anual: "NÃºmero de incendios al aÃ±o, por grupo de causa",
      panel_motiv: "Motivaciones de los incendios intencionados (1968-2022)",
      pie:
        "Fuente: EGIF â€” EstadÃ­stica General de Incendios Forestales (MITECO/MAPA). Descarga XML para provincia de Ourense, todos los aÃ±os disponibles. CategorÃ­as segÃºn el manual del ComitÃ© de Lucha contra Incendios Forestales (v3.6).",
      nota_motiv:
        "Casi la mitad de los partes intencionados no llegan a tener una motivaciÃ³n reconocida â€”reflejo de lo difÃ­cil que es investigar este tipo de incendios. Entre los identificados, las quemas agrÃ­colas y ganaderas escapadas explican la mayorÃ­a.",
      eje_anos: "aÃ±o",
      grupos: {
        "Intencionado": "Intencionado",
        "Causa descoÃ±ecida": "Causa desconocida",
        "Negligencias e accidentes": "Negligencias y accidentes",
        "ReproducciÃ³n": "ReproducciÃ³n",
        "Rayo": "Rayo",
      },
      motivs: {
        "Intencionado sen motivaciÃ³n recoÃ±ecida": "Sin motivaciÃ³n reconocida",
        "PrÃ¡cticas agrÃ­colas e gandeiras": "PrÃ¡cticas agrÃ­colas y ganaderas",
        "Caza": "Caza",
        "Vandalismo": "Vandalismo",
        "PiromanÃ­a": "PiromanÃ­a",
        "Desacordos e protestas": "Desacuerdos y protestas",
        "Vinganzas e disputas": "Venganzas y disputas",
        "Propiedade": "Propiedad",
        "Beneficio econÃ³mico": "Beneficio econÃ³mico",
        "Outras motivaciÃ³ns": "Otras motivaciones",
        "Forzas de orde pÃºblico": "Fuerzas del orden",
      },
    },
    gl: {
      titulo: "MÃ¡is de cinco dÃ©cadas de lumes en Ourense",
      subtitulo:
        "Cada barra reÃºne todos os partes oficiais (PIF) rexistrados na provincia ese ano. A intencionalidade domina toda a serie; o resto de causas apenas asoma.",
      panel_anual: "NÃºmero de incendios ao ano, por grupo de causa",
      panel_motiv: "MotivaciÃ³ns dos incendios intencionados (1968-2022)",
      pie:
        "Fonte: EGIF â€” EstadÃ­stica General de Incendios Forestales (MITECO/MAPA). Descarga XML para a provincia de Ourense, todos os anos dispoÃ±ibles. CategorÃ­as segundo o manual do ComitÃ© de Lucha contra Incendios Forestales (v3.6).",
      nota_motiv:
        "Case a metade dos partes intencionados non chegan a ter unha motivaciÃ³n recoÃ±ecida â€” reflicte a dificultade de investigar este tipo de lumes. Entre os identificados, as queimas agrÃ­colas e gandeiras escapadas explican a maiorÃ­a.",
      eje_anos: "ano",
      grupos: {
        "Intencionado": "Intencionado",
        "Causa descoÃ±ecida": "Causa descoÃ±ecida",
        "Negligencias e accidentes": "Neglixencias e accidentes",
        "ReproducciÃ³n": "ReproducciÃ³n",
        "Rayo": "Raio",
      },
      motivs: {
        "Intencionado sen motivaciÃ³n recoÃ±ecida": "Sen motivaciÃ³n recoÃ±ecida",
        "PrÃ¡cticas agrÃ­colas e gandeiras": "PrÃ¡cticas agrÃ­colas e gandeiras",
        "Caza": "Caza",
        "Vandalismo": "Vandalismo",
        "PiromanÃ­a": "PiromanÃ­a",
        "Desacordos e protestas": "Desacordos e protestas",
        "Vinganzas e disputas": "Vinganzas e disputas",
        "Propiedade": "Propiedade",
        "Beneficio econÃ³mico": "Beneficio econÃ³mico",
        "Outras motivaciÃ³ns": "Outras motivaciÃ³ns",
        "Forzas de orde pÃºblico": "Forzas de orde pÃºblico",
      },
    },
  };

  let datos = null;
  let cargaPromesa = null;

  function cargar() {
    if (datos) return Promise.resolve(datos);
    if (cargaPromesa) return cargaPromesa;
    cargaPromesa = fetch("assets/data/causas_ourense.json")
      .then((r) => {
        if (!r.ok) throw new Error(`causas_ourense.json HTTP ${r.status}`);
        return r.json();
      })
      .then((j) => {
        datos = j;
        return j;
      });
    return cargaPromesa;
  }

  function panelAnual(serie, ancho, lang) {
    const Plot = global.Plot;
    const t = TEXTOS[lang] || TEXTOS.es;
    // Etiquetas traducidas para Plot e tooltip.
    const datosT = serie.map((d) => ({
      ano: d.ano,
      grupo_orig: d.grupo,
      grupo: t.grupos[d.grupo] || d.grupo,
      num_incendios: d.num_incendios,
      ha_total: d.ha_total,
    }));

    const ordeColor = ORDE_GRUPOS.map((g) => t.grupos[g] || g);
    const cores = ordeColor.map((etq) => {
      const orig = ORDE_GRUPOS.find((g) => (t.grupos[g] || g) === etq);
      return COR_GRUPO[orig] || "#888";
    });

    // Banda de anos usando bandX: cada barra cÃ©ntrase exactamente sobre o tick
    // do seu ano, en vez de extendÃ©ndose a [ano, ano+1] como facÃ­a Plot.rectY
    // con interval=1 (que daba a sensaciÃ³n visual de que as barras estaban
    // desprazadas Ã¡ dereita das sÃºas etiquetas).
    const anosOrdenados = Array.from(new Set(datosT.map((d) => d.ano))).sort(
      (a, b) => a - b
    );

    return Plot.plot({
      marginLeft: 56,
      marginRight: 14,
      marginTop: 10,
      marginBottom: 48,
      width: ancho,
      height: 260,
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.86)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "11.5px",
        overflow: "visible",
      },
      x: {
        label: null,
        type: "band",
        domain: anosOrdenados,
        ticks: anosOrdenados.filter(function(d) { return d % 5 === 0; }),
        tickRotate: -45,
      },
      y: {
        label: t.panel_anual,
        labelAnchor: "top",
        labelOffset: 36,
        grid: true,
        nice: true,
      },
      color: {
        domain: ordeColor,
        range: cores,
        legend: true,
        label: null,
        style: { color: "rgba(255,255,255,0.86)" },
      },
      marks: [
        Plot.barY(
          datosT,
          {
            x: "ano",
            y: "num_incendios",
            fill: "grupo",
            order: ordeColor,
            tip: true,
            title: (d) =>
              `${d.ano} â€” ${d.grupo}\n${d.num_incendios.toLocaleString(lang)} incendios\n${Math.round(d.ha_total).toLocaleString(lang)} ha`,
          }
        ),
        Plot.ruleY([0], { stroke: "rgba(255,255,255,0.45)" }),
      ],
    });
  }

  function panelMotivacions(motivs, ancho, lang) {
    const Plot = global.Plot;
    const t = TEXTOS[lang] || TEXTOS.es;
    const datosT = motivs.map((d) => ({
      etq_orig: d.grupo_motivacion,
      etq: t.motivs[d.grupo_motivacion] || d.grupo_motivacion,
      num_incendios: d.num_incendios,
      ha_total: d.ha_total,
      pct: d.pct,
    }));

    return Plot.plot({
      marginLeft: 200,
      marginRight: 60,
      marginTop: 10,
      marginBottom: 32,
      width: ancho,
      height: Math.max(220, datosT.length * 26 + 40),
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.86)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "11.5px",
        overflow: "visible",
      },
      x: {
        label: t.panel_motiv,
        labelAnchor: "right",
        grid: true,
        tickFormat: (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`),
      },
      y: {
        label: null,
        domain: datosT.map((d) => d.etq),
      },
      marks: [
        Plot.barX(datosT, {
          x: "num_incendios",
          y: "etq",
          fill: (d) => COR_MOTIV[d.etq_orig] || "#888",
          tip: true,
          title: (d) =>
            `${d.etq}\n${d.num_incendios.toLocaleString(lang)} incendios (${d.pct.toFixed(1)}% dos intencionados)\n${Math.round(d.ha_total).toLocaleString(lang)} ha`,
        }),
        Plot.text(datosT, {
          x: "num_incendios",
          y: "etq",
          text: (d) => `${d.pct.toFixed(1)}%`,
          dx: 8,
          textAnchor: "start",
          fill: "rgba(255,255,255,0.86)",
        }),
        Plot.ruleX([0], { stroke: "rgba(255,255,255,0.45)" }),
      ],
    });
  }

  function pintar(host, json, lang) {
    const t = TEXTOS[lang] || TEXTOS.es;
    const slot = host.querySelector(".causas-paneles");
    if (!slot) return;

    const ancho = Math.max(
      320,
      Math.min(slot.clientWidth || host.clientWidth || 720, 920)
    );

    slot.innerHTML = "";
    const tituloA = document.createElement("p");
    tituloA.className = "causas-subtitulo";
    tituloA.textContent = t.panel_anual;
    slot.appendChild(tituloA);
    slot.appendChild(panelAnual(json.serie_anual, ancho, lang));

    const tituloB = document.createElement("p");
    tituloB.className = "causas-subtitulo";
    tituloB.textContent = t.panel_motiv;
    slot.appendChild(tituloB);
    slot.appendChild(panelMotivacions(json.motivacions, ancho, lang));
  }

  function render(host, lang) {
    if (!host) return;
    const t = TEXTOS[lang] || TEXTOS.es;

    host.classList.add("causas-bloque");
    host.innerHTML = `
      <header class="causas-cabecera">
        <h3>${t.titulo}</h3>
        <p>${t.subtitulo}</p>
      </header>
      <div class="causas-paneles"></div>
      <p class="causas-pie">${t.pie}</p>
    `;

    cargar()
      .then((j) => {
        const dibuxar = () => pintar(host, j, lang);
        const intento = () => {
          const slot = host.querySelector(".causas-paneles");
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
            if (host.querySelector(".causas-paneles")) dibuxar();
          });
          ro.observe(host);
        }
      })
      .catch((err) => {
        const slot = host.querySelector(".causas-paneles");
        if (slot)
          slot.innerHTML = `<div class="causas-erro">No se pudo cargar el dataset de causas: ${err.message}</div>`;
      });
  }

  global.CausasOurense = { render };
})(window);
