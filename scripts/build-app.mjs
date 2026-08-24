// 生成《清迈丽贝·旅行助手.html》：单文件（Leaflet JS/CSS 内联 + 数据内嵌）
// 运行：node scripts/build-app.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));

/* ---------- 读取数据 ---------- */
const pois = readJson("pois.json");
const itinerary = readJson("itinerary.json");
const poiById = new Map(pois.map((p) => [p.id, p]));

const WEEK = ["日","一","二","三","四","五","六"];
function parseDate(dateStr){ const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr); return m ? new Date(Number(m[1]), Number(m[2])-1, Number(m[3])) : null; }
function label(dateStr){ const d = parseDate(dateStr); return d ? `${d.getMonth()+1}/${d.getDate()}` : dateStr; }
function weekday(dateStr){ const d = parseDate(dateStr); return d ? `周${WEEK[d.getDay()]}` : ""; }

const COLORS = {
  "day-0":"#8e8e93","day-1":"#ff9500","day-2":"#ffb340","day-3":"#ff7a00","day-4":"#ff9f0a",
  "day-5":"#ff3b30","day-6":"#ffcc00","day-7":"#ffd60a","day-8":"#ff6b33",
  "day-9":"#af52de","day-10":"#bf5af2","day-11":"#a55eea","day-12":"#b350dc","day-13":"#8e8e93"
};

const CATEGORIES = [
  { id:"transport", icon:"✈️", label:"交通", color:"#5b8def" },
  { id:"hotel", icon:"🏨", label:"住宿", color:"#8e8e93" },
  { id:"sight", icon:"🏛️", label:"景点", color:"#ff9500" },
  { id:"food", icon:"🍽️", label:"餐厅", color:"#ff6b6b" },
  { id:"cafe", icon:"☕", label:"咖啡", color:"#a2845e" },
  { id:"market", icon:"🧺", label:"市集", color:"#ffb340" },
  { id:"activity", icon:"🎯", label:"兴趣班", color:"#34c759" },
  { id:"spa", icon:"💆", label:"按摩", color:"#e05a92" },
  { id:"shopping", icon:"🛍️", label:"购物", color:"#af52de" },
  { id:"bar", icon:"🎸", label:"酒吧", color:"#5856d6" },
  { id:"nature", icon:"🌿", label:"自然", color:"#30b0c7" },
  { id:"spot", icon:"📍", label:"街区", color:"#0a84ff" }
];
const ROLES = [
  { id:"transit", icon:"🛬", label:"中转", color:"#8e8e93" },
  { id:"arrival", icon:"🛬", label:"抵达", color:"#5b8def" },
  { id:"flight", icon:"✈️", label:"航班", color:"#5b8def" },
  { id:"lodging-anchor", icon:"🏨", label:"住宿", color:"#8e8e93" },
  { id:"landmark", icon:"🏛️", label:"地标", color:"#ff9500" },
  { id:"dinner", icon:"🍤", label:"晚餐", color:"#ff6b6b" },
  { id:"lunch", icon:"🍜", label:"午餐", color:"#ff6b6b" },
  { id:"dinner-walk", icon:"🚶", label:"散步觅食", color:"#0a84ff" },
  { id:"market", icon:"🧺", label:"市集", color:"#ffb340" },
  { id:"night-market", icon:"🌃", label:"夜市", color:"#ffb340" },
  { id:"class", icon:"🎓", label:"课程", color:"#34c759" },
  { id:"shopping", icon:"🛍️", label:"购物", color:"#af52de" },
  { id:"night", icon:"🌙", label:"夜生活", color:"#5856d6" },
  { id:"transfer", icon:"🚐", label:"中转", color:"#8e8e93" },
  { id:"sunset", icon:"🌅", label:"日落", color:"#ff9f0a" },
  { id:"beach", icon:"🏖️", label:"海滩", color:"#30b0c7" },
  { id:"spa", icon:"💆", label:"按摩", color:"#e05a92" },
  { id:"activity", icon:"🎯", label:"体验", color:"#34c759" },
  { id:"art-village", icon:"🎨", label:"艺术村", color:"#af52de" }
];

