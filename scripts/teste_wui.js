/**
 * Teste visual focal da capa SILVIS WUI sobre o dNBR de Larouco no capítulo
 * "A pegada do lume". Aponta ao deploy en miguelferre.github.io.
 *
 * Saída: data/teste_visual/wui_*.png + wui_log.json
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

  await page.evaluate(() => {
    const el = document.getElementById("pegada-lume");
    if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(OUT, "wui_01_pegada_lume.png"), fullPage: false });
  log.capturas.push("wui_01_pegada_lume.png");

  const layerInfo = await page.evaluate(() => {
    if (!window.map || !window.map.getLayer) return { ok: false, reason: "map non listo" };
    return {
      dnbr: !!window.map.getLayer("DNBR_LAROUCO"),
      dnbr_vis: window.map.getLayer("DNBR_LAROUCO") ? window.map.getLayoutProperty("DNBR_LAROUCO", "visibility") : null,
      wui_fill: !!window.map.getLayer("WUI_LAROUCO_FILL"),
      wui_fill_vis: window.map.getLayer("WUI_LAROUCO_FILL") ? window.map.getLayoutProperty("WUI_LAROUCO_FILL", "visibility") : null,
      wui_line: !!window.map.getLayer("WUI_LAROUCO_LINE"),
      wui_line_vis: window.map.getLayer("WUI_LAROUCO_LINE") ? window.map.getLayoutProperty("WUI_LAROUCO_LINE", "visibility") : null,
      src: !!window.map.getSource("wui-larouco"),
    };
  });
  log.layerInfo = layerInfo;

  fs.writeFileSync(path.join(OUT, "wui_log.json"), JSON.stringify(log, null, 2));
  console.log("=== RESUMO ===");
  console.log("layerInfo:", JSON.stringify(log.layerInfo));
  console.log("erros JS:", log.erros.length);
  console.log("erros consola:", log.consola_erro.length);
  console.log("rede fallida:", log.rede_fallida.filter(r => !r.url.includes("favicon")).length);
  if (log.erros.length) console.log("ERROS:", JSON.stringify(log.erros.slice(0, 3)));
  if (log.consola_erro.length) console.log("CONSOLA:", JSON.stringify(log.consola_erro.slice(0, 3)));
  if (log.rede_fallida.length) console.log("REDE:", JSON.stringify(log.rede_fallida.slice(0, 5)));

  await browser.close();
})();
