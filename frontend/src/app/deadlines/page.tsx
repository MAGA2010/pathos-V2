import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PageMotion from "@/components/shared/PageMotion";
import { ApplicationDeadlineView } from "@/components/information/ApplicationDeadlineView";
import { DatabaseNotConfiguredError } from "@/server/db";
import { getCurrentUser } from "@/lib/session";
import {
  aggregateApplicationDeadlines,
  aggregateShortlistDeadlines,
  type ApplicationDeadlineCalendar,
} from "@/server/information/aggregate-deadline";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "申请日历 | PathOS",
  description:
    "基于已审核事实的申请截止日日历：按紧急、未来、已过期分区，并保留来源、学年与 UTC 口径说明。",
};

function unavailableMessage(error: unknown): string {
  if (error instanceof DatabaseNotConfiguredError) return error.message;
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("facts") && message.includes("does not exist")) {
    return "信息平台迁移尚未执行，申请日历暂不可用。";
  }
  return "已审核事实层暂不可用。为避免误导，页面不会显示缓存或示例截止日。";
}

interface PageProps {
  searchParams?: { shortlistId?: string };
}

export default async function DeadlinesPage({ searchParams }: PageProps) {
  const shortlistId = searchParams?.shortlistId?.trim();
  let calendar: ApplicationDeadlineCalendar | undefined;
  let error: string | undefined;
  if (shortlistId) {
    const user = await getCurrentUser();
    if (!user) {
      redirect(`/login?next=${encodeURIComponent(`/deadlines?shortlistId=${shortlistId}`)}`);
    }
    try {
      const personalCalendar = await aggregateShortlistDeadlines({
        shortlistId,
        userId: user.id,
      });
      if (personalCalendar != null) calendar = personalCalendar;
    } catch (e) {
      console.error("[deadlines/page] aggregate failed:", e);
      error = unavailableMessage(e);
    }
    if (calendar == null && error == null) notFound();
  } else {
    try {
      calendar = await aggregateApplicationDeadlines();
    } catch (e) {
      console.error("[deadlines/page] aggregate failed:", e);
      error = unavailableMessage(e);
    }
  }

  return (
    <PageMotion>
      <main className="mx-auto w-full max-w-page px-4 py-8 sm:px-6">
        <header className="border-b border-border-soft pb-6" data-reveal="true">
          <p className="text-label font-semibold uppercase tracking-[0.14em] text-cobalt">
            APPLICATION CALENDAR
          </p>
          <h1 className="mt-1 text-page text-text-primary" data-heading-stagger="true">
            申请日历
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">
            把已审核的截止日事实整理成可执行时间表。紧急项优先，历史周期不会被推进成新日期，来源与采集时间保持可见。
          </p>
        </header>

        <div className="mt-8">
          <ApplicationDeadlineView calendar={calendar} error={error} />
        </div>
      </main>
    </PageMotion>
  );
}
