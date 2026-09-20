# PathOS v2 BLUEPRINT（v2 启动版核心蓝图）v2.1

**版本**：v2.1-revised
**日期**：2026-09-20（第二轮研究后修订）
**状态**：基础共识已达成，等待骨架阶段开始
**修订说明**：基于第一轮研究（审查竞品研究 + v1 实际代码 + v1 审计 + 蓝图自审），修复 50 个问题

---

## 0. 第二轮修订说明

### 0.1 修订范围
本次修订（v2.0 → v2.1）共修复 50 个问题：
- **🔴 P0 严重**：10 个（路由不一致、IPEDS URL 错误、GPA/ROI 算法错误、git checkout 命令、忽略 v1 资产、35 POI 已补、数据模型不一致、ship-pack 矛盾等）
- **🟡 P1 中等**：12 个（schema 缺 verified、类型未定义、暗色模式、字段过时等）
- **🟢 P2 小**：10+ 个（路由细节、字段命名、单位等）

### 0.2 核心修订
1. **路由统一**：采用 `/s/[slug]`（学校端）+ `/f/[slug]`（家庭端）双轨
2. **复用 v1 资产**：保留 ProvenanceBadge / StatusDictionaryMap / frontend-fields.json / UniversityProfilePanel
3. **数据模型对齐 v1**：保留 v1 11 个字段 + 增量 20+ 字段
4. **删除过时任务**：35 POI 已由 commit dcbd287 完成（v1 → 97 所）
5. **修复代码 bug**：模块 #4 IPEDS URL、模块 #8 时序类型、模块 #12 GPA 算法、模块 #13 ROI 算法

---

## 1. v2 共享理解（已 grill 确认）

### 1.1 产品定位
- **核心**：**信息集合与展示**（不是决策辅助 / 不是录取预测）
- **服务对象**：**家庭（家长 + 学生）+ 学校（老师 / 顾问）双边**
- **商业模式**：**专业版工具**（学校端订阅 + 家庭端免费 + 高阶付费）
- **差异锚点**：**verified data + missing-first + 时序图 + 新专业雷达 + 跨校专业对比**

### 1.2 架构分层
- **三层共用**（60-70%）：数据 / 业务逻辑 / 通用组件
- **两层分叉**（30-40%）：学校端（工具型 / 数据密度高）+ 家庭端（叙事型 / 大留白）
- **共用壳**：同一域名 / 同一 NavBar（按角色显隐入口）/ 同一品牌叙事

### 1.3 节奏（A 方案：Sequential）
- **Week 1-8**：骨架（路由 + schema + 组件库 + 占位 + 5-10 校 + 工作流）
- **Week 9-20**：内容生产（5-10 校 × 5 篇 + B2 8-12 个专业 + B3 12 篇时序）
- **总周期**：20 周

### 1.4 骨架完成标准（6 项硬标准）
1. **路由稳定** - `/s/[slug]` + `/f/[slug]` 双轨路由定义完成
2. **数据 schema 稳定** - 基于 v1 schema + zod 校验扩展
3. **可视化组件库完成** - 折线图 / 对比表 / 雷达 / 地图 / 卡片
4. **占位状态完成** - 所有页面在"无内容"时的诚实空状态
5. **5-10 所学校选定** - Top 5-10 热门学校名单确定
6. **编辑工作流定稿** - 生产 / 审稿 / 排期系统 ready

---

## 2. v2 启动版核心清单（14 项）

### 2.1 数据底座（5 项）

#### #1 v1 数据完整性验证
- v1 已有 97 所学校 + 904 条 verified records（commit dcbd287 完成）
- v2 启动版只需要验证 v1 数据完整性，不需要重新做 35 POI
- **剩余工作**：
  - 验证所有 v1 detail JSON 在 git 中存在
  - 补 7 个 P0 字段（usNewsRanks/programs/midRangeScores/classSize/testPolicy/curriculumSummary/curriculumUrl）的解析率从当前水平提升到 ≥90%
  - 区域数据补齐（4 项指标当前 records=[]）

#### #2 A1 学校字段补齐（前 5-10 所学校 30+ 字段）
- **继承 v1 字段**（frontend-fields.json）：
  - `rankingBand` + `rankingTier` (top20/top50/top100/other)
  - `annualCostRmb`
  - `safetyScore` (0-100)
  - `recognitionScore` (0-100)
  - `chineseCommunity` (low/medium/high)
  - `directFlight` (boolean)
  - `postStudyVisa`
  - `programs` (array)
  - `parentHighlights` + `studentHighlights`
  - `nearby` (subwayStations/chineseRestaurants/asianGroceries/avgRentRmb)
