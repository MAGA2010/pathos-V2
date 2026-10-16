import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
  CalendarClock,
  Calculator,
  ClipboardCheck,
  Database,
  FileSearch,
  FileStack,
  GitCompareArrows,
  Globe2,
  LayoutDashboard,
  Map,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import HomeScrollFx from "@/components/home/HomeScrollFx";
import { DataCoverageDashboard } from "@/components/home/DataCoverageDashboard";
import { LatestUpdatesSection } from "@/components/home/LatestUpdatesSection";
import { FeaturedSchoolsSection } from "@/components/home/FeaturedSchoolsSection";
import "./home-fx.css";

export const metadata: Metadata = {
  title: "PathOS — 留学选校信息与决策平台",
  description:
    "把院校、专业、费用、申请截止和信息源放在同一个可追溯工作台里，帮助中国家庭逐步完成选校决策。",
};

const PREVIEW_STATS = [
  { label: "院校摘要", value: "94", hint: "地图与检索使用的数据集" },
  { label: "详细档案", value: "62", hint: "包含学校详情事实链" },
  { label: "验证记录", value: "904", hint: "可回溯到来源" },
  { label: "州级辖区", value: "51", hint: "4 项区域指标覆盖" },
] as const;

const PRIMARY_TASKS = [
  {
    title: "浏览院校地图",
    description: "按地理位置、排名层和区域指标先建立候选池。",
    href: "/entry/map",
    meta: "94 所院校摘要",
    icon: Map,
  },
  {
    title: "检查申请截止",
    description: "集中查看各校轮次和截止日期，缺失信息不会被补造。",
    href: "/deadlines",
    meta: "按轮次跟踪",
    icon: CalendarClock,
  },
  {
    title: "计算年度费用",
    description: "区分学费、生活费和总预算，清楚标出未采集字段。",
    href: "/calculator",
    meta: "美元年度口径",
    icon: Calculator,
  },
  {
    title: "对比候选学校",
    description: "把关键事实放进同一张矩阵，直接导出讨论版。",
    href: "/compare",
    meta: "同口径对比",
    icon: GitCompareArrows,
  },
  {
    title: "调整自主匹配",
    description: "用预算、排名和偏好生成可解释的候选参考。",
    href: "/entry/match",
    meta: "预算 + 排名",
    icon: SlidersHorizontal,
  },
  {
    title: "进入数据工作台",
    description: "管理选校清单、报告和后续需要核实的问题。",
    href: "/s/home",
    meta: "本地预览可用",
    icon: LayoutDashboard,
  },
  {
    title: "AI 学校评估",
    description: "把学生画像和目标学校转成需要家庭核实的问题清单。",
    href: "/entry/assessment",
    meta: "辅助判断，不代做决定",
    icon: ClipboardCheck,
  },
  {
    title: "AI 清单分析",
    description: "检查冲刺、匹配和保底结构是否失衡或重复。",
    href: "/entry/portfolio",
    meta: "组合结构检查",
    icon: FileStack,
  },
] as const;

