# PathOS v2 VERIFY（AI 验收标准）v2.1

> **核心目的**：AI 执行每个模块后，对照本清单自检，确保 v2 启动版质量。
>
> **v2.1 修订**：
> - FID 改为 INP（Google 2024 年 3 月已弃用 FID）
> - 加入 PWA 验收清单（D11 决策）
> - v1 数据基础验证（97 所学校 + 904 records）
> - 加入"已完成"基线（不再"补 35 POI"）

---

## 0. v1 数据基础（v2 启动版的起点）

**v2 不需要从零开始**。v1 已经有 97 所学校 + 904 条 verified records：

```bash
# 验证 v1 数据基础
cd frontend
node -e "const u = require('./data/preview/universities.json'); console.log('Schools:', u.length);"  # 97
ls data/preview/university-details/ | wc -l  # 62+
ls data/preview/university-details/ -la | head -3  # 检查文件格式

# v2 需要做的：
# - 验证 97 所学校的 detail JSON 完整性（commit dcbd287 已完成大部分）
# - 补 7 个 P0 字段解析率（详见 PATHOS-DATA-FILL-GAPS.md §2）
# - 在 v1 11+ 字段基础上扩展到 30+ 字段
# - 区域数据补齐（4 项指标 records=[]）
```

---

## 1. 每个模块的验收标准

### 1.1 模块 #1：v1 数据完整性验证

#### 自动化验收
```bash
cd frontend
node -e "const u = require('./data/preview/universities.json'); console.log('Schools count:', u.length);"  # 97
ls data/preview/university-details/ | wc -l  # ≥ 62
npx tsc --noEmit  # 0 错误
```

#### 人工验收
- [ ] 随机抽 3 所学校的 detail JSON
- [ ] 每个字段都有值或明确的 `null`
- [ ] 7 个 P0 字段解析率 ≥ 90%
- [ ] 区域数据 records ≥ 50 条

### 1.2 模块 #2：A1 学校字段补齐

#### 自动化验收
```bash
cd frontend
npm run build
npm test -- --grep "university-detail"
npx tsc --noEmit
```

#### 人工验收
- [ ] 5-10 所学校都有完整 30+ 字段
- [ ] 每个字段都有 FieldMetaSchema（source + asOf + verifiedBy）
- [ ] missing 字段不显示 0，显示"暂无"
- [ ] 数据出处可点击
- [ ] **v1 字段全部保留**：rankingBand / rankingTier / annualCostRmb / safetyScore / recognitionScore / chineseCommunity / directFlight / postStudyVisa / programs / parentHighlights / studentHighlights / nearby

### 1.3 模块 #3：A2 专业级数据

#### 自动化验收
```bash
cd frontend
npm run build
ls .next/server/app/s/major/ | wc -l  # ≥ 50
npm test -- --grep "major"
```

#### 人工验收
- [ ] 50+ 专业都有 schema 校验（每个有 FieldMetaSchema）
- [ ] 7 大类分类完整（包含心理学归属说明）
- [ ] 每个专业 5-10 所学校的对比数据

### 1.4 模块 #4：A5 第三方接入

#### 自动化验收
```bash
npm test -- --grep "integrations"
# URL 形式必须正确：
# IPEDS: https://educationdata.urban.org/api/v1/college-university/ipeds/...
# Scorecard: https://api.data.gov/ed/collegescorecard/v1/schools?...
```

#### 人工验收
- [ ] **IPEDS endpoint 正确**：`/api/v1/college-university/ipeds/`（不是 `/ipeds/fall-enrollment/2022/`）
- [ ] **IPEDS 参数正确**：`unitid` 或 `inst_name`（不是 `school_name`）
- [ ] **College Scorecard URL 字段名 URL-encode**：`latest%2Ecost%2Eattendance`
- [ ] **COLLEGE_SCORECARD_API_KEY 从 api.data.gov 注册**
- [ ] 3 所学校 IPEDS + Scorecard 数据成功获取
- [ ] API 失败时有 fallback 到 IECG + confidence: 50

### 1.5 模块 #5：A6 半自动爬虫

