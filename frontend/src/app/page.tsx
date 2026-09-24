import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BellRing,
  BookmarkCheck,
  BookOpen,
  Calculator,
  ClipboardCheck,
  Database,
  FileSearch,
  Globe2,
  Layers3,
  Map,
  SlidersHorizontal,
} from "lucide-react";
import { FlipModuleCard } from "@/components/home/FlipModuleCard";
import { ChapterNav } from "@/components/home/ChapterNav";
import HomeScrollFx from "@/components/home/HomeScrollFx";
import HeroTilt from "@/components/home/HeroTilt";
import { SourceReconciliationSection } from "@/components/home/SourceReconciliationSection";
import { SchoolSpotlightSection } from "@/components/home/SchoolSpotlightSection";
import { DataInsightsSection } from "@/components/home/DataInsightsSection";
import { FeaturedSchoolsSection } from "@/components/home/FeaturedSchoolsSection";
import { DataCoverageDashboard } from "@/components/home/DataCoverageDashboard";
import { LatestUpdatesSection } from "@/components/home/LatestUpdatesSection";
import { TopicTilesSection } from "@/components/home/TopicTilesSection";
import { ValuePropositionSection } from "@/components/home/ValuePropositionSection";
import { FAQSection } from "@/components/home/FAQSection";
import styles from "./home.module.css";
import "./home-fx.css";

export const metadata: Metadata = {
  title: "PathOS — 面向中国家庭的留学选校数据平台",
  description:
    "以可追溯的院校与州级数据，连接留学地图、测评、预算和申请规划。",
};

const CORE_MODULES = [
  {
    index: "01",
    title: "留学地图",
    eyebrow: "EXPLORE",
    description: "在真实 Preview 数据上查看院校与四项州级区域指标。",
    reveal: "打开地图章节，在真实 Preview 数据上探索院校与四项州级区域指标。",
    href: "/entry/map",
    icon: Map,
  },
  {
    index: "02",
    title: "费用计算",
    eyebrow: "BUDGET",
    description: "比较院校费用信息，未报告字段保持缺失语义。",
    reveal: "核对院校费用信息与预算区间，未报告内容始终保持缺失语义。",
    href: "/calculator",
    icon: Calculator,
  },
  {
    index: "03",
    title: "自主匹配",
    eyebrow: "MATCH",
    description: "用可调整的个人偏好，建立清晰、可解释的选校参考。",
    reveal: "调整你的偏好与权重，建立清晰、可解释的自主匹配参考。",
    href: "/entry/match",
    icon: SlidersHorizontal,
  },
  {
    index: "04",
    title: "学校评估",
    eyebrow: "ASSESS",
    description: "整理学生画像与目标院校之间需要进一步核实的问题。",
    reveal: "输入学生画像与目标院校，让 AI 梳理风险和需要继续核实的问题。",
    href: "/entry/assessment",
    icon: ClipboardCheck,
  },
  {
    index: "05",
    title: "申请清单",
    eyebrow: "PORTFOLIO",
    description: "从冲刺、匹配与保底结构审视候选院校组合。",
    reveal: "让 AI 从冲刺、匹配与保底结构审视你的候选院校组合。",
    href: "/entry/portfolio",
    icon: BookmarkCheck,
  },
  {
    index: "06",
    title: "机会动态",
    eyebrow: "RADAR",
    description: "追踪新项目、申请变化、奖学金和重要截止日期。",
    reveal: "打开机会雷达，看懂学校变化与你的申请有什么关系。",
    href: "/opportunities",
    icon: BellRing,
  },
  {
    index: "07",
    title: "读懂大学",
    eyebrow: "UNDERSTAND",
    description: "先理解学校的学习方式、成本与申请现实，再决定是否申请。",
    reveal: "打开大学指南，用家庭可以讨论的语言理解一所学校。",
    href: "/guides",
    icon: BookOpen,
  },
] as const;

const VERIFIED_BOUNDARY = [
  ["62", "所院校"],
  ["904", "条已验证记录"],
  ["51", "个州级辖区"],
  ["4", "项州级区域指标"],
] as const;

const DATA_SOURCES = [
  {
    eyebrow: "PRIMARY",
    title: "Common Data Set",
    description: "院校每年发布的标准化数据集，是录取率、SAT 区间与费用的官方起点。",
    icon: Database,
  },
  {
    eyebrow: "OFFICIAL",
    title: "学校官网 & 公告",
    description: "项目、学费、政策变化以官网为准；我们逐条对齐发布日期与原文。",
    icon: FileSearch,
  },
  {
    eyebrow: "REGIONAL",
    title: "IPEDS / 州级数据",
    description: "美国教育统计中心 IPEDS 提供州级就业、安全、生活成本等区域指标。",
    icon: Globe2,
  },
  {
    eyebrow: "RANKINGS",
    title: "US News / QS / THE",
    description: "三大排名仅作为调和位次的输入，原始数据优先，调和方法透明可查。",
    icon: Layers3,
  },
] as const;

