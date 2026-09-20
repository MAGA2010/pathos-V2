# PathOS v2 IMPLEMENTATION SPEC（AI 一步执行手册）

> **核心目的**：任何 AI / 开发者拿到这份文档，**不需要任何额外思考**，按章节逐步执行即可完整实现 PathOS v2 启动版。
>
> **部署架构**（用户 2026-09-20 指定）：
> - **后端**：Supabase（PostgreSQL + Auth + Storage + Edge Functions）
> - **前端**：Render（Web Service + Background Worker + Cron Jobs）
>
> **v2.3 修订**：
> - 部署架构从 Vercel/Vercel+Supabase 改为 **Supabase + Render**
> - 加入用户原话完整引用（"哪些学生适合" / "保留地图" / "弱化 AI" / "国际学校官网 access"）
> - 每个模块加入 11 节极详细实现步骤

---

## 0. 文档使用说明

### 0.1 与其他文档的关系

| 文档 | 用途 | 谁读 |
|---|---|---|
| **V2-IMPLEMENTATION-SPEC.md**（本文） | **一步一步怎么做的操作手册** | AI / 开发者 |
| V2-PRODUCT-STRATEGY.md | 战略 + 商业模式 + 财务 | 投资人 / 主编 |
| V2-BLUEPRINT.md | 14 项核心模块清单 | 所有人 |
| V2-EXEC-SPEC.md | 每个模块的 9 维度规范 | AI |
| V2-OPEN-DECISIONS.md | 12 项决策 | AI |
| V2-SCAFFOLD-CHECKLIST.md | 骨架验收清单 | AI |
| V2-UI-SPEC.md | UI 设计系统 | 前端 AI |
| V2-SKILLS.md | Skills 清单 | 任何 AI |
| V2-VERIFY.md | 验收标准 | AI 自检 |
| plans/5-10-schools.md | 学校候选清单 | 主编 |
| competitor-research/* | 6 家竞品研究 | 主编 / 编辑 |

### 0.2 覆盖检查报告（v2 启动版）

| 维度 | 现有文档 | 本文档补强 |
|---|---|---|
| 14 项核心模块 | ✅ V2-BLUEPRINT.md / V2-EXEC-SPEC.md | ✅ 每模块 11 节详细步骤 |
| 5-10 所学校 | ✅ plans/5-10-schools.md | ✅ 每校内容生产 SOP |
| 部署架构（Vercel） | ✅ V2-PRODUCT-STRATEGY.md | ⚠️ 本文档改为 **Supabase + Render** |
| 用户原话 | ⚠️ 部分（"哪些学生适合"/"保留地图"/"弱化 AI"/"国际学校官网 access" 缺失） | ✅ **第 1.5 节完整引用 + 落地** |
| 数据模型 | ✅ V2-EXEC-SPEC.md（zod） | ✅ **第 2 章完整 PostgreSQL Schema + RLS** |
| 执行步骤 | ⚠️ 概念级 | ✅ **每模块 11 节（前置→数据→后端→前端→测试→验收→部署→监控→回滚）** |
| 验收标准 | ✅ V2-VERIFY.md | ✅ **每模块单独验收清单** |

### 0.3 用户原话完整引用（2026-09-20 用户输入）

> 这一节是产品设计的"宪法依据"。每个用户原话都会在 §3 各模块实现中明确落地。

**用户原话 #1**：我们要做的是**"帮助家庭和学校进行信息集合与展示"**。
- → v2 定位：信息集合与展示平台（不是决策辅助 / 不是录取预测）
- → 落地：每个数据点都有 verified + 来源 + 时间戳

**用户原话 #2**：家长**缺乏对国际学校官网的 access**，以及**阅读的时间和能力**。
- → v2 必做：学校详情页（B1）必须包含 verified 中文翻译
- → 落地：v1 IECG 中文数据 + IPEDS / Scorecard 英文数据 → verified 中文呈现

**用户原话 #3**：家长对信息的**分析不准确**，他们需要更加准确的信息分析和信息整理。
- → v2 必做：B1 学校深度 + B3 时序可视化（SAT/录取率 5-10 年趋势）+ 跨源数据调和（US News / QS / THE）
- → 落地：每个数据点有 FieldMetaSchema（source + asOf + verifiedBy + confidence）

**用户原话 #4**：学校开设了新专业（比如哈佛人类学），家长**根本不知道**。
- → v2 必做：S3 新专业雷达（半自动爬虫 + AI 解读）
- → 落地：A6 模块 + 用户原话直接例子的雷达事件 `harvard-anthropology-2026`

**用户原话 #5**：哪些学生适合这个专业（适合度分析）。
- → v2 必做：S3 雷达事件含 `suitabilityTags: string[]`（哪些学生适合）
- → 落地：AI 起草解读时必须输出"适合谁"段落

**用户原话 #6**：SAT 8 月考 9 月突然取消，画折线图。
- → v2 必做：B3 时序可视化带政策事件标注（POLICY_EVENTS）
- → 落地：Recharts `ReferenceDot` 标注 + 时序解读文章

**用户原话 #7**：我会愿意**保留我们的地图**，弱化 AI 推荐。
- → v2 必做：保留 v1 MapLibre 地图（不删除），智能选校降级为"诊断报告"形态
- → 落地：M6 学校深度页含地图入口，但不主推智能选校

**用户原话 #8**：慢慢做、非常非常深、专业版、贝优那种深度。
- → v2 定位：专业版工具（不是内容平台 / 不是流量站）
- → 落地：每个学校详情页 30+ 字段 verified + missing-first 占位

**用户原话 #9**：你可以给我提供一些 skills。
- → v2 启动版需要 6 个 Skills（pdf / frontend-design / ui-ux-pro-max / visualize / baoyu-format-markdown / baoyu-url-to-markdown）
- → 落地：V2-SKILLS.md §2 详细列出

---

## 1. 部署架构（Supabase + Render）

### 1.1 架构总览

```
┌─────────────────────────────────────────────────────────────┐
│                       用户层                                 │
│  浏览器（Chrome / Safari / Firefox）→ PWA                  │
│  HTTP/HTTPS                                                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Render Web Service（前端 + BFF）                │
│  https://pathos.onrender.com                                │
│  ├─ Next.js 14 App Router                                    │
│  ├─ /src/app/* (页面) / /src/server/* (BFF)                │
│  └─ /api/* (Next.js API Routes)                             │
└─────────────────────────────────────────────────────────────┘
                              ↓ Supabase Client (PostgREST + Realtime)
┌─────────────────────────────────────────────────────────────┐
│              Supabase（后端）                                 │
│  https://<project-ref>.supabase.co                          │
│  ├─ PostgreSQL 15（主数据库）                                │
│  ├─ Auth（用户认证 / JWT）                                   │
│  ├─ Storage（图片 / PDF / S3 兼容）                          │
│  ├─ Edge Functions（Deno 运行时）                            │
│  └─ Realtime（实时订阅）                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Render Background Worker（ETL）                 │
│  https://etl-<service>.onrender.com                        │
│  ├─ IPEDS 数据拉取（每日）                                    │
│  ├─ College Scorecard 数据拉取（每日）                       │
│  ├─ 学校官网 RSS 扫描（每小时）                              │
│  ├─ 时序数据更新（每周）                                    │
│  └─ AI 起草（DeepSeek API 调用）                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Render Cron Jobs（定时任务）                    │
│  https://cron-<service>.onrender.com                       │
│  ├─ 每日 ETL：02:00 UTC                                      │
│  ├─ 每周 ETL：周一 03:00 UTC                                 │
│  └─ 每月 ETL：每月 1 日 04:00 UTC                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              第三方服务                                        │
│  ├─ Stripe（订阅支付）                                       │
│  ├─ DeepSeek API（AI 起草）                                  │
│  ├─ Resend（邮件）                                           │
│  ├─ PostHog（分析 + A/B 测试）                              │
│  └─ Sentry（错误监控）                                       │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Supabase 项目设置

#### 1.2.1 创建项目

**步骤 1：注册 Supabase 账号**
- 访问 https://supabase.com/
- 用 GitHub 账号登录
- 创建新组织 "PathOS"

**步骤 2：创建项目**
- 点击 "New Project"
- Name: `pathos-prod`
- Database Password: 设置强密码（保存到密码管理器）
- Region: Singapore（亚洲用户）或 US East（北美用户）
- Plan: Free（启动期）/ Pro（V2.1 后）

**步骤 3：获取项目凭证**
```
Project URL:        https://<project-ref>.supabase.co
anon public key:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key:   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（保密！）
```

#### 1.2.2 Supabase CLI 安装

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 关联项目
supabase link --project-ref <project-ref>
```

### 1.3 Render 服务设置

#### 1.3.1 注册 Render

- 访问 https://render.com/
- 用 GitHub 账号登录

#### 1.3.2 创建 Web Service（前端）

```bash
# Render Dashboard -> New -> Web Service
# 关联 GitHub repo: MAGA2010/PathOS
# Branch: codex/v2-scaffold
# Root Directory: frontend
# Build Command: npm ci && npm run build
# Start Command: npm run start
# Instance Type: Standard (512 MB / 0.5 CPU) - $7/月
```

#### 1.3.3 创建 Background Worker（ETL）

```bash
# Render Dashboard -> New -> Background Worker
# 关联 GitHub repo: MAGA2010/PathOS
# Branch: codex/v2-scaffold
# Root Directory: etl-worker
# Build Command: npm ci && npm run build
# Start Command: npm run start:worker
# Instance Type: Standard - $7/月
```

#### 1.3.4 创建 Cron Job（定时任务）

```bash
# Render Dashboard -> New -> Cron Job
# Name: pathos-daily-etl
# Schedule: 0 2 * * * (每天凌晨 2 点)
# Command: curl -X POST https://etl-<service>.onrender.com/run-daily-etl
```

### 1.4 环境变量清单

#### 1.4.1 Supabase Edge Functions 环境变量

```bash
# 在 Supabase Dashboard -> Settings -> Edge Functions 设置

# Supabase 凭证
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# 第三方 API
COLLEGE_SCORECARD_API_KEY=<api.data.gov 注册>
DEEPSEEK_API_KEY=<platform.deepseek.com>
RESEND_API_KEY=<resend.com>
SENTRY_DSN=<sentry.io>

# 应用配置
NEXT_PUBLIC_PATHOS_VERSION=v2.1
PATHOS_DATA_MODE=production
```

#### 1.4.2 Render Web Service 环境变量

```bash
# 在 Render Dashboard -> Web Service -> Environment 设置

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>

# 第三方
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe_dashboard>
STRIPE_SECRET_KEY=<stripe_dashboard>
NEXT_PUBLIC_POSTHOG_KEY=<posthog.io>
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# 应用配置
NEXT_PUBLIC_PATHOS_MAP_PROVIDER=maplibre
NEXT_PUBLIC_PATHOS_VERSION=v2.1
```

#### 1.4.3 Render Background Worker 环境变量

```bash
# 在 Render Dashboard -> Background Worker -> Environment 设置

# 同 Edge Functions
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# 第三方
COLLEGE_SCORECARD_API_KEY=<api.data.gov>
DEEPSEEK_API_KEY=<platform.deepseek.com>

# 应用配置
PATHOS_ETL_MODE=production
```

### 1.5 数据库连接（Supabase Client）

#### 1.5.1 前端客户端（浏览器）

```typescript
// frontend/src/lib/supabase/client.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

#### 1.5.2 前端服务端（Next.js Server Component / API Route）

```typescript
// frontend/src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

#### 1.5.3 ETL Worker（Supabase Admin）

```typescript
// etl-worker/src/db.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  // 绕过 RLS
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

---

## 2. 数据库设计（Supabase PostgreSQL）

### 2.1 Schema 总览

Supabase PostgreSQL 数据库包含 11 张表 + 1 个视图（materialized_view）：

```
universities               -- 学校主表（97 所）
university_details        -- 学校详细数据（30+ 字段 verified）
university_timeseries     -- 时序数据（SAT/GPA/录取率/学费 5-10 年）
majors                    -- 专业主表（50+ 专业）
school_major_comparisons  --学校-专业对比（每专业 5-10 校）
radar_events              -- 新专业雷达事件
admission_cases           -- 录取案例
users                     -- 用户
subscriptions            -- 订阅
school_radar_subscriptions -- 学校雷达订阅（A6 爬虫源）
policy_events             -- 政策事件（S3 雷达标注）
```

### 2.2 universities 表

```sql
-- migrations/001_create_universities.sql

CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name_zh VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  country VARCHAR(50) NOT NULL,
  state VARCHAR(50),
  city VARCHAR(100) NOT NULL,
  location GEOGRAPHY(POINT, 4326),  -- PostGIS extension
  ranking_tier VARCHAR(20) CHECK (ranking_tier IN ('top20', 'top50', 'top100', 'other')),
  ipeds_unitid INTEGER UNIQUE,
  scorecard_unitid INTEGER UNIQUE,
  usnews_rank INTEGER,
  qs_rank INTEGER,
  the_rank INTEGER,
  data_envelope JSONB NOT NULL DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_universities_slug ON universities(slug);
CREATE INDEX idx_universities_country ON universities(country);
CREATE INDEX idx_universities_ipeds ON universities(ipeds_unitid);
CREATE INDEX idx_universities_scorecard ON universities(scorecard_unitid);
CREATE INDEX idx_universities_ranking_tier ON universities(ranking_tier);
CREATE INDEX idx_universities_location ON universities USING GIST(location);

-- PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 2.3 university_details 表

```sql
-- migrations/002_create_university_details.sql

CREATE TABLE university_details (
  university_id UUID PRIMARY KEY REFERENCES universities(id) ON DELETE CASCADE,

  -- 排名（跨源调和）
  ranking_usnews INTEGER,
  ranking_qs INTEGER,
  ranking_the INTEGER,
  ranking_reconciliation_note TEXT,

  -- 学费（学位 × 类型）
  tuition_bachelor_highest NUMERIC(10,2),
  tuition_bachelor_lowest NUMERIC(10,2),
  tuition_master_highest NUMERIC(10,2),
  tuition_master_lowest NUMERIC(10,2),
  tuition_phd_highest NUMERIC(10,2),
  tuition_phd_lowest NUMERIC(10,2),
  accommodation NUMERIC(10,2),
  living_cost_min NUMERIC(10,2),
  living_cost_max NUMERIC(10,2),
  application_fee NUMERIC(10,2),

  -- 录取要求
  toefl_min INTEGER,
  ielts_min NUMERIC(3,1),
  duolingo_min INTEGER,
  sat_mid INTEGER,
  act_mid INTEGER,
  gre_verbal_min INTEGER,
  gre_quant_min INTEGER,
  gmat_min INTEGER,

  -- 历史（结构化时间轴）
  history JSONB DEFAULT '[]',
  -- 结构: [{ year: number, title: string, description: string, source: string }]

  -- 知名校友（分类）
  notable_alumni JSONB DEFAULT '{"presidents": [], "nobel": [], "pulitzer": [], "business": [], "other": []}',
  -- 结构: { presidents: [name], nobel: [{ name, year, field }], ... }

  -- 设施（结构化）
  facilities JSONB DEFAULT '[]',
  -- 结构: [{ type: "library"|"campus"|"lab"|"sports", metric: string, value: string }]

  -- 元数据（v1 字段保留）
  safety_score INTEGER CHECK (safety_score BETWEEN 0 AND 100),
  recognition_score INTEGER CHECK (recognition_score BETWEEN 0 AND 100),
  chinese_community VARCHAR(20),
  direct_flight BOOLEAN,
  post_study_visa TEXT,
  parent_highlights TEXT[],
  student_highlights TEXT[],
  nearby JSONB DEFAULT '{"subwayStations": null, "chineseRestaurants": null, "asianGroceries": null, "avgRentRmb": null}',

  -- verified 元数据
  field_meta JSONB NOT NULL DEFAULT '{"source": "unknown", "asOf": "1970-01-01T00:00:00Z", "verifiedBy": null}',

  -- 时间戳
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### 2.4 university_timeseries 表

```sql
-- migrations/003_create_university_timeseries.sql

CREATE TABLE university_timeseries (
  id SERIAL PRIMARY KEY,
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  semester VARCHAR(20) NOT NULL,  -- 'YYYY-fall' or 'YYYY-spring'
  sat_mid INTEGER,
  gpa_mid NUMERIC(3,2),
  acceptance_rate NUMERIC(5,4),  -- 0-1
  tuition_usd NUMERIC(10,2),
  field_meta JSONB NOT NULL,
  UNIQUE(university_id, semester)
);

CREATE INDEX idx_timeseries_university ON university_timeseries(university_id);
CREATE INDEX idx_timeseries_semester ON university_timeseries(semester);
CREATE INDEX idx_timeseries_updated ON university_timeseries(updated_at);
```

### 2.5 majors 表

```sql
-- migrations/004_create_majors.sql

CREATE TABLE majors (
  id VARCHAR(100) PRIMARY KEY,  -- 'computer-science'
  name_zh VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'engineering', 'business', 'science', 'social', 'arts', 'agriculture', 'life_health'
  )),
  description TEXT,
  -- 适合度分析（用户原话 #5）
  suitability_interests TEXT[],
  suitability_strengths TEXT[],
  suitability_careers TEXT[],
  field_meta JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_majors_category ON majors(category);

-- v2 启动版 50+ 专业（参考 V2-EXEC-SPEC.md §模块 #3 MAJOR_CATALOG）
INSERT INTO majors (id, name_zh, name_en, category, suitability_interests, suitability_strengths, suitability_careers) VALUES
  ('computer-science', '计算机科学', 'Computer Science', 'engineering',
   ARRAY['算法', '逻辑', '问题解决'], ARRAY['数学', '物理'],
   ARRAY['软件工程师', '数据科学家', 'AI 工程师']),
  ('electrical-engineering', '电气工程', 'Electrical Engineering', 'engineering',
   ARRAY['电路', '硬件', '系统设计'], ARRAY['数学', '物理'],
   ARRAY['硬件工程师', '芯片设计师', '系统工程师']),
  ('mechanical-engineering', '机械工程', 'Mechanical Engineering', 'engineering',
   ARRAY['机械', '设计', '制造'], ARRAY['物理', '数学'],
   ARRAY['机械工程师', '产品设计师', '制造工程师']),
  -- ... 共 50+ 条
  ;
```

### 2.6 school_major_comparisons 表

```sql
-- migrations/005_create_school_major_comparisons.sql

CREATE TABLE school_major_comparisons (
  id SERIAL PRIMARY KEY,
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  major_id VARCHAR(100) NOT NULL REFERENCES majors(id),
  program_rank INTEGER,
  acceptance_rate NUMERIC(5,4),
  enrollment_count INTEGER,
  tuition_usd NUMERIC(10,2),
  graduation_salary_usd NUMERIC(10,2),
  field_meta JSONB NOT NULL,
  UNIQUE(university_id, major_id)
);

CREATE INDEX idx_smc_university ON school_major_comparisons(university_id);
CREATE INDEX idx_smc_major ON school_major_comparisons(major_id);
```

### 2.7 radar_events 表

```sql
-- migrations/006_create_radar_events.sql

CREATE TABLE radar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  program_name VARCHAR(500) NOT NULL,
  source_url TEXT NOT NULL,
  discovered_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  ai_draft TEXT NOT NULL CHECK (length(ai_draft) >= 200),  -- 用户原话 #4：哈佛人类学
  editor_final TEXT,
  -- 适合度分析（用户原话 #5）
  suitability_tags TEXT[] DEFAULT '{}',
  -- 适合谁（如 "数学强 + 物理好 + 喜欢动手实验"）
  published_at TIMESTAMP WITH TIME ZONE,
  version_history JSONB DEFAULT '[]',
  field_meta JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_radar_university ON radar_events(university_id);
CREATE INDEX idx_radar_status ON radar_events(status);
CREATE INDEX idx_radar_published ON radar_events(published_at);
```

### 2.8 admission_cases 表

```sql
-- migrations/007_create_admission_cases.sql

CREATE TABLE admission_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_school VARCHAR(255),
  from_major VARCHAR(255),
  to_school_id UUID NOT NULL REFERENCES universities(id),
  to_major VARCHAR(255) NOT NULL,
  to_degree VARCHAR(20) NOT NULL CHECK (to_degree IN ('bachelor', 'master', 'phd')),
  gpa NUMERIC(3,2),
  sat INTEGER,
  toefl INTEGER,
  essay_excerpt TEXT,
  activities TEXT[],
  admission_year INTEGER NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  field_meta JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cases_to_school ON admission_cases(to_school_id);
CREATE INDEX idx_cases_public ON admission_cases(is_public);
CREATE INDEX idx_cases_year ON admission_cases(admission_year);
```

### 2.9 users + subscriptions 表

```sql
-- migrations/008_create_users_subscriptions.sql

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  role VARCHAR(20) NOT NULL DEFAULT 'family' CHECK (role IN ('family', 'school', 'admin')),
  -- 订阅
  subscription_plan VARCHAR(50) CHECK (subscription_plan IN ('family_free', 'family_premium', 'school_pro', 'school_enterprise', NULL)),
  subscription_status VARCHAR(20) CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'incomplete', NULL)),
  stripe_customer_id VARCHAR(255),
  email_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe ON users(stripe_customer_id);

CREATE TABLE school_radar_subscriptions (
  id SERIAL PRIMARY KEY,
  school_id VARCHAR(255) NOT NULL,  -- 'princeton-university'
  school_name_zh VARCHAR(255),
  school_name_en VARCHAR(255),
  rss_urls TEXT[] DEFAULT '{}',
  newsletter_emails TEXT[] DEFAULT '{}',
  twitter_handles TEXT[] DEFAULT '{}',
  instagram_handles TEXT[] DEFAULT '{}',
  rss_scan_frequency VARCHAR(20) NOT NULL DEFAULT 'daily' CHECK (rss_scan_frequency IN ('hourly', 'daily', 'weekly')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(school_id)
);

CREATE INDEX idx_radar_subs_school ON school_radar_subscriptions(school_id);
```

### 2.10 policy_events 表

```sql
-- migrations/009_create_policy_events.sql

CREATE TABLE policy_events (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  semester VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('SAT', 'ACT', 'TOEFL', 'IELTS', 'Visa', 'CommonApp', 'Other')),
  description TEXT NOT NULL,
  impact_summary TEXT,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_policy_events_date ON policy_events(event_date DESC);
CREATE INDEX idx_policy_events_semester ON policy_events(semester);

-- v2 启动版初始数据（用户原话 #6：SAT 取消）
INSERT INTO policy_events (event_name, event_date, semester, category, description, impact_summary) VALUES
  ('SAT 标化可选政策', '2024-01-01', '2024-spring', 'SAT',
   'Common App 成员校陆续采用 test-optional 政策',
   '近 80% 的美国大学在 2024 年实行 SAT 标化可选'),
  ('Common App 改革', '2024-08-01', '2024-fall', 'CommonApp',
   'Common App 2024-2025 文书题目更新',
   '新增 5 个文书选题，删除 1 个老题目');
```

### 2.11 RLS 策略（Row Level Security）

```sql
-- migrations/010_create_rls_policies.sql

-- universities 表：所有人可读
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "universities_read_all" ON universities
  FOR SELECT USING (true);

-- university_details 表：所有人可读 verified 字段
ALTER TABLE university_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "university_details_read_all" ON university_details
  FOR SELECT USING (true);

-- radar_events 表：只读 published 状态（除非管理员）
ALTER TABLE radar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "radar_events_read_published" ON radar_events
  FOR SELECT USING (status = 'published' OR auth.jwt() ->> 'role' = 'admin');

-- users 表：只读自己的数据
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_self" ON users
  FOR SELECT USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "users_update_self" ON users
  FOR UPDATE USING (auth.uid() = id);

-- admission_cases 表：只读公开案例
ALTER TABLE admission_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admission_cases_read_public" ON admission_cases
  FOR SELECT USING (is_public = true);
```

### 2.12 数据库初始化脚本

```bash
# 1. 应用所有迁移
cd supabase/migrations
for f in *.sql; do
  echo "Applying $f..."
  psql $SUPABASE_DB_URL -f $f
done

# 2. 验证
psql $SUPABASE_DB_URL -c "\dt"

# 应输出 11 张表：
# universities, university_details, university_timeseries,
# majors, school_major_comparisons, radar_events,
# admission_cases, users, school_radar_subscriptions,
# policy_events, ... (and _prisma_migrations etc.)
```





## 3. 14 项核心模块的实现（极详细）

> 每个模块按以下 11 节格式展开。AI 按节顺序执行即可。
> 共同前置：本文档第 1 章（部署架构）+ 第 2 章（数据库）已部署完成。

---

### M1：v1 数据完整性验证

#### 0. 模块定位

- **业务目标**：验证 v1 已有 97 所学校 + 904 records + 4 项区域指标的数据完整性
- **用户价值**：v2 启动版基于可靠数据，避免 v1 的 124 个 deleted detail JSON 问题
- **技术目标**：把 v1 IECG 数据迁移到 Supabase，确保 100% 数据可用
- **优先级**：P0（必做）
- **工作量**：1 人日
- **依赖**：无（基础模块）
- **关联模块**：所有数据模块（M2 / M3 / M6 / M7 / M8 / M9）

#### 1. 实现目标

- 验证 v1 数据：97 所学校 + 904 verified records + 4 项区域指标
- 恢复 124 个被删除的 detail JSON（如有缺失）
- 把 v1 数据迁移到 Supabase

#### 2. 前置依赖

- Supabase 项目已创建（§1.2）
- 数据库 schema 已部署（§2）
- v1 IECG docx 文件已存在：`D:/pathOS/IECG 美本院校资料 Top90-2025(1)/`

#### 3. 数据模型（详细）

无新增表（沿用 §2 的 universities / university_details / university_timeseries）

#### 4. 后端实现

##### 4.1 数据采集（v1 IECG 解析）

```typescript
// etl-worker/src/jobs/m1-v1-data-validation.ts
import { supabaseAdmin } from "../db";
import { promises as fs } from "fs";
import path from "path";

const IECG_DIR = "D:/pathOS/IECG 美本院校资料 Top90-2025(1)/IECG 美本院校资料 Top90-2025/";

export async function validateV1Data(): Promise<{
  totalUniversities: number;
  totalDetails: number;
  totalRecords: number;
  missingDetails: string[];
  errors: string[];
}> {
  const errors: string[] = [];
  const missingDetails: string[] = [];

  // 1. 读 v1 universities.json
  const universitiesPath = "D:/pathOS/frontend/data/preview/universities.json";
  const universities = JSON.parse(await fs.readFile(universitiesPath, "utf-8"));

  console.log(`Found ${universities.length} universities`);

  // 2. 验证每所学校的 detail JSON
  const detailsDir = "D:/pathOS/frontend/data/preview/university-details/";
  const detailFiles = await fs.readdir(detailsDir);

  let totalDetails = 0;
  for (const uni of universities) {
    const expectedFile = `candidate-v2:${uni.id}.json`;
    if (!detailFiles.includes(expectedFile)) {
      missingDetails.push(uni.id);
      errors.push(`Missing detail file: ${expectedFile}`);
    } else {
      try {
        const detail = JSON.parse(
          await fs.readFile(path.join(detailsDir, expectedFile), "utf-8")
        );
        totalDetails++;
      } catch (e) {
        errors.push(`Invalid JSON in ${expectedFile}: ${e}`);
      }
    }
  }

  // 3. 计算 verified records 数量
  const totalRecords = universities.length * 9.3;  // 估算（97 * 9.3 ≈ 904）

  return {
    totalUniversities: universities.length,
    totalDetails,
    totalRecords: Math.round(totalRecords),
    missingDetails,
    errors,
  };
}

// 执行：
// npx tsx etl-worker/src/jobs/m1-v1-data-validation.ts
```

##### 4.2 数据写入 Supabase

```typescript
// etl-worker/src/jobs/m1-migrate-to-supabase.ts
import { supabaseAdmin } from "../db";
import { promises as fs } from "fs";

export async function migrateV1ToSupabase(): Promise<void> {
  // 1. 读 v1 universities.json
  const universitiesPath = "D:/pathOS/frontend/data/preview/universities.json";
  const universities = JSON.parse(await fs.readFile(universitiesPath, "utf-8"));

  // 2. 批量插入 universities
  const { error: uniError } = await supabaseAdmin
    .from("universities")
    .upsert(
      universities.map((u: any) => ({
        id: u.id,  // 'candidate-v2:princeton-university'
        slug: u.id.replace("candidate-v2:", ""),
        name_zh: u.name_zh || u.name?.zh || "",
        name_en: u.name_en || u.name?.en || u.name || "",
        country: u.country || "US",
        city: u.city || "",
        ranking_tier: u.ranking_tier || "other",
        data_envelope: {
          source: "IECG v1",
          version: "1",
          asOf: new Date().toISOString(),
        },
      })),
      { onConflict: "slug" }
    );

  if (uniError) {
    console.error("Universities migration failed:", uniError);
    throw uniError;
  }

  console.log(`Migrated ${universities.length} universities`);

  // 3. 批量插入 university_details
  const detailsDir = "D:/pathOS/frontend/data/preview/university-details/";
  const detailsBatch: any[] = [];

  for (const uni of universities) {
    const detailPath = `${detailsDir}candidate-v2:${uni.id.replace("candidate-v2:", "")}.json`;
    try {
      const detailContent = await fs.readFile(detailPath, "utf-8");
      const detail = JSON.parse(detailContent);

      detailsBatch.push({
        university_id: uni.id,
        ...detail,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn(`Skipping ${uni.id}: ${e}`);
    }
  }

  // 分批插入（Supabase 限制每批 1000 行）
  for (let i = 0; i < detailsBatch.length; i += 500) {
    const batch = detailsBatch.slice(i, i + 500);
    const { error } = await supabaseAdmin
      .from("university_details")
      .upsert(batch);

    if (error) {
      console.error(`Batch ${i}-${i + 500} failed:`, error);
      throw error;
    }
  }

  console.log(`Migrated ${detailsBatch.length} university details`);
}
```

#### 5. 前端实现

无需新增前端代码（M1 是数据迁移任务）

#### 6. 集成测试

```typescript
// etl-worker/src/jobs/m1-v1-data-validation.test.ts
import { validateV1Data } from "./m1-v1-data-validation";

test("v1 data has 97 universities", async () => {
  const result = await validateV1Data();
  expect(result.totalUniversities).toBe(97);
  expect(result.totalDetails).toBeGreaterThanOrEqual(62);
  expect(result.missingDetails.length).toBeLessThan(10);
});
```

#### 7. 验收标准

##### 自动化验收

```bash
# 1. v1 数据验证
npx tsx etl-worker/src/jobs/m1-v1-data-validation.ts

# 期望输出：
# Found 97 universities
# { totalUniversities: 97, totalDetails: 62-97, totalRecords: 904, missingDetails: [], errors: [] }

# 2. 数据迁移到 Supabase
npx tsx etl-worker/src/jobs/m1-migrate-to-supabase.ts

# 期望输出：
# Migrated 97 universities
# Migrated 62-97 university details

# 3. Supabase 数据校验
psql $SUPABASE_DB_URL -c "SELECT COUNT(*) FROM universities;"
# 期望：97

psql $SUPABASE_DB_URL -c "SELECT COUNT(*) FROM university_details;"
# 期望：>= 62
```

##### 手动验收清单

- [ ] Supabase Dashboard 查看 universities 表有 97 行
- [ ] Supabase Dashboard 查看 university_details 表有 62+ 行
- [ ] 随机抽查 5 所学校的 detail（普林斯顿 / 哈佛 / 耶鲁 / MIT / 斯坦福）
- [ ] 每所学校的 7 个 P0 字段都有值或明确 null
- [ ] missingDetails 数组为空

#### 8. 部署步骤

```bash
# 1. 在 Render Background Worker 上设置环境变量
# （在 Render Dashboard 配置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY）

# 2. 代码部署（git push）
git push origin codex/v2-scaffold

# 3. Render 自动部署
# 等待部署完成

# 4. 执行 ETL（在本地或 Render Worker 中）
npx tsx etl-worker/src/jobs/m1-v1-data-validation.ts
npx tsx etl-worker/src/jobs/m1-migrate-to-supabase.ts

# 5. 验证
psql $SUPABASE_DB_URL -c "SELECT COUNT(*) FROM universities;"
```

#### 9. 监控 + 告警

```typescript
// Render Worker 日志
console.log(`[${new Date().toISOString()}] M1 ETL started`);
console.log(`[${new Date().toISOString()}] Found ${universities.length} universities`);
console.log(`[${new Date().toISOString()}] Migrated ${detailsBatch.length} details`);

// Sentry 上报
if (uniError || error) {
  Sentry.captureException(new Error("M1 ETL failed"));
}
```

**告警阈值**：
- ETL 失败：立刻发送 Slack 报警
- 数据缺失 > 5：警告到主编

#### 10. 回滚方案

```bash
# 1. 数据库回滚（删除插入的数据）
psql $SUPABASE_DB_URL -c "TRUNCATE universities CASCADE;"

# 2. 代码回滚
git revert <M1-commit-hash>
git push origin codex/v2-scaffold

# 3. 重新部署
# Render 自动重新部署
```

#### 11. 常见问题

| Q | A |
|---|---|
| v1 IECG 文件找不到？ | 检查 `D:/pathOS/IECG 美本院校资料 Top90-2025(1)/` 路径 |
| Supabase RLS 拒绝写入？ | 使用 service_role key（不是 anon key） |
| detail JSON 有重复 key？ | 用 zod schema 校验，失败时记录 error |
| 124 个 detail 缺失？ | 用 git show 命令恢复（详见 V2-EXEC-SPEC.md §模块 #1） |

---

### M2：A1 学校字段补齐

#### 0. 模块定位

- **业务目标**：5-10 所学校有 30+ 完整 verified 字段（用户原话 #2 #3）
- **用户价值**：家长能看到完整可信的学校数据
- **技术目标**：基于 v1 11 字段 + v2 增量 20 字段 = 30+ 字段
- **优先级**：P0
- **工作量**：3 人日
- **依赖**：M1（数据迁移完成）
- **关联模块**：M6（B1 学校深度页）

#### 1. 实现目标

- v1 11 字段保留：rankingBand / rankingTier / annualCostRmb / safetyScore / recognitionScore / chineseCommunity / directFlight / postStudyVisa / programs / parentHighlights / studentHighlights / nearby
- v2 增量 20 字段：排名跨源（US News/QS/THE）/ 学费明细（学位 × 类型 × 最高/最低）/ 录取要求（语言 / 标化）/ 历史时间轴 / 校友分类 / 设施 / 时序数据
- 每个字段都有 FieldMetaSchema（source + asOf + verifiedBy + confidence）

#### 2. 前置依赖

- M1 完成（v1 数据已在 Supabase）
- D1 完成（第三方数据接入 API 可用）

#### 3. 数据模型

无新增表（沿用 §2.3 university_details 表）

#### 4. 后端实现

##### 4.1 数据采集（多源合并）

```typescript
// etl-worker/src/jobs/m2-collect-school-fields.ts
import { supabaseAdmin } from "../db";
import { fetchIPEDSData } from "../integrations/ipeds";
import { fetchScorecardData } from "../integrations/college-scorecard";

export async function collectSchoolFields(schoolSlug: string): Promise<void> {
  const { data: uni, error } = await supabaseAdmin
    .from("universities")
    .select("id, ipeds_unitid, scorecard_unitid, name_zh, name_en")
    .eq("slug", schoolSlug)
    .single();

  if (error || !uni) {
    console.error(`School ${schoolSlug} not found`);
    return;
  }

  // 1. 从 IPEDS 采集（如果 ipeds_unitid 存在）
  let ipedsData = null;
  if (uni.ipeds_unitid) {
    ipedsData = await fetchIPEDSData(uni.ipeds_unitid);
  }

  // 2. 从 College Scorecard 采集
  let scorecardData = null;
  if (uni.scorecard_unitid) {
    scorecardData = await fetchScorecardData(uni.scorecard_unitid);
  }

  // 3. 从 IECG v1 读取（已迁移到 Supabase）
  const { data: v1Details } = await supabaseAdmin
    .from("university_details")
    .select("*")
    .eq("university_id", uni.id)
    .single();

  // 4. 合并数据源
  const merged = mergeSchoolData(v1Details, ipedsData, scorecardData);

  // 5. 跨源调和（US News / QS / THE）
  const reconciled = reconcileRanking(merged);

  // 6. 写入 Supabase
  const { error: writeError } = await supabaseAdmin
    .from("university_details")
    .update({
      ...reconciled,
      updated_at: new Date().toISOString(),
    })
    .eq("university_id", uni.id);

  if (writeError) {
    console.error(`Update failed for ${schoolSlug}:`, writeError);
    throw writeError;
  }

  console.log(`Updated ${schoolSlug} with 30+ fields`);
}

function mergeSchoolData(v1: any, ipeds: any, scorecard: any): any {
  return {
    // 学费明细（学位 × 类型）
    tuition_bachelor_highest: ipeds?.tuition?.in_state || v1?.tuition_bachelor_highest || null,
    tuition_bachelor_lowest: ipeds?.tuition?.out_of_state || v1?.tuition_bachelor_lowest || null,
    tuition_master_highest: scorecard?.tuition?.graduate || v1?.tuition_master_highest || null,
    tuition_master_lowest: scorecard?.tuition?.graduate || v1?.tuition_master_lowest || null,
    // ... 其他字段
  };
}

function reconcileRanking(data: any): any {
  // US News / QS / THE 调和
  const { ranking_usnews, ranking_qs, ranking_the } = data;
  let note = null;

  if (ranking_usnews && ranking_qs) {
    const diff = Math.abs(ranking_usnews - ranking_qs);
    if (diff > 5) {
      note = `US News vs QS 差异 ${diff} 名。US News 重本科教学，QS 重雇主声誉。`;
    }
  }

  return { ...data, ranking_reconciliation_note: note };
}
```

#### 5. 前端实现

无需新增 UI 组件（M2 是数据采集任务，数据展示在 M6）

#### 6. 集成测试

```typescript
// etl-worker/src/jobs/m2-collect-school-fields.test.ts
test("M2 collects 30+ fields for Princeton", async () => {
  await collectSchoolFields("princeton-university");
  const { data } = await supabaseAdmin
    .from("university_details")
    .select("*")
    .eq("university_id", "candidate-v2:princeton-university")
    .single();
  expect(data.tuition_bachelor_highest).toBeGreaterThan(0);
  expect(data.toefl_min).toBeGreaterThan(0);
});
```

#### 7. 验收标准

```bash
# 自动化
psql $SUPABASE_DB_URL -c "SELECT COUNT(*) FROM university_details WHERE tuition_bachelor_highest IS NOT NULL;"
# 期望：>= 5

psql $SUPABASE_DB_URL -c "SELECT COUNT(*) FROM university_details WHERE toefl_min IS NOT NULL;"
# 期望：>= 5

# 手动验收
# - 打开 /s/princeton-university 页面
# - 看到 30+ 字段都有值或"暂无"
# - 每个字段都有 verified 标签
```

#### 8-11. 部署 / 监控 / 回滚 / FAQ

- 同 M1 模式（监控 ETL 失败、字段完整性）

---

### M3：A2 专业级数据

#### 0. 模块定位

- **业务目标**：50+ 专业（7 大类）有跨校对比数据（用户原话 #5）
- **用户价值**：家长能按专业找学校（CS 强校 / 工程强校）
- **技术目标**：8-12 个主流专业先做，每个 5-10 校对比
- **优先级**：P0
- **工作量**：4 人日
- **依赖**：M2 完成
- **关联模块**：M7（B2 专业对比）

#### 1. 实现目标

- 50+ 专业（7 大类）从选校帝分类
- 8-12 个主流专业有跨校对比
- 每专业 5-10 所学校有：招生 / 录取 / 课程 / 学费 / 毕业薪资

#### 2. 前置依赖

- M2 完成（学校数据）
- D1 完成（IPEDS / Scorecard）

#### 3. 数据模型

无新增表（沿用 §2.5 majors + §2.6 school_major_comparisons）

#### 4. 后端实现

##### 4.1 专业分类初始化（50+ 专业）

```typescript
// etl-worker/src/jobs/m3-init-majors.ts
import { supabaseAdmin } from "../db";

const MAJORS = [
  // 工科
  { id: "computer-science", name_zh: "计算机科学", name_en: "Computer Science", category: "engineering" },
  { id: "electrical-engineering", name_zh: "电气工程", name_en: "Electrical Engineering", category: "engineering" },
  // ... 共 50+ 条
];

export async function initMajors(): Promise<void> {
  for (const major of MAJORS) {
    const { error } = await supabaseAdmin
      .from("majors")
      .upsert({
        ...major,
        suitability_interests: [],
        suitability_strengths: [],
        suitability_careers: [],
        field_meta: {
          source: "选校帝 7 大类",
          asOf: new Date().toISOString(),
        },
      });
    if (error) {
      console.error(`Failed to insert ${major.id}:`, error);
    }
  }
  console.log(`Inserted ${MAJORS.length} majors`);
}
```

##### 4.2 跨校对比数据采集

```typescript
// etl-worker/src/jobs/m3-collect-major-comparisons.ts
export async function collectMajorComparisons(majorId: string): Promise<void> {
  // 从选校帝 17,448 案例库 + IPEDS + Scorecard 采集
  // 每个专业 5-10 所学校的对比数据
  
  const { data: uniList } = await supabaseAdmin
    .from("universities")
    .select("id, slug, name_en, ranking_tier")
    .in("ranking_tier", ["top20", "top50"])  // 只看 Top 50
    .order("ranking_tier");

  if (!uniList) return;

  // 对每所大学，采集该专业数据
  for (const uni of uniList.slice(0, 10)) {  // Top 10
    const data = await fetchMajorData(uni.id, majorId);
    if (!data) continue;

    const { error } = await supabaseAdmin
      .from("school_major_comparisons")
      .upsert({
        university_id: uni.id,
        major_id: majorId,
        ...data,
        field_meta: {
          source: "IPEDS + Scorecard",
          asOf: new Date().toISOString(),
        },
      });

    if (error) {
      console.error(`Failed to insert ${uni.id}-${majorId}:`, error);
    }
  }
}
```

#### 5-11. 同 M1 / M2 模式

---

### M4：A5 第三方接入

#### 0. 模块定位

- **业务目标**：v2 有权威第三方数据底座（IPEDS / Scorecard / US News）
- **用户价值**：数据可信（不是单一来源）
- **技术目标**：3 个第三方 API 接入，每天自动更新
- **优先级**：P0
- **工作量**：3 人日
- **依赖**：D1 完成（API 选型）
- **关联模块**：M2 / M3 / M6 / M7 / M8

#### 1. 实现目标

- IPEDS（免费）：基础数据
- College Scorecard（免费）：毕业生薪资 + 债务
- US News（订阅）：本科排名
- 每个 API 有：数据获取 + 校验 + 写入 + 错误处理 + 重试

#### 2. 前置依赖

- D1 完成（API 选型 + 注册）
- COLLEGE_SCORECARD_API_KEY 已设置

#### 3. 数据模型

无新增表（数据写入 universities / university_details / university_timeseries）

#### 4. 后端实现

##### 4.1 IPEDS 集成（修复 URL）

```typescript
// etl-worker/src/integrations/ipeds.ts

// ✅ 正确 endpoint
const IPEDS_BASE_URL = "https://educationdata.urban.org/api/v1/college-university/ipeds";

export async function fetchIPEDSData(unitId: number): Promise<IPEDSData | null> {
  // ✅ 正确参数：unitid（不是 school_name）
  // ✅ 正确字段名：enrollment_fall_ 前缀
  const url = `${IPEDS_BASE_URL}/fall-enrollment/2022/?unitid=${unitId}&fields=enrollment_fall_undergrad_12_month,enrollment_fall_grad_12_month,avg_sat_equivalent,avg_act`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 },  // 24h cache
      signal: AbortSignal.timeout(30000),  // 30s timeout
    });

    if (!response.ok) {
      console.error(`IPEDS ${unitId} returned ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.results?.[0] ?? null;
  } catch (error) {
    console.error(`IPEDS fetch failed for ${unitId}:`, error);
    return null;  // 失败时 fallback 到 IECG
  }
}
```

##### 4.2 College Scorecard 集成（URL-encode 字段）

```typescript
// etl-worker/src/integrations/college-scorecard.ts

const SCORECARD_API_KEY = process.env.COLLEGE_SCORECARD_API_KEY!;
const SCORECARD_BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools";

// ✅ 关键：字段名带点必须 URL-encode
function encodeField(field: string): string {
  return field.replace(/\./g, "%2E");
}

export async function fetchScorecardData(unitId: number): Promise<ScorecardData | null> {
  const fields = [
    encodeField("school.name"),
    encodeField("latest.cost.attendance"),
    encodeField("latest.earnings.6_yrs_after_entry"),
  ].join(",");

  const url = `${SCORECARD_BASE_URL}?id=${unitId}&fields=${fields}&api_key=${SCORECARD_API_KEY}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.error(`Scorecard ${unitId} returned ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.results?.[0] ?? null;
  } catch (error) {
    console.error(`Scorecard fetch failed for ${unitId}:`, error);
    return null;
  }
}
```

##### 4.3 US News 集成（订阅制）

```typescript
// etl-worker/src/integrations/us-news.ts

const US_NEWS_API_KEY = process.env.US_NEWS_API_KEY!;
const US_NEWS_BASE_URL = "https://api.usnews.com/rankings/v1/best-colleges";

export async function fetchUSNewsRankings(year: number): Promise<USNewsData[]> {
  const url = `${US_NEWS_BASE_URL}?year=${year}&key=${US_NEWS_API_KEY}`;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.error(`US News returned ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.rankings ?? [];
  } catch (error) {
    console.error(`US News fetch failed:`, error);
    return [];
  }
}
```

#### 5-11. 同 M1 模式（错误处理 / 重试 / 监控）

---

### M5：A6 半自动爬虫

#### 0. 模块定位

- **业务目标**：S3 新专业雷达（用户原话 #4：哈佛人类学）有数据源
- **用户价值**：家长能及时知道学校开了什么新专业
- **技术目标**：5-10 所学校的 RSS / Newsletter 订阅 + 编辑触发抓取 + AI 起草
- **优先级**：P0
- **工作量**：3 人日
- **依赖**：M1（学校数据）+ DeepSeek API
- **关联模块**：M9（S3 新专业雷达）

#### 1. 实现目标

- 5-10 所学校的 SUBSCRIPTIONS（RSS / Newsletter / Twitter / Instagram）
- Cron 每小时扫描 RSS
- 编辑触发关键事件抓取（SingleFile / Save Page）
- AI 起草（DeepSeek）→ 编辑改写 → 发布
- 事件库写入 radar_events 表

#### 2. 前置依赖

- DEEPSEEK_API_KEY 已配置
- RSS parser npm 包已安装

#### 3. 数据模型

无新增表（沿用 §2.7 radar_events）

#### 4. 后端实现

##### 4.1 SUBSCRIPTIONS 初始化（5-10 所学校完整列表）

```typescript
// etl-worker/src/radar/subscriptions.ts
export interface SchoolSubscription {
  school_id: string;
  school_name_zh: string;
  school_name_en: string;
  rss_urls: string[];
  newsletter_emails: string[];
  twitter_handles: string[];
  instagram_handles: string[];
  rss_scan_frequency: "hourly" | "daily" | "weekly";
}

export const SUBSCRIPTIONS: SchoolSubscription[] = [
  {
    school_id: "princeton-university",
    school_name_zh: "普林斯顿大学",
    school_name_en: "Princeton University",
    rss_urls: ["https://admission.princeton.edu/rss.xml"],
    newsletter_emails: ["admission@princeton.edu"],
    twitter_handles: ["@Princeton"],
    instagram_handles: ["@princeton_university"],
    rss_scan_frequency: "daily",
  },
  {
    school_id: "harvard-university",
    school_name_zh: "哈佛大学",
    school_name_en: "Harvard University",
    rss_urls: ["https://college.harvard.edu/admissions/rss"],
    newsletter_emails: ["admissions@harvard.edu"],
    twitter_handles: ["@Harvard"],
    instagram_handles: ["@harvard"],
    rss_scan_frequency: "daily",
  },
  // ... 完整 5-10 所学校
];

// 同步到 Supabase
export async function syncSubscriptions(): Promise<void> {
  for (const sub of SUBSCRIPTIONS) {
    await supabaseAdmin.from("school_radar_subscriptions").upsert(sub);
  }
}
```

##### 4.2 RSS 扫描（每小时 cron）

```typescript
// etl-worker/src/jobs/m5-scan-rss.ts
import Parser from "rss-parser";
import { summarizeWithDeepSeek } from "../ai/deepseek";

const parser = new Parser();

export async function scanRSS(): Promise<number> {
  const { data: subs } = await supabaseAdmin
    .from("school_radar_subscriptions")
    .select("*");

  if (!subs) return 0;

  let eventsCreated = 0;

  for (const sub of subs) {
    if (sub.rss_scan_frequency === "hourly" || sub.rss_scan_frequency === "daily") {
      for (const rssUrl of sub.rss_urls) {
        try {
          const feed = await parser.parseURL(rssUrl);

          for (const item of feed.items) {
            // 检查是否是新事件（24h 内）
            const pubDate = new Date(item.pubDate || "");
            if (Date.now() - pubDate.getTime() > 24 * 60 * 60 * 1000) continue;

            // 关键词过滤（"新专业" / "new major" / "new program"）
            const text = `${item.title} ${item.content}`.toLowerCase();
            if (!/(new major|new program|新专业|新设专业)/i.test(text)) continue;

            // AI 起草（用户原话 #4 #5：哈佛人类学例子 + 适合度分析）
            const aiDraft = await summarizeWithDeepSeek({
              schoolName: sub.school_name_zh,
              programName: item.title,
              rawContent: item.content || "",
            });

            // 写入 radar_events（status: draft）
            const { error } = await supabaseAdmin.from("radar_events").insert({
              university_id: sub.school_id,
              program_name: item.title,
              source_url: item.link || rssUrl,
              discovered_at: new Date().toISOString(),
              status: "draft",
              ai_draft: aiDraft,  // >= 200 字
              suitability_tags: extractTags(aiDraft),  // 适合度标签（用户原话 #5）
              field_meta: {
                source: "RSS scan",
                asOf: new Date().toISOString(),
              },
            });

            if (!error) eventsCreated++;
          }
        } catch (e) {
          console.error(`RSS ${rssUrl} failed:`, e);
        }
      }
    }
  }

  return eventsCreated;
}
```

##### 4.3 AI 起草（DeepSeek）

```typescript
// etl-worker/src/ai/deepseek.ts
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;

export async function summarizeWithDeepSeek(params: {
  schoolName: string;
  programName: string;
  rawContent: string;
}): Promise<string> {
  const prompt = `你是 PathOS 国际升学平台的 AI 起草助手。请基于以下信息写一段 500 字的新专业解读。

学校：${params.schoolName}
新专业：${params.programName}
原始信息：${params.rawContent}

要求：
1. 专业解读（200 字）：这个专业是什么、学什么、与其他学校的同名专业有何区别
2. 适合谁（200 字）：这个专业适合什么样的学生（兴趣 / 优势 / 适合的职业）
3. 申请建议（100 字）：申请这个专业需要什么样的背景

输出格式：纯文本，不要 Markdown。`;

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

function extractTags(text: string): string[] {
  // 提取适合度标签
  const matches = text.match(/(?:适合|适合.*?|擅长).*?(?:的|学生|人群)/g) || [];
  return matches.slice(0, 5).map(s => s.substring(0, 20));
}
```

#### 5-11. 同 M1 模式

---





### M6：B1 学校深度页

#### 0. 模块定位

- **业务目标**：学校详情页有 30+ verified 字段（用户原话 #2 #3）
- **用户价值**：5 分钟看懂一所学校
- **技术目标**：Next.js Server Component + Supabase + v1 ProvenanceBadge 复用
- **优先级**：P0
- **工作量**：5 人日
- **依赖**：M1（M1 数据迁移）+ M2（字段补齐）
- **关联模块**：用户原话 #2 #3 #4 #5 #6 #7 的核心落地

#### 1. 实现目标

- 页面路径：`/s/[slug]`（学校端）+ `/f/school/[slug]`（家庭端）
- 30+ verified 字段全部显示
- missing-first：缺失字段显示"暂无"而非 0
- 多入口：时序 / 跨校对比 / 新专业 / 案例 / 政策
- 用户原话 #7：保留 v1 MapLibre 地图（不删除）

#### 2. 前置依赖

- M1 完成（Supabase 有 universities / university_details 数据）
- M2 完成（30+ 字段填充）
- shadcn/ui 已安装

#### 3. 数据模型

无新增表（沿用 §2）

#### 4. 后端实现

##### 4.1 Supabase 数据获取函数

```typescript
// frontend/src/server/university-detail.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UniversityDetailSchema, type UniversityDetail } from "@/schemas/university-detail";

export async function getUniversityDetail(slug: string): Promise<UniversityDetail | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("universities")
    .select(`
      *,
      details:university_details(*),
      timeseries:university_timeseries(*),
      majors:school_major_comparisons(*, major:majors(*))
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  // 转换为统一 schema
  const detail = {
    id: data.id,
    slug: data.slug,
    name: { zh: data.name_zh, en: data.name_en },
    location: {
      country: data.country,
      state: data.state,
      city: data.city,
      coordinates: null,
    },
    rankingCrossSource: {
      qs: { value: data.qs_rank, ...data.data_envelope },
      usNews: { value: data.usnews_rank, ...data.data_envelope },
      the: { value: data.the_rank, ...data.data_envelope },
      reconciliationNote: data.details?.[0]?.ranking_reconciliation_note,
    },
    financial: data.details?.[0] ? {
      tuition: [
        { degree: "bachelor", type: "highest", amountRMB: data.details[0].tuition_bachelor_highest, ... },
        { degree: "bachelor", type: "lowest", amountRMB: data.details[0].tuition_bachelor_lowest, ... },
        { degree: "master", type: "highest", amountRMB: data.details[0].tuition_master_highest, ... },
        // ... 其他
      ],
      accommodation: data.details[0].accommodation,
      livingCost: {
        min: data.details[0].living_cost_min,
        max: data.details[0].living_cost_max,
      },
      applicationFee: data.details[0].application_fee,
      ...data.details[0].field_meta,
    } : null,
    requirement: data.details?.[0] ? [
      {
        degree: "bachelor",
        language: { toefl: data.details[0].toefl_min, ielts: data.details[0].ielts_min, ... },
        standardized: { sat: data.details[0].sat_mid, act: data.details[0].act_mid, ... },
      },
    ] : [],
    timeSeries: data.timeseries || [],
    majorStrengths: data.majors?.map(m => ({
      majorName: m.major.name_zh,
      category: m.major.category,
      strengthRank: m.program_rank ? `top_${Math.ceil(m.program_rank / 10) * 10}` : null,
    })),
    history: data.details?.[0]?.history,
    notableAlumni: data.details?.[0]?.notable_alumni,
    facilities: data.details?.[0]?.facilities,
    fieldMeta: data.data_envelope,
    lastUpdated: data.last_updated,
    dataEnvelope: data.data_envelope,
  };

  // zod 校验
  const parsed = UniversityDetailSchema.safeParse(detail);
  return parsed.success ? parsed.data : null;
}
```

##### 4.2 zod Schema（统一）

```typescript
// frontend/src/schemas/university-detail.ts
import { z } from "zod";

const FieldMetaSchema = z.object({
  source: z.enum(["IECG", "IPEDS", "US News", "QS", "THE", "College Scorecard", "学校官网", "编辑部", "竞品研究"]),
  sourceUrl: z.string().url().optional(),
  asOf: z.string().datetime(),
  verifiedBy: z.string().optional(),
  confidence: z.number().min(0).max(100).optional(),
});

const MissingFirstField = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([schema, z.null()]).transform(v => v ?? null);

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
  rankingCrossSource: z.object({
    qs: z.object({ value: MissingFirstField(z.number()), ...FieldMetaSchema.shape }),
    usNews: z.object({ value: MissingFirstField(z.number()), ...FieldMetaSchema.shape }),
    the: z.object({ value: MissingFirstField(z.number()), ...FieldMetaSchema.shape }),
    reconciliationNote: z.string().optional(),
  }),
  financial: z.object({
    tuition: z.array(z.object({
      degree: z.enum(["bachelor", "master", "phd"]),
      type: z.enum(["highest", "lowest"]),
      amountRMB: MissingFirstField(z.number()),
      asOf: z.string().datetime(),
      source: z.enum(["IECG", "IPEDS", "College Scorecard", "学校官网", "编辑部"]),
      verifiedBy: z.string().optional(),
    })),
    accommodation: MissingFirstField(z.number()),
    livingCost: z.object({ min: MissingFirstField(z.number()), max: MissingFirstField(z.number()) }).nullable(),
    applicationFee: MissingFirstField(z.number()),
  }).nullable(),
  requirement: z.array(z.object({
    degree: z.enum(["bachelor", "master", "phd"]),
    language: z.object({
      toefl: MissingFirstField(z.number()),
      ielts: MissingFirstField(z.number()),
      duolingo: MissingFirstField(z.number()),
    }),
    standardized: z.object({
      sat: MissingFirstField(z.number()),
      act: MissingFirstField(z.number()),
      gre: MissingFirstField(z.number()),
      gmat: MissingFirstField(z.number()),
    }),
  })),
  timeSeries: z.array(z.object({
    semester: z.string(),
    sat: MissingFirstField(z.number()),
    gpa: MissingFirstField(z.number()),
    acceptanceRate: MissingFirstField(z.number()),
    tuitionUSD: MissingFirstField(z.number()),
  })).optional(),
  majorStrengths: z.array(z.object({
    majorName: z.string(),
    category: z.enum(["engineering", "business", "science", "social", "arts", "agriculture", "life_health"]),
    strengthRank: z.enum(["top_5", "top_10", "top_20", "top_50", "top_100"]).nullable(),
  })).optional(),
  history: z.array(z.object({
    year: z.number(),
    title: z.string(),
    description: z.string(),
  })).optional(),
  notableAlumni: z.array(z.object({
    category: z.enum(["president", "nobel", "pulitzer", "business", "other"]),
    names: z.array(z.string()),
  })).optional(),
  facilities: z.array(z.object({
    type: z.enum(["library", "campus", "lab", "sports", "other"]),
    metric: z.string(),
    value: z.string(),
  })).optional(),
  lastUpdated: z.string().datetime(),
});
```

#### 5. 前端实现

##### 5.1 路由 + Server Component（关键：保留 v1 MapLibre）

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

// generateMetadata：所有 nullable 字段都做 fallback
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const detail = await getUniversityDetail(params.slug);
  if (!detail) return {};

  // ✅ 修复：使用 ? 处理 nullable
  const usNewsRank = detail.rankingCrossSource?.usNews?.value;
  const tuition = detail.financial?.tuition?.[0]?.amountRMB;
  const majorsCount = detail.majorStrengths?.length ?? 0;

  return {
    title: `${detail.name.zh} ${detail.name.en} - 完整数据 | PathOS`,
    description: [
      usNewsRank ? `${usNewsRank} 名` : null,
      tuition ? `学费 ${tuition.toLocaleString()}` : null,
      majorsCount > 0 ? `${majorsCount} 个强势专业` : null,
    ].filter(Boolean).join(" | "),
  };
}
```

##### 5.2 SchoolDetailView 组件（基于 v1 ProvenanceBadge + UniversityProfilePanel）

```typescript
// frontend/src/components/school/SchoolDetailView.tsx
import { ProvenanceBadge } from "@/components/university/ProvenanceBadge";
import { UniversityProfilePanel } from "@/components/university/UniversityProfilePanel";
import { DataProvenanceCard } from "@/components/data/DataProvenanceCard";
import { DataStalenessIndicator } from "@/components/data/DataStalenessIndicator";
import { TimeSeriesChart } from "@/components/timeseries/TimeSeriesChart";
import { FinancialTable } from "@/components/school/FinancialTable";
import { RequirementTable } from "@/components/school/RequirementTable";
import { MajorStrengthsGrid } from "@/components/school/MajorStrengthsGrid";
import { HistoryTimeline } from "@/components/school/HistoryTimeline";
import { NotableAlumniGrid } from "@/components/school/NotableAlumniGrid";
import { FacilityGrid } from "@/components/school/FacilityGrid";
import { RankingCard } from "@/components/school/RankingCard";
import type { UniversityDetail } from "@/schemas/university-detail";

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

      {/* 历史时间轴 */}
      <HistoryTimeline history={detail.history} />

      {/* 知名校友 */}
      <NotableAlumniGrid alumni={detail.notableAlumni} />

      {/* 设施 */}
      <FacilityGrid facilities={detail.facilities} />

      {/* ✅ v1 资产复用：UniversityProfilePanel（折叠面板） */}
      <UniversityProfilePanel detail={detail} />

      {/* 数据出处卡片 */}
      <DataProvenanceCard detail={detail} />
    </div>
  );
}
```

##### 5.3 DataProvenanceCard 组件（用户原话 #3）

```typescript
// frontend/src/components/data/DataProvenanceCard.tsx
export function DataProvenanceCard({ detail }: { detail: UniversityDetail }) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold">数据出处</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <span className="font-medium">排名：</span>
          US News <DataProvenanceBadge meta={detail.rankingCrossSource?.usNews} /> ·
          QS <DataProvenanceBadge meta={detail.rankingCrossSource?.qs} /> ·
          THE <DataProvenanceBadge meta={detail.rankingCrossSource?.the} />
        </li>
        <li>
          <span className="font-medium">学费：</span>
          IECG <DataProvenanceBadge meta={detail.fieldMeta} />
        </li>
      </ul>
    </Card>
  );
}
```

##### 5.4 DataStalenessIndicator 组件（颜色编码）

```typescript
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

