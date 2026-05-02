/**
 * Teste visual focal das melloras desta iteración:
 *   - dia-xuntou-todo (cronoloxía con dous paneis: overview + zoom)
 *   - pegada-lume (leyenda dNBR + WUI)
 *   - tendencia-comparativas (panel anual con band-x e tooltip ben aliñado)
 *   - galicia-noroeste tab Xeoloxía (color sedimentarios)
 *
 * Saída: data/teste_visual/iter_*.png + iter_log.json
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
  const closeBtn = await page.$("#review-popup-close");
  if (closeBtn) { await closeBtn.click().catch(() => {}); await page.waitForTimeout(400); }

  const capturas = [
    { id: "dia-xuntou-todo", file: "iter_01_cronoloxia.png", wait: 3500 },
    { id: "pegada-lume", file: "iter_02_pegada_lume.png", wait: 3500 },
    { id: "tendencia-comparativas", file: "iter_03_causas.png", wait: 3500 },
  ];
  for (const c of capturas) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    }, c.id);
    await page.waitForTimeout(c.wait);
    await page.screenshot({ path: path.join(OUT, c.file), fullPage: false });
    log.capturas.push(c.file);
  }

  // Tab Xeoloxía no capítulo galicia-noroeste
  await page.evaluate(() => {
    const el = document.getElementById("galicia-noroeste");
    if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await page.waitForTimeout(2500);
  const geoBtn = await page.$('#category-selector .category-tab[data-category="geologia"]');
  if (geoBtn) {
    await geoBtn.click();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(OUT, "iter_04_xeoloxia.png"), fullPage: false });
    log.capturas.push("iter_04_xeoloxia.png");
  }

  fs.writeFileSync(path.join(OUT, "iter_log.json"), JSON.stringify(log, null, 2));
  console.log("=== RESUMO ===");
  console.log("capturas:", log.capturas.length);
  console.log("erros JS:", log.erros.length);
  console.log("erros consola:", log.consola_erro.length);
  console.log("rede fallida:", log.rede_fallida.filter(r => !r.url.includes("favicon")).length);
  if (log.erros.length) console.log("ERROS:", JSON.stringify(log.erros.slice(0, 5)));
  if (log.consola_erro.length) console.log("CONSOLA:", JSON.stringify(log.consola_erro.slice(0, 5)));
  if (log.rede_fallida.length) console.log("REDE:", JSON.stringify(log.rede_fallida.slice(0, 5)));

  await browser.close();
})();