const days = itinerary.map((d) => {
  const dateLabel = label(d.date);
  const stops = (d.routeStops || []).map((s) => {
    const poi = poiById.get(s.poiId) || null;
    return { poiId: s.poiId, time: s.time || "", role: s.role || "", order: s.order, poi };
  });
  const transit = (d.transitSegments || []).map((t) => ({
    fromPoiId: t.fromPoiId, toPoiId: t.toPoiId, mode: t.mode || "",
    minutes: t.minutes || 0, label: t.label || "",
    fromName: (poiById.get(t.fromPoiId) || {}).name_zh || t.fromPoiId,
    toName: (poiById.get(t.toPoiId) || {}).name_zh || t.toPoiId
  }));
  const candidates = (d.candidates || []).map((id) => poiById.get(id)).filter(Boolean);
  return {
    id: d.id, date: d.date, label: dateLabel, weekday: weekday(d.date), short: d.id.toUpperCase(),
    title: d.title, city: d.city, summary: d.summary,
    color: COLORS[d.id] || "#0a84ff",
    stops, transit, candidates, reminders: d.reminders || []
  };
});

const dayReminders = [];
days.forEach((d) => {
  (d.reminders || []).forEach((r, i) => { dayReminders.push({ id: `${d.id}-r${i}`, text: `${d.label} · ${r.label}（${r.due}）` }); });
});

