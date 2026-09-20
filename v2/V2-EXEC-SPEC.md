# PathOS v2 EXEC SPEC（AI 执行手册）v2.1

> **核心目的**：任何 AI 拿到这份文档都能做出与 v2 启动版完全一样的效果。
>
> 本文档是 v2 启动版的"宪法 + 操作手册"。
>
> **v2.1 修订**：基于第一轮研究修复 50 个问题（IPEDS URL / GPA 算法 / ROI 算法 / 缺失类型 / git checkout / FieldMetaSchema / v1 资产复用 / 路由统一 / 35 POI 过时任务等）

---

## 0. 文档导航

| 文档 | 用途 |
|---|---|
| **V2-EXEC-SPEC.md**（本文） | 主执行手册：每个功能的完整规范 |
| **V2-UI-SPEC.md** | UI 设计系统：tokens、组件、布局、交互 |
| **V2-SKILLS.md** | 可用 Skills 清单 |
| **V2-VERIFY.md** | AI 验收标准 |

**配套**：
- `V2-BLUEPRINT.md` - 共识蓝图
- `V2-SCAFFOLD-CHECKLIST.md` - 骨架验收清单（6 项硬标准）
- `V2-OPEN-DECISIONS.md` - 待对齐决策（D1-D12）
- `plans/5-10-schools.md` - 5-10 所学校候选名单

---

## 1. v2 全景架构

### 1.1 数据流图

```
Data Sources → ETL → Backend → BFF → Frontend

Sources: v1 IECG docx (88-97 校) + US News + IPEDS + College Scorecard
         + 学校官网 (RSS/Newsletter) + 选校帝 7 大类
Backend: PathOS-db-ranking-standalone (JSON Schema + zod)
BFF: Next.js 14 /api/pathos/preview + DataEnvelope wrapper
Frontend: Next.js 14 App Router

Routes:
- /s/* (学校端): home / map / compare / timeseries / majors / major/[id] / radar / calculator / calculator/gpa / calculator/roi / cases / topic/[school-slug]/[article-slug] / [slug]
- /f/* (家庭端): home / school/[slug] / major/[id] / policy / case/[id] / calculator/roi
```

### 1.2 v1 资产复用（关键：不重建）

v2 必须复用以下 v1 已有组件 + 类型：

```typescript
// 1. 复用 ProvenanceBadge
import { ProvenanceBadge } from "@/components/university/ProvenanceBadge";

// 2. 复用 StatusDictionaryMap
import type { StatusDictionaryMap, ProvenanceStatus } from "@/domain/dataset";

// 3. 复用 UniversityProfilePanel（基础上升级，不是重写）
import { UniversityProfilePanel } from "@/components/university/UniversityProfilePanel";

// 4. 复用 v1 frontend-fields 字段（已在 @/domain/dataset）
import type {
  RankingBand, RankingTier, AnnualCostRmb, SafetyScore,
  RecognitionScore, ChineseCommunity, DirectFlight, PostStudyVisa,
  Programs, ParentHighlights, StudentHighlights, Nearby
} from "@/domain/dataset";

// 5. 复用 DataEnvelope（来自 PATHOS-DEEP-AUDIT-2026-09-17.md §7.1）
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

**v1 资产文件路径**：
- `frontend/src/components/university/ProvenanceBadge.tsx`（6 状态 + tone 配色）
- `frontend/src/components/university/UniversityProfilePanel.tsx`（33KB 完整学校面板）
- `frontend/src/domain/dataset.ts`（含 StatusDictionaryMap / ProvenanceStatus）
- `PathOS-db-ranking-standalone/data-pipeline/schemas/v1/frontend-fields.json`（v1 已定义 11+ 字段）

### 1.3 模块依赖图

```
A1 学校字段 ──┬──> B1 学校深度页
A2 专业数据 ──┼──> B2专业对比
A5 第三方 ────┼──> B3 时序可视化
A6 爬虫 ──────┴──> S3 新专业雷达 + 单校专题

