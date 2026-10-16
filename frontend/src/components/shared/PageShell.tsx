import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ArrowLeft, Database } from "lucide-react";
import type { ReactNode } from "react";

import PageMotion from "@/components/shared/PageMotion";

type Accent = "cobalt" | "jade" | "persimmon";

const ICON_ACCENTS: Record<Accent, string> = {
  cobalt: "bg-cobalt text-paper",
  jade: "bg-jade text-paper",
  persimmon: "bg-persimmon text-paper",
};

export type PageShellProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  icon: LucideIcon;
  accent?: Accent;
  backHref: string;
  backLabel: string;
  primaryAction?: ReactNode;
  coverage?: {
    detail: ReactNode;
    warning?: boolean;
  };
  contentClassName?: string;
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  icon: Icon,
  accent = "cobalt",
  backHref,
  backLabel,
  primaryAction,
  coverage,
  contentClassName = "",
  children,
}: PageShellProps) {
  return (
    <PageMotion>
      <div className="min-h-screen bg-surface-base">
        <header className="border-b border-border-soft bg-surface-1/90 backdrop-blur">
          <div className="mx-auto max-w-page px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={backHref}
                className="inline-flex min-h-control-lg items-center gap-1.5 rounded-control px-3 text-caption font-medium text-text-secondary transition hover:bg-surface-2 hover:text-cobalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                {backLabel}
              </Link>
              {primaryAction ? (
                <div className="flex flex-wrap items-center gap-2 [&>a]:min-h-control-lg [&>button]:min-h-control-lg">
                  {primaryAction}
                </div>
              ) : null}
            </div>

            <div className="mt-3 flex items-start gap-3">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-control ${ICON_ACCENTS[accent]}`}>
                <Icon size={19} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-label uppercase tracking-[0.12em] text-cobalt">{eyebrow}</p>
                <h1 data-heading-stagger="true" className="text-page text-text-primary">
                  {title}
                </h1>
                {description ? <p className="mt-1 max-w-3xl text-caption text-text-secondary">{description}</p> : null}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-page px-4 pb-10 pt-5 [&_button]:min-h-control-lg [&_button]:min-w-control-lg sm:px-6">
          {coverage ? (
            <div
              role="note"
              aria-label="数据覆盖提示"
              className={`mb-5 flex items-start gap-2 rounded-control border px-3 py-2 text-caption ${
                coverage.warning ? "border-persimmon/30 bg-persimmon/8 text-persimmon" : "border-border-soft bg-surface-1 text-text-secondary"
              }`}
            >
              {coverage.warning ? (
                <AlertTriangle size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
              ) : (
                <Database size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-cobalt" />
              )}
              <p>{coverage.detail}</p>
            </div>
          ) : null}
          <div className={contentClassName}>{children}</div>
        </main>
      </div>
    </PageMotion>
  );
}

export function PageStep({
  step,
  title,
  description,
  aside,
  children,
}: {
  step: string;
  title: string;
  description?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3" data-reveal="true">
      <header className="flex flex-wrap items-end justify-between gap-3 rounded-control border border-border-soft bg-surface-1 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tabular-nums text-text-muted">STEP {step}</p>
          <h2 className="mt-0.5 text-section text-text-primary">{title}</h2>
          {description ? <p className="mt-1 max-w-2xl text-caption text-text-secondary">{description}</p> : null}
        </div>
        {aside ? <div className="flex flex-wrap items-center gap-2">{aside}</div> : null}
      </header>
      {children}
    </section>
  );
}

export function PageResultPanel({
  title,
  source,
  children,
}: {
  title: string;
  source?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-border-soft bg-ink p-4 text-panel shadow-pop sm:p-5">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-panel/10 pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-panel/45">
            {source ? `数据驱动 · ${source}` : "数据驱动"}
          </p>
          <h2 className="mt-1 text-section">{title}</h2>
        </div>
        <span className="rounded-control bg-panel/10 px-2.5 py-1 text-[11px] font-semibold text-panel/70">仅供决策参考</span>
      </header>
      <div className="pt-4">{children}</div>
    </section>
  );
}

export function PageEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-soft bg-surface-1 px-6 py-10 text-center">
      <p className="text-body font-medium text-text-secondary">{title}</p>
      {description ? <p className="mt-1 max-w-md text-caption text-text-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
