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
  // Paleta de causas: naranja para Intencionado (la causa-personaje, la
  // dominante en toda la serie), tonos diferenciables y de menor saturación
  // para el resto. Cada grupo no-intencionado tiene un matiz propio para que
  // las barras apiladas se distingan, sin que ningún color compita con el
  // naranja del fuego.
  const COR_GRUPO = {
    "Intencionado": "#F44E11",
    "Causa descoñecida": "#6B9DC6",
    "Negligencias e accidentes": "#D9A03B",
    "Reproducción": "#8B7AA8",
    "Rayo": "#65A864",
  };

  // Motivacións dos intencionados: misma lógica. La motivación dominante
  // (prácticas agrícolas) hereda el naranja del Intencionado para enlazar
  // visualmente ambos gráficos. El resto reutiliza los matices del primer
  // gráfico, ordenados por prevalencia.
  const COR_MOTIV = {
    "Intencionado sen motivación recoñecida": "rgba(244,78,17,0.32)",
    "Prácticas agrícolas e gandeiras": "#F44E11",
    "Caza": "#D9A03B",
    "Vandalismo": "#8B7AA8",
    "Piromanía": "#B91C1C",
    "Desacordos e protestas": "#6B9DC6",
    "Vinganzas e disputas": "#C66640",
    "Propiedade": "#65A864",
    "Beneficio económico": "#A88A3F",
    "Outras motivacións": "#6F6E7B",
    "Forzas de orde público": "#475569",
  };

  const ORDE_GRUPOS = [
    "Intencionado",
    "Causa descoñecida",
    "Negligencias e accidentes",
    "Reproducción",
    "Rayo",
  ];

  const DECENIOS_SELECTOR = [
    { key: "total" },
    { key: "1990-1999" },
    { key: "2000-2009" },
    { key: "2010-2022" },
  ];

  const TEXTOS = {
    es: {
      titulo: "Más de cinco décadas de incendios en Ourense",
      subtitulo:
        "Cada barra reúne todos los partes oficiales (PIF) registrados en la provincia ese año. La intencionalidad domina toda la serie; el resto de causas apenas asoma.",
      panel_anual: "Número de incendios al año, por grupo de causa",
      panel_motiv: "Motivaciones de los incendios intencionados",
      selector_periodo: "Período:",
      selector_total: "Total 1968-2022",
      pie:
        "Fuente: EGIF — Estadística General de Incendios Forestales (MITECO/MAPA). Descarga XML para provincia de Ourense, todos los años disponibles. Categorías según el manual del Comité de Lucha contra Incendios Forestales (v3.6).",
      nota_motiv:
        "Casi la mitad de los partes intencionados no llegan a tener una motivación reconocida —reflejo de lo difícil que es investigar este tipo de incendios. Entre los identificados, las quemas agrícolas y ganaderas escapadas explican la mayoría.",
      eje_anos: "año",
      grupos: {
        "Intencionado": "Intencionado",
        "Causa descoñecida": "Causa desconocida",
        "Negligencias e accidentes": "Negligencias y accidentes",
        "Reproducción": "Reactivación",
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
      panel_motiv: "Motivacións dos incendios intencionados",
      selector_periodo: "Período:",
      selector_total: "Total 1968-2022",
      pie:
        "Fonte: EGIF — Estadística General de Incendios Forestales (MITECO/MAPA). Descarga XML para a provincia de Ourense, todos os anos dispoñibles. Categorías segundo o manual do Comité de Lucha contra Incendios Forestales (v3.6).",
      nota_motiv:
        "Case a metade dos partes intencionados non chegan a ter unha motivación recoñecida — reflicte a dificultade de investigar este tipo de lumes. Entre os identificados, as queimas agrícolas e gandeiras escapadas explican a maioría.",
      eje_anos: "ano",
      grupos: {
        "Intencionado": "Intencionado",
        "Causa descoñecida": "Causa descoñecida",
        "Negligencias e accidentes": "Neglixencias e accidentes",
        "Reproducción": "Reactivación",
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

    const ordeColor = ORDE_GRUPOS.map((g) => t.grupos[g] || g);
    const colorMap = new Map(
      ORDE_GRUPOS.map((g) => [t.grupos[g] || g, COR_GRUPO[g] || "#888"])
    );

    const datosT = serie.map((d) => ({
      ano: d.ano,
      grupo: t.grupos[d.grupo] || d.grupo,
      num_incendios: d.num_incendios,
      ha_total: d.ha_total,
    }));

    const anosOrdenados = Array.from(new Set(datosT.map((d) => d.ano))).sort(
      (a, b) => a - b
    );

    // Apilado manual: todos los segmentos del mismo año comparten x1/x2 exactos.
    const byAno = new Map(anosOrdenados.map((ano) => [ano, new Map()]));
    datosT.forEach((d) => byAno.get(d.ano).set(d.grupo, d));

    const MITAD = 0.44;
    const stacked = [];
    anosOrdenados.forEach((ano) => {
      let y0 = 0;
      ordeColor.forEach((grupo) => {
        const d = byAno.get(ano).get(grupo);
        if (!d || d.num_incendios === 0) return;
        stacked.push({
          ano,
          grupo,
          x1: ano - MITAD,
          x2: ano + MITAD,
          y1: y0,
          y2: y0 + d.num_incendios,
          num_incendios: d.num_incendios,
          ha_total: d.ha_total,
        });
        y0 += d.num_incendios;
      });
    });

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
        type: "linear",
        domain: [anosOrdenados[0] - 0.5, anosOrdenados[anosOrdenados.length - 1] + 0.5],
        ticks: anosOrdenados.filter((d) => d % 5 === 0),
        tickFormat: (d) => String(d),
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
        range: ordeColor.map((g) => colorMap.get(g) || "#888"),
        legend: true,
        label: null,
        style: { color: "rgba(255,255,255,0.86)" },
      },
      marks: [
        Plot.rect(stacked, {
          x1: "x1",
          x2: "x2",
          y1: "y1",
          y2: "y2",
          fill: "grupo",
          stroke: "rgba(10,14,26,0.9)",
          strokeWidth: 0.6,
          tip: true,
          title: (d) =>
            `${d.ano} — ${d.grupo}\n${d.num_incendios.toLocaleString(lang)} incendios\n${Math.round(d.ha_total).toLocaleString(lang)} ha`,
        }),
        Plot.ruleY([0], { stroke: "rgba(255,255,255,0.45)" }),
      ],
    });
    // Solapamiento de 0.5px hacia arriba en cada segmento para eliminar
    // el hilo de anti-aliasing en el borde entre colores adyacentes.
    svg.querySelectorAll("g[aria-label='rect'] rect").forEach((r) => {
      const y = parseFloat(r.getAttribute("y"));
      const h = parseFloat(r.getAttribute("height"));
      if (!isNaN(y) && !isNaN(h) && h > 1) {
        r.setAttribute("y", String(y - 0.5));
        r.setAttribute("height", String(h + 0.5));
      }
    });
    return svg;
  }

  function getDatosPorDecenio(json, decenio) {
    if (decenio === "total") return json.motivacions;
    return (json.motivacions_decenio || [])
      .filter((d) => d.decenio === decenio)
      .sort((a, b) => b.num_incendios - a.num_incendios);
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
            `${d.etq}\n${d.num_incendios.toLocaleString(lang)} incendios (${d.pct.toFixed(1)}%)\n${Math.round(d.ha_total).toLocaleString(lang)} ha`,
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

  function renderMotivSelector(slot, json, ancho, lang, decenioActivo) {
    const t = TEXTOS[lang] || TEXTOS.es;

    // Referencia directa al contenedor del chart, sin querySelector en el click
    const motivHost = document.createElement("div");
    motivHost.className = "causas-motiv-host";

    const wrap = document.createElement("div");
    wrap.className = "causas-dec-selector";
    const lbl = document.createElement("span");
    lbl.textContent = t.selector_periodo;
    wrap.appendChild(lbl);

    DECENIOS_SELECTOR.forEach((d) => {
      const btn = document.createElement("button");
      btn.className = "causas-dec-btn" + (d.key === decenioActivo ? " activo" : "");
      btn.textContent = d.key === "total" ? t.selector_total : d.key;
      btn.addEventListener("click", () => {
        try {
          const datos = getDatosPorDecenio(json, d.key);
          while (motivHost.firstChild) motivHost.removeChild(motivHost.firstChild);
          if (!datos || datos.length === 0) {
            motivHost.textContent = "Sin datos para este período";
          } else {
            const svg = panelMotivacions(datos, ancho, lang);
            if (svg) motivHost.appendChild(svg);
          }
        } catch (err) {
          motivHost.textContent = "Error: " + err.message;
        }
        wrap.querySelectorAll(".causas-dec-btn").forEach((b) => b.classList.remove("activo"));
        btn.classList.add("activo");
      });
      wrap.appendChild(btn);
    });

    motivHost.appendChild(panelMotivacions(getDatosPorDecenio(json, decenioActivo), ancho, lang));

    slot.appendChild(wrap);
    slot.appendChild(motivHost);
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
    renderMotivSelector(slot, json, ancho, lang, "total");
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