DataEnvelope <── 所有 B/S 模块的接口契约
ProvenanceBadge (v1) <── 所有字段的可信度标注
DataStalenessIndicator <── 所有字段的时效标注
```

---

## 2. v2 启动版核心清单（14 项）

### 数据底座（5 项）

| # | 模块 | 一句话 | 优先级 |
|---|---|---|---|
| 1 | v1 数据完整性验证 | v1 已有 97 所 + 904 records（**不再补 35 POI**） | P0 |
| 2 | A1 学校字段补齐 | v1 11 字段 + v2 增量 20 字段 = **30+ 字段** | P0 |
| 3 | A2专业级数据 | 选校帝 7 大类 200+ → v2 50+ | P0 |
| 4 | A5 第三方接入 | US News + IPEDS + College Scorecard | P0 |
| 5 | A6 半自动爬虫 | RSS/Newsletter + 编辑触发 + AI | P0 |

### 核心功能（5 项）

| # | 模块 | 一句话 | 优先级 |
|---|---|---|---|
| 6 | B1 学校深度页 | v1 UniversityProfilePanel 升级 | P0 |
| 7 | B2 专业对比 | 8-12 个专业跨校对比（0 竞品） | P0 |
| 8 | B3 时序可视化 | 折线图（0 竞品） | P0 |
| 9 | S3 新专业雷达 | 半自动 + AI（0 竞品） | P0 |
| 10 | 单校专题 | 5-10 校 × 5 篇 | P0 |

### 借鉴模块（3 项）

| # | 模块 | 优先级 |
|---|---|---|
| 11 | 案例库（选校帝 17,448 借鉴） | P0 |
| 12 | GPA 计算器（3 种算法） | P0 |
| 13 | ROI 计算器（新东方借鉴） | P0 |

### 增量改进（4 子项）

14a 数据出处卡片 / 14b 数据新鲜度指示 / 14c 跨源数据调和 / 14d 对比分享卡

---



### 模块 #1：v1 数据完整性验证

**用户故事**：As PathOS v2 开发者 I want to 验证 v1 数据完整 So that v2 启动版有可靠的 97 所学校基础

**技术栈**：Git + Node.js + zod

**重要**：**v1 已经有 97 所学校**（commit dcbd287 完成 35 POI backfill），v2 **不再补 35 POI**。

**实现步骤**：

**Week 1：验证 v1 数据完整性**
```bash
# 1. 验证 v1 已有 97 所学校
cd frontend
node -e "const u = require('./data/preview/universities.json'); console.log('Schools count:', u.length);"
# 期望输出：Schools count: 97

# 2. 验证 v1 detail JSON 数量
ls data/preview/university-details/ | wc -l
# 期望：62+

# 3. 补齐 7 个 P0 字段解析（详见 PATHOS-DATA-FILL-GAPS.md §2）
# 修改 frontend/src/lib/guide-preview.ts，参考 commit f0a81a3

# 4. 区域数据补齐（4 项指标当前 records=[]）
# 需要新数据源：US Census ACS / Numbeo / 学校官网
```

**关键：git checkout 在 Windows 上不能用（路径含 `:`）**

```bash
# ❌ 错误：Windows 文件系统对 : 不友好，会报错
git checkout $COMMIT -- "PathOS-db-ranking-standalone/data-pipeline/artifacts/stage5-warning-aware-preview/university-details/candidate-v2:princeton-university.json"

# ✅ 正确：用 git show + 重定向
COMMIT=$(git log --diff-filter=D --pretty=format:"%H" -1 -- "*candidate-v2:princeton-university.json")
mkdir -p data/preview/university-details
git show $COMMIT:"PathOS-db-ranking-standalone/data-pipeline/artifacts/stage5-warning-aware-preview/university-details/candidate-v2:princeton-university.json" > "data/preview/university-details/candidate-v2:princeton-university.json"
```

**验收标准**：
```bash
cd frontend
node -e "const u = require('./data/preview/universities.json'); console.log('Schools count:', u.length);"  # 97
ls data/preview/university-details/ | wc -l  # 62+
npx tsc --noEmit  # 0 错误
```

**学习资源**：PATHOS-DATA-FILL-GAPS.md、commit dcbd287/f0a81a3

---

### 模块 #2：A1 学校字段补齐

**用户故事**：As 顾问 I want to 看一所学校的 30+ 完整字段 So that 我能做出专业的选校判断

**技术栈**：v1 frontend-fields.json + zod schema 扩展

**数据模型**：

```typescript
// frontend/src/schemas/university-detail.schema.ts
import { z } from "zod";
import { FieldMetaSchema } from "./field-meta.schema";

