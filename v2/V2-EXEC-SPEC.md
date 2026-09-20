# PathOS v2 EXEC SPEC（AI 执行手册）

> **核心目的**：任何 AI 拿到这份文档都能做出与 v2 启动版完全一样的效果。
>
> 本文档是 v2 启动版的"宪法 + 操作手册"。

---

## 0. 文档导航

| 文档 | 用途 | 谁读 |
|---|---|---|
| **V2-EXEC-SPEC.md**（本文） | 主执行手册：每个功能的完整规范 | AI 执行者 |
| **V2-UI-SPEC.md** | UI 设计系统：tokens、组件、布局、交互 | 前端 AI / UI 设计 AI |
| **V2-SKILLS.md** | 可用 Skills 清单：哪些 skill 用、怎么调用 | 任何 AI |
| **V2-VERIFY.md** | AI 验收标准：每个模块的硬验收 + 自检流程 | AI 自检 / 人工 review |

**配套**（已存在）：
- `V2-BLUEPRINT.md` - 共识蓝图
- `V2-SCAFFOLD-CHECKLIST.md` - 骨架验收清单（6 项硬标准）
- `V2-OPEN-DECISIONS.md` - 待对齐决策（D1-D11）
- `plans/5-10-schools.md` - 5-10 所学校候选名单

---

## 1. v2 全景架构

### 1.1 数据流图

```
┌─────────────────────────────────────────────────────────────────┐
│                      Data Sources                               │
│  IECG docx (88 校) + US News + IPEDS + College Scorecard         │
│  + 学校官网 (RSS/Newsletter) + 选校帝 7 大类                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ETL
┌─────────────────────────────────────────────────────────────────┐
│  PathOS-db-ranking-standalone (Backend)                          │
│  - schema validation (zod)                                       │
│  - provenance tracking                                           │
│  - Preview Bundle (pathos-preview-v1 contract)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ BFF
┌─────────────────────────────────────────────────────────────────┐
│  Next.js 14 BFF (frontend/src/server)                            │
│  - /api/pathos/preview (统一数据接口)                            │
│  - DataEnvelope: {data, status, source, asOf, version}          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Next.js 14 Frontend (frontend/src/app)                          │
│  ├─ /s/* (学校端)                                                  │
│  │  ├─ /s/map (地图)                                              │
│  │  ├─ /s/compare (对比工具)                                       │
│  │  ├─ /s/timeseries (时序可视化 B3)                              │
│  │  ├─ /s/majors (专业对比 B2)                                    │
│  │  ├─ /s/radar (新专业雷达 S3)                                   │
│  │  ├─ /s/calculator (GPA / ROI / 费用)                           │
│  │  └─ /s/cases (案例库)                                          │
│  └─ /f/* (家庭端)                                                  │
│     ├─ /f/home (首屏)                                              │
│     ├─ /f/school/[slug] (学校故事)                                │
│     ├─ /f/major/[id] (专业解读)                                    │
│     ├─ /f/policy (政策解读)                                        │
│     └─ /f/case/[id] (案例)                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 模块依赖图

```
A1 学校字段 ──┬──> B1 学校深度页
              │
A2 专业数据 ──┼──> B2 专业对比
              │
A5 第三方 ────┼──> B3 时序可视化
              │
A6 爬虫 ──────┴──> S3 新专业雷达
                  └──> 单校专题

