// 验证《清迈丽贝·旅行助手.html》：Edge headless 桌面 + 移动
// 运行：node scripts/verify-app.mjs
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const PW = "C:/Users/MA Jiaojiao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(PW);

const root = process.cwd();
const file = path.join(root, "清迈丽贝·旅行助手.html");
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

  /* ── 桌面 ── */
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  attach(page, "desktop");
  await page.goto(url, { waitUntil: "load", timeout: 45000 });
  await page.waitForSelector("#module-overview:not(.hidden)", { timeout: 20000 });
  await page.waitForSelector("#countdownLabel", { timeout: 10000 });
  await page.waitForTimeout(1500);

  const title = await page.title();
  const countdown = (await page.locator("#countdownLabel").textContent()).trim();
  const routeCards = await page.locator(".route-card").count();
  const flightRows = await page.locator("#module-overview .row").count();
  const buyCols = await page.locator(".buy-col").count();
  const prepCols = await page.locator(".prep-col").count();
  const memberChips = await page.locator(".chip.avatar").count();
  const ovScrollX = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  await page.screenshot({ path: path.join(shots, "a1-overview-desktop.png"), fullPage: false });

  // 切到计划详情
  await page.click('.module-btn[data-module="detail"]');
  await page.waitForSelector("#module-detail:not(.hidden)", { timeout: 10000 });
  await page.waitForSelector(".leaflet-container", { timeout: 20000 });
  await page.waitForTimeout(2500);
  const dayTabs = await page.locator(".day-tab").count();
  const markers = await page.locator(".leaflet-marker-icon").count();
  const mapVisible = await page.locator("#mapPanel").isVisible();
  const mapHiddenClass = await page.evaluate(() => document.body.classList.contains("map-hidden"));
  const chips = await page.locator("#mapTools .mchip").count();
  await page.click('#mapTools .mchip[data-key="google"]');
  await page.waitForTimeout(700);
  const googleActive = await page.evaluate(() => document.querySelector('#mapTools .mchip[data-key="google"]')?.classList.contains("active"));
  const providerStored = await page.evaluate(() => localStorage.getItem("tripMapProvider"));
  await page.click('#mapTools .mchip[data-key="amap"]');
  await page.waitForTimeout(400);
  const amapActive = await page.evaluate(() => document.querySelector('#mapTools .mchip[data-key="amap"]')?.classList.contains("active"));

  // 选择 9/26（D2 射击）
  const tab926 = page.locator(".day-tab", { hasText: "9/26" });
  await tab926.first().click();
  await page.waitForTimeout(1200);
  const d2Title = (await page.locator(".day-head h2").textContent()).trim();
  const d2Reminders = await page.locator("#dayPanel .reminder-item").count();
  const d2Shooting = await page.locator("#dayPanel .tl-body", { hasText: "333" }).count();
  const pinLabels = await page.locator(".pin-label").count();
  const routeLines = await page.evaluate(() => document.querySelectorAll(".leaflet-overlay-pane path.leaflet-interactive").length);

  // 选择 9/28（D4 泰餐+舞课）看预约提醒
  const tab928 = page.locator(".day-tab", { hasText: "9/28" });
  await tab928.first().click();
  await page.waitForTimeout(800);

  // 选择 10/4（D10 COTU 游泳）
  const tab1004 = page.locator(".day-tab", { hasText: "10/4" });
  await tab1004.first().click();
  await page.waitForTimeout(1200);
  const d10Title = (await page.locator(".day-head h2").textContent()).trim();
  const d10Cotu = await page.locator("#dayPanel .tl-body", { hasText: "COTU" }).count();
  const d10Reminders = await page.locator("#dayPanel .reminder-item").count();
  await page.screenshot({ path: path.join(shots, "a2-day1004-desktop.png"), fullPage: false });

  // 备选卡（10/3 D9 宁曼候选）
  const tab1003 = page.locator(".day-tab", { hasText: "10/3" });
  await tab1003.first().click();
  await page.waitForTimeout(800);
  const d9Candidates = await page.locator("#dayPanel .cand-card").count();

  // 地图折叠 / 展开
  await page.click("#mapToggle");
  await page.waitForTimeout(300);
  const collapsed = await page.evaluate(() => document.body.classList.contains("map-hidden"));
  const showBtnVisible = await page.locator("#mapShowBtn").isVisible();
  await page.click("#mapShowBtn");
  await page.waitForTimeout(500);
  const expanded = !(await page.evaluate(() => document.body.classList.contains("map-hidden")));

  // 回总览，地图应自动折叠
  await page.click('.module-btn[data-module="overview"]');
  await page.waitForTimeout(400);
  const autoCollapsed = await page.evaluate(() => document.body.classList.contains("map-hidden"));
  const detailScrollX = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

  /* ── 花费统计 ── */
  await page.click('.module-btn[data-module="expenses"]');
  await page.waitForSelector("#module-expenses:not(.hidden)", { timeout: 10000 });
  await page.waitForTimeout(500);
  const expSums = await page.locator(".exp-sum").count();
  const expPer = await page.locator(".exp-per-item").count();
  const expList0 = await page.locator(".exp-item").count();
  const sharedSeed = (await page.locator(".exp-sum").first().textContent()).replace(/\s+/g, " ");

  // 新增公共花销 ¥300
  await page.fill("#expName", "泰餐课 Mama Noi");
  await page.fill("#expAmount", "300");
  await page.selectOption("#expCurrency", "CNY");
  await page.click("#expSave");
  await page.waitForTimeout(500);
  const expList1 = await page.locator(".exp-item").count();
  const sharedAfter1 = (await page.locator(".exp-sum").first().textContent()).replace(/\s+/g, " ");

  // 个人花销：不填人员应被拦截
  await page.click('#module-expenses .exp-type[data-type="personal"]');
  await page.waitForTimeout(200);
  await page.fill("#expName", "娇娇的按摩");
  await page.fill("#expAmount", "150");
  await page.click("#expSave");
  await page.waitForTimeout(400);
  const expListBlocked = await page.locator(".exp-item").count();

  // 填写人员后保存
  await page.fill("#expPerson", "娇娇");
  await page.click("#expSave");
  await page.waitForTimeout(500);
  const expList2 = await page.locator(".exp-item").count();
  const jiaoTotal = (await page.locator(".exp-per-item", { hasText: "娇娇" }).first().textContent()).replace(/\s+/g, " ");

  // 编辑第一条金额（原位编辑：Bed Changkian 1500 → 500）
  await page.locator(".exp-item").first().locator('[data-act="edit"]').click();
  await page.waitForTimeout(400);
  const editAmount = await page.locator("#eiAmount").inputValue();
  await page.fill("#eiAmount", "500");
  await page.locator('[data-act="save-edit"]').click();
  await page.waitForTimeout(500);
  const expList3 = await page.locator(".exp-item").count();

  // 删除一条
  await page.locator(".exp-item").first().locator('[data-act="del"]').click();
  await page.waitForTimeout(500);
  const expList4 = await page.locator(".exp-item").count();

  // 刷新后持久化（不应重新预填）
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector("#module-overview:not(.hidden)", { timeout: 20000 });
  await page.waitForTimeout(600);
  await page.click('.module-btn[data-module="expenses"]');
  await page.waitForSelector("#module-expenses:not(.hidden)", { timeout: 10000 });
  await page.waitForTimeout(500);
  const expListAfterReload = await page.locator(".exp-item").count();

  /* ── 行程编辑 ── */
  await page.click('.module-btn[data-module="detail"]');
  await page.waitForSelector("#module-detail:not(.hidden)", { timeout: 10000 });
  const tab926b = page.locator(".day-tab", { hasText: "9/26" });
  await tab926b.first().click();
  await page.waitForTimeout(800);
  const tl0 = await page.locator(".tl-item").count();
  // 进入编辑模式
  await page.click("#editToggle");
  await page.waitForTimeout(400);
  const editControls = await page.locator("#dayPanel [data-edit]").count();
  // 添加地点（搜索素贴 → 素贴山）
  await page.click("#editAdd");
  await page.waitForTimeout(400);
  await page.fill("#addSearch", "素贴");
  await page.waitForTimeout(400);
  const pickerRows = await page.locator(".picker-row").count();
  await page.locator(".picker-add").first().click();
  await page.waitForTimeout(600);
  const tl1 = await page.locator(".tl-item").count();
  const transitSegs1 = await page.locator("#dayPanel .tseg").count();
  const mapMarkersAfterAdd = await page.locator(".leaflet-marker-icon").count();
  const pendingTransit = await page.locator("#dayPanel .tseg", { hasText: "待复核" }).count();
  // 删除第一条
  await page.locator(".tl-item").first().locator('[data-edit="del"]').click();
  await page.waitForTimeout(600);
  const tl2 = await page.locator(".tl-item").count();
  // 撤销 → 回到 7
  await page.click("#editUndo");
  await page.waitForTimeout(500);
  const tl3 = await page.locator(".tl-item").count();
  // 再撤销 → 回到原始 6
  await page.click("#editUndo");
  await page.waitForTimeout(500);
  const tl4 = await page.locator(".tl-item").count();
  // 恢复默认
  await page.locator(".tl-item").first().locator('[data-edit="time"]').click();
  await page.waitForTimeout(400);
  await page.fill("#editTime", "16:30");
  await page.click("#editSave");
  await page.waitForTimeout(500);
  await page.click("#editReset");
  await page.waitForTimeout(500);
  const tl5 = await page.locator(".tl-item").count();
  const editedBadge = await page.locator("#dayPanel .badge", { hasText: "已编辑" }).count();
  // 退出编辑
  await page.click("#editToggle");
  await page.waitForTimeout(300);

  /* ── 总览清单编辑 ── */
  await page.click('.module-btn[data-module="overview"]');
  await page.waitForTimeout(500);
  const seven0 = await page.locator(".buy-col").first().locator("li").count();
  await page.click('[data-cardtoggle="buy"]');
  await page.waitForTimeout(300);
  await page.fill('.buy-col input[data-addlist="mustBuy.seven"]', "测试清单项");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  const seven1 = await page.locator(".buy-col").first().locator("li").count();
  await page.locator('.li-del[data-list="mustBuy.seven"]').first().click();
  await page.waitForTimeout(500);
  const seven2 = await page.locator(".buy-col").first().locator("li").count();
  await page.click('[data-cardtoggle="buy"]');
  await page.waitForTimeout(300);

  /* ── 刷新后行程覆盖持久化 ── */
  await page.click('.module-btn[data-module="detail"]');
  await page.waitForTimeout(400);
  const tabd = page.locator(".day-tab", { hasText: "9/26" });
  await tabd.first().click();
  await page.waitForTimeout(400);
  await page.click("#editToggle");
  await page.waitForTimeout(300);
  await page.click("#editAdd");
  await page.waitForTimeout(300);
  await page.locator(".picker-add").first().click();
  await page.waitForTimeout(500);
  const tlPersist0 = await page.locator(".tl-item").count();
  await page.click("#editToggle");
  await page.waitForTimeout(200);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector("#module-overview:not(.hidden)", { timeout: 20000 });
  await page.waitForTimeout(700);
  await page.click('.module-btn[data-module="detail"]');
  await page.waitForTimeout(400);
  const tabd2 = page.locator(".day-tab", { hasText: "9/26" });
  await tabd2.first().click();
  await page.waitForTimeout(500);
  const tlPersist1 = await page.locator(".tl-item").count();
  const editedTabMark = await page.locator('.day-tab', { hasText: "✏️" }).count();

  /* ── 云端同步 ── */
  await page.click("#syncBtn");
  await page.waitForSelector("#syncSheet.open", { timeout: 5000 });
  const room = "vrtest" + Math.floor(Math.random() * 1e6);
  await page.fill("#syncRoom", room);
  await page.click("#syncSaveRoom");
  await page.waitForTimeout(4000);
  const syncStatus = (await page.locator("#syncStatus").textContent().catch(() => "")).replace(/\s+/g, " ").trim();
  const syncDot = await page.evaluate(() => document.querySelector("#syncBtn .dot").className);
  const cloud = await page.evaluate(async (r) => {
    try {
      const res = await fetch("https://qingmai-lipe-2026-default-rtdb.firebaseio.com/rooms/" + encodeURIComponent(r) + "/data.json");
      return await res.json();
    } catch (e) { return { err: String(e) }; }
  }, room);
  const cloudHasData = !!(cloud && (cloud.overrides || cloud.lists || cloud.expenses));
  await page.evaluate(async (r) => { try { await fetch("https://qingmai-lipe-2026-default-rtdb.firebaseio.com/rooms/" + encodeURIComponent(r) + ".json", { method: "DELETE" }); } catch (e) {} }, room);
  await page.click("#syncClose").catch(() => {});

  /* ── 优化项抽查 ── */
  await page.click('.module-btn[data-module="overview"]');
  await page.waitForTimeout(500);
  const memberChipsRow = await page.locator(".member-row .chip").count();
  const navChips = await page.locator("#ovNav .chip").count();
  await page.click('#ovNav .chip[data-goto="sec-buy"]');
  await page.waitForTimeout(400);
  // 待办勾选
  await page.click('[data-cardtoggle="prep"]');
  await page.waitForTimeout(300);
  const todoBoxes = await page.locator(".todo-box").count();
  await page.locator(".todo-box").first().click();
  await page.waitForTimeout(300);
  const todoDone = await page.locator(".todo-box.done").count();
  await page.click('[data-cardtoggle="prep"]');
  await page.waitForTimeout(300);
  // 汇率工具
  await page.click('.module-btn[data-module="expenses"]');
  await page.waitForTimeout(500);
  await page.fill("#fxAmount", "100");
  await page.waitForTimeout(300);
  const fxResult = (await page.locator("#fxResult").textContent()).replace(/\s+/g, " ").trim();
  // 跨日移动：D2 第一个地点移到 D3
  await page.click('.module-btn[data-module="detail"]');
  await page.waitForTimeout(400);
  await page.locator(".day-tab", { hasText: "9/26" }).first().click();
  await page.waitForTimeout(400);
  await page.click("#editToggle");
  await page.waitForTimeout(300);
  await page.locator(".tl-item").first().locator('[data-edit="time"]').click();
  await page.waitForTimeout(300);
  await page.selectOption("#editDay", "day-3");
  await page.click("#editSave");
  await page.waitForTimeout(700);
  const movedDayTitle = (await page.locator(".day-head h2").textContent()).trim();
  await page.click("#editToggle");
  await page.waitForTimeout(200);

  /* ── 移动端 ── */
  const pageM = await browser.newPage({ viewport: { width: 390, height: 844 } });
  attach(pageM, "mobile");
  await pageM.goto(url, { waitUntil: "load", timeout: 45000 });
  await pageM.waitForSelector("#module-overview:not(.hidden)", { timeout: 20000 });
  await pageM.waitForTimeout(1500);
  await pageM.screenshot({ path: path.join(shots, "b1-overview-mobile.png"), fullPage: false });
  const mScrollX = await pageM.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  const mMapBeforeContent = await pageM.evaluate(() => {
    const mp = document.querySelector(".map-panel"); const c = document.querySelector(".content");
    return mp && c ? mp.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING : false;
  });
  await pageM.click('.module-btn[data-module="detail"]');
  await pageM.waitForSelector(".leaflet-container", { timeout: 20000 });
  await pageM.waitForTimeout(2000);
  const mTabs = await pageM.locator(".day-tab").count();
  const mMarkers = await pageM.locator(".leaflet-marker-icon").count();
  await pageM.screenshot({ path: path.join(shots, "b2-detail-mobile.png"), fullPage: false });
  await pageM.close();

  const result = { title, countdown, routeCards, flightRows, buyCols, prepCols, memberChips, ovScrollX,
    dayTabs, markers, mapVisible, mapHiddenClass, chips, googleActive, providerStored, amapActive, d2Title, d2Reminders, d2Shooting, pinLabels, routeLines, d10Title, d10Cotu, d10Reminders,
    d9Candidates, collapsed, showBtnVisible, expanded, autoCollapsed, detailScrollX,
    expSums, expPer, expList0, sharedSeed, expList1, sharedAfter1, expListBlocked, expList2, jiaoTotal,
    editAmount, expList3, expList4, expListAfterReload,
    tl0, editControls, pickerRows, tl1, transitSegs1, mapMarkersAfterAdd, pendingTransit, tl2, tl3, tl4, tl5, editedBadge,
    seven0, seven1, seven2, tlPersist0, tlPersist1, editedTabMark,
    syncStatus, syncDot, cloudHasData,
    memberChipsRow, navChips, todoBoxes, todoDone, fxResult, movedDayTitle,
    mScrollX, mMapBeforeContent, mTabs, mMarkers, errors, warnings };
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  if (errors.length) process.exit(1);
}
run().catch((e) => { console.error("VERIFY FAILED:", e); process.exit(1); });
