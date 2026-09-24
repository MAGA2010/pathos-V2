"use client";

// DataCoverageDashboard · 实时数据透明度面板
// 展示 PathOS 当前数据真实覆盖情况：总校数 / 已验证字段占比 /
// 最近更新时间 / 主要数据源。借鉴 V2 #14 数据出处 / 新鲜度
// 原则，让家庭在第一次接触 PathOS 时就能看清"现在能看到什么、
// 还差什么"。所有数据基于 useDatasetManifest + useUniversitySummaries。
// 不展示猜测值，未返回的字段保持"暂无"。

import Link from "next/link";
import { ArrowUpRight, BarChart3, CheckCircle2, Clock3, Layers3, ShieldCheck } from "lucide-react";
import { useDataSource } from "@/services/data-source-provider";
import { useDatasetManifest, useUniversitySummaries } from "@/hooks/use-data-source";
import styles from "@/app/home.module.css";

const PRIMARY_FIELDS = [
  { key: "tuitionBand",     label: "学费区间" },
  { key: "acceptanceRate", label: "录取率" },
  { key: "sat25_75",        label: "SAT 区间" },
  { key: "rankingNational", label: "全国位次" },
  { key: "regionSafety",    label: "区域安全" },
  { key: "regionEmployment", label: "区域就业" },
] as const;

function countCovered(summaries: any[], field: string): { covered: number; total: number; pct: number } {
  const total = summaries.length;
  if (total === 0) return { covered: 0, total: 0, pct: 0 };
  const covered = summaries.filter((s) => {
    if (field === "sat25_75") {
      return typeof s?.sat25 === "number" && typeof s?.sat75 === "number";
    }
    if (field === "rankingNational") {
      return typeof s?.rankingSummary?.nationalRank === "number" || typeof s?.rankingTier === "string";
    }
    if (field === "tuitionBand") {
      const cost = s?.costSummary;
      return typeof cost?.minimumUsd === "number" || typeof cost?.maximumUsd === "number";
    }
    if (field === "acceptanceRate") {
      return typeof s?.acceptanceRate === "number";
    }
    if (field === "regionSafety") {
      return typeof s?.regionSafetyScore === "number" || typeof s?.safetyScore === "number";
    }
    if (field === "regionEmployment") {
      return typeof s?.regionEmploymentScore === "number" || typeof s?.employmentScore === "number";
    }
    return false;
  }).length;
  return { covered, total, pct: Math.round((covered / total) * 100) };
}

function freshnessFromGenerated(generatedAt: string): { level: "fresh" | "aging" | "stale"; label: string } | null {
  if (!generatedAt) return null;
  const then = new Date(generatedAt).getTime();
  if (Number.isNaN(then)) return null;
  const days = Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
  if (days <= 30) return { level: "fresh", label: "近 30 天更新" };
  if (days <= 90) return { level: "aging", label: "30–90 天内" };
  return { level: "stale", label: "超 90 天" };
}

