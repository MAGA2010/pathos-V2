# PathOS v2 UI SPEC（UI 设计系统）v2.1

> **核心目的**：让任何前端 AI 拿到这份文档都能复现 v2 启动版的 UI。
>
> **v2.1 修订**：修复 Tailwind `<alpha-value>` 兼容 + 暗色模式命名 + 4 色继承 v1

---

## 0. 设计哲学

- **v1 沉淀保留**：editorial 风格（bracket frames / wave fields / earth from orbit）作为品牌资产
- **v1 4 色保留**：cobalt / persimmon / jade / ink（不只 2 色）
- **工具型清晰度**：所有工具页面（智能选校 / 时序 / 对比）用 SaaS 清晰度
- **missing-first**：每个字段缺失时诚实显示"暂无"而非省略或 0
- **数据置信度可视化**：每个数据点的 verified + asOf 都可见
- **家庭端 vs 学校端**：双层 UI（学校端 = 工具型 / 家庭端 = 叙事型）

---

## 1. 设计 Tokens

### 1.1 颜色 Tokens（v1 已有 4 色，v2 扩展）

**重要**：v1 已经有完整 4 色 token，v2 必须保留所有。

```css
/* frontend/src/app/globals.css */
:root {
  /* === Surface === */
  --color-surface-base: #f6f3ed;       /* 暖白 */
  --color-surface-raised: #ffffff;     /* 卡片 */
  --color-surface-sunken: #efebe3;     /* 嵌入 */
  --color-surface-overlay: rgba(0,0,0,0.5);  /* 模态 */

  /* === 主色 - Cobalt === */
  --color-cobalt-50: #e8eef5;
  --color-cobalt-100: #c5d3e6;
  --color-cobalt-500: #1f4e96;         /* 主色 */
  --color-cobalt-700: #143870;
  --color-cobalt-900: #0a2147;

  /* === 强调色 - Persimmon === */
  --color-persimmon-50: #fce8e1;
  --color-persimmon-100: #f7c5b3;
  --color-persimmon-500: #d65a3c;      /* 警告/强调 */
  --color-persimmon-700: #a83f24;

  /* === 成功色 - Jade（v1 已有，v2 必须保留） === */
  --color-jade-50: #e6f4ec;
  --color-jade-100: #b3e0c4;
  --color-jade-500: #2d8659;           /* 成功 */
  --color-jade-700: #1f5f40;

  /* === 文本色 - Ink === */
  --color-ink-primary: #1a1a1a;
  --color-ink-secondary: #4a4a4a;
  --color-ink-tertiary: #8a8a8a;
  --color-ink-inverse: #ffffff;

  /* === 文本色 - 别名（兼容） === */
  --color-text-primary: var(--color-ink-primary);
  --color-text-secondary: var(--color-ink-secondary);
  --color-text-tertiary: var(--color-ink-tertiary);

  /* === 语义色 === */
  --color-success: var(--color-jade-500);
  --color-warning: #d4a017;
  --color-danger: #c8392e;
  --color-info: var(--color-cobalt-500);

  /* === 数据置信度色 === */
  --color-data-verified: var(--color-jade-500);
  --color-data-pending: #d4a017;
  --color-data-missing: var(--color-ink-tertiary);
  --color-data-stale: #c8392e;

  /* === 数据新鲜度色 === */
  --color-freshness-fresh: var(--color-jade-500);   /* < 30 天 */
  --color-freshness-aging: #d4a017;                  /* 30-90 天 */
  --color-freshness-stale: #c8392e;                  /* > 90 天 */
}

/* ✅ 修复：暗色模式命名与 Tailwind darkMode: "class" 配合
   Tailwind 在 html.dark 时生成 .dark xxx 选择器
   不需要额外的 [data-theme] 选择器 */
.dark {
  --color-surface-base: #11161a;
  --color-surface-raised: #1a1f24;
  --color-ink-primary: #f6f3ed;
  --color-ink-secondary: #c4c8cc;
  --color-ink-tertiary: #6e7479;
}
```

---

### 1.2 字体 Tokens