DataEnvelope <── 所有 B/S 模块的接口契约
Data Provenance Card <── 所有字段的可信度标注
Data Staleness Indicator <── 所有字段的时效标注
```

---

## 2. v2 启动版核心清单（14 项）

### 数据底座（5 项）

| # | 模块 | 一句话 | 优先级 |
|---|---|---|---|
| 1 | v1 数据补齐 | 恢复 124 detail JSON + 35 POI + 7 字段 | P0 |
| 2 | A1 学校字段补齐 | 借鉴启德 + 选校帝 = 30+ 字段 | P0 |
| 3 | A2 专业级数据 | 借鉴选校帝 7 大类 200+专业 → v2 50+ | P0 |
| 4 | A5 第三方接入 | US News / IPEDS / College Scorecard | P0 |
| 5 | A6 半自动爬虫 | RSS/Newsletter + 编辑触发 + AI 辅助 | P0 |

### 核心功能（5 项）

| # | 模块 | 一句话 | 优先级 |
|---|---|---|---|
| 6 | B1 学校深度页 | 30+ 字段 + verified + missing + 时序入口 | P0 |
| 7 | B2专业对比 | 8-12 个专业跨校对比（0 竞品做） | P0 |
| 8 | B3 时序可视化 | 折线图（0 竞品） | P0 |
| 9 | S3 新专业雷达 | 半自动 + AI 解读（0 竞品） | P0 |
| 10 | 单校专题 | 5-10校 × 5篇（借鉴百利天下） | P0 |

### 借鉴模块（3 项）

| # | 模块 | 一句话 | 优先级 |
|---|---|---|---|
| 11 | 案例库 | 借鉴选校帝 17,448 + 三维度交叉 | P0 |
| 12 | GPA计算器 | 借鉴选校帝 6 算法 → v2 至少 3 种 | P0 |
| 13 | ROI计算器 | 借鉴新东方投资回报计算 | P0 |

### 增量改进（1 项 = 4 子项）

| # | 子项 | 一句话 | 优先级 |
|---|---|---|---|
| 14a | 数据出处卡片 | 每个字段标 source + asOf + verified | P0 |
| 14b | 数据新鲜度指示 | <30 天绿 / 30-90 天黄 / >90 天红 | P0 |
| 14c | 跨源数据调和 | US News + QS + THE + 调和规则 | P0 |
| 14d | 对比分享卡 | 对比结果可视化 + 一键分享 | P0 |

---

## 3. 每个功能模块的完整规范

### 格式说明

每个模块按 9 个维度：
1. **用户故事**（As / I want / So that）
2. **UI 规格**（页面路径 / 关键组件 / ASCII 布局）
3. **技术栈**（库 / API / 模式）
4. **数据模型**（zod schema + TypeScript 类型）
5. **实现步骤**（Week × 任务）
6. **状态管理**（Server Component / useState / useReducer）
7. **错误处理**（fallback / loading / empty）
8. **验收标准**（自动化测试 + 人工 checklist）
9. **学习资源**（指向上文竞品 / 文档）

---

### 模块 #1：v1 数据补齐

**用户故事**：As PathOS v2 开发者 I want to 恢复被删除的 124 个 detail JSON + 补 35 所 POI + 解析 7 个 P0 字段 So that v2 启动版有可靠的数据基础

**UI 规格**：无（数据层任务）

**技术栈**：Git history + Node.js + TypeScript + zod + IECG docx parser

**实现步骤**：

**Week 1：恢复 124 detail JSON**
```bash
COMMIT=$(git log --diff-filter=D --pretty=format:"%H" -1 -- "PathOS-db-ranking-standalone/data-pipeline/artifacts/stage5-warning-aware-preview/university-details/candidate-v2:princeton-university.json")
git checkout $COMMIT -- "PathOS-db-ranking-standalone/data-pipeline/artifacts/stage5-warning-aware-preview/university-details/"
cp -r "PathOS-db-ranking-standalone/data-pipeline/artifacts/stage5-warning-aware-preview/university-details/"* "frontend/data/preview/university-details/"
```

**Week 2：补 35 所 POI（62 → 97）+ 解析 7 个 P0 字段**
修改 `frontend/src/lib/guide-preview.ts` parser。参考 commit `f0a81a3`。

**7 个字段**：`usNewsRanks / programs / midRangeScores / classSize / testPolicy / curriculumSummary / curriculumUrl`

**错误处理**：
- git 历史中找不到文件 → 标记"需要重新 ETL"
- 35 POI 数据不完整 → 用 IECG docx 重新解析

**验收标准**：
```bash
ls data/preview/university-details/ | wc -l    # 期望：62+
cat data/preview/universities.json | jq 'length'    # 期望：97
npx tsc --noEmit    # 期望：0 错误
```

**学习资源**：
- `PATHOS-DATA-FILL-GAPS.md`
- `PATHOS-DEEP-AUDIT-2026-09-17.md`
- Commit `f0a81a3 / 9768b33 / a091aa2 / 3ecdfee / dcbd287`

---

### 模块 #2：A1 学校字段补齐

**用户故事**：As 顾问 I want to 看一所学校的 30+ 完整字段 So that 我能做出专业的选校判断

**技术栈**：IECG docx parser + A5 + zod schema

**数据模型**：
```typescript
// frontend/src/schemas/university-detail.schema.ts
import { z } from "zod";

