// 一次性数据补丁（幂等）：为「清迈丽贝·旅行助手」新增 POI / 来源 / 动线 / 预约提醒
// 运行：node scripts/patch-app-data.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));
const write = (f, d) => fs.writeFileSync(path.join(root, "data", f), JSON.stringify(d, null, 2) + "\n", "utf8");

/* ---------- 新增 POI ---------- */
const newPois = [
  {
    id: "poi-333-shooting-thaphae",
    name: "333 Shooting Range Thaphae",
    name_zh: "333 射击场（塔佩门店）",
    city: "Chiang Mai", area: "Old City", category: "activity", priority: "preferred",
    coords: [18.7886, 98.9874],
    note: "古城拉差丹嫩路与 Klang Wiang 交叉口（塔佩门商圈）的室内靶场，十余条隔音靶道，可体验手枪/步枪/飞碟等。",
    plan: "D2 15:00 从古城步行前往，体验约 1 小时，之后去银庙与 Wualai 夜市。",
    tip: "营业 10:00–18:00，最晚 17:20 前到场；至少提前 1 小时电话或平台预约。",
    source: "src-333-thaphae",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=333+Shooting+Range+Thaphae+Chiang+Mai",
    contentTier: "standard",
    whyWorthIt: "三个人的新奇体验，古城内步行可达；室内隔音靶道、教练一对一带练，安全讲解到位，适合想给旅程加一点刺激又不想跑远的组合。",
    detailSections: [
      { title: "怎么安排", items: ["提前至少 1 小时电话或平台预约并确认场次", "到场出示护照登记，听安全讲解后按靶道体验"] },
      { title: "注意", items: ["建议穿长裤与运动鞋，现场提供耳罩护目镜", "未成年人能否体验以门店规定为准"] }
    ],
    sourceIds: ["src-333-thaphae"],
    timeWindows: ["10:00–18:00（最晚 17:20 到）"], duration: "约 1 小时",
    themeTags: ["activity", "old-city"],
    reservation: { required: true, method: "电话 / 在线平台", leadTime: "至少提前 1 小时", contact: "064-495-6815", tip: "平台下单后建议再电话确认当日场次" }
  },
  {
    id: "poi-cotu-swim",
    name: "Centre of the Universe (COTU)",
    name_zh: "COTU 泳校（Centre of the Universe）",
    city: "Chiang Mai", area: "Chang Phuak", category: "activity", priority: "preferred",
    coords: [18.8055, 98.9725],
    note: "昌普（Chang Phuak）的大型泳道泳校兼住宿，提供成人私教与儿童游泳课，Mae Khua Mung Rd Soi 4a，距 Bed Changkian 很近。",
    plan: "D10 15:00 上一小时成人私教课，结束后回酒店洗澡休息，晚上去 Warm Up。",
    tip: "泳池每日 07:00–19:00；成人私教/课程需提前邮件或电话预约，约 800–1500 泰铢/小时，以询价为准。",
    source: "src-cotu",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Centre+of+the+Universe+Chiang+Mai",
    contentTier: "standard",
    whyWorthIt: "想认真学游泳而不是只在酒店泡水的话，这是清迈口碑很好的成人泳校：大型泳道池、教练按水平安排私教，而且距 Bed Changkian 步行可达，上课不折腾。",
    detailSections: [
      { title: "怎么安排", items: ["提前邮件或电话预约私教时段并确认价格", "自带泳衣泳镜毛巾，提前 10 分钟到场热身"] },
      { title: "备选", items: ["若 D10 下午太赶，可改到 D11 上午，提前邮件改期"] }
    ],
    sourceIds: ["src-cotu"],
    timeWindows: ["07:00–19:00"], duration: "私教 1 小时",
    themeTags: ["activity", "swim", "chang-phuak"],
    reservation: { required: true, method: "邮件 / 电话预约", leadTime: "建议提前 1–3 天", contact: "053-327-808", tip: "成人私教约 800–1500 泰铢/小时，预约时确认价格与教练" }
  },
  {
    id: "poi-ristr8to-original",
    name: "Ristr8to Original", name_zh: "Ristr8to 咖啡（宁曼 Soi 3）",
    city: "Chiang Mai", area: "Nimman", category: "cafe", priority: "nearby",
    coords: [18.7982, 98.9673],
    note: "Google 高分（约 4.6）的拉花冠军咖啡馆，15/3 Nimmanhaemin Rd Soi 3，招牌 Dirty 与创意拉花。",
    plan: "宁曼段（D9/D10）可选咖啡时间，从 Bed Changkian 步行或 Grab 可达。",
    tip: "营业约 08:00–18:00；周末人多可外带。",
    source: "src-ristr8to",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Ristr8to+Original+Chiang+Mai",
    contentTier: "compact", sourceIds: ["src-ristr8to"],
    rating: 4.6, hours: "约 08:00–18:00",
    themeTags: ["cafe", "nimman"]
  },
  {
    id: "poi-graph-one-nimman",
    name: "GRAPH One Nimman", name_zh: "GRAPH 咖啡（宁曼一号）",
    city: "Chiang Mai", area: "Nimman", category: "cafe", priority: "nearby",
    coords: [18.7987, 98.9688],
    note: "位于 One Nimman 内的高分咖啡馆（Google 约 4.5），招牌分子咖啡与特调，环境适合歇脚。",
    plan: "D4 逛 One Nimman 复古市集时顺路喝一杯。",
    tip: "营业约 09:00–20:00，以到店为准。",
    source: "src-graph-one",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=GRAPH+One+Nimman+Chiang+Mai",
    contentTier: "compact", sourceIds: ["src-graph-one"],
    rating: 4.5, hours: "约 09:00–20:00",
    themeTags: ["cafe", "nimman"]
  },
  {
    id: "poi-graph-ground",
    name: "GRAPH ground", name_zh: "GRAPH ground 咖啡（宁曼）",
    city: "Chiang Mai", area: "Nimman", category: "cafe", priority: "nearby",
    coords: [18.7997, 98.9679],
    note: "GRAPH 系在宁曼的高分分店（Google 约 4.7），空间大、出片，特调创意咖啡是招牌。",
    plan: "D11 从黏黏瀑布回城后，傍晚在宁曼喝杯咖啡再回酒店。",
    tip: "营业时间以到店为准，下午人较多。",
    source: "src-graph-ground",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=GRAPH+ground+Chiang+Mai",
    contentTier: "compact", sourceIds: ["src-graph-ground"],
    rating: 4.7,
    themeTags: ["cafe", "nimman"]
  },
  {
    id: "poi-fern-forest-cafe",
    name: "Fern Forest Cafe", name_zh: "蕨森林咖啡馆（古城）",
    city: "Chiang Mai", area: "Old City", category: "cafe", priority: "nearby",
    coords: [18.7947, 98.9849],
    note: "古城高分花园咖啡馆（Google 约 4.4、2,478 条评价），54/1 Singharat Rd，绿植环绕适合慢坐。",
    plan: "D2/D3 古城慢日可选下午茶歇，从周日夜市或中古店步行可达。",
    tip: "营业 08:00–19:00，Brunch 与蛋糕口碑好。",
    source: "src-fern-forest",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Fern+Forest+Cafe+Chiang+Mai",
    contentTier: "compact", sourceIds: ["src-fern-forest"],
    rating: 4.4, googleReviews: 2478, hours: "08:00–19:00",
    themeTags: ["cafe", "old-city"]
  },
  {
    id: "poi-baristotel",
    name: "The Barisotel by The Baristro", name_zh: "Barisotel 咖啡（宁曼 Soi 7）",
    city: "Chiang Mai", area: "Nimman", category: "cafe", priority: "nearby",
    coords: [18.8013, 98.9661],
    note: "The Baristro 系的设计感咖啡馆（Nimmanhaemin Soi 7），白色建筑好出片，咖啡与简餐都不错。",
    plan: "D10 下午 COTU 游泳前后，顺路在宁曼 Soi 7 一带喝咖啡。",
    tip: "营业约 08:30–18:00，以到店为准。",
    source: "src-baristotel",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=The+Barisotel+Chiang+Mai",
    contentTier: "compact", sourceIds: ["src-baristotel"],
    hours: "约 08:30–18:00",
    themeTags: ["cafe", "nimman"]
  },
  {
    id: "poi-woo-cafe",
    name: "Woo Cafe-Art Gallery", name_zh: "Woo 咖啡馆·艺术馆（瓦洛洛对岸）",
    city: "Chiang Mai", area: "Wat Ket", category: "cafe", priority: "nearby",
    coords: [18.7897, 99.0030],
    note: "80 Charoenrat Rd 的网红咖啡馆兼艺术画廊，摆盘精致、环境花团锦簇，离瓦洛洛市场仅隔河。",
    plan: "D12 瓦洛洛买手信后过桥喝下午茶或吃晚餐。",
    tip: "营业约 09:00–22:00；晚餐需提前订位更稳。",
    source: "src-woo-cafe",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Woo+Cafe+Art+Gallery+Chiang+Mai",
    contentTier: "compact", sourceIds: ["src-woo-cafe"],
    hours: "约 09:00–22:00",
    themeTags: ["cafe", "wat-ket"]
  },
  {
    id: "poi-nara-thai-nimman",
    name: "Nara Thai Cuisine", name_zh: "Nara Thai（宁曼）",
    city: "Chiang Mai", area: "Nimman", category: "food", priority: "nearby",
    coords: [18.7997, 98.9695],
    note: "Google 高分（约 4.7）的泰餐连锁，No.1 Nimman Rd，近 One Nimman/Maya，冬阴功与咖喱蟹口碑好。",
    plan: "D4/D9 宁曼段晚餐或午餐备选，环境适合三人聚餐。",
    tip: "营业 11:00–22:00；饭点常排队，可提前电话订位。",
    source: "src-nara-thai",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Nara+Thai+Cuisine+Chiang+Mai",
    contentTier: "compact", sourceIds: ["src-nara-thai"],
    rating: 4.7, hours: "11:00–22:00",
    themeTags: ["food", "nimman"]
  },
  {
    id: "poi-khun-churn",
    name: "Khun Churn", name_zh: "Khun Churn 泰植·素食（JJ 市集旁）",
    city: "Chiang Mai", area: "Kamthieng", category: "food", priority: "nearby",
    coords: [18.8072, 98.9642],
    note: "老牌泰式素食/蔬食餐厅，新址在 JJ 市集背后 Atsadathon 路一带，自助蔬菜与泰式甜点出名。",
    plan: "D2 逛完 JJ 早市后步行前往午餐，正好顺路。",
    tip: "以当季菜品为准；午餐时段人较多。",
    source: "src-khun-churn",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Khun+Churn+Chiang+Mai",
    contentTier: "compact", sourceIds: ["src-khun-churn"],
    themeTags: ["food", "vegetarian"]
  },
  {
    id: "poi-kao-soy-nimman",
    name: "Kao Soy Nimman", name_zh: "Kao Soy Nimman 咖喱面（宁曼 Soi 7）",
    city: "Chiang Mai", area: "Nimman", category: "food", priority: "nearby",
    coords: [18.7980, 98.9694],
    note: "宁曼 Soi 7 的传奇泰北咖喱面（22 Nimmanhaemin Soi 7），汤浓面脆，泰北香肠也好吃。",
    plan: "D9 宁曼之夜想吃咖喱面时的备选（与 D3 老奶奶咖喱面二选一体验）。",
    tip: "营业约 10:00–20:00，饭点需排队。",
    source: "src-kao-soy-nimman",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kao+Soy+Nimman+Chiang+Mai",
    contentTier: "compact", sourceIds: ["src-kao-soy-nimman"],
    hours: "约 10:00–20:00",
    themeTags: ["food", "nimman"]
  }
];

