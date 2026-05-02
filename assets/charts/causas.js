/**
 * Gráfica de causas dos incendios forestais en Ourense.
 *
 * Substitúe os iframes Flourish 25942041 (evolución anual de causas) e
 * 25510523 (motivacións dos intencionados). Os datos veñen do EGIF
 * (servicio.mapa.gob.es/incendios/Search/Publico, descarga XML
 * provincia 32, 1968-2022) procesados polos scripts 05/07/08.
 *
 * Renderiza dous paneis con Observable Plot:
 *   - Panel A: barras apiladas anuais por grupo de causa (Rayo / Negligencias /
 *              Intencionado / Descoñecida / Reproducción).
 *   - Panel B: barras horizontais coas motivacións dos intencionados,
 *              agrupadas e ordenadas por nº de incendios.
 */
(function (global) {
  // Paleta unificada: naranja sólo para Intencionado (la causa-personaje),
  // el resto en una rampa de grises fríos para reducir ruido cromático.
  const COR_GRUPO = {
    "Intencionado": "#F44E11",
    "Causa descoñecida": "#7A8694",
    "Negligencias e accidentes": "#9CA8B6",
    "Reproducción": "#5C6672",
    "Rayo": "#3F4751",
  };

  // Motivacións dos intencionados: gradiente del naranja del fuego al gris,
  // para que la motivación dominante (prácticas agrícolas) destaque sobre el
  // resto sin que cada motivación tenga un color distinto que no aporta nada.
  const COR_MOTIV = {
    "Intencionado sen motivación recoñecida": "rgba(244,78,17,0.30)",
    "Prácticas agrícolas e gandeiras": "#F44E11",
    "Caza": "#C66640",
    "Vandalismo": "#A4685A",
    "Piromanía": "#856B6E",
    "Desacordos e protestas": "#6F6E7B",
    "Vinganzas e disputas": "#5C6672",
    "Propiedade": "#525B66",
    "Beneficio económico": "#48505A",
    "Outras motivacións": "#3F4751",
    "Forzas de orde público": "#363D45",
  };

  const ORDE_GRUPOS = [
    "Intencionado",
    "Causa descoñecida",
    "Negligencias e accidentes",
    "Reproducción",
    "Rayo",
  ];

  const TEXTOS = {
    es: {
      titulo: "Más de cinco décadas de incendios en Ourense",
      subtitulo:
        "Cada barra reúne todos los partes oficiales (PIF) registrados en la provincia ese año. La intencionalidad domina toda la serie; el resto de causas apenas asoma.",
      panel_anual: "Número de incendios al año, por grupo de causa",
      panel_motiv: "Motivaciones de los incendios intencionados (1968-2022)",
      pie:
        "Fuente: EGIF — Estadística General de Incendios Forestales (MITECO/MAPA). Descarga XML para provincia de Ourense, todos los años disponibles. Categorías según el manual del Comité de Lucha contra Incendios Forestales (v3.6).",
      nota_motiv:
        "Casi la mitad de los partes intencionados no llegan a tener una motivación reconocida —reflejo de lo difícil que es investigar este tipo de incendios. Entre los identificados, las quemas agrícolas y ganaderas escapadas explican la mayoría.",
      eje_anos: "año",
      grupos: {
        "Intencionado": "Intencionado",
        "Causa descoñecida": "Causa desconocida",
        "Negligencias e accidentes": "Negligencias y accidentes",
        "Reproducción": "Reproducción",
        "Rayo": "Rayo",
      },
      motivs: {
        "Intencionado sen motivación recoñecida": "Sin motivación reconocida",
        "Prácticas agrícolas e gandeiras": "Prácticas agrícolas y ganaderas",
        "Caza": "Caza",
        "Vandalismo": "Vandalismo",
        "Piromanía": "Piromanía",
        "Desacordos e protestas": "Desacuerdos y protestas",
        "Vinganzas e disputas": "Venganzas y disputas",
        "Propiedade": "Propiedad",
        "Beneficio económico": "Beneficio económico",
        "Outras motivacións": "Otras motivaciones",
        "Forzas de orde público": "Fuerzas del orden",
      },
    },
    gl: {
      titulo: "Máis de cinco décadas de lumes en Ourense",
      subtitulo:
        "Cada barra reúne todos os partes oficiais (PIF) rexistrados na provincia ese ano. A intencionalidade domina toda a serie; o resto de causas apenas asoma.",
      panel_anual: "Número de incendios ao ano, por grupo de causa",
      panel_motiv: "Motivacións dos incendios intencionados (1968-2022)",
      pie:
        "Fonte: EGIF — Estadística General de Incendios Forestales (MITECO/MAPA). Descarga XML para a provincia de Ourense, todos os anos dispoñibles. Categorías segundo o manual do Comité de Lucha contra Incendios Forestales (v3.6).",
      nota_motiv:
        "Case a metade dos partes intencionados non chegan a ter unha motivación recoñecida — reflicte a dificultade de investigar este tipo de lumes. Entre os identificados, as queimas agrícolas e gandeiras escapadas explican a maioría.",
      eje_anos: "ano",
      grupos: {
        "Intencionado": "Intencionado",
        "Causa descoñecida": "Causa descoñecida",
        "Negligencias e accidentes": "Neglixencias e accidentes",
        "Reproducción": "Reproducción",
        "Rayo": "Raio",
      },
      motivs: {
        "Intencionado sen motivación recoñecida": "Sen motivación recoñecida",
        "Prácticas agrícolas e gandeiras": "Prácticas agrícolas e gandeiras",
        "Caza": "Caza",
        "Vandalismo": "Vandalismo",
        "Piromanía": "Piromanía",
        "Desacordos e protestas": "Desacordos e protestas",
        "Vinganzas e disputas": "Vinganzas e disputas",
        "Propiedade": "Propiedade",
        "Beneficio económico": "Beneficio económico",
        "Outras motivacións": "Outras motivacións",
        "Forzas de orde público": "Forzas de orde público",
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

    return Plot.plot({
      marginLeft: 56,
      marginRight: 14,
      marginTop: 10,
      marginBottom: 32,
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
        tickFormat: (d) => `${d}`,
        tickSpacing: 60,
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
        Plot.rectY(
          datosT,
          {
            x: "ano",
            y: "num_incendios",
            fill: "grupo",
            interval: 1,
            order: ordeColor,
            tip: true,
            title: (d) =>
              `${d.ano} — ${d.grupo}\n${d.num_incendios.toLocaleString(lang)} incendios\n${Math.round(d.ha_total).toLocaleString(lang)} ha`,
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
