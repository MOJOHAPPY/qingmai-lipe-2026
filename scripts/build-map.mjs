// 生成《清迈丽贝·悠闲版地图.html》：读取 data JSON，注入地图模板
// 运行：node scripts/build-map.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pois = JSON.parse(fs.readFileSync(path.join(root, "data", "pois.json"), "utf8"));
const itinerary = JSON.parse(fs.readFileSync(path.join(root, "data", "itinerary.json"), "utf8"));
const template = fs.readFileSync(path.join(root, "scripts", "map-template.html"), "utf8");

const WEEK = ["日","一","二","三","四","五","六"];
const dayLabel = (dateStr) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return dateStr;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return `${Number(m[2])}/${Number(m[3])} 周${WEEK[d.getDay()]}`;
};

const COLORS = {
  "day-0": "#8e8e93", "day-1": "#ff9500", "day-2": "#ffb340", "day-3": "#ff7a00", "day-4": "#ff9f0a",
  "day-5": "#ff3b30", "day-6": "#ffcc00", "day-7": "#ffd60a", "day-8": "#ff6b33",
  "day-9": "#af52de", "day-10": "#bf5af2", "day-11": "#a55eea", "day-12": "#b350dc", "day-13": "#8e8e93"
};

const DAYS = [
  { id: "overview", label: "总览", title: "全程总览", date: "", summary: "", stops: [], candidates: [], color: "#0a84ff" },
  ...itinerary.map((d) => ({
    id: d.id,
    label: dayLabel(d.date).split(" ")[0],
    date: dayLabel(d.date),
    title: d.title,
    summary: d.summary,
    stops: d.routeStops.map((s) => ({ poiId: s.poiId, order: s.order, time: s.time || "—", role: s.role || "" })),
    candidates: d.candidates || [],
    color: COLORS[d.id] || "#0a84ff"
  }))
];

const TRIP = {
  title: "清迈 + 丽贝岛 · 13 天悠闲版",
  subtitle: "兴趣班 + 市集 + 吃喝 · 3 人 · 2026 中秋国庆（9/24–10/7）",
  language: "zh-CN",
  generatedAt: "2026-08-18",
  hardFacts: [
    { label: "天数 / 人数", value: "13 天 · 3 人" },
    { label: "国际机票", value: "¥11,935 · 东航/上航经昆明（截图提示航班已调整，出发前复核）" },
    { label: "泰国内陆", value: "亚航 FD157 / FD158 · 无免费托运，提前加购 20kg" },
    { label: "清迈住宿", value: "塔佩双子 4 晚 → Bed Changkian 4 晚（仅限成人，带泳池）" },
    { label: "海岛段", value: "合艾安纳琳 1 晚 → 丽贝十月夕阳 2 晚 → 合艾 Z Sleep 1 晚" },
    { label: "待办重点", value: "9/24 昆明中转酒店未订；丽贝低季船班可能取消，灵活应对" }
  ],
  segments: [
    { name: "清迈古城《兴趣班开场》", days: "9/25–9/29 · 塔佩双子 4 晚", summary: "市集日、身心慢日、兴趣班日：JJ 市集、银庙周六夜市、瑜伽、中古店、周日夜市、爵士吧、泰餐课、复古市集、拉丁舞。" },
    { name: "合艾 + 丽贝《季风尾期的安静海岛》", days: "9/29–10/3", summary: "上岛日落、灵活出海浮潜、拖尾沙滩；国家公园岛 10 月关闭，出海看海况，酒店前浮潜永远保底。" },
    { name: "清迈宁曼《市集续篇》", days: "10/3–10/7 · Bed Changkian 4 晚", summary: "大象自然公园半天、大象粑粑造纸 + 黏黏瀑布、班康瓦艺术村、瓦洛洛手信、宁曼乐队清吧。" }
  ],
  pois,
  days: DAYS
};

const json = JSON.stringify(TRIP, null, 1);
if (!template.includes("__TRIP_DATA__")) throw new Error("template placeholder missing");
const html = template.replace("__TRIP_DATA__", json);
const out = path.join(root, "清迈丽贝·悠闲版地图.html");
fs.writeFileSync(out, html, "utf8");
console.log("map written:", out, "bytes=", html.length);