- **增量字段**（借鉴启德 + 选校帝）：
  - 各 ranking（US News / QS / THE 单独字段）
  - 学费明细（学位 × 类型 × 最高/最低）
  - 录取要求（语言 / 标化）
  - 学校历史（结构化时间轴）
  - 校友（分类：总统/诺奖/普利策）
  - 设施（结构化：图书馆/校园/实验室）
  - 时序数据（SAT/GPA/录取率/学费 5-10 年）
  - verified 元数据（source + asOf + verifiedBy + confidence）
- **详细 schema** 见 V2-EXEC-SPEC.md §模块 #2

#### #3 A2 专业级数据（8-12 个专业核心字段）
- 借鉴选校帝 7 大类分类（工/商/理/社科/艺术/农林/生命医学）
- **专业归属说明**：心理学 → social（行为/认知方向），life_health（神经心理学方向）
- v2 启动期先做 50+ 专业（8-12 主流 + 40+ 长尾）
- **详细 schema** 见 V2-EXEC-SPEC.md §模块 #3

#### #4 A5 第三方接入
- **US News**：大学排名 / 研究生院排名 / 专业排名（订阅制，约 $30-50/月）
- **IPEDS**：美国教育部官方数据（免费，覆盖 7000+ 美国高校）
  - **正确 endpoint**：`https://educationdata.urban.org/api/v1/college-university/ipeds/`
  - **正确参数**：`unitid` 或 `inst_name`（不是 `school_name`）
  - **字段名**：`enrollment_fall_` 前缀
- **College Scorecard**：教育部公开数据集（免费，9 年时序）
  - **API key 获取**：https://api.data.gov/
  - **URL 字段名带点需 URL-encode**：`latest%2Ecost%2Eattendance`
- 时间：Week 1-4 必须完成
- **完整实现**见 V2-EXEC-SPEC.md §模块 #4（已修复 URL）

#### #5 A6 半自动爬虫
- RSS / Newsletter / Twitter / Instagram 订阅（学校招生办）
- 编辑人工触发关键事件抓取（用 SingleFile / Save Page 工具）
- AI 起草解读 → 编辑改写 → 发布
- **必须为 5-10 所学校提供完整 SUBSCRIPTIONS 列表**（不再只列 1 所）
- v2.1 再考虑全量爬虫
- **完整实现**见 V2-EXEC-SPEC.md §模块 #5

### 2.2 核心功能（5 项）

#### #6 B1 学校深度页（v1 UniversityProfilePanel 升级）
- **继承 v1 组件**：`UniversityProfilePanel` + `ProvenanceBadge` + StatusDictionaryMap
- **借鉴启德字段结构**（30+ 字段）
- **借鉴百利天下单校专题**内容形态
- **增量**：
  - verified + missing-first（v1 已有基础，需强化）
  - 时序入口（→ B3）
  - 跨校对比入口（→ B2）
  - 新专业入口（→ S3）
  - 案例入口（→ 案例库）
  - 数据出处卡片（Data Provenance Card）
  - 数据新鲜度指示
  - 历史时间轴
- **完整实现**见 V2-EXEC-SPEC.md §模块 #6

#### #7 B2 专业级深度对比
- 借鉴选校帝 200+ 专业分类（7 大类）
- **0 竞品做跨校对比**（绝对蓝海）
- 每专业 1 篇深度对比
- **完整实现**见 V2-EXEC-SPEC.md §模块 #7

#### #8 B3 时序数据可视化
- **0 竞品**（绝对蓝海）
- 用户原话直接命中："为各个学校画折线图"
- **完整实现**见 V2-EXEC-SPEC.md §模块 #8（已修复 COLORS / TimeSeriesChartProps）

#### #9 S3 新专业雷达
- **0 竞品**（绝对蓝海）
- 用户原话直接命中："哈佛开了人类学专业"
- **完整实现**见 V2-EXEC-SPEC.md §模块 #9（已补 FieldMetaSchema）

#### #10 单校专题矩阵（5-10 校 × 5 篇）
- 借鉴百利天下（哈佛 / 斯坦福 / MIT 申请指南）模式
- Top 5-10 校：普林斯顿 / 哈佛 / 耶鲁 / MIT / 斯坦福 / 哥大 / 宾大 / 布朗 / 康奈尔 / 达特茅斯
- 每校 5 篇深度文章

### 2.3 借鉴模块（3 项）

#### #11 录取案例库
- 借鉴选校帝 17,448 案例（**0 竞品做得对**）
- 改进：必须含 GPA / SAT / 文书片段 / 录取年份 / 公开匿名选项
- 三维度交叉
- **完整实现**见 V2-EXEC-SPEC.md §模块 #11

#### #12 GPA 计算器（多算法）
- 借鉴选校帝 6 算法
- **必须实现完整的算法**，不只是注释"// ... 改进算法"
- v2 至少 3 种：标准 4.0 / 改进 4.0 / 北大 4.0
- **完整实现**见 V2-EXEC-SPEC.md §模块 #12（已修复 BEIDA / IMPROVED 算法实现）