// 1. 保留 v1 所有字段
const V1Fields = {
  rankingBand: z.string().min(1),
  rankingTier: z.enum(["top20", "top50", "top100", "other"]),
  annualCostRmb: z.number().min(0),
  safetyScore: z.number().min(0).max(100),
  recognitionScore: z.number().min(0).max(100),
  chineseCommunity: z.enum(["low", "medium", "high"]),
  directFlight: z.boolean(),
  postStudyVisa: z.string(),
  programs: z.array(z.string()),
  parentHighlights: z.array(z.string()),
  studentHighlights: z.array(z.string()),
  nearby: z.object({
    subwayStations: z.number().nullable(),
    chineseRestaurants: z.number().nullable(),
    asianGroceries: z.number().nullable(),
    avgRentRmb: z.number().nullable(),
  }),
};

// 2. v2 增量字段
const RankingCrossSourceSchema = z.object({
  qs: z.object({ value: z.number().nullable(), ...FieldMetaSchema.shape }),
  usNews: z.object({ value: z.number().nullable(), ...FieldMetaSchema.shape }),
  the: z.object({ value: z.number().nullable(), ...FieldMetaSchema.shape }),
  reconciliationNote: z.string().optional(),
});

const TuitionDetailSchema = z.object({
  degree: z.enum(["bachelor", "master", "phd"]),
  type: z.enum(["highest", "lowest"]),
  amountRMB: z.number().nullable(),
  asOf: z.string().datetime(),
  source: z.enum(["IECG", "IPEDS", "College Scorecard", "学校官网", "编辑部"]),
  verifiedBy: z.string().optional(),
});

const FinancialSchema = z.object({
  tuition: z.array(TuitionDetailSchema),  // 学位 × 类型 × 最高/最低
  accommodation: z.number().nullable(),
  livingCost: z.object({ min: z.number(), max: z.number() }).nullable(),
  applicationFee: z.number().nullable(),
  ...FieldMetaSchema.shape,
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
  semester: z.string(),  // 'YYYY-fall' 或 'YYYY-spring'
  sat: z.number().nullable(),
  gpa: z.number().nullable(),
  acceptanceRate: z.number().min(0).max(1).nullable(),
  tuitionUSD: z.number().nullable(),
  ...FieldMetaSchema.shape,
});

const HistoryEventSchema = z.object({
  year: z.number(),
  title: z.string(),
  description: z.string(),
  ...FieldMetaSchema.shape,
});

const NotableAlumniSchema = z.object({
  category: z.enum(["president", "nobel", "pulitzer", "business", "other"]),
  names: z.array(z.string()),
  ...FieldMetaSchema.shape,
});

const FacilitySchema = z.object({
  type: z.enum(["library", "campus", "lab", "sports", "other"]),
  metric: z.string(),
  value: z.string(),
  ...FieldMetaSchema.shape,
});

// 3. UniversityDetail 主 schema（继承 v1 + 增量）
export const UniversityDetailSchema = z.object({
  // v1 字段（必填）
  ...V1Fields,
  // v2 增量字段
  id: z.string(),
  slug: z.string(),
  name: z.object({ zh: z.string(), en: z.string() }),
  location: z.object({
    country: z.string(),
    state: z.string().optional(),
    city: z.string(),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
    ...FieldMetaSchema.shape,
  }),
  rankingCrossSource: RankingCrossSourceSchema.optional(),
  financial: FinancialSchema.optional(),
  requirement: z.array(RequirementSchema).optional(),
  timeSeries: z.array(TimeSeriesPointSchema).optional(),
  majorStrengths: z.array(z.object({
    majorName: z.string(),
    category: z.enum(["engineering", "business", "science", "social", "arts", "agriculture", "life_health"]),
    strengthRank: z.enum(["top_5", "top_10", "top_20", "top_50", "top_100"]).nullable(),
    ...FieldMetaSchema.shape,
  })).optional(),
  history: z.array(HistoryEventSchema).optional(),
  notableAlumni: z.array(NotableAlumniSchema).optional(),
  facilities: z.array(FacilitySchema).optional(),
  notes: z.array(z.string()).optional(),  // missing-first
  warnings: z.array(z.string()).optional(),
  lastUpdated: z.string().datetime(),
  dataEnvelope: z.object({
    status: z.enum(["ready", "empty", "stale", "error"]),
    source: z.string(),
    version: z.string(),
  }),
});

export type UniversityDetail = z.infer<typeof UniversityDetailSchema>;

// 4. FieldMetaSchema 定义
export const FieldMetaSchema = z.object({
  source: z.enum([
    "IECG",
    "IPEDS",
    "US News",
    "QS",
    "THE",
    "College Scorecard",
    "学校官网",
    "编辑部",
    "竞品研究",
  ]),
  sourceUrl: z.string().url().optional(),
  asOf: z.string().datetime(),
  verifiedBy: z.string().optional(),
  confidence: z.number().min(0).max(100).optional(),
});
```

**字段计数**：v1 11+ + v2 增量 19 = 30+ 字段 ✓

---

### 模块 #3：A2 专业级数据

```typescript
import { FieldMetaSchema } from "./field-meta.schema";