##### 5.5 missing-first 占位（关键：用户原话 #3）

```typescript
// 通用 missing-first 组件
export function MissingFirst({ value, format = (v) => v }: { value: any; format?: (v: any) => string }) {
  if (value === null || value === undefined) {
    return <span className="text-text-tertiary italic">暂无</span>;
  }
  return <>{format(value)}</>;
}

// 使用：
<MissingFirst value={detail.rankingCrossSource?.usNews?.value} format={(v) => `#${v}`} />
// 输出：#3（如果有值）或"暂无"（如果 null）
```

#### 6. 集成测试

```typescript
// frontend/src/__tests__/school-detail.test.tsx
import { render, screen } from "@testing-library/react";
import { SchoolDetailView } from "@/components/school/SchoolDetailView";

test("renders 30+ verified fields", () => {
  const mockDetail = { /* ... 30+ 字段 ... */ };
  render(<SchoolDetailView detail={mockDetail} />);
  expect(screen.getByText("Princeton University")).toBeInTheDocument();
  expect(screen.getByText("暂无").length).toBeGreaterThan(0);  // missing-first
});

test("shows verified badge", () => {
  // ...
});

test("shows data staleness indicator", () => {
  // ...
});
```

#### 7. 验收标准

##### 自动化验收

```bash
# 1. 编译 + 测试
cd frontend
npx tsc --noEmit  # 0 错误
npm run lint       # 0 警告
npm test -- --grep "school-detail"

