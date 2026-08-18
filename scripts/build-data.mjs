// 生成 data/sources.json、data/pois.json、data/itinerary.json
// 运行：node scripts/build-data.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");

// ---------- 来源 ----------
const SOURCES = [
  { id: "src-cnx-airport", title: "Chiang Mai International Airport (CNX)", url: "https://www.google.com/maps/search/?api=1&query=Chiang+Mai+International+Airport", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"], notes: "坐标为规划级；航班时刻以订单截图与航司为准。" },
  { id: "src-hdy-airport", title: "Hat Yai International Airport (HDY)", url: "https://www.google.com/maps/search/?api=1&query=Hat+Yai+International+Airport", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"], notes: "坐标为规划级。" },
  { id: "src-kmg-airport", title: "Kunming Changshui International Airport", url: "https://www.google.com/maps/search/?api=1&query=Kunming+Changshui+International+Airport", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"], notes: "9/24 与 10/7 中转机场；机场附近中转酒店需自订。" },
  { id: "src-pakbara-pier", title: "Pak Bara Pier (Satun)", url: "https://www.google.com/maps/search/?api=1&query=Pak+Bara+Pier+Satun", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location", "schedule"], notes: "合艾往返丽贝的车船联程点；低季（5/16–10/15）船班约每天 2–3 班、可能取消。" },
  { id: "src-airasia", title: "AirAsia 泰国亚航", url: "https://www.airasia.com", type: "official", role: "operator", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["flight", "baggage"], notes: "FD157/FD158 无免费托运，App 提前加购行李。" },
  { id: "src-china-eastern", title: "China Eastern 东方航空 / 上海航空", url: "https://www.ceair.com", type: "official", role: "operator", language: "zh-CN", checkedAt: "2026-08-18", status: "checked", supports: ["flight"], notes: "订单截图显示‘航班已调整’，出发前复核最终时刻。" },
  { id: "src-thapae-twins", title: "Thapae Twins Hotel 塔佩双子酒店", url: "https://www.google.com/maps/search/?api=1&query=Thapae+Twins+Hotel+Chiang+Mai", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"], notes: "地址 16/2 Tha Phae Rd；订单：9/25–9/29 家庭套房含 3 早，¥400/晚。" },
  { id: "src-bed-changkian", title: "BED Changkian - Adults Only", url: "https://www.booking.com/hotel/th/bed-chiang-mai.zh-cn.html", type: "platform", role: "booking", language: "zh-CN", checkedAt: "2026-08-18", status: "checked", supports: ["location", "facilities", "booking"], notes: "地址 10/2 Moo 1 Leab Klong Chon Prathan Rd Soi BED，Chang Phueak；带泳池、健身房、酒吧，仅限成人。" },
  { id: "src-analynn", title: "Analynn Hotel Hat Yai 安纳琳酒店", url: "https://www.google.com/maps/search/?api=1&query=Analynn+Hotel+Hat+Yai", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"], notes: "地址 2 Vongvanit Rd；豪华三人间，9/29 入住 1 晚。" },
  { id: "src-z-sleep", title: "Z Sleep Hotel 合艾", url: "https://www.google.com/maps/search/?api=1&query=Z+Sleep+Hotel+Hat+Yai", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"], notes: "地址 1564 Kanjanavanit Rd；豪华三人房 40m²，10/2 入住 1 晚。" },
  { id: "src-ten-moons", title: "Ten Moons Sunset Villas 十月夕阳别墅", url: "https://www.google.com/maps/search/?api=1&query=Ten+Moons+Sunset+Villas+Koh+Lipe", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"], notes: "地址 172 Moo 7 T.Koh Sarai；丽贝岛日落沙滩区，9/30–10/2 共 2 晚。" },
  { id: "src-poopoo-paper", title: "Elephant POOPOOPAPER Park 大象粑粑造纸公园", url: "https://tw.trip.com/moments/poi-elephant-poopoopaper-park-chiang-mai-13695514", type: "platform", role: "visitor-info", language: "zh-TW", checkedAt: "2026-08-18", status: "checked", supports: ["opening-hours", "ticket", "location"], notes: "地址 87 Moo 10 T.Maeram A.Mae Rim；约 09:00–17:00，门票约 150 泰铢，DIY 另计；距市区约半小时车程。" },
  { id: "src-bua-tong", title: "Bua Tong Sticky Waterfall 黏黏瀑布", url: "https://tw.trip.com/moments/detail/mae-taeng-14939-144130155/", type: "platform", role: "visitor-info", language: "zh-TW", checkedAt: "2026-08-18", status: "checked", supports: ["location", "experience"], notes: "湄登 Mae Ho Phra；免费；石灰岩不滑可攀爬；约 08:30–16:30，雨天与雷雨勿爬。" },
  { id: "src-grand-canyon", title: "Grand Canyon Water Park 清迈大峡谷水上乐园", url: "https://tw.trip.com/moments/poi-grand-canyon-water-park-24038612", type: "platform", role: "visitor-info", language: "zh-TW", checkedAt: "2026-08-18", status: "checked", supports: ["opening-hours", "ticket", "location"], notes: "地址 202 Nam Phrae, Hang Dong；约 09:00–18:00（有平台写 10:00–19:00）；水乐园成人票约 650–950 泰铢、自然区约 100 泰铢，以现场为准。" },
  { id: "src-mama-noi", title: "Mama Noi Thai Cookery School 泰餐课", url: "https://www.kkday.com/zh-hk/product/4127-mama-noi-thai-cooking-class-chiang-mai", type: "platform", role: "booking", language: "zh-HK", checkedAt: "2026-08-18", status: "checked", supports: ["booking", "schedule", "location"], notes: "上午班 09:00–09:30 酒店接送→市场→有机菜园→做菜→约 13:30–14:30 送回；含酒店接送（古城/宁曼 5km 内免费）。" },
  { id: "src-wild-rose-yoga", title: "Wild Rose Yoga 古城瑜伽", url: "https://www.timeout.com/chiang-mai/sport-and-fitness/wild-rose-yoga-studio", type: "platform", role: "visitor-info", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["opening-hours", "price", "location"], notes: "地址 4/1 Phra Pok Klao Rd；每日约 9:45–18:30，单节约 1.5 小时、350 泰铢；具体课表以官网/到店为准。" },
  { id: "src-bailamos", title: "Bailamos Dance Studio 拉丁舞", url: "https://todo.today/chiang-mai/2026/06/24/wednesday-beginner-classes-bachata-salsa-1", type: "platform", role: "booking", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["schedule", "price", "contact"], notes: "周三 18:30–20:45 零基础 Bachata+Salsa 班（约 200 泰铢）；周一/周二另有 Open-Level 班，也接受私教；地址 184/3 Su Thep（以预订确认为准）。" },
  { id: "src-north-gate-jazz", title: "The North Gate Jazz Co-op", url: "https://tw.trip.com/moments/detail/chiang-mai-209-131026772/", type: "platform", role: "visitor-info", language: "zh-TW", checkedAt: "2026-08-18", status: "checked", supports: ["opening-hours", "location", "experience"], notes: "地址 91/1-2 Sri Poom Rd（古城北门旁）；每日约 19:00–24:00，几乎每晚有现场爵士；免费入场、点饮料。" },
  { id: "src-warm-up", title: "Warm Up Cafe 宁曼现场音乐酒吧", url: "https://www.timeout.com/chiang-mai/clubs/warm-up-cafe", type: "platform", role: "visitor-info", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["opening-hours", "location", "experience"], notes: "地址 40 Nimmanhaemin Rd；每日约 19:00–次日 2:00，现场乐队+DJ，本地年轻人多。" },
  { id: "src-enp", title: "Elephant Nature Park 大象自然公园", url: "https://elephantnaturepark.org/book-now/", type: "official", role: "operator", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["booking", "price", "schedule"], notes: "半天上午团约 07:00 出发、含接送与素食午餐，成人 2,500 泰铢；公益象园，不骑象不表演。" },
  { id: "src-jing-jai", title: "Jing Jai Market 真心市集", url: "https://uk.trip.com/moments/poi-jing-jai-market-chiang-mai-69948422/", type: "platform", role: "visitor-info", language: "zh-TW", checkedAt: "2026-08-18", status: "checked", supports: ["opening-hours", "location"], notes: "周末（周六/周日）露天农夫与手作市集最热闹，约 06:30–15:00；平日固定店铺 11:00–21:00 左右，以现场为准。" },
  { id: "src-wat-srisuphan-wualai", title: "Wat Srisuphan 银庙 与 Wualai 周六夜市", url: "https://tw.trip.com/moments/detail/chiang-mai-209-144589230/", type: "platform", role: "visitor-info", language: "zh-TW", checkedAt: "2026-08-18", status: "checked", supports: ["opening-hours", "location", "experience"], notes: "Wualai Rd 银质寺庙；约每日 07:00–18:00；周六晚门前 Wualai Walking Street 银器手作+小吃，开到较晚。" },
  { id: "src-baan-kang-wat", title: "Baan Kang Wat 班康瓦艺术村", url: "https://us.trip.com/moments/detail/chiang-mai-209-142748776/", type: "platform", role: "visitor-info", language: "zh-TW", checkedAt: "2026-08-18", status: "checked", supports: ["opening-hours", "location"], notes: "191 Soi Wat Umong, Suthep；周二–周日 10:00–18:00，周一闭馆；手作、咖啡、艺术工作坊。" },
  { id: "src-one-nimman", title: "One Nimman 复古市集与街区", url: "https://visionthai.net/zh-hans/article/thai-chiang-mai-10-markets-tourist-attraction/", type: "platform", role: "visitor-info", language: "zh-Hans", checkedAt: "2026-08-18", status: "checked", supports: ["schedule", "location", "experience"], notes: "One Nimman 复古市集（One Night Ground）周一/周二 16:00–22:00；White Market 周五–周日。" },
  { id: "src-pm2-vintage", title: "PM2 Second Hand 古城二手店", url: "https://m.dianping.com/ugcdetail/178242339?bizType=29&msource=baiduappugc&sceneType=0", type: "platform", role: "experience", language: "zh-Hans", checkedAt: "2026-08-18", status: "checked", supports: ["location", "experience"], notes: "地址 30 Wiang Kaew Rd, Si Phum；二手 T 恤等古着，可还价。" },
  { id: "src-fairy-garden", title: "Fairy Garden 宁曼古着店", url: "https://mbd.baidu.com/newspage/data/dtlandingsuper?from=2001k&nid=dt_4575015060039438330", type: "platform", role: "experience", language: "zh-Hans", checkedAt: "2026-08-18", status: "checked", supports: ["location", "experience"], notes: "宁曼路小巷内古着店，约 10:30–21:00；具体门牌以地图为准。" },
  { id: "src-house-by-ginger", title: "THE HOUSE by Ginger 古城创意泰餐", url: "https://sg.trip.com/moments/poi-the-house-by-ginger-17049822/", type: "platform", role: "visitor-info", language: "zh-TW", checkedAt: "2026-08-18", status: "checked", supports: ["opening-hours", "location"], notes: "199 Moon Muang Rd；每日约 11:00–22:00；花园环境创意泰餐。" },
  { id: "src-khao-soi-khun-yai", title: "Khao Soi Khun Yai 咖喱面", url: "https://sg.trip.com/moments/poi-khao-soi-khun-yai-19646340", type: "platform", role: "visitor-info", language: "zh-TW", checkedAt: "2026-08-18", status: "checked", supports: ["opening-hours", "location"], notes: "Sri Poom 8 Alley, Si Phum；周一–周六 10:00–14:00，周日公休；老奶奶咖喱面老店。" },
  { id: "src-sp-chicken", title: "SP Chicken 米其林烤鸡", url: "https://ae.trip.com/moments/poi-sp-chicken-17049809/", type: "platform", role: "visitor-info", language: "zh-TW", checkedAt: "2026-08-18", status: "checked", supports: ["opening-hours", "location"], notes: "9/1 Samlan Rd Soi 1, Phra Singh；约 10:00–17:00；炭火烤鸡。" },
  { id: "src-rak-lay", title: "Rak Lay Seafood 丽贝步行街海鲜", url: "https://www.tripadvisor.com/ShowUserReviews-g1024140-d7986296-r573844783-Rak_Lay_Restaurant-Ko_Lipe_Satun_Province.html", type: "platform", role: "experience", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location", "experience"], notes: "丽贝步行街；淡季营业情况到岛后确认。" },
  { id: "src-nee-papaya", title: "Nee Papaya Thaifood & BBQ 丽贝泰餐", url: "https://sg.trip.com/restaurant/thailand/koh%20lipe/detail/Nee%20papaya%20Thaifood%20%26%20BBQ-37685779/", type: "platform", role: "experience", language: "zh-TW", checkedAt: "2026-08-18", status: "checked", supports: ["location", "experience"], notes: "325 Walking St；近日出沙滩端；淡季营业情况到岛后确认。" },
  { id: "src-warorot", title: "Warorot Market 瓦洛洛市场", url: "https://www.dusit.com/dusitprincess-chiangmai/experience/warorot-market/", type: "platform", role: "visitor-info", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["opening-hours", "location"], notes: "Chang Moi / Wichayanon Rd；每日约 04:00–18:00（部分平台至 22:00）；手信、干果、泰北小吃。" },
  { id: "src-lipe-boats-lowseason", title: "Pak Bara ⇄ Koh Lipe 低季船班", url: "https://tours.olympicair.com/ko-lipe-l89858/one-way-speedboat-ticket-pakbara-pier-to-koh-lipe-t603477/", type: "platform", role: "operator", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["schedule", "price"], notes: "低季（5/16–10/15）快艇约每天 2–3 班、可能取消，低季多从日出沙滩上下船；国家公园岛（Adang/Rawi）此时关闭。" },
  { id: "src-koh-lipe-beaches", title: "Koh Lipe 三海滩与步行街", url: "https://www.google.com/maps/search/?api=1&query=Koh+Lipe+Sunrise+Beach", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"], notes: "日出/日落/拖尾沙滩与步行街坐标均为规划级；10 月淡季部分店休。" },
  { id: "src-kim-yong", title: "Kim Yong Market 合艾", url: "https://www.google.com/maps/search/?api=1&query=Kim+Yong+Market+Hat+Yai", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"], notes: "合艾华人市场，水果零食手信；晚间营业到较晚。" },
  { id: "src-asean-bazaar", title: "ASEAN Night Bazaar 合艾夜市", url: "https://www.google.com/maps/search/?api=1&query=ASEAN+Night+Bazaar+Hat+Yai", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"], notes: "合艾知名夜市，海鲜烧烤；周五最热闹。" },
  { id: "src-central-festival-hdy", title: "Central Festival Hat Yai", url: "https://www.google.com/maps/search/?api=1&query=Central+Festival+Hat+Yai", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"], notes: "合艾最大商场，冷气补给。" },
  { id: "src-wualai-saturday", title: "Wualai Walking Street 周六夜市（银庙前）", url: "https://tw.trip.com/moments/detail/chiang-mai-209-144589230/", type: "platform", role: "visitor-info", language: "zh-TW", checkedAt: "2026-08-18", status: "checked", supports: ["schedule", "location"], notes: "每周六傍晚起，Wualai Rd 银器手作与小吃夜市。" },
  { id: "src-sunday-market", title: "周日步行街 Sunday Walking Street", url: "https://www.google.com/maps/search/?api=1&query=Sunday+Walking+Street+Chiang+Mai+Ratchadamnoen", type: "platform", role: "visitor-info", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["schedule", "location"], notes: "每周日 16:00–22:00，Ratchadamnoen 路塔佩门至帕辛寺段。" },
  { id: "src-doi-suthep", title: "双龙寺 Wat Phra That Doi Suthep（备选）", url: "https://www.google.com/maps/search/?api=1&query=Wat+Phra+That+Doi+Suthep", type: "platform", role: "location", language: "en", checkedAt: "2026-08-18", status: "checked", supports: ["location"], notes: "仅作天气好的备选；山顶需盖肩过膝着装。" }
];
// ---------- 地点 ----------
const POIS = [
  { id: "poi-kmg-airport", name: "Kunming Changshui International Airport", name_zh: "昆明长水国际机场", city: "Kunming", area: "Changshui", category: "transport", priority: "preferred", coords: [25.1019, 102.9292], note: "9/24 晚抵达、9/25 早飞清迈的中转机场，10/7 返程再经停。", plan: "D0 抵达后入住机场周边中转酒店，D13 返程中转。", tip: "9/24 晚的中转酒店还没订，选长水机场周边 10 分钟内车程的。", source: "src-kmg-airport", mapUrl: "https://www.google.com/maps/search/?api=1&query=Kunming+Changshui+International+Airport", imageQuery: "Kunming Changshui Airport terminal", contentTier: "standard", whyWorthIt: "昆明长水是东航经停枢纽，9/24 18:55 抵达后需要过夜，第二天 08:20 再飞清迈，中转酒店离机场越近越省心。", detailSections: [ { title: "怎么安排", items: ["抵达后打车 10 分钟内到机场周边酒店入住，第二天早上 08:20 前回到机场值机", "东航联程行李可直挂，办理时口头确认一次行李是否直达清迈"] } ], sourceIds: ["src-kmg-airport"], timeWindows: ["夜间中转"], duration: "过夜中转", themeTags: ["transit", "kunming"] },
  { id: "poi-cnx-airport", name: "Chiang Mai International Airport (CNX)", name_zh: "清迈国际机场", city: "Chiang Mai", area: "Airport", category: "transport", priority: "preferred", coords: [18.7669, 98.9626], note: "抵达、离开清迈以及两程亚航往返合艾的空港。", plan: "D1 09:15 抵达、D5 上午飞合艾、D9 16:00 返回、D13 返程。", tip: "国际段东航含托运；亚航段无免费托运，App 提前加购 20kg。", source: "src-cnx-airport", mapUrl: "https://www.google.com/maps/search/?api=1&query=Chiang+Mai+International+Airport", imageQuery: "Chiang Mai International Airport", contentTier: "standard", whyWorthIt: "清迈机场是全程进出清迈的唯一空港，出关后 Grab 到古城约 20 分钟、150–200 泰铢，是每一天移动的起点或终点。", detailSections: [ { title: "现场动作", items: ["抵达后在到达层出口用 Grab 叫车到塔佩门一带酒店", "亚航段出发前在 App 完成值机并确认 20kg 行李额已购买"] } ], sourceIds: ["src-cnx-airport"], timeWindows: ["全天"], duration: "过站", themeTags: ["transport", "chiang-mai"] },
  { id: "poi-hdy-airport", name: "Hat Yai International Airport (HDY)", name_zh: "合艾国际机场", city: "Hat Yai", area: "Airport", category: "transport", priority: "preferred", coords: [6.9332, 100.393], note: "前往丽贝岛的中转空港，机场到市区约 30–40 分钟。", plan: "D5 13:30 抵达、D9 14:00 起飞回清迈。", tip: "亚航两程无免费托运；回程 12:00 前从酒店出发。", source: "src-hdy-airport", mapUrl: "https://www.google.com/maps/search/?api=1&query=Hat+Yai+International+Airport", imageQuery: "Hat Yai International Airport", contentTier: "standard", whyWorthIt: "合艾机场是连接清迈与安达曼海丽贝岛的唯一空港，进出岛前后的两晚都围绕它安排，衔接顺畅能省下大量折腾。", detailSections: [ { title: "现场动作", items: ["D5 抵达后打车或让酒店接驳到市区安纳琳酒店并寄存行李", "D9 起飞前 2 小时到达机场，完成亚航值机与托运"] } ], sourceIds: ["src-hdy-airport"], timeWindows: ["全天"], duration: "过站", themeTags: ["transport", "hat-yai"] },
  { id: "poi-pakbara-pier", name: "Pak Bara Pier", name_zh: "Pak Bara 码头", city: "Satun", area: "Pak Bara", category: "transport", priority: "preferred", coords: [6.8095, 99.791], note: "合艾与丽贝岛之间的车船联程码头。", plan: "D6 上午由合艾经 Pak Bara 上岛，D8 上午返程经 Pak Bara 回合艾。", tip: "低季船班约每天 2–3 班且可能取消，出发前 1–2 天向船公司/酒店确认；低季多从日出沙滩上下船。", source: "src-pakbara-pier", mapUrl: "https://www.google.com/maps/search/?api=1&query=Pak+Bara+Pier+Satun", imageQuery: "Pak Bara Pier Satun", contentTier: "standard", whyWorthIt: "Pak Bara 是往返丽贝岛的固定码头，9/30 上午与 10/2 上午两程快艇都在这里换乘，是海岛段唯一的交通咽喉。", detailSections: [ { title: "现场动作", items: ["合艾市区包车/拼车到码头，预留 2 小时车程再赶快艇班次", "上船前吃晕船药、套好防水袋，低季风浪大时听从船家安排"] } ], sourceIds: ["src-pakbara-pier"], timeWindows: ["上午"], duration: "过站", hardConstraints: ["低季船班可能取消"], themeTags: ["transport", "koh-lipe"] },
  { id: "poi-thapae-twins", name: "Thapae Twins Hotel", name_zh: "塔佩双子酒店", city: "Chiang Mai", area: "Old City / Tha Phae", category: "hotel", priority: "preferred", coords: [18.7887, 98.995], note: "清迈段一住宿基地，塔佩门旁，家庭套房含 3 早。", plan: "9/25–9/29 共 4 晚；每天从这里出发，下午可回酒店休息。", tip: "15:00 后入住、12:00 前退房；订单号 1128148277662541。", source: "src-thapae-twins", officialUrl: "", mapUrl: "https://www.google.com/maps/search/?api=1&query=Thapae+Twins+Hotel+Chiang+Mai", imageQuery: "Thapae Twins Hotel Chiang Mai", lodgingRole: "base", hotelRationale: "紧邻塔佩门与周日夜市起点，古城内多数地点步行可达。", hotelTradeoffs: "房间偏紧凑；泳池设施以酒店实际为准。", contentTier: "compact", sourceIds: ["src-thapae-twins"], themeTags: ["base", "old-city"] },
  { id: "poi-bed-changkian", name: "BED Changkian - Adults Only", name_zh: "查恩基安贝德酒店（仅限成人）", city: "Chiang Mai", area: "Chang Phueak / Nimman", category: "hotel", priority: "preferred", coords: [18.8065, 98.9695], note: "清迈段二住宿基地，带泳池、健身房与酒吧，仅限成人。", plan: "10/3–10/7 共 4 晚；步行约 1 公里到宁曼路。", tip: "靠近当地生活区，出门打车更省力；泳池可作 D10 下午玩水。", source: "src-bed-changkian", mapUrl: "https://www.google.com/maps/search/?api=1&query=BED+Changkian+Hotel+Chiang+Mai", imageQuery: "BED Changkian Adults Only hotel", lodgingRole: "base", hotelRationale: "宁曼/清迈大学一带的设计酒店，第二段兴趣班与市集都在附近。", hotelTradeoffs: "离古城约 3 公里，去古城需打车。", contentTier: "compact", sourceIds: ["src-bed-changkian"], themeTags: ["base", "nimman"] },
  { id: "poi-analynn", name: "Analynn Hotel Hat Yai", name_zh: "安纳琳酒店（合艾）", city: "Hat Yai", area: "City Center", category: "hotel", priority: "preferred", coords: [7.0057, 100.4745], note: "合艾过夜酒店，豪华三人间。", plan: "9/29 入住 1 晚，靠近 Kim Yong 市场与夜市。", tip: "15:00 后入住；三人间为 1.8m 双人床+0.8m 单人床。", source: "src-analynn", mapUrl: "https://www.google.com/maps/search/?api=1&query=Analynn+Hotel+Hat+Yai", imageQuery: "Analynn Hotel Hat Yai", lodgingRole: "transfer", contentTier: "compact", sourceIds: ["src-analynn"], themeTags: ["base", "hat-yai"] },
  { id: "poi-z-sleep", name: "Z Sleep Hotel", name_zh: "Z Sleep 酒店（合艾）", city: "Hat Yai", area: "Kanjanavanit Rd", category: "hotel", priority: "preferred", coords: [7.006, 100.4648], note: "离岛后合艾休整酒店，豪华三人房 40m²。", plan: "10/2 入住 1 晚，步行可到 Central Festival 与夜市。", tip: "14:00 后入住；房间大，适合放行李休整。", source: "src-z-sleep", mapUrl: "https://www.google.com/maps/search/?api=1&query=Z+Sleep+Hotel+Hat+Yai", imageQuery: "Z Sleep Hotel Hat Yai", lodgingRole: "transfer", contentTier: "compact", sourceIds: ["src-z-sleep"], themeTags: ["base", "hat-yai"] },
  { id: "poi-ten-moons", name: "Ten Moons Sunset Villas", name_zh: "十月夕阳别墅", city: "Koh Lipe", area: "Sunset Beach", category: "hotel", priority: "preferred", coords: [6.489, 99.2842], note: "丽贝岛日落沙滩区住宿，门前即可浮潜看日落。", plan: "9/30–10/2 共 2 晚；日出日落与跳岛都从这里出发。", tip: "10 月淡季部分设施可能缩减，到岛后与前台确认浮潜与船班。", source: "src-ten-moons", mapUrl: "https://www.google.com/maps/search/?api=1&query=Ten+Moons+Sunset+Villas+Koh+Lipe", imageQuery: "Ten Moons Sunset Villas Koh Lipe", lodgingRole: "base", hotelRationale: "日落沙滩安静、门前浮潜方便，符合海岛慢节奏。", hotelTradeoffs: "离步行街约 15 分钟步行；淡季餐饮选择少。", contentTier: "compact", sourceIds: ["src-ten-moons"], themeTags: ["base", "koh-lipe"] },
  { id: "poi-kmg-transit-hotel", name: "Kunming Airport Transit Hotel", name_zh: "昆明机场中转酒店（待订）", city: "Kunming", area: "Airport", category: "hotel", priority: "nearby", coords: [25.105, 102.94], note: "9/24 晚唯一未订的住宿，选长水机场周边。", plan: "D0 抵达后入住，第二天早班机前退房。", tip: "订可免费取消的房型，留意机场摆渡与接送。", source: "src-kmg-airport", mapUrl: "https://www.google.com/maps/search/?api=1&query=Kunming+Changshui+Airport+Hotels", lodgingRole: "transfer", contentTier: "compact", themeTags: ["transit", "to-book"] },
  { id: "poi-tha-phae-gate", name: "Tha Phae Gate", name_zh: "塔佩门", city: "Chiang Mai", area: "Old City East", category: "sight", priority: "preferred", coords: [18.7883, 98.9934], note: "清迈古城东门地标，抵达第一站。", plan: "D1 下午寄存行李后步行到塔佩门喂鸽子拍照。", tip: "傍晚光线好；鸽子饲料小贩约 20 泰铢。", source: "src-cnx-airport", mapUrl: "https://www.google.com/maps/search/?api=1&query=Tha+Phae+Gate+Chiang+Mai", imageQuery: "Tha Phae Gate Chiang Mai pigeons", contentTier: "standard", whyWorthIt: "塔佩门是清迈古城最上镜的城门，红砖墙配鸽子是经典机位，紧邻塔佩双子酒店，抵达下午顺路即可完成。", detailSections: [ { title: "现场动作", items: ["在红砖墙前喂鸽子并拍合影，傍晚侧光最柔和", "沿 Ratchadamnoen 路向西步行 15 分钟即到柴迪隆寺"] } ], sourceIds: ["src-cnx-airport"], timeWindows: ["下午至傍晚"], duration: "30–45 分钟", themeTags: ["old-city", "arrival"] },
  { id: "poi-wat-chedi-luang", name: "Wat Chedi Luang", name_zh: "柴迪隆寺", city: "Chiang Mai", area: "Old City Center", category: "sight", priority: "preferred", coords: [18.7869, 98.9866], note: "清迈古城中心的大佛塔遗址。", plan: "D1 塔佩门之后步行前往，作为抵达日唯一主锚点。", tip: "门票约 40 泰铢；进殿脱鞋、着装盖肩过膝。", source: "src-cnx-airport", mapUrl: "https://www.google.com/maps/search/?api=1&query=Wat+Chedi+Luang+Chiang+Mai", imageQuery: "Wat Chedi Luang great chedi", contentTier: "standard", whyWorthIt: "柴迪隆寺中央 15 世纪的巨型佛塔遗址是古城最有分量的地标，规模与历史感远超一般寺庙，适合作为落地首日的文化锚点。", detailSections: [ { title: "现场动作", items: ["绕大佛塔一周看六面大象雕塑与塔身残迹，傍晚光线最佳", "在主殿前脱鞋入内，顺时针礼佛并阅读中文简介牌"] } ], sourceIds: ["src-cnx-airport"], timeWindows: ["06:00–18:00"], duration: "45 分钟–1 小时", themeTags: ["old-city", "temple"] },
  { id: "poi-house-by-ginger", name: "THE HOUSE by Ginger", name_zh: "Ginger 之家（古城创意泰餐）", city: "Chiang Mai", area: "Old City East", category: "food", priority: "preferred", coords: [18.7912, 98.9916], note: "抵达首日晚餐，花园环境创意泰餐。", plan: "D1 晚上从酒店步行前往，作为落地第一顿。", tip: "每日约 11:00–22:00；人多可先到店取号。", source: "src-house-by-ginger", mapUrl: "https://www.google.com/maps/search/?api=1&query=THE+HOUSE+by+Ginger+Chiang+Mai", imageQuery: "The House by Ginger Chiang Mai", mealRole: "formal-dinner", contentTier: "standard", whyWorthIt: "Ginger 之家藏在殖民风格老宅里，泰北菜与创意料理摆盘精致、出品稳定，距塔佩双子步行约 10 分钟，适合落地第一晚慢慢吃。", detailSections: [ { title: "怎么点", items: ["点泰北香肠拼盘与咖喱软壳蟹两道招牌，配芒果糯米饭收尾", "让店员推荐当日汤品，微辣口味提前说明"] } ], sourceIds: ["src-house-by-ginger"], timeWindows: ["11:00–22:00"], duration: "1–1.5 小时", themeTags: ["food", "old-city"] },
  { id: "poi-jing-jai", name: "Jing Jai Market", name_zh: "真心市集（JJ 市集）", city: "Chiang Mai", area: "Atsadathon Rd / CMU", category: "market", priority: "preferred", coords: [18.8081, 98.962], note: "清迈最大周末创意市集，蓝染、手作与有机早餐。", plan: "D2 上午（周六）安排，早去人少摊全。", tip: "周末露天农夫/手作区约 06:30–15:00；带现金。", source: "src-jing-jai", mapUrl: "https://www.google.com/maps/search/?api=1&query=Jing+Jai+Market+Chiang+Mai", imageQuery: "Jing Jai Market Chiang Mai handmade", category2: "", contentTier: "deep", whyWorthIt: "真心市集是清迈周末最值得逛的创意市集，蓝染棉麻、手工饰品和农夫早餐摊位集中，一条街能完成早餐、逛摊与手信三件事。", detailSections: [ { title: "怎么逛", items: ["先在露天早餐区吃泰北香肠糯米饭和鲜榨果汁再开始逛", "在蓝染服饰与手工皮具摊挑选手信，同类摊位可以还价", "留意摊主手作工作台，很多摊位支持现场定制"] }, { title: "实用提示", items: ["现金与环保袋必备，摊贩基本只收现金", "工作日想逛固定店铺可中午后来，周末露天摊更全"] } ], sourceIds: ["src-jing-jai"], timeWindows: ["周六/周日 06:30–15:00"], duration: "2–3 小时", themeTags: ["market", "weekend"] },
  { id: "poi-khao-soi-khun-yai", name: "Khao Soi Khun Yai", name_zh: "咖喱面老奶奶（Khao Soi Khun Yai）", city: "Chiang Mai", area: "Si Phum / Sri Poom", category: "food", priority: "preferred", coords: [18.7978, 98.9898], note: "老字号咖喱面，只开上午到中午。", plan: "D2 周六中午从 JJ 市集回程顺路吃，周日公休别跑空。", tip: "周一至周六 10:00–14:00，周日休息；一碗约 60–80 泰铢。", source: "src-khao-soi-khun-yai", mapUrl: "https://www.google.com/maps/search/?api=1&query=Khao+Soi+Khun+Yai+Chiang+Mai", imageQuery: "Khao Soi Khun Yai", mealRole: "local-classic", contentTier: "standard", whyWorthIt: "Khao Soi Khun Yai 是清迈最出名的咖喱面老店，椰香咖喱配脆面与酸菜，分量和价格都很实在，只在上午营业所以要卡点去吃。", detailSections: [ { title: "怎么点", items: ["点一碗牛肉或鸡肉咖喱面，加一只溏心蛋", "先吃脆面再拌汤，配桌上的酸菜与洋葱解腻"] } ], sourceIds: ["src-khao-soi-khun-yai"], timeWindows: ["周一–周六 10:00–14:00"], duration: "30–45 分钟", themeTags: ["food", "old-city"] },
  { id: "poi-wat-srisuphan", name: "Wat Srisuphan", name_zh: "银庙（Wat Srisuphan）", city: "Chiang Mai", area: "Wualai", category: "sight", priority: "preferred", coords: [18.7822, 98.9888], note: "世界少见的银质寺庙，Wualai 银器街。", plan: "D2 傍晚在周六夜市开始前参观，随后逛 Wualai 夜市。", tip: "约 07:00–18:00；主殿由纯银与铝手工打造，殿内禁止女性入内（平台提示）。", source: "src-wat-srisuphan-wualai", mapUrl: "https://www.google.com/maps/search/?api=1&query=Wat+Sri+Suphan+Silver+Temple+Chiang+Mai", imageQuery: "Wat Srisuphan silver temple Chiang Mai", contentTier: "standard", whyWorthIt: "银庙整座大殿由银与铝手工敲制，是清迈独一份的手工艺奇观，与周六 Wualai 银器夜市连成一条动线，傍晚光线最佳。", detailSections: [ { title: "现场动作", items: ["在殿外欣赏银质外墙与精细錾刻，傍晚灯亮后更出片", "沿 Wualai Rd 逛银器作坊，看匠人现场敲打银片"] } ], sourceIds: ["src-wat-srisuphan-wualai"], timeWindows: ["约 07:00–18:00"], duration: "40 分钟–1 小时", themeTags: ["temple", "handicraft", "wualai"] },
  { id: "poi-wualai-walking-street", name: "Wualai Walking Street", name_zh: "Wualai 周六夜市（银器街）", city: "Chiang Mai", area: "Wualai", category: "market", priority: "preferred", coords: [18.7815, 98.9892], note: "每周六傍晚的银器手作与小吃夜市。", plan: "D2 晚上银庙参观后直接开逛，边走边吃。", tip: "仅周六；银器、手工包与泰北小吃摊位密集，现金为主。", source: "src-wualai-saturday", mapUrl: "https://www.google.com/maps/search/?api=1&query=Wualai+Walking+Street+Chiang+Mai", imageQuery: "Wualai Walking Street Chiang Mai silver", category2: "", contentTier: "standard", whyWorthIt: "Wualai 周六夜市是清迈少有的以银器手作见长的夜市，既能淘手工银饰，也能一路吃泰北小吃，比千篇一律的纪念品夜市更有在地感。", detailSections: [ { title: "怎么逛", items: ["在银器摊位挑手工耳环或银制书签，记得比对几家再买", "边逛边吃烤肉串、青木瓜沙拉和椰子煎饼当晚餐"] } ], sourceIds: ["src-wualai-saturday"], timeWindows: ["周六傍晚至深夜"], duration: "1.5–2 小时", themeTags: ["market", "handicraft", "night"] },
  { id: "poi-wild-rose-yoga", name: "Wild Rose Yoga", name_zh: "Wild Rose 瑜伽（古城）", city: "Chiang Mai", area: "Old City", category: "activity", priority: "preferred", coords: [18.7909, 98.9905], note: "古城内的每日瑜伽工作室，零基础友好。", plan: "D3 周日上午约 10:00 的课，约 1.5 小时。", tip: "单节约 350 泰铢；开课前 10 分钟到店，具体课表以官网/到店为准。", source: "src-wild-rose-yoga", bookingUrl: "https://www.wildroseyoga.org/", mapUrl: "https://www.google.com/maps/search/?api=1&query=Wild+Rose+Yoga+Chiang+Mai", imageQuery: "Wild Rose Yoga Chiang Mai studio", contentTier: "deep", whyWorthIt: "Wild Rose 在古城中心提供每日 Vinyasa 与顺位课程，教室是通风的老式柚木房，1.5 小时 350 泰铢，是慢旅行里最舒服的早晨打开方式。", detailSections: [ { title: "上课前", items: ["提前一天到店或在官网确认周日上午班次并预约", "带自己的瑜伽垫或确认教室可租借，穿舒适运动服"] }, { title: "上课后", items: ["课后在附近 Phra Pok Klao 街吃一顿轻早餐", "步行 10 分钟到 SP Chicken 吃午餐"] } ], sourceIds: ["src-wild-rose-yoga"], timeWindows: ["上午 10:00–11:30 左右"], duration: "1.5 小时", reservation: "建议提前确认课表", themeTags: ["wellness", "yoga"] },
  { id: "poi-sp-chicken", name: "SP Chicken", name_zh: "SP Chicken 炭火烤鸡", city: "Chiang Mai", area: "Phra Singh", category: "food", priority: "preferred", coords: [18.7863, 98.9817], note: "米其林推介的炭火烤鸡店。", plan: "D3 瑜伽后午餐，10:00–17:00 营业。", tip: "烤鸡按只点，配糯米饭和青木瓜沙拉；辣度提前说明。", source: "src-sp-chicken", mapUrl: "https://www.google.com/maps/search/?api=1&query=SP+Chicken+Chiang+Mai", imageQuery: "SP Chicken grilled chicken Chiang Mai", mealRole: "local-classic", contentTier: "standard", whyWorthIt: "SP Chicken 用炭火慢烤的整鸡外皮焦香、肉汁足，是古城西侧米其林推介的平民食堂，人均几十元就能吃得满足。", detailSections: [ { title: "怎么点", items: ["点半只或一只炭火烤鸡，配糯米饭与青木瓜沙拉", "让店员把鸡内脏烤串也来两串，蘸泰北蘸水吃"] } ], sourceIds: ["src-sp-chicken"], timeWindows: ["约 10:00–17:00"], duration: "45 分钟", themeTags: ["food", "old-city"] },
  { id: "poi-pm2-vintage", name: "PM2 Second Hand", name_zh: "PM2 二手古着店", city: "Chiang Mai", area: "Si Phum", category: "shopping", priority: "preferred", coords: [18.7972, 98.9898], note: "古城北区人气二手店，T 恤古着为主。", plan: "D3 下午瑜伽与午餐之后顺路逛。", tip: "30 Wiang Kaew Rd；可还价，款式多但码数靠翻。", source: "src-pm2-vintage", mapUrl: "https://www.google.com/maps/search/?api=1&query=PM2+Second+Hand+Chiang+Mai", imageQuery: "PM2 second hand Chiang Mai vintage", contentTier: "standard", whyWorthIt: "PM2 是古城口碑最好的二手店之一，二手乐队 T 恤与夏威夷衬衫选择多、价格低，是淘中古单品最顺路的一站。", detailSections: [ { title: "怎么淘", items: ["翻找乐队与复古 T 恤，图案和码数都要靠翻", "看中就先拿在手里，结账前统一还价"] } ], sourceIds: ["src-pm2-vintage"], timeWindows: ["下午"], duration: "40 分钟–1 小时", themeTags: ["vintage", "shopping"] },
  { id: "poi-sunday-walking-street", name: "Sunday Walking Street", name_zh: "周日夜市（Ratchadamnoen 步行街）", city: "Chiang Mai", area: "Ratchadamnoen Rd", category: "market", priority: "preferred", coords: [18.7887, 98.9866], note: "清迈最大夜市，塔佩门到帕辛寺整条街。", plan: "D3 傍晚 17:00 开始，从塔佩门方向逛进去；D10 可选二刷。", tip: "周日 16:00–22:00；边走边吃，别在一家吃饱。", source: "src-sunday-market", mapUrl: "https://www.google.com/maps/search/?api=1&query=Sunday+Walking+Street+Chiang+Mai", imageQuery: "Chiang Mai Sunday Walking Street", contentTier: "deep", whyWorthIt: "周日夜市把古城主街变成绵延一公里的夜市，手作、街头表演与泰北小吃全都有，是全泰国最有气氛的周日夜晚。", detailSections: [ { title: "怎么逛", items: ["从塔佩门往帕辛寺方向走，先逛手作摊再吃小吃", "尝烤猪颈肉串、芒果糯米饭与手冲椰子冰淇淋", "19:00 后到北门的 The North Gate 听爵士收尾"] }, { title: "实用提示", items: ["从塔佩门端进入人流最顺，逛到底再折返", "遇到想吃的小吃先买，摊位之间距离较长"] } ], sourceIds: ["src-sunday-market"], timeWindows: ["周日 16:00–22:00"], duration: "2–3 小时", themeTags: ["market", "night", "weekend"] },
  { id: "poi-north-gate-jazz", name: "The North Gate Jazz Co-op", name_zh: "The North Gate 爵士吧", city: "Chiang Mai", area: "North Gate", category: "bar", priority: "preferred", coords: [18.7987, 98.9869], note: "古城北门旁的传奇爵士现场。", plan: "D3 晚上周日夜市后步行前往，约 21:00 后最热闹。", tip: "每日约 19:00–24:00，几乎每晚有现场乐队；免费入场点杯饮料即可。", source: "src-north-gate-jazz", mapUrl: "https://www.google.com/maps/search/?api=1&query=The+North+Gate+Jazz+Co-op+Chiang+Mai", imageQuery: "The North Gate Jazz Co-op Chiang Mai", contentTier: "deep", whyWorthIt: "The North Gate 是清迈最有名的爵士据点，每晚都有本地与巡回乐手上台，气氛松弛、消费亲民，是结束周日最好的方式。", detailSections: [ { title: "现场动作", items: ["点一杯本地精酿或莫吉托，找二楼窗边座位", "演出间隙和乐手互动点歌，注意保持低声交谈"] }, { title: "实用提示", items: ["二楼有更安静的座位区，适合聊天听歌", "乐队小费自愿，在吧台点单即可"] } ], sourceIds: ["src-north-gate-jazz"], timeWindows: ["约 19:00–24:00"], duration: "1–2 小时", themeTags: ["bar", "live-music", "night"] }
,  { id: "poi-mama-noi", name: "Mama Noi Thai Cookery School", name_zh: "Mama Noi 泰餐课", city: "Chiang Mai", area: "Tha Sala（含酒店接送）", category: "activity", priority: "preferred", coords: [18.78, 99.021], note: "含市场参观与有机菜园的半天泰餐课。", plan: "D4 上午 09:00–09:30 酒店接，约 14:00 送回；午餐就是自己做的菜。", tip: "古城/宁曼 5km 内免费接送；10 岁以上可参加；素食可在预订备注说明。", source: "src-mama-noi", bookingUrl: "https://www.kkday.com/zh-hk/product/4127-mama-noi-thai-cooking-class-chiang-mai", mapUrl: "https://www.google.com/maps/search/?api=1&query=Mama+Noi+Thai+Cookery+School+Chiang+Mai", imageQuery: "Mama Noi Thai cooking class Chiang Mai", contentTier: "deep", whyWorthIt: "Mama Noi 的上午班会先逛当地菜市场再进有机菜园，从认食材到自己炒出三道泰菜配芒果糯米饭，5 小时包含接送与午餐，是体验感最完整的一堂兴趣课。", detailSections: [ { title: "课程流程", items: ["09:30 跟老师逛市场认识香茅、南姜与青柠叶并采购", "在菜园摘香草，依次完成炒菜、汤、咖喱酱三道菜", "12:00 左右吃自己做的午餐，再煮芒果糯米饭收尾"] }, { title: "预订提示", items: ["提前 2 天在 KKday 等平台下单并备注酒店与饮食需求", "穿方便站立的鞋，围裙与厨具由学校提供"] } ], sourceIds: ["src-mama-noi"], timeWindows: ["上午 09:00–14:30"], duration: "5 小时", reservation: "需要预订", themeTags: ["class", "food"] },
  { id: "poi-one-nimman", name: "One Nimman", name_zh: "宁曼一号（One Nimman）", city: "Chiang Mai", area: "Nimman", category: "shopping", priority: "preferred", coords: [18.7987, 98.9692], note: "红砖街区+餐饮+文创市集，复古市集周一/周二开。", plan: "D4 傍晚逛周一复古市集（16:00–22:00）。", tip: "复古市集在停车场空地，现场有民谣与 DJ；White Market 是周五至周日。", source: "src-one-nimman", mapUrl: "https://www.google.com/maps/search/?api=1&query=One+Nimman+Chiang+Mai", imageQuery: "One Nimman Chiang Mai vintage market", contentTier: "standard", whyWorthIt: "One Nimman 把红砖老建筑改成餐饮文创街区，周一周二的复古市集能淘到乐队 T 恤、夏威夷衬衫与复古首饰，是宁曼区最集中的中古据点。", detailSections: [ { title: "怎么逛", items: ["17:00 后逛复古市集摊位，看乐队 T 恤与复古首饰", "在街区里挑一家泰北菜或牛排解决晚餐"] } ], sourceIds: ["src-one-nimman"], timeWindows: ["复古市集周一/周二 16:00–22:00"], duration: "1.5–2 小时", themeTags: ["shopping", "vintage", "nimman"] },
  { id: "poi-fairy-garden", name: "Fairy Garden Vintage", name_zh: "Fairy Garden 古着店（宁曼）", city: "Chiang Mai", area: "Nimman", category: "shopping", priority: "preferred", coords: [18.7995, 98.9705], note: "宁曼巷内的古着店，色彩丰富适合拍照。", plan: "D4 晚上 One Nimman 前后顺路逛。", tip: "约 10:30–21:00；门牌较隐蔽，用地图搜店名导航。", source: "src-fairy-garden", mapUrl: "https://www.google.com/maps/search/?api=1&query=Fairy+Garden+vintage+Chiang+Mai", imageQuery: "Fairy Garden vintage Chiang Mai", contentTier: "standard", whyWorthIt: "Fairy Garden 藏在宁曼小巷里，古着连衣裙与配饰色彩丰富、布景可爱，是拍照和淘中古裙装都顺的一站。", detailSections: [ { title: "怎么淘", items: ["翻看古着裙装与配饰，看中先拍照对比", "和店主简单还价，现金结账更顺利"] } ], sourceIds: ["src-fairy-garden"], timeWindows: ["约 10:30–21:00"], duration: "40 分钟", themeTags: ["vintage", "shopping", "nimman"] },
  { id: "poi-bailamos", name: "Bailamos Dance Studio", name_zh: "Bailamos 拉丁舞工作室", city: "Chiang Mai", area: "Su Thep / Nimman", category: "activity", priority: "preferred", coords: [18.7995, 98.9695], note: "Salsa/Bachata 舞蹈课，零基础友好、无需舞伴。", plan: "D4 晚上约 19:30 上课；若当周只有周三班，改 D11 晚或 Pura Vida 周二场。", tip: "周三零基础班约 200 泰铢；周一/周二有 Open-Level，也接受私教；上课前先联系确认班次与地址。", source: "src-bailamos", mapUrl: "https://www.google.com/maps/search/?api=1&query=Bailamos+Dance+Studio+Chiang+Mai", bookingUrl: "", imageQuery: "Bailamos dance class Chiang Mai", contentTier: "deep", whyWorthIt: "Bailamos 每周提供零基础 Bachata/Salsa 课程，不要求舞伴与经验，18:30–20:45 两节连上，是三个人一起学拉丁社交舞最合适的据点。", detailSections: [ { title: "上课前", items: ["提前一周私信 Bailamos 确认当天班次与集合地址", "穿轻便运动鞋与吸汗衣服，带水"] }, { title: "上课时", items: ["先上 18:30 Bachata 再上 19:45 Salsa 连堂体验", "课后可留在 Pura Vida 或工作室的社交舞会练习"] } ], sourceIds: ["src-bailamos"], timeWindows: ["晚间"], duration: "2 小时", reservation: "需要预约确认", themeTags: ["class", "dance", "night"] },
  { id: "poi-kim-yong", name: "Kim Yong Market", name_zh: "Kim Yong 市场（合艾）", city: "Hat Yai", area: "City Center", category: "market", priority: "preferred", coords: [7.0064, 100.4786], note: "合艾华人市场，水果零食手信。", plan: "D5 下午入住后步行前往，买水果与零食。", tip: "晚间也营业；干果与榴莲制品适合当手信。", source: "src-kim-yong", mapUrl: "https://www.google.com/maps/search/?api=1&query=Kim+Yong+Market+Hat+Yai", imageQuery: "Kim Yong Market Hat Yai", contentTier: "standard", whyWorthIt: "Kim Yong 是合艾最热闹的华人市场，水果、零食与土产价格实在，傍晚逛一圈正好为岛上两天补给水果。", detailSections: [ { title: "怎么逛", items: ["买山竹、红毛丹等热带水果，回酒店冰着吃", "挑干果与榴莲干当手信，摊位可还价"] } ], sourceIds: ["src-kim-yong"], timeWindows: ["下午至晚间"], duration: "40 分钟–1 小时", themeTags: ["market", "hat-yai"] },
  { id: "poi-asean-bazaar", name: "ASEAN Night Bazaar", name_zh: "ASEAN 夜市（合艾）", city: "Hat Yai", area: "City Center", category: "market", priority: "preferred", coords: [7.0035, 100.4725], note: "合艾知名夜市，海鲜烧烤大排档。", plan: "D5 与 D8 两晚都在这里吃晚餐；周五（10/2）最热闹。", tip: "海鲜烧烤按份点，记得问价；现金为主。", source: "src-asean-bazaar", mapUrl: "https://www.google.com/maps/search/?api=1&query=ASEAN+Night+Bazaar+Hat+Yai", imageQuery: "ASEAN Night Bazaar Hat Yai seafood", contentTier: "standard", whyWorthIt: "ASEAN 夜市是合艾吃海鲜烧烤的首选地，烤虾、烤鱼与泰式炒粉摊位连成片，价格比餐厅实惠，两晚都能吃出不同花样。", detailSections: [ { title: "怎么吃", items: ["先逛一圈再锁定烤虾与烤鱿鱼摊位，问清价格下单", "配一杯泰式奶茶或甘蔗汁，摊位间换着吃"] } ], sourceIds: ["src-asean-bazaar"], timeWindows: ["晚间"], duration: "1–1.5 小时", themeTags: ["market", "food", "hat-yai", "night"] },
  { id: "poi-central-festival", name: "Central Festival Hat Yai", name_zh: "Central Festival 合艾商场", city: "Hat Yai", area: "Kanjanavanit Rd", category: "shopping", priority: "preferred", coords: [7.0067, 100.4643], note: "合艾最大商场，冷气补给与超市采买。", plan: "D8 下午入住 Z Sleep 后步行前往，傍晚去夜市。", tip: "商场内有超市可买岛上缺的日用品；支付宝部分可用。", source: "src-central-festival-hdy", mapUrl: "https://www.google.com/maps/search/?api=1&query=Central+Festival+Hat+Yai", imageQuery: "Central Festival Hat Yai", contentTier: "standard", whyWorthIt: "Central Festival 是合艾最大的购物中心，冷气充足、超市齐全，离岛当天下午在这里补给与歇脚最顺。", detailSections: [ { title: "怎么用", items: ["在超市补防晒、晕船药与饮用水再上岛", "商场餐饮层解决一顿简餐，晚上留给夜市"] } ], sourceIds: ["src-central-festival-hdy"], timeWindows: ["10:00–22:00 左右"], duration: "1–1.5 小时", themeTags: ["shopping", "hat-yai"] },
  { id: "poi-lipe-sunset-beach", name: "Sunset Beach", name_zh: "日落沙滩（丽贝）", city: "Koh Lipe", area: "Sunset Beach", category: "nature", priority: "preferred", coords: [6.4885, 99.2835], note: "丽贝岛西侧日落观景点，酒店门前。", plan: "D6 下午入住后到沙滩等日落，慢节奏开场。", tip: "日落前 30 分钟到；淡季沙滩酒吧部分关闭。", source: "src-koh-lipe-beaches", mapUrl: "https://www.google.com/maps/search/?api=1&query=Sunset+Beach+Koh+Lipe", imageQuery: "Sunset Beach Koh Lipe", contentTier: "standard", whyWorthIt: "日落沙滩正对安达曼海，傍晚光线把整片海染成金色，是上岛第一天最快的进入状态方式，酒店出门即达。", detailSections: [ { title: "现场动作", items: ["日落前 30 分钟在沙滩找位置，看长尾船剪影", "退潮后在浅滩走走，拍海岛日落人像"] } ], sourceIds: ["src-koh-lipe-beaches"], timeWindows: ["傍晚"], duration: "1 小时", themeTags: ["beach", "sunset", "koh-lipe"] },
  { id: "poi-rak-lay", name: "Rak Lay Seafood", name_zh: "Rak Lay 海鲜（步行街）", city: "Koh Lipe", area: "Walking Street", category: "food", priority: "preferred", coords: [6.4895, 99.2968], note: "步行街口碑海鲜餐厅。", plan: "D6 晚上日落后来吃，烤鱼与老虎虾是招牌。", tip: "淡季营业情况到岛确认；人多建议早点去。", source: "src-rak-lay", mapUrl: "https://www.google.com/maps/search/?api=1&query=Rak+Lay+Seafood+Koh+Lipe", imageQuery: "Rak Lay seafood Koh Lipe", mealRole: "formal-dinner", contentTier: "standard", whyWorthIt: "Rak Lay 在丽贝步行街中段，烤老虎虾与烤鱼新鲜实惠，是上岛第一晚吃海鲜最稳妥的选择。", detailSections: [ { title: "怎么点", items: ["点烤老虎虾、烤鱼与冬阴功，按人数控制分量", "配一份泰式炒空心菜和椰青，人均约百元"] } ], sourceIds: ["src-rak-lay"], timeWindows: ["晚餐"], duration: "1 小时", themeTags: ["food", "seafood", "koh-lipe"] },
  { id: "poi-lipe-snorkel", name: "Koh Lipe Flexible Snorkeling", name_zh: "近岸浮潜 / 灵活出海（丽贝）", city: "Koh Lipe", area: "Koh Lipe waters", category: "activity", priority: "preferred", coords: [6.505, 99.29], note: "视海况决定的出海浮潜：能出海就近岸包船，否则酒店前浮潜。", plan: "D7 早上先问酒店/船家海况，再决定出海范围；国家公园岛 10 月关闭。", tip: "不提前订死；低季浪大，晕船药与防水袋必备；酒店前浮潜永远是最稳备选。", source: "src-lipe-boats-lowseason", mapUrl: "https://www.google.com/maps/search/?api=1&query=Koh+Lipe+snorkeling", imageQuery: "Koh Lipe snorkeling clear water", contentTier: "deep", whyWorthIt: "10 月初安达曼海处于季风尾期，国家公园岛关闭，出海要当天看海况决定：能出海就包船去近岸礁区，不能就在酒店前浮潜，弹性安排最安全。", detailSections: [ { title: "当天早上的决策", items: ["早餐时问酒店前台今天的浪况与船家是否出海", "浪况可以就约下午包船近岸浮潜，约 2–3 小时含装备"] }, { title: "浮潜要点", items: ["全程穿救生衣、穿防滑水鞋，脚蹼按需租借", "在日出沙滩或酒店前浅水区练习后再去深水区"] } ], sourceIds: ["src-lipe-boats-lowseason"], timeWindows: ["上午决策、午后出海"], duration: "半天", hardConstraints: ["海况决定是否出海", "国家公园岛 10 月关闭"], themeTags: ["snorkeling", "flexible", "koh-lipe"] },
  { id: "poi-lipe-sunrise-beach", name: "Sunrise Beach", name_zh: "日出沙滩（丽贝）", city: "Koh Lipe", area: "Sunrise Beach", category: "nature", priority: "preferred", coords: [6.497, 99.309], note: "丽贝东侧白沙滩，水清浪小，低季上下船点。", plan: "D7 下午浮潜后过来放松，或作为船班上下船点。", tip: "低季船班多从这里上下船；浅水区珊瑚多，穿水鞋。", source: "src-koh-lipe-beaches", mapUrl: "https://www.google.com/maps/search/?api=1&query=Sunrise+Beach+Koh+Lipe", imageQuery: "Sunrise Beach Koh Lipe", contentTier: "standard", whyWorthIt: "日出沙滩是丽贝水最清、浪最小的海滩，浅水区就能看到鱼群，也是低季船班的主要上下船点，浮潜与闲逛都合适。", detailSections: [ { title: "现场动作", items: ["在浅水区浮潜看鱼，注意避开珊瑚区避免踩踏", "沙滩席地休息，喝椰青看长尾船进出"] } ], sourceIds: ["src-koh-lipe-beaches"], timeWindows: ["上午至下午"], duration: "1–2 小时", themeTags: ["beach", "snorkeling", "koh-lipe"] },
  { id: "poi-lipe-north-point", name: "North Point / Spit Beach", name_zh: "拖尾沙滩 / 北角（丽贝）", city: "Koh Lipe", area: "North Point", category: "nature", priority: "preferred", coords: [6.4975, 99.295], note: "落潮时出现拖尾沙滩，日落前光线极美。", plan: "D7 傍晚从日出沙滩步行前往，看拖尾与日落。", tip: "涨落潮时间决定能否走上海滩尖，出发前问酒店。", source: "src-koh-lipe-beaches", mapUrl: "https://www.google.com/maps/search/?api=1&query=North+Point+Koh+Lipe", imageQuery: "Koh Lipe North Point sand spit", contentTier: "standard", whyWorthIt: "北角的拖尾沙滩在退潮时向海中延伸，是丽贝最独特的机位，日落前走上去能拍到两侧海水夹着沙洲的画面。", detailSections: [ { title: "现场动作", items: ["按退潮时间步行到沙洲尽头，拍两侧海水的拖尾", "日落前回到岸边高处等最后一缕光"] } ], sourceIds: ["src-koh-lipe-beaches"], timeWindows: ["退潮时"], duration: "1 小时", themeTags: ["beach", "sunset", "koh-lipe"] },
  { id: "poi-nee-papaya", name: "Nee Papaya Thaifood & BBQ", name_zh: "Nee Papaya 泰餐烧烤（丽贝）", city: "Koh Lipe", area: "Walking Street / Sunrise end", category: "food", priority: "preferred", coords: [6.492, 99.302], note: "步行街尽头的泰餐+烧烤，口味地道。", plan: "D7 晚上浮潜日之后来吃，青木瓜沙拉与烧烤是招牌。", tip: "325 Walking St，近日出沙滩端；淡季营业到岛确认。", source: "src-nee-papaya", mapUrl: "https://www.google.com/maps/search/?api=1&query=Nee+Papaya+Koh+Lipe", imageQuery: "Nee Papaya Koh Lipe", mealRole: "local-classic", contentTier: "standard", whyWorthIt: "Nee Papaya 在步行街尽头靠近日出沙滩，泰餐与 BBQ 口味地道、价格实惠，是岛上吃一整顿泰式晚餐的可靠选择。", detailSections: [ { title: "怎么点", items: ["点青木瓜沙拉、烤鸡与泰式炒粉，辣度说明清楚", "配一瓶本地啤酒，饭后沿海滩散步回酒店"] } ], sourceIds: ["src-nee-papaya"], timeWindows: ["晚餐"], duration: "1 小时", themeTags: ["food", "koh-lipe"] },
  { id: "poi-nimman-avenue", name: "Nimmanhaemin Road", name_zh: "宁曼路", city: "Chiang Mai", area: "Nimman", category: "spot", priority: "preferred", coords: [18.7995, 98.9695], note: "清迈生活方式街区，咖啡、餐厅与设计小店密集。", plan: "D9 晚上回清迈第一顿与散步；也是第二段每天的活动主轴。", tip: "从 Bed Changkian 步行约 1 公里或打车 5 分钟。", source: "src-cnx-airport", mapUrl: "https://www.google.com/maps/search/?api=1&query=Nimmanhaemin+Road+Chiang+Mai", imageQuery: "Nimmanhaemin Road Chiang Mai", contentTier: "standard", whyWorthIt: "宁曼路集中了清迈最好的咖啡、泰北餐厅与设计店铺，第二段 4 晚都围绕它活动，回程第一顿在这里吃最放松。", detailSections: [ { title: "怎么逛", items: ["在宁曼路挑一家顺眼的泰餐解决晚餐，比如 Khao Soi Nimman", "饭后沿 Soi 1–9 散步看设计小店与街头装置"] } ], sourceIds: ["src-cnx-airport"], timeWindows: ["傍晚至夜间"], duration: "2 小时", themeTags: ["nimman", "food", "walk"] },
  { id: "poi-enp", name: "Elephant Nature Park", name_zh: "大象自然公园（公益象园）", city: "Chiang Mai", area: "Mae Taeng", category: "nature", priority: "preferred", coords: [19.24, 98.95], note: "不骑象、不表演的公益大象庇护所。", plan: "D10 上午半天团（约 07:00 出发、13:00 前后回），含接送与素食午餐。", tip: "提前在官网预订；穿长裤与水鞋，带换洗衣服。", source: "src-enp", bookingUrl: "https://elephantnaturepark.org/book-now/", mapUrl: "https://www.google.com/maps/search/?api=1&query=Elephant+Nature+Park+Chiang+Mai", imageQuery: "Elephant Nature Park Chiang Mai elephants", contentTier: "deep", whyWorthIt: "大象自然公园是清迈最负盛名的公益象园，救护超过百头大象、全程不骑象不表演，半天行程含接送与素食午餐，是了解大象保护最直接的方式。", detailSections: [ { title: "行程要点", items: ["07:00 在酒店等接驳车，路上听向导介绍每头象的故事", "给大象喂食、看它们洗澡，全程保持安静不追赶", "中午吃园区素食午餐，13:00 前后乘车返回酒店"] }, { title: "预订提示", items: ["至少提前 3 天在官网预订半天上午团并确认接送点", "穿旧衣服与防滑鞋，带防晒与驱蚊液"] } ], sourceIds: ["src-enp"], timeWindows: ["半天上午 07:00–13:00"], duration: "半天", reservation: "必须预订", themeTags: ["elephant", "nature", "half-day"] },
  { id: "poi-warm-up", name: "Warm Up Cafe", name_zh: "Warm Up 现场音乐酒吧（宁曼）", city: "Chiang Mai", area: "Nimman", category: "bar", priority: "preferred", coords: [18.8018, 98.9698], note: "宁曼老牌现场乐队+DJ 酒吧。", plan: "D10 晚上大象日之后来放松，约 21:00 后热闹。", tip: "40 Nimmanhaemin Rd；约 19:00–次日 2:00；本地年轻人多。", source: "src-warm-up", mapUrl: "https://www.google.com/maps/search/?api=1&query=Warm+Up+Cafe+Chiang+Mai", imageQuery: "Warm Up Cafe Chiang Mai", contentTier: "standard", whyWorthIt: "Warm Up 是宁曼最有代表性的现场音乐酒吧，本地乐队翻唱与 DJ 轮番上阵、气氛松弛，是大象日之后不需要折腾的夜生活。", detailSections: [ { title: "现场动作", items: ["点一杯鸡尾酒或本地啤酒，在舞台前站位看乐队", "座位紧张时站吧台，听几首再换场"] } ], sourceIds: ["src-warm-up"], timeWindows: ["约 19:00–次日 2:00"], duration: "1–2 小时", themeTags: ["bar", "live-music", "night", "nimman"] },
  { id: "poi-poopoo-paper", name: "Elephant POOPOOPAPER Park", name_zh: "大象粑粑造纸公园", city: "Chiang Mai", area: "Mae Rim", category: "activity", priority: "preferred", coords: [18.946, 98.953], note: "把大象便便做成纸的环保体验园，可 DIY。", plan: "D11 上午约 09:00 到，1–2 小时游览+DIY，随后去黏黏瀑布。", tip: "约 09:00–17:00，门票约 150 泰铢；有中英文讲解；园区能闻能摸，没有异味。", source: "src-poopoo-paper", mapUrl: "https://www.google.com/maps/search/?api=1&query=Elephant+POOPOOPAPER+Park+Chiang+Mai", imageQuery: "Elephant PooPooPaper Park Chiang Mai", contentTier: "deep", whyWorthIt: "大象粑粑造纸公园把环保讲成一场有趣的动手课，从筛浆、晾晒到 DIY 笔记本全程可参与，湄林 30 分钟车程，是北线组合里最轻松的开场。", detailSections: [ { title: "现场动作", items: ["跟中英文导游走完整条造纸条线：筛浆、晒纸、压纸", "在 DIY 区做一本便便纸笔记本或书签，约 100–200 泰铢", "在礼品店买便便纸贺卡当伴手礼"] }, { title: "实用提示", items: ["跟着讲解走完整条线约 1 小时，中文团需问场次", "DIY 笔记本约 100–200 泰铢，成品当天可取"] } ], sourceIds: ["src-poopoo-paper"], timeWindows: ["09:00–17:00"], duration: "1–2 小时", themeTags: ["class", "eco", "mae-rim"] },
  { id: "poi-bua-tong", name: "Bua Tong Sticky Waterfall", name_zh: "黏黏瀑布（Bua Tong）", city: "Chiang Mai", area: "Mae Taeng", category: "nature", priority: "preferred", coords: [19.292, 98.884], note: "石灰岩不滑、可以攀爬的免费瀑布。", plan: "D11 下午 13:30–16:30 攀爬玩水，随后回城。", tip: "免费；约 08:30–16:30；必须穿防滑溯溪鞋，带换洗衣物；雷雨时不要攀爬。", source: "src-bua-tong", mapUrl: "https://www.google.com/maps/search/?api=1&query=Bua+Tong+Sticky+Waterfall+Chiang+Mai", imageQuery: "Bua Tong Sticky Waterfall Chiang Mai", contentTier: "deep", whyWorthIt: "黏黏瀑布的石灰岩表面不湿滑，可以像蜘蛛侠一样徒手往上爬，水清凉、免费开放，是清迈周边最解压的玩水点。", detailSections: [ { title: "玩水要点", items: ["从最下层开始往上攀，手脚并用沿水流方向走", "在中间潭子泡水休息，注意岩石边缘别踩空", "带溯溪鞋与换洗衣物，结束到停车场厕所换装"] }, { title: "安全提示", items: ["雷雨或上游涨水时停止攀爬", "手机相机用防水袋，贵重物品留在车里"] } ], sourceIds: ["src-bua-tong"], timeWindows: ["08:30–16:30"], duration: "2–3 小时", hardConstraints: ["雷雨停止攀爬"], themeTags: ["nature", "waterfall", "mae-taeng"] },
  { id: "poi-baan-kang-wat", name: "Baan Kang Wat", name_zh: "班康瓦艺术村", city: "Chiang Mai", area: "Suthep / Wat Umong", category: "spot", priority: "preferred", coords: [18.7846, 98.9645], note: "艺术手作村落，陶瓷、木工与咖啡。", plan: "D12 上午 10:00 开门即到，逛工作室与咖啡。", tip: "周二–周日 10:00–18:00，周一闭馆；免费入场。", source: "src-baan-kang-wat", mapUrl: "https://www.google.com/maps/search/?api=1&query=Baan+Kang+Wat+Chiang+Mai", imageQuery: "Baan Kang Wat Chiang Mai art village", contentTier: "standard", whyWorthIt: "班康瓦是围绕寺庙建立的艺术家村，陶艺、木工与咖啡店分布在庭院里，安静好逛，是最后一站买手信与歇脚的理想场所。", detailSections: [ { title: "怎么逛", items: ["从 10:00 开门逛起，先在咖啡店坐下看村落布局", "在陶艺与布艺工作室选一件手作，现场可看匠人制作"] } ], sourceIds: ["src-baan-kang-wat"], timeWindows: ["周二–周日 10:00–18:00"], duration: "1.5 小时", themeTags: ["art", "handicraft", "suthep"] },
  { id: "poi-warorot", name: "Warorot Market (Kad Luang)", name_zh: "瓦洛洛市场", city: "Chiang Mai", area: "Chang Moi / Ping River", category: "market", priority: "preferred", coords: [18.7895, 98.9987], note: "清迈最大的本地日市，干果、药膏与泰北小吃。", plan: "D12 下午从班康瓦回来逛，集中买手信。", tip: "每日约 04:00–18:00（部分到 22:00）；现金为主，干果可试吃。", source: "src-warorot", mapUrl: "https://www.google.com/maps/search/?api=1&query=Warorot+Market+Chiang+Mai", imageQuery: "Warorot Market Chiang Mai", contentTier: "standard", whyWorthIt: "瓦洛洛是清迈本地人最常去的日市，干果、草药膏、泰北香肠与布制品一应俱全，价格比游客店实在，适合做最后的伴手礼采购。", detailSections: [ { title: "怎么买", items: ["在干果摊试吃后按袋买芒果干与龙眼干", "买几罐青草膏与香茅精油，药妆摊可还价", "顺路买泰北香肠与炸猪皮当路上零食"] } ], sourceIds: ["src-warorot"], timeWindows: ["每日 04:00–18:00 左右"], duration: "1–1.5 小时", themeTags: ["market", "shopping", "souvenir"] },
  { id: "poi-grand-canyon", name: "Grand Canyon Water Park", name_zh: "大峡谷水上乐园（可选）", city: "Chiang Mai", area: "Hang Dong", category: "nature", priority: "nearby", coords: [18.7206, 98.9075], note: "由废弃采石场改造的水上乐园，可游泳玩水。", plan: "游泳的升级选项：可替换 D10 下午或 D12 上午。", tip: "约 09:00–18:00；水乐园成人约 650–950 泰铢、自然区约 100 泰铢，以现场为准；必须穿救生衣。", source: "src-grand-canyon", mapUrl: "https://www.google.com/maps/search/?api=1&query=Grand+Canyon+Water+Park+Chiang+Mai", imageQuery: "Grand Canyon Water Park Chiang Mai", contentTier: "compact", themeTags: ["water", "swim", "optional"] },
  { id: "poi-doi-suthep", name: "Wat Phra That Doi Suthep", name_zh: "双龙寺 / 素贴山（备选）", city: "Chiang Mai", area: "Doi Suthep", category: "sight", priority: "nearby", coords: [18.8049, 98.9217], note: "素贴山顶金塔，天气好时可替换 D12 上午。", plan: "仅作天气好的备选；下雨起雾看不到全景就放弃。", tip: "需盖肩过膝着装；门票 30 泰铢，上下山约 40 分钟。", source: "src-doi-suthep", mapUrl: "https://www.google.com/maps/search/?api=1&query=Wat+Phra+That+Doi+Suthep", imageQuery: "Wat Phra That Doi Suthep golden chedi", contentTier: "compact", themeTags: ["temple", "mountain", "backup"] },
  { id: "poi-chiangmai-farewell", name: "Farewell Dinner (Old City / Nimman)", name_zh: "告别晚餐（古城或宁曼）", city: "Chiang Mai", area: "Old City / Nimman", category: "food", priority: "nearby", coords: [18.7912, 98.9916], note: "最后一晚的环境好餐厅，可让酒店推荐或平台搜评分。", plan: "D12 晚上收尾餐；参考 The House by Ginger / 河畔餐厅。", tip: "出发前在平台按评分与图片挑一家顺眼的环境餐厅。", source: "src-house-by-ginger", mapUrl: "https://www.google.com/maps/search/?api=1&query=Chiang+Mai+farewell+dinner", imageQuery: "Chiang Mai riverside dinner", mealRole: "formal-dinner", contentTier: "compact", themeTags: ["food", "farewell"] }
];
// ---------- 行程 ----------
const ITINERARY = [
  {
    id: "day-0", date: "2026-09-24", title: "上海 → 昆明 · 机场过夜", city: "Kunming",
    summary: "浦东 14:00 起飞，18:55 到昆明长水；入住机场周边中转酒店，为第二天早班机留足余量。",
    anchors: ["poi-kmg-airport"],
    routeStops: [
      { poiId: "poi-kmg-airport", order: 1, time: "18:55", role: "transit" }
    ],
    candidates: ["poi-kmg-transit-hotel"],
    transitSegments: []
  },
  {
    id: "day-1", date: "2026-09-25", title: "抵达清迈 · 古城轻开局", city: "Chiang Mai",
    summary: "09:15 落地清迈，寄存行李后在塔佩门与柴迪隆寺慢慢走，晚上用一顿花园创意泰餐开场。",
    anchors: ["poi-thapae-twins", "poi-wat-chedi-luang", "poi-house-by-ginger"],
    routeStops: [
      { poiId: "poi-cnx-airport", order: 1, time: "09:15", role: "arrival" },
      { poiId: "poi-thapae-twins", order: 0, time: "15:00", role: "lodging-anchor" },
      { poiId: "poi-tha-phae-gate", order: 2, time: "15:30", role: "landmark" },
      { poiId: "poi-wat-chedi-luang", order: 3, time: "16:30", role: "landmark" },
      { poiId: "poi-house-by-ginger", order: 4, time: "18:30", role: "dinner" }
    ],
    candidates: [],
    transitSegments: [
      { fromPoiId: "poi-cnx-airport", toPoiId: "poi-thapae-twins", mode: "Grab/出租车", minutes: 25, label: "机场到古城塔佩门一带约 20–25 分钟" },
      { fromPoiId: "poi-thapae-twins", toPoiId: "poi-tha-phae-gate", mode: "步行", minutes: 5, label: "酒店就在塔佩门旁，寄存行李后步行即到" },
      { fromPoiId: "poi-tha-phae-gate", toPoiId: "poi-wat-chedi-luang", mode: "步行", minutes: 15, label: "沿 Ratchadamnoen 路向西直走约 1 公里" },
      { fromPoiId: "poi-wat-chedi-luang", toPoiId: "poi-house-by-ginger", mode: "步行", minutes: 12, label: "往东北方向穿古城到 Moon Muang 路" }
    ]
  },
  {
    id: "day-2", date: "2026-09-26", title: "市集日 · JJ 早市 + 银庙周六夜市", city: "Chiang Mai",
    summary: "上午去清迈最大的周末创意市集，中午吃咖喱面，下午回酒店休息，傍晚在银庙与 Wualai 夜市结束。",
    anchors: ["poi-jing-jai", "poi-wat-srisuphan", "poi-wualai-walking-street"],
    routeStops: [
      { poiId: "poi-thapae-twins", order: 0, time: "08:30", role: "lodging-anchor" },
      { poiId: "poi-jing-jai", order: 1, time: "09:00", role: "market" },
      { poiId: "poi-khao-soi-khun-yai", order: 2, time: "12:30", role: "lunch" },
      { poiId: "poi-wat-srisuphan", order: 3, time: "17:00", role: "landmark" },
      { poiId: "poi-wualai-walking-street", order: 4, time: "17:30", role: "night-market" }
    ],
    candidates: [],
    transitSegments: [
      { fromPoiId: "poi-thapae-twins", toPoiId: "poi-jing-jai", mode: "Grab", minutes: 15, label: "古城到 JJ 市集约 15 分钟车程" },
      { fromPoiId: "poi-jing-jai", toPoiId: "poi-khao-soi-khun-yai", mode: "Grab", minutes: 15, label: "市集到 Sri Poom 一带约 15 分钟" },
      { fromPoiId: "poi-khao-soi-khun-yai", toPoiId: "poi-wat-srisuphan", mode: "Grab", minutes: 15, label: "午餐后先回酒店午休，16:30 再打车到 Wualai 银庙" },
      { fromPoiId: "poi-wat-srisuphan", toPoiId: "poi-wualai-walking-street", mode: "步行", minutes: 5, label: "夜市就在银庙门前的 Wualai 路上" }
    ]
  },
  {
    id: "day-3", date: "2026-09-27", title: "身心慢日 · 瑜伽 + 中古店 + 周日夜市", city: "Chiang Mai",
    summary: "上午一节古城瑜伽，中午米其林烤鸡，下午逛二手古着，傍晚周日夜市，夜里去北门听爵士。",
    anchors: ["poi-wild-rose-yoga", "poi-sunday-walking-street", "poi-north-gate-jazz"],
    routeStops: [
      { poiId: "poi-thapae-twins", order: 0, time: "09:00", role: "lodging-anchor" },
      { poiId: "poi-wild-rose-yoga", order: 1, time: "09:30", role: "class" },
      { poiId: "poi-sp-chicken", order: 2, time: "12:00", role: "lunch" },
      { poiId: "poi-pm2-vintage", order: 3, time: "14:00", role: "shopping" },
      { poiId: "poi-sunday-walking-street", order: 4, time: "17:00", role: "night-market" },
      { poiId: "poi-north-gate-jazz", order: 5, time: "21:00", role: "night" }
    ],
    candidates: [],
    transitSegments: [
      { fromPoiId: "poi-thapae-twins", toPoiId: "poi-wild-rose-yoga", mode: "步行", minutes: 12, label: "沿 Phra Pok Klao 路步行约 10–12 分钟" },
      { fromPoiId: "poi-wild-rose-yoga", toPoiId: "poi-sp-chicken", mode: "Grab", minutes: 10, label: "古城东侧到西侧 Samlan 路约 10 分钟" },
      { fromPoiId: "poi-sp-chicken", toPoiId: "poi-pm2-vintage", mode: "Grab", minutes: 10, label: "到北区 Si Phum 的 Wiang Kaew 路约 10 分钟" },
      { fromPoiId: "poi-pm2-vintage", toPoiId: "poi-sunday-walking-street", mode: "步行", minutes: 15, label: "向南走到 Ratchadamnoen 主街" },
      { fromPoiId: "poi-sunday-walking-street", toPoiId: "poi-north-gate-jazz", mode: "步行", minutes: 15, label: "沿主街向北走到北门附近" }
    ]
  },
  {
    id: "day-4", date: "2026-09-28", title: "兴趣班日 · 泰餐课 + 复古市集 + 拉丁舞", city: "Chiang Mai",
    summary: "上午上一堂完整的泰餐课，下午歇脚，傍晚逛 One Nimman 复古市集，晚上去学 Bachata/Salsa。",
    anchors: ["poi-mama-noi", "poi-one-nimman", "poi-bailamos"],
    routeStops: [
      { poiId: "poi-thapae-twins", order: 0, time: "08:30", role: "lodging-anchor" },
      { poiId: "poi-mama-noi", order: 1, time: "09:00", role: "class" },
      { poiId: "poi-one-nimman", order: 2, time: "17:00", role: "market" },
      { poiId: "poi-fairy-garden", order: 3, time: "18:00", role: "shopping" },
      { poiId: "poi-bailamos", order: 4, time: "19:30", role: "class" }
    ],
    candidates: [],
    transitSegments: [
      { fromPoiId: "poi-thapae-twins", toPoiId: "poi-mama-noi", mode: "学校接送车", minutes: 30, label: "上午班 09:00–09:30 酒店接人" },
      { fromPoiId: "poi-mama-noi", toPoiId: "poi-one-nimman", mode: "学校送回+打车", minutes: 30, label: "约 13:30–14:30 送回酒店休息，17:00 打车到宁曼一号" },
      { fromPoiId: "poi-one-nimman", toPoiId: "poi-fairy-garden", mode: "步行", minutes: 10, label: "同属宁曼街区，步行可达" },
      { fromPoiId: "poi-fairy-garden", toPoiId: "poi-bailamos", mode: "Grab", minutes: 10, label: "按工作室确认地址打车前往" }
    ]
  },
  {
    id: "day-5", date: "2026-09-29", title: "转场合艾 · 夜市之夜", city: "Hat Yai",
    summary: "上午退房飞合艾，下午入住安纳琳，傍晚逛 Kim Yong 市场，晚上在 ASEAN 夜市吃海鲜烧烤。",
    anchors: ["poi-analynn", "poi-kim-yong", "poi-asean-bazaar"],
    routeStops: [
      { poiId: "poi-thapae-twins", order: 0, time: "08:30", role: "lodging-anchor" },
      { poiId: "poi-cnx-airport", order: 1, time: "10:00", role: "flight" },
      { poiId: "poi-hdy-airport", order: 2, time: "13:30", role: "flight" },
      { poiId: "poi-analynn", order: 0, time: "15:00", role: "lodging-anchor" },
      { poiId: "poi-kim-yong", order: 3, time: "16:30", role: "market" },
      { poiId: "poi-asean-bazaar", order: 4, time: "18:30", role: "dinner" }
    ],
    candidates: [],
    transitSegments: [
      { fromPoiId: "poi-thapae-twins", toPoiId: "poi-cnx-airport", mode: "Grab/出租车", minutes: 25, label: "09:30 前从酒店出发去清迈机场" },
      { fromPoiId: "poi-cnx-airport", toPoiId: "poi-hdy-airport", mode: "飞机 FD157", minutes: 120, label: "11:25 起飞、13:30 落地合艾" },
      { fromPoiId: "poi-hdy-airport", toPoiId: "poi-analynn", mode: "出租车", minutes: 35, label: "机场到市区酒店约 30–40 分钟" },
      { fromPoiId: "poi-analynn", toPoiId: "poi-kim-yong", mode: "步行", minutes: 10, label: "酒店在 Vongvanit 路，步行可达市场" },
      { fromPoiId: "poi-kim-yong", toPoiId: "poi-asean-bazaar", mode: "步行", minutes: 15, label: "傍晚步行去夜市" }
    ]
  },
  {
    id: "day-6", date: "2026-09-30", title: "上岛 · 丽贝日落", city: "Koh Lipe",
    summary: "上午车船联程上岛，下午入住十月夕阳别墅，傍晚在日落沙滩等日落，晚上步行街吃海鲜。",
    anchors: ["poi-ten-moons", "poi-lipe-sunset-beach", "poi-rak-lay"],
    routeStops: [
      { poiId: "poi-analynn", order: 0, time: "07:30", role: "lodging-anchor" },
      { poiId: "poi-pakbara-pier", order: 1, time: "09:30", role: "transfer" },
      { poiId: "poi-ten-moons", order: 0, time: "14:00", role: "lodging-anchor" },
      { poiId: "poi-lipe-sunset-beach", order: 2, time: "17:30", role: "sunset" },
      { poiId: "poi-rak-lay", order: 3, time: "19:00", role: "dinner" }
    ],
    candidates: [],
    transitSegments: [
      { fromPoiId: "poi-analynn", toPoiId: "poi-pakbara-pier", mode: "面包车/包车", minutes: 120, label: "合艾到 Pak Bara 码头约 2 小时" },
      { fromPoiId: "poi-pakbara-pier", toPoiId: "poi-ten-moons", mode: "快艇+岛内接驳", minutes: 120, label: "快艇约 1.5–2 小时，低季可能改日出沙滩上下船" },
      { fromPoiId: "poi-ten-moons", toPoiId: "poi-lipe-sunset-beach", mode: "步行", minutes: 5, label: "别墅就在日落沙滩边" },
      { fromPoiId: "poi-lipe-sunset-beach", toPoiId: "poi-rak-lay", mode: "步行", minutes: 15, label: "穿过沙滩到步行街中段" }
    ]
  },
  {
    id: "day-7", date: "2026-10-01", title: "灵活出海日 · 看海况决定浮潜", city: "Koh Lipe",
    summary: "早上问海况：能出海就近岸包船浮潜，不能就在日出沙滩与拖尾沙滩慢玩；晚上步行街泰餐。",
    anchors: ["poi-lipe-snorkel", "poi-lipe-sunrise-beach"],
    routeStops: [
      { poiId: "poi-ten-moons", order: 0, time: "08:30", role: "lodging-anchor" },
      { poiId: "poi-lipe-snorkel", order: 1, time: "09:00", role: "activity" },
      { poiId: "poi-lipe-sunrise-beach", order: 2, time: "14:00", role: "beach" },
      { poiId: "poi-lipe-north-point", order: 3, time: "16:30", role: "sunset" },
      { poiId: "poi-nee-papaya", order: 4, time: "19:00", role: "dinner" }
    ],
    candidates: [],
    transitSegments: [
      { fromPoiId: "poi-ten-moons", toPoiId: "poi-lipe-snorkel", mode: "包船/长尾船", minutes: 30, label: "视海况决定是否出海与出海范围" },
      { fromPoiId: "poi-lipe-snorkel", toPoiId: "poi-lipe-sunrise-beach", mode: "长尾船/步行", minutes: 30, label: "浮潜结束后回到日出沙滩休整" },
      { fromPoiId: "poi-lipe-sunrise-beach", toPoiId: "poi-lipe-north-point", mode: "步行", minutes: 20, label: "沿海岸线往北走到拖尾沙滩" },
      { fromPoiId: "poi-lipe-north-point", toPoiId: "poi-nee-papaya", mode: "步行", minutes: 15, label: "往步行街方向走，餐厅在街尾靠近日出沙滩端" }
    ]
  },
  {
    id: "day-8", date: "2026-10-02", title: "离岛 · 合艾休整", city: "Hat Yai",
    summary: "上午快艇返程，下午入住 Z Sleep，傍晚逛 Central Festival，晚上在周五最热闹的 ASEAN 夜市收尾。",
    anchors: ["poi-z-sleep", "poi-central-festival", "poi-asean-bazaar"],
    routeStops: [
      { poiId: "poi-ten-moons", order: 0, time: "07:30", role: "lodging-anchor" },
      { poiId: "poi-pakbara-pier", order: 1, time: "10:30", role: "transfer" },
      { poiId: "poi-z-sleep", order: 0, time: "15:00", role: "lodging-anchor" },
      { poiId: "poi-central-festival", order: 2, time: "16:30", role: "shopping" },
      { poiId: "poi-asean-bazaar", order: 3, time: "18:30", role: "dinner" }
    ],
    candidates: [],
    transitSegments: [
      { fromPoiId: "poi-ten-moons", toPoiId: "poi-pakbara-pier", mode: "快艇", minutes: 120, label: "上午快艇回 Pak Bara，提前一晚与酒店确认船班" },
      { fromPoiId: "poi-pakbara-pier", toPoiId: "poi-z-sleep", mode: "面包车/包车", minutes: 120, label: "码头回合艾市区约 2 小时" },
      { fromPoiId: "poi-z-sleep", toPoiId: "poi-central-festival", mode: "步行", minutes: 5, label: "酒店紧邻 Central Festival" },
      { fromPoiId: "poi-central-festival", toPoiId: "poi-asean-bazaar", mode: "Grab", minutes: 10, label: "商场到夜市约 10 分钟" }
    ]
  },
  {
    id: "day-9", date: "2026-10-03", title: "回清迈 · 宁曼之夜", city: "Chiang Mai",
    summary: "下午飞回清迈，入住 Bed Changkian，晚上在宁曼路吃第一顿并散步。",
    anchors: ["poi-bed-changkian", "poi-nimman-avenue"],
    routeStops: [
      { poiId: "poi-z-sleep", order: 0, time: "10:00", role: "lodging-anchor" },
      { poiId: "poi-hdy-airport", order: 1, time: "12:00", role: "flight" },
      { poiId: "poi-cnx-airport", order: 2, time: "16:00", role: "flight" },
      { poiId: "poi-bed-changkian", order: 0, time: "16:30", role: "lodging-anchor" },
      { poiId: "poi-nimman-avenue", order: 3, time: "18:30", role: "dinner-walk" }
    ],
    candidates: [],
    transitSegments: [
      { fromPoiId: "poi-z-sleep", toPoiId: "poi-hdy-airport", mode: "出租车", minutes: 30, label: "12:00 前从酒店出发去合艾机场" },
      { fromPoiId: "poi-hdy-airport", toPoiId: "poi-cnx-airport", mode: "飞机 FD158", minutes: 120, label: "14:00 起飞、16:00 落地清迈" },
      { fromPoiId: "poi-cnx-airport", toPoiId: "poi-bed-changkian", mode: "Grab", minutes: 25, label: "机场到 Chang Phueak 酒店约 20–25 分钟" },
      { fromPoiId: "poi-bed-changkian", toPoiId: "poi-nimman-avenue", mode: "步行/Grab", minutes: 10, label: "酒店距宁曼路约 1 公里，可步行或打车" }
    ]
  },
  {
    id: "day-10", date: "2026-10-04", title: "大象日 · 公益象园半天", city: "Chiang Mai",
    summary: "上午去大象自然公园喂食看洗澡，下午回酒店泳池休息，晚上去宁曼听现场乐队。",
    anchors: ["poi-enp", "poi-warm-up"],
    routeStops: [
      { poiId: "poi-bed-changkian", order: 0, time: "06:45", role: "lodging-anchor" },
      { poiId: "poi-enp", order: 1, time: "07:00", role: "activity" },
      { poiId: "poi-warm-up", order: 2, time: "20:00", role: "night" }
    ],
    candidates: ["poi-sunday-walking-street"],
    transitSegments: [
      { fromPoiId: "poi-bed-changkian", toPoiId: "poi-enp", mode: "园区接驳车", minutes: 60, label: "半天上午团约 07:00 酒店接人，车程约 1 小时" },
      { fromPoiId: "poi-enp", toPoiId: "poi-warm-up", mode: "接驳车+Grab", minutes: 70, label: "约 13:00 送回酒店休息，20:00 打车到宁曼 Warm Up" }
    ]
  },
  {
    id: "day-11", date: "2026-10-05", title: "北线自然 + 手作 · 大象粑粑造纸 & 黏黏瀑布", city: "Chiang Mai",
    summary: "上午在湄林体验大象粑粑造纸，下午去湄登爬黏黏瀑布，晚上可补一节拉丁舞。",
    anchors: ["poi-poopoo-paper", "poi-bua-tong"],
    routeStops: [
      { poiId: "poi-bed-changkian", order: 0, time: "08:30", role: "lodging-anchor" },
      { poiId: "poi-poopoo-paper", order: 1, time: "09:00", role: "class" },
      { poiId: "poi-bua-tong", order: 2, time: "13:30", role: "nature" }
    ],
    candidates: ["poi-bailamos"],
    transitSegments: [
      { fromPoiId: "poi-bed-changkian", toPoiId: "poi-poopoo-paper", mode: "包车", minutes: 40, label: "市区到湄林造纸园约 30–40 分钟" },
      { fromPoiId: "poi-poopoo-paper", toPoiId: "poi-bua-tong", mode: "包车", minutes: 40, label: "湄林到湄登黏黏瀑布约 40 分钟" },
    ]
  },
  {
    id: "day-12", date: "2026-10-06", title: "艺术村 + 手信收尾", city: "Chiang Mai",
    summary: "上午逛班康瓦艺术村，下午在瓦洛洛市场集中买手信，晚上吃告别餐（可选按摩）。",
    anchors: ["poi-baan-kang-wat", "poi-warorot"],
    routeStops: [
      { poiId: "poi-bed-changkian", order: 0, time: "09:30", role: "lodging-anchor" },
      { poiId: "poi-baan-kang-wat", order: 1, time: "10:00", role: "art-village" },
      { poiId: "poi-warorot", order: 2, time: "14:30", role: "market" }
    ],
    candidates: ["poi-chiangmai-farewell", "poi-grand-canyon", "poi-doi-suthep"],
    transitSegments: [
      { fromPoiId: "poi-bed-changkian", toPoiId: "poi-baan-kang-wat", mode: "Grab", minutes: 15, label: "Chang Phueak 到 Suthep 艺术村约 15 分钟" },
      { fromPoiId: "poi-baan-kang-wat", toPoiId: "poi-warorot", mode: "Grab", minutes: 20, label: "艺术村到古城东侧瓦洛洛约 20 分钟" },
    ]
  },
  {
    id: "day-13", date: "2026-10-07", title: "返程 · 清迈 → 昆明 → 上海", city: "Chiang Mai",
    summary: "10:05 清迈起飞，13:00 到昆明，16:00 转上海虹桥，18:55 落地。",
    anchors: [],
    routeStops: [
      { poiId: "poi-bed-changkian", order: 0, time: "07:30", role: "lodging-anchor" },
      { poiId: "poi-cnx-airport", order: 1, time: "08:30", role: "flight" },
      { poiId: "poi-kmg-airport", order: 2, time: "13:00", role: "transit" }
    ],
    candidates: [],
    transitSegments: [
      { fromPoiId: "poi-bed-changkian", toPoiId: "poi-cnx-airport", mode: "Grab/出租车", minutes: 25, label: "08:00 前出发，10:05 起飞前 2 小时到机场" },
      { fromPoiId: "poi-cnx-airport", toPoiId: "poi-kmg-airport", mode: "飞机 MU9640", minutes: 180, label: "10:05 起飞、13:00 落地昆明；16:00 转 FM9454" }
    ]
  }
];

fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "sources.json"), JSON.stringify(SOURCES, null, 2) + "\n");
fs.writeFileSync(path.join(dataDir, "pois.json"), JSON.stringify(POIS, null, 2) + "\n");
fs.writeFileSync(path.join(dataDir, "itinerary.json"), JSON.stringify(ITINERARY, null, 2) + "\n");
console.log("data written:", SOURCES.length, "sources,", POIS.length, "pois,", ITINERARY.length, "days");