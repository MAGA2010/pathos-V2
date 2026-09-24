"use client";

// /followed — list of universities the user has followed from
// /opportunities. The follow state lives in localStorage under
// `pathos_followed_universities` (an array of university ids, max 3
// per spec, though we tolerate more here so historical data still
// shows up). This page is the canonical "where do I see all the
// schools I followed" surface.

import Link from "next/link";
import { ArrowRight, BellOff, BookmarkPlus, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useDataSource } from "@/services/data-source-provider";
import { useNews, useUniversitySummaries } from "@/hooks/use-data-source";
import { DataEmptyState, DataLoadingState } from "@/components/shared/data-states";
import PageMotion from "@/components/shared/PageMotion";

const STORAGE_KEY = "pathos_followed_universities";

function readFollowedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

function writeFollowedIds(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export default function FollowedPage() {
  const source = useDataSource();
  const summaries = useUniversitySummaries(source);
  const news = useNews(source);

  // We hydrate from storage AFTER mount so SSR renders the empty state
  // and the client fills it in. This matches the pattern in compare-store.
  const [hydrated, setHydrated] = useState(false);
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  useEffect(() => {
    setFollowedIds(readFollowedIds());
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setFollowedIds(readFollowedIds());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const followedSchools = useMemo(() => {
    const allSummaries =
      summaries.state.status === "ready" ? summaries.state.data : [];
    const lookup = new Map(allSummaries.map((s) => [s.id, s]));
    return followedIds
      .map((id) => lookup.get(id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
  }, [followedIds, summaries.state]);

  // Count news items that mention any followed university. The news
  // payload links to a university by id; if the id is in the follow
  // set, the article counts.
  const newsById = useMemo(() => {
    const allNews = news.state.status === "ready" ? news.state.data : [];
    const m = new Map<string, number>();
    for (const a of allNews) {
      const id = a.universityId;
      if (!id || !followedIds.includes(id)) continue;
      m.set(id, (m.get(id) ?? 0) + 1);
    }
    return m;
  }, [news.state, followedIds]);

  const unfollow = (id: string) => {
    const next = followedIds.filter((x) => x !== id);
    setFollowedIds(next);
    writeFollowedIds(next);
  };

  const clearAll = () => {
    setFollowedIds([]);
    writeFollowedIds([]);
  };

  return (
    <PageMotion>
      <main className="mx-auto w-full max-w-page px-4 pb-16 pt-8 sm:px-6">
      <header className="page-motion-compact-hero px-6 py-7 sm:px-8 sm:py-9" data-reveal="true">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cobalt">
          FOLLOWED / PATHOS
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-text-primary" data-heading-stagger="true">
          我的关注院校
        </h1>
        <p className="mt-2 max-w-xl text-sm text-text-secondary">
          从
          <Link href="/opportunities" className="mx-1 text-cobalt hover:underline">
            机会动态
          </Link>
          关注的学校会自动汇总到此处，方便集中查看和跳转。
        </p>
      </header>

      {!hydrated || summaries.state.status === "loading" ? (
        <section className="mt-6">
          <DataLoadingState message="正在读取关注列表…" />
        </section>
      ) : followedSchools.length === 0 ? (
        <section className="mt-6" data-reveal="true" data-reveal-delay="80">
          <DataEmptyState
            title="还没有关注的学校"
            description="去机会动态页浏览资讯，点击「关注学校」按钮即可加入这里。"
            action={
              <Link
                href="/opportunities"
                className="inline-flex h-control items-center gap-1 rounded-control bg-ink px-3 text-[13px] font-semibold text-paper transition hover:bg-ink/90"
              >
                前往机会动态
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            }
          />
        </section>
      ) : (
        <section data-section="true">
          <div
            className="mt-5 flex items-center justify-between text-xs text-text-secondary"
            data-reveal="true"
          >
            <span>
              已关注 <span data-counter={String(followedSchools.length)}>{followedSchools.length}</span> 所学校
            </span>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-control px-2 py-1 text-text-muted transition hover:bg-surface-muted hover:text-persimmon"
            >
              <BellOff size={13} aria-hidden="true" />
              清空
            </button>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {followedSchools.map((school, index) => {
              const count = newsById.get(school.id) ?? 0;
              return (
                <li
                  key={school.id}
                  className="group flex items-center justify-between gap-3 rounded-control border border-border-soft bg-surface-1 px-4 py-3 transition hover:border-cobalt/40"
                  data-reveal="true"
                  data-reveal-delay={index < 5 ? String(80 * (index + 1)) : undefined}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-control bg-cobalt/8 text-cobalt">
                      <BookmarkPlus size={16} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-primary">
                        {school.chineseName ?? school.name}
                      </p>
                      <p className="truncate text-[11px] text-text-secondary" lang="en">
                        {school.name}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-text-muted">
                        {[school.city, school.state, school.country].filter(Boolean).join("，")}
                        {count > 0 ? (
                          <span className="ml-2 rounded-full bg-jade/10 px-2 py-0.5 text-[10px] font-medium text-jade">
                            {count} 条相关动态
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      href={`/university/${school.id}`}
                      className="inline-flex items-center gap-1 rounded-control border border-border-soft px-2.5 py-1 text-[11px] font-medium text-text-secondary transition hover:border-cobalt/40 hover:text-cobalt"
                    >
                      档案
                      <ExternalLink size={12} aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => unfollow(school.id)}
                      className="inline-flex items-center rounded-control px-2 py-1 text-[11px] text-text-muted transition hover:bg-surface-muted hover:text-persimmon"
                      aria-label={`取消关注 ${school.chineseName ?? school.name}`}
                    >
                      取消
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      </main>
    </PageMotion>
  );
}