#### 自动化验收
```bash
npm test -- --grep "radar"
# 验证 SUBSCRIPTIONS 列表有 5-10 所学校完整
grep -c "schoolId" frontend/src/server/radar/subscriptions.ts  # ≥ 5
```

#### 人工验收
- [ ] **SUBSCRIPTIONS 列表有 5-10 所学校**（不再只有 1 所）
- [ ] 编辑触发 1 个新事件 → AI 起草 → 编辑改写 → 发布
- [ ] 事件库 schema 完整（含 FieldMetaSchema）
- [ ] aiDraft 最小长度 ≥ 200 字
- [ ] DEEPSEEK_API_KEY 环境变量已配置

### 1.6 模块 #6：B1 学校深度页

#### 自动化验收
```bash
cd frontend
npm run build
npm test -- --grep "school-detail"
# 测试 /s/princeton-university 路由
curl -I http://localhost:3017/s/princeton-university  # 200
```

#### 人工验收
- [ ] /s/[slug] 完整渲染 30+ 字段
- [ ] 每个字段都有 verified 标签（来自 v1 ProvenanceBadge）
- [ ] 数据新鲜度颜色编码正确（<30 天绿 / 30-90 天黄 / >90 天红）
- [ ] missing 字段显示"暂无"而非 0
- [ ] 数据出处卡片可点击
- [ ] generateMetadata 处理 nullable 字段（不爆 TypeScript 错误）
- [ ] **复用 v1 UniversityProfilePanel**（不重建）
- [ ] SchoolDetailView 包含 8 个子组件：SchoolHeader / RankingCard / FinancialTable / RequirementTable / TimeSeriesEntry / MajorStrengthsGrid / HistoryTimeline / NotableAlumniGrid / FacilityGrid / DataProvenanceCard

### 1.7 模块 #7：B2 专业对比

#### 自动化验收
```bash
npm test -- --grep "major-comparison"
# 验证 TimeSeriesPoint 类型已定义
grep -E "interface TimeSeriesPoint" frontend/src/types/timeseries.ts
```

#### 人工验收
- [ ] 8-12 个专业的跨校对比页能渲染
- [ ] 每个专业 5-10 所学校的对比表
- [ ] MajorTimeSeries 编译通过（TypeScript 0 错误）
- [ ] MajorSchema 含 FieldMetaSchema

### 1.8 模块 #8：B3 时序可视化

#### 自动化验收
```bash
npm test -- --grep "timeseries"
# 验证 COLORS 和 TimeSeriesChartProps 已定义
grep -E "const COLORS" frontend/src/components/timeseries/TimeSeriesChart.tsx
grep -E "interface TimeSeriesChartProps" frontend/src/components/timeseries/TimeSeriesChart.tsx
```

#### 人工验收
- [ ] 5-10 所学校的 5-10 年时序数据能渲染
- [ ] 政策事件标注（SAT 取消）正确显示
- [ ] COLORS 已定义（10 色 + % COLORS.length 防止越界）
- [ ] TimeSeriesChartProps 已定义
- [ ] POLICY_EVENTS 从 CMS 读取（不写死）

### 1.9 模块 #9：S3 新专业雷达

#### 自动化验收
```bash
npm test -- --grep "radar"
# 验证 NewMajorEventSchema 含 FieldMetaSchema
grep "FieldMetaSchema" frontend/src/schemas/radar-event.schema.ts
```

#### 人工验收
- [ ] 新专业事件流能显示
- [ ] AI 解读 ≥ 200 字
- [ ] 适合度标签可见
- [ ] 5-10 所学校 SUBSCRIPTIONS 完整
- [ ] aiClient（DeepSeek）正常调用
- [ ] db.saveEvent 正常存储（文件系统）

### 1.10 模块 #11：案例库

#### 自动化验收
```bash
npm test -- --grep "cases"
# 验证 CaseSchema 含 FieldMetaSchema
grep "FieldMetaSchema" frontend/src/schemas/case.schema.ts
```

#### 人工验收
- [ ] 案例详情含 GPA/SAT/文书片段（不是脱敏空字段）
- [ ] 三维度交叉（学校/专业/学校+专业）
- [ ] 录取年份字段
- [ ] isPublic 公开/匿名选项

### 1.11 模块 #12：GPA 计算器

