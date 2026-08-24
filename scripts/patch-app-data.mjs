// 数据补丁（幂等）：Google 地图合集 53 地点入库 + 清迈段路线重排 + 预约提醒
// 运行：node scripts/patch-app-data.mjs
// 注意：不要运行 scripts/build-data.mjs（会覆盖本补丁写入的 data/*.json）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));
const write = (f, d) => fs.writeFileSync(path.join(root, "data", f), JSON.stringify(d, null, 2) + "\n", "utf8");

/* ================================================================
   来源（Google 合集地点复核；Google 域名本环境不可访问，
   统一用可打开的第三方页面 + 搜索摘要复核，checkedAt 2026-08-21）
   ================================================================ */
const mkSource = (id, title, url, supports = ["location", "hours", "rating"], notes = "", checkedAt = "2026-08-21") => ({
  id, title, url, type: "platform", role: "visitor-info", language: "zh-CN",
  checkedAt, status: "checked", supports, notes
});
const newSources = [
  mkSource("src-gm-aiyaret", "Aiyaret Massage（携程攻略）", "https://you.ctrip.com/sight/chiangmai209/4865815.html", ["location", "hours"], "187/10 Chang Klan Rd，约 10:00–21:00，评分约 5.0。"),
  mkSource("src-gm-archery", "The Arrow Rest / Chiang Mai Archery（Thailand Tourist Places）", "https://thailandtouristplaces.com/tag/chiang-mai-old-city/", ["location", "hours", "rating"], "84 Fa Ham；射箭约 270 泰铢/小时，坐标规划级。"),
  mkSource("src-gm-6ixcret", "6ixcret Show（Thailand.org / Trip.com）", "https://www.thailand.org/REVIEWS-6ixcret-show-15471-l.html", ["location", "hours"], "Night Bazaar 2F，19:00–00:30 变装秀。"),
  mkSource("src-gm-rong-sa-dang", "Chiang Mai Swing @ Rong Sa Dang（ToDo.Today）", "https://todo.today/chiang-mai/2026/06/20/chiang-mai-swing-dance-night-4", ["hours", "location"], "63 Tha Phae Rd；周六新手课 20:00–20:45 约 200 泰铢，社交舞 21:00–23:00。"),
  mkSource("src-gm-nong-buak", "Nong Buak Haad Public Park（地图平台）", "https://www.google.com/maps/search/?api=1&query=Nong+Buak+Haad+Public+Park+Chiang+Mai", ["location"], "古城西南角公共公园，全天开放、免费。"),
  mkSource("src-gm-lanna-house", "Lanna Traditional House Museum（Trip.com）", "https://www.trip.com/moments/poi-lanna-traditional-house-museum-22950822/", ["location", "hours", "ticket"], "239 Huay Kaew Rd，约 08:30–16:30，门票 100 泰铢。"),
  mkSource("src-gm-700year", "清迈 700 年射击场（大众点评海外）", "https://osm.dianping.com/os/web/detail?skuId=1698570#/", ["hours", "location"], "周二至周日 09:00–18:00，周一休息。"),
  mkSource("src-gm-cmu-lake", "清迈大学静心湖（Ang Kaew Reservoir，Trip.com）", "https://tw.trip.com/moments/detail/chiang-mai-209-142699867/", ["location"], "清迈大学内环湖步道，免费、全天。"),
  mkSource("src-gm-tok-sen", "Tok Sen Wat Srisuphan NUN TOK SEN（Trip.com 银庙）", "https://tw.trip.com/moments/theme/poi-wat-sri-suphan-91841-attraction-993137", ["location", "hours", "rating"], "银庙内 Tok Sen 木槌按摩；营业约 10:00–20:00。"),
  mkSource("src-gm-heng-heng", "Heng Heng Thai Massage（GoWabi）", "https://www.gowabi.com/en/organization_services/thai-massage-120-min-please-make-a-reservation-at-least-2-hours-in-advance", ["location", "hours", "reservation"], "12/4 宁曼 Soi 13；GoWabi 预约需提前 2 小时以上。"),
  mkSource("src-gm-mango-sticky", "Pranom Health Massage（ประนอม นวดเพื่อสุขภาพ）· Google 中文名「芒果糯米在對面」", "https://www.taiguo.org/REVIEWS-pranom-health-massage-17335-l.html", ["location", "hours", "pricing"], "古城 Ratchadamnoen 路 71 号 Kad Klang Wiang 内；每日 10:00–21:00；泰式按摩 1 小时约 150 泰铢、足底 180、精油 300；Mapcarta 坐标 18.78763,98.9899。", "2026-08-24"),
  mkSource("src-gm-square", "The Square Massage（GoWabi / Klook）", "https://www.gowabi.com/zh-CN/organization_services/couple-organic-coconut-oil-massage-90-min", ["location", "hours", "reservation"], "5 宁曼 Soi 11；约 12:00–24:00，可预约。"),
  mkSource("src-gm-retreat", "Retreat Nimman Massage & Spa（GoWabi）", "https://www.gowabi.com/zh-CN/organization_services/foot-massage-60-min-2a31b2df-7a18-4d4d-b11e-83b1ed2e3e6e", ["location", "reservation"], "宁曼 Soi 17；可预约。"),
  mkSource("src-gm-lanna-artisans", "Lanna Artisans Art Gallery 银器工坊（Trip.com）", "https://tw.trip.com/moments/detail/chiang-mai-209-148020063/", ["location", "hours"], "25/1 Wua Lai Rd；每日约 09:00 起，银铜器手作体验。"),
  mkSource("src-gm-night-safari", "清迈夜间动物园（携程）", "https://you.ctrip.com/sight/hangdong14934/8175.html", ["hours", "ticket"], "杭东，11:00–22:00，夜游电车 17:30–20:00。"),
  mkSource("src-gm-bamboo", "Bamboo Family Market（Visit Thailand Today / HappyCow）", "https://www.visitthailandtoday.com/markets-shopping/chiang-mai/bamboo-family-market", ["hours", "location"], "San Kamphaeng；周五/六/日约 09:00–16:00，以官方 FB/IG 为准。"),
  mkSource("src-gm-changthong", "Changthong Heritage Park 古树公园（Trip.com）", "https://au.trip.com/moments/poi-changthong-heritage-park-149801908", ["hours", "location"], "San Phi Suea 三环；每日约 09:30–16:30。"),
  mkSource("src-gm-khao-tom", "ข้าวต้มนายดำ 2 粥店（MapMyThai / Trip.com）", "https://mapmythai.com/mueang-chiang-mai-district/khaawtmnaaydam-2/5579654", ["location", "hours"], "素帖路军机岔口附近，粥店。"),
  mkSource("src-gm-artisan-sourdough", "Artisan Sourdough by Apple Fahey（Trip.com / 马蜂窝）", "https://www.trip.com/moments/detail/chiang-mai-209-149126938/", ["hours", "location"], "Soi 16 Chanhom, Suthep（乌蒙一带）；08:00–16:30，周三至周日营业（周一/周二休）。"),
  mkSource("src-gm-toen", "TOEN Thai Food & Restaurant（Trip.com / Hotels.com 周边）", "https://ca.hotels.com/ho737262880/buchita-nimman-chiang-mai-thailand/", ["location"], "宁曼一带泰餐，坐标规划级。"),
  mkSource("src-gm-teetee", "TeeTee Elephant Home 弟弟象营（什么值得买 / Klook）", "https://post.smzdm.com/p/az8x2855/", ["reservation", "location", "hours"], "湄登；半日含接送，约提前 20 天预约、名额紧张。"),
  mkSource("src-gm-maha-larb", "Maha Larb CNX（Trip.com）", "https://in.trip.com/moments/detail/chiang-mai-209-136987188", ["location", "rating"], "伊善 larb 餐厅，坐标待核。"),
  mkSource("src-gm-mahoree", "MaHoRee City of Music（Wanderlog / Top-Rated）", "https://wanderlog.com/place/details/5184484/mahoree-city-of-music", ["location", "hours", "rating"], "208/1 Prapokklao Rd；18:30–00:00，评分约 4.6。"),
  mkSource("src-gm-mee-an-ja-kin", "Mee An Ja Kin Cafe & Restaurant（Trip.com）", "https://tw.trip.com/moments/detail/chiang-mai-209-135590051/", ["location", "hours"], "Pa Daet 河畔；每日约 10:00–24:00。"),
  mkSource("src-gm-khoei", "Khoei Chiang Mai - Northern Food（Trip.com）", "https://in.trip.com/moments/detail/chiang-mai-209-144488892", ["location", "hours", "rating"], "14 Santitham Rd；约 11:00 起，评分约 4.8。"),
  mkSource("src-gm-pakorns", "Pakorn's Kitchen（Trip.com / 携程）", "https://www.trip.com/restaurant/thailand/chiang-mai/detail/pakorn-s-kitchen-31299249/", ["location", "hours", "rating"], "186/7 Kampangdin Rd, Hai Ya；约 14:00–22:00，评分约 4.7。"),
  mkSource("src-gm-krua-chalong", "Krua Chalong（Time Out / Airbnb）", "https://www.timeout.com/chiang-mai/restaurants/krua-chalong", ["location", "hours", "rating"], "Chotana Rd；每日 10:00–21:00，招牌蟹肉煎蛋。"),
  mkSource("src-gm-muse", "Muse Massage & Spa Nimman 17（Google 地图贡献 / Klook）", "https://www.klook.cn/zh-CN/activity/156468-vintage-thai-massage-nimman-17-experience-in-chiang-mai/", ["location", "reservation"], "12/3 宁曼 17 巷；可预约。"),
  mkSource("src-gm-ekachan", "Ekachan The Wisdom of Ethnic Thai Cuisine（Trip.com / Time Out）", "https://tw.trip.com/moments/detail/chiang-mai-209-128977326/", ["location", "hours", "rating"], "95 Chang Khlan Rd；11:00–14:30 / 17:00–21:30，米其林必比登。"),
  mkSource("src-gm-skyline", "Skyline Adventure Doi Saket（Trip.com / Klook）", "https://sg.trip.com/moments/poi-skyline-adventure-chiang-mai-33764405", ["location", "hours", "reservation"], "29 Moo 3 Thep Sadet, Doi Saket；半日含接送，需预约。"),
  mkSource("src-gm-mae-tia", "Mae Tia Waterfall（Thailand Tourism Directory / Trip.com）", "https://thailandtourismdirectory.go.th/en/attraction/5145", ["location", "hours", "ticket"], "宗通 Ob Luang 国家公园；约 08:30–16:30，门票约 200 泰铢。"),
  mkSource("src-gm-haripunchai", "Wat Phra That Haripunchai（Trip.com 南奔 / 永安）", "https://tw.trip.com/moments/poi-wat-phra-that-haripunchai-woramahawihan-38612777/", ["location", "hours"], "南奔府城；千年古寺，约 06:00–18:00。"),
  mkSource("src-gm-vintage-market", "宁曼路复古市集 One Nimman（Vision Thai 看见泰国）", "https://visionthai.net/zh-hans/article/thai-chiang-mai-10-markets-tourist-attraction/", ["hours", "location"], "One Nimman 旁；周一/二 16:00–22:00。"),
  mkSource("src-gm-judys", "Judy's Home Café（Trip.com 南奔）", "https://th.trip.com/moments/detail/lamphun-1447102-125835775", ["location", "hours"], "南奔 Kuang 河畔；每日 08:30–17:00。"),
  mkSource("src-gm-chicken-rice", "Thailand Chicken Rice Lamphun 南奔鸡饭（Trip.com）", "https://tw.trip.com/moments/detail/lamphun-1447102-132302928/", ["location", "hours"], "南奔鸡饭店，午市营业。"),
  mkSource("src-gm-big-big-shabu", "Big Big Shabu（Chiang Mai Citylife / Locator）", "https://www.chiangmaicitylife.com/citynow/social-life/live-events/opening-of-new-big-big-shabu/", ["location", "hours"], "77 Sri Phum Rd 北门；16:00–04:00，任食约 219 泰铢起。"),
  mkSource("src-gm-kinlarb", "KINLARB CHIANG MAI（Trip.com）", "https://tw.trip.com/moments/detail/chiang-mai-209-136987188/", ["location"], "宁曼 Sirimangkalajarn 路 larb 店，坐标规划级。"),
  mkSource("src-gm-apollo", "ApolloCafe（待核）", "https://www.google.com/maps/search/?api=1&query=ApolloCafe+Chiang+Mai", ["location"], "位置待核，出发前用 App 内全球搜索复核。"),
  mkSource("src-gm-noir", "Noir cmi（Trip.com / The Infatuation）", "https://sg.trip.com/moments/poi-noir-cmi-140500131/", ["location", "hours", "rating"], "33/11 Charoen Prathet Rd；19:00–01:00，周一休息。"),
  mkSource("src-gm-bar-san", "Bar.San.（Time Out / Trip.com）", "https://www.timeout.com/chiang-mai/news/chiang-mai-takes-2-spots-on-thailands-20-best-bars-list-101425", ["location", "hours", "rating"], "73/1 Charoen Prathet Rd；18:00–00:00。"),
  mkSource("src-gm-shinawatra", "S.Shinawatra Thai Silk（Wanderlog / CMHY）", "https://wanderlog.com/place/details/1760408", ["location", "hours", "rating"], "18 Huay Kaew Rd；约 09:00–17:00。"),
  mkSource("src-gm-win-cosmetics", "Win Cosmetics 长华林店（穷游 / 十六番）", "https://place.qyer.com/poi/V2UJYFFnBz5TZFI_Cms/", ["location", "hours"], "塔佩门一带；一楼护肤彩妆、二楼洗护+零食。"),
  mkSource("src-gm-chiangmai-cosmetics", "Chiang Mai Cosmetics（携程 / 十六番）", "https://you.ctrip.com/shopping/chiangmai209/1728549.html", ["location", "hours"], "帕辛寺对面 + 塔佩店；塔佩店约 11:00–21:00。"),
  mkSource("src-gm-nicha", "Nicha Chiangmai Natural Cotton（待核）", "https://www.google.com/maps/search/?api=1&query=Nicha+Chiangmai+Natural+Cotton", ["location"], "天然棉织品店，位置待核。"),
  mkSource("src-gm-tiger-kingdom", "Tiger Kingdom Chiang Mai（Trip.com / Pickyourtrail）", "https://sg.trip.com/moments/theme/poi-tiger-kingdom-13581840-guides-993135/", ["location", "hours", "ticket"], "Mae Rim；每日 09:00–17:00（最晚 16:30 入场），门票约 188 泰铢，1–2 小时。", "2026-08-21"),
  mkSource("src-gm-market-cnx", "Vintage Market (เท มาร์เก็ต CNX)（Trip.com 清迈市集攻略 / Mapcarta）", "https://tw.trip.com/moments/theme/poi-coconut-market-136623675-comprehensive-guides-993136/", ["location", "hours", "rating"], "清迈大学旁 Su Thep；公开信息显示周二–周四 17:00–22:00（Trip.com 显示至 23:00）；Mapcarta 坐标 18.79423, 98.9646，亦称 Thae Market CNX。", "2026-08-24"),
  mkSource("src-gm-daruma-japan", "DARUMA JAPAN CHIANGMAI（Saraphi，待核）", "https://www.google.com/maps/search/?api=1&query=DARUMA+JAPAN+CHIANGMAI+Saraphi", ["location"], "用户提供地点名；Saraphi 位于清迈⇄南奔铁路沿线，具体位置/营业时间待核。", "2026-08-24")
];