const FieldMetaSchema = z.object({
  source: z.enum(["IECG", "IPEDS", "US News", "College Scorecard", "学校官网", "编辑部"]),
  sourceUrl: z.string().url().optional(),
  asOf: z.string().datetime(),
  verifiedBy: z.string().optional(),
  confidence: z.number().min(0).max(100).optional(),
});

const RankingSchema = z.object({
  qs: z.object({ value: z.number().nullable(), ...FieldMetaSchema.shape }),
  usNews: z.object({ value: z.number().nullable(), ...FieldMetaSchema.shape }),
  the: z.object({ value: z.number().nullable(), ...FieldMetaSchema.shape }),
  reconciliationNote: z.string().optional(),
});

const FinancialSchema = z.object({
  tuition: z.array(z.object({
    degree: z.enum(["bachelor", "master", "phd"]),
    type: z.enum(["highest", "lowest"]),
    amountRMB: z.number().nullable(),
    ...FieldMetaSchema.shape,
  })),
  accommodation: z.number().nullable(),
  livingCost: z.object({ min: z.number(), max: z.number() }).nullable(),
  applicationFee: z.number().nullable(),
});

const RequirementSchema = z.object({
  degree: z.enum(["bachelor", "master", "phd"]),
  language: z.object({
    toefl: z.number().nullable(),
    ielts: z.number().nullable(),
    duolingo: z.number().nullable(),
    ...FieldMetaSchema.shape,
  }),
  standardized: z.object({
    sat: z.number().nullable(),
    act: z.number().nullable(),
    gre: z.number().nullable(),
    gmat: z.number().nullable(),
    ...FieldMetaSchema.shape,
  }),
});

const TimeSeriesPointSchema = z.object({
  semester: z.string(),
  sat: z.number().nullable(),
  gpa: z.number().nullable(),
  acceptanceRate: z.number().min(0).max(1).nullable(),
  tuitionUSD: z.number().nullable(),
  ...FieldMetaSchema.shape,
});

export const UniversityDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.object({ zh: z.string(), en: z.string() }),
  location: z.object({
    country: z.string(),
    state: z.string().optional(),
    city: z.string(),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  }),
  ranking: RankingSchema,
  financial: FinancialSchema,
  requirement: z.array(RequirementSchema),
  timeSeries: z.array(TimeSeriesPointSchema).optional(),
  majorStrengths: z.array(z.object({
    majorName: z.string(),
    category: z.enum(["engineering", "business", "science", "social", "arts", "agriculture", "life_health"]),
    strengthRank: z.enum(["top_5", "top_10", "top_20", "top_50", "top_100"]).nullable(),
    ...FieldMetaSchema.shape,
  })).optional(),
  history: z.string().optional(),
  notableAlumni: z.array(z.string()).optional(),
  facilities: z.string().optional(),
  lastUpdated: z.string().datetime(),
  dataEnvelope: z.object({
    status: z.enum(["ready", "empty", "stale", "error"]),
    source: z.string(),
    version: z.string(),
  }),
});