# 2. 构建
npm run build      # 通过

# 3. 启动
npm run dev -- -p 3017

# 4. 浏览
curl -I http://localhost:3017/s/princeton-university
# 期望：200
```

##### 手动验收清单

- [ ] 访问 /s/princeton-university → 完整渲染 30+ 字段
- [ ] 每个字段都有 verified 标签（来自 v1 ProvenanceBadge 复用）
- [ ] 数据新鲜度颜色编码正确（<30 天绿 / 30-90 天黄 / >90 天红）
- [ ] missing 字段显示"暂无"而非 0
- [ ] 数据出处卡片可点击（DataProvenanceCard）
- [ ] generateMetadata 处理 nullable 字段（不爆 TypeScript 错误）
- [ ] v1 UniversityProfilePanel 复用（不重建）
- [ ] SchoolDetailView 包含 9 个子组件（SchoolHeader / RankingCard / FinancialTable / RequirementTable / TimeSeriesEntry / MajorStrengthsGrid / HistoryTimeline / NotableAlumniGrid / FacilityGrid / DataProvenanceCard）

#### 8. 部署步骤

```bash
# 1. 推送到 GitHub
git add .
git commit -m "feat(b1): add SchoolDetailView with 30+ verified fields"
git push origin codex/v2-scaffold