/* ================================================================
   既有新增 POI（333/COTU/咖啡馆备选，幂等保留；如已存在则跳过）
   ================================================================ */
const newPois = [
  {
    id: "poi-cotu-swim", name: "Centre of the Universe (COTU)", name_zh: "COTU 泳校（Centre of the Universe）",
    city: "Chiang Mai", area: "Chang Phuak", category: "activity", priority: "nearby",
    coords: [18.8055, 98.9725], note: "昌普（Chang Phuak）的大型泳道泳校，提供成人私教与儿童游泳课，距 Bed Changkian 很近。",
    plan: "旧收藏·备选：想上游泳课时的首选，成人私教约 800–1500 泰铢/小时。",
    tip: "泳池每日 07:00–19:00；需提前邮件或电话预约。", source: "src-cotu",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Centre+of+the+Universe+Chiang+Mai",
    contentTier: "compact", sourceIds: ["src-cotu"], themeTags: ["swim", "chang-phuak"],
    reservation: { required: true, method: "邮件 / 电话预约", leadTime: "建议提前 1–3 天", contact: "053-327-808", tip: "成人私教约 800–1500 泰铢/小时" }
  },
  { id: "poi-ristr8to-original", name: "Ristr8to Original", name_zh: "Ristr8to 咖啡（宁曼 Soi 3）", city: "Chiang Mai", area: "Nimman", category: "cafe", priority: "nearby", coords: [18.7982, 98.9673], note: "旧收藏·备选：拉花冠军咖啡馆，招牌 Dirty 与创意拉花。", tip: "营业约 08:00–18:00。", source: "src-ristr8to", mapUrl: "https://www.google.com/maps/search/?api=1&query=Ristr8to+Original+Chiang+Mai", contentTier: "compact", sourceIds: ["src-ristr8to"], rating: 4.6, hours: "约 08:00–18:00", themeTags: ["cafe", "nimman"] },
  { id: "poi-graph-one-nimman", name: "GRAPH One Nimman", name_zh: "GRAPH 咖啡（宁曼一号）", city: "Chiang Mai", area: "Nimman", category: "cafe", priority: "nearby", coords: [18.7987, 98.9688], note: "旧收藏·备选：One Nimman 内高分咖啡馆，分子咖啡与特调。", tip: "营业约 09:00–20:00。", source: "src-graph-one", mapUrl: "https://www.google.com/maps/search/?api=1&query=GRAPH+One+Nimman+Chiang+Mai", contentTier: "compact", sourceIds: ["src-graph-one"], rating: 4.5, hours: "约 09:00–20:00", themeTags: ["cafe", "nimman"] },
  { id: "poi-graph-ground", name: "GRAPH ground", name_zh: "GRAPH ground 咖啡（宁曼）", city: "Chiang Mai", area: "Nimman", category: "cafe", priority: "nearby", coords: [18.7997, 98.9679], note: "旧收藏·备选：GRAPH 系宁曼高分分店，空间大、出片。", tip: "营业时间以到店为准。", source: "src-graph-ground", mapUrl: "https://www.google.com/maps/search/?api=1&query=GRAPH+ground+Chiang+Mai", contentTier: "compact", sourceIds: ["src-graph-ground"], rating: 4.7, themeTags: ["cafe", "nimman"] },
  { id: "poi-fern-forest-cafe", name: "Fern Forest Cafe", name_zh: "蕨森林咖啡馆（古城）", city: "Chiang Mai", area: "Old City", category: "cafe", priority: "nearby", coords: [18.7947, 98.9849], note: "旧收藏·备选：古城高分花园咖啡馆，绿植环绕。", tip: "营业 08:00–19:00。", source: "src-fern-forest", mapUrl: "https://www.google.com/maps/search/?api=1&query=Fern+Forest+Cafe+Chiang+Mai", contentTier: "compact", sourceIds: ["src-fern-forest"], rating: 4.4, hours: "08:00–19:00", themeTags: ["cafe", "old-city"] },
  { id: "poi-baristotel", name: "The Barisotel by The Baristro", name_zh: "Barisotel 咖啡（宁曼 Soi 7）", city: "Chiang Mai", area: "Nimman", category: "cafe", priority: "nearby", coords: [18.8013, 98.9661], note: "旧收藏·备选：The Baristro 系设计感咖啡馆。", tip: "营业约 08:30–18:00。", source: "src-baristotel", mapUrl: "https://www.google.com/maps/search/?api=1&query=The+Barisotel+Chiang+Mai", contentTier: "compact", sourceIds: ["src-baristotel"], hours: "约 08:30–18:00", themeTags: ["cafe", "nimman"] },
  { id: "poi-woo-cafe", name: "Woo Cafe-Art Gallery", name_zh: "Woo 咖啡馆·艺术馆（瓦洛洛对岸）", city: "Chiang Mai", area: "Wat Ket", category: "cafe", priority: "nearby", coords: [18.7897, 99.0030], note: "旧收藏·备选：瓦洛洛对岸网红咖啡馆兼艺术画廊。", tip: "营业约 09:00–22:00。", source: "src-woo-cafe", mapUrl: "https://www.google.com/maps/search/?api=1&query=Woo+Cafe+Art+Gallery+Chiang+Mai", contentTier: "compact", sourceIds: ["src-woo-cafe"], hours: "约 09:00–22:00", themeTags: ["cafe", "wat-ket"] },
  { id: "poi-nara-thai-nimman", name: "Nara Thai Cuisine", name_zh: "Nara Thai（宁曼）", city: "Chiang Mai", area: "Nimman", category: "food", priority: "nearby", coords: [18.7995, 98.9700], note: "旧收藏·备选：Google 高分（约 4.7）泰餐。", tip: "营业时间以到店为准。", source: "src-nara-thai", mapUrl: "https://www.google.com/maps/search/?api=1&query=Nara+Thai+Chiang+Mai", contentTier: "compact", sourceIds: ["src-nara-thai"], rating: 4.7, themeTags: ["food", "nimman"] },
  { id: "poi-khun-churn", name: "Khun Churn", name_zh: "Khun Churn 泰植·素食（JJ 市集旁）", city: "Chiang Mai", area: "Thanin", category: "food", priority: "nearby", coords: [18.8070, 98.9780], note: "旧收藏·备选：JJ 市集旁的高分素食泰餐。", tip: "营业时间以到店为准。", source: "src-khun-churn", mapUrl: "https://www.google.com/maps/search/?api=1&query=Khun+Churn+Chiang+Mai", contentTier: "compact", sourceIds: ["src-khun-churn"], rating: 4.5, themeTags: ["food", "thanin"] },
  { id: "poi-kao-soy-nimman", name: "Kao Soy Nimman", name_zh: "Kao Soy Nimman 咖喱面（宁曼 Soi 7）", city: "Chiang Mai", area: "Nimman", category: "food", priority: "nearby", coords: [18.8008, 98.9665], note: "旧收藏·备选：宁曼高分咖喱面。", tip: "营业时间以到店为准。", source: "src-kao-soy-nimman", mapUrl: "https://www.google.com/maps/search/?api=1&query=Kao+Soy+Nimman+Chiang+Mai", contentTier: "compact", sourceIds: ["src-kao-soy-nimman"], rating: 4.7, themeTags: ["food", "nimman"] }
];

/* ================================================================
   Google 合集 POI（53 个；已存在的复用原 id 只补字段，其余新增 poi-gm-*）
   必去 18 个：Jing Jai / 周日夜市 / North Gate Jazz / 6ixcret / Rong Sa Dang /
   Lanna 民居博物馆 / 大象粑粑造纸 / 黏黏瀑布 / Lanna Artisans / Bamboo 市集 /
   Changthong / Artisan 面包 / TeeTee 象营 / MaHoRee / Skyline / 南奔古寺 / Vintage 市集 / Noir / Bar.San.
   ================================================================ */
