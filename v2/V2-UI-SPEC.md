# PathOS v2 UI SPEC（UI 设计系统）

> **核心目的**：让任何前端 AI 拿到这份文档都能复现 v2 启动版的 UI。

---

## 0. 设计哲学

- **v1 沉淀保留**：editorial 风格（bracket frames / wave fields / earth from orbit）作为品牌资产
- **工具型清晰度**：所有工具页面（智能选校 / 时序 / 对比）用 SaaS 清晰度（高对比 / 紧凑 / 操作可见）
- **missing-first**：每个字段缺失时诚实显示"暂无"而非省略或 0
- **数据置信度可视化**：每个数据点的 verified + asOf 都可见
- **家庭端 vs 学校端**：双层 UI（学校端 = 工具型 / 家庭端 = 叙事型）

---

## 1. 设计 Tokens

### 1.1 颜色 Tokens（基于 v1 17 个 CSS vars 扩展）

```css
/* frontend/src/app/globals.css */
:root {
  /* 基础色 - Surface */
  --color-surface-base: #f6f3ed;       /* 暖白 */
  --color-surface-raised: #ffffff;     /* 卡片 */
  --color-surface-sunken: #efebe3;     /* 嵌入 */
  --color-surface-overlay: rgba(0,0,0,0.5);  /* 模态 */

  /* 主色 - Cobalt (保留 v1) */
  --color-cobalt-50: #e8eef5;
  --color-cobalt-100: #c5d3e6;
  --color-cobalt-500: #1f4e96;        /* 主色 */
  --color-cobalt-700: #143870;
  --color-cobalt-900: #0a2147;

  /* 强调色 - Persimmon (保留 v1) */
  --color-persimmon-50: #fce8e1;
  --color-persimmon-100: #f7c5b3;
  --color-persimmon-500: #d65a3c;       /* 警告/强调 */
  --color-persimmon-700: #a83f24;

  /* 文本色 - Text */
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #4a4a4a;
  --color-text-tertiary: #8a8a8a;
  --color-text-inverse: #ffffff;

  /* 语义色 - Semantic */
  --color-success: #2d8659;             /* 绿 */
  --color-warning: #d4a017;             /* 黄 */
  --color-danger: #c8392e;              /* 红 */
  --color-info: #1f4e96;               /* 蓝 */

  /* 数据置信度色 */
  --color-data-verified: #2d8659;      /* 已验证 */
  --color-data-pending: #d4a017;       /* 待验证 */
  --color-data-missing: #8a8a8a;        /* 缺失 */
  --color-data-stale: #c8392e;         /* 陈旧 */

  /* 数据新鲜度色 */
  --color-freshness-fresh: #2d8659;     /* < 30 天 */
  --color-freshness-aging: #d4a017;     /* 30-90 天 */
  --color-freshness-stale: #c8392e;     /* > 90 天 */
}

[data-theme="dark"] {
  --color-surface-base: #11161a;
  --color-surface-raised: #1a1f24;
  --color-text-primary: #f6f3ed;
  /* ... dark 模式覆盖 */
}
```

### 1.2 字体 Tokens

```css
:root {
  /* 字体族 */
  --font-sans: "Inter", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  --font-serif: "Source Serif Pro", "Noto Serif SC", serif;   /* editorial */
  --font-mono: "JetBrains Mono", monospace;

  /* 字号 */
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.5rem;   /* 24px */
  --font-size-3xl: 1.875rem; /* 30px */
  --font-size-4xl: 2.25rem;  /* 36px */

  /* 字重 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* 行高 */
  --line-height-tight: 1.2;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.75;
}
```

### 1.3 间距 / 圆角 / 阴影 Tokens

```css
:root {
  /* 间距 */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
}
```

### 1.4 Tailwind 配置（`frontend/tailwind.config.ts`）

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          base: "var(--color-surface-base)",
          raised: "var(--color-surface-raised)",
          sunken: "var(--color-surface-sunken)",
        },
        cobalt: {
          50: "var(--color-cobalt-50)",
          100: "var(--color-cobalt-100)",
          500: "var(--color-cobalt-500)",
          700: "var(--color-cobalt-700)",
          900: "var(--color-cobalt-900)",
        },
        persimmon: {
          50: "var(--color-persimmon-50)",
          100: "var(--color-persimmon-100)",
          500: "var(--color-persimmon-500)",
          700: "var(--color-persimmon-700)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        data: {
          verified: "var(--color-data-verified)",
          pending: "var(--color-data-pending)",
          missing: "var(--color-data-missing)",
          stale: "var(--color-data-stale)",
        },
      },
      fontFamily: {
        sans: "var(--font-sans)",
        serif: "var(--font-serif)",
        mono: "var(--font-mono)",
      },
    },
  },
};

