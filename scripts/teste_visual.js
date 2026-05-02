/**
 * Teste visual automatizado do storymap usando Playwright.
 *
 * Lanza Chromium contra http://127.0.0.1:8000, recorre todos os capítulos,
 * fai capturas en escritorio (1280x800) e móbil (390x844), e tamén unha
 * pasada en galego. Tamén recolle erros de consola e respostas HTTP fallidas
 * para detectar fontes rotas, JS quebrado ou recursos 404.
 *
 * Saída en data/teste_visual/:
 *    desktop_es_<capitulo>.png
 *    desktop_gl_<capitulo>.png
 *    mobile_es_<capitulo>.png
 *    log.json (errores e fallos de rede)
 */
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = "http://127.0.0.1:8000/index.html";
const OUT = path.resolve(__dirname, "..", "data", "teste_visual");
fs.mkdirSync(OUT, { recursive: true });

const CAPITULOS = [
  "incendios-2025",
  "tendencia-aumento",
  "galicia-noroeste",
  "tendencia-comparativas",
  "cimadevila-comparacion",
  "mapa-calor-causas",
];

async function recorrerCapitulos(page, prefijo, log) {
  for (const id of CAPITULOS) {
    const found = await page.$(`#${id}`);
    if (!found) {
      log.faltantes.push({ prefijo, capitulo: id, motivo: "id non atopado no DOM" });
      continue;
    }
    await page.evaluate((capId) => {
      const el = document.getElementById(capId);
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    }, id);
    await page.waitForTimeout(1800); // dar tempo a transicións de mapa e renders
    const file = path.join(OUT, `${prefijo}_${id}.png`);
    await page.screenshot({ path: file, fullPage: false });
    log.capturas.push({ prefijo, capitulo: id, file: path.basename(file) });
  }
}

async function correr(viewport, lang, prefijo, log) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();

  page.on("pageerror", (err) => log.erros.push({ prefijo, msg: err.message }));
  page.on("console", (msg) => {
    if (msg.type() === "error") log.consola_erro.push({ prefijo, msg: msg.text() });
  });
  page.on("requestfailed", (req) =>
    log.rede_fallida.push({
      prefijo,
      url: req.url(),
      reason: req.failure()?.errorText,
    })
  );
  page.on("response", (resp) => {
    if (resp.status() >= 400) {
      log.rede_fallida.push({ prefijo, url: resp.url(), status: resp.status() });
    }
  });

  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  // Esperamos a que carguen Mapbox e Observable Plot.
  await page.waitForFunction(
    () => typeof window.mapboxgl !== "undefined" && typeof window.Plot !== "undefined" && typeof window.SerieIncendios !== "undefined",
    null,
    { timeout: 20000 }
  );
  await page.waitForTimeout(1500);
  // Pechamos o popup de aviso de revisión se aparece
  const closeBtn = await page.$("#review-popup-close");
  if (closeBtn) {
    await closeBtn.click().catch(() => {});
    await page.waitForTimeout(400);
  }

  if (lang === "gl") {
    await page.click('#language-selector .language-button[data-lang="gl"]');
    await page.waitForTimeout(800);
  }

  // Snapshot inicial despois de cargar e fixar idioma
  await page.screenshot({ path: path.join(OUT, `${prefijo}_inicio.png`), fullPage: false });

  await recorrerCapitulos(page, prefijo, log);

  // Snapshot focal da gráfica de tendencia para revisión detallada.
  try {
    await page.evaluate(() => {
      const tend = document.getElementById("tendencia-aumento");
      if (tend) tend.scrollIntoView({ behavior: "instant", block: "center" });
    });
    await page.waitForTimeout(2500);
    const grafica = await page.$("#grafica-tendencia");
    if (grafica) {
      const visible = await grafica.isVisible().catch(() => false);
      if (visible) {
        await grafica.screenshot({
          path: path.join(OUT, `${prefijo}_zoom_grafica.png`),
          timeout: 8000,
        });
      } else {
        log.faltantes.push({ prefijo, capitulo: "grafica-tendencia", motivo: "host non visible" });
      }
    } else {
      log.faltantes.push({ prefijo, capitulo: "grafica-tendencia", motivo: "host non atopado" });
    }
  } catch (err) {
    log.faltantes.push({ prefijo, capitulo: "grafica-tendencia", motivo: err.message });
  }

  await browser.close();
}

(async () => {
  const log = {
    erros: [],
    consola_erro: [],
    rede_fallida: [],
    capturas: [],
    faltantes: [],
  };

  // Escritorio + ES
  await correr({ width: 1280, height: 800 }, "es", "desktop_es", log);
  // Escritorio + GL
  await correr({ width: 1280, height: 800 }, "gl", "desktop_gl", log);
  // Móbil + ES
  await correr(devices["iPhone 13"].viewport, "es", "mobile_es", log);

  fs.writeFileSync(path.join(OUT, "log.json"), JSON.stringify(log, null, 2));
  console.log("=== RESUMO ===");
  console.log("capturas:", log.capturas.length);
  console.log("erros JS:", log.erros.length);
  console.log("erros consola:", log.consola_erro.length);
  console.log("rede fallida:", log.rede_fallida.length);
  console.log("ids faltantes:", log.faltantes.length);
  if (log.erros.length) console.log("PRIMEIROS ERROS:", JSON.stringify(log.erros.slice(0, 3), null, 2));
  if (log.consola_erro.length) console.log("CONSOLA:", JSON.stringify(log.consola_erro.slice(0, 3), null, 2));
  if (log.rede_fallida.length) console.log("REDE:", JSON.stringify(log.rede_fallida.slice(0, 3), null, 2));
})();