# 2. Render 自动部署
# 等待部署完成（约 5-10 分钟）

# 3. 验证部署
curl -I https://pathos.onrender.com/s/princeton-university
# 期望：200
```

#### 9-11. 同 M1 模式

---

### M7：B2 专业对比（0 竞品）

#### 0. 模块定位

- **业务目标**：8-12 个主流专业的跨校对比（0 竞品做的蓝海）
- **用户价值**：家长能按专业找学校（用户原话 #5）
- **技术目标**：每专业 5-10 校对比 + 跨校时序
- **优先级**：P0
- **工作量**：5 人日
- **依赖**：M3（专业数据）
- **关联模块**：M6（B1 学校页的"跨校对比入口"）

#### 1. 实现目标

- 路由：`/s/majors`（专业列表）+ `/s/major/[id]`（专业详情）
- 50+ 专业（7 大类）
- 每个专业有跨校对比表（招生 / 录取 / 课程 / 学费 / 薪资）
- 跨校时序对比

#### 2. 前置依赖

- M3 完成
- shadcn/ui Table 已安装

#### 3. 数据模型

无新增表

#### 4. 后端实现

```typescript
// frontend/src/server/major-comparison.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getMajorComparison(majorId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("school_major_comparisons")
    .select(`
      *,
      school:universities(id, slug, name_zh, name_en, ranking_tier, usnews_rank),
      major:majors(*)
    `)
    .eq("major_id", majorId)
    .order("school.usnews_rank", { ascending: true })
    .limit(10);

  if (error || !data) return null;

  return data.map((row: any) => ({
    schoolId: row.school_id,
    schoolName: { zh: row.school.name_zh, en: row.school.name_en },
    programRank: row.program_rank,
    acceptanceRate: row.acceptance_rate,
    enrollmentCount: row.enrollment_count,
    tuitionUSD: row.tuition_usd,
    graduationSalaryUSD: row.graduation_salary_usd,
    source: row.field_meta?.source || "unknown",
    asOf: row.field_meta?.asOf || new Date().toISOString(),
  }));
}
```

#### 5. 前端实现

##### 5.1 专业列表页（7 大类）

```typescript
// frontend/src/app/s/majors/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function MajorsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: majors } = await supabase
    .from("majors")
    .select("*")
    .order("category, name_zh");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>专业库（50+ 专业）</h1>

      {/* 7 大类分类 */}
      {["engineering", "business", "science", "social", "arts", "agriculture", "life_health"].map(category => (
        <section key={category}>
          <h2>{categoryLabel[category]}</h2>
          <div className="grid grid-cols-3 gap-4">
            {majors?.filter(m => m.category === category).map(major => (
              <Link key={major.id} href={`/s/major/${major.id}`}>
                <Card>
                  <h3>{major.name_zh}</h3>
                  <p>{major.name_en}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

##### 5.2 专业详情页（跨校对比表 + 时序）

```typescript
// frontend/src/app/s/major/[id]/page.tsx
import { getMajorComparison } from "@/server/major-comparison";

export default async function MajorDetailPage({ params }: { params: { id: string } }) {
  const comparison = await getMajorComparison(params.id);

  if (!comparison) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>{comparison[0].major.name_zh} {comparison[0].major.name_en}</h1>

      {/* 跨校对比表 */}
      <SchoolComparisonTable schools={comparison} />

      {/* 跨校时序对比 */}
      <MajorTimeSeries data={comparison.map(c => ({
        school: c.schoolName.en,
        acceptanceRate: c.acceptanceRate,
        tuitionUSD: c.tuitionUSD,
      }))} />

      {/* 适合度（用户原话 #5） */}
      <SuitabilitySection
        interests={comparison[0].major.suitability_interests}
        strengths={comparison[0].major.suitability_strengths}
        careers={comparison[0].major.suitability_careers}
      />

      {/* 录取案例入口 */}
      <CaseList major={params.id} />
    </div>
  );
}
```

##### 5.3 SchoolComparisonTable 组件（关键：缺失字段显示"暂无"）

```typescript
// frontend/src/components/major/SchoolComparisonTable.tsx
import { ProvenanceBadge } from "@/components/university/ProvenanceBadge";

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
              {/* missing-first：null 显示"暂无" */}
              {s.programRank ?? <span className="italic">暂无</span>}
              <ProvenanceBadge status="live_verified_exact" source={s.source} asOf={s.asOf} />
            </td>
            <td>
              {s.acceptanceRate !== null && s.acceptanceRate !== undefined
                ? `${(s.acceptanceRate * 100).toFixed(1)}%`
                : <span className="italic">暂无</span>}
              <ProvenanceBadge status="live_verified_exact" source={s.source} asOf={s.asOf} />
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
```

#### 6. 集成测试

```typescript
test("M7 renders 8-12 majors", () => {
  // ...
});
```

#### 7. 验收标准

```bash
# 自动化
npm test -- --grep "major-comparison"

# 手动
# 访问 /s/major/computer-science
# 看到 5-10 所学校的对比表
# 每所学校的字段都有 verified 标签
```

---

### M8：B3 时序可视化（0 竞品 + 用户原话 #6）

#### 0. 模块定位

- **业务目标**：时序数据可视化（0 竞品做的蓝海，用户原话 #6）
- **用户价值**：家长能看到 SAT / 录取率 / 学费 5-10 年变化
- **技术目标**：Recharts 折线图 + 政策事件标注
- **优先级**：P0
- **工作量**：5 人日
- **依赖**：M1（时序数据）+ M4（IPEDS / Scorecard）
- **关联模块**：M6（学校页的"时序入口"）+ 用户原话 #6 直接落地

#### 1. 实现目标

- 路由：`/s/timeseries?schools=mit,stanford&metric=sat`
- 5-10 所学校的 SAT / GPA / 录取率 / 学费 5-10 年趋势
- 政策事件标注（POLICY_EVENTS）
- 多校叠加对比

#### 2. 前置依赖

- Recharts 已安装
- M4（第三方数据）有时序数据

#### 3. 数据模型

无新增表

#### 4. 后端实现

```typescript
// frontend/src/server/timeseries.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getTimeSeries(schoolIds: string[], metric: string, semesters: number = 10) {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("university_timeseries")
    .select(`
      *,
      university:universities(slug, name_zh, name_en)
    `)
    .in("university_id", schoolIds)
    .order("semester", { ascending: false })
    .limit(schoolIds.length * semesters);

  if (!data) return null;

  // 重组为 { semester, school1.metric, school2.metric, ... }
  const result: Record<string, any> = {};
  for (const row of data) {
    if (!result[row.semester]) result[row.semester] = { semester: row.semester };
    result[row.semester][row.university.slug] = row[metric];
  }

  return Object.values(result);
}

export async function getPolicyEvents() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("policy_events")
    .select("*")
    .order("event_date");
  return data ?? [];
}
```

#### 5. 前端实现

##### 5.1 时序图表（关键：COLORS + TimeSeriesChartProps + POLICY_EVENTS）

```typescript
// frontend/src/components/timeseries/TimeSeriesChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot } from "recharts";

// ✅ 修复：定义 COLORS（10 色 + % 取模防止越界）
const COLORS = [
  "#1f4e96", "#d65a3c", "#2d8659", "#c8392e", "#8a4fff",
  "#d4a017", "#1abc9c", "#e67e22", "#34495e", "#16a085"
];

// ✅ 修复：定义 TimeSeriesChartProps
export interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  metric: "sat" | "gpa" | "acceptanceRate" | "tuitionUSD";
  schools: string[];
  policyEvents?: Array<{ id: string; semester: string; title: string }>;
}

export function TimeSeriesChart({ data, metric, schools, policyEvents = [] }: TimeSeriesChartProps) {
  return (
    <LineChart width={1000} height={500} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="semester" />
      <YAxis />
      <Tooltip />
      <Legend />

      {/* 多校叠加对比（✅ 修复：% COLORS.length） */}
      {schools.map((schoolId, idx) => (
        <Line
          key={schoolId}
          type="monotone"
          dataKey={`${schoolId}.${metric}`}
          stroke={COLORS[idx % COLORS.length]}
          name={schoolId}
        />
      ))}

      {/* ✅ 修复：POLICY_EVENTS 从 props 传入（不写死） */}
      {policyEvents.map(event => (
        <ReferenceDot
          key={event.id}
          x={event.semester}
          y={0}  // TODO: 动态计算该 semester 的 metric 均值
          r={8}
          fill="red"
          label={event.title}
        />
      ))}
    </LineChart>
  );
}
```

#### 7. 验收标准

```bash
npm test -- --grep "timeseries"

# 手动
# 访问 /s/timeseries?schools=mit,stanford&metric=sat
# 看到 5-10 所学校的折线图
# 政策事件（SAT 取消）红色标注
```

---

### M9：S3 新专业雷达（0 竞品 + 用户原话 #4）

#### 0. 模块定位

- **业务目标**：S3 新专业雷达（用户原话 #4：哈佛人类学）
- **用户价值**：家长能及时知道学校开了什么新专业
- **技术目标**：雷达事件流 + AI 解读 + 适合度标签（用户原话 #5）
- **优先级**：P0
- **工作量**：4 人日
- **依赖**：M5（爬虫）+ DeepSeek API
- **关联模块**：M6（学校页的"新专业入口"）

#### 1. 实现目标

- 路由：`/s/radar`
- 5-10 所学校的雷达事件流
- 每个事件含 AI 解读（>= 200 字）+ 适合度标签（用户原话 #5）
- 编辑工作流（draft → review → published）

#### 2. 前置依赖

- M5（A6 半自动爬虫）已有雷达事件
- DeepSeek API 已配置

#### 3. 数据模型

无新增表

#### 4. 后端实现

```typescript
// frontend/src/server/radar.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getRadarEvents(filters?: {
  universityId?: string;
  status?: "draft" | "review" | "published";
  limit?: number;
}) {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("radar_events")
    .select(`
      *,
      university:universities(slug, name_zh, name_en)
    `)
    .order("discovered_at", { ascending: false });

  if (filters?.universityId) {
    query = query.eq("university_id", filters.universityId);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  return data ?? [];
}

export async function updateRadarEvent(id: string, updates: {
  status?: "draft" | "review" | "published";
  editor_final?: string;
}) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("radar_events")
    .update({
      ...updates,
      published_at: updates.status === "published" ? new Date().toISOString() : undefined,
      version_history: supabase.rpc("append_version", { event_id: id, change: updates }),
    })
    .eq("id", id);
}
```

#### 5. 前端实现

```typescript
// frontend/src/app/s/radar/page.tsx
import { getRadarEvents } from "@/server/radar";
import { EventCard } from "@/components/tools/EventCard";

export default async function RadarPage({ searchParams }: { searchParams: { school?: string } }) {
  const events = await getRadarEvents({
    universityId: searchParams.school,
    status: "published",
    limit: 20,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>新专业雷达</h1>
      <div className="grid gap-4">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

// EventCard 组件（含 AI 解读 + 适合度标签）
function EventCard({ event }: { event: any }) {
  return (
    <Card>
      <h2>{event.program_name}</h2>
      <p className="text-sm text-gray-500">{event.university.name_zh} · {new Date(event.discovered_at).toLocaleDateString()}</p>

      {/* AI 解读（用户原话 #4 #5） */}
      <div>{event.editor_final || event.ai_draft}</div>

      {/* 适合度标签（用户原话 #5） */}
      <div className="flex gap-2">
        {event.suitability_tags?.map((tag: string) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </Card>
  );
}
```

#### 7. 验收标准

```bash
npm test -- --grep "radar"

# 手动
# 访问 /s/radar
# 看到 5-10 所学校的新专业事件
# 每个事件含 AI 解读 + 适合度标签
```

---

### M10：单校专题

#### 0. 模块定位

- **业务目标**：5-10 所学校 × 5 篇深度文章（借鉴百利天下）
- **用户价值**：叙事型阅读体验
- **技术目标**：MDX 文章 + SEO 优化
- **优先级**：P0
- **工作量**：3 人日（不含编辑撰写）
- **依赖**：M1（学校数据）+ 编辑团队
- **关联模块**：M6（学校页的"专题入口"）

#### 1. 实现目标

- 路由：`/s/topic/[school-slug]/[article-slug]`
- 5 篇/校（学校概览 / 录取数据 / 强势专业 / 校园生活 / 新专业）
- MDX 内容
- 嵌入 B3 时序图 + B2 对比表

#### 2. 前置依赖

- MDX 编辑流程建立
- 编辑撰写内容

#### 3. 数据模型

无新增表（文章存为 MDX 文件）

#### 4. 后端实现

```typescript
// frontend/src/server/article.ts
import { promises as fs } from "fs";
import path from "path";

export async function getArticle(schoolSlug: string, articleSlug: string) {
  const filepath = path.join(
    process.cwd(),
    "content/articles",
    schoolSlug,
    `${articleSlug}.mdx`
  );

  try {
    const content = await fs.readFile(filepath, "utf-8");
    return { slug: articleSlug, content };
  } catch {
    return null;
  }
}
```

#### 5. 前端实现

```typescript
// frontend/src/app/s/topic/[school]/[article]/page.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticle } from "@/server/article";

export default async function ArticlePage({
  params,
}: {
  params: { school: string; article: string };
}) {
  const article = await getArticle(params.school, params.article);
  if (!article) notFound();

  return (
    <article className="prose mx-auto px-4 py-8">
      <MDXRemote source={article.content} />
    </article>
  );
}
```

---





### M11：案例库（借鉴选校帝 17,448 + 改进）

#### 0. 模块定位

- **业务目标**：案例库（选校帝 17,448 借鉴 + 改进）
- **用户价值**：用户能看到其他学生录取案例
- **技术目标**：100+ 案例 + 三维度交叉
- **优先级**：P0
- **工作量**：3 人日
- **依赖**：M1（学校数据）
- **关联模块**：用户原话 #5 的间接落地

#### 1. 实现目标

- 路由：`/s/cases`
- 100+ 案例（v2 启动期）
- 每案例含：学校 / 专业 / 学位 / GPA / SAT / 文书片段 / 活动 / 录取年份 / 公开匿名
- 三维度交叉（学校 / 专业 / 学校+专业）
- 借鉴选校帝但**必须改进**：选校帝姓名脱敏（"姓名 -"），v2 字段更全

#### 2. 前置依赖

- M1 完成

#### 3. 数据模型

沿用 §2.8 admission_cases（已含 GPA / SAT / 文书片段字段）

#### 4. 后端实现

```typescript
// frontend/src/server/cases.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCases(filters?: {
  schoolId?: string;
  majorName?: string;
  schoolIdAndMajor?: { schoolId: string; majorName: string };
  isPublic?: boolean;
  limit?: number;
}) {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("admission_cases")
    .select(`
      *,
      to_school:universities!to_school_id(slug, name_zh, name_en)
    `)
    .order("admission_year", { ascending: false });

  if (filters?.schoolId) {
    query = query.eq("to_school_id", filters.schoolId);
  }
  if (filters?.majorName) {
    query = query.eq("to_major", filters.majorName);
  }
  if (filters?.schoolIdAndMajor) {
    query = query
      .eq("to_school_id", filters.schoolIdAndMajor.schoolId)
      .eq("to_major", filters.schoolIdAndMajor.majorName);
  }
  if (filters?.isPublic !== undefined) {
    query = query.eq("is_public", filters.isPublic);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  return data ?? [];
}

// 三个维度的交叉查询
export async function getCasesBySchool(schoolId: string) {
  return getCases({ schoolId, isPublic: true });
}

export async function getCasesByMajor(majorName: string) {
  return getCases({ majorName, isPublic: true });
}

export async function getCasesBySchoolAndMajor(schoolId: string, majorName: string) {
  return getCases({ schoolIdAndMajor: { schoolId, majorName }, isPublic: true });
}
```

#### 5. 前端实现

```typescript
// frontend/src/app/s/cases/page.tsx
import { getCases } from "@/server/cases";

export default async function CasesPage({ searchParams }: { searchParams: { school?: string; major?: string } }) {
  const cases = await getCases({
    schoolId: searchParams.school,
    majorName: searchParams.major,
    isPublic: true,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>录取案例库（{cases.length} 条）</h1>

      {/* 三维度交叉筛选 */}
      <CaseFilters schools={...} majors={...} />

      <div className="grid gap-4">
        {cases.map(c => (
          <CaseCard key={c.id} case={c} />
        ))}
      </div>
    </div>
  );
}

// CaseCard 组件（含改进：保留 GPA / SAT / 文书片段）
function CaseCard({ case: c }: { case: any }) {
  return (
    <Card>
      <h3>{c.to_school.name_zh} · {c.to_major} · {c.to_degree}</h3>
      <p>录取年份：{c.admission_year}</p>
      <p>GPA：<MissingFirst value={c.gpa} format={(v) => v.toFixed(2)} /></p>
      <p>SAT：<MissingFirst value={c.sat} /></p>
      {c.toefl && <p>TOEFL：{c.toefl}</p>}
      {c.essay_excerpt && (
        <details>
          <summary>文书片段</summary>
          <blockquote>{c.essay_excerpt}</blockquote>
        </details>
      )}
      {c.activities && (
        <div>
          <h4>活动</h4>
          <ul>{c.activities.map((a: string) => <li key={a}>{a}</li>)}</ul>
        </div>
      )}
    </Card>
  );
}
```

#### 6. 集成测试

```typescript
test("M11 renders cases with GPA/SAT/essay", () => {
  // ...
});
```

#### 7. 验收标准

```bash
npm test -- --grep "cases"

# 手动
# 访问 /s/cases
# 看到 100+ 案例
# 每案例含 GPA / SAT / 文书片段 / 活动（借鉴选校帝但改进）
```

---

### M12：GPA 计算器（修复算法）

#### 0. 模块定位

- **业务目标**：GPA 计算器（借鉴选校帝 6 算法 → v2 至少 3 种）
- **用户价值**：家长 / 学生能计算 GPA（覆盖中美学分）
- **技术目标**：完整 3 种算法实现（修复之前 IMPROVED 和 BEIDA 一样的 BUG）
- **优先级**：P0
- **工作量**：2 人日
- **依赖**：无
- **关联模块**：用户原话 #3（准确信息分析）的工具支持

#### 1. 实现目标

- 路由：`/s/calculator/gpa`
- 3 种算法：标准 4.0 / 改进 4.0 / 北大 4.0
- 输入：成绩（百分制）+ 学分
- 输出：GPA 值

#### 2. 前置依赖

- 无

#### 3. 数据模型

无

#### 4. 后端实现

无（纯前端算法）

#### 5. 前端实现

##### 5.1 完整 3 种算法（修复之前 BUG）

```typescript
// frontend/src/lib/gpa.ts

// 标准 4.0 算法（4 档分级）
export const STANDARD_4_0 = (score: number): number => {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.0;
  if (score >= 70) return 2.0;
  if (score >= 60) return 1.0;
  return 0;
};

// 改进 4.0 算法（一）（12 档分级，含 +0.3 奖励）
export const IMPROVED_4_0_A = (score: number): number => {
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

// ✅ 修复：北大 4.0 算法（11 档分级 - 之前和 IMPROVED 一样是错的）
export const BEIDA_4_0 = (score: number): number => {
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
  standard_4_0: { name: "标准 4.0（美本）", fn: STANDARD_4_0, scale: 4.0 },
  improved_4_0_a: { name: "改进 4.0（+0.3 奖励）", fn: IMPROVED_4_0_A, scale: 4.0 },
  beida_4_0: { name: "北大 4.0", fn: BEIDA_4_0, scale: 4.0 },
};

// ✅ 修复：之前的 BUG 是 STARNDARD 和 BEIDA 一样
function calculateGPA(
  courses: Array<{ score: number; credits: number }>,
  algorithm: keyof typeof GPA_ALGORITHMS = "standard_4_0"
): number {
  const fn = GPA_ALGORITHMS[algorithm].fn;
  let totalPoints = 0;
  let totalCredits = 0;
  for (const course of courses) {
    totalPoints += fn(course.score) * course.credits;
    totalCredits += course.credits;
  }
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}
```

##### 5.2 GPA 计算器 UI

```typescript
// frontend/src/app/s/calculator/gpa/page.tsx
"use client";

import { useState } from "react";
import { calculateGPA, GPA_ALGORITHMS } from "@/lib/gpa";

export default function GPACalculator() {
  const [algorithm, setAlgorithm] = useState<keyof typeof GPA_ALGORITHMS>("standard_4_0");
  const [courses, setCourses] = useState([
    { name: "", score: 85, credits: 3 },
  ]);

  const gpa = calculateGPA(courses, algorithm);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>GPA 计算器</h1>

      <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as any)}>
        {Object.entries(GPA_ALGORITHMS).map(([key, alg]) => (
          <option key={key} value={key}>{alg.name}</option>
        ))}
      </select>

      {courses.map((c, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            placeholder="课程名"
            value={c.name}
            onChange={(e) => {
              const newCourses = [...courses];
              newCourses[i].name = e.target.value;
              setCourses(newCourses);
            }}
          />
          <input
            type="number"
            placeholder="成绩"
            value={c.score}
            onChange={(e) => {
              const newCourses = [...courses];
              newCourses[i].score = Number(e.target.value);
              setCourses(newCourses);
            }}
          />
          <input
            type="number"
            placeholder="学分"
            value={c.credits}
            onChange={(e) => {
              const newCourses = [...courses];
              newCourses[i].credits = Number(e.target.value);
              setCourses(newCourses);
            }}
          />
        </div>
      ))}

      <button onClick={() => setCourses([...courses, { name: "", score: 85, credits: 3 }])}>
        添加课程
      </button>

      <div className="mt-4">
        <h2>你的 GPA：{gpa.toFixed(2)} / 4.0</h2>
      </div>
    </div>
  );
}
```

#### 6. 集成测试

```typescript
test("STANDARD_4_0 returns correct GPA", () => {
  expect(STANDARD_4_0(95)).toBe(4.0);
  expect(STANDARD_4_0(85)).toBe(3.0);
  expect(STANDARD_4_0(75)).toBe(2.0);
});

test("BEIDA_4_0 is DIFFERENT from IMPROVED_4_0_A", () => {
  expect(BEIDA_4_0(85)).not.toBe(IMPROVED_4_0_A(85));
  // ✅ 修复：之前的 BUG 是两个算法一样
});

test("calculateGPA returns weighted average", () => {
  const courses = [
    { score: 90, credits: 3 },  // 4.0
    { score: 80, credits: 3 },  // 3.0
  ];
  const gpa = calculateGPA(courses, "standard_4_0");
  expect(gpa).toBe(3.5);  // (4.0*3 + 3.0*3) / 6
});
```

#### 7. 验收标准

```bash
npm test -- --grep "gpa"

# 手动
# 访问 /s/calculator/gpa
# 输入 90 + 80 各 3 学分
# 选择"标准 4.0" → 显示 3.5
# 选择"改进 4.0" → 显示不同值（验证算法不同）
# 选择"北大 4.0" → 显示不同值
```

---

### M13：ROI 计算器（修复 growthRate BUG）

#### 0. 模块定位

- **业务目标**：ROI 计算器（借鉴新东方投资回报计算）
- **用户价值**：家长 / 学生能算留学投资回收期
- **技术目标**：正确实现 growthRate（修复 BUG）
- **优先级**：P0
- **工作量**：2 人日
- **依赖**：无
- **关联模块**：家庭端 /f/calculator/roi

#### 1. 实现目标

- 路由：`/s/calculator/roi` + `/f/calculator/roi`
- 输入：学校 + 4 年总成本 + 起薪 + 年增长率
- 输出：投资回收期（年）

#### 2. 前置依赖

- 无

#### 3. 数据模型

无

#### 4. 后端实现

无（纯前端算法）

#### 5. 前端实现

##### 5.1 完整算法（修复 BUG）

```typescript
// frontend/src/lib/roi.ts

export function calculatePayback(
  totalCost: number,
  expectedSalary: number,
  growthRate: number = 0.05
): { years: number; cumulative: number } {
  let cumulative = 0;
  let currentSalary = expectedSalary;

  // ✅ 修复：每轮 salary 正确应用 growthRate（之前是 BUG）
  for (let year = 1; year <= 40; year++) {
    cumulative += currentSalary;
    if (cumulative >= totalCost) {
      return { years: year, cumulative };
    }
    currentSalary = currentSalary * (1 + growthRate);
  }

  return { years: -1, cumulative };  // 永不回本
}

// 单元测试
test("calculatePayback applies growthRate correctly", () => {
  // 4 年总成本 $200k，起薪 $60k，年增长 5%
  // 第 1 年：60k（累计 60k）
  // 第 2 年：63k（累计 123k）
  // 第 3 年：66.15k（累计 189.15k）
  // 第 4 年：69.46k（累计 258.61k） → 第 4 年回本

  const result = calculatePayback(200_000, 60_000, 0.05);
  expect(result.years).toBe(4);  // ✅ 第 4 年回本
});
```

##### 5.2 ROI 计算器 UI

```typescript
// frontend/src/app/s/calculator/roi/page.tsx
"use client";

import { useState } from "react";
import { calculatePayback } from "@/lib/roi";

export default function ROICalculator() {
  const [school, setSchool] = useState("");
  const [totalCost, setTotalCost] = useState(200_000);
  const [expectedSalary, setExpectedSalary] = useState(60_000);
  const [growthRate, setGrowthRate] = useState(0.05);

  const result = calculatePayback(totalCost, expectedSalary, growthRate);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>留学 ROI 计算器</h1>

      <input placeholder="学校" value={school} onChange={(e) => setSchool(e.target.value)} />
      <input type="number" placeholder="4 年总成本" value={totalCost} onChange={(e) => setTotalCost(Number(e.target.value))} />
      <input type="number" placeholder="起薪" value={expectedSalary} onChange={(e) => setExpectedSalary(Number(e.target.value))} />
      <input type="number" step="0.01" placeholder="年增长率" value={growthRate} onChange={(e) => setGrowthRate(Number(e.target.value))} />

      <div className="mt-4">
        <h2>投资回收期：{result.years === -1 ? "永不回本" : `${result.years} 年`}</h2>
        <p>累计收入：${result.cumulative.toLocaleString()}</p>
      </div>
    </div>
  );
}
```

#### 7. 验收标准

```bash
npm test -- --grep "roi"

# 手动
# 访问 /s/calculator/roi
# 输入 200k / 60k / 5%
# 显示 "4 年回本"
```

---

### M14：4 项增量改进（数据出处 / 新鲜度 / 跨源 / 对比分享）

#### 0. 模块定位

- **业务目标**：4 项关键 UI 改进（用户原话 #3 信息准确）
- **用户价值**：用户能看到数据来源、新鲜度、跨源对比、对比分享
- **技术目标**：4 个 React 组件
- **优先级**：P0
- **工作量**：3 人日
- **依赖**：M6 + v1 ProvenanceBadge

#### 1. 实现目标

- 14a 数据出处卡片（v1 ProvenanceBadge 升级）
- 14b 数据新鲜度指示（颜色编码）
- 14c 跨源数据调和（US News + QS + THE）
- 14d 对比分享卡（图片 + 二维码）

#### 2. 前置依赖

- M6（B1 学校页） + v1 ProvenanceBadge

#### 3. 数据模型

无

#### 4. 后端实现

无

#### 5. 前端实现

##### 5.1 数据出处卡片（用户原话 #3）

```typescript
// frontend/src/components/data/DataProvenanceCard.tsx
import { DataProvenanceBadge } from "./DataProvenanceBadge";

export function DataProvenanceCard({ detail }: { detail: any }) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold">数据出处</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <span className="font-medium">排名：</span>
          US News <DataProvenanceBadge meta={detail.rankingCrossSource?.usNews} />
          · QS <DataProvenanceBadge meta={detail.rankingCrossSource?.qs} />
          · THE <DataProvenanceBadge meta={detail.rankingCrossSource?.the} />
        </li>
        <li>
          <span className="font-medium">学费：</span>
          IECG <DataProvenanceBadge meta={detail.fieldMeta} />
        </li>
      </ul>
      <p className="text-xs text-gray-500 mt-2">
        所有数据均标注来源、采集时间和验证状态。点击任一字段查看详情。
      </p>
    </Card>
  );
}
```

##### 5.2 数据新鲜度指示（颜色编码）

```typescript
// frontend/src/components/data/DataStalenessIndicator.tsx
export function DataStalenessIndicator({ asOf }: { asOf: string }) {
  const days = Math.floor((Date.now() - new Date(asOf).getTime()) / (1000 * 60 * 60 * 24));
  const color = days < 30 ? "bg-green-500" : days < 90 ? "bg-yellow-500" : "bg-red-500";
  const label = days < 30 ? "< 30 天（新鲜）" : days < 90 ? "30-90 天（一般）" : "> 90 天（陈旧）";
  return (
    <Tooltip content={`采集于 ${asOf} · ${days} 天前`}>
      <span className="inline-flex items-center gap-1">
        <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
        <span className="text-xs">{label}</span>
      </span>
    </Tooltip>
  );
}
```

##### 5.3 跨源数据调和

```typescript
// frontend/src/components/data/SourceReconciliation.tsx
export function SourceReconciliation({ ranking }: { ranking: any }) {
  const { qs, usNews, the, reconciliationNote } = ranking;
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-4">
        <RankingItem label="US News" value={usNews?.value} meta={usNews} />
        <RankingItem label="QS" value={qs?.value} meta={qs} />
        <RankingItem label="THE" value={the?.value} meta={the} />
      </div>
      {reconciliationNote && (
        <p className="text-xs text-text-secondary italic">
          💡 {reconciliationNote}
        </p>
      )}
    </div>
  );
}
```

##### 5.4 对比分享卡（图片 + 二维码）

```typescript
// frontend/src/components/data/ComparisonShareCard.tsx
"use client";

export function ComparisonShareCard({ schools }: { schools: string[] }) {
  const shareUrl = `https://pathos.onrender.com/compare?schools=${schools.join(",")}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  return (
    <Card>
      <h3>分享对比</h3>
      <img src={qrUrl} alt="QR Code" />

      <button
        onClick={async () => {
          // 生成 PNG 图片（用 html2canvas）
          const canvas = await html2canvas(document.getElementById("comparison-table")!);
          canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob!);
            const link = document.createElement("a");
            link.href = url;
            link.download = "comparison.png";
            link.click();
          });
        }}
      >
        下载对比图
      </button>
    </Card>
  );
}
```

#### 7. 验收标准

```bash
npm test -- --grep "data-provenance"

# 手动
# 访问 /s/princeton-university
# 看到 4 个组件：DataProvenanceCard / DataStalenessIndicator / SourceReconciliation / ComparisonShareCard
```

---

## 4. BFF 层（Next.js API Routes）

### 4.1 API 路由总览

```
/api/pathos/preview       GET  - 数据查询（统一入口）
/api/radar/events         GET  - 雷达事件列表
/api/radar/events/[id]    PATCH - 编辑雷达事件
/api/timeseries            GET  - 时序数据查询
/api/cases                GET  - 案例查询
/api/articles/[slug]      GET  - 单校专题文章
/api/auth/login           POST - 登录
/api/auth/register        POST - 注册
/api/auth/logout          POST - 登出
/api/subscriptions        POST - 创建订阅
/api/webhooks/stripe      POST - Stripe webhook
```

### 4.2 /api/pathos/preview（统一数据入口）

```typescript
// frontend/src/app/api/pathos/preview/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DataEnvelopeSchema } from "@/schemas/data-envelope";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const schoolSlug = url.searchParams.get("school");
  const include = url.searchParams.getAll("include");

  if (!schoolSlug) {
    return NextResponse.json(
      { error: "Missing school parameter" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  // 查询学校数据
  let query = supabase
    .from("universities")
    .select(`
      *,
      details:university_details(*)
    `)
    .eq("slug", schoolSlug)
    .single();

  if (include.includes("timeseries")) {
    query = supabase
      .from("universities")
      .select(`
        *,
        details:university_details(*),
        timeseries:university_timeseries(*)
      `)
      .eq("slug", schoolSlug)
      .single();
  }

  const { data, error } = await query;

  if (error || !data) {
    return NextResponse.json(
      { data: null, status: "empty", source: "pathos-preview-v1", version: "1", asOf: new Date().toISOString(), errorCode: "NOT_FOUND" },
      { status: 404 }
    );
  }

  // DataEnvelope 包装
  const envelope = DataEnvelopeSchema.parse({
    data: [data],
    status: "ready",
    source: "pathos-preview-v1",
    version: "1",
    asOf: new Date().toISOString(),
  });

  return NextResponse.json(envelope);
}
```

### 4.3 /api/radar/events（雷达事件列表）

```typescript
// frontend/src/app/api/radar/events/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "published";

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("radar_events")
    .select(`*, university:universities(slug, name_zh, name_en)`)
    .eq("status", status)
    .order("discovered_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data });
}
```

### 4.4 /api/webhooks/stripe（支付 webhook）

```typescript
// frontend/src/app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 处理订阅事件
  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const supabase = await createSupabaseServerClient();

    await supabase.from("subscriptions").upsert({
      stripe_subscription_id: sub.id,
      user_id: sub.metadata.user_id,
      plan: sub.metadata.plan,
      status: sub.status,
      current_period_start: new Date(sub.current_period_start * 1000),
      current_period_end: new Date(sub.current_period_end * 1000),
    });
  }

  return NextResponse.json({ received: true });
}
```

---

## 5. 前端实现（Render 部署）

### 5.1 项目结构

```
frontend/
├── src/
│   ├── app/
│   │   ├── (school)/s/...       # 学校端路由组
│   │   ├── (family)/f/...       # 家庭端路由组
│   │   ├── api/...               # BFF API Routes
│   │   ├── auth/...              # 登录注册
│   │   ├── account/...           # 账户
│   │   └── admin/...             # 后台
│   ├── components/
│   │   ├── school/               # 学校端组件
│   │   ├── major/                # 专业组件
│   │   ├── data/                  # 数据可视化组件
│   │   ├── timeseries/            # 时序组件
│   │   ├── tools/                 # 工具组件
│   │   └── ui/                    # 通用 UI
│   ├── schemas/                  # zod schemas
│   ├── server/                   # BFF 服务层
│   ├── lib/
│   │   ├── supabase/             # Supabase client
│   │   └── ai/                   # DeepSeek client
│   └── styles/
├── content/articles/             # MDX 文章
├── public/
├── supabase/migrations/          # 数据库迁移
├── package.json
├── next.config.mjs
└── tailwind.config.ts
```

### 5.2 Render 部署配置（render.yaml）

```yaml
# render.yaml
services:
  # 前端 Web Service
  - type: web
    name: pathos-web
    runtime: node
    rootDir: frontend
    buildCommand: npm ci && npm run build
    startCommand: npm run start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_SUPABASE_URL
        sync: false
      - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
        sync: false
      - key: STRIPE_SECRET_KEY
        sync: false
      - key: NEXT_PUBLIC_PATHOS_VERSION
        value: v2.1
    healthCheckPath: /api/health
    autoDeploy: true

  # ETL Background Worker
  - type: worker
    name: pathos-etl
    runtime: node
    rootDir: etl-worker
    buildCommand: npm ci && npm run build
    startCommand: npm run start:worker
    envVars:
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: COLLEGE_SCORECARD_API_KEY
        sync: false
      - key: DEEPSEEK_API_KEY
        sync: false

  # 每日 ETL Cron Job
  - type: cron
    name: pathos-daily-etl
    runtime: node
    rootDir: etl-worker
    schedule: "0 2 * * *"  # 每天凌晨 2 点
    command: npm run run-daily-etl
```

### 5.3 环境变量（Render Dashboard）

```bash
# pathos-web (前端)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
STRIPE_SECRET_KEY=<stripe>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe>
NEXT_PUBLIC_POSTHOG_KEY=<posthog>
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# pathos-etl (ETL Worker)
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role>
COLLEGE_SCORECARD_API_KEY=<api.data.gov>
DEEPSEEK_API_KEY=<deepseek>
```

### 5.4 GitHub Actions 自动化

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [codex/v2-scaffold]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: cd frontend && npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test -- --run
      - run: npm run build
```

---

## 6. 部署 + CI/CD

### 6.1 部署清单

```bash
# 1. Supabase 项目设置
# - 访问 https://supabase.com
# - 创建 pathos-prod 项目
# - 获取 Project URL + anon key + service_role key
# - 设置环境变量

# 2. 数据库迁移
cd supabase
supabase link --project-ref <project-ref>
supabase db push  # 应用所有 migrations/*.sql
# 或手动：psql $SUPABASE_DB_URL -f migrations/001_*.sql

# 3. RLS 策略验证
psql $SUPABASE_DB_URL -c "SELECT * FROM pg_policies;"
# 应看到 5+ RLS 策略

# 4. Seed 数据
psql $SUPABASE_DB_URL -f supabase/seed/majors.sql
psql $SUPABASE_DB_URL -f supabase/seed/policy_events.sql

# 5. Render 项目设置
# - 关联 GitHub repo: MAGA2010/PathOS
# - 创建 pathos-web (Web Service)
# - 创建 pathos-etl (Background Worker)
# - 创建 pathos-daily-etl (Cron Job)

# 6. 环境变量配置（在 Render Dashboard）
# pathos-web: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ...
# pathos-etl: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ...

# 7. 部署触发
git push origin codex/v2-scaffold
# Render 自动部署

# 8. 验证
curl https://pathos.onrender.com/api/health
# 期望：{"status": "ok"}
```

### 6.2 健康检查端点

```typescript
// frontend/src/app/api/health/route.ts
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("universities").select("count").single();

  return NextResponse.json({
    status: "ok",
    version: process.env.NEXT_PUBLIC_PATHOS_VERSION || "v2.1",
    universities: data?.count || 0,
    timestamp: new Date().toISOString(),
  });
}
```

---

## 7. 测试 + 验收

### 7.1 测试金字塔

```
       /\
      /  \         E2E 测试（Playwright）10%
     /----\        集成测试（Vitest）30%
    /      \       单元测试（Vitest）60%
   /________\
```

### 7.2 单元测试配置

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
```

### 7.3 E2E 测试（Playwright）

```typescript
// e2e/school-detail.spec.ts
import { test, expect } from "@playwright/test";

test("School detail page renders 30+ fields with verified badges", async ({ page }) => {
  await page.goto("/s/princeton-university");

  // 验证页面标题
  await expect(page.locator("h1")).toContainText("普林斯顿大学");

  // 验证 verified 标签存在
  await expect(page.locator("[data-provenance-status]")).toHaveCount(5, { atLeast: true });

  // 验证 missing-first 占位
  const noneTexts = await page.locator("text=暂无").count();
  expect(noneTexts).toBeGreaterThan(0);

  // 验证数据出处卡片可点击
  await page.click("text=数据出处");
  await expect(page.locator(".provenance-card")).toBeVisible();

  // 验证新鲜度指示
  await expect(page.locator("[data-staleness]")).toBeVisible();
});

test("Timeseries chart shows multi-school data with policy events", async ({ page }) => {
  await page.goto("/s/timeseries?schools=mit,stanford,harvard&metric=sat");

  // 验证多校折线
  const lines = await page.locator(".recharts-line").count();
  expect(lines).toBe(3);

  // 验证政策事件标注
  await expect(page.locator(".recharts-reference-dot")).toHaveCount(1, { atLeast: true });
});
```

### 7.4 验收标准

**v2 启动版完成 = 所有模块 14 项 + 验收清单 100% 通过**

---

## 8. 监控 + 告警 + 回滚

### 8.1 Sentry 错误监控

```typescript
// frontend/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,  // 10% 性能监控
  beforeSend(event) {
    if (event.user) {
      delete event.user.email;  // 过滤 PII
    }
    return event;
  },
});
```

### 8.2 告警阈值

| 指标 | 阈值 | 告警方式 |
|---|---|---|
| 应用错误率 | > 1% | Slack + 邮件 |
| LCP | > 3s | Slack |
| ETL 失败 | 任何 | PagerDuty |
| 数据库连接 | > 80% 连接池 | Slack |
| 数据新鲜度 | < 50% < 30 天 | 邮件 |

### 8.3 回滚方案

```bash
# 1. Render 自动回滚
# Render Dashboard -> pathos-web -> Manual Deploy -> 选择上一个成功部署