export default config;
```

---

## 2. 组件库

### 2.1 通用组件

| 组件 | 文件 | 用途 |
|---|---|---|
| `Button` | `components/ui/Button.tsx` | 通用按钮（primary/secondary/ghost） |
| `Card` | `components/ui/Card.tsx` | 卡片容器 |
| `Badge` | `components/ui/Badge.tsx` | 徽章（verified/data status） |
| `Tooltip` | `components/ui/Tooltip.tsx` | 提示 |
| `Table` | `components/ui/Table.tsx` | 表格 |
| `Modal` | `components/ui/Modal.tsx` | 模态对话框 |
| `Tabs` | `components/ui/Tabs.tsx` | 标签页 |
| `Select` | `components/ui/Select.tsx` | 选择器 |
| `Input` | `components/ui/Input.tsx` | 输入框 |
| `Avatar` | `components/ui/Avatar.tsx` | 头像（顾问 / 学校校徽） |
| `Progress` | `components/ui/Progress.tsx` | 进度条 |

### 2.2 数据可视化组件（核心）

| 组件 | 文件 | 用途 |
|---|---|---|
| `DataProvenanceBadge` | `components/data/DataProvenanceBadge.tsx` | 数据出处徽章 |
| `DataProvenanceCard` | `components/data/DataProvenanceCard.tsx` | 数据出处卡片 |
| `DataStalenessIndicator` | `components/data/DataStalenessIndicator.tsx` | 数据新鲜度（颜色编码） |
| `ConfidenceScore` | `components/data/ConfidenceScore.tsx` | 数据置信度评分 |
| `SourceReconciliation` | `components/data/SourceReconciliation.tsx` | 跨源数据调和 |
| `ComparisonShareCard` | `components/data/ComparisonShareCard.tsx` | 对比分享卡 |

### 2.3 学校端专用组件

| 组件 | 文件 | 用途 |
|---|---|---|
| `RankingCard` | `components/school/RankingCard.tsx` | 排名卡（US News/QS/THE） |
| `FinancialTable` | `components/school/FinancialTable.tsx` | 财务表（学位 × 类型 × 金额） |
| `RequirementTable` | `components/school/RequirementTable.tsx` | 录取要求表 |
| `TimeSeriesChart` | `components/timeseries/TimeSeriesChart.tsx` | 时序图 |
| `MajorStrengthsGrid` | `components/school/MajorStrengthsGrid.tsx` | 强势专业网格 |
| `HistoryTimeline` | `components/school/HistoryTimeline.tsx` | 历史时间轴 |
| `NotableAlumniGrid` | `components/school/NotableAlumniGrid.tsx` | 知名校友 |
| `SchoolComparisonTable` | `components/school/SchoolComparisonTable.tsx` | 学校对比表 |

### 2.4 家庭端专用组件

| 组件 | 文件 | 用途 |
|---|---|---|
| `SchoolStoryCard` | `components/family/SchoolStoryCard.tsx` | 学校故事卡 |
| `MajorExplainer` | `components/family/MajorExplainer.tsx` | 专业解读卡 |
| `PolicyExplainer` | `components/family/PolicyExplainer.tsx` | 政策解读 |
| `ROICalculator` | `components/family/ROICalculator.tsx` | 投资回报计算 |
| `ApplicationTimeline` | `components/family/ApplicationTimeline.tsx` | 申请流程时间线 |

### 2.5 工具组件

| 组件 | 文件 | 用途 |
|---|---|---|
| `GPACalculator` | `components/tools/GPACalculator.tsx` | GPA 计算器 |
| `ROICalculatorForm` | `components/tools/ROICalculatorForm.tsx` | ROI 计算表单 |
| `SmartMatchTool` | `components/tools/SmartMatchTool.tsx` | 智能匹配（v1 升级） |
| `EventStream` | `components/tools/EventStream.tsx` | S3 新专业事件流 |

---

## 3. 关键页面布局

### 3.1 学校端首页（`/s/home`）

```
┌─────────────────────────────────────────────────────────┐
│ [NavBar: 学校端 紧凑型]                          [👤 用户]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  PathOS · 学校端                                          │
│  "为留学顾问 / 老师设计的信息集合与展示"               │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 📊 时序   │ │ ⚖️ 对比   │ │ 🎓 专业   │ │ 🆕 雷达   │   │
│  │ 看趋势   │ │ 跨校对比 │ │ 专业对比 │ │ 新专业   │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🗺️ 留学地图                                          │  │
│  │ v1 MapLibre 升级版（带数据层）                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 📚 Top 5 学校                                          │  │
│  │ Princeton | Harvard | MIT | Stanford | Yale         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 📊 最近时序解读                                        │  │
│  │ · 藤校录取率近 5 年变化                              │  │
│  │ · SAT 标化政策影响分析                                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 3.2 学校端学校详情页（`/s/[slug]`）

