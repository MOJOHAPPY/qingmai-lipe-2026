# 旅行攻略工作区 AGENTS.md

## 工作区定位

这个工作区用于沉淀不同目的地的旅行设计、地点候选、每日路线、酒店与餐饮判断、资料复核记录和交互地图。

默认原则：流程共用，攻略独立；先理解旅行，再找地点和排路线；地图可以继续调整，交付后仍能重新安排。

## 规则优先级

- 先遵循用户当前明确要求，再遵循离目标文件最近的 `AGENTS.md`，然后使用 `interactive-trip-planner` skill。
- 开始非简单旅行规划、地图制作或资料扩充前，先读当前攻略的 `README.md`、`docs/`、`data/`、`maps/` 和线上逻辑文档。
- 不用旧聊天印象或旧总结代替当前文件、当前数据和最新来源。
- 不覆盖用户或其他 Agent 已有改动。

## 沟通和语言

- 对话、攻略和地图默认跟随用户当前主要对话语言；用户明确指定语言时，以明确要求为准。
- 有通行译名的国家、城市、区域和著名景点优先使用用户语言，首次出现补地点原名，后续使用译名。
- 所有给旅行者看的内容使用自然语言，不显示数据结构和开发术语。
- 重要结论区分：事实、推断、建议。
- 只立即询问会改变路线、安全、预算或可执行性的未知信息；其他细节按阶段后置。

## 六阶段完整流程

1. 理解并确认旅行方向：收集最小启动信息，输出旅行主线、行程段、取舍、酒店和吃饭逻辑，只做一次主确认。
2. 寻找适合用户的地点：按主题和角色搜索，使用官方、当地语言和体验来源，先发现再复核。
3. 规划每日行程：先排硬约束，每天 1-3 个主锚点，其他地点按自然动线和时间窗口安排。
4. 制作动态地图：完整攻略继承欧洲公开母版的基础交互，先替换内容，再做目的地视觉。
5. 让用户在地图中调整：支持加入、移出、优先级、同日顺序、撤销和修改汇总。
6. 根据反馈重新安排：重新检查营业、预约、交通、容量、酒店和吃饭，再更新正式路线与地图。

用户偏好已经明确时，直接归纳暂定主线；只有方向不明确时才提供 3-5 个真正会改变路线的主题候选。

## 地点候选和每日路线

- 地点池通常是正式路线预计使用量的 2-3 倍。
- 每个完整旅行日准备约 12-18 个可地图化地点；抵达、离开或纯移动日准备 6-10 个低强度候选。
- 数量同时满足分类覆盖，不能只有景点而没有正餐、小吃、咖啡甜品、当地生活、夜间和风险替代。
- 每天正式路线只有 1-3 个主锚点，并至少保留一套同方向、同角色或低体力替代路线。
- 候选不要求全部在同一街区，但必须顺着步行方向、交通轴线、驾驶顺序或时间窗口，避免为普通地点折返。
- 酒店是出发、回程、休息、行李和夜间安全锚点；吃饭和休息进入真实路线，不作为备注。
- 跨城移动日保持低强度；深夜路线控制安全半径。

## 资料来源

- 节庆、活动、营业时间、闭馆、票务、预约、交通、价格、签证/入境、安全、天气和海况必须复核当前来源。
- 来源冲突时优先官方、主办方、场地方、交通运营方和官方票务，再看专业媒体、地图、订位平台和社区体验。
- 小红书、抖音、Instagram、Reddit 等只用于体验、排队、拍照、点单和近期风险线索，不能作为唯一事实来源。
- 用户主动导入的小红书收藏夹或单篇笔记保存在 `travel-library/xiaohongshu/`，默认不进 Git；只把用户允许公开引用的规范化 URL 和简短支持范围写入攻略来源。
- 搜索摘要和 AI 摘要不能作为最终证据；必须打开支持结论的具体页面。
- 记录来源、检查日期、支持的事实和重新复核时间。

## 地图基础交互