#### #13 留学 ROI 计算器
- 借鉴新东方"投资回报计算"
- **算法必须正确应用 growthRate**（每轮 salary *= 1+growthRate）
- **完整实现**见 V2-EXEC-SPEC.md §模块 #13（已修复 ROI BUG）

### 2.4 增量改进（4 项）

#### #14 v2 增量改进 4 项
- **数据出处卡片**（ProvenanceBadge 升级版）
- **数据新鲜度指示**（< 30 天绿 / 30-90 天黄 / > 90 天红）
- **跨源数据调和**（US News + QS + THE + 调和规则）
- **对比分享卡**（对比结果可视化 + 一键分享图片）

---

## 3. v2 启动版的 3 个里程碑

| 里程碑 | 时间 | 完成标准 |
|---|---|---|
| **M1 骨架完成** | Week 8 | 6 项硬标准全部达标 |
| **M2 中期验证** | Week 14 | 5 所学校的 B1 + B3 内容齐全 + 2 个专业的 B2 |
| **M3 启动版完成** | Week 20 | 10 所学校的 B1 + B3 内容齐全 + B2 8-12 个专业对比 + S3 基础事件库 |

---

## 4. v2 启动版资源估算

| 资源 | 数量 | 周成本 | 总成本（20 周） |
|---|---|---|---|
| 前端 / 全栈 | 1 人（你 + 必要时外包） | — | 时间成本 |
| 主编 | 1 人（你自己） | 0 | 0 |
| 编辑 | 1 人（兼职） | ¥2,000-3,000 | ¥40,000-60,000 |
| AI 起草 API | DeepSeek / GPT | ¥500-1,000 | ¥10,000-20,000 |
| 服务器 / 部署 | Vercel + Render | — | ¥5,000-10,000 |
| **总计** | — | — | **¥55,000-90,000** |

---

## 5. v2 启动版不做（明确边界）

| 不做 | 理由 |
|---|---|
| 顾问 1v1 服务 | 不在用户目标 |
| 传统申请流程营销 | 与"信息集合与展示"定位冲突 |
| 智能选校 / AI 测评红海竞争 | 启德 / 新东方 / 选校帝已做 |
| 移动端原生 APP | v2 启动期 PWA 即可 |
| 多城市线下服务 | 不是产品功能 |
| 标化培训 | 新航道做的，不是 v2 业务 |
| 商家入驻 / 友情链接 | v2 不做平台 |
| 大型广告 banner | 不是"信息集合"形态 |

---

## 6. v1 资产复用清单（v2.1 核心修订）

v2 **不重建**以下 v1 已有组件，全部复用 + 增量：

| v1 资产 | 路径 | v2 用途 |
|---|---|---|
| `ProvenanceBadge` 组件 | `frontend/src/components/university/ProvenanceBadge.tsx` | 数据出处卡片基础 |
| `StatusDictionaryMap` | `frontend/src/domain/dataset.ts` | 数据出处状态字典 |
| `UniversityProfilePanel` | `frontend/src/components/university/UniversityProfilePanel.tsx` | B1 学校深度页基础 |
| `frontend-fields.json` | `PathOS-db-ranking-standalone/data-pipeline/schemas/v1/frontend-fields.json` | A1 字段基线 |
| `canonical-university.json` | `PathOS-db-ranking-standalone/data-pipeline/schemas/v1/canonical-university.json` | A1 schema 基线 |
| `PATHOS-DEEP-AUDIT-2026-09-17.md` | 仓库根目录 | v1 风险清单（v2 必须解决） |
| `PATHOS-DATA-FILL-GAPS.md` | 仓库根目录 | 35 POI 名单 + 7 字段解析状态 |

---

## 7. 下一步（Week 1）

### 7.1 立即（本周）
- [ ] 确认 5-10 所热门校名单
- [ ] **D1 第三方接入**选型：US News + IPEDS + College Scorecard
- [ ] **D2 可视化组件库**选型：Recharts + MapLibre
- [ ] **D3 专业分类**：选校帝 7 大类 + CIP 子分类
- [ ] **D6 编辑团队**：1 主编（你）+ 1 兼职编辑 + AI 起草
- [ ] **v1 数据完整性验证**：确认 97 所学校 + 904 records 完整

### 7.2 Week 1-4 关键路径
- 第三方接入（Week 1-4 完成）
- 数据 schema 定义（Week 1-2 完成）
- 可视化组件库开发（Week 2-4）
- 编辑招聘启动（Week 4）

### 7.3 Week 5-8
- 骨架 6 项硬标准完成
- 5-10 所学校内容规划
- 编辑工作流定稿

### 7.4 Week 9-20
- B1 学校深度 5-10 所 × 5 篇
- B3 时序解读 12 篇
- B2 专业对比 8-12 个
- A1 学校字段补齐
- A2 专业级数据
- S3 基础事件库 + 5-10 篇高质量解读
