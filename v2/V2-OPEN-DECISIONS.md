# PathOS v2 Open Decisions（待对齐的决策）v2.1

**说明**：v2 启动前必须解决的开放决策。
**修订**：D4 IPEDS URL 已修复；D11 PWA 验收清单已加入 V2-VERIFY.md。

---

## D1（Week 1 必须定）：第三方接入选型

**问题**：A5 第三方数据接入——选哪些源？

**候选**：
- **US News**：大学排名 / 研究生院排名 / 专业排名（订阅制，约 $30-50/月）
- **IPEDS**：美国教育部官方数据（免费，覆盖 7000+ 美国高校）
- **College Scorecard**：教育部公开数据集（免费，9 年时序）
- **Niche.com**：用户评价 + 数据（部分免费）
- **Times Higher Education (THE)**：世界大学排名（订阅）
- **QS**：世界大学排名（订阅）

**推荐方案**：**IPEDS + College Scorecard + US News**

**理由**：
- 三者覆盖**基础 + 时序 + 排名**三大维度
- 美国本土留学的核心数据基本齐全
- 订阅成本可控（IPEDS / Scorecard 免费，US News $30-50/月）

### IPEDS 接入细节（关键修正）

**正确 endpoint**：`https://educationdata.urban.org/api/v1/college-university/ipeds/`

**正确参数**：
- `unitid` - IPEDS 单位 ID（6 位数字）—— 比 `inst_name` 更精确
- `inst_name` - 学校名（fallback）
- **不是** `school_name`（早期版本字段，已废弃）

**字段名**：`enrollment_fall_` 前缀（如 `enrollment_fall_undergrad_12_month`）

### College Scorecard 接入细节

**API key 获取**：https://api.data.gov/ 注册免费账号

**正确 endpoint**：`https://api.data.gov/ed/collegescorecard/v1/schools`

**字段名带点需 URL-encode**：
```
# 错误
?fields=school.name,latest.cost.attendance
# 正确
?fields=school.name,latest%2Ecost%2Eattendance
```

---

## D2（Week 1 必须定）：可视化组件库选型

**问题**：折线图 / 对比表 / 雷达图 / 地图 选哪个库？

**候选**：
- **Recharts**：React 生态主流，SVG 渲染，组件丰富
- **Visx**：D3 + React，灵活但学习曲线陡
- **D3**：最灵活，但需要自己写 React wrapper
- **ECharts**：百度开源，跨平台，中文文档好
- **MapLibre**：v1 已用，保持

**推荐方案**：**Recharts + MapLibre + shadcn/ui Table**

**理由**：
- Recharts：React 生态主流，文档丰富，社区活跃，B1 / B2 / B3 / S3 全部覆盖
- shadcn/ui Table：用于跨校对比表 + 学校详情表
- MapLibre：v1 已用，保留
- Visx / D3 可以作为 Recharts 满足不了的边缘情况补充

---

## D3（Week 1 必须定）：专业分类方案

**问题**：B2专业对比用哪个分类？

**候选**：
- **选校帝 7 大类**（工 / 商 / 理 / 社科 / 艺术 / 农林 / 生命医学）— 200+ 专业
- **CIP 分类**（美国教育部 Classified Instructional Programs）— 官方标准
- **Common App 学科分类** — 申请系统原生分类
- **国家统计局专业目录** — 中国标准

**推荐方案**：**选校帝 7 大类 + CIP 子分类**

**理由**：
- 选校帝 7 大类是竞品验证过的分类（**5,675,061 用户测试过**）
- CIP 子分类可作为细节字段
- Common App 是用户实际申请的分类，可作为申请场景的辅助分类

### 心理学归属说明（避免歧义）

| 心理学方向 | 归属分类 |
|---|---|
| 行为心理学 / 认知心理学 / 社会心理学 | **social**（社科） |
| 神经心理学 / 临床心理学（精神疾病方向） | **life_health**（生命科学与医学） |
| 教育心理学 | **social**（社科） |

v2 默认按"行为/认知/社会"方向归 social。

**v2 启动期**：50+ 专业（8-12 个主流 + 40+ 长尾）

---

## D4（Week 1 必须定）：GPA 算法选型

**问题**：GPA 计算器支持哪些算法？

**候选**：
- **标准 4.0 算法**（美本标准）
- **改进 4.0 算法（一）**（含 +0.3 奖励）
- **改进 4.0 算法（二）**（含 +0.5 奖励）
- **北大 4.0 算法**（中国本科）
- **加拿大 4.3 算法**
- **中科大 4.3 算法**
- **上海交大 4.3 算法**

