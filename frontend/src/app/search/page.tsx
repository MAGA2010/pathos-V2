"use client";

import { Suspense } from "react";

// /search — global search results page.
//
// Why a dedicated route (instead of a modal or an inline panel):
//   - The query lives in the URL (`?q=…`), so a result is shareable
//     and survives reload.
//   - When the user clicks "搜索" in NavBar they land on a real
//     page that also lives behind the "/" hotkey, so it deserves
//     a stable URL.
//   - Reuses `useUniversitySearch` from the existing data layer;
//     no new network code is added.

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Search as SearchIcon, University } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useDataSource } from "@/services/data-source-provider";
import { useUniversitySearch } from "@/hooks/use-data-source";
import { DataLoadingState, DataEmptyState } from "@/components/shared/data-states";
import PageMotion from "@/components/shared/PageMotion";

function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep local input in sync if the user navigates with browser back/forward.
  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  // Autofocus only where a physical keyboard is likely. On touch devices
  // an unconditional autoFocus pops the on-screen keyboard and hides the
  // results the user came here to read.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    inputRef.current?.focus();
  }, []);

  const source = useDataSource();
  const trimmed = query.trim();
  const { state } = useUniversitySearch(source, trimmed, { limit: 20 });
  const results = state.status === "ready" ? state.data : [];
  type Ready = { status: "ready"; data: ReadonlyArray<{ universityId?: string; id: string; name: string; chineseName?: string | null; city?: string | null; state?: string | null; country?: string | null }> };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = query.trim();
    router.replace(`/search${next ? `?q=${encodeURIComponent(next)}` : ""}`);
  };

  return (
    <PageMotion>
      <main className="mx-auto w-full max-w-page px-4 pb-16 pt-8 sm:px-6">
      <header className="page-motion-compact-hero px-6 py-7 sm:px-8 sm:py-9" data-reveal="true">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cobalt">
          SEARCH / PATHOS
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-text-primary" data-heading-stagger="true">
          搜索学校 / 城市
        </h1>
        <p className="mt-2 max-w-xl text-sm text-text-secondary">
          按学校英文名、中文名、所在城市或州搜索；至少 2 个字符。
        </p>
      </header>

      <form
        role="search"
        onSubmit={submit}
        className="mt-5 flex items-center gap-2"
        data-reveal="true"
        data-reveal-delay="80"
      >
        <div className="relative flex-1">
          <SearchIcon
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例如：Princeton、Princeton University、普林斯顿、New Jersey"
            aria-label="搜索学校 / 城市"
            className="w-full rounded-control border border-border-soft bg-surface-1 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-cobalt/45 focus:ring-2 focus:ring-focus-ring"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-control items-center gap-1 rounded-control bg-ink px-3 text-[13px] font-semibold text-paper transition hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          搜索
        </button>
      </form>

      <div className="mt-4 flex items-center gap-3 text-caption text-text-secondary" data-reveal="true">
        {state.status === "ready" ? (
          <span className="page-motion-stat">
            找到 <span data-counter={String(results.length)} data-counter-format="locale" className="page-motion-stat-value">{results.length}</span>
            <span className="page-motion-stat-label">所学校</span>
          </span>
        ) : trimmed.length >= 2 ? (
          <span className="page-motion-stat" aria-live="polite">
            搜索中 <span className="page-motion-stat-value">…</span>
            <span className="page-motion-stat-label">请稍候</span>
          </span>
        ) : null}
      </div>

      <section className="mt-6" aria-live="polite" data-section="true">
        {!trimmed ? (
          <DataEmptyState
            title="输入关键词开始搜索"
            description="支持中英文，按 / 也能在任意页面打开搜索。"
          />
        ) : trimmed.length < 2 ? (
          <DataEmptyState title="再多输一点" description="至少 2 个字符才会触发搜索。" />
        ) : state.status === "loading" ? (
          <DataLoadingState message="正在搜索学校…" />
        ) : state.status === "error" ? (
          <DataEmptyState title="搜索暂不可用" description="数据源暂时无法访问，请稍后再试。" />
        ) : results.length === 0 ? (
          <DataEmptyState
            title="暂无匹配结果"
            description={`没有找到包含 “${trimmed}” 的学校，试试其他关键词。`}
          />
        ) : (
          <ul className="grid gap-2">
            {results.map((result, index) => {
              const u = result.university;
              const id = u.id;
              const href = id ? `/university/${id}` : "#";
              const subtitle = [u.city, u.state, u.country]
                .filter(Boolean)
                .join("，");
              return (
                <li
                  key={id ?? u.name}
                  data-reveal="true"
                  data-reveal-delay={index < 5 ? String(80 * (index + 1)) : undefined}
                >
                  <Link
                    href={href}
                    className="group flex items-center justify-between gap-3 rounded-control border border-border-soft bg-surface-1 px-4 py-3 transition hover:border-cobalt/40 hover:bg-surface-muted"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-control bg-cobalt/8 text-cobalt">
                        <University size={16} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text-primary">
                          {u.chineseName ?? u.name}
                        </p>
                        <p className="truncate text-xs text-text-secondary" lang="en">
                          {u.name}
                        </p>
                        {subtitle ? (
                          <p className="mt-0.5 truncate text-[11px] text-text-muted">{subtitle}</p>
                        ) : null}
                      </div>
                    </div>
                    <ArrowRight
                      size={15}
                      className="shrink-0 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-cobalt"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      </main>
    </PageMotion>
  );
}

// Suspense wrapper required because SearchPage calls useSearchParams,
// which Next.js refuses to render outside a Suspense boundary during
// static export.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}