#### 自动化验收
```bash
npm test -- --grep "gpa"
# 验证三种算法完整实现
grep "const STANDARD_4_0" frontend/src/lib/gpa.ts
grep "const IMPROVED_4_0_A" frontend/src/lib/gpa.ts
grep "const BEIDA_4_0" frontend/src/lib/gpa.ts
```

#### 人工验收
- [ ] **3 种算法完整实现**（标准 4.0 / 改进 4.0 / 北大 4.0）
- [ ] **BEIDA_4_0 与 IMPROVED_4_0_A 实现不同**（验证单元测试）
- [ ] 输入成绩后实时计算 GPA

### 1.12 模块 #13：ROI 计算器

#### 自动化验收
```bash
npm test -- --grep "roi"
# 验证 calculatePayback 实现正确
grep "currentSalary = currentSalary * (1 + growthRate)" frontend/src/lib/roi.ts
```

#### 人工验收
- [ ] **calculatePayback 每轮正确应用 growthRate**（不是累积后应用）
- [ ] 输入学校 + 学费 + 生活 + 预期薪资 → 输出投资回收期（年）
- [ ] 回收期图清晰

### 1.13 模块 #14：4 项增量改进

#### 数据出处卡片 (14a)
- [ ] 每个字段标 source + asOf + verified
- [ ] 来源颜色编码正确（IECG 绿 / IPEDS 蓝 / etc.）

#### 数据新鲜度指示 (14b)
- [ ] < 30 天绿 / 30-90 天黄 / > 90 天红
- [ ] 颜色编码自动计算

#### 跨源数据调和 (14c)
- [ ] US News + QS + THE 同时展示
- [ ] 调和规则说明可见

#### 对比分享卡 (14d)
- [ ] 对比结果可视化
- [ ] 一键生成 PNG 图片
- [ ] 二维码跳转回 v2

### 1.14 PWA（D11 决策新增）

- [ ] Lighthouse PWA 评分 ≥ 90
- [ ] Service Worker 离线可用
- [ ] 添加到主屏可用
- [ ] manifest.json 配置正确
- [ ] 移动端响应式（< 640px）

---

## 2. 全局验收（v2 启动版完成时）

### 2.1 代码质量

```bash
cd frontend
npx tsc --noEmit              # 0 错误
npm run lint                  # 0 警告
npm test -- --run             # 100% 通过
npm run build                 # 通过
```

### 2.2 数据质量

- [ ] v1 97 所学校 detail JSON 完整
- [ ] 5-10 所学校 30+ 字段全部 verified
- [ ] 50+ 专业全部有跨校对比
- [ ] 案例库 100+ 条
- [ ] 时序数据 5-10 年
- [ ] 7 个 P0 字段解析率 ≥ 90%

### 2.3 UI / UX

- [ ] 所有页面有 missing-first 占位
- [ ] 所有数据点有 verified + asOf
- [ ] 数据新鲜度颜色编码正确
- [ ] 移动端响应式
- [ ] **暗色模式正确**（`.dark` 类触发，不是 `[data-theme]`）

### 2.4 性能指标（v2.1 修复：FID → INP）

**重要**：Google 2024 年 3 月已弃用 FID（First Input Delay），改用 INP（Interaction to Next Paint）。

| 指标 | 目标 | 说明 |
|---|---|---|
| FCP（First Contentful Paint） | < 1.5s | 首次内容绘制 |
| LCP（Largest Contentful Paint） | < 2.5s | 最大内容绘制 |
| CLS（Cumulative Layout Shift） | < 0.1 | 累积布局偏移 |
| **INP（Interaction to Next Paint）** | **< 200ms** | **替代 FID 的交互指标** |
| TTI（Time to Interactive） | < 3.5s | 可交互时间 |

**禁止使用 FID**（已废弃）

### 2.5 可访问性 (a11y)

- [ ] WCAG AA 标准
- [ ] Lighthouse a11y 评分 ≥ 95
- [ ] 键盘导航
- [ ] 屏幕阅读器
- [ ] 颜色对比度
- [ ] axe-core 自动化测试通过

### 2.6 PWA（D11 决策）

- [ ] Lighthouse PWA 评分 ≥ 90
- [ ] 离线可用
- [ ] 添加到主屏可用