export const MajorCategoryEnum = z.enum([
  "engineering", "business", "science", "social", "arts", "agriculture", "life_health"
]);

export const MajorSchema = z.object({
  id: z.string(),
  name: z.object({ zh: z.string(), en: z.string() }),
  category: MajorCategoryEnum,
  description: z.string(),
  ...FieldMetaSchema.shape,
  schoolComparison: z.array(z.object({
    schoolId: z.string(),
    schoolName: z.object({ zh: z.string(), en: z.string() }),
    programRank: z.number().nullable(),
    acceptanceRate: z.number().min(0).max(1).nullable(),
    enrollmentCount: z.number().nullable(),
    tuitionUSD: z.number().nullable(),
    graduationSalaryUSD: z.number().nullable(),
    ...FieldMetaSchema.shape,
  })),
  suitability: z.object({
    interests: z.array(z.string()),
    strengths: z.array(z.string()),
    careers: z.array(z.string()),
  }),
  timeSeries: z.array(z.object({
    semester: z.string(),
    acceptanceRate: z.number().nullable(),
    ...FieldMetaSchema.shape,
  })).optional(),
  cases: z.array(z.string()),
  lastUpdated: z.string().datetime(),
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
    // 心理学 → social（行为/认知/社会方向）
    "psychology", "economics", "political-science", "sociology",
    "communications", "anthropology", "linguistics", "international-relations",
  ],
  arts: [
    "architecture", "fine-arts", "music", "philosophy", "history",
    "english-literature", "design", "film-studies",
  ],
  agriculture: ["agricultural-engineering", "food-science", "plant-science"],
  // 心理学 → life_health 仅限神经心理学/临床心理学
  life_health: [
    "biology-biomedical", "pre-med", "pharmacy", "public-health", "nursing",
    "clinical-psychology", "neuropsychology",
  ],
};
```

---

### 模块 #4：A5 第三方接入（修复 IPEDS URL）

```typescript
// frontend/src/server/integrations/ipeds.ts
// ✅ 正确 endpoint 和参数
const IPEDS_BASE_URL = "https://educationdata.urban.org/api/v1/college-university/ipeds";