```css
:root {
  --font-sans: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  --font-serif: 'Source Serif Pro', 'Noto Serif SC', serif;   /* editorial */
  --font-mono: 'JetBrains Mono', monospace;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.2;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.75;
}
```

---

### 1.3 间距 / 圆角 / 阴影 Tokens

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
}
```

---

### 1.4 Tailwind 配置（修复 `<alpha-value>` 兼容）

**关键**：Tailwind 3.3+ 支持 `<alpha-value>` 占位符，但**CSS vars 必须定义为 RGB 数字**（如 `31 78 150`），不是 hex。

```typescript
// frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',  // html.dark 触发暗色
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // ✅ 修复：使用 rgb(var(--xxx) / <alpha-value>) 支持 opacity
        surface: {
          base: 'rgb(var(--c-surface-base) / <alpha-value>)',
          raised: 'rgb(var(--c-surface-raised) / <alpha-value>)',
          sunken: 'rgb(var(--c-surface-sunken) / <alpha-value>)',
        },
        cobalt: {
          50: 'rgb(var(--c-cobalt-50) / <alpha-value>)',
          100: 'rgb(var(--c-cobalt-100) / <alpha-value>)',
          500: 'rgb(var(--c-cobalt-500) / <alpha-value>)',
          700: 'rgb(var(--c-cobalt-700) / <alpha-value>)',
          900: 'rgb(var(--c-cobalt-900) / <alpha-value>)',
        },
        persimmon: {
          50: 'rgb(var(--c-persimmon-50) / <alpha-value>)',
          100: 'rgb(var(--c-persimmon-100) / <alpha-value>)',
          500: 'rgb(var(--c-persimmon-500) / <alpha-value>)',
          700: 'rgb(var(--c-persimmon-700) / <alpha-value>)',
        },
        jade: {
          50: 'rgb(var(--c-jade-50) / <alpha-value>)',
          100: 'rgb(var(--c-jade-100) / <alpha-value>)',
          500: 'rgb(var(--c-jade-500) / <alpha-value>)',
          700: 'rgb(var(--c-jade-700) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--c-ink-primary) / <alpha-value>)',
          primary: 'rgb(var(--c-ink-primary) / <alpha-value>)',
          secondary: 'rgb(var(--c-ink-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--c-ink-tertiary) / <alpha-value>)',
          inverse: 'rgb(var(--c-ink-inverse) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--c-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--c-text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--c-text-tertiary) / <alpha-value>)',
        },
        success: 'rgb(var(--c-jade-500) / <alpha-value>)',
        warning: 'rgb(var(--color-warning-rgb) / <alpha-value>)',
        danger: 'rgb(var(--color-danger-rgb) / <alpha-value>)',
        data: {
          verified: 'rgb(var(--c-jade-500) / <alpha-value>)',
          pending: 'rgb(var(--color-warning-rgb) / <alpha-value>)',
          missing: 'rgb(var(--c-ink-tertiary) / <alpha-value>)',
          stale: 'rgb(var(--color-danger-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        serif: 'var(--font-serif)',
        mono: 'var(--font-mono)',
      },
    },
  },
};

export default config;

// ✅ globals.css 对应：CSS vars 必须用 RGB 数字
:root {
  --c-surface-base: 246 243 237;
  --c-surface-raised: 255 255 255;
  --c-cobalt-500: 31 78 150;
  --c-persimmon-500: 214 90 60;
  --c-jade-500: 45 134 89;
  --c-ink-primary: 26 26 26;
  --color-warning-rgb: 212 160 23;
  --color-danger-rgb: 200 57 46;
}