见 V2-EXEC-SPEC.md 模块 #6 的 ASCII 布局。

### 3.3 学校端专业对比页（`/s/major/[id]`）

```
┌─────────────────────────────────────────────────────────┐
│ [NavBar: 学校端]                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Computer Science 计算机科学                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 工程 / 计算机科学 / 跨校对比                       │  │
│  │ ┌────────────────────────────────────────────┐    │  │
│  │ │ 跨校对比（8 所学校）                        │    │  │
│  │ │ 学校    排名   录取率  招生  学费   起薪    │    │  │
│  │ │ MIT    #1     4%     1100  $82k  $156k    │    │  │
│  │ │ ...                                          │    │  │
│  │ └────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 📊 近 5 年录取率趋势                                 │  │
│  │ [Recharts LineChart, 8 条线]                       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 📊 近 5 年学费趋势                                   │  │
│  │ [Recharts LineChart]                                │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🎯 适合谁                                              │  │
│  │ · 兴趣：算法、逻辑、问题解决                        │  │
│  │ · 优势：数学、物理                                   │  │
│  │ · 职业：软件工程 / 数据科学 / AI                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🎓 录取案例                                           │  │
│  │ · 张同学 · 普高 GPA 3.95 · SAT 1580 · MIT CS    │  │
│  │ · 李同学 · 美高 GPA 3.85 · SAT 1520 · Stanford CS│  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 3.4 家庭端首页（`/f/home`）

```
┌─────────────────────────────────────────────────────────┐
│ [NavBar: 家庭端 叙事型]                          [👤 用户]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  PathOS · 家庭端                                          │
│  "帮助家长 / 学生读懂大学、选对方向"                    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🏫 学校故事 (叙事型首屏)                             │  │
│  │  · 哈佛 387 年的故事                                │  │
│  │  · MIT 如何成为 MIT                                  │  │
│  │  · 斯坦福与硅谷的共生                                │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🎓 专业解读                                            │  │
│  │  · CS 真的还值得读吗？                                │  │
│  │  · 哈佛新开了人类学专业，适合谁？                    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 📋 政策变化                                            │  │
│  │  · SAT 标化可选，对我家孩子有什么影响？              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 💰 留学值不值？                                        │  │
│  │  [ROI 计算 ROICalculator]                            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 4. 交互模式

### 4.1 数据出处展示

每个数据点都有 verified 标签：
```tsx
<span className="inline-flex items-center gap-1">
  <DataProvenanceBadge
    source={meta.source}      // IECG / IPEDS / US News / College Scorecard / 学校官网
    asOf={meta.asOf}           // "2024-08-15"
    confidence={meta.confidence}  // 0-100
  />
</span>
```

颜色编码：
- verified + < 30 天 → 绿色实心徽章
- verified + 30-90 天 → 黄色实心徽章
- verified + > 90 天 → 红色实心徽章
- pending → 灰色虚线徽章
- missing → 灰色"暂无"

### 4.2 缺失值处理（missing-first）

```tsx
{value !== null && value !== undefined ? value : (
  <span className="text-text-tertiary italic">暂无</span>
)}
```

### 4.3 新鲜度指示

```tsx
<DataStalenessIndicator asOf={asOf} />
```

颜色编码：
- < 30 天 → 绿点 `bg-green-500`
- 30-90 天 → 黄点 `bg-yellow-500`
- > 90 天 → 红点 `bg-red-500`

### 4.4 对比分享卡

```tsx
<ComparisonShareCard
  schools={['princeton', 'mit', 'stanford']}
  metrics={['ranking', 'tuition', 'acceptanceRate']}
/>
```

输出：1 张 PNG 图片，含 Logo + 数据 + 二维码（点击跳回 v2）。

---

## 5. 响应式断点

```css
/* Tailwind 默认 */
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

---

## 7. 动效

```css
/* 简约动效 - 不干扰内容阅读 */
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 400ms ease;

/* reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

---

**学习资源**：
- v1 `frontend/tailwind.config.ts`
- v1 `frontend/src/app/globals.css`
- v1 `frontend/src/components/home/FlipModuleCard.tsx`
- v1 `frontend/review-shots/` 视觉参考
