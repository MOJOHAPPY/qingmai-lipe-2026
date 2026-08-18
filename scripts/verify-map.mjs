import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const PW = "C:/Users/MA Jiaojiao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(PW);

const root = process.cwd();
const file = path.join(root, "清迈丽贝·悠闲版地图.html");
const url = pathToFileURL(file).href;
const shots = path.join(root, "scripts", "shots");
fs.mkdirSync(shots, { recursive: true });

const errors = [];
const warnings = [];

function attach(page, tag) {
  page.on("console", (m) => { if (m.type() === "error") errors.push(tag + " console.error: " + m.text()); if (m.type() === "warning") warnings.push(tag + " console.warn: " + m.text()); });
  page.on("pageerror", (e) => errors.push(tag + " pageerror: " + e.message));
  page.on("requestfailed", (r) => { const err = r.failure()?.errorText || ""; if (err !== "net::ERR_ABORTED") errors.push(tag + " requestfailed: " + r.url() + " -> " + err); });
}

async function run() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  attach(page, "desktop");
  await page.goto(url, { waitUntil: "load", timeout: 45000 });
  await page.waitForSelector("#tabs .tab", { timeout: 20000 });
  await page.waitForSelector(".leaflet-container", { timeout: 20000 });
  await page.waitForTimeout(3000);

  const tabs = await page.locator("#tabs .tab").count();
  const facts = await page.locator(".fact").count();
  const ovItems = await page.locator("#poiList .tl-item").count();
  const markers = await page.locator(".leaflet-marker-icon, .leaflet-interactive").count();
  const loadedTiles = await page.evaluate(() => document.querySelectorAll("img.leaflet-tile-loaded").length);
  const tileEls = await page.evaluate(() => document.querySelectorAll("img.leaflet-tile").length);
  const title = await page.title();
  await page.screenshot({ path: path.join(shots, "01-overview-desktop.png"), fullPage: false });

  const tab926 = page.locator("#tabs .tab", { hasText: "9/26" });
  if (await tab926.count()) { await tab926.first().click(); await page.waitForTimeout(1500); }
  const dayTitle = await page.locator(".day-head h2").textContent().catch(() => null);
  const dayItems = await page.locator("#poiList .tl-item").count();
  const dayTiles = await page.evaluate(() => document.querySelectorAll("img.leaflet-tile-loaded").length);
  await page.screenshot({ path: path.join(shots, "02-day926-desktop.png"), fullPage: false });

  const search = page.locator("#searchInput");
  await search.fill("瑜伽");
  await page.waitForTimeout(400);
  const visibleAfterSearch = await page.locator("#poiList .tl-item:visible").count();
  await search.fill("");

  const pageM = await browser.newPage({ viewport: { width: 390, height: 844 } });
  attach(pageM, "mobile");
  await pageM.goto(url, { waitUntil: "load", timeout: 45000 });
  await pageM.waitForSelector(".leaflet-container", { timeout: 20000 });
  await pageM.waitForTimeout(3000);
  await pageM.screenshot({ path: path.join(shots, "03-overview-mobile.png"), fullPage: false });
  const mobileTabs = await pageM.locator("#tabs .tab").count();
  const hScroll = await pageM.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  await pageM.close();

  console.log(JSON.stringify({ title, tabs, facts, ovItems, markers, loadedTiles, tileEls, dayTitle, dayItems, dayTiles, visibleAfterSearch, mobileTabs, hScroll, errors, warnings }, null, 2));
  await browser.close();
  if (errors.length) process.exit(1);
}
run().catch((e) => { console.error("VERIFY FAILED:", e); process.exit(1); });