.dark {
  --c-surface-base: 17 22 26;
  --c-surface-raised: 26 31 36;
  --c-ink-primary: 246 243 237;
}
```

---

## 2. 组件库（基于 v1 已有资产）

### 2.1 v1 已有的组件（必须复用）

| v1 组件 | 路径 | v2 用途 |
|---|---|---|
| `ProvenanceBadge` | `frontend/src/components/university/ProvenanceBadge.tsx` | 数据出处徽章基础 |
| `UniversityProfilePanel` | `frontend/src/components/university/UniversityProfilePanel.tsx` | B1 学校深度页基础 |
| `FlipModuleCard` | `frontend/src/components/home/FlipModuleCard.tsx` | 家庭端首页卡片 |

### 2.2 v2 新增组件（基于 v1 扩展）

| 组件 | 文件 | 用途 |
|---|---|---|
| `DataProvenanceBadge` | `components/data/DataProvenanceBadge.tsx` | 基于 v1 ProvenanceBadge |
| `DataProvenanceCard` | `components/data/DataProvenanceCard.tsx` | 数据出处卡片 |
| `DataStalenessIndicator` | `components/data/DataStalenessIndicator.tsx` | 数据新鲜度 |
| `SchoolDetailView` | `components/school/SchoolDetailView.tsx` | B1 学校深度页包装（v2） |
| `SchoolHeader` | `components/school/SchoolHeader.tsx` | 学校头图 + verified |
| `RankingCard` | `components/school/RankingCard.tsx` | 排名跨源调和 |
| `FinancialTable` | `components/school/FinancialTable.tsx` | 财务表 |
| `RequirementTable` | `components/school/RequirementTable.tsx` | 录取要求表 |
| `TimeSeriesEntry` | `components/school/TimeSeriesEntry.tsx` | 时序入口 |
| `TimeSeriesChart` | `components/timeseries/TimeSeriesChart.tsx` | B3 折线图 |
| `MajorStrengthsGrid` | `components/school/MajorStrengthsGrid.tsx` | 强势专业 |
| `HistoryTimeline` | `components/school/HistoryTimeline.tsx` | 历史时间轴（结构化） |
| `NotableAlumniGrid` | `components/school/NotableAlumniGrid.tsx` | 校友（分类） |
| `FacilityGrid` | `components/school/FacilityGrid.tsx` | 设施（结构化） |
| `SchoolComparisonTable` | `components/school/SchoolComparisonTable.tsx` | B2 跨校对比 |
| `MajorTimeSeries` | `components/major/MajorTimeSeries.tsx` | 专业时序 |
| `GPACalculator` | `components/tools/GPACalculator.tsx` | GPA 计算器 |
| `ROICalculator` | `components/tools/ROICalculator.tsx` | ROI 计算器 |
| `EventStream` | `components/tools/EventStream.tsx` | S3 事件流 |

### 2.3 学校端 NavBar（v2 紧凑型）

```tsx
// components/layout/NavBarSchool.tsx
import { School, Map, BarChart3, Layers, Radar, Calculator } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/s/home', label: '首页', icon: School },
  { href: '/s/map', label: '地图', icon: Map },
  { href: '/s/compare', label: '对比', icon: BarChart3 },
  { href: '/s/timeseries', label: '时序', icon: BarChart3 },
  { href: '/s/majors', label: '专业', icon: Layers },
  { href: '/s/radar', label: '雷达', icon: Radar },
  { href: '/s/calculator', label: '工具', icon: Calculator },
];
```

### 2.4 家庭端 NavBar（v2 叙事型）

```tsx
// components/layout/NavBarFamily.tsx
const NAV_ITEMS = [
  { href: '/f/home', label: '首页' },
  { href: '/f/policy', label: '政策' },
  { href: '/f/calculator/roi', label: 'ROI 计算' },
];
```

---

## 3. 关键页面布局（参考 V2-EXEC-SPEC.md §模块 #6 / §模块 #7）

### 3.1 学校端学校详情页（`/s/[slug]`）

**ASCII 布局见 V2-EXEC-SPEC.md §模块 #6**

关键组件：
1. SchoolHeader（头图 + verified）
2. RankingCard（US News + QS + THE + 调和）
3. FinancialTable（学位 × 类型 × 金额）
4. RequirementTable（语言 / 标化）
5. TimeSeriesEntry（→ B3 时序入口）
6. MajorStrengthsGrid（→ B2 跨校对比入口）
7. HistoryTimeline（结构化历史时间轴）
8. NotableAlumniGrid（分类：总统/诺奖/普利策）
9. FacilityGrid（结构化设施）
10. DataProvenanceCard（数据出处）

### 3.2 学校端专业对比页（`/s/major/[id]`）

**ASCII 布局见 V2-EXEC-SPEC.md §模块 #7**

关键组件：
1. SchoolComparisonTable（跨校对比表）
2. MajorTimeSeries（专业时序）
3. SuitabilitySection（适合谁）
4. CaseList（录取案例）

### 3.3 家庭端学校故事页（`/f/school/[slug]`）

```
┌─────────────────────────────────────────────────────────┐
│ [NavBar: 家庭端 叙事型]                          [👤] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  哈佛 387 年的故事                                        │
│  一所学校的过去、现在与未来                                │
│                                                          │
│  [大图 + 校徽]                                            │
│                                                          │
│  哈佛建于 1636 年，是全美最古老的大学。                    │
│  在 387 年里，8 位美国总统从这里走出，                       │
│  75 位诺贝尔奖获得者在此工作......                         │
│                                                          │
│  [数据出处：IECG]                                         │
│                                                          │
│  ——                                                      │
│                                                          │
│  哈佛的今天                                               │
│  [对比 MIT / 斯坦福 / 耶鲁]                              │
│  [Harvard vs MIT 排名折线图]                             │
│                                                          │
│  ——                                                      │
│                                                          │
│  如果你想申请哈佛：                                       │
│  · 录取率约 4%                                            │
│  · SAT 中位 1520                                           │
│  · 文书题目：[Common App 5 个选题之一]                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 4. 交互模式