const DATA_STANDARDS = [
  {
    title: "Common Data Set",
    description: "录取率、标化区间和费用的标准化起点。",
    icon: Database,
  },
  {
    title: "学校官网",
    description: "项目、政策和截止日期逐条回链原文。",
    icon: FileSearch,
  },
  {
    title: "IPEDS / 州级数据",
    description: "就业、安全和区域生活成本的外部参照。",
    icon: Globe2,
  },
  {
    title: "审核边界",
    description: "未采集、官方未报告和暂不可用始终分开。",
    icon: ShieldCheck,
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-base text-text-primary" data-home-root="true">
      <div aria-hidden="true" data-scroll-progress />
      <HomeScrollFx />

      <section
        aria-labelledby="home-title"
        data-section="operations-desk"
        className="border-b border-border-soft bg-surface-1"
      >
        <div className="mx-auto grid w-full max-w-page gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:py-14">
          <div className="flex flex-col justify-center" data-reveal="true">
            <p className="text-label text-cobalt">PATHOS / INFORMATION DESK</p>
            <h1 id="home-title" className="mt-3 text-display sm:text-[2.375rem] sm:leading-[1.15]">
              PathOS
            </h1>
            <p className="mt-4 max-w-xl text-body text-text-secondary">
              把学校、费用、截止日期和信息源放到同一张工作台上。先看清数据边界，再逐步完成选校决策。
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/entry/map"
                className="inline-flex h-control-lg items-center gap-2 rounded-control bg-cobalt px-5 text-body font-semibold text-white transition hover:bg-cobalt/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <Map aria-hidden="true" size={17} /> 从院校地图开始
              </Link>
              <Link
                href="/entry/match"
                className="inline-flex h-control-lg items-center gap-2 rounded-control border border-border-strong bg-surface-1 px-5 text-body font-semibold text-text-primary transition hover:border-cobalt/50 hover:text-cobalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <SlidersHorizontal aria-hidden="true" size={17} /> 开始匹配
              </Link>
              <Link
                href="/search"
                className="inline-flex h-control-lg items-center gap-2 rounded-control border border-border-strong bg-surface-1 px-5 text-body font-semibold text-text-primary transition hover:border-cobalt/50 hover:text-cobalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <Search aria-hidden="true" size={17} /> 全局检索
              </Link>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border-soft bg-border-soft sm:grid-cols-4">
              {PREVIEW_STATS.map((item) => (
                <div key={item.label} className="bg-surface-1 px-3 py-3 sm:px-4 sm:py-4">
                  <dt className="text-caption text-text-muted">{item.label}</dt>
                  <dd className="mt-2 text-section font-semibold text-text-primary">{item.value}</dd>
                  <dd className="mt-1 hidden text-caption text-text-muted sm:block">{item.hint}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside
            aria-labelledby="data-status-title"
            className="rounded-card border border-border-soft bg-surface-2 p-4 sm:p-6"
            data-reveal="true"
            data-reveal-delay="120"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="data-status-title" className="text-section">
                  当前数据状态
                </h2>
                <p className="mt-2 text-caption text-text-secondary">
                  Preview 数据只展示已收录与已验证内容，不使用估算值填充空字段。
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-control border border-jade/30 bg-jade/10 px-2.5 py-1 text-caption font-semibold text-jade">
                <ShieldCheck aria-hidden="true" size={14} /> 可追溯
              </span>
            </div>

            <ul className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
              {[
                "院校事实需要通过审核队列后进入公开页面",
                "费用和截止日期保留来源、时间和缺失原因",
                "数据库暂不可用时页面明确降级，不静默编造",
                "匹配、评估和清单分析结果均不构成录取保证",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-body text-text-secondary">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { label: "专业库", href: "/majors" },
                { label: "留学资讯", href: "/news" },
                { label: "大学指南", href: "/guides" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-control-lg items-center rounded-control border border-border-soft bg-surface-1 px-3 text-caption font-semibold text-text-secondary transition hover:border-cobalt/40 hover:text-cobalt"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="task-title" data-section="priority-tasks" className="border-b border-border-soft">
        <div className="mx-auto w-full max-w-page px-4 py-10 sm:px-6 lg:py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" data-reveal="true">
            <div>
              <p className="text-label text-cobalt">NEXT ACTIONS</p>
              <h2 id="task-title" className="mt-2 text-page">
                把选校拆成可以执行的三步。
              </h2>
            </div>
            <p className="max-w-sm text-body text-text-secondary">
              先收集信息，再比较候选，最后管理工作台里的清单和报告。
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PRIMARY_TASKS.map((task, index) => {
              const Icon = task.icon;
              return (
                <Link
                  key={task.href}
                  href={task.href}
                  data-reveal="true"
                  data-reveal-delay={String(Math.min(index * 70, 280))}
                  className="group flex min-h-[148px] flex-col rounded-card border border-border-soft bg-surface-1 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-cobalt/45 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  <span className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-control bg-cobalt/10 text-cobalt">
                      <Icon aria-hidden="true" size={19} />
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      size={18}
                      className="text-text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cobalt"
                    />
                  </span>
                  <span className="mt-4 text-section text-text-primary">{task.title}</span>
                  <span className="mt-2 flex-1 text-body text-text-secondary">{task.description}</span>
                  <span className="mt-4 text-caption font-semibold text-cobalt">{task.meta}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <DataCoverageDashboard />
      <LatestUpdatesSection />
      <FeaturedSchoolsSection />

      <section aria-labelledby="standards-title" data-section="data-standards" className="border-t border-border-soft bg-surface-1">
        <div className="mx-auto w-full max-w-page px-4 py-10 sm:px-6 lg:py-14">
          <div data-reveal="true">
            <p className="text-label text-cobalt">DATA STANDARDS</p>
            <h2 id="standards-title" className="mt-2 text-page">
              信息平台的数据底线
            </h2>
          </div>
          <dl className="mt-7 grid gap-px overflow-hidden rounded-card border border-border-soft bg-border-soft sm:grid-cols-2 lg:grid-cols-4">
            {DATA_STANDARDS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-surface-1 p-5"
                  data-reveal="true"
                  data-reveal-delay={String(index * 70)}
                >
                  <dt className="flex items-center gap-2 text-section text-text-primary">
                    <Icon aria-hidden="true" size={17} className="text-cobalt" />
                    {item.title}
                  </dt>
                  <dd className="mt-2 text-body text-text-secondary">{item.description}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <button
        type="button"
        data-back-to-top
        aria-label="返回顶部"
        className="grid place-items-center"
      >
        <ArrowUp aria-hidden="true" size={17} />
      </button>
    </main>
  );
}