**推荐方案**：**标准 4.0 + 改进 4.0 + 北大 4.0**（至少 3 种）

**理由**：
- 标准 4.0 是美国申请的事实标准
- 北大 4.0 覆盖中国学生
- 改进 4.0 提供差异化（少数学校用）

### 算法完整实现（避免上一版注释"// ... 改进算法"的 BUG）

**重要**：v2 必须实现**完整的 11 档分级**，不是简化版：

```typescript
// 北大 4.0 算法（11 档分级）
const BEIDA_4_0 = (score: number): number => {
  if (score >= 95) return 4.0;
  if (score >= 90) return 4.0;
  if (score >= 85) return 3.7;
  if (score >= 82) return 3.3;
  if (score >= 78) return 3.0;
  if (score >= 75) return 2.7;
  if (score >= 72) return 2.3;
  if (score >= 68) return 2.0;
  if (score >= 64) return 1.5;
  if (score >= 60) return 1.0;
  return 0;
};
```

---

## D5（Week 1-2 必须定）：学校官网爬虫策略

**问题**：A6 半自动爬虫的具体技术栈？

**候选**：
- **RSS / Newsletter 订阅 + 编辑触发抓取**（人工触发，AI 辅助解读）
- **全量自建爬虫**（88 校各写爬虫）
- **外包爬虫服务**（Diffbot / ScrapeAPI）

**推荐方案**：**RSS / Newsletter 订阅 + 编辑触发抓取 + AI 辅助**

**理由**：
- 88 校各写爬虫 = 持续运维黑洞
- 编辑触发抓取 = 可控、可审计
- AI 辅助 = 提升编辑效率
- v2.1 再考虑全量爬虫

### 实施清单

- [ ] 编辑订阅 5-10 所学校招生办公告 / RSS / Twitter / Instagram
- [ ] 关键事件触发抓取（用 SingleFile / Save Page 工具）
- [ ] AI 起草解读（DeepSeek / GPT）→ 编辑改写 → 发布
- [ ] 完整 SUBSCRIPTIONS 列表（V2-EXEC-SPEC.md §模块 #5）

---

## D6（Week 1-2 必须定）：编辑团队配置

**问题**：编辑团队的规模和来源？

**候选**：
- **1 主编（你）+ 1 兼职编辑**（推荐）
- **1 主编 + 2 编辑**（成本更高）
- **外包内容工作室**（成本中等）
- **UGC + 编辑审核**（v1 已经踩过坑）

**推荐方案**：**1 主编 + 1 兼职编辑 + AI 起草**

**理由**：
- v2 启动期最小可行团队
- AI 起草省 50% 写作时间
- 主编是你（每周 8-10 小时：选题 2h + 审稿 4h + 排期 2h + 沟通 2h）
- 编辑：1 个兼职编辑（每周 20-30 工时，¥2,000-3,000/周）

---

## D7（Week 2-4 必须定）：学校数据补齐优先级

**问题**：v1 已有 97 所学校（commit dcbd287 完成）+ 904 条 verified records。v2 启动版要补什么？

**候选**：
- **先 5-10 所热门校字段扩展**（v1 已有 11+ 字段，v2 扩到 30+）
- **先 7 个 P0 字段解析率提升**（usNewsRanks/programs/midRangeScores 等 → ≥ 90%）
- **先区域数据补齐**（4 项指标当前 records=[]）
- **先 v1 数据完整性验证**（确认所有 88-97 所 detail JSON 存在）

**推荐方案**：**先 7 个 P0 字段解析率 + 同时进行 5-10 所字段扩展**

**理由**：
- v1 已经有 97 所学校 + 904 records，不需要"补 35 POI"
- 7 个 P0 字段是学校详情页关键字段，必须先解决
- 5-10 所热门校字段扩展（从 11+ 到 30+）在 P0 字段解析基础上做
- 区域数据补齐依赖外部数据源，独立工作流

---

## D8（Week 4-6 必须定）：可视化设计语言

**问题**：v2 视觉语言是保留 v1 editorial 还是更新？

**候选**：
- **保留 v1 editorial**（bracket / wave / earth from orbit）
- **更克制 SaaS 化**（去掉装饰元素，更像 Notion / Linear）
- **金融 dashboard 感**（深色 / 数据密度高 / Bloomberg 风格）
- **小红书图文感**（暖色 / 卡片 / 移动友好）

**推荐方案**：**保留 v1 editorial 基础 + 工具页面用 SaaS 清晰度**