const HOWTO_STEPS = [
  {
    title: "从地图开始浏览",
    description: "在真实 Preview 数据上查看 62 所院校与州级区域指标，建立第一印象。",
    href: "/entry/map",
    cta: "打开留学地图",
  },
  {
    title: "用自主匹配收敛候选",
    description: "把家庭关心的权重（学费、录取率、区域）调成可解释的数字，得到 3-6 所候选。",
    href: "/entry/match",
    cta: "开始自主匹配",
  },
  {
    title: "用评估形成问题清单",
    description: "对每所候选，让 AI 整理出还需要家庭讨论的问题，由人来做最终判断。",
    href: "/entry/assessment",
    cta: "查看 AI 评估",
  },
];

function WaveField() {
  const paths = Array.from({ length: 15 }, (_, index) => {
    const y = 58 + index * 14;
    const amplitude = 20 + index * 1.8;
    return `M -30 ${y} C 130 ${y - amplitude}, 245 ${y + amplitude}, 410 ${y} S 685 ${
      y - amplitude * 0.72
    }, 850 ${y} S 1120 ${y + amplitude}, 1470 ${y}`;
  });

  return (
    <svg
      className={styles.waveField}
      viewBox="0 0 1440 310"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {paths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className={styles.root} data-integration-source="hybrid-visual-extraction" data-home-root="true">
      <div className={styles.scrollProgress} aria-hidden="true" data-scroll-progress>
        <span className={styles.scrollProgressBar} />
      </div>

      <ChapterNav />
      <HomeScrollFx />
      <HeroTilt />

      {/* 01/14 — Hero */}
      <section
        className={styles.hero}
        aria-labelledby="home-title"
        data-section="hero"
        data-chapter-target="hero"
      >
        <div className={styles.heroEarth} aria-hidden="true" />
        <div className={styles.heroGrid} aria-hidden="true" />
        <WaveField />

        <div className={styles.heroFrame}>
          <div className={styles.heroRail}>
            <span>STUDY ABROAD DECISION SYSTEM</span>
            <span>PREVIEW / 2026</span>
          </div>

          <div className={styles.heroBody} data-hero-tilt="true">
            <div className={styles.bracketLeft} aria-hidden="true" />
            <p className={styles.kicker}>PATHOS / 路径与选择</p>
            <h1 id="home-title" className={styles.wordmark}>
              PathOS
            </h1>
            <p className={styles.heroStatement}>
              为中国留学家庭建立一条
              <br />
              <span>更清晰、更可信的决策路径。</span>
            </p>
            <div className={styles.heroActions}>
              <Link href="/entry/map" className={styles.primaryAction}>
                探索留学地图 <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
              <Link href="/entry/match" className={styles.secondaryAction}>
                开始自主匹配
              </Link>
            </div>
            <div className={styles.bracketRight} aria-hidden="true" />
          </div>

          <p className={styles.heroNote}>
            数据不是答案，而是让每一次家庭讨论更接近事实。
          </p>
        </div>

        <div className={styles.scrollHint} aria-hidden="true" data-reveal="true" data-reveal-delay="400">
          <span className={styles.scrollHintLine} />
          <span className={styles.scrollHintText}>SCROLL</span>
        </div>
      </section>

      {/* 02/14 — Verified Boundary */}
      <section
        className={styles.boundary}
        aria-labelledby="boundary-title"
        data-section="boundary"
        data-chapter-target="boundary"
      >
        <div className={styles.sectionHeading} data-reveal="true">
          <p>VERIFIED PREVIEW</p>
          <h2 id="boundary-title" data-reveal="true" data-heading-stagger="true">
            从可信边界开始，而不是从承诺开始。
          </h2>
          <p className={styles.sectionLead}>
            PathOS 将已验证事实、待补充信息与暂未开放能力明确区分。
          </p>
        </div>

        <dl className={styles.statGrid}>
          {VERIFIED_BOUNDARY.map(([value, label], idx) => (
            <div
              key={label}
              className={styles.statItem}
              data-reveal="true"
              data-reveal-delay={String(80 + idx * 80)}
            >
              <dt>{label}</dt>
              <dd data-counter={value}>{value}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.previewNotice}>
          Preview · 数据来源可追溯 · 结果不构成录取保证
        </p>
      </section>

      {/* 03/14 — Modules */}
      <section
        className={styles.modules}
        aria-labelledby="modules-title"
        data-section="modules"
        data-chapter-target="modules"
      >
        <div className={styles.sectionHeading} data-reveal="true">
          <p>ONE SYSTEM / DISTINCT CHAPTERS</p>
          <h2 id="modules-title" data-reveal="true" data-heading-stagger="true">
            把复杂选择拆成可以行动的七个章节。
          </h2>
        </div>

        <div className={styles.moduleGrid}>
          {CORE_MODULES.map((module, idx) => {
            const Icon = module.icon;
            return (
              <div
                key={module.href}
                data-reveal="true"
                data-reveal-delay={String(idx * 70)}
              >
                <FlipModuleCard
                  index={module.index}
                  eyebrow={module.eyebrow}
                  title={module.title}
                  description={module.description}
                  reveal={module.reveal}
                  href={module.href}
                  icon={<Icon aria-hidden="true" size={24} />}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* 04/14 — Sources */}
      <section
        className={styles.sources}
        aria-labelledby="sources-title"
        data-section="sources"
        data-chapter-target="sources"
      >
        <span className={styles.chapterMarker} aria-hidden="true">04 / 14</span>
        <div className={styles.sectionHeading} data-reveal="true">
          <p>DATA SOURCES</p>
          <h2 id="sources-title" data-reveal="true" data-heading-stagger="true">
            四个数据来源，每一项都可点回原文。
          </h2>
          <p className={styles.sectionLead}>
            录取率、SAT 区间、费用、区域指标——每一项都来自下方四个来源之一。
          </p>
        </div>

        <ul className={styles.sourcesGrid}>
          {DATA_SOURCES.map((srcItem, idx) => {
            const Icon = srcItem.icon;
            return (
              <li
                key={srcItem.title}
                className={styles.sourceCard}
                data-reveal="true"
                data-reveal-delay={String(idx * 90)}
              >
                <span className={styles.sourceEyebrow}>{srcItem.eyebrow}</span>
                <span className={styles.sourceIcon}>
                  <Icon aria-hidden="true" size={26} />
                </span>
                <h3 className={styles.sourceTitle}>{srcItem.title}</h3>
                <p className={styles.sourceDescription}>{srcItem.description}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 05/14 — Source Reconciliation */}
      <SourceReconciliationSection />

      {/* 06/14 — School Spotlight */}
      <SchoolSpotlightSection />

      {/* 07/14 — Data Insights */}
      <DataInsightsSection />

      {/* 08/14 — Featured Schools */}
      <FeaturedSchoolsSection />

      {/* 09/14 — Coverage Dashboard */}
      <DataCoverageDashboard />

      {/* 10/14 — Latest Updates */}
      <LatestUpdatesSection />

      {/* 11/14 — Topic Tiles */}
      <TopicTilesSection />

      {/* 12/14 — Value Proposition */}
      <ValuePropositionSection />

      {/* 13/14 — How to start */}
      <section
        className={styles.howto}
        aria-labelledby="howto-title"
        data-section="howto"
        data-chapter-target="howto"
      >
        <div className={styles.sectionHeading} data-reveal="true">
          <p className={styles.chapterMarker}>13 / 14</p>
          <h2 id="howto-title" data-reveal="true" data-heading-stagger="true">
            从这里开始：3 步进入 PathOS。
          </h2>
          <p className={styles.sectionLead}>
            不需要先做选择题。先用地图看，再用匹配收敛，最后让评估整理出家庭需要讨论的问题。
          </p>
        </div>

        <ol className={styles.howtoList}>
          {HOWTO_STEPS.map((step, idx) => (
            <li
              key={step.title}
              className={styles.howtoItem}
              data-reveal="true"
              data-reveal-delay={String(idx * 110)}
            >
              <span className={styles.howtoIndex} aria-hidden="true">
                0{idx + 1}
              </span>
              <h3 className={styles.howtoStepTitle}>{step.title}</h3>
              <p className={styles.howtoDescription}>{step.description}</p>
              <Link href={step.href} className={styles.howtoCta}>
                {step.cta} <ArrowUpRight aria-hidden="true" size={14} />
              </Link>
            </li>
          ))}
        </ol>

        <div className={styles.howtoFooter} data-reveal="true" data-reveal-delay="200">
          <Link href="/entry/map" className={styles.howtoPrimaryCta}>
            先打开留学地图
          </Link>
          <Link href="/about" className={styles.howtoSecondaryCta}>
            了解 PathOS 的方法论
          </Link>
        </div>
      </section>

      {/* 14/14 — FAQ */}
      <FAQSection />
    </main>
  );
}
