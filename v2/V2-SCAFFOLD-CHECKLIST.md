# PathOS v2 Scaffold Checklist（骨架阶段验收清单）v2.1

**目标**：Week 1-8 完成所有勾选项
**判定**：每项必须可演示 + 可验证，**任何一项未完成 = 骨架未完成**
**修订**：路由统一为 `/s/[slug]`（学校端）+ `/f/[slug]`（家庭端）

---

## □ 标准 1：路由稳定

### 学校端路由（`/s/*`）

- [ ] 所有 88 所学校都有路由 `/s/[slug]`（slug 用英文，例 `/s/princeton-university`）
- [ ] 学校端所有页面路由定义完成：
  - [ ] `/s/home` （学校端首页）
  - [ ] `/s/map` （留学地图）
  - [ ] `/s/compare` （对比工具）
  - [ ] `/s/timeseries` （时序可视化 B3）
  - [ ] `/s/majors` （专业对比 B2）
  - [ ] `/s/major/[id]` （专业详情）
  - [ ] `/s/radar` （新专业雷达 S3）
  - [ ] `/s/calculator` （工具首页）
  - [ ] `/s/calculator/gpa` （GPA 计算器）
  - [ ] `/s/calculator/roi` （ROI 计算器）
  - [ ] `/s/cases` （案例库）
  - [ ] `/s/topic/[school-slug]/[article-slug]` （单校专题）

### 家庭端路由（`/f/*`）

- [ ] 家庭端所有页面路由定义完成：
  - [ ] `/f/home` （家庭端首页，叙事型）
  - [ ] `/f/school/[slug]` （学校故事）
  - [ ] `/f/major/[id]` （专业解读）
  - [ ] `/f/policy` （政策解读）
  - [ ] `/f/case/[id]` （案例）
  - [ ] `/f/calculator/roi` （ROI 计算 - 家庭版）

### 共享路由

- [ ] `/` （自动重定向到 `/f/home` 或 `/s/home`，基于角色）
- [ ] `/about` （关于 PathOS）
- [ ] 自动化路由测试通过（覆盖所有路由 + 88 所学校）

### 验证方式
```bash
cd frontend
npm run test -- --grep "routes"
```

---

## □ 标准 2：数据 schema 稳定

### v1 资产复用（必须）

- [ ] **不重写** `frontend/src/domain/dataset.ts`（v1 ProvenanceStatus / StatusDictionaryMap 已有）
- [ ] **不重写** `frontend/src/components/university/ProvenanceBadge.tsx`
- [ ] **不重写** `frontend/src/components/university/UniversityProfilePanel.tsx`
- [ ] **扩展** `PathOS-db-ranking-standalone/data-pipeline/schemas/v1/frontend-fields.json`（v1 11+ 字段 → v2 30+ 字段）

### v2 新增 schema（用 zod 扩展）

- [ ] B1 学校深度页 schema（30+ 字段 + verified + missing-first）
  - [ ] **保留 v1 字段**：rankingTier / annualCostRmb / safetyScore / chineseCommunity / directFlight / postStudyVisa / programs / parentHighlights / studentHighlights / nearby
  - [ ] **新增字段**：各 ranking（US News / QS / THE）/ 学费明细 / 录取要求 / 学校历史（结构化）/ 校友（分类）/ 设施（结构化）/ 时序数据
  - [ ] **verified 元数据**：source + asOf + verifiedBy + confidence（继承 v1 ProvenanceBadge）
- [ ] B2 专业对比 schema（7 大类 50+ 专业）
  - [ ] 7 大类：工/商/理/社科/艺术/农林/生命医学
  - [ ] 心理学归属说明：social（行为/认知）/ life_health（神经心理）
- [ ] B3 时序数据 schema（按学期 + 按事件双轨）
  - [ ] semester: 'YYYY-fall' / 'YYYY-spring' 格式
- [ ] A2 专业级数据 schema
- [ ] A5 第三方接入 schema（IPEDS / College Scorecard 适配层）
- [ ] A6 半自动爬虫事件库 schema
  - [ ] SUBSCRIPTIONS 列表：5-10 所学校完整
  - [ ] aiDraft 最小长度 ≥ 200 字
- [ ] **DataEnvelope**（继承 v1 审计文档定义）：
  ```typescript
  type DataEnvelope<T> = {
    data: T[]
    status: 'ready' | 'empty' | 'stale' | 'error'
    source: string
    asOf: string | null
    fetchedAt: string | null
    version: string
    errorCode?: string
  }
  ```
- [ ] zod 校验覆盖所有 schema

### 验证方式
```bash
cd frontend
npx tsc --noEmit
npm test -- --grep "schema"
```

---

## □ 标准 3：可视化组件库完成

### 通用组件