**理由**：
- v1 editorial 是品牌资产，不动
- 工具页面（智能选校 / 时序 / 对比）需要 SaaS 清晰度
- 混合策略：内容页 = editorial，工具页 = SaaS

### v1 颜色资产复用

```typescript
// v1 已有的 4 个色系必须保留（不要只保留 2 个）
- bg-cobalt (蓝，主色)
- bg-persimmon (橘，强调)
- bg-jade (绿，成功)
- bg-ink (深灰，文本)
```

---

## D9（Week 4-8 必须定）：数据更新机制

**问题**：A1 学校字段数据如何持续更新？

**候选**：
- **完全人工编辑**（每月更新）
- **自动化 + 人工审核**（IPEDS 每年 9 月发布，半自动采集）
- **外包数据采集**（成本高）

**推荐方案**：**自动化 + 人工审核**

**理由**：
- IPEDS / College Scorecard 每年秋季发布新版，可定时采集
- 人工审核确保 verified 标签准确
- 数据新鲜度指示（#14 改进）会暴露未更新的字段

### 采集 cron 频率

- IPEDS：每年 10 月（秋季数据发布后）
- College Scorecard：每年 10 月
- US News：每年 9 月（排名发布后）
- 学校官网新专业：每周一次 cron 扫描 RSS / Newsletter

---

## D10（Week 8-12 必须定）：商业模式启动

**问题**：v2 启动版的商业模式怎么启动？

**候选**：
- **完全免费**（用户增长优先）
- **学校端订阅试用**（5-10 所顾问试用）
- **家庭端高级订阅**（v2 启动即可）

**推荐方案**：**Week 9-16 免费 + Week 17-20 学校端试用**

**理由**：
- Week 9-16 免费积累种子用户（5-10 校顾问 + 家长群）
- Week 17-20 学校端专业版试用（100-200 元/月）
- Week 20+ 正式版上线 + 家庭端高级订阅（299-499 元/年）

---

## D11（Week 12-14 必须定）：移动端 PWA

**问题**：v2 是否做移动端 PWA？

**推荐方案**：**PWA 基础版（Week 12-14）**

**理由**：
- 选校帝 APP 有 567 万用户（移动端流量大）
- 但 v2 启动版资源有限，先做 PWA（响应式 + 离线缓存 + 添加主屏）
- 原生 APP v2.1 再考虑

### PWA 验收（V2-VERIFY.md 已加入）

- Lighthouse PWA 评分 ≥ 90
- Service Worker 离线可用
- 添加到主屏可用
- 移动端响应式（< 640px）

---

## D12（Week 1 必须定）：环境变量清单

**问题**：v2 需要哪些环境变量？

| 变量名 | 来源 | 必填 |
|---|---|---|
| `COLLEGE_SCORECARD_API_KEY` | api.data.gov 注册 | ✅ |
| `US_NEWS_API_KEY` | US News 订阅 | ⚠️ 备用 |
| `DEEPSEEK_API_KEY` | platform.deepseek.com | ✅（起草） |
| `NEXT_PUBLIC_PATHOS_MAP_PROVIDER` | v1 已有 | ⚠️ |
| `PATHOS_DATA_MODE` | v1 已有 | ✅ |

详见 V2-EXEC-SPEC.md §模块 #4 + §模块 #5。

---

## 决策跟踪

| # | 决策 | 优先级 | 状态 |
|---|---|---|---|
| D1 | 第三方接入选型（含 IPEDS URL 修正） | Week 1 | ⚠️ 待定 |
| D2 | 可视化组件库选型 | Week 1 | ⚠️ 待定 |
| D3 | 专业分类方案（含心理学归属） | Week 1 | ⚠️ 待定 |
| D4 | GPA 算法选型（含 11 档实现） | Week 1 | ⚠️ 待定 |
| D5 | 爬虫策略（含 SUBSCRIPTIONS 完整） | Week 1-2 | ⚠️ 待定 |
| D6 | 编辑团队配置 | Week 1-2 | ⚠️ 待定 |
| D7 | 数据补齐优先级（v1 已有 97 所） | Week 2-4 | ⚠️ 待定 |
| D8 | 视觉设计语言（4 色保留） | Week 4-6 | ⚠️ 待定 |
| D9 | 数据更新机制（含 cron 频率） | Week 4-8 | ⚠️ 待定 |
| D10 | 商业模式启动 | Week 8-12 | ⚠️ 待定 |
| D11 | 移动端 PWA（含验收清单） | Week 12-14 | ⚠️ 待定 |
| D12 | 环境变量清单 | Week 1 | ⚠️ 待定 |