export function DataCoverageDashboard() {
  const source = useDataSource();
  const { state: manifestState } = useDatasetManifest(source);
  const { state: uniState } = useUniversitySummaries(source);

  const manifest = manifestState.status === "ready" ? manifestState.data : null;
  const summaries = uniState.status === "ready" ? uniState.data : [];
  const total = manifest?.counts?.universities ?? summaries.length;
  const generatedAt = manifest?.generatedAt ?? summaries[0]?.datasetVersion ?? "";
  const freshness = freshnessFromGenerated(generatedAt);
  const sourceCommit = manifest?.sourceCommit ?? "";

  const coverageRows = PRIMARY_FIELDS.map((f) => ({
    ...f,
    ...countCovered(summaries, f.key),
  }));
  const avgPct = coverageRows.length
    ? Math.round(coverageRows.reduce((s, r) => s + r.pct, 0) / coverageRows.length)
    : 0;

  const meta = [
    {
      icon: Layers3,
      eyebrow: "总校数",
      value: String(total || 0),
      suffix: "所",
      caption: "已加入 PathOS 的院校",
    },
    {
      icon: BarChart3,
      eyebrow: "字段覆盖",
      value: String(avgPct),
      suffix: "%",
      caption: "六大主字段平均覆盖率",
    },
    {
      icon: Clock3,
      eyebrow: "最近更新",
      value: freshness ? freshness.label : "暂无",
      suffix: "",
      caption: generatedAt ? "数据生成时间 " + generatedAt.slice(0, 10) : "等待首次抓取",
    },
    {
      icon: ShieldCheck,
      eyebrow: "数据状态",
      value: manifest?.previewOnly ? "Preview" : (manifest?.incomplete ? "补全中" : "稳定"),
      suffix: "",
      caption: manifest?.sourceLimited ? "仅部分源可用" : "全部源在线",
    },
  ] as const;

  return (
    <section
      className={styles.coverage}
      aria-labelledby="coverage-title"
      data-section="coverage"
      data-chapter-target="coverage"
    >
      <span className={styles.chapterMarker} aria-hidden="true">08 / 14</span>
      <div className={styles.sectionHeading} data-reveal="true">
        <p>DATA COVERAGE</p>
        <h2 id="coverage-title" data-reveal="true" data-heading-stagger="true">
          真实覆盖多少，我们现在直说。
        </h2>
        <p className={styles.sectionLead}>
          不展示估算值。每一行都基于本次数据集的字段存在情况，缺失字段保持「暂无」语义。
        </p>
      </div>

      <div className={styles.coverageMeta}>
        {meta.map((m, idx) => {
          const Icon = m.icon;
          const delay = String(idx * 80);
          return (
            <article
              key={m.eyebrow}
              className={styles.coverageMetaCard}
              data-reveal="true"
              data-reveal-delay={delay}
            >
              <span className={styles.coverageMetaEyebrow}>
                <Icon aria-hidden="true" size={14} /> {m.eyebrow}
              </span>
              <p className={styles.coverageMetaValue}>
                {m.value}
                {m.suffix ? <span className={styles.coverageMetaSuffix}>{m.suffix}</span> : null}
              </p>
              <p className={styles.coverageMetaCaption}>{m.caption}</p>
            </article>
          );
        })}
      </div>

      <div className={styles.coverageBars} data-reveal="true" data-reveal-delay="320">
        <header className={styles.coverageBarsHeader}>
          <h3 className={styles.coverageBarsTitle}>六大主字段覆盖明细</h3>
          <p className={styles.coverageBarsHint}>
            <CheckCircle2 aria-hidden="true" size={13} /> 绿色 = 已收集，灰色 = 数据补充中
          </p>
        </header>
        <ul className={styles.coverageBarList}>
          {coverageRows.map((row, idx) => {
            const delay = String(360 + idx * 80);
            return (
              <li
                key={row.key}
                className={styles.coverageBarItem}
                data-reveal="true"
                data-reveal-delay={delay}
              >
                <div className={styles.coverageBarLabel}>
                  <span>{row.label}</span>
                  <span className={styles.coverageBarPct}>
                    {row.covered}<span className={styles.coverageBarOf}>/{row.total}</span>
                  </span>
                </div>
                <div className={styles.coverageBarTrack} aria-hidden="true">
                  <span
                    className={styles.coverageBarFill}
                    style={{ width: row.pct + "%" }}
                    data-state={row.pct >= 70 ? "high" : row.pct >= 40 ? "mid" : "low"}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.coverageFooter} data-reveal="true" data-reveal-delay="600">
        <Link href="/entry/map" className={styles.coverageFooterLink}>
          <span>在地图上查看全部 {total} 所院校 <ArrowUpRight aria-hidden="true" size={14} /></span>
          <span className={styles.coverageFooterCaption}>
            {sourceCommit ? "Source commit " + sourceCommit.slice(0, 7) : "加载中…"}
          </span>
        </Link>
      </div>
    </section>
  );
}
