/**
 * Teste visual focal do novo tab "Xeoloxía" cargando a capa LITOLOGIA_GALICIA.
 * Aponta ao deploy en miguelferre.github.io para evitar substituír o token Mapbox
 * en local.
 *
 * Saída: data/teste_visual/litologia_*.png + litologia_log.json
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = "https://miguelferre.github.io/STORYMAP_INCENDIOS_GALICIA_2025/?_=" + Date.now();
const OUT = path.resolve(__dirname, "..", "data", "teste_visual");
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const log = { erros: [], consola_erro: [], rede_fallida: [], capturas: [] };
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  page.on("pageerror", (e) => log.erros.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") log.consola_erro.push(m.text()); });
  page.on("response", (r) => { if (r.status() >= 400) log.rede_fallida.push({ url: r.url(), status: r.status() }); });

  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForFunction(() => typeof window.mapboxgl !== "undefined", null, { timeout: 20000 });
  await page.waitForTimeout(2500);

  // Pechar popup se aparece
  const closeBtn = await page.$("#review-popup-close");
  if (closeBtn) { await closeBtn.click().catch(() => {}); await page.waitForTimeout(400); }

  // Ir ao capítulo galicia-noroeste
  await page.evaluate(() => {
    const el = document.getElementById("galicia-noroeste");
    if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: path.join(OUT, "litologia_00_default.png"), fullPage: false });
  log.capturas.push("litologia_00_default.png");

  // Clic na pestana Xeoloxía
  const geoBtn = await page.$('#category-selector .category-tab[data-category="geologia"]');
  if (!geoBtn) { console.error("Pestana geologia non atopada"); }
  else {
    await geoBtn.click();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(OUT, "litologia_01_acidas_basicas_sediment.png"), fullPage: false });
    log.capturas.push("litologia_01_acidas_basicas_sediment.png");

    // Verifica que a capa exista e estea visible
    const layerInfo = await page.evaluate(() => {
      if (!window.map || !window.map.getLayer) return { ok: false, reason: "map non listo" };
      const has = !!window.map.getLayer("LITOLOGIA_GALICIA");
      const vis = has ? window.map.getLayoutProperty("LITOLOGIA_GALICIA", "visibility") : null;
      const src = !!window.map.getSource("litologia-galicia");
      return { ok: has, has, vis, src };
    });
    log.layerInfo = layerInfo;
  }

  fs.writeFileSync(path.join(OUT, "litologia_log.json"), JSON.stringify(log, null, 2));
  console.log("=== RESUMO ===");
  console.log("capturas:", log.capturas.length);
  console.log("layerInfo:", JSON.stringify(log.layerInfo));
  console.log("erros JS:", log.erros.length);
  console.log("erros consola:", log.consola_erro.length);
  console.log("rede fallida:", log.rede_fallida.filter(r => !r.url.includes("favicon")).length);
  if (log.erros.length) console.log("ERROS:", JSON.stringify(log.erros.slice(0, 3)));
  if (log.consola_erro.length) console.log("CONSOLA:", JSON.stringify(log.consola_erro.slice(0, 3)));
  if (log.rede_fallida.length) console.log("REDE:", JSON.stringify(log.rede_fallida.slice(0, 5)));

  await browser.close();
})();