/* ---------- 总览内容（已核实事实） ---------- */
const TRIP = {
  title: "清迈 + 丽贝岛 · 13 天悠闲版",
  subtitle: "兴趣班 + 市集 + 吃喝 · 3 人 · 2026 中秋国庆（9/24–10/7）",
  generatedAt: "2026-08-18",
  totalDays: 13,
  members: ["娇娇", "宁儿", "琪琪"],
  categories: CATEGORIES,
  roles: ROLES,
  flights: [
    { route: "上海浦东 → 昆明长水", date: "9/24（四）", time: "14:00 → 18:55", airline: "东航/上航 · 国际段经昆明", note: "当晚入住机场周边中转酒店，第二天早班机" },
    { route: "昆明长水 → 清迈", date: "9/25（五）", time: "08:20 → 09:15", airline: "东航/上航", note: "与 9/24 为联程，值机时口头确认行李直挂" },
    { route: "清迈 → 合艾", date: "9/29（二）", time: "11:25 → 13:30", airline: "亚航 FD157", note: "无免费托运，记得提前加购 20kg 行李额" },
    { route: "合艾 → 清迈", date: "10/3（六）", time: "14:00 → 16:00", airline: "亚航 FD158", note: "无免费托运，行李额同上" },
    { route: "清迈 → 昆明长水", date: "10/7（三）", time: "10:05 → 13:00", airline: "东航/上航 · 返程经昆明", note: "16:00 昆明 → 上海 18:55" }
  ],
  lodgings: [
    { name: "昆明机场中转酒店", dates: "9/24 · 1 晚", area: "长水机场周边", note: "选 10 分钟内车程", booked: false },
    { name: "塔佩双子", dates: "9/25–9/29 · 4 晚", area: "古城塔佩门", note: "", booked: true },
    { name: "安纳琳酒店", dates: "9/29 · 1 晚", area: "合艾市区", note: "近 Kim Yong 市场", booked: true },
    { name: "十月夕阳别墅", dates: "9/30–10/2 · 2 晚", area: "丽贝日落沙滩", note: "", booked: true },
    { name: "Z Sleep", dates: "10/2 · 1 晚", area: "合艾 Central Festival 旁", note: "", booked: true },
    { name: "Bed Changkian", dates: "10/3–10/7 · 4 晚", area: "宁曼/昌普", note: "仅限成人 · 带泳池", booked: true }
  ],
  prep: {
    packing: [
      "护照（有效期 > 6 个月）+ 复印件/电子备份",
      "现金泰铢（建议人均 1–2 万铢，机场/古城换汇）+ 银行卡",
      "跨境电话卡 / eSIM（泰国 dtac/AIS/True，出发前买好或落地机场买）",
      "充电宝 + 数据线（泰国两孔扁插，基本无需转换头）",
      "防晒霜 / 遮阳帽 / 墨镜",
      "泳衣 ×2、速干衣、防水手机袋（丽贝出海/酒店泳池）",
      "溯溪鞋/防滑凉鞋 + 防滑运动鞋（黏黏瀑布、丛林飞跃、射击）",
      "可弄脏的速干衣裤 + 备用衣物（大象营/瀑布日）",
      "挂脖手机绳（丛林飞跃/瀑布/射击）",
      "环保购物袋/折叠袋（市集采购）",
      "常用药：肠胃药、感冒药、创可贴、晕船药（丽贝快艇）",
      "一次性雨衣/折叠伞（雨季尾巴，多阵雨）"
    ],
    notes: [
      "中国护照赴泰免签，出行前以官方最新政策为准（备好往返机票与酒店订单）",
      "南奔火车：清迈站现场购票需带护照，到南奔站立即买返程票（去程约 09:30、返程 14:15，错过等 19:15）",
      "寺庙着装：长裤/过膝裙+包肩（南奔古寺、银庙等）",
      "大象营/瀑布日：不骑象不表演，穿可弄脏衣物与防滑鞋，听象夫安排",
      "丛林飞跃/射击：穿长裤运动鞋，听安全讲解，手机挂绳",
      "酒吧低消一杯、安静小酌；按摩可给 20–100 铢小费",
      "打车用 Grab/Bolt，双条车先谈价",
      "丽贝低季快艇可能取消或改日出沙滩上下船，出发前 1–2 天确认",
      "护照与现金分开存放，贵重物品随身"
    ],
    todos: [
      "9/24 昆明中转酒店未订（唯一未订项，长水机场周边 10 分钟内）",
      "亚航 FD157/FD158 提前加购 20kg 行李额",
      "9/30 合艾 ⇄ Pak Bara 车船 + 10/2 丽贝回程快艇确认",
      "TeeTee 弟弟象营提前约 20 天预约（D4 上午 07:00 接送）",
      "Skyline 丛林飞跃提前 1 天确认接送（D2 08:00）",
      "南奔火车往返票（D3，到站即买返程票）",
      "老虎园（若 D4 加站）与 Ekachan/6ixcret 订位",
      "国际航班「已调整」后的最终时刻复核（东航/上航订单）",
      "电话卡/eSIM、换汇、打印/备份酒店与机票订单"
    ]
  },
  mustBuy: {
    seven: [
      "青草膏（卧佛牌）", "Soffell 驱蚊水", "鼻通 Poy-Sian",
      "燕窝（白兰氏/士国）", "Mama 冬阴功泡面", "小老板海苔",
      "Ponds 散粉", "香蕉膏", "手标红茶/泰奶", "Meiji 牛奶", "泰国牙膏/药膏"
    ],
    stores: [
      "Win Cosmetics（塔佩/One Nimman/瓦洛洛总店）——化妆品药妆",
      "Chiang Mai Cosmetics（塔佩）——护肤彩妆",
      "S.Shinawatra 泰丝（Huay Kaew）——丝巾/布料",
      "Lanna Artisans 银器/铜器 DIY（瓦莱）",
      "One Nimman 复古市集（周一/二）——中古衣物",
      "瓦洛洛市场——干果/香薰/陶瓷/草药膏",
      "Bamboo / JJ 市集——手作、蓝染、编织",
      "711 红黑榜详见小红书收藏夹；现场看生产日期、比价"
    ]
  },
  dayReminders,
  days
};

/* ---------- 内联 Leaflet ---------- */
const leafletCss = read("assets/leaflet/leaflet.css");
const leafletJs = read("assets/leaflet/leaflet.js");
const b64 = (f) => fs.readFileSync(path.join(root, "assets/leaflet/images", f)).toString("base64");
let css = leafletCss
  .split("url(images/layers.png)").join(`url(data:image/png;base64,${b64("layers.png")})`)
  .split("url(images/layers-2x.png)").join(`url(data:image/png;base64,${b64("layers-2x.png")})`)
  .split("url(images/marker-icon.png)").join(`url(data:image/png;base64,${b64("marker-icon.png")})`);

/* ---------- 组装 ---------- */
let template = read("scripts/app-template.html");
const json = JSON.stringify(TRIP).replace(/<\//g, "<\\/");
for (const [ph, val] of [["__LEAFLET_CSS__", css], ["__LEAFLET_JS__", leafletJs], ["__APP_DATA__", json]]) {
  if (!template.includes(ph)) throw new Error("template placeholder missing: " + ph);
  template = template.split(ph).join(val);
}
const out = path.join(root, "清迈丽贝·旅行助手.html");
fs.writeFileSync(out, template, "utf8");
console.log("app written:", out, "bytes=", template.length);