### 4.1 数据出处展示（基于 v1 ProvenanceBadge）

```tsx
import { ProvenanceBadge } from '@/components/university/ProvenanceBadge';

<ProvenanceBadge status="live_verified_exact" />
// 渲染：来源已实时验证
```

### 4.2 数据新鲜度指示

```tsx
<DataStalenessIndicator asOf="2024-08-15" />
// < 30 天 → 绿点
// 30-90 天 → 黄点
// > 90 天 → 红点
```

### 4.3 缺失值处理（missing-first）

```tsx
{value !== null && value !== undefined ? value : (
  <span className="text-ink-tertiary italic">暂无</span>
)}
```

### 4.4 对比分享卡

```tsx
<ComparisonShareCard
  schools={['princeton-university', 'mit', 'stanford-university']}
  metrics={['ranking', 'tuition', 'acceptanceRate']}
/>
// 生成 PNG 图片，含 Logo + 数据 + 二维码
```

---

## 5. 响应式断点

```css
sm: 640px    /* 平板 */
md: 768px    /* 中屏 */
lg: 1024px   /* 桌面 */
xl: 1280px   /* 大屏 */
2xl: 1536px  /* 超大屏 */
```

| 设备 | 学校端 | 家庭端 |
|---|---|---|
| 手机 (< 640px) | 简化版（核心工具） | 完整（家庭端优先） |
| 平板 (640-1024px) | 完整 | 完整 |
| 桌面 (1024-1280px) | 完整 + 高级 | 完整 |
| 大屏 (> 1280px) | 完整 + 多列 | 完整 + 大留白 |

---

## 6. 可访问性 (a11y)

- 所有交互元素必须有 `aria-label`
- 颜色对比度 WCAG AA 标准
- 键盘导航支持
- 屏幕阅读器友好的数据表
- missing-first 文案对屏读友好

### 6.1 a11y 测试工具

```bash
# Lighthouse a11y 评分 ≥ 95
npx lighthouse http://localhost:3017 --only-categories=accessibility

# axe-core 自动化测试
npm run test -- --grep "a11y"
```

---

## 7. 动效

```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 400ms ease;

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

---

## 8. PWA 配置（D11 决策）

```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // ... 其他 Next.js 配置
});

// public/manifest.json
{
  "name": "PathOS",
  "short_name": "PathOS",
  "description": "信息集合与展示平台",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f6f3ed",
  "theme_color": "#1f4e96",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

**学习资源**（v1）：
- `frontend/tailwind.config.ts`（v1 实际配置）
- `frontend/src/app/globals.css`（v1 17 个 CSS vars）
- `frontend/src/components/home/FlipModuleCard.tsx`
- `frontend/review-shots/`（视觉参考）
- `frontend/src/components/university/ProvenanceBadge.tsx`（关键 v1 资产）