export async function fetchIPEDSData(unitId: number) {
  // 使用 unitid（6 位数字 IPEDS ID）比 school_name 更精确
  const url = `${IPEDS_BASE_URL}/fall-enrollment/2022/?unitid=${unitId}&fields=enrollment_fall_undergrad_12_month,enrollment_fall_grad_12_month,avg_sat_equivalent,avg_act`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) {
      console.error(`IPEDS ${unitId} returned ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data.results?.[0] ?? null;
  } catch (error) {
    console.error("IPEDS fetch failed:", error);
    return null;
  }
}

// ✅ 正确参数：unitid（不是 school_name）
// ✅ 正确字段名：enrollment_fall_ 前缀
```

```typescript
// frontend/src/server/integrations/college-scorecard.ts
const SCORECARD_API_KEY = process.env.COLLEGE_SCORECARD_API_KEY!;
const SCORECARD_BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools";

// ✅ 关键：字段名带点必须 URL-encode
function encodeField(field: string): string {
  return field.replace(/\./g, "%2E");
}

export async function fetchScorecardData(unitId: number) {
  const fields = [
    encodeField("school.name"),
    encodeField("school.state"),
    encodeField("latest.cost.attendance"),
    encodeField("latest.earnings.6_yrs_after_entry"),
  ].join(",");
  
  const url = `${SCORECARD_BASE_URL}?id=${unitId}&fields=${fields}&api_key=${SCORECARD_API_KEY}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) {
      console.error(`Scorecard ${unitId} returned ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data.results?.[0] ?? null;
  } catch (error) {
    console.error("Scorecard fetch failed:", error);
    return null;
  }
}
```

**环境变量**：
```bash
# .env.local
COLLEGE_SCORECARD_API_KEY=your_key_here  # https://api.data.gov/ 注册
US_NEWS_API_KEY=your_key_here            # 可选，订阅
DEEPSEEK_API_KEY=your_key_here          # https://platform.deepseek.com/
```

---



### 模块 #5：A6 半自动爬虫

**完整 SUBSCRIPTIONS（5-10 所学校，不再只有 1 所）**：

```typescript
export interface SchoolSubscription {
  schoolId: string;
  schoolName: { zh: string; en: string };
  rssUrls: string[];
  newsletters: string[];
  twitterHandles: string[];
  instagramHandles: string[];
  rssScanFrequency: 'hourly' | 'daily' | 'weekly';
}

export const SUBSCRIPTIONS: SchoolSubscription[] = [
  {
    schoolId: 'princeton-university',
    schoolName: { zh: '普林斯顿大学', en: 'Princeton University' },
    rssUrls: ['https://admission.princeton.edu/rss.xml'],
    newsletters: ['admission@princeton.edu'],
    twitterHandles: ['@Princeton'],
    instagramHandles: ['@princeton_university'],
    rssScanFrequency: 'daily',
  },
  {
    schoolId: 'harvard-university',
    schoolName: { zh: '哈佛大学', en: 'Harvard University' },
    rssUrls: ['https://college.harvard.edu/admissions/rss'],
    newsletters: ['admissions@harvard.edu'],
    twitterHandles: ['@Harvard'],
    instagramHandles: ['@harvard'],
    rssScanFrequency: 'daily',
  },
  // AI 必须补全 5-10 所学校的完整 SUBSCRIPTIONS
  // 候选学校: princeton-university, harvard-university, yale-university,
  //          mit, stanford-university, columbia-university, upenn,
  //          brown-university, cornell-university, dartmouth-college
];

// NewMajorEvent schema (已补 FieldMetaSchema)
export const NewMajorEventSchema = z.object({
  id: z.string().uuid(),
  schoolId: z.string(),
  programName: z.string(),
  sourceUrl: z.string().url(),
  discoveredAt: z.string().datetime(),
  status: z.enum(['draft', 'review', 'published']),
  aiDraft: z.string().min(200),  // AI 起草至少 200 字
  editorFinal: z.string().nullable(),
  suitabilityTags: z.array(z.string()),
  publishedAt: z.string().datetime().nullable(),
  versionHistory: z.array(z.object({
    at: z.string().datetime(),
    change: z.string(),
    editor: z.string().optional(),
  })),
  ...FieldMetaSchema.shape,
});

// aiClient 实现
import { createDeepSeek } from '@ai-sdk/deepseek';

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY!,
});

export const aiClient = {
  async draft(prompt: string): Promise<string> {
    const result = await deepseek.chat({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 1500,
    });
    return result.choices[0].message.content;
  },
  async extractTags(text: string): Promise<string[]> {
    const result = await deepseek.chat({
      model: 'deepseek-chat',
      messages: [{
        role: 'user',
        content: `从以下文本中提取 3-5 个标签：${text}`,
      }],
      maxTokens: 100,
    });
    return result.choices[0].message.content.split(/[,，]/).map(s => s.trim()).filter(Boolean);
  },
};

// db 实现（文件系统存储）
import fs from 'fs/promises';
import path from 'path';

const EVENTS_DIR = path.join(process.cwd(), 'data/preview/events');

export const db = {
  async saveEvent(event: NewMajorEvent): Promise<void> {
    await fs.mkdir(EVENTS_DIR, { recursive: true });
    const filepath = path.join(EVENTS_DIR, `${event.id}.json`);
    await fs.writeFile(filepath, JSON.stringify(event, null, 2));
  },
  async listEvents(filter?: { status?: string }): Promise<NewMajorEvent[]> {
    const files = await fs.readdir(EVENTS_DIR);
    const events = await Promise.all(
      files.filter(f => f.endsWith('.json')).map(async f =>
        JSON.parse(await fs.readFile(path.join(EVENTS_DIR, f), 'utf-8'))
      )
    );
    return filter?.status ? events.filter(e => e.status === filter.status) : events;
  },
};
```

---

### 模块 #6：B1 学校深度页（修复关键 bug）

**关键**：基于 v1 UniversityProfilePanel 升级，不重写。

```typescript
// frontend/src/app/s/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { SchoolDetailView } from '@/components/school/SchoolDetailView';
import { getUniversityDetail } from '@/server/university-detail';
import type { UniversityDetail } from '@/schemas/university-detail.schema';

export default async function SchoolPage({ params }: { params: { slug: string } }) {
  const detail = await getUniversityDetail(params.slug);
  if (!detail) notFound();
  return <SchoolDetailView detail={detail} />;
}

// generateMetadata：所有 nullable 字段都做 fallback
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const detail = await getUniversityDetail(params.slug);
  if (!detail) return {};
  
  // 使用 ? 可选链处理 nullable
  const usNewsRank = detail.rankingCrossSource?.usNews?.value;
  const tuition = detail.financial?.tuition?.[0]?.amountRMB;
  const majorsCount = detail.majorStrengths?.length ?? 0;
  
  return {
    title: `${detail.name.zh} ${detail.name.en} | PathOS`,
    description: [
      usNewsRank ? `${usNewsRank} 名` : null,
      tuition ? `学费 ${tuition.toLocaleString()}` : null,
      majorsCount > 0 ? `${majorsCount} 个强势专业` : null,
    ].filter(Boolean).join(' | '),
  };
}

// getUniversityDetail 函数
import { promises as fs } from 'fs';
import { UniversityDetailSchema, type UniversityDetail } from '@/schemas/university-detail.schema';

export async function getUniversityDetail(slug: string): Promise<UniversityDetail | null> {
  try {
    const filepath = path.join(process.cwd(), `data/preview/university-details/candidate-v2:${slug}.json`);
    const raw = await fs.readFile(filepath, 'utf-8');
    const data = JSON.parse(raw);
    return UniversityDetailSchema.parse(data);
  } catch (error) {
    console.error(`Failed to load university ${slug}:`, error);
    return null;
  }
}
```

**SchoolDetailView 组件**（基于 v1 UniversityProfilePanel）：

```typescript
// frontend/src/components/school/SchoolDetailView.tsx
// v2 新增的包装组件，不是替换 v1 UniversityProfilePanel
import { ProvenanceBadge } from '@/components/university/ProvenanceBadge';
import { UniversityProfilePanel } from '@/components/university/UniversityProfilePanel';
import { DataProvenanceCard } from '@/components/data/DataProvenanceCard';
import { DataStalenessIndicator } from '@/components/data/DataStalenessIndicator';
import { TimeSeriesEntry } from '@/components/school/TimeSeriesEntry';
import { FinancialTable } from '@/components/school/FinancialTable';
import { RequirementTable } from '@/components/school/RequirementTable';
import { MajorStrengthsGrid } from '@/components/school/MajorStrengthsGrid';
import { HistoryTimeline } from '@/components/school/HistoryTimeline';
import { NotableAlumniGrid } from '@/components/school/NotableAlumniGrid';
import { FacilityGrid } from '@/components/school/FacilityGrid';
import { RankingCard } from '@/components/school/RankingCard';
import type { UniversityDetail } from '@/schemas/university-detail.schema';

export function SchoolDetailView({ detail }: { detail: UniversityDetail }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 头图 + verified 标签 */}
      <header>
        <h1>{detail.name.zh}</h1>
        <h2>{detail.name.en}</h2>
        <ProvenanceBadge status="live_verified_exact" />
        <DataStalenessIndicator asOf={detail.lastUpdated} />
      </header>
      
      {/* 排名（跨源调和） */}
      <RankingCard ranking={detail.rankingCrossSource} />
      
      {/* 财务表 */}
      <FinancialTable financial={detail.financial} />
      
      {/* 录取要求 */}
      <RequirementTable requirement={detail.requirement} />
      
      {/* 时序入口 */}
      <TimeSeriesEntry slug={detail.slug} />
      
      {/* 强势专业 */}
      <MajorStrengthsGrid majors={detail.majorStrengths} />
      
      {/* 历史时间轴（结构化） */}
      <HistoryTimeline history={detail.history} />
      
      {/* 知名校友（分类） */}
      <NotableAlumniGrid alumni={detail.notableAlumni} />
      
      {/* 设施（结构化） */}
      <FacilityGrid facilities={detail.facilities} />
      
      {/* 数据出处卡片 */}
      <DataProvenanceCard detail={detail} />
    </div>
  );
}
```

---

### 模块 #7：B2 专业对比（修复 TimeSeriesPoint 类型）

```typescript
// frontend/src/types/timeseries.ts
export interface TimeSeriesPoint {
  semester: string;
  acceptanceRate?: number | null;
  tuitionUSD?: number | null;
  [key: string]: unknown;
}

// frontend/src/components/major/SchoolComparisonTable.tsx
import { ProvenanceBadge } from '@/components/university/ProvenanceBadge';

export interface MajorSchoolComparison {
  schoolId: string;
  schoolName: { zh: string; en: string };
  programRank?: number | null;
  acceptanceRate?: number | null;
  enrollmentCount?: number | null;
  tuitionUSD?: number | null;
  graduationSalaryUSD?: number | null;
  source: string;
  asOf: string;
}

export function SchoolComparisonTable({ schools }: { schools: MajorSchoolComparison[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>学校</th><th>排名</th><th>录取率</th>
          <th>招生人数</th><th>学费/年</th><th>起薪</th>
        </tr>
      </thead>
      <tbody>
        {schools.map((s) => (
          <tr key={s.schoolId}>
            <td>{s.schoolName.zh} {s.schoolName.en}</td>
            <td>
              {s.programRank ?? <span className="italic">暂无</span>}
              <ProvenanceBadge status="live_verified_exact" />
            </td>
            <td>
              {s.acceptanceRate !== null && s.acceptanceRate !== undefined
                ? `${(s.acceptanceRate * 100).toFixed(1)}%`
                : <span className="italic">暂无</span>}
              <ProvenanceBadge status="live_verified_exact" />
            </td>
            <td>{s.enrollmentCount ?? <span className="italic">暂无</span>}</td>
            <td>{s.tuitionUSD ? `$${s.tuitionUSD.toLocaleString()}` : <span className="italic">暂无</span>}</td>
            <td>{s.graduationSalaryUSD ? `$${s.graduationSalaryUSD.toLocaleString()}` : <span className="italic">暂无</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// frontend/src/components/major/MajorTimeSeries.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { TimeSeriesPoint } from '@/types/timeseries';

export function MajorTimeSeries({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <LineChart width={800} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="semester" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="acceptanceRate" stroke="#8884d8" name="录取率" />
      <Line type="monotone" dataKey="tuitionUSD" stroke="#82ca9d" name="学费" />
    </LineChart>
  );
}
```

---

### 模块 #8：B3 时序可视化（修复 COLORS / 类型 / POLICY_EVENTS）

```typescript
// COLORS 必须定义
const COLORS = ['#1f4e96', '#d65a3c', '#2d8659', '#c8392e', '#8a4fff', '#d4a017', '#1abc9c', '#e67e22', '#34495e', '#16a085'];

// TimeSeriesChartProps 必须定义
export interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  metric: 'sat' | 'gpa' | 'acceptanceRate' | 'tuitionUSD';
  schools: string[];
}

// POLICY_EVENTS 应该从 CMS / API 读取，不是写死
async function getPolicyEvents(): Promise<Array<{ id: string; semester: string; title: string }>> {
  const res = await fetch('/api/policy-events');
  return res.json();
}

export function TimeSeriesChart({ data, metric, schools }: TimeSeriesChartProps) {
  // 转换数据格式：每个学校一行
  const chartData = data.map(point => {
    const row: Record<string, unknown> = { semester: point.semester };
    schools.forEach(schoolId => {
      row[`${schoolId}.${metric}`] = (point as Record<string, unknown>)[schoolId]?.[metric];
    });
    return row;
  });
  
  // 政策事件（动态读取）
  const [events, setEvents] = useState<Array<{ id: string; semester: string; title: string }>>([]);
  useEffect(() => {
    getPolicyEvents().then(setEvents);
  }, []);
  
  return (
    <LineChart width={1000} height={500} data={chartData}>
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
          stroke={COLORS[idx % COLORS.length]}  // % 防止越界
          name={schoolId}
        />
      ))}
      {events.map(event => (
        <ReferenceDot
          key={event.id}
          x={event.semester}
          y={0}  // TODO: 动态计算该 semester 对应的 metric 均值
          r={8}
          fill="red"
          label={event.title}
        />
      ))}
    </LineChart>
  );
}
```

---

### 模块 #9-13（核心规范）

```typescript
// 模块 #10 单校专题
export const ArticleSchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  category: z.enum(['overview', 'admissions', 'majors', 'campus-life', 'new-programs']),
  content: z.string(),
  author: z.string(),
  publishedAt: z.string().datetime(),
  ...FieldMetaSchema.shape,
});

// 模块 #11 案例库（已补 FieldMetaSchema）
export const CaseSchema = z.object({
  id: z.string(),
  fromSchool: z.string().optional(),
  fromMajor: z.string().optional(),
  toSchool: z.string(),
  toMajor: z.string(),
  toDegree: z.enum(['bachelor', 'master', 'phd']),
  gpa: z.number().nullable(),
  sat: z.number().nullable(),
  toefl: z.number().nullable(),
  essayExcerpt: z.string().optional(),
  activities: z.array(z.string()),
  admissionYear: z.number(),
  isPublic: z.boolean(),
  ...FieldMetaSchema.shape,  // ✅ 已补
});

// 模块 #12 GPA 计算器（修复算法）
// 标准 4.0（4 档）
const STANDARD_4_0 = (score: number): number => {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.0;
  if (score >= 70) return 2.0;
  if (score >= 60) return 1.0;
  return 0;
};

// 改进 4.0（一）（12 档分级）
const IMPROVED_4_0_A = (score: number): number => {
  if (score >= 97) return 4.0;
  if (score >= 93) return 4.0;
  if (score >= 90) return 3.7;
  if (score >= 87) return 3.3;
  if (score >= 83) return 3.0;
  if (score >= 80) return 2.7;
  if (score >= 77) return 2.3;
  if (score >= 73) return 2.0;
  if (score >= 70) return 1.7;
  if (score >= 67) return 1.3;
  if (score >= 65) return 1.0;
  if (score >= 60) return 0.7;
  return 0;
};

// 北大 4.0（11 档分级）— ✅ 修复：之前和 IMPROVED 一样是错的
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

export const GPA_ALGORITHMS = {
  standard_4_0: STANDARD_4_0,
  improved_4_0_a: IMPROVED_4_0_A,
  beida_4_0: BEIDA_4_0,
};

// 模块 #13 ROI 计算器（修复 BUG）
function calculatePayback(
  totalCost: number,
  expectedSalary: number,
  growthRate: number = 0.05
): { years: number; cumulative: number } {
  let cumulative = 0;
  let currentSalary = expectedSalary;
  
  for (let year = 1; year <= 40; year++) {
    cumulative += currentSalary;
    if (cumulative >= totalCost) {
      return { years: year, cumulative };
    }
    currentSalary = currentSalary * (1 + growthRate);  // ✅ 修复：每轮增长
  }
  
  return { years: -1, cumulative };
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

### 4.2 Git 提交约定（v2 新增）

**Branch 命名**：
- `codex/v2-<feature-name>`（例：codex/v2-b1-school-detail）
- `codex/v2-<module-id>-<name>`（例：codex/v2-m6-school-page）

**Commit message 格式**：
```
<type>(<scope>): <subject>

<body>

<footer>
```

例：
```
feat(b1): add SchoolDetailView with verified data

- 复用 v1 ProvenanceBadge
- 30+ 字段 verified + missing-first
- 时序 / 跨校对比 / 新专业入口

Refs: V2-EXEC-SPEC.md §模块 #6
```

**Type 类型**：feat / fix / docs / style / refactor / test / chore

### 4.3 每个模块的 AI 工作流

```
1. 读取本文档对应章节
2. 读取 V2-OPEN-DECISIONS.md 确认已解决的决策
3. 读取 V2-SCAFFOLD-CHECKLIST.md 确认对应验收项
4. 按"实现步骤"按周执行
5. 按 V2-VERIFY.md "验收标准"自检
6. 按 Git 约定提交 commit
7. 通知用户
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
- [ ] 满足 V2-VERIFY.md "验收标准"中所有项？
- [ ] 数据模型使用 zod 校验？
- [ ] 每个字段都有 FieldMetaSchema？
- [ ] missing-first 占位完整？
- [ ] 数据新鲜度颜色编码正确？
- [ ] TypeScript 0 错误？
- [ ] ESLint 0 警告？
- [ ] 单元测试通过？
- [ ] Git commit 信息符合规范？

---

## 7. 环境变量清单

| 变量名 | 来源 | 必填 |
|---|---|---|
| `COLLEGE_SCORECARD_API_KEY` | https://api.data.gov/ 注册 | ✅ |
| `US_NEWS_API_KEY` | US News 订阅 | ⚠️ |
| `DEEPSEEK_API_KEY` | https://platform.deepseek.com/ | ✅ |
| `NEXT_PUBLIC_PATHOS_MAP_PROVIDER` | v1 已有 | ⚠️ |
| `PATHOS_DATA_MODE` | v1 已有 | ✅ |

---

**学习资源**：
- v1 资产：`frontend/src/components/university/*`、`PathOS-db-ranking-standalone/data-pipeline/schemas/v1/*`
- 竞品研究：`v2/competitor-research/RESEARCH-REPORT.md`（34 KB）
- v1 审计：`PATHOS-DEEP-AUDIT-2026-09-17.md`
- v1 数据缺口：`PATHOS-DATA-FILL-GAPS.md`