const POI = (o) => {
  const p = Object.assign({ city: "Chiang Mai", priority: "preferred", contentTier: "standard", sourceTag: "google合集", themeTags: ["google-collection"], mustVisit: false }, o);
  if (!p.source) p.source = (p.sourceIds && p.sourceIds[0]) || "";
  if (!p.plan) p.plan = p.contentTier === "compact" ? "备选：按当天动线顺路安排，不占主路线；出发前用 App 内全球搜索复核坐标。" : "";
  return p;
};
const collectionPois = [
  /* ---- D1 抵达购物 ---- */
  POI({ id: "poi-gm-chiangmai-cosmetics", name: "Chiang Mai Cosmetics", name_zh: "Chiang Mai Cosmetics（塔佩店）", area: "Old City / Tha Phae", category: "shopping", coords: [18.7880, 98.9910], rating: 4.6, hours: "11:00–21:00",
    note: "塔佩门附近的本地化妆品/药妆店，护肤彩妆、零食与本地特产都有，标价实在、可退税。",
    plan: "D1 抵达寄存行李后先来这里买化妆品与护肤品，赶在 15:00 入住前完成首轮采购。",
    tip: "塔佩店约 11:00–21:00；满 2000 泰铢可退税，尽量 20:30 前办妥退税单。",
    whyWorthIt: "到清迈第一天先解决化妆品与护肤品采购，是这趟行程的既定安排：这家店在塔佩门一带，离酒店近、品类全、价格比国内便宜，正好利用入住前的空档。",
    detailSections: [ { title: "买什么", items: ["本地护肤彩妆品牌、防晒与日常补货，比国内专柜便宜", "顺手带点零食与本地特产，同一家店一次买齐"] }, { title: "注意", items: ["满 2000 泰铢可退税，结账时主动要求开退税单", "畅销单品可能断货，看到就拿下，别等回头"] } ],
    sourceIds: ["src-gm-chiangmai-cosmetics"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Chiang+Mai+Cosmetics+Thapae+Chiang+Mai" }),
  POI({ id: "poi-gm-win-hualin", name: "Win Cosmetics Hualin Corner", name_zh: "Win Cosmetics（长华林店·塔佩）", area: "Old City / Tha Phae", category: "shopping", coords: [18.7888, 98.9920], rating: 4.5, hours: "约 09:00–21:00",
    note: "塔佩门旁的两层药妆店：一楼护肤彩妆、二楼洗护，另有一区零食，是清迈买化妆品最顺手的店之一。",
    plan: "D1 上午与 Chiang Mai Cosmetics 一起逛，购物集中在一段路内完成。",
    tip: "比价小贴士：瓦洛洛总店最全最便宜，但这家长华林店离酒店最近，先在这里买齐主力。",
    whyWorthIt: "买化妆品衣服是抵达日的主线，长华林店就在塔佩门商圈，一层护肤彩妆二层洗护还有零食区，三个人一次能把清单买齐，不用在到达日到处跑。",
    detailSections: [ { title: "怎么逛", items: ["一楼看护肤与彩妆，二楼看洗护用品", "零食区可以顺手补旅行干粮"] }, { title: "注意", items: ["退税单与购物清单当天整理好", "重货与大批量采购留到瓦洛洛总店更划算"] } ],
    sourceIds: ["src-gm-win-cosmetics"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Win+Cosmetics+Hualin+Corner+Chiang+Mai" }),
  POI({ id: "poi-gm-big-big-shabu", name: "Big Big Shabu", name_zh: "Big Big Shabu（北门自助火锅）", area: "Chang Phueak", category: "food", coords: [18.7968, 98.9845], rating: 4.3, hours: "16:00–04:00",
    note: "古城北门附近的老牌任食火锅+烧烤，约 219 泰铢/人起，本地人宵夜最爱，性价比很高。",
    plan: "D1 晚餐在北门店吃自助火锅烧烤，饭后步行 5 分钟到 North Gate Jazz 听爵士。",
    tip: "晚间营业到凌晨；人多吃得热闹，建议 18:30 前到避开高峰。",
    whyWorthIt: "三个人第一晚吃一顿 219 泰铢起的自助火锅加烧烤，热热闹闹又便宜，位置就在北门，吃完走几步就是 North Gate Jazz，晚餐和夜生活无缝衔接。",
    detailSections: [ { title: "怎么吃", items: ["任食火锅+烧烤，蘸料和小菜自助", "海鲜和肉类按盘取，注意别浪费"] }, { title: "注意", items: ["营业 16:00–04:00，晚餐早到人少", "部分分店只收现金，先确认支付方式"] } ],
    sourceIds: ["src-gm-big-big-shabu"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Big+Big+Shabu+Chiang+Mai" }),

  /* ---- D2 市集+射击+摇摆舞 ---- */
  POI({ id: "poi-gm-khoei", name: "Khoei Chiang Mai - Northern Food", name_zh: "Khoei 泰北菜（Santitham）", area: "Santitham", category: "food", coords: [18.8025, 98.9825], rating: 4.8, hours: "约 11:00–21:00",
    note: "Santitham 路上的在地泰北菜，Google 高分（约 4.8），香肠、炸鸡翅、臭虾酱炒空心菜都是招牌。",
    plan: "D2 从 JJ 市集出来后顺路午餐，就在市集旁的生活区。",
    tip: "饭点人多，建议 12:00 前后到；菜单有图，点菜不慌。",
    whyWorthIt: "逛完 JJ 市集正好到 Santitham 吃一顿本地人排队的泰北菜，香肠和炸鸡翅口碑极好，价格实在，是市集日最顺路的午餐选择。",
    detailSections: [ { title: "推荐菜", items: ["泰北香肠、黄金虾饼、炸鸡翅", "臭虾酱炒空心菜，重口味星人必点"] }, { title: "注意", items: ["营业从 11:00 开始，午餐别去太早", "高峰期可能需要等位，可先取号"] } ],
    sourceIds: ["src-gm-khoei"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Khoei+Chiang+Mai+Northern+Food" }),
  POI({ id: "poi-gm-tok-sen", name: "Tok Sen Wat Srisuphan (NUN TOK SEN)", name_zh: "Tok Sen 银庙按摩（NUN TOK SEN）", area: "Wua Lai", category: "spa", coords: [18.7795, 98.9855], rating: 4.6, hours: "约 10:00–20:00",
    note: "银庙（Wat Srisuphan）里的传统 Tok Sen 木槌敲打按摩，用柚木锤沿经络敲打放松，是清迈特色体验。",
    plan: "D2 傍晚在 Wua Lai 一带做完按摩，再回塔佩路上摇摆舞课。",
    tip: "建议提前半天电话预约；可先逛银庙再按摩，一次满足参观+体验。",
    whyWorthIt: "Tok Sen 是清迈特有的木槌敲打按摩，这家就在银庙里，做完浑身松快，比普通泰式按摩更有仪式感，适合射击日走了一天之后放松。",
    detailSections: [ { title: "体验流程", items: ["换好衣服后躺下，技师用柚木锤沿背部经络敲打", "全程约 60–90 分钟，力道可随时沟通"] }, { title: "注意", items: ["建议提前电话预约时段", "银庙大殿女性需注意着装，按摩项目不受影响"] } ],
    sourceIds: ["src-gm-tok-sen"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Tok+Sen+Wat+Srisuphan+Chiang+Mai",
    reservation: { required: true, method: "电话预约", leadTime: "提前半天", contact: "以 Google 地图电话为准", tip: "下午时段较满，建议 D2 上午就约" } }),
  POI({ id: "poi-gm-rong-sa-dang", name: "Rong Sa Dang Chiang Mai", name_zh: "Rong Sa Dang（塔佩路摇摆舞）", area: "Old City / Tha Phae", category: "bar", coords: [18.7884, 98.9915], rating: 4.7, hours: "周六摇摆舞 20:00–23:00", mustVisit: true,
    note: "63 Tha Phae Rd 的演出场地，清迈摇摆舞社区每周六晚在此办新手课+社交舞会，新手也能跳。",
    plan: "D2 晚上 20:00 上新手课（约 200 泰铢），21:00 起参加社交舞会，体验摇摆舞。",
    tip: "周六新手课 20:00–20:45 约 200 泰铢，社交舞会 21:00–23:00；穿舒服的鞋。",
    whyWorthIt: "你点名的必去体验：周六晚的摇摆舞社交夜对新手很友好，先上一节 200 泰铢的新手课再直接跳社交舞，现场乐队伴奏，是清迈最有氛围的夜晚之一。",
    detailSections: [ { title: "怎么参加", items: ["20:00 前到场，参加新手基础课约 200 泰铢", "21:00 起自由社交舞，可一直跳到 23:00"] }, { title: "注意", items: ["穿轻便好活动的鞋", "酒水在场地内单点，入场以现场为准"] } ],
    sourceIds: ["src-gm-rong-sa-dang"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Rong+Sa+Dang+Chiang+Mai",
    reservation: { required: false, method: "现场参加", leadTime: "建议 19:45 前到", tip: "周六固定举办；若当周取消以场地公告为准" } }),

  /* ---- D3 公园瑜伽+手工市集+周日夜市 ---- */
  POI({ id: "poi-gm-nong-buak", name: "Nong Buak Haad Public Park", name_zh: "Nong Buak Haad 公园", area: "Old City / South", category: "nature", coords: [18.7802, 98.9838], rating: 4.6, hours: "全天开放",
    note: "古城西南角的公共公园，有大草坪、湖与晨练人群，适合早晨散步或自己做公园瑜伽。",
    plan: "D3 早上 8 点前到公园晨走+公园瑜伽，随后去 Artisan 面包店吃早餐。",
    tip: "清晨凉快人少；自带瑜伽垫在草坪上练即可，免费。",
    whyWorthIt: "不想赶景点，就用公园瑜伽打开一天：古城西南的这片大草坪清晨特别安静，铺开垫子就能自己练，慢节奏正好契合这趟清迈的基调。",
    detailSections: [ { title: "怎么玩", items: ["清晨在草坪晨走或铺垫练瑜伽", "湖边树荫下乘凉、看本地人晨练"] }, { title: "注意", items: ["清晨凉爽但注意防蚊", "公共公园免费，无需门票"] } ],
    sourceIds: ["src-gm-nong-buak"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Nong+Buak+Haad+Public+Park+Chiang+Mai" }),
  POI({ id: "poi-gm-artisan-sourdough", name: "Artisan Sourdough by Apple Fahey", name_zh: "Artisan 酸种面包（Apple Fahey）", area: "Suthep / Wat Umong", category: "cafe", coords: [18.7850, 98.9635], rating: 4.7, hours: "08:00–16:30（周三至周日）", mustVisit: true,
    note: "素贴山脚下的口碑酸种面包店，欧式田园小院，面包是清迈的『天花板』级别，常常早去才买得到。",
    plan: "D3 从公园瑜伽后过来吃面包早餐，喝咖啡歇脚。",
    tip: "周三至周日营业、周一/周二休；热门款可能售罄，建议 9 点前到。",
    whyWorthIt: "你点名的必去面包店：藏在素贴山脚下的小院里，手工酸种面包是清迈公认的顶流，早上过来配咖啡当早餐，是公园瑜伽后最治愈的一站。",
    detailSections: [ { title: "吃什么", items: ["招牌酸种面包、可颂与季节限定口味", "配一杯手冲或冰美式慢慢坐"] }, { title: "注意", items: ["周三至周日营业，周一/周二休息", "建议 9:00 前到，热门款容易售罄"] } ],
    sourceIds: ["src-gm-artisan-sourdough"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Artisan+Sourdough+by+Apple+Fahey+Chiang+Mai" }),
  POI({ id: "poi-gm-lanna-artisans", name: "Lanna Artisans Art Gallery", name_zh: "Lanna Artisans 银器工坊", area: "Wua Lai", category: "sight", coords: [18.7795, 98.9860], rating: 4.6, hours: "每日 09:00–18:00（约）", mustVisit: true,
    note: "Wua Lai 路上的兰纳手工艺体验空间，可以看银器/铜器匠人现场打制，也能亲手做小饰品。",
    plan: "D3 上午参观+体验银器小件制作，与银庙、按摩串成一条银饰街区动线。",
    tip: "现场有师傅演示，DIY 价格按项目计；不用预约，随到随体验。",
    whyWorthIt: "你点名的必去体验：在瓦莱银器街亲手敲一件银铜小物，看匠人现场打制，比单纯逛街更有参与感，做完正好带走当旅行纪念。",
    detailSections: [ { title: "怎么体验", items: ["看匠人现场打制银器铜器", "选小件 DIY，师傅手把手带"] }, { title: "注意", items: ["体验区为半户外，注意防晒补水", "成品制作需 30–60 分钟，预留时间"] } ],
    sourceIds: ["src-gm-lanna-artisans"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Lanna+Artisans+Art+Gallery+Chiang+Mai" }),
  POI({ id: "poi-gm-bamboo-market", name: "Bamboo Family Market", name_zh: "Bamboo 竹林家庭市集", area: "San Kamphaeng", category: "market", coords: [18.7470, 99.1150], rating: 4.6, hours: "周末 09:00–16:00", mustVisit: true,
    note: "San Kamphaeng 的竹林市集，主打本地手作、有机小农与现场弹唱，比 JJ 更 local、更安静。",
    plan: "D3 中午从古城包车/打车过来逛 2 小时，再回古城赶周日夜市。",
    tip: "通常周六/周日 9:00–16:00 营业；出发前看官方 FB/IG 确认当周场次。",
    whyWorthIt: "你点名的必去市集：藏在一片竹林里的家庭市集，手作和有机小摊比 JJ 更本地，现场还有弹唱，周末专程跑一趟很值。",
    detailSections: [ { title: "逛什么", items: ["本地手作、织物与竹编", "有机蔬果与现做小吃，现场弹唱"] }, { title: "注意", items: ["周六/周日营业，周五偶有加场", "出发前看 FB/IG 确认，避免扑空"] } ],
    sourceIds: ["src-gm-bamboo"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Bamboo+Family+Market+Chiang+Mai" }),
  POI({ id: "poi-gm-mahoree", name: "MaHoRee City of Music", name_zh: "MaHoRee 音乐之城", area: "Old City / Prapokklao", category: "bar", coords: [18.7895, 98.9860], rating: 4.6, hours: "18:30–00:00", mustVisit: true,
    note: "古城 Prapokklao 路上的现场爵士/世界音乐酒吧，氛围私密，是清迈 top 级别的 live 现场。",
    plan: "D3 周日夜市逛到后半段，拐进 Prapokklao 路听一场现场爵士收尾。",
    tip: "18:30 开门，周末人多建议早点到占座；低消一杯酒水。",
    whyWorthIt: "你点名的必去夜场：在古城中心听一场高质量现场爵士，和白天逛市集完全是两种节奏，是周日夜市之后最理想的收尾。",
    detailSections: [ { title: "怎么体验", items: ["点一杯酒或软饮，听现场乐队演出", "节目以当天排期为准，通常每晚都有 live"] }, { title: "注意", items: ["18:30 开始营业，建议 20:30 前到占座", "周末人多，低声聊天保持现场氛围"] } ],
    sourceIds: ["src-gm-mahoree"], mapUrl: "https://www.google.com/maps/search/?api=1&query=MaHoRee+City+of+Music+Chiang+Mai" }),

  /* ---- D4 丛林飞跃+复古市集 ---- */
  POI({ id: "poi-gm-skyline", name: "Skyline Adventure (Doi Saket)", name_zh: "Skyline 丛林飞跃（Doi Saket）", area: "Doi Saket", category: "activity", coords: [18.8720, 99.1350], rating: 4.8, hours: "半日（含接送）", mustVisit: true,
    note: "Doi Saket 的丛林飞跃，900 米超长滑索+21 条滑索 38 个平台，还有丛林滑车，刺激又安全。",
    plan: "D4 上午 08:00 酒店接送出发，约 13:30 返回市区，下午安排按摩与市集。",
    tip: "需提前预约并确认接送时间；穿运动鞋长裤，手机挂绳。",
    whyWorthIt: "你点名的必去户外项目：在清迈东部森林里飞越 900 米长滑索，教练带队、装备专业，半日含接送不占整天，下午还能继续逛市集。",
    detailSections: [ { title: "怎么玩", items: ["酒店接送至 Doi Saket 营地，教练讲解后开飞", "21 条滑索+巨型秋千+丛林滑车，约 3 小时"] }, { title: "注意", items: ["穿运动鞋、长裤，长发扎起", "手机相机用挂绳固定，贵重物品少带"] } ],
    sourceIds: ["src-gm-skyline"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Skyline+Adventure+Doi+Saket+Chiang+Mai",
    reservation: { required: true, method: "平台/官网预约", leadTime: "提前 1 天确认接送", tip: "D4 上午 08:00 出发，约 13:30 返回" } }),
  POI({ id: "poi-gm-square-massage", name: "The Square Massage", name_zh: "The Square Massage（宁曼）", area: "Nimman Soi 11", category: "spa", coords: [18.7975, 98.9705], rating: 4.6, hours: "约 12:00–24:00",
    note: "宁曼 Soi 11 的专业按摩店，泰式/精油/椰子油按摩口碑好，环境干净。",
    plan: "D4 从 Skyline 回来后下午做 90 分钟精油按摩放松。",
    tip: "GoWabi 可预约，建议提前 2 小时以上订；两人同行可选双人套餐。",
    whyWorthIt: "上午飞完丛林，下午正好用一场宁曼的专业按摩回血；这家在 Soi 11，离 One Nimman 和晚餐都很近，动线顺。",
    detailSections: [ { title: "怎么约", items: ["GoWabi 提前预约，选精油或椰子油按摩", "90 分钟套餐最舒服，做完全身轻松"] }, { title: "注意", items: ["提前 2 小时以上预约更稳", "女生结伴可约双人房"] } ],
    sourceIds: ["src-gm-square"], mapUrl: "https://www.google.com/maps/search/?api=1&query=The+Square+Massage+Chiang+Mai",
    reservation: { required: true, method: "GoWabi / 电话预约", leadTime: "提前 2 小时以上", tip: "D4 下午 15:00 场次" } }),
  POI({ id: "poi-gm-shinawatra-silk", name: "S.Shinawatra Thai Silk", name_zh: "S.Shinawatra 泰丝", area: "Huay Kaew", category: "shopping", coords: [18.8060, 98.9650], rating: 4.4, hours: "09:00–17:00",
    note: "清迈老牌泰丝品牌，Huay Kaew 路分店有围巾、布料与定制衣物，工艺讲究。",
    plan: "D4 下午顺路逛泰丝店，给家人带丝巾或面料。",
    tip: "营业约 09:00–17:00；可买围巾/领带当手信，支持退税。",
    whyWorthIt: "泰丝是清迈最有代表性的手信之一，这家老字号在 Huay Kaew 路上，从宁曼过去很近，丝巾质感好又不重，适合带回国。",
    detailSections: [ { title: "买什么", items: ["丝巾、领带、布料与定制衣物", "小件织品适合当伴手礼"] }, { title: "注意", items: ["营业约 09:00–17:00", "满额可退税，结账时询问"] } ],
    sourceIds: ["src-gm-shinawatra"], mapUrl: "https://www.google.com/maps/search/?api=1&query=S.Shinawatra+Thai+Silk+Chiang+Mai" }),
  POI({ id: "poi-gm-vintage-market", name: "Vintage Market (One Nimman)", name_zh: "宁曼 One Nimman 复古市集", area: "Nimman / One Nimman", category: "market", coords: [18.7987, 98.9688], rating: 4.5, hours: "周一/周二 16:00–22:00", mustVisit: true,
    note: "One Nimman 旁的复古市集，主打中古衣物、手作与小吃，每周一/二傍晚开。",
    plan: "D4 傍晚 17:00 到 One Nimman 逛复古市集，顺路解决晚餐。",
    tip: "周一/二 16:00–22:00；中古好货靠淘，早去选择多。",
    whyWorthIt: "你点名的必去市集：中古爱好者的宝藏场，正好开在 D4 周一晚上，从 Skyline 回来逛一圈，淘中古衣物的同时把晚餐也解决了。",
    detailSections: [ { title: "逛什么", items: ["中古衣物、古着与手作饰品", "小吃摊位可以边逛边吃"] }, { title: "注意", items: ["周一/周二 16:00–22:00 营业", "早去选择多，砍价看心情"] } ],
    sourceIds: ["src-gm-vintage-market"], mapUrl: "https://www.google.com/maps/search/?api=1&query=One+Nimman+Vintage+Market+Chiang+Mai" }),
  POI({ id: "poi-gm-toen", name: "TOEN Thai Food & Restaurant", name_zh: "TOEN 泰餐（宁曼）", area: "Nimman", category: "food", coords: [18.7995, 98.9700], rating: 4.5, hours: "约 11:00–21:00",
    note: "宁曼一带的本地泰餐小馆，家常口味、价格实在，适合逛完市集吃顿安稳饭。",
    plan: "D4 逛完 Vintage 市集后在宁曼吃晚餐。",
    tip: "饭点人多，可先到店取号再去市集逛一圈。",
    whyWorthIt: "逛完 One Nimman 复古市集，就近在宁曼吃一顿家常泰餐，不用折返古城，价格和口味都稳，是市集日的省心晚餐。",
    detailSections: [ { title: "点什么", items: ["冬阴功、打抛猪肉、泰式炒河粉", "三人点 4–5 个菜分量刚好"] }, { title: "注意", items: ["饭点可能需要等位", "支持现金与多数电子支付"] } ],
    sourceIds: ["src-gm-toen"], mapUrl: "https://www.google.com/maps/search/?api=1&query=TOEN+Thai+Food+Chiang+Mai" }),

  /* ---- D9 回清迈 河畔双吧 ---- */
  POI({ id: "poi-gm-ekachan", name: "Ekachan The Wisdom of Ethnic Thai Cuisine", name_zh: "Ekachan 民族泰餐（米其林必比登）", area: "Chang Khlan", category: "food", coords: [18.7855, 98.9965], rating: 4.6, hours: "11:00–14:30 / 17:00–21:30",
    note: "长康路的米其林必比登泰餐厅，用有机在地食材做精致泰味，2023/2024 连续上榜。",
    plan: "D9 回清迈当晚在长康路吃晚餐，饭后去河畔爵士吧。",
    tip: "晚市 17:00 开始，建议提前订位；人均中等偏上。",
    whyWorthIt: "回清迈第一晚吃顿正经的米其林必比登，用在地有机食材重新演绎泰味，位置又在长康路，和后面的 Noir、Bar.San 河畔双吧正好一条动线。",
    detailSections: [ { title: "怎么吃", items: ["点招牌套餐或几道主厨推荐", "晚市 17:00 起，建议 18:00 前到"] }, { title: "注意", items: ["热门时段建议提前订位", "人均比街边小店高，属精致泰餐"] } ],
    sourceIds: ["src-gm-ekachan"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Ekachan+The+Wisdom+of+Ethnic+Thai+Cuisine+Chiang+Mai",
    reservation: { required: false, method: "电话订位（建议）", leadTime: "提前 1 天", contact: "097-962-6445", tip: "D9 晚市约 18:30 入座" } }),
  POI({ id: "poi-gm-noir", name: "Noir cmi", name_zh: "Noir cmi 爵士鸡尾酒吧", area: "Riverside", category: "bar", coords: [18.7840, 98.9975], rating: 4.7, hours: "19:00–01:00（周一休）", mustVisit: true,
    note: "河畔的隐蔽爵士酒吧，水泥墙+暖光，每晚（除周一）有现场爵士，鸡尾酒向爵士大师致敬。",
    plan: "D9 晚饭后 20:30 来喝一杯听爵士，随后去隔壁 Bar.San.。",
    tip: "周一休息；19:00 开门，20:30 后有现场，低消一杯。",
    whyWorthIt: "你点名的必去酒吧：藏在河畔水泥墙里的爵士吧，氛围清迈独一份，和隔壁 Bar.San. 是同一批人开的，一晚连喝两家刚好。",
    detailSections: [ { title: "怎么喝", items: ["点招牌爵士主题鸡尾酒", "20:30 后现场乐队开演"] }, { title: "注意", items: ["周一休息，D9 周日正好营业", "周末人多，建议 20:00 前到"] } ],
    sourceIds: ["src-gm-noir"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Noir+cmi+Chiang+Mai" }),
  POI({ id: "poi-gm-bar-san", name: "Bar.San.", name_zh: "Bar.San. 调酒酒吧", area: "Riverside", category: "bar", coords: [18.7835, 98.9978], rating: 4.8, hours: "18:00–00:00", mustVisit: true,
    note: "河畔极简日式北欧风的鸡尾酒吧，清迈最佳酒吧之一，调酒师手艺极佳，氛围安静。",
    plan: "D9 从 Noir 出来步行 5 分钟到 Bar.San. 续摊。",
    tip: "18:00 开门；座位不多，进店后先找吧台位。",
    whyWorthIt: "你点名的必去酒吧：清迈公认的 top 级鸡尾酒吧，日式北欧极简风，和 Noir 是姐妹店，一晚连喝两家是河畔夜游的完整安排。",
    detailSections: [ { title: "怎么喝", items: ["点一杯当日特调或经典鸡尾酒", "吧台位可以看调酒师表演"] }, { title: "注意", items: ["座位有限，晚到可能要等", "适合安静小酌，不宜大声喧哗"] } ],
    sourceIds: ["src-gm-bar-san"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Bar.San.+Chiang+Mai" }),

  /* ---- D10 象营+民居博物馆 ---- */
  POI({ id: "poi-gm-teetee", name: "TeeTee Elephant Home", name_zh: "TeeTee 弟弟象营", area: "Mae Taeng", category: "activity", coords: [19.1400, 98.9500], rating: 4.9, hours: "半日（含接送）", mustVisit: true,
    note: "湄登的道德象营，不骑象不表演，喂食、做维他命球、散步、洗澡，半天体验含酒店接送。",
    plan: "D10 上午 07:00 接送出发，约 13:00 返回，下午逛博物馆与静心湖。",
    tip: "名额很紧张，务必提前约 20 天预约；含素食午餐。",
    whyWorthIt: "你点名的必去象营：不骑象不表演的道德体验，喂食、做维他命球、陪象散步洗澡，半天含接送，和原来的公益象园体验一脉相承。",
    detailSections: [ { title: "怎么体验", items: ["喂食水果、做维他命球", "陪大象散步、河边洗澡，听象夫讲每头象的故事"] }, { title: "注意", items: ["务必提前约 20 天预约，名额紧张", "穿可弄脏的衣物与防滑鞋"] } ],
    sourceIds: ["src-gm-teetee"], mapUrl: "https://www.google.com/maps/search/?api=1&query=TeeTee+Elephant+Home+Chiang+Mai",
    reservation: { required: true, method: "官网/Klook 等平台预约", leadTime: "提前约 20 天", tip: "D10 上午 07:00 酒店接送" } }),
  POI({ id: "poi-gm-lanna-house-museum", name: "Lanna Traditional House Museum", name_zh: "兰纳传统民居博物馆", area: "Huay Kaew / CMU", category: "sight", coords: [18.8065, 98.9645], rating: 4.5, hours: "08:30–16:30", mustVisit: true,
    note: "清迈大学旁的露天博物馆，14 栋上百年兰纳木构民居迁建于此，门票 100 泰铢。",
    plan: "D10 下午从象营回来后逛 1.5 小时，随后去静心湖散步。",
    tip: "08:30–16:30 开放，门票 100 泰铢；树荫多，慢慢走。",
    whyWorthIt: "你点名的必去人文点：在宁曼隔壁的露天博物馆一次看够 14 栋百年兰纳木屋，建筑细节和园林氛围都很好，是象营日之后的安静下午。",
    detailSections: [ { title: "怎么看", items: ["沿动线看各栋民居与谷仓结构", "留意木雕与兰纳建筑细节"] }, { title: "注意", items: ["08:30–16:30 开放，门票 100 泰铢", "属室外展区，注意防晒"] } ],
    sourceIds: ["src-gm-lanna-house"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Lanna+Traditional+House+Museum+Chiang+Mai" }),
  POI({ id: "poi-gm-cmu-lake", name: "Ang Kaew Reservoir (CMU Lake)", name_zh: "清迈大学静心湖", area: "CMU", category: "nature", coords: [18.8050, 98.9530], rating: 4.5, hours: "全天",
    note: "清迈大学内的静心湖，环湖步道与草坪，黄昏看落日尤其舒服，免费。",
    plan: "D10 从博物馆步行/打车过来环湖散步，等一场湖景日落。",
    tip: "免费开放；黄昏最出片，注意防蚊。",
    whyWorthIt: "看完博物馆顺路到清迈大学静心湖环湖走走，黄昏光线落在湖面很出片，是象营日傍晚最放松的一站。",
    detailSections: [ { title: "怎么玩", items: ["环湖步道散步或草坪坐一会儿", "黄昏时段光线最好，适合拍照"] }, { title: "注意", items: ["免费开放", "傍晚蚊虫多，喷好驱蚊液"] } ],
    sourceIds: ["src-gm-cmu-lake"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Ang+Kaew+Reservoir+Chiang+Mai" }),
  POI({ id: "poi-gm-6ixcret", name: "6ixcret Show", name_zh: "6ixcret 变装秀", area: "Night Bazaar", category: "bar", coords: [18.7870, 98.9970], rating: 4.7, hours: "19:00–00:30", mustVisit: true,
    note: "Night Bazaar 二楼的『清迈女王』变装秀，舞台效果华丽，是清迈口碑很好的夜间表演。",
    plan: "D10 晚上到 Night Bazaar 看秀，晚餐在附近长康路解决。",
    tip: "19:00 开演，建议提前到场选座或订座；演出约 1–2 小时。",
    whyWorthIt: "你点名的必看表演：号称『清迈女王』的变装秀舞台感十足，是三个人晚上一起大笑的好去处，看完还能在夜市散散步。",
    detailSections: [ { title: "怎么看", items: ["提前到场或平台订座，点一杯饮品看秀", "演出约 1–2 小时，中途可拍照"] }, { title: "注意", items: ["19:00 开演，建议 18:40 前到", "若周日不营业，顺延 D4 晚"] } ],
    sourceIds: ["src-gm-6ixcret"], mapUrl: "https://www.google.com/maps/search/?api=1&query=6ixcret+Show+Chiang+Mai",
    reservation: { required: false, method: "现场购票 / 平台订座", leadTime: "建议提前订座", tip: "D10 晚间场" } }),

  /* ---- D11 北线一日 ---- */
  POI({ id: "poi-gm-changthong", name: "Changthong Heritage Park", name_zh: "Changthong 古树公园", area: "San Phi Suea", category: "nature", coords: [18.8500, 98.9650], rating: 4.7, hours: "09:30–16:30", mustVisit: true,
    note: "泰国首座『古树博物馆』，12 英亩园区里有两千多棵古树、小瀑布与步道，像走进一座活的森林档案馆。",
    plan: "D11 从黏黏瀑布回程顺路逛 1.5 小时，再回城吃晚餐。",
    tip: "每日 9:30–16:30 开放，门票以现场为准；树荫多，适合慢走。",
    whyWorthIt: "你点名的必去自然点：泰国第一座古树博物馆，两千多棵古树配小瀑布和步道，回程顺路停一站，把北线自然日收在树荫里。",
    detailSections: [ { title: "怎么逛", items: ["沿步道看古树与小瀑布", "草坪和亭子适合坐下来发呆"] }, { title: "注意", items: ["每日 09:30–16:30 开放", "部分区域在树荫里，仍建议防晒"] } ],
    sourceIds: ["src-gm-changthong"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Changthong+Heritage+Park+Chiang+Mai" }),
  POI({ id: "poi-gm-krua-chalong", name: "Krua Chalong", name_zh: "Krua Chalong 泰餐（北城）", area: "Chang Phueak / Chotana", category: "food", coords: [18.8060, 98.9780], rating: 4.5, hours: "10:00–21:00",
    note: "Chotana 路上的老牌泰餐，蟹肉煎蛋是招牌，本地人也常来吃晚餐。",
    plan: "D11 北线一日结束后在回城路上吃晚餐。",
    tip: "10:00–21:00 营业；蟹肉煎蛋必点，趁热吃。",
    whyWorthIt: "北线开了一天车，回城前在 Chotana 吃顿老牌泰餐，招牌蟹肉煎蛋分量足，正好补充体力又不绕路。",
    detailSections: [ { title: "点什么", items: ["招牌蟹肉煎蛋、泰式炒菜", "米饭+汤+煎蛋的三件套很舒服"] }, { title: "注意", items: ["营业 10:00–21:00", "晚餐高峰可先取号"] } ],
    sourceIds: ["src-gm-krua-chalong"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Krua+Chalong+Chiang+Mai" }),

  /* ---- D12 南奔线 ---- */
  POI({ id: "poi-gm-haripunchai", name: "Wat Phra That Haripunchai Woramahawihan", name_zh: "哈里奔猜大舍利寺（南奔）", area: "Lamphun", category: "sight", coords: [18.5770, 99.0080], rating: 4.8, hours: "约 06:00–18:00", mustVisit: true,
    note: "南奔府千年古寺，供奉佛舍利的大佛塔与红亭建筑群，是泰北最重要的圣迹之一。",
    plan: "D12 上午包车去南奔，逛寺约 2 小时，中午吃 Lamphun 鸡饭。",
    tip: "着装注意：长裤/过膝裙+包肩；进大殿脱鞋。",
    whyWorthIt: "你点名的必去古寺：南奔千年的佛舍利圣地，佛塔和红亭建筑很有味道，从清迈过去约 40 分钟，正好串成南奔一日。",
    detailSections: [ { title: "怎么逛", items: ["绕大佛塔顺时针参观，看红亭与古佛像", "赶上节庆会非常热闹"] }, { title: "注意", items: ["着装需长裤/过膝裙与包肩", "进入殿堂脱鞋，保持安静"] } ],
    sourceIds: ["src-gm-haripunchai"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Wat+Phra+That+Haripunchai+Lamphun" }),
  POI({ id: "poi-gm-chicken-rice-lamphun", name: "Thailand Chicken Rice Lamphun", name_zh: "南奔海南鸡饭", area: "Lamphun", category: "food", coords: [18.5800, 99.0120], rating: 4.6, hours: "约 10:00–15:00",
    note: "南奔有名的鸡饭，鸡肉嫩、饭香，配汤和蘸料，本地人排队的午餐店。",
    plan: "D12 看完古寺后步行来吃午饭。",
    tip: "午市营业，卖完就收；点招牌鸡饭+鸡杂汤。",
    whyWorthIt: "逛完南奔古寺正好吃一顿当地鸡饭，鸡肉嫩饭香，价格便宜，是南奔一日里最顺路的午餐。",
    detailSections: [ { title: "点什么", items: ["招牌鸡饭配汤和蘸料", "加一份鸡杂汤更满足"] }, { title: "注意", items: ["午市营业，卖完即止", "小店环境简单，味道很稳"] } ],
    sourceIds: ["src-gm-chicken-rice"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Thailand+Chicken+Rice+Lamphun" }),
  POI({ id: "poi-gm-judys", name: "Judy's Home Café", name_zh: "Judy's Home Café（南奔河畔）", area: "Lamphun", category: "cafe", coords: [18.5740, 99.0040], rating: 4.6, hours: "08:30–17:00",
    note: "南奔 Kuang 河畔的温馨小院咖啡馆，有可爱的大鹅和超大花园草坪，从清迈市区过来约 30 分钟。",
    plan: "D12 午餐后到河畔咖啡歇脚，再回清迈。",
    tip: "每日 08:30–17:00 营业；院子里的大鹅是明星员工。",
    whyWorthIt: "南奔线中间用河畔咖啡店缓冲一下，花园草坪和大鹅很治愈，让南奔一日不只是赶路，多一分慢下来的松弛。",
    detailSections: [ { title: "怎么坐", items: ["点杯咖啡在花园草坪坐一会儿", "和大鹅合影但别追它"] }, { title: "注意", items: ["每日 08:30–17:00 营业", "户外座位多，注意防晒防蚊"] } ],
    sourceIds: ["src-gm-judys"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Judy%27s+Home+Cafe+Lamphun" }),
  POI({ id: "poi-gm-muse-massage", name: "Muse Massage & Spa Nimman 17", name_zh: "Muse 按摩（宁曼 17 巷）", area: "Nimman Soi 17", category: "spa", coords: [18.8010, 98.9670], rating: 4.6, hours: "约 10:00–22:00",
    note: "宁曼 17 巷的按摩店，泰式与精油按摩口碑好，离 Bed Changkian 很近。",
    plan: "D12 晚上回宁曼做告别按摩，结束旅行。",
    tip: "建议提前预约；选 60–90 分钟泰式或精油。",
    whyWorthIt: "最后一晚在酒店旁边的宁曼 17 巷做场告别按摩，把 13 天的疲惫都按掉，第二天一早赶飞机也从容。",
    detailSections: [ { title: "怎么约", items: ["电话/到店预约 60–90 分钟泰式或精油", "两人可约双人房"] }, { title: "注意", items: ["晚上时段较满，建议下午先约", "可让店家安排轻柔力度"] } ],
    sourceIds: ["src-gm-muse"], mapUrl: "https://www.google.com/maps/search/?api=1&query=Muse+Massage+And+Spa+Nimman+17+Chiang+Mai",
    reservation: { required: true, method: "电话/到店预约", leadTime: "提前几小时", tip: "D12 晚间 18:30" } }),

  /* ---- 备选（合集溢出，按分类分入各日 candidates） ---- */
  POI({ id: "poi-gm-aiyaret", name: "Aiyaret Massage", name_zh: "艾雅瑞放松按摩馆（长康路）", area: "Chang Khlan", category: "spa", priority: "nearby", contentTier: "compact", coords: [18.7872, 98.9960], rating: 5.0, hours: "10:00–21:00",
    note: "长康路的放松按摩馆，评分很高，环境干净，适合夜市/河畔动线顺路按。", tip: "建议提前电话预约；晚间时段较满。", source: "src-gm-aiyaret", mapUrl: "https://www.google.com/maps/search/?api=1&query=Aiyaret+Massage+Chiang+Mai", sourceIds: ["src-gm-aiyaret"] }),
  POI({ id: "poi-gm-heng-heng", name: "Heng Heng Thai Massage", name_zh: "Heng Heng 泰式按摩（宁曼 Soi 13）", area: "Nimman Soi 13", category: "spa", priority: "nearby", contentTier: "compact", coords: [18.7990, 98.9685], rating: 4.5, hours: "约 11:00–22:00",
    note: "宁曼 Soi 13 的泰式按摩，GoWabi 可预约。", tip: "GoWabi 预约需提前 2 小时以上。", source: "src-gm-heng-heng", mapUrl: "https://www.google.com/maps/search/?api=1&query=Heng+Heng+Thai+Massage+Chiang+Mai", sourceIds: ["src-gm-heng-heng"],
    reservation: { required: true, method: "GoWabi / 电话预约", leadTime: "提前 2 小时以上" } }),
  POI({ id: "poi-gm-retreat-nimman", name: "Retreat Nimman Massage & Spa", name_zh: "Retreat 宁曼按摩 SPA", area: "Nimman Soi 17", category: "spa", priority: "nearby", contentTier: "compact", coords: [18.8012, 98.9672], rating: 4.6, hours: "约 10:00–22:00",
    note: "宁曼 Soi 17 的按摩 SPA，热石、精油口碑好。", tip: "GoWabi 可预约。", source: "src-gm-retreat", mapUrl: "https://www.google.com/maps/search/?api=1&query=Retreat+Nimman+Massage+Spa+Chiang+Mai", sourceIds: ["src-gm-retreat"],
    reservation: { required: true, method: "GoWabi / 电话预约", leadTime: "提前 2 小时以上" } }),
  POI({ id: "poi-gm-700year-shooting", name: "700 Year Shooting Range", name_zh: "700 年纪念射击场", area: "700 Year Stadium", category: "activity", priority: "nearby", contentTier: "compact", coords: [18.8130, 98.9770], rating: 4.6, hours: "周二至周日 09:00–18:00（周一休）",
    note: "清迈大型专业射击场，东南亚运动会指定场地，枪型选择多。", tip: "周一休息；最晚 16:00 前进场，需预约。", source: "src-gm-700year", mapUrl: "https://www.google.com/maps/search/?api=1&query=700+Year+Shooting+Range+Chiang+Mai", sourceIds: ["src-gm-700year"],
    reservation: { required: true, method: "电话/平台预约", leadTime: "提前半天" } }),
  POI({ id: "poi-gm-archery", name: "The Arrow Rest (Chiang Mai Archery)", name_zh: "Chiang Mai Archery 射箭（The Arrow Rest）", area: "Fa Ham", category: "activity", priority: "nearby", contentTier: "compact", coords: [18.8210, 98.9930], rating: 4.7, hours: "约 09:00–18:00",
    note: "古城东北 Fa Ham 的射箭场，新手友好，约 270 泰铢/小时含装备。", tip: "建议提前联系确认营业；教练会带新手。", source: "src-gm-archery", mapUrl: "https://www.google.com/maps/search/?api=1&query=The+Arrow+Rest+Chiang+Mai", sourceIds: ["src-gm-archery"] }),
  POI({ id: "poi-gm-night-safari", name: "Chiang Mai Night Safari", name_zh: "清迈夜间动物园", area: "Hang Dong", category: "nature", priority: "nearby", contentTier: "compact", coords: [18.7170, 98.9180], rating: 4.5, hours: "11:00–22:00",
    note: "杭东的夜间动物园，封闭电车近距离看夜行动物，电车服务 17:30–20:00。", tip: "适合傍晚去，门票可线上买。", source: "src-gm-night-safari", mapUrl: "https://www.google.com/maps/search/?api=1&query=Chiang+Mai+Night+Safari", sourceIds: ["src-gm-night-safari"] }),
  POI({ id: "poi-gm-mae-tia", name: "Mae Tia Waterfall", name_zh: "Mae Tia 瀑布（宗通）", area: "Chom Thong", category: "nature", priority: "nearby", contentTier: "compact", coords: [18.4200, 98.6800], rating: 4.7, hours: "08:30–16:30",
    note: "Ob Luang 国家公园内 80 米双层瀑布，清迈最壮观瀑布之一。", tip: "门票约 200 泰铢；路程较远，适合留整天。", source: "src-gm-mae-tia", mapUrl: "https://www.google.com/maps/search/?api=1&query=Mae+Tia+Waterfall+Chiang+Mai", sourceIds: ["src-gm-mae-tia"] }),
  POI({ id: "poi-gm-maha-larb", name: "Maha Larb CNX", name_zh: "Maha Larb 伊善凉拌（清迈）", area: "Nimman / Old City", category: "food", priority: "nearby", contentTier: "compact", coords: [18.7930, 98.9860], rating: 4.5, hours: "约 11:00–22:00",
    note: "伊善（Isan）larb 凉拌专门店，酸辣开胃，人均 50–80 泰铢起。", tip: "位置待核，出发前用全球搜索确认。", source: "src-gm-maha-larb", mapUrl: "https://www.google.com/maps/search/?api=1&query=Maha+Larb+CNX+Chiang+Mai", sourceIds: ["src-gm-maha-larb"] }),
  POI({ id: "poi-gm-apollo-cafe", name: "ApolloCafe", name_zh: "ApolloCafe（南奔）", area: "Lamphun / Charoen Rat Rd", category: "cafe", priority: "nearby", contentTier: "compact", coords: [18.5815, 99.0082], rating: 4.7, hours: "以到店为准",
    note: "南奔 Charoen Rat Rd 的高分咖啡馆（Google 约 4.7 / 136 评），适合南奔火车一日游顺路喝一杯。",
    plan: "D3 南奔一日备选：逛完古寺/鸡饭后顺路喝咖啡。",
    tip: "地址 18 Charoen Rat Rd, Lamphun（街道级坐标）；电话 +66 95 242 5428。", source: "src-gm-apollo", mapUrl: "https://www.google.com/maps/search/?api=1&query=ApolloCafe+Lamphun", sourceIds: ["src-gm-apollo"] }),
  POI({ id: "poi-gm-nicha-cotton", name: "Nicha Chiangmai Natural Cotton", name_zh: "Nicha 天然棉织品（Chang Moi）", area: "Chang Moi / Kuang Men Rd", category: "shopping", priority: "nearby", contentTier: "compact", coords: [18.7900, 98.9970], rating: 4.7, hours: "以到店为准",
    note: "56 Kuang Men Rd 的天然棉织品店（Google 约 4.7 / 31 评），批发零售，衣服布料手感好。",
    plan: "D1 或 D12 顺路：离塔佩/瓦洛洛一带不远，买棉织衣物当手信。",
    tip: "地址 56 Kuang Men Rd, Chang Moi（街道级坐标，近瓦洛洛）；电话 +66 84 989 3524。", source: "src-gm-nicha", mapUrl: "https://www.google.com/maps/search/?api=1&query=Nicha+Chiangmai+Natural+Cotton", sourceIds: ["src-gm-nicha"] }),
  POI({ id: "poi-gm-mee-an-ja-kin", name: "Mee An Ja Kin Cafe & Restaurant", name_zh: "Mee An Ja Kin（平河畔）", area: "Pa Daet", category: "cafe", priority: "nearby", contentTier: "compact", coords: [18.7810, 98.9940], rating: 4.5, hours: "每日 10:00–24:00",
    note: "平河畔的舒适咖啡馆兼餐厅，每日 10:00 至午夜。", tip: "适合 D9 河畔晚餐备选。", source: "src-gm-mee-an-ja-kin", mapUrl: "https://www.google.com/maps/search/?api=1&query=Mee+An+Ja+Kin+Chiang+Mai", sourceIds: ["src-gm-mee-an-ja-kin"] }),
  POI({ id: "poi-gm-kinlarb", name: "KINLARB CHIANG MAI", name_zh: "KINLARB 伊善凉拌（宁曼）", area: "Nimman / Sirimangkalajarn", category: "food", coords: [18.7960, 98.9715], rating: 4.9, hours: "约 11:00–23:00", mustVisit: true, googleReviews: 89,
    note: "宁曼 Sirimangkalajarn 路的伊善 larb 凉拌店（Google 约 4.9 / 89 评），酸辣开胃、价格实在，必去。",
    plan: "D12 告别晚餐在宁曼吃 KINLARB，随后打车去河畔 Bar.San. 收尾。",
    tip: "地址约 53 Sirimangkalajarn Rd（街道级坐标）；饭点人多可先取号。",
    whyWorthIt: "最后一晚在宁曼吃一顿地道的伊善 larb 凉拌，评分 4.9、酸辣爽口、下饭又便宜，离 Bed Changkian 不远，吃完正好打车去河畔的告别酒吧。",
    detailSections: [ { title: "点什么", items: ["招牌 larb 猪肉/鸡肉/牛肉，配糯米饭", "加一份酸辣生菜包更过瘾"] }, { title: "注意", items: ["larb 偏辣，不能吃辣提前说", "营业到深夜，晚餐高峰可等位"] } ],
    source: "src-gm-kinlarb", mapUrl: "https://www.google.com/maps/search/?api=1&query=KINLARB+CHIANG+MAI", sourceIds: ["src-gm-kinlarb"] }),
  POI({ id: "poi-gm-pakorns", name: "Pakorn's Kitchen", name_zh: "Pakorn's Kitchen（长康）", area: "Kampangdin / Hai Ya", category: "food", coords: [18.7840, 98.9940], rating: 4.7, hours: "约 14:00–22:00",
    note: "古城东南的本地人气泰餐，Google 约 4.7，饭点要排队，招牌泰式家常菜。",
    plan: "D10 晚上看 6ixcret 前在长康路吃晚餐。",
    tip: "约 14:00–22:00 营业；饭点排队，建议 18:00 前到。",
    whyWorthIt: "看 6ixcret 变装秀前，在长康路吃一顿本地人排队的泰餐，Google 评分 4.7、菜品家常扎实，正好填饱肚子再上楼看秀。",
    detailSections: [ { title: "点什么", items: ["冬阴功、泰式炒菜与招牌家常菜", "三人点 4–5 个菜，配米饭分量刚好"] }, { title: "注意", items: ["饭点人多需要等位", "位置在长康路，离 Night Bazaar 很近"] } ],
    source: "src-gm-pakorns", mapUrl: "https://www.google.com/maps/search/?api=1&query=Pakorn%27s+Kitchen+Chiang+Mai", sourceIds: ["src-gm-pakorns"] }),
  POI({ id: "poi-gm-khao-tom-nai-dam", name: "Khao Tom Nai Dam 2 (ข้าวต้มนายดำ 2)", name_zh: "นายดำ 粥店二分店（素帖路）", area: "Suthep Rd", category: "food", priority: "nearby", contentTier: "compact", coords: [18.7870, 98.9800], rating: 4.5, hours: "约 06:00–14:00 / 17:00–22:00",
    note: "古城西素帖路的粥店，猪杂粥配咸蛋是招牌，适合早餐或夜宵。", tip: "D1 或 D3 早餐备选。", source: "src-gm-khao-tom", mapUrl: "https://www.google.com/maps/search/?api=1&query=Khao+Tom+Nai+Dam+2+Chiang+Mai", sourceIds: ["src-gm-khao-tom"] }),
  POI({ id: "poi-gm-win-onenimman", name: "Win Cosmetics One Nimman", name_zh: "Win Cosmetics（One Nimman 店）", area: "Nimman / One Nimman", category: "shopping", priority: "nearby", contentTier: "compact", coords: [18.7985, 98.9690], rating: 4.5, hours: "约 10:00–22:00",
    note: "One Nimman 里的 Win 药妆分店，逛复古市集时顺路补货。", tip: "D4 逛市集时顺路买。", source: "src-gm-win-cosmetics", mapUrl: "https://www.google.com/maps/search/?api=1&query=Win+Cosmetics+One+Nimman+Chiang+Mai", sourceIds: ["src-gm-win-cosmetics"] }),
  POI({ id: "poi-gm-mango-sticky", name: "Pranom Health Massage (ประนอม นวดเพื่อสุขภาพ)", name_zh: "Pranom 健康按摩（Google 地图：芒果糯米在對面）", area: "Old City / Ratchadamnoen", category: "spa", coords: [18.78763, 98.9899], hours: "每日 10:00–21:00",
    note: "古城 Ratchadamnoen 路 Kad Klang Wiang 内的泰式按摩店（Google 地图上中文名显示为「芒果糯米在對面」，实为按摩店而非餐厅）；泰式按摩 1 小时约 150 泰铢，价格实在。",
    plan: "D12 上午逛完瓦洛洛后回古城做一小时泰式按摩（11:30），下午再逛泰丝店。",
    tip: "每日 10:00–21:00；一次可同时接待约 12 人，通常不用久等；泰式 150 铢/时、足底 180 铢、精油 300 铢（参考价）。",
    whyWorthIt: "你点名的「芒果糯米在對面」其实是古城里的 Pranom 健康按摩：泰式按摩一小时才约 150 泰铢，逛完瓦洛洛正好来放松一小时，价格实在、手法专业，是告别日上午很顺的一站。",
    detailSections: [ { title: "怎么按", items: ["泰式传统按摩 1 小时约 150 泰铢，足底 180、精油 300（参考价）", "一次可同时接待约 12 人，三人同行通常不用等"] }, { title: "注意", items: ["每日 10:00–21:00，位于 Kad Klang Wiang 小商圈（Ratchadamnoen 路 71 号）", "进店脱鞋、会提供宽松衣裤；想指定时段建议提前电话约"] } ],
    source: "src-gm-mango-sticky", mapUrl: "https://www.google.com/maps/search/?api=1&query=Pranom+Health+Massage+Chiang+Mai", sourceIds: ["src-gm-mango-sticky"] }),
  POI({ id: "poi-gm-tiger-kingdom", name: "Tiger Kingdom Chiang Mai", name_zh: "清迈老虎园（Tiger Kingdom）", area: "Mae Rim", category: "nature", priority: "nearby", contentTier: "compact", coords: [18.9180, 98.9460], rating: 4.4, hours: "每日 09:00–17:00（最晚 16:30 入场）",
    note: "Mae Rim 的老虎园，可近距离看老虎、有笼舍参观与合影项目，距大象粑粑造纸园很近，适合北线包车日顺路。",
    plan: "D4 北线包车日备选：包车时间充裕且想加一站时，从造纸园顺路前往。",
    tip: "门票约 188 泰铢起，合影/互动另计、部分需预约；动物福利有争议，去前自行评估。",
    source: "src-gm-tiger-kingdom", mapUrl: "https://www.google.com/maps/search/?api=1&query=Tiger+Kingdom+Chiang+Mai", sourceIds: ["src-gm-tiger-kingdom"], themeTags: ["nature", "mae-rim", "user-requested"] }),

  /* ---- 用户新增：9/25 Vintage 市集 The Market CNX + 宁曼 Soi 6 周五夜市备选 + DARUMA JAPAN ---- */
  POI({ id: "poi-gm-market-cnx", name: "Vintage Market (เท มาร์เก็ต CNX)", name_zh: "Vintage 市集 · The Market CNX（清迈大学旁）", area: "Su Thep / 清迈大学", category: "market", coords: [18.79423, 98.9646], rating: 4.3, hours: "周二–周四 17:00–22:00（Trip.com 显示至 23:00）", sourceTag: "用户新增",
    note: "清迈大学旁（Su Thep）的复古市集，中古服饰、古着、手作与街头小吃都有；你来这主要是因为这里有一位长得像 LISA 的老板可以画海娜（Mehndi 手绘）。",
    plan: "D12（10/6 周二）傍晚 17:00 顺路安排：找像 LISA 的老板画海娜，再顺逛中古摊与街头小吃。",
    tip: "公开营业周二–周四 17:00–22:00，10/6 是周二；海娜画完让染料停留 2–6 小时再洗掉，期间别碰水/别摩擦，颜色才深。",
    whyWorthIt: "这趟去 The Market CNX 主要是为了找那位长得像 LISA 的海娜老板画一个手绘：在清迈大学旁的复古市集里画完海娜，再顺路逛逛中古衣服和手作摊，给告别日添一件特别的纪念。",
    detailSections: [ { title: "在这里做什么", items: ["找长得像 LISA 的老板画海娜（Mehndi），图案先商量好再动手", "顺逛中古服饰、古着与手作摊，晚上有街头小吃"] }, { title: "注意", items: ["公开营业周二–周四 17:00–22:00，10/6 是周二，先到先画", "画完 2–6 小时内别碰水/别摩擦，颜色才深；价格约 200–500 泰铢，以现场为准"] } ],
    sourceIds: ["src-gm-market-cnx"], mapUrl: "https://www.google.com/maps/search/?api=1&query=%E0%B9%80%E0%B8%97+%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%81%E0%B9%87%E0%B8%95+CNX+Chiang+Mai" }),
  POI({ id: "poi-gm-daruma-japan", name: "DARUMA JAPAN CHIANGMAI", name_zh: "DARUMA JAPAN（Saraphi 日料/日货，待核）", area: "Saraphi（清迈⇄南奔之间）", category: "food", coords: [18.7100, 99.0450], hours: "待核", sourceTag: "用户新增",
    note: "你提供的地点名；位于清迈与南奔之间的 Saraphi，具体位置与营业时间待核（需要 Google 地图截图或地址确认）。",
    plan: "D3 南奔线备选：若确认在 Saraphi 站附近，可乘南奔火车中途下车顺访。",
    tip: "待核：位置与营业时间未确认，先用 Saraphi 区级坐标占位；确认后我会把它升入主路线。",
    whyWorthIt: "你想加入的 Saraphi 日料/日货店：Saraphi 正好在清迈⇄南奔铁路沿线，若位置确认，可并进南奔一日游的顺路行程，不用单独跑一趟。",
    detailSections: [ { title: "现状", items: ["仅有地点名，具体位置/营业时间待核", "先放在 D3 南奔日备选，确认后再升主路线"] }, { title: "待你补充", items: ["Google 地图截图或详细地址", "营业时间与是否需预约"] } ],
    sourceIds: ["src-gm-daruma-japan"], mapUrl: "https://www.google.com/maps/search/?api=1&query=DARUMA+JAPAN+CHIANGMAI+Saraphi" })
];

/* ================================================================
   复用 POI 字段更新（必去标记 / 评分 / 营业时间 / 来源标注）
   ================================================================ */
const updatePois = [
  { id: "poi-jing-jai", patch: { mustVisit: true, sourceTag: "google合集", rating: 4.6, hours: "周六–周日 06:00–14:00" } },
  { id: "poi-sunday-walking-street", patch: { mustVisit: true, sourceTag: "google合集", rating: 4.6, hours: "周日 16:00–22:00（约）" } },
  { id: "poi-north-gate-jazz", patch: { mustVisit: true, sourceTag: "google合集", rating: 4.7, hours: "每日 20:00–深夜" } },
  { id: "poi-poopoo-paper", patch: { mustVisit: true, sourceTag: "google合集", rating: 4.5, hours: "09:00–17:00" } },
  { id: "poi-bua-tong", patch: { mustVisit: true, sourceTag: "google合集", rating: 4.7, hours: "08:30–16:30", coords: [19.176, 98.871] } },
  { id: "poi-warorot", patch: { sourceTag: "google合集", rating: 4.5, hours: "约 07:00–18:00" } },
  { id: "poi-333-shooting-thaphae", patch: { sourceTag: "google合集", rating: 4.6, hours: "10:00–18:00" } }
];

/* 来源字段更新（幂等：已存在的来源按 id 覆盖字段） */
const updateSources = [
  { id: "src-gm-mango-sticky", patch: {
      title: "Pranom Health Massage（ประนอม นวดเพื่อสุขภาพ）· Google 中文名「芒果糯米在對面」",
      url: "https://www.taiguo.org/REVIEWS-pranom-health-massage-17335-l.html",
      supports: ["location", "hours", "pricing"],
      notes: "古城 Ratchadamnoen 路 71 号 Kad Klang Wiang 内；每日 10:00–21:00；泰式按摩 1 小时约 150 泰铢、足底 180、精油 300；Mapcarta 坐标 18.78763,98.9899。",
      checkedAt: "2026-08-24"
  } }
];

/* ================================================================
   清迈段路线重排（严格按合集：除酒店/机场外均为合集地点）
   D1 先买化妆品/衣服；D9 回清迈后集中逛市集
   ================================================================ */
function patchDays(days) {
  const set = (id) => days.find((d) => d.id === id);

  const d1 = set("day-1");
  d1.title = "抵达清迈 · 先买化妆品与衣服";
  d1.summary = "09:15 落地清迈，寄存行李后直奔塔佩路的 Chiang Mai Cosmetics 与 Win Cosmetics 买化妆品、衣服（赶在 15:00 入住前），晚上北门吃自助火锅烧烤、听爵士。";
  d1.anchors = ["poi-gm-chiangmai-cosmetics", "poi-gm-win-hualin", "poi-north-gate-jazz"];
  d1.routeStops = [
    { poiId: "poi-cnx-airport", order: 1, time: "09:15", role: "arrival" },
    { poiId: "poi-gm-chiangmai-cosmetics", order: 2, time: "11:00", role: "shopping" },
    { poiId: "poi-gm-win-hualin", order: 3, time: "12:30", role: "shopping" },
    { poiId: "poi-thapae-twins", order: 0, time: "15:00", role: "lodging-anchor" },
    { poiId: "poi-gm-big-big-shabu", order: 4, time: "18:30", role: "dinner" },
    { poiId: "poi-north-gate-jazz", order: 5, time: "20:30", role: "night" }
  ];
  d1.transitSegments = [
    { fromPoiId: "poi-cnx-airport", toPoiId: "poi-gm-chiangmai-cosmetics", mode: "Grab/出租车", minutes: 25, label: "机场到塔佩一带，先到酒店寄存行李再购物" },
    { fromPoiId: "poi-gm-chiangmai-cosmetics", toPoiId: "poi-gm-win-hualin", mode: "步行", minutes: 5, label: "两家店都在塔佩路一带，步行即到" },
    { fromPoiId: "poi-gm-win-hualin", toPoiId: "poi-thapae-twins", mode: "步行", minutes: 5, label: "购物后回酒店办理入住（15:00）" },
    { fromPoiId: "poi-thapae-twins", toPoiId: "poi-gm-big-big-shabu", mode: "Grab", minutes: 10, label: "打车到古城北门 Sri Phum 路" },
    { fromPoiId: "poi-gm-big-big-shabu", toPoiId: "poi-north-gate-jazz", mode: "步行", minutes: 5, label: "北门爵士吧就在火锅店旁" }
  ];
  d1.candidates = ["poi-tha-phae-gate", "poi-gm-khao-tom-nai-dam", "poi-gm-nicha-cotton", "poi-gm-archery"];
  d1.reminders = [];

  const d2 = set("day-2");
  d2.title = "丛林飞跃 + 射击 + 摇摆舞 · 周六";
  d2.summary = "上午 08:00 出发去 Doi Saket 玩 Skyline 丛林飞跃（半日含接送），中午回城吃泰北菜，下午 15:30 到 333 射击，晚上 20:00 上 Rong Sa Dang 摇摆舞新手课并跳社交舞。";
  d2.anchors = ["poi-gm-skyline", "poi-333-shooting-thaphae", "poi-gm-rong-sa-dang"];
  d2.routeStops = [
    { poiId: "poi-thapae-twins", order: 0, time: "07:30", role: "lodging-anchor" },
    { poiId: "poi-gm-skyline", order: 1, time: "08:00", role: "activity" },
    { poiId: "poi-gm-khoei", order: 2, time: "14:00", role: "lunch" },
    { poiId: "poi-333-shooting-thaphae", order: 3, time: "15:30", role: "class" },
    { poiId: "poi-gm-rong-sa-dang", order: 4, time: "20:00", role: "night" }
  ];
  d2.transitSegments = [
    { fromPoiId: "poi-thapae-twins", toPoiId: "poi-gm-skyline", mode: "接送车", minutes: 60, label: "Skyline 08:00 酒店接送" },
    { fromPoiId: "poi-gm-skyline", toPoiId: "poi-gm-khoei", mode: "接送车 + Grab", minutes: 60, label: "约 13:30 送回，打车到 Santitham 午餐" },
    { fromPoiId: "poi-gm-khoei", toPoiId: "poi-333-shooting-thaphae", mode: "Grab", minutes: 10, label: "午餐后回古城塔佩门店" },
    { fromPoiId: "poi-333-shooting-thaphae", toPoiId: "poi-gm-rong-sa-dang", mode: "Grab", minutes: 10, label: "回塔佩路 63 号" }
  ];
  d2.candidates = ["poi-gm-tok-sen", "poi-khao-soi-khun-yai", "poi-wat-srisuphan", "poi-gm-700year-shooting", "poi-fern-forest-cafe", "poi-khun-churn"];
  d2.reminders = [
    { label: "Skyline 丛林飞跃预约接送", due: "提前 1 天", detail: "确认 D2 08:00 酒店接送时间与集合点", status: "todo" },
    { label: "预约 333 射击（至少提前 1 小时）", due: "9/26 14:30 前", detail: "电话 064-495-6815 或平台预约，确认 15:30 场次", status: "todo" },
    { label: "Rong Sa Dang 周六摇摆舞课", due: "9/26 19:45 前到", detail: "新手课 20:00–20:45 约 200 泰铢，社交舞 21:00 起", status: "todo" }
  ];

  const d3 = set("day-3");
  d3.title = "南奔火车一日 · 千年古寺";
  d3.summary = "早上从清迈火车站乘复古火车去南奔（约 09:30 发车、40 分钟），逛哈里奔猜大舍利寺，中午吃南奔鸡饭，下午河畔 Judy's 咖啡后乘 14:15 返程火车回清迈，晚上到 MaHoRee 听现场爵士。";
  d3.anchors = ["poi-gm-haripunchai", "poi-gm-mahoree"];
  d3.routeStops = [
    { poiId: "poi-thapae-twins", order: 0, time: "07:30", role: "lodging-anchor" },
    { poiId: "poi-gm-haripunchai", order: 1, time: "10:15", role: "sight" },
    { poiId: "poi-gm-chicken-rice-lamphun", order: 2, time: "12:00", role: "lunch" },
    { poiId: "poi-gm-judys", order: 3, time: "13:15", role: "cafe" },
    { poiId: "poi-gm-mahoree", order: 4, time: "20:00", role: "night" }
  ];
  d3.transitSegments = [
    { fromPoiId: "poi-thapae-twins", toPoiId: "poi-gm-haripunchai", mode: "火车（清迈站→南奔）+ 步行", minutes: 120, label: "07:45 到清迈火车站，乘约 09:30 班次、40 分钟到南奔，步行至古寺" },
    { fromPoiId: "poi-gm-haripunchai", toPoiId: "poi-gm-chicken-rice-lamphun", mode: "步行", minutes: 5, label: "古寺旁鸡饭店" },
    { fromPoiId: "poi-gm-chicken-rice-lamphun", toPoiId: "poi-gm-judys", mode: "Grab", minutes: 8, label: "到南奔河畔咖啡" },
    { fromPoiId: "poi-gm-judys", toPoiId: "poi-gm-mahoree", mode: "火车（返程 14:15）+ Grab + 步行", minutes: 150, label: "乘 14:15 返程回清迈（约 15:00），回酒店休息，晚上步行到 Prapokklao 爵士吧" },
    { fromPoiId: "poi-thapae-twins", toPoiId: "poi-gm-mahoree", mode: "步行", minutes: 15, label: "古城内走到 Prapokklao 路爵士吧" }
  ];
  d3.candidates = ["poi-gm-mae-tia", "poi-gm-apollo-cafe", "poi-baan-kang-wat", "poi-wild-rose-yoga", "poi-sp-chicken", "poi-gm-daruma-japan"];
  d3.reminders = [
    { label: "南奔火车票（去程约 09:30 / 返程 14:15）", due: "D3 当天", detail: "清迈站现场购票带护照；到南奔站立即买返程票，错过 14:15 要等 19:15", status: "todo" },
    { label: "南奔古寺着装提醒", due: "D3 当天", detail: "长裤/过膝裙+包肩，进大殿脱鞋", status: "todo" }
  ];

  const d4 = set("day-4");
  d4.title = "北线包车一日 · 大象营 + 瀑布 + 古树公园";
  d4.summary = "全天包车北线：上午 TeeTee 弟弟象营喂象洗澡（07:00 接送），回程顺路大象粑粑造纸、黏黏瀑布与古树公园（顺序由司机按闭园时间优化），晚上北城吃 Krua Chalong。";
  d4.anchors = ["poi-gm-teetee", "poi-bua-tong", "poi-gm-changthong"];
  d4.routeStops = [
    { poiId: "poi-thapae-twins", order: 0, time: "06:30", role: "lodging-anchor" },
    { poiId: "poi-gm-teetee", order: 1, time: "07:00", role: "activity" },
    { poiId: "poi-poopoo-paper", order: 2, time: "13:15", role: "class" },
    { poiId: "poi-bua-tong", order: 3, time: "14:30", role: "nature" },
    { poiId: "poi-gm-changthong", order: 4, time: "16:00", role: "nature" },
    { poiId: "poi-gm-krua-chalong", order: 5, time: "17:30", role: "dinner" }
  ];
  d4.transitSegments = [
    { fromPoiId: "poi-thapae-twins", toPoiId: "poi-gm-teetee", mode: "营区接驳车", minutes: 70, label: "07:00 酒店接送，约 12:30 返至湄登" },
    { fromPoiId: "poi-gm-teetee", toPoiId: "poi-poopoo-paper", mode: "包车", minutes: 40, label: "到湄林造纸园（午餐简餐/打包，别耽误）" },
    { fromPoiId: "poi-poopoo-paper", toPoiId: "poi-bua-tong", mode: "包车", minutes: 40, label: "到湄登黏黏瀑布" },
    { fromPoiId: "poi-bua-tong", toPoiId: "poi-gm-changthong", mode: "包车", minutes: 35, label: "回程顺路 San Phi Suea 古树公园（16:30 闭园，务必赶早）" },
    { fromPoiId: "poi-gm-changthong", toPoiId: "poi-gm-krua-chalong", mode: "包车", minutes: 20, label: "到 Chotana 北城晚餐" }
  ];
  d4.candidates = ["poi-gm-tiger-kingdom", "poi-gm-700year-shooting", "poi-gm-night-safari", "poi-gm-maha-larb", "poi-gm-kinlarb"];
  d4.reminders = [
    { label: "预约 TeeTee 弟弟象营（约提前 20 天）", due: "尽早（名额紧张）", detail: "官网/Klook 预约 D4 上午 07:00 接送，确认人数", status: "todo" },
    { label: "确认北线包车", due: "提前 1 天", detail: "全天包车，司机按闭园时间排顺序：古树公园/黏黏瀑布 16:30 前", status: "todo" },
    { label: "老虎园（若加站）", due: "D4 当天", detail: "每日 09:00–17:00、最晚 16:30 入场，门票约 188 泰铢", status: "todo" }
  ];

  /* D5 转场合艾：保持现状 */

  const d6 = set("day-6");
  d6.reminders = [
    { label: "确认 9/30 合艾 ⇄ Pak Bara 车船", due: "出发前 1–2 天", detail: "低季快艇可能取消或改日出沙滩上下船，与船公司/酒店确认", status: "todo" }
  ];

  const d8 = set("day-8");
  d8.reminders = [
    { label: "确认 10/2 丽贝回程快艇班次", due: "10/1 上午", detail: "在岛上与船公司/酒店前台确认次日回 Pak Bara 时间", status: "todo" }
  ];

  const d9 = set("day-9");
  d9.title = "回清迈 · 变装秀之夜";
  d9.summary = "14:00 从合艾飞回清迈，16:00 落地入住 Bed Changkian；晚上到长康路吃米其林必比登 Ekachan，随后去 Night Bazaar 看 6ixcret 变装秀。";
  d9.anchors = ["poi-gm-6ixcret"];
  d9.routeStops = [
    { poiId: "poi-z-sleep", order: 0, time: "10:00", role: "lodging-anchor" },
    { poiId: "poi-hdy-airport", order: 1, time: "12:00", role: "flight" },
    { poiId: "poi-cnx-airport", order: 2, time: "16:00", role: "flight" },
    { poiId: "poi-bed-changkian", order: 0, time: "16:30", role: "lodging-anchor" },
    { poiId: "poi-gm-ekachan", order: 3, time: "18:30", role: "dinner" },
    { poiId: "poi-gm-6ixcret", order: 4, time: "20:30", role: "night" }
  ];
  d9.transitSegments = [
    { fromPoiId: "poi-z-sleep", toPoiId: "poi-hdy-airport", mode: "出租车", minutes: 30, label: "12:00 前从酒店出发去合艾机场" },
    { fromPoiId: "poi-hdy-airport", toPoiId: "poi-cnx-airport", mode: "飞机 FD158", minutes: 120, label: "14:00 起飞、16:00 落地清迈" },
    { fromPoiId: "poi-cnx-airport", toPoiId: "poi-bed-changkian", mode: "Grab", minutes: 25, label: "机场到 Chang Phueak 酒店" },
    { fromPoiId: "poi-bed-changkian", toPoiId: "poi-gm-ekachan", mode: "Grab", minutes: 15, label: "到长康路/河畔" },
    { fromPoiId: "poi-gm-ekachan", toPoiId: "poi-gm-6ixcret", mode: "步行", minutes: 8, label: "Night Bazaar 楼上即到" }
  ];
  d9.candidates = ["poi-gm-aiyaret", "poi-gm-mee-an-ja-kin", "poi-nimman-avenue", "poi-ristr8to-original"];
  d9.reminders = [
    { label: "Ekachan 订位", due: "提前 1 天", detail: "电话 097-962-6445，确认 D9 晚市约 18:30", status: "todo" },
    { label: "6ixcret 订座/购票", due: "D9 当天", detail: "若周六不营业则顺延 D12 晚；建议提前订座", status: "todo" }
  ];

  const d10 = set("day-10");
  d10.title = "丽贝后市集日 · Bamboo + 周日夜市";
  d10.summary = "早上到 San Kamphaeng 逛 Bamboo 竹林市集，下午去 Artisan 酸种面包店与 Nong Buak Haad 公园散步，傍晚逛周日夜市（古城），晚上回酒店。";
  d10.anchors = ["poi-gm-bamboo-market", "poi-sunday-walking-street"];
  d10.routeStops = [
    { poiId: "poi-bed-changkian", order: 0, time: "07:00", role: "lodging-anchor" },
    { poiId: "poi-gm-bamboo-market", order: 1, time: "08:30", role: "market" },
    { poiId: "poi-gm-artisan-sourdough", order: 2, time: "13:30", role: "cafe" },
    { poiId: "poi-gm-nong-buak", order: 3, time: "15:15", role: "nature" },
    { poiId: "poi-sunday-walking-street", order: 4, time: "17:30", role: "market" }
  ];
  d10.transitSegments = [
    { fromPoiId: "poi-bed-changkian", toPoiId: "poi-gm-bamboo-market", mode: "包车/Grab", minutes: 40, label: "到 San Kamphaeng 竹林市集" },
    { fromPoiId: "poi-gm-bamboo-market", toPoiId: "poi-gm-artisan-sourdough", mode: "包车/Grab", minutes: 40, label: "回素贴/乌蒙一带面包店" },
    { fromPoiId: "poi-gm-artisan-sourdough", toPoiId: "poi-gm-nong-buak", mode: "Grab", minutes: 8, label: "到古城西南公园" },
    { fromPoiId: "poi-gm-nong-buak", toPoiId: "poi-sunday-walking-street", mode: "步行/双条", minutes: 10, label: "周日夜市在 Ratchadamnoen 步行街" },
    { fromPoiId: "poi-sunday-walking-street", toPoiId: "poi-bed-changkian", mode: "Grab", minutes: 15, label: "回宁曼酒店" }
  ];
  d10.candidates = ["poi-jing-jai", "poi-gm-retreat-nimman", "poi-gm-pakorns", "poi-gm-kinlarb", "poi-enp", "poi-cotu-swim"];
  d10.reminders = [
    { label: "Bamboo 周末场次确认", due: "出发前 1 天", detail: "看官方 FB/IG 确认当周周日营业", status: "todo" },
    { label: "周日夜市", due: "D10 17:00", detail: "古城 Ratchadamnoen，穿好走的鞋慢慢逛", status: "todo" }
  ];

  const d11 = set("day-11");
  d11.title = "博物馆 + 银器工坊 + 复古市集";
  d11.summary = "上午逛清迈大学兰纳传统民居博物馆与静心湖，下午到 Wua Lai 的 Lanna Artisans 银器工坊亲手做小件，傍晚逛 One Nimman 复古市集（周一），晚上在宁曼吃 TOEN。";
  d11.anchors = ["poi-gm-lanna-house-museum", "poi-gm-vintage-market"];
  d11.routeStops = [
    { poiId: "poi-bed-changkian", order: 0, time: "08:30", role: "lodging-anchor" },
    { poiId: "poi-gm-lanna-house-museum", order: 1, time: "09:30", role: "sight" },
    { poiId: "poi-gm-cmu-lake", order: 2, time: "12:00", role: "nature" },
    { poiId: "poi-gm-lanna-artisans", order: 3, time: "15:00", role: "sight" },
    { poiId: "poi-gm-vintage-market", order: 4, time: "17:30", role: "market" },
    { poiId: "poi-gm-toen", order: 5, time: "20:00", role: "dinner" }
  ];
  d11.transitSegments = [
    { fromPoiId: "poi-bed-changkian", toPoiId: "poi-gm-lanna-house-museum", mode: "Grab", minutes: 15, label: "到 Huay Kaew 博物馆" },
    { fromPoiId: "poi-gm-lanna-house-museum", toPoiId: "poi-gm-cmu-lake", mode: "Grab", minutes: 8, label: "到清迈大学静心湖" },
    { fromPoiId: "poi-gm-cmu-lake", toPoiId: "poi-gm-lanna-artisans", mode: "Grab", minutes: 15, label: "到 Wua Lai 银器工坊" },
    { fromPoiId: "poi-gm-lanna-artisans", toPoiId: "poi-gm-vintage-market", mode: "Grab", minutes: 20, label: "到 One Nimman 复古市集" },
    { fromPoiId: "poi-gm-vintage-market", toPoiId: "poi-gm-toen", mode: "步行", minutes: 8, label: "宁曼 Soi 一带晚餐" }
  ];
  d11.candidates = ["poi-gm-shinawatra-silk", "poi-gm-heng-heng", "poi-gm-retreat-nimman", "poi-gm-kinlarb", "poi-gm-maha-larb", "poi-gm-khao-tom-nai-dam", "poi-doi-suthep", "poi-grand-canyon"];
  d11.reminders = [
    { label: "兰纳民居博物馆开放时间", due: "D11 当天", detail: "08:30–16:30，门票 100 泰铢", status: "todo" },
    { label: "Vintage 市集时间确认", due: "D11 当天", detail: "One Nimman 复古市集周一 16:00–22:00", status: "todo" }
  ];

  const d12 = set("day-12");
  d12.title = "瓦洛洛手信 + 告别之夜";
  d12.summary = "上午在瓦洛洛市场集中买手信，中午到古城 Pranom 健康按摩（Google 地图：芒果糯米在對面）做一小时泰式按摩，下午逛 S.Shinawatra 泰丝店，傍晚到清迈大学旁的 The Market CNX 找像 LISA 的老板画海娜、顺逛中古摊，晚上吃告别晚餐，最后到 Bar.San. 喝一杯收尾。";
  d12.anchors = ["poi-warorot", "poi-gm-bar-san"];
  d12.routeStops = [
    { poiId: "poi-bed-changkian", order: 0, time: "09:30", role: "lodging-anchor" },
    { poiId: "poi-warorot", order: 1, time: "10:00", role: "market" },
    { poiId: "poi-gm-mango-sticky", order: 2, time: "11:30", role: "spa" },
    { poiId: "poi-gm-shinawatra-silk", order: 3, time: "14:00", role: "shopping" },
    { poiId: "poi-gm-market-cnx", order: 4, time: "17:00", role: "market" },
    { poiId: "poi-gm-kinlarb", order: 5, time: "18:45", role: "dinner" },
    { poiId: "poi-gm-bar-san", order: 6, time: "21:00", role: "night" }
  ];
  d12.transitSegments = [
    { fromPoiId: "poi-bed-changkian", toPoiId: "poi-warorot", mode: "Grab", minutes: 15, label: "到古城东瓦洛洛" },
    { fromPoiId: "poi-warorot", toPoiId: "poi-gm-mango-sticky", mode: "Grab", minutes: 8, label: "从瓦洛洛回古城 Ratchadamnoen 路按摩" },
    { fromPoiId: "poi-gm-mango-sticky", toPoiId: "poi-gm-shinawatra-silk", mode: "Grab", minutes: 10, label: "按摩后到 Huay Kaew 泰丝店" },
    { fromPoiId: "poi-gm-shinawatra-silk", toPoiId: "poi-gm-market-cnx", mode: "Grab", minutes: 15, label: "从 Huay Kaew 泰丝店到清迈大学旁 Su Thep" },
    { fromPoiId: "poi-gm-market-cnx", toPoiId: "poi-gm-kinlarb", mode: "Grab", minutes: 15, label: "从 Su Thep 回宁曼 Sirimangkalajarn 告别晚餐" },
    { fromPoiId: "poi-gm-kinlarb", toPoiId: "poi-gm-bar-san", mode: "Grab", minutes: 15, label: "到河畔告别酒吧" }
  ];
  d12.candidates = ["poi-gm-noir", "poi-gm-muse-massage", "poi-gm-retreat-nimman", "poi-gm-aiyaret", "poi-gm-mee-an-ja-kin", "poi-chiangmai-farewell"];
  d12.reminders = [
    { label: "The Market CNX 营业日确认", due: "D12 当天", detail: "周二–周四 17:00–22:00，10/6 是周二；画海娜找像 LISA 的老板", status: "todo" },
    { label: "告别晚餐订位", due: "提前 1 天", detail: "KINLARB（宁曼）或 Maha Larb 提前订位", status: "todo" },
    { label: "Pranom 健康按摩（泰式 11:30）", due: "D12 上午", detail: "古城 Kad Klang Wiang（Ratchadamnoen 路），每日 10:00–21:00，泰式约 150 铢/时；三人建议提前电话约或早点到", status: "todo" },
    { label: "Bar.San. 营业", due: "D12 21:00", detail: "18:00 开门，21:00 后人较多；Noir 同街可替换", status: "todo" }
  ];

  return days;
}

/* ---------- 执行 ---------- */
let pois = read("pois.json");
let sources = read("sources.json");
const days = read("itinerary.json");
const poisBefore = pois.length, srcBefore = sources.length;

for (const p of newPois) if (!pois.some((x) => x.id === p.id)) pois.push(p);
for (const p of collectionPois) {
  const idx = pois.findIndex((x) => x.id === p.id);
  if (idx >= 0) pois[idx] = p; else pois.push(p);
}
/* 用户确认删除的地点（幂等） */
pois = pois.filter((x) => x.id !== "poi-gm-mae-ho-phra");
pois = pois.filter((x) => x.id !== "poi-gm-nimman-soi6");
for (const u of updatePois) {
  const p = pois.find((x) => x.id === u.id);
  if (p) Object.assign(p, u.patch);
}
sources = sources.filter((x) => x.id !== "src-gm-nimman-soi6");
for (const s of newSources) if (!sources.some((x) => x.id === s.id)) sources.push(s);
for (const u of updateSources) { const s = sources.find((x) => x.id === u.id); if (s) Object.assign(s, u.patch); }

/* 一次性迁移：为缺失 source/plan 的 POI 补默认值（幂等） */
for (const p of pois) {
  if (!p.source && p.sourceIds && p.sourceIds[0]) p.source = p.sourceIds[0];
  if (!p.plan && p.contentTier === "compact") p.plan = "备选：按当天动线顺路安排，不占主路线；出发前用 App 内全球搜索复核坐标。";
  if (!p.plan && p.contentTier !== "compact") p.plan = "主路线锚点：见每日行程安排。";
}

const daysPatched = patchDays(days);
write("pois.json", pois);
write("sources.json", sources);
write("itinerary.json", daysPatched);
console.log(`pois ${poisBefore} -> ${pois.length}; sources ${srcBefore} -> ${sources.length}; days patched: ${daysPatched.length}`);







