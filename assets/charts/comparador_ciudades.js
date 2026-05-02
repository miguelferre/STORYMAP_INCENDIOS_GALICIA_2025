/**
 * Comparador da magnitude do incendio Larouco–Seadur (317 km²) contra
 * superficies municipais de cidades coñecidas.
 *
 * Substitúe o iframe Flourish 26265364. Datos en assets/cities.csv;
 * extensión do incendio fixada en 317 km² (referencia oficial Xunta).
 */
(function (global) {
  const FIRE_KM2 = 317;
  const COR_GRUPO = {
    Lume: "#F44E11",
    Ciudad: "#6E7A8A",
  };

  const TEXTOS = {
    es: {
      titulo: "Larouco vs. el callejero",
      subtitulo:
        "El incendio de Larouco–Seadur arrasó 317 km², equivalentes a la suma de Vigo, A Coruña y Ourense. Cada barra es el área municipal de una ciudad conocida.",
      eje: "Superficie (km²)",
      label_lume: "Incendio Larouco–Seadur 2025",
      grupos: { Lume: "Incendio 2025", Ciudad: "Ciudad" },
      pie:
        "Fuentes: superficie del incendio, Consellería do Medio Rural; áreas municipales, INE / Eurostat.",
    },
    gl: {
      titulo: "Larouco fronte ao calexeiro",
      subtitulo:
        "O lume de Larouco–Seadur arrasou 317 km², equivalentes á suma de Vigo, A Coruña e Ourense. Cada barra é a área municipal dunha cidade coñecida.",
      eje: "Superficie (km²)",
      label_lume: "Incendio Larouco–Seadur 2025",
      grupos: { Lume: "Lume 2025", Ciudad: "Cidade" },
      pie:
        "Fontes: superficie do lume, Consellería do Medio Rural; áreas municipais, INE / Eurostat.",
    },
  };

  let datos = null;
  let cargaPromesa = null;

  function parseCsv(txt) {
    const lineas = txt.trim().split(/\r?\n/);
    const cols = lineas[0].split(",");
    return lineas.slice(1).map((l) => {
      const partes = l.split(",");
      const obj = {};
      cols.forEach((c, i) => (obj[c.trim()] = partes[i] !== undefined ? partes[i].trim() : ""));
      obj.km2 = parseFloat(obj.km2);
      return obj;
    });
  }

  function cargar() {
    if (datos) return Promise.resolve(datos);
    if (cargaPromesa) return cargaPromesa;
    cargaPromesa = fetch("assets/cities.csv")
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
    const filas = [
      { name: t.label_lume, km2: FIRE_KM2, grupo: "Lume" },
      ...items.map((d) => ({ name: d.name, km2: d.km2, grupo: "Ciudad" })),
    ].sort((a, b) => b.km2 - a.km2);
    const ordeColor = ["Lume", "Ciudad"].map((k) => t.grupos[k] || k);
    const cores = ordeColor.map((etq) => {
      const orig = ["Lume", "Ciudad"].find((k) => (t.grupos[k] || k) === etq);
      return COR_GRUPO[orig] || "#888";
    });
    const filasT = filas.map((d) => ({ ...d, grupoT: t.grupos[d.grupo] || d.grupo }));
    return Plot.plot({
      width: ancho,
      height: Math.max(360, filasT.length * 22 + 60),
      marginLeft: 200,
      marginRight: 70,
      marginTop: 14,
      marginBottom: 36,
      style: {
        background: "transparent",
        color: "rgba(255,255,255,0.86)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        fontSize: "12px",
        overflow: "visible",
      },
      x: {
        label: t.eje,
        labelAnchor: "right",
        grid: true,
        tickFormat: (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`),
      },
      y: { label: null, domain: filasT.map((d) => d.name) },
      color: {
        domain: ordeColor,
        range: cores,
        legend: true,
        label: null,
        style: { color: "rgba(255,255,255,0.86)" },
      },
      marks: [
        Plot.barX(filasT, { x: "km2", y: "name", fill: "grupoT" }),
        Plot.text(filasT, {
          x: "km2",
          y: "name",
          text: (d) => `${d.km2.toLocaleString(lang)}`,
          dx: 6,
          textAnchor: "start",
          fill: "rgba(255,255,255,0.92)",
          fontWeight: (d) => (d.grupo === "Lume" ? 700 : 400),
        }),
        Plot.ruleX([0], { stroke: "rgba(255,255,255,0.45)" }),
      ],
    });
  }

  function pintar(host, items, lang) {
    const t = TEXTOS[lang] || TEXTOS.es;
    const slot = host.querySelector(".comparador-paneles");
    if (!slot) return;
    const ancho = Math.max(320, Math.min(slot.clientWidth || host.clientWidth || 720, 920));
    slot.innerHTML = "";
    slot.appendChild(panel(items, ancho, lang));
  }

  function render(host, lang) {
    if (!host) return;
    const t = TEXTOS[lang] || TEXTOS.es;
    host.classList.add("comparador-bloque");
    host.innerHTML = `
      <header class="comparador-cabecera">
        <h3>${t.titulo}</h3>
        <p>${t.subtitulo}</p>
      </header>
      <div class="comparador-paneles"></div>
      <p class="comparador-pie">${t.pie}</p>
    `;
    cargar()
      .then((items) => {
        const dibuxar = () => pintar(host, items, lang);
        const intento = () => {
          const slot = host.querySelector(".comparador-paneles");
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
            if (host.querySelector(".comparador-paneles")) dibuxar();
          });
          ro.observe(host);
        }
      })
      .catch((err) => {
        const slot = host.querySelector(".comparador-paneles");
        if (slot)
          slot.innerHTML = `<div class="comparador-erro">No se pudo cargar el dataset: ${err.message}</div>`;
      });
  }

  global.ComparadorCiudades = { render };
})(window);