/* ---------- 新增来源 ---------- */
const newSources = [
  { id: "src-333-thaphae", title: "333 Shooting Range Thaphae（开业报道 + 预约页）", url: "https://www.chiangmaicitylife.com/citynews/general/333-shooting-tha-pae-officially-opens-in-the-heart-of-chiang-mai/", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location", "hours", "booking"] },
  { id: "src-cotu", title: "Centre of the Universe（Chiang Mai Locator）", url: "https://www.chiangmailocator.com/chiang-mai-sports-235:centre-of-the-universe", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location", "hours", "contact"] },
  { id: "src-ristr8to", title: "Ristr8to Original（Specialty Coffee Guide）", url: "https://asiancoffeemap.com/reviews/chiang-mai/ristr8to-original", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location", "rating"] },
  { id: "src-graph-one", title: "GRAPH One Nimman（Google Maps）", url: "https://www.google.com/maps/search/?api=1&query=GRAPH+One+Nimman+Chiang+Mai", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location", "rating"] },
  { id: "src-graph-ground", title: "GRAPH ground（Google Maps）", url: "https://www.google.com/maps/search/?api=1&query=GRAPH+ground+Chiang+Mai", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location", "rating"] },
  { id: "src-fern-forest", title: "Fern Forest Cafe（Timeout）", url: "https://www.timeout.com/chiang-mai/restaurants/fern-forest-cafe", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location", "hours", "rating"] },
  { id: "src-baristotel", title: "The Barisotel by The Baristro（Google Maps）", url: "https://www.google.com/maps/search/?api=1&query=The+Barisotel+Chiang+Mai", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"] },
  { id: "src-woo-cafe", title: "Woo Cafe-Art Gallery（Trip.com）", url: "https://www.trip.com/moments/theme/poi-woo-cafe-art-gallery-lifestyle-shop-19646025-restaurant-993134", type: "platform", role: "location", language: "zh", checkedAt: "2026-08-18", status: "checked", supports: ["location"] },
  { id: "src-nara-thai", title: "Nara Thai Cuisine Chiang Mai（Trip.com）", url: "https://us.trip.com/restaurant/thailand/chiang-mai/detail/nara-thai-cuisine-chiang-mai-123022579/", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location", "hours", "rating"] },
  { id: "src-khun-churn", title: "Khun Churn（HappyCow）", url: "https://www.happycow.net/reviews/khun-churn-chiang-mai-6845", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location", "rating"] },
  { id: "src-kao-soy-nimman", title: "Kao Soy Nimman（Chiang Mai Locator）", url: "https://www.chiangmailocator.com/chiang-mai-restaurants-279:kao-soy-nimman", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location", "rating"] }
];

/* ---------- 行程修改 ---------- */
function patchDays(days) {
  const d2 = days.find((d) => d.id === "day-2");
  d2.summary = "上午去清迈最大的周末创意市集，中午吃咖喱面，下午回酒店午休后去 333 射击场，傍晚在银庙与 Wualai 夜市收尾。";
  d2.routeStops = [
    { poiId: "poi-thapae-twins", order: 0, time: "08:30", role: "lodging-anchor" },
    { poiId: "poi-jing-jai", order: 1, time: "09:00", role: "market" },
    { poiId: "poi-khao-soi-khun-yai", order: 2, time: "12:30", role: "lunch" },
    { poiId: "poi-333-shooting-thaphae", order: 3, time: "15:00", role: "class" },
    { poiId: "poi-wat-srisuphan", order: 4, time: "17:00", role: "landmark" },
    { poiId: "poi-wualai-walking-street", order: 5, time: "17:30", role: "night-market" }
  ];
  d2.transitSegments = [
    { fromPoiId: "poi-thapae-twins", toPoiId: "poi-jing-jai", mode: "Grab", minutes: 15, label: "酒店到 JJ 市集约 15 分钟" },
    { fromPoiId: "poi-jing-jai", toPoiId: "poi-khao-soi-khun-yai", mode: "Grab", minutes: 15, label: "JJ 市集到咖喱面店约 15 分钟" },
    { fromPoiId: "poi-khao-soi-khun-yai", toPoiId: "poi-333-shooting-thaphae", mode: "Grab", minutes: 10, label: "午餐后回古城，打车约 10 分钟" },
    { fromPoiId: "poi-333-shooting-thaphae", toPoiId: "poi-wat-srisuphan", mode: "Grab", minutes: 15, label: "射击场到银庙约 15 分钟" },
    { fromPoiId: "poi-wat-srisuphan", toPoiId: "poi-wualai-walking-street", mode: "步行", minutes: 5, label: "银庙旁即是 Wualai 夜市" }
  ];
  d2.anchors = ["poi-jing-jai", "poi-333-shooting-thaphae", "poi-wualai-walking-street"];
  d2.candidates = ["poi-khun-churn", "poi-fern-forest-cafe"];
  d2.reminders = [
    { label: "预约 333 射击（至少提前 1 小时）", due: "9/26 14:00 前", detail: "电话 064-495-6815 或平台预约，确认 15:00 场次", status: "todo" }
  ];

  const d3 = days.find((d) => d.id === "day-3");
  d3.candidates = ["poi-fern-forest-cafe"];
  d3.reminders = [
    { label: "预约 Wild Rose 瑜伽 09:30 课", due: "提前 1 天", detail: "电话/到店确认课程，约 350 泰铢/课", status: "todo" }
  ];

  const d4 = days.find((d) => d.id === "day-4");
  d4.candidates = ["poi-graph-one-nimman", "poi-nara-thai-nimman"];
  d4.reminders = [
    { label: "预约 Mama Noi 泰餐课（上午班）", due: "提前 1–2 天", detail: "确认集合时间与接送；含市场参观与午餐", status: "todo" },
    { label: "确认 Bailamos 当周舞课班次", due: "D4 前 1 天", detail: "周一 Open-Level 或约私教；若仅周三有课则改 D11 晚", status: "todo" }
  ];

  const d6 = days.find((d) => d.id === "day-6");
  d6.reminders = [
    { label: "确认 9/30 合艾 ⇄ Pak Bara 车船", due: "出发前 1–2 天", detail: "低季快艇可能取消或改日出沙滩上下船，与船公司/酒店确认", status: "todo" }
  ];

  const d8 = days.find((d) => d.id === "day-8");
  d8.reminders = [
    { label: "确认 10/2 丽贝回程快艇班次", due: "10/1 上午", detail: "在岛上与船公司/酒店前台确认次日回 Pak Bara 时间", status: "todo" }
  ];

  const d9 = days.find((d) => d.id === "day-9");
  d9.candidates = ["poi-ristr8to-original", "poi-nara-thai-nimman", "poi-kao-soy-nimman"];

  const d10 = days.find((d) => d.id === "day-10");
  d10.summary = "上午去大象自然公园喂食看洗澡，下午回 Bed Changkian 附近上 COTU 游泳私教课，晚上去宁曼听现场乐队。";
  d10.routeStops = [
    { poiId: "poi-bed-changkian", order: 0, time: "06:45", role: "lodging-anchor" },
    { poiId: "poi-enp", order: 1, time: "07:00", role: "activity" },
    { poiId: "poi-cotu-swim", order: 2, time: "15:00", role: "class" },
    { poiId: "poi-warm-up", order: 3, time: "20:00", role: "night" }
  ];
  d10.transitSegments = [
    { fromPoiId: "poi-bed-changkian", toPoiId: "poi-enp", mode: "园区接驳车", minutes: 60, label: "ENP 上午 07:00 酒店接送，约 13:00 返回" },
    { fromPoiId: "poi-enp", toPoiId: "poi-cotu-swim", mode: "接驳车 + 步行/Grab", minutes: 90, label: "从象园返回后步行/Grab 到 COTU 泳校" },
    { fromPoiId: "poi-cotu-swim", toPoiId: "poi-warm-up", mode: "Grab", minutes: 10, label: "泳课后回酒店洗澡，再打车去 Warm Up" }
  ];
  d10.anchors = ["poi-enp", "poi-cotu-swim", "poi-warm-up"];
  d10.candidates = ["poi-sunday-walking-street", "poi-baristotel"];
  d10.reminders = [
    { label: "预约 ENP 大象自然公园半天", due: "提前 1 天", detail: "含酒店接送与素食午餐，确认 07:00 集合点", status: "todo" },
    { label: "预约 COTU 游泳私教（15:00）", due: "提前 1–3 天", detail: "邮件或电话 053-327-808 预约，约 800–1500 泰铢/小时；太赶可改 D11 上午", status: "todo" }
  ];

  const d11 = days.find((d) => d.id === "day-11");
  d11.candidates = ["poi-bailamos", "poi-graph-ground"];
  d11.reminders = [
    { label: "确认 Bailamos 备选舞课班次", due: "D11 前", detail: "若 D4 已上拉丁舞可跳过；上备选课需先看当周课表或约私教", status: "todo" }
  ];

  const d12 = days.find((d) => d.id === "day-12");
  d12.candidates = ["poi-chiangmai-farewell", "poi-grand-canyon", "poi-doi-suthep", "poi-woo-cafe"];
  d12.reminders = [
    { label: "预订告别晚餐（可加按摩）", due: "D11 前", detail: "热门餐厅建议提前 1 天订位；按摩店具体信息待补", status: "todo" }
  ];

  return days;
}

/* ---------- 执行 ---------- */
const pois = read("pois.json");
const sources = read("sources.json");
const days = read("itinerary.json");
const poisBefore = pois.length, srcBefore = sources.length;

for (const p of newPois) if (!pois.some((x) => x.id === p.id)) pois.push(p);
for (const s of newSources) if (!sources.some((x) => x.id === s.id)) sources.push(s);
const daysPatched = patchDays(days);

write("pois.json", pois);
write("sources.json", sources);
write("itinerary.json", daysPatched);

console.log(`pois ${poisBefore} -> ${pois.length}; sources ${srcBefore} -> ${sources.length}; days patched: ${daysPatched.length}`);