- 完整攻略默认使用 `assets/guide-template-europe-public/`，复制整套地图目录后再替换旅行数据、语言、存储名称、来源、链接和图片请求。
- 轻量模板只有在用户明确要求低保真原型或内部试验时使用，不作为完整攻略默认交付。
- 必须保留全程总览、连续日期、某一天的有序路线、顺路候选、其他日期弱化地点、统一地点详情、搜索和筛选。
- 必须保留必去、优先去、顺路可去、留档、待复核和已预约等自然语言状态。
- 必须支持加入、移出、调整优先级、同日顺序、撤销、高影响确认、修改汇总、“请 Codex 重新安排”和刷新恢复。
- 地图标记、每日路线和地点速查打开同一个完整详情，不重复多套完整弹窗或抽屉。
- 只有经过路网计算或人工复核的路径才能显示为正式路线；用户修改后不绘制推测路线。
- 基础交互通过后再调整配色、字体、标记、路线样式和目的地视觉。

## 推荐目录

```text
travel-library/
  xiaohongshu/
    INDEX.md
    collections/
    notes/
    imports/
    trips/
guides/<trip-slug>/
  README.md
  docs/
    design-language.md
    planning-principles.md
    hotels.md
    reservations.md
    sources.md
    online-logic/map.md
  data/
    design-tokens.json
    pois.json
    itinerary.json
    sources.json
  maps/
    itinerary-map.html
    assets/
```

跨目的地方法论放工作区 `docs/`；目的地判断、数据和地图放对应 `guides/<trip-slug>/`，不要把所有攻略堆进一个地图文件。
`travel-library/` 是跨旅行复用的私人资料库，必须加入工作区 `.gitignore`；攻略只使用经过用户选择和事实复核的派生结果。

## 验证

- 检查地点和每日路线数据可解析、引用存在、坐标与名称完整、没有重复地点。
- 运行 skill 提供的数据、地图和欧洲母版一致性校验。
- 在真实浏览器检查底图、地点、总览、日期切换、详情、搜索、加入/移出、优先级、撤销、修改汇总、刷新恢复和移动端。
- 检查地图语言、地点译名、用户可见文案和 console。
- 没有实际运行过的验证不得声称通过。

## 当前工作区补充

在这里记录只属于本地项目的用户偏好、当前攻略入口、特殊安全边界和维护约定。不要把私人信息、订单、真实班次或个人路径复制回公开 skill 模板。

## 当前工作区补充（本地项目）

- 当前攻略：`清迈丽贝·悠闲版攻略.md`（入口）、`清迈丽贝·悠闲版地图.html`（互动地图）、`预算-悠闲版.md`（预算）、`data/`（pois / itinerary / sources）、`scripts/`（build-data、build-map、verify-map）、`docs/online-logic/map.md`（地图线上逻辑）。
- 旅行硬信息（机票/酒店）来自 `酒店+住宿截图/` 订单截图，已用 OCR 提取并写入攻略「硬信息」表；如订单实付与预算估算不符，替换 `预算-悠闲版.md` 即可。
- 已确认偏好：清迈以兴趣班 + 市集/夜市/中古店 + 吃喝 + 乐队清吧为主，不赶景点；砍掉因他农山一日游，保留大象自然公园半天；舞蹈选拉丁社交舞（Bailamos，D4 晚，备用 D11 晚）；丽贝 10/1 跳岛「灵活出海」、不提前订死（国家公园岛 10 月关闭）。
- 私人资料库：`travel-library/xiaohongshu/` 只存匿名导入的小红书收藏夹内容（批次一：收藏夹一前 10/26 + 收藏夹二 4/4；批次二：补充合集 清迈2 7/7 + 清迈1 9/10，共 30 篇），不进入 Git，不外泄；第一批收藏夹一仍缺 16 篇、清迈1 缺 1 篇，等用户贴单篇链接后再补。
- 数据维护：改地点先改 `scripts/build-data.mjs`（或 `data/*.json`），运行 `node scripts/build-data.mjs` 生成 JSON，再运行 skill 的 `validate-trip-data.js`（--require-route-evidence --strict-routes）与 `node scripts/build-map.mjs` 重建地图，最后用 `node scripts/verify-map.mjs` 做浏览器验证。
- 本工作区在 E 盘、skill 在 C 盘，跨盘符时 skill 部分脚本（如 xhs 导入）会误判路径；跨盘符导入需先在 C 盘临时工作区导入再移动资料库。
## 单文件旅行助手 App（2026-08-18 新增）

