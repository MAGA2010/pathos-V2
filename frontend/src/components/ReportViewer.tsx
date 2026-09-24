"use client";

// Fetches /api/reports/[id]?token=<id> and renders the stored payload
// (deterministic baseline + LLM enrichment + recommended next steps).
// Polls every 2s while status=pending so the user sees the report
// appear as soon as DeepSeek returns.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

interface ReportPayload {
  summary?: string;
  recommended?: Array<{
    id?: string;
    name?: string;
    chineseName?: string;
    fit?: string;
    reason?: string;
    nextStep?: string;
  }>;
  portfolio?: {
    majorRisks?: string[];
    parentQuestions?: string[];
    narrative?: string;
  };
  nextActions?: string[];
  ai?: {
    unknowns?: string[];
    provider?: string;
    model?: string;
  };
  source?: string;
}

interface ReportRow {
  id: string;
  status: string;
  error: string | null;
  profile: Record<string, unknown>;
  schools: Array<{ id?: string; name?: string; chineseName?: string }>;
  payload: ReportPayload;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  ok: boolean;
  report?: ReportRow;
  code?: string;
  message?: string;
}

export function ReportViewer({ id, token }: { id: string; token: string }) {
  const [state, setState] = useState<"loading" | "ready" | "pending" | "failed" | "not_found" | "error">("loading");
  const [report, setReport] = useState<ReportRow | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchOnce() {
      try {
        const resp = await fetch(`/api/reports/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`);
        const data = (await resp.json()) as ApiResponse;
        if (cancelled) return;
        if (!resp.ok) {
          if (resp.status === 404) { setState("not_found"); return; }
          setErrorMessage(data.message ?? data.code ?? "fetch failed");
          setState("error");
          return;
        }
        if (!data.report) { setState("not_found"); return; }
        setReport(data.report);
        if (data.report.status === "pending") {
          setState("pending");
          timer.current = setTimeout(fetchOnce, 2000);
        } else if (data.report.status === "failed") {
          setState("failed");
        } else {
          setState("ready");
        }
      } catch (e) {
        if (cancelled) return;
        setErrorMessage(e instanceof Error ? e.message : String(e));
        setState("error");
      }
    }
    fetchOnce();
    return () => { cancelled = true; if (timer.current) clearTimeout(timer.current); };
  }, [id, token]);

  if (state === "loading") {
    return (
      <main className="mx-auto flex max-w-page items-center justify-center px-4 py-24 sm:px-6">
        <Loader2 size={22} className="animate-spin text-cobalt" aria-hidden="true" />
      </main>
    );
  }

  if (state === "not_found") {
    return (
      <main className="mx-auto max-w-page px-4 py-24 sm:px-6">
        <h1 className="text-2xl font-semibold text-text-primary">报告不存在或链接已失效</h1>
        <p className="mt-3 text-sm text-text-secondary">
          请检查链接中的 report id 是否完整；如确认无误但仍无法访问，请联系
          <Link href="/pricing" className="ml-1 underline decoration-text-tertiary underline-offset-2 hover:text-text-primary">PathOS 顾问</Link>
          。
        </p>
      </main>
    );
  }

  if (state === "error" || state === "failed") {
    return (
      <main className="mx-auto max-w-page px-4 py-24 sm:px-6">
        <div className="flex items-start gap-3 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-700 dark:text-rose-300">
          <XCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <h1 className="text-lg font-semibold">报告生成失败</h1>
            <p className="mt-1 text-sm">
              {errorMessage ?? report?.error ?? "未知错误，请稍后再试或联系顾问。"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (state === "pending" || !report) {
    return (
      <main className="mx-auto max-w-page px-4 py-24 sm:px-6">
        <div className="flex items-center gap-3 text-text-secondary">
          <Loader2 size={18} className="animate-spin text-cobalt" aria-hidden="true" />
          <p className="text-sm">正在生成 AI 解读报告…通常需要 30 - 60 秒。</p>
        </div>
      </main>
    );
  }

  const payload = report.payload ?? {};
  const recommended = payload.recommended ?? [];
  const majorRisks = payload.portfolio?.majorRisks ?? [];
  const parentQuestions = payload.portfolio?.parentQuestions ?? [];
  const nextActions = payload.nextActions ?? [];
  const unknowns = payload.ai?.unknowns ?? [];

  return (
    <main className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:py-14">
      <header>
        <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 size={12} aria-hidden="true" />
          报告已就绪
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          AI 选校解读报告
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          基于您提交的 {report.schools.length} 所目标学校与个人背景综合生成。
          报告编号 <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">{report.id}</code>，
          生成于 {new Date(report.createdAt).toLocaleString("zh-CN")}。
        </p>
      </header>

      {payload.summary && (
        <section className="mt-8 rounded-3xl border border-border-soft bg-surface-1 p-5">
          <h2 className="text-base font-semibold text-text-primary">总体定位</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">{payload.summary}</p>
        </section>
      )}

      {recommended.length > 0 && (
        <section className="mt-6">
          <h2 className="text-base font-semibold text-text-primary">逐校评估</h2>
          <div className="mt-3 space-y-3">
            {recommended.map((school, idx) => (
              <article key={`${school.id ?? school.name ?? idx}`} className="rounded-2xl border border-border-soft bg-surface-1 p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {school.chineseName ?? school.name ?? `学校 #${idx + 1}`}
                  </h3>
                  {school.fit && (
                    <span className="inline-flex h-6 items-center rounded-full bg-cobalt/10 px-2 text-[11px] font-semibold uppercase tracking-wider text-cobalt">
                      {school.fit}
                    </span>
                  )}
                </div>
                {school.name && school.chineseName && (
                  <p className="mt-1 text-[13px] text-text-tertiary">{school.name}</p>
                )}
                {school.reason && (
                  <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">{school.reason}</p>
                )}
                {school.nextStep && (
                  <p className="mt-3 rounded-control bg-surface-2/60 px-3 py-2 text-[13px] text-text-secondary">
                    <span className="font-medium text-text-primary">下一步：</span>{school.nextStep}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {majorRisks.length > 0 && (
        <section className="mt-6 rounded-3xl border border-border-soft bg-surface-1 p-5">
          <h2 className="text-base font-semibold text-text-primary">主要风险</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-text-secondary">
            {majorRisks.map((risk, idx) => (
              <li key={idx}>{risk}</li>
            ))}
          </ul>
        </section>
      )}

      {parentQuestions.length > 0 && (
        <section className="mt-6 rounded-3xl border border-border-soft bg-surface-1 p-5">
          <h2 className="text-base font-semibold text-text-primary">家长最常问的问题</h2>
          <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-text-secondary">
            {parentQuestions.map((q, idx) => (
              <li key={idx} className="rounded-control bg-surface-2/60 px-3 py-2">{q}</li>
            ))}
          </ul>
        </section>
      )}

      {nextActions.length > 0 && (
        <section className="mt-6 rounded-3xl border border-border-soft bg-surface-1 p-5">
          <h2 className="text-base font-semibold text-text-primary">下一步建议</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[14px] leading-relaxed text-text-secondary">
            {nextActions.map((action, idx) => (
              <li key={idx}>{action}</li>
            ))}
          </ol>
        </section>
      )}

      {unknowns.length > 0 && (
        <section className="mt-6 rounded-3xl border border-border-soft bg-surface-2/60 p-5 text-[13px] text-text-secondary">
          <h2 className="text-sm font-semibold text-text-primary">信息不足项</h2>
          <p className="mt-2 leading-relaxed">
            报告基于您填写的信息生成；以下维度未被提供，导致结论置信度下降：
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {unknowns.map((u, idx) => (
              <li key={idx}>{u}</li>
            ))}
          </ul>
          <p className="mt-3 text-text-tertiary">
            如需更精准解读，可重新提交带这些字段的
            <Link href="/entry/assessment" className="ml-1 underline decoration-text-tertiary underline-offset-2 hover:text-text-primary">AI 学校评估</Link>
            。
          </p>
        </section>
      )}
    </main>
  );
}