- [ ] 折线图（Recharts LineChart，用于 B3 时序可视化）
- [ ] 对比表（shadcn/ui Table，用于 B2 跨校对比）
- [ ] 雷达图（用于 S3 新专业雷达）
- [ ] 地图组件（MapLibre，v1 已用，升级版）
- [ ] 学校卡片（30+ 字段展示 + verified 标签）

### 数据可视化组件（核心）

- [ ] **DataProvenanceBadge**（基于 v1 ProvenanceBadge）
- [ ] **DataProvenanceCard**（数据出处卡片）
- [ ] **DataStalenessIndicator**（数据新鲜度，<30 天绿/30-90 天黄/>90 天红）
- [ ] **ConfidenceScore**（数据置信度评分）
- [ ] **SourceReconciliation**（US News + QS + THE 跨源调和）
- [ ] **ComparisonShareCard**（对比分享卡）

### 学校端专用组件

- [ ] **SchoolDetailView**（基于 v1 UniversityProfilePanel 升级）
- [ ] RankingCard（US News / QS / THE 调和展示）
- [ ] FinancialTable（学位 × 类型 × 金额）
- [ ] RequirementTable（语言 / 标化）
- [ ] **TimeSeriesChart**（含 POLICY_EVENTS 标注）
- [ ] MajorStrengthsGrid（强势专业网格）
- [ ] **HistoryTimeline**（结构化历史时间轴）
- [ ] **NotableAlumniGrid**（分类：总统/诺奖/普利策）

### 工具组件

- [ ] **GPACalculator**（3 种算法：标准 4.0 / 改进 4.0 / 北大 4.0）
- [ ] **ROICalculator**（含 growthRate 正确实现）
- [ ] EventStream（S3 新专业事件流）

### 验证方式
- Storybook / 视觉测试覆盖所有组件
- 5-10 所学校 mock 数据演示

---

## □ 标准 4：占位状态完成

- [ ] 88 所学校在"无内容"时有诚实空状态（不是骨架，不是 loading）
- [ ] 所有页面在"数据未加载"时的状态完整：
  - [ ] 学校详情页（无学校数据）
  - [ ] 专业对比页（无专业数据）
  - [ ] 时序可视化页（无时序数据）
  - [ ] 案例库页（无案例）
  - [ ] 新专业雷达页（无事件）
  - [ ] 工具页（GPA / ROI / 智能选校）
- [ ] 占位文案遵循 missing-first 原则（"暂无" / "未报告" / "等待数据"等）
- [ ] 占位状态可被编辑团队看到（"这个学校需要内容"提示）

### 验证方式
- 全 88 所学校 mock 数据演示
- 每个页面截图 + 文字描述

---

## □ 标准 5：5-10 所学校选定

### 候选 Top 10（最终 5-10 由你拍板）

- [ ] 普林斯顿大学 (Princeton) - US News #1
- [ ] 哈佛大学 (Harvard) - US News #3
- [ ] 耶鲁大学 (Yale) - US News #5
- [ ] MIT - US News #2
- [ ] 斯坦福大学 (Stanford) - US News #4
- [ ] 哥伦比亚大学 (Columbia) - US News #12
- [ ] 宾夕法尼亚大学 (UPenn) - US News #6
- [ ] 布朗大学 (Brown) - US News #9
- [ ] 康奈尔大学 (Cornell) - US News #11
- [ ] 达特茅斯学院 (Dartmouth) - US News #13

### 内容规划

- [ ] 每所学校分配编辑内容选题（5 篇/校）
- [ ] 每所学校分配数据采集任务
- [ ] 主编 review 通过
- [ ] 详见 `v2/plans/5-10-schools.md`

---

## □ 标准 6：编辑工作流定稿

- [ ] 编辑招聘完成（Week 4-6）
- [ ] 内容生产流程：
  - [ ] 主编：定主题 / 排期 / 审稿 / 发稿
  - [ ] 编辑：写 / 改 / 配图
  - [ ] AI：起草初稿 + 数据查询
- [ ] 内容质量标准：
  - [ ] AI 起草 → 编辑改写 ≥ 70%
  - [ ] 单审（主编一审即发）
- [ ] 发布频率：
  - [ ] 触发式（S3 事件触发 → 24-48 小时内发）
  - [ ] 每周汇总（B1 / B3 每周 2-3 篇）
- [ ] 工具就绪：
  - [ ] 编辑看板（Notion / 飞书 / 自建）
  - [ ] 审稿流程（GitHub PR / 飞书审批）
  - [ ] 排期表
  - [ ] 数据查询接口（IECG / IPEDS / College Scorecard）
- [ ] 主编试用通过

---

## 骨架完成后的下一阶段

完成所有 6 项后，进入 **内容生产阶段（Week 9-20）**：
- B1 学校深度 5-10 所 × 5 篇
- B3 时序解读 12 篇
- B2 专业对比 8-12 个
- A1 学校字段补齐（在 v1 基础上扩展到 30+）
- A2 专业级数据
- S3 基础事件库 + 5-10 篇高质量解读