### 2.7 v1 资产复用

- [ ] `frontend/src/components/university/ProvenanceBadge.tsx` 被复用（不重写）
- [ ] `frontend/src/components/university/UniversityProfilePanel.tsx` 被复用（不重写）
- [ ] `frontend/src/domain/dataset.ts` 被复用（不重写）
- [ ] v1 frontend-fields 字段全部保留（11+ 字段）

---

## 3. AI 自检流程

每个模块完成后，AI 必须按以下流程自检：

```
1. 读取 V2-EXEC-SPEC.md 对应章节
2. 读取本文件对应模块的验收标准
3. 运行自动化验收命令
4. 人工验收清单逐项打勾
5. 如有失败项：
   - 修复并重试
   - 如无法修复，记录到 v2/decisions/D-FAIL-[module-id].md
6. 全部通过后：
   - Git commit（按 V2-EXEC-SPEC.md §4.2 格式）
   - 更新 V2-SCAFFOLD-CHECKLIST.md 对应项
   - 通知用户
```

---

## 4. 失败处理流程

### 4.1 自动化验收失败

```bash
# 查看具体错误
npm test -- --grep "module-name" 2>&1 | head -50

# 常见问题
# 1. zod schema 不匹配 → 修改 schema
# 2. TypeScript 类型错误 → 修复类型（参考 V2-EXEC-SPEC.md）
# 3. 测试失败 → 修复测试
```

### 4.2 人工验收失败

- [ ] 重新阅读 V2-EXEC-SPEC.md 模块章节
- [ ] 重新阅读竞品 raw 数据（`v2/competitor-research/raw-*.html`）
- [ ] 修复后重新跑自检

### 4.3 无法修复

记录到 `v2/decisions/D-FAIL-[module-id].md`：
```markdown
# 模块 #X 验收失败

## 失败项
- [ ] 自动化：[具体命令 + 错误]
- [ ] 人工：[具体项 + 原因]

## 计划
- [ ] 修复方案
- [ ] 修复时间

## 备注
- 是否阻塞其他模块？
- 是否影响 v2 启动版完成？
```

---

## 5. v2 启动版完成的硬标准

### 5.1 必达（任何一项不达 = v2 启动版不达标）

- [ ] 6 项骨架硬标准全部达标
- [ ] 14 项核心功能全部完成
- [ ] 所有自动化验收 0 错误
- [ ] 所有人工验收清单打勾
- [ ] TypeScript 0 错误 / ESLint 0 警告
- [ ] npm run build 通过

### 5.2 应达（v2 启动版质量保证）

- [ ] 5-10 所学校 30+ 字段全部 verified
- [ ] 50+ 专业全部有跨校对比
- [ ] 时序数据 5-10 年
- [ ] 案例库 100+ 条

### 5.3 期望（v2 启动版差异化）

- [ ] 0 竞品做的功能（时序 / 新专业雷达 / 跨校对比）全部上线
- [ ] 数据出处 / 新鲜度 / 跨源调和 / 对比分享卡 4 项增量改进全部上线
- [ ] 用户原话直接命中的例子（哈佛人类学 / SAT 趋势）都有专门呈现

---

## 6. AI 验收报告模板

每个模块完成后，AI 必须输出：

```markdown
# 模块 #X 验收报告

## 自动化验收
- [ ] npx tsc --noEmit: [PASS/FAIL]
- [ ] npm run lint: [PASS/FAIL]
- [ ] npm test: [PASS/FAIL]
- [ ] npm run build: [PASS/FAIL]

## 人工验收
- [ ] [具体项 1]: [PASS/FAIL]
- [ ] [具体项 2]: [PASS/FAIL]

## v1 资产复用
- [ ] ProvenanceBadge / UniversityProfilePanel / StatusDictionaryMap 是否复用？

## 成功点
- [列出 3-5 个做对的事]

## 改进点
- [列出 2-3 个可以优化的地方]

## 是否阻塞其他模块
- [YES/NO]

## Commit 信息
- [git commit hash + message]
```

---

**总结**：AI 必须严格执行本文件所有验收标准。任何一项失败必须记录并修复，不得跳过。