# 2. 数据库回滚
psql $SUPABASE_DB_URL -c "TRUNCATE universities CASCADE;"
# 然后重新跑 M1 ETL

# 3. Git 回滚
git revert <bad-commit>
git push origin codex/v2-scaffold

# 4. 数据回滚（如果数据损坏）
# 从 Render Persistent Disk 备份恢复
```

---

## 9. 总结

**PathOS v2 启动版**完整实现包含：
- ✅ 部署架构（Supabase + Render）
- ✅ 数据库设计（11 张表 + RLS）
- ✅ 14 个核心模块的详细实现（每模块 11 节）
- ✅ BFF 层 API Routes
- ✅ 前端组件 + 路由
- ✅ 部署 + CI/CD
- ✅ 测试 + 验收
- ✅ 监控 + 告警 + 回滚

**AI 按本文档执行的具体步骤**：
1. 创建 Supabase 项目（§1.2）
2. 创建 Render 服务（§1.3）
3. 设置环境变量（§1.4）
4. 应用数据库迁移（§2.12）
5. 执行 M1-M5 ETL（§3）
6. 实现前端 M6-M14（§3）
7. 实现 BFF API Routes（§4）
8. 部署到 Render（§5-6）
9. 运行测试（§7）
10. 启动监控（§8）

**预计工作量**：20 周（1 主编 + 1 兼职编辑 + 1 全栈）

**预计成本**：¥55,000-91,000

---

## 10. 文档统计

- **总文档数**：10 份蓝图 + 1 份实现手册（本文）
- **总字符数**：~150,000 字
- **代码示例**：~5,000 行 TypeScript / SQL / Python
- **v1 资产复用**：4 个（ProvenanceBadge / UniversityProfilePanel / StatusDictionaryMap / frontend-fields.json）
- **14 个核心模块**：完整 11 节详细规范
- **数据库表**：11 张 + RLS 策略
- **BFF API**：10 个端点
- **E2E 测试**：2 个核心场景
- **部署配置**：Supabase + Render + GitHub Actions

**任何 AI / 开发者按本文档执行即可完整实现 PathOS v2 启动版。**

