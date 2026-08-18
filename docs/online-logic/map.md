# 地图线上逻辑 · 清迈丽贝·悠闲版地图.html

> 只记录当前文件实际实现的行为，不写需求草案。

## 数据来源与字段

- 页面内嵌 `TRIP` 对象，由 `scripts/build-map.mjs` 读取 `data/pois.json` 与 `data/itinerary.json` 生成后注入。
- `TRIP.pois`：地点（id、正式名、中文名、城市、区域、类别、优先级、坐标、note/plan/tip、deep 内容）。
- `TRIP.days`：总览 + 14 个日期（label、date、title、summary、stops、candidates、color）。
- `TRIP.hardFacts` / `TRIP.segments`：攻略头部与三段主线，由构建脚本静态写入。
- 坐标均为规划级，出发前需用地图平台复核门牌与入口。

## 浏览方式

- 顶部粘性地图为 Leaflet（底图：高德瓦片默认 + OpenStreetMap 可选，右上角图层控件切换；Leaflet 已本地化到 `assets/leaflet/`）。
- 日签栏横向滚动：总览 + 9/24–10/7 共 15 个标签；点击切换当天视图，保留地图视野逻辑（fitBounds）。
- 总览：hero + 硬信息卡 + 三段主线 + 全部地点列表（45 个）。
- 当天视图：日期头 + 当日摘要 + 行程时间线（stops）+「当天备选/可选」区块（candidates）。
- 地点卡片：时间、名称、说明、操作按钮（小红书搜索 / 大众点评搜索 / 导航 / 详情）；详情可展开（plan/tip/whyWorthIt/分节动作）。

## 标记与路线

- 总览：按日期颜色渲染圆形标记（60 个 = 全部正式停靠点）。
- 当天视图：按时间线顺序渲染带数字的圆形标记；无正式道路几何，**不绘制任何路线连线**（数据校验仅提示「未提供 routeGeometry」）。
- 候选地点在卡片区标注「备选」，不参与当天数字编号。

## 筛选与搜索

- 顶部搜索框：按名称/中文名/说明过滤当前视图卡片（大小写不敏感）。
- 类别筛选 chips：全部 + 交通/酒店/美食/市集/清吧/兴趣课/自然/景点/购物/街区；与搜索叠加生效。

## 导航

- 卡片「导航」打开底部动作面板：Apple 地图 / Google 地图 / 高德地图（App scheme；桌面按 Web URL 处理）。
- 小红书按钮打开 `xiaohongshu.com/search_result?keyword=中文名+城市`；大众点评按钮打开 `dianping.com/search/keyword/0/中文名`。

## 状态保存

- 当前版本未实现修改/排序/撤销/本地保存；地图只读浏览。如需「加入/移出/换日/重新安排」能力，需升级到完整交互层（见 skill 母版）。

## 浏览器验证（2026-08-18）

- Edge headless（playwright，channel=msedge）：桌面 1280×900 与移动 390×844 均通过。
- 检查项：15 个日签、45 个总览卡片、60 个标记、高德瓦片加载（loaded tiles>0）、当天视图标题与 5 个停靠点、搜索过滤生效、无横向溢出、console 无 error/warn。
- 截图存档：`scripts/shots/01-overview-desktop.png`、`02-day926-desktop.png`、`03-overview-mobile.png`。