- 入口：`清迈丽贝·旅行助手.html`（**真正单文件**：Leaflet JS/CSS 已内联、图片转 base64、数据内嵌，浏览器双击即用；仅地图瓦片需联网）。
- 功能：双模块「总览（倒计时/行前准备/航班/住宿/必买/路线卡片）+ 计划详情（14 个日签 + 时间轴 + 预约提醒 + 备选 POI + 地图）」；宽屏地图左内容右、竖屏地图上内容下、地图可折叠。
- 构建链：`scripts/patch-app-data.mjs`（幂等补丁：新增 POI/来源/动线/提醒，数据仍统一维护在 `data/*.json`）→ skill `validate-trip-data.js --require-route-evidence --strict-routes` → `node scripts/build-app.mjs`（模板 `scripts/app-template.html` + 内联资源 → 生成单文件）→ `node scripts/verify-app.mjs`（Edge headless 桌面+移动验证与截图）。
- 新 POI 含射击（D2 15:00，333 塔佩门店，提前≥1h）与 COTU 游泳私教（D10 15:00，邮件预约）；咖啡馆/餐厅备选均带 Google 评分或「高分」标注与导航链接，进入 `data/pois.json` 的 `reservation` 字段驱动预约提醒。
- 旧文件不覆盖：`清迈丽贝·悠闲版地图.html` / `build-map.mjs` 保持原状。
- 花费统计（2026-08-19）：`💰 花费` 模块在浏览器 localStorage（键 tripExpenses）记账，首次打开自动预填已确认/估算机酒 7 笔（合计约 ¥19,185，数据来自《预算-悠闲版.md》①+②）；支持公共/个人花销、人员必填、关联行程、导出/导入 JSON；数据不进 Git。
- 可编辑功能（2026-08-19）：计划详情支持编辑模式（增/删/调序/改时间与类型），交通段与地图自动联动重算（新增/变更段标注「待复核」），每步可撤销、可恢复默认，localStorage 键 tripOverrides 持久化，日签与路线卡带「✏️ 已编辑」标记；总览清单（必买/行前准备）可增删，localStorage 键 tripListOverrides。
- 云端同步（2026-08-19）：接入 Firebase Realtime Database（项目 qingmai-lipe-2026，公开规则），房间号 localStorage 键 tripSyncMeta；三台手机填同一房间号即互通，行程/清单/花费约 20 秒内自动同步，以最后修改为准；列表键（含点号）上传时转码为 ~，下载时还原；右上角 ☁️ 按钮打开同步面板。
- 界面优化 v2（2026-08-19）：总览=成员另起一行、每卡片右上角独立编辑（添加框在列表顶部、减号删除、撤销/恢复默认）、待办可勾选、底部子模块导航；计划详情=添加地点卡片置顶（含目标日期+备注）、Google 搜索（需 GOOGLE_PLACES_KEY 配置，未配置时提示）、今日酒店附近高分推荐（本地 POI 按分类）、编辑支持改日期（自动移动到对应日）与备注、交通按编辑后行程动态展示；花费=只保留公共/成员/总合计、原位编辑、移除导入导出、新增实时汇率计算小工具。
- 地点搜索切换（2026-08-19）：Google 搜索改为「🗺️ 高德搜索」（Web服务 API，需 AMAP_WEB_KEY 配置；注意高德 POI 主要覆盖中国大陆，清迈可能搜不到）与「🌍 全球搜索」（OpenStreetMap Photon，无需 Key、全球可用、实测可搜到清迈地点）。搜索结果加入后生成运行时 POI（含名称/地址/坐标，评分与营业时间以地点池已核实卡片为准）。
- 移除高德 + 截图识别（2026-08-19）：高德搜索与高德底图全部移除（默认底图 Google，另有 Google 卫星/OSM）；添加地点页签为 地点池 / 全球搜索(OSM·Photon) / 截图识别(OCR)。截图识别用 Tesseract.js v5（jsdelivr CDN，chi_sim+eng，失败自动退 eng），识别后按行清洗过滤常见 UI 词取候选，点选名称 → Photon 反查 → 加入行程；评分/营业时间仅作截图参考。OCR 组件加载失败时提示改用全球搜索。