export type UniversityDetail = z.infer<typeof UniversityDetailSchema>;
```

**实现步骤**：

**Week 3：A1 字段补齐（5-10 所学校）**
1. 启德字段映射（参考 `competitor-research/raw-eic-school_detail_358.html`）
2. 选校帝字段映射（参考 `competitor-research/raw-xxd-school_6.html`）
3. 爬学校官网补缺失
4. 接入 IPEDS / College Scorecard

**Week 4：7 字段解析 + verified 100% 标注**

**验收标准**：
```bash
npm run build
npm test -- --grep "university-detail"
# 人工抽查 3 所学校
```

**学习资源**：
- `competitor-research/raw-eic-school_detail_358.html`
- `competitor-research/raw-xxd-school_6.html`

---

### 模块 #3：A2 专业级数据

**数据模型**：
```typescript
export const MajorCategoryEnum = z.enum([
  "engineering", "business", "science", "social", "arts", "agriculture", "life_health"
]);

export const MajorSchema = z.object({
  id: z.string(),
  name: z.object({ zh: z.string(), en: z.string() }),
  category: MajorCategoryEnum,
  description: z.string(),
  schoolComparison: z.array(z.object({
    schoolId: z.string(),
    schoolName: z.object({ zh: z.string(), en: z.string() }),
    programRank: z.number().nullable(),
    acceptanceRate: z.number().min(0).max(1).nullable(),
    enrollmentCount: z.number().nullable(),
    tuitionUSD: z.number().nullable(),
    graduationSalaryUSD: z.number().nullable(),
  })),
  suitability: z.object({
    interests: z.array(z.string()),
    strengths: z.array(z.string()),
    careers: z.array(z.string()),
  }),
  timeSeries: z.array(z.object({
    semester: z.string(),
    acceptanceRate: z.number().nullable(),
  })).optional(),
  cases: z.array(z.string()),
});

export const MAJOR_CATALOG = {
  engineering: [
    "computer-science", "electrical-engineering", "mechanical-engineering",
    "civil-engineering", "chemical-engineering", "biomedical-engineering",
    "aerospace-engineering", "materials-science", "industrial-engineering",
    "computer-engineering", "software-engineering", "environmental-engineering",
  ],
  business: [
    "finance", "accounting", "marketing", "management", "entrepreneurship",
    "financial-engineering", "business-analytics", "economics-business",
  ],
  science: [
    "mathematics", "physics", "chemistry", "biology", "statistics",
    "computer-science-theory", "artificial-intelligence", "data-science",
  ],
  social: [
    "psychology", "economics", "political-science", "sociology",
    "communications", "anthropology", "linguistics", "international-relations",
  ],
  arts: [
    "architecture", "fine-arts", "music", "philosophy", "history",
    "english-literature", "design", "film-studies",
  ],
  agriculture: ["agricultural-engineering", "food-science", "plant-science"],
  life_health: ["biology-biomedical", "pre-med", "pharmacy", "public-health", "nursing"],
};
```

**学习资源**：`competitor-research/raw-xxd-major-lib.html.html`（选校帝 7 大类）

---

### 模块 #4：A5 第三方接入

**技术栈**：fetch + zod + DataEnvelope

**实现**：
```typescript
// frontend/src/server/integrations/ipeds.ts
export async function fetchIPEDSData(universityName: string) {
  const params = new URLSearchParams({
    school_name: universityName,
    fields: "id,name,state,school_url,enrollment,admission_rate,tuition,in_state_tuition,avg_sat,avg_act,graduation_rate",
  });
  const url = `https://educationdata.urban.org/api/v1/college-university/ipeds/fall-enrollment/2022/?${params}`;

  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) return null;
  const data = await response.json();
  return data.results?.[0] ?? null;
}

// frontend/src/server/integrations/college-scorecard.ts
const SCORECARD_API_KEY = process.env.COLLEGE_SCORECARD_API_KEY!;

export async function fetchScorecardData(unitId: string) {
  const url = `https://api.data.gov/ed/collegescorecard/v1/schools?id=${unitId}&fields=school.name,latest.cost.attendance,latest.earnings.6_yrs_after_entry&api_key=${SCORECARD_API_KEY}`;
  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) return null;
  const data = await response.json();
  return data.results?.[0] ?? null;
}
```

**错误处理**：API 不可用 → fallback IECG + confidence: 50

---

### 模块 #5：A6 半自动爬虫

**技术栈**：rss (npm) + cheerio + SingleFile CLI + AI 起草（DeepSeek/GPT）

**实现**：
```typescript
// frontend/src/server/radar/subscriptions.ts
export interface SchoolSubscription {
  schoolId: string;
  rssUrls: string[];
  newsletters: string[];
  twitterHandles: string[];
}

