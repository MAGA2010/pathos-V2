"use client";

// LatestUpdatesSection — shows up to 4 of the most recent news entries
// from the data source. Each item surfaces whatChanged (concise summary)
// and links to the upstream source URL when available. Empty / loading
// states are explicit rather than fabricated.

import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import { useDataSource } from "@/services/data-source-provider";
import { useNews } from "@/hooks/use-data-source";
import styles from "@/app/home.module.css";

function formatDate(iso: string): string {
  if (!iso) return "暂无日期";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "暂无日期";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function describe(article: { summary?: string; whatChanged?: string }): string {
  return article.summary || article.whatChanged || "暂无摘要";
}

export function LatestUpdatesSection() {
  const source = useDataSource();
  const { state } = useNews(source);

  const all = state.status === "ready" ? state.data : [];
  const recent = all.slice(0, 4);

  return (
    <section className={styles.updates} aria-labelledby="updates-title" data-section="updates" data-chapter-target="updates">
      <span className={styles.chapterMarker} aria-hidden="true">09 / 14</span>
      <div className={styles.updatesInner}>
        <div className={styles.sectionHeading} data-reveal="true">
          <p>LATEST UPDATES</p>
          <h2 id="updates-title" data-reveal="true" data-heading-stagger="true">最近收录的院校与政策动态。</h2>
          <p className={styles.sectionLead}>
            每条动态都标注了原始来源，方便家长与学生自行核实。
          </p>
        </div>

        {recent.length === 0 ? (
          <p className={styles.updatesEmpty} data-reveal="true" data-reveal-delay="80">
            暂无新动态。
          </p>
        ) : (
          <ul className={styles.updatesList}>
            {recent.map((article, idx) => {
              const delay = String(Math.min(idx * 80, 320));
              const schoolLabel =
                article.universityNameZh || article.universityName || "通用资讯";
              const title = article.title || "暂无标题";
              const summary = describe(article);
              const date = formatDate(article.publishedAt);
              const linkHref = article.url || `/university/${article.universityId ?? ""}`;
              const external = !!article.url;
              return (
                <li
                  key={article.id}
                  className={styles.updateItem}
                  data-reveal="true"
                  data-reveal-delay={delay}
                >
                  <div className={styles.updateMeta}>
                    <span className={styles.updateSchool}>{schoolLabel}</span>
                    <span className={styles.updateDate}>
                      <Calendar aria-hidden="true" size={13} /> {date}
                    </span>
                  </div>
                  <h3 className={styles.updateTitle}>{title}</h3>
                  <p className={styles.updateSummary}>{summary}</p>
                  <Link
                    href={linkHref}
                    className={styles.updateLink}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer noopener" : undefined}
                  >
                    {external ? "查看来源" : "了解更多"}{" "}
                    <ArrowUpRight aria-hidden="true" size={14} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