- Google 合集入库 + 路线重排（2026-08-21）：用户 Google 地图合集 53 个地点（18 必去）全部入库（新增 `poi-gm-*`，复用 `poi-jing-jai / poi-sunday-walking-street / poi-north-gate-jazz / poi-poopoo-paper / poi-bua-tong / poi-warorot / poi-333-shooting-thaphae` 原 id 并补字段），评分/营业时间/注意事项/游玩事项/预约方式经第三方来源复核并逐条标注（Google 域名本环境不可访问，统一以 Trip.com/官网/Time Out/Atlas Obscura/GoWabi 等 + 搜索摘要为准，`checkedAt: 2026-08-21`）。清迈段 D1–D4 / D9–D12 路线**严格按合集重排**（D1 先买化妆品/衣服；D9 从丽贝回清迈后集中逛市集；除酒店/机场外全部为合集地点），旧攻略锚点（泰餐课/瑜伽/拉丁舞/游泳/ENP/塔佩门/柴迪隆寺/银庙参观/Wualai 夜市等）全部移入各日备选；合艾/丽贝段合集无覆盖，维持原路线。预约提醒重写（TeeTee 提前约 20 天、Skyline 接送、333 提前 1h、Rong Sa Dang 周六课、Ekachan 订位、各按摩店 GoWabi 等）。
- 界面优化 v3（2026-08-21）：总览=分类导航移到成员下方、新增「🔔 预约提醒」独立卡片（每项可勾选、localStorage 键 tripReminderChecks、刷新不丢、ovNav 增加预约 chip）；计划详情=去掉「✏️ 已编辑」标识（保留撤销/恢复）、**移除截图识别（OCR）页签与 Tesseract CDN/函数**、全球搜索与地点池输入框统一为 `.f-row`+`.f-input` 样式、备选按地点类型分组、时间轴与备选卡显示评分/营业时间/游玩事项/「⭐ 必去」徽标；花费=修复原位编辑布局错位（`.exp-item` 加 `flex-wrap`、`.exp-inline` 改 `flex:1 1 100%`）。新增 `spa`（按摩）分类。
- 数据维护：合集数据唯一事实源为 `scripts/patch-app-data.mjs`（`collectionPois` 采用 upsert 幂等写入，`updatePois` 更新复用 id，另有一次迁移自动补缺失 source/plan）；**不要运行 `scripts/build-data.mjs`**（会覆盖补丁后的 data/*.json）。

- 路线重排 v2（2026-08-21）：按用户确认，大项目全部移到丽贝前——D2（周六）= Skyline 丛林飞跃 + 333 射击 + Rong Sa Dang 摇摆舞三连；D3（周日）= 南奔火车一日（清迈站→南奔约 09:30 发车、40 分钟、带护照现场购票、到站即买返程票 14:15）+ 晚上 MaHoRee；D4（周一）= 北线包车一日（TeeTee 大象营 + 大象粑粑造纸 + 黏黏瀑布 + 古树公园，司机按闭园时间优化），新增老虎园（Mae Rim，09:00–17:00、约 188 铢）+ 700年射击入 D4 备选。丽贝后集中逛集市：D9=抵达+Ekachan+6ixcret 变装秀；D10=丽贝后市集日（Bamboo 竹林市集 + Artisan 面包 + Nong Buak 公园 + 周日夜市，JJ 入备选）；D11=兰纳民居博物馆 + 静心湖 + Lanna Artisans 银器工坊 + One Nimman 复古市集；D12=瓦洛洛手信 + 芒果糯米 + 泰丝 + KINLARB 告别晚餐 + Bar.San.（Noir 备选）。酒吧每晚最多一个（D1 North Gate、D3 MaHoRee、D12 Bar.San.）；按摩改为约每两天就近备选（D2 Tok Sen、D9 Aiyaret、D11 Heng Heng/Retreat、D12 Muse/Retreat）。
- 预约提醒卡可编辑 + 云同步（2026-08-21）：预约提醒独立卡片去圆点、字体与其他卡片详情一致、只保留勾选框；支持卡片级编辑（顶部添加、逐条删除、勾选完成、撤销、恢复默认），localStorage 键 tripReminders（首次从行程 dayReminders 播种），并加入 Firebase 云同步 payload（blob.reminders，applyRemoteBlob 双向恢复）。
- 行前准备/注意事项/待办/必买已按新行程更新（build-app.mjs TRIP）：新增溯溪鞋/可弄脏速干衣/挂脖手机绳/环保购物袋，南奔火车订票、大象营/丛林飞跃/射击安全着装、酒吧低消等注意事项，待办含南奔火车票、TeeTee 提前 20 天、Skyline 接送、老虎园等；必买商店更新为 Win 化妆品/Chiang Mai Cosmetics/泰丝/银器 DIY/复古市集/瓦洛洛手信等。

- 地点位置修正（2026-08-21）：删除 Mae Ho Phra（用户确认）；按用户 Google 地图截图 OCR 定位——ApolloCafe = 南奔 18 Charoen Rat Rd（评分 4.7/136，移入 D3 南奔日备选）、Nicha 天然棉 = 清迈 56 Kuang Men Rd, Chang Moi（评分 4.7/31）、KINLARB CHIANG MAI = 宁曼 Sirimangkalajarn Rd（评分 4.9/89，标记必去）；Maha Larb CNX 保持备选。截图文件夹已加入 .gitignore。

- 行前准备拆分（2026-08-21）：行前准备拆成三张可独立编辑的卡片——🧳 必备行李 / 📋 注意事项 / ✅ 待办事项（各自 ✏️编辑/↩️撤销/🔄默认，localStorage tripListOverrides 键不变，待办勾选独立持久化）；总览导航「行前准备」指向必备行李卡。

- 新增路线地点（2026-08-24）：① Vintage 市集 The Market CNX（เท มาร์เก็ต CNX，清迈大学旁 Su Thep，Mapcarta 坐标 18.79423,98.9646）——用户说明来此主要是找一位像 LISA 的老板画海娜（Mehndi）；因公开营业日为周二–周四 17:00–22:00，从 D1（9/25 周五）移到 D12（10/6 周二，全行程唯一对得上营业日的日子）傍晚 17:00 作为普通一站（不改变 D12 主题/标题/主锚点），地点卡片保留海娜说明与护理提示（画完 2–6 小时不碰水，价格约 200–500 铢以现场为准）；D1 已回退为购物+晚餐+爵士原动线，并删除保险备选宁曼 Soi 6 周五夜市（poi-gm-nimman-soi6 及来源 src-gm-nimman-soi6 一并幂等移除）。② DARUMA JAPAN CHIANGMAI（Saraphi）无可靠公开信息，先以 poi-gm-daruma-japan（Saraphi 区级规划坐标 18.710,99.045，hours=待核）入 D3 南奔线备选，待用户补 Google 地图截图/地址后再升主路线。数据源：Trip.com 清迈市集攻略 / Mapcarta / chiangmailocator（checkedAt 2026-08-24）。
- 验证脚本增强（2026-08-24）：verify-app.mjs 增加 isExternalNet() 过滤——地图瓦片（mt*.google.com / googleapis / OSM）、Firebase（firebaseio.com）、Photon（photon.komoot.io）在沙箱/断网环境下失败属预期，不计为页面错误；并忽略 Chrome 通用 'Failed to load resource' console.error（由 requestfailed 带 URL 精确上报）。
- 地点类型修正（2026-08-24）：用户确认 Google 地图中文名「芒果糯米在對面」实为古城 Ratchadamnoen 路 Kad Klang Wiang 内的 Pranom 健康按摩（ประนอม นวดเพื่อสุขภาพ，泰式按摩），不是餐厅/甜品摊——poi-gm-mango-sticky 改为 category spa（坐标 18.78763,98.9899、每日 10:00–21:00、泰式 150 铢/时、足底 180、精油 300 参考价），保留 D12 11:30 站点并把 role 改为 spa；D12 摘要/交通段/提醒同步更新（原「告别按摩预约」提醒改为 Pranom 泰式 11:30）；build-app.mjs ROLES 新增 spa 角色（💆 按摩）；来源 src-gm-mango-sticky 更新为 Pranom 并新增 updateSources 幂等更新机制（checkedAt 2026-08-24，来源 taiguo.org / Mapcarta）。