export const SUBSCRIPTIONS: SchoolSubscription[] = [
  {
    schoolId: "princeton-university",
    rssUrls: [],
    newsletters: ["admission@princeton.edu"],
    twitterHandles: [],
  },
];

// frontend/src/server/radar/event-creator.ts
export async function createNewMajorEvent(
  schoolId: string,
  programName: string,
  sourceUrl: string,
  rawContent: string
) {
  const aiDraft = await aiClient.draft({
    prompt: `基于以下学校${schoolId}的新专业${programName}信息，写 500 字解读：${rawContent}`,
    model: "deepseek-chat",
  });

  const event = {
    id: generateUUID(),
    schoolId,
    programName,
    sourceUrl,
    discoveredAt: new Date().toISOString(),
    status: "draft" as const,
    aiDraft,
    editorFinal: null,
    suitabilityTags: await aiClient.extractTags(aiDraft),
    publishedAt: null,
    versionHistory: [{ at: new Date().toISOString(), change: "created" }],
  };

  await db.saveEvent(event);
  return event;
}
```

---

### 模块 #6：B1 学校深度页（核心 UI）

**页面路径**：`/s/[slug]`（学校端）/ `/f/school/[slug]`（家庭端）

**ASCII 布局**（学校端 `/s/[slug]`）：
```
┌─────────────────────────────────────────────────────────┐
│ [NavBar: 学校端]                          [校徽 Princeton]│
├─────────────────────────────────────────────────────────┤
│  Princeton University 普林斯顿大学                       │
│  ┌──────────────────┐  ┌──────────────────────────────┐│
│  │ [大图 + 校徽]    │  │ ✓ Verified by IECG           ││
│  │                  │  │ Last updated: 2024-08-15 🟢   ││
│  └──────────────────┘  └──────────────────────────────┘│
│                                                          │
│  US News #1 | QS #12 | THE #7 [跨源调和]                  │
│  [查看 5 年趋势 📊] [对比其他学校 ⚖️] [新专业雷达 🆕]    │
│                                                          │
│  📋 财务信息 (学位 × 类型 × 金额)                        │
│  ┌─────────┬───────┬───────┬─────────┐                  │
│  │ 学位    │ 最高  │ 最低  │ 来源    │                  │
│  │ Bachelor│ $82,000│ $82,000│ IECG 📅│                  │
│  │ Master  │ $84,000│ $84,000│ IPEDS  📅│                  │
│  └─────────┴───────┴───────┴─────────┘                  │
│                                                          │
│  📚 录取要求                                              │
│  📊 时序数据                                              │
│  🎓 强势专业                                              │
│  📅 学校历史时间轴                                         │
│  👥 知名校友                                              │
└─────────────────────────────────────────────────────────┘
```

**技术栈**：Next.js 14 Server Component + Tailwind + shadcn/ui + Recharts + zod

**实现**：
```typescript
// frontend/src/app/s/[slug]/page.tsx
import { notFound } from "next/navigation";
import { SchoolDetailView } from "@/components/school/SchoolDetailView";
import { getUniversityDetail } from "@/server/university-detail";

export default async function SchoolPage({ params }: { params: { slug: string } }) {
  const detail = await getUniversityDetail(params.slug);
  if (!detail) notFound();
  return <SchoolDetailView detail={detail} />;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const detail = await getUniversityDetail(params.slug);
  if (!detail) return {};
  return {
    title: `${detail.name.zh} ${detail.name.en} | PathOS`,
    description: `${detail.ranking.usNews.value} 名、学费 ${detail.financial.tuition[0].amountRMB}`,
  };
}

// frontend/src/components/school/SchoolDetailView.tsx
export function SchoolDetailView({ detail }: { detail: UniversityDetail }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <SchoolHeader detail={detail} />
      <RankingCard ranking={detail.ranking} />
      <FinancialTable financial={detail.financial} />
      <RequirementTable requirement={detail.requirement} />
      <TimeSeriesEntry slug={detail.slug} />
      <MajorStrengthsGrid majors={detail.majorStrengths} />
      <DataProvenanceCard detail={detail} />
    </div>
  );
}

// frontend/src/components/data/DataProvenanceCard.tsx
export function DataProvenanceCard({ detail }: { detail: UniversityDetail }) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold">数据出处</h3>
      <ul className="space-y-2 text-sm">
        <li>排名：US News <DataProvenanceBadge meta={detail.ranking.usNews} /></li>
        <li>学费：IECG <DataProvenanceBadge meta={detail.financial.tuition[0]} /></li>
      </ul>
    </Card>
  );
}

// frontend/src/components/data/DataStalenessIndicator.tsx
export function DataStalenessIndicator({ asOf }: { asOf: string }) {
  const days = Math.floor((Date.now() - new Date(asOf).getTime()) / (1000 * 60 * 60 * 24));
  const color = days < 30 ? "bg-green-500" : days < 90 ? "bg-yellow-500" : "bg-red-500";
  return (
    <Tooltip content={`采集于 ${asOf}`}>
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
    </Tooltip>
  );
}
```

**验收**：
```bash
npm run build
npm test -- --grep "school-detail"
# 人工：5-10 所学校页面完整
```

---

### 模块 #7：B2 专业对比

**页面**：`/s/majors` + `/s/major/[id]`

**实现**：
```typescript
// frontend/src/components/major/SchoolComparisonTable.tsx
export function SchoolComparisonTable({ schools }: { schools: MajorSchoolComparison[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>学校</TableHead>
          <TableHead>排名</TableHead>
          <TableHead>录取率</TableHead>
          <TableHead>招生人数</TableHead>
          <TableHead>学费/年</TableHead>
          <TableHead>起薪</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schools.map((s) => (
          <TableRow key={s.schoolId}>
            <TableCell>{s.schoolName.zh}</TableCell>
            <TableCell>{s.programRank ?? "暂无"}<DataProvenanceBadge meta={s} /></TableCell>
            <TableCell>{s.acceptanceRate ? `${(s.acceptanceRate * 100).toFixed(1)}%` : "暂无"}</TableCell>
            <TableCell>{s.enrollmentCount ?? "暂无"}</TableCell>
            <TableCell>${s.tuitionUSD?.toLocaleString() ?? "暂无"}</TableCell>
            <TableCell>${s.graduationSalaryUSD?.toLocaleString() ?? "暂无"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// frontend/src/components/major/MajorTimeSeries.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export function MajorTimeSeries({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <LineChart width={800} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="semester" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="acceptanceRate" stroke="#8884d8" />
      <Line type="monotone" dataKey="tuitionUSD" stroke="#82ca9d" />
    </LineChart>
  );
}
```

---

### 模块 #8：B3 时序可视化

**页面**：`/s/timeseries?schools=mit,stanford&metric=sat`

**实现**：
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot } from "recharts";

const POLICY_EVENTS = [
  { id: "sat-cancel-2024", semester: "2024-spring", title: "SAT 标化可选政策" },
];

export function TimeSeriesChart({ data, metric, schools }) {
  return (
    <LineChart width={1000} height={500} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="semester" />
      <YAxis />
      <Tooltip />
      <Legend />
      {schools.map((schoolId, idx) => (
        <Line
          key={schoolId}
          type="monotone"
          dataKey={`${schoolId}.${metric}`}
          stroke={COLORS[idx]}
          name={schoolId}
        />
      ))}
      {POLICY_EVENTS.map((event) => (
        <ReferenceDot key={event.id} x={event.semester} r={8} fill="red" label={event.title} />
      ))}
    </LineChart>
  );
}
```

---

### 模块 #9：S3 新专业雷达

**数据模型**：
```typescript
export const NewMajorEventSchema = z.object({
  id: z.string().uuid(),
  schoolId: z.string(),
  programName: z.string(),
  sourceUrl: z.string().url(),
  discoveredAt: z.string().datetime(),
  status: z.enum(["draft", "review", "published"]),
  aiDraft: z.string(),
  editorFinal: z.string().nullable(),
  suitabilityTags: z.array(z.string()),
  publishedAt: z.string().datetime().nullable(),
  versionHistory: z.array(z.object({
    at: z.string().datetime(),
    change: z.string(),
  })),
});
```

---

### 模块 #11：案例库

**数据模型**：
```typescript
export const CaseSchema = z.object({
  id: z.string(),
  fromSchool: z.string().optional(),
  fromMajor: z.string().optional(),
  toSchool: z.string(),
  toMajor: z.string(),
  toDegree: z.enum(["bachelor", "master", "phd"]),
  gpa: z.number().nullable(),
  sat: z.number().nullable(),
  toefl: z.number().nullable(),
  essayExcerpt: z.string().optional(),
  activities: z.array(z.string()),
  admissionYear: z.number(),
  isPublic: z.boolean(),
});
```

---

### 模块 #12：GPA 计算器

**页面**：`/s/calculator/gpa`

**算法**（至少 3 种）：
```typescript
const STANDARD_4_0 = (score: number): number => {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.0;
  if (score >= 70) return 2.0;
  if (score >= 60) return 1.0;
  return 0;
};

const IMPROVED_4_0_A = (score: number): number => {
  if (score >= 90) return 4.0;
  if (score >= 85) return 3.7;
  if (score >= 82) return 3.3;
  // ... 改进算法
};

const BEIDA_4_0 = (score: number): number => {
  if (score >= 90) return 4.0;
  if (score >= 85) return 3.7;
  // ... 北大算法
};
```

---

### 模块 #13：ROI 计算器

**页面**：`/s/calculator/roi`

**算法**：
```typescript
function calculatePayback(totalCost: number, expectedSalary: number, growthRate: number = 0.05): number {
  let cumulative = 0;
  let salary = expectedSalary;
  for (let year = 1; year <= 30; year++) {
    cumulative += salary;
    if (cumulative >= totalCost) return year;
    salary *= (1 + growthRate);
  }
  return -1;  // 永不回本
}
```

---

## 4. AI 执行规范

### 4.1 启动命令

```bash
cd D:\pathOS
git checkout codex/v2-scaffold
cd frontend
npm install
npm run dev -- -p 3017
```

### 4.2 每个模块的 AI 工作流

```
1. 读取本文档对应章节
2. 读取 V2-OPEN-DECISIONS.md 确认已解决的决策
3. 读取 V2-SCAFFOLD-CHECKLIST.md 确认对应验收项
4. 按"实现步骤"按周执行
5. 按"验收标准"自检
6. 提交 git commit
```

---

## 5. 里程碑

| 里程碑 | Week | 完成标准 |
|---|---|---|
| M1 骨架完成 | 8 | 6 项硬标准全部达标 |
| M2 中期验证 | 14 | 5 所学校的 B1 + B3 内容齐全 |
| M3 启动版完成 | 20 | 全部 14 项核心齐全 |

---

## 6. AI 自检清单

每个模块完成后：
- [ ] 实现了"实现步骤"中所有 Week X 任务？
- [ ] 满足"验收标准"中所有项？
- [ ] 数据模型使用 zod 校验？
- [ ] 每个字段都有 verified + asOf？
- [ ] missing-first 占位完整？
- [ ] 数据新鲜度颜色编码正确？
- [ ] TypeScript 0 错误？
- [ ] ESLint 0 警告？
- [ ] 单元测试通过？
- [ ] Git commit 信息清楚？

---

**学习资源**（已抓取的竞品数据，47 个文件 ~2.5 MB）：
- `competitor-research/raw-eic-school_detail_358.html`（启德哈佛详情页）
- `competitor-research/raw-xxd-school_6.html.html`（选校帝斯坦福详情页）
- `competitor-research/raw-xxd-major-lib.html.html`（选校帝 7 大类专业库）
- `competitor-research/raw-xxd-offer.html`（选校帝 17,448 案例库）
- `competitor-research/RESEARCH-REPORT.md`（深度研究报告）
