// /workbench/shortlists -- list every shortlist owned by the caller.
//
// Server component. The interactive create form lives in
// ShortlistList.tsx alongside this file.
import Link from "next/link";
import { redirect } from "next/navigation";
import { ListChecks } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { DatabaseNotConfiguredError } from "@/server/db";
import { listShortlistsForUser } from "@/lib/shortlists";
import ShortlistList from "./ShortlistList";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: { error?: string; ok?: string };
}

export default async function ShortlistsPage({ searchParams }: PageProps): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/workbench/shortlists");
  }
  let lists: Awaited<ReturnType<typeof listShortlistsForUser>> = [];
  let dbError: string | null = null;
  try {
    lists = await listShortlistsForUser(user.id);
  } catch (e) {
    if (e instanceof DatabaseNotConfiguredError) {
      dbError = "数据库未配置,无法加载选校清单。";
    } else {
      dbError = "暂时无法加载选校清单,请稍后重试。";
    }
    lists = [];
  }
  return (
    <main className="mx-auto w-full max-w-page px-4 pb-16 pt-8 sm:px-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cobalt">
            SHORTLISTS / PATHOS
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text-primary">
            我的选校清单
          </h1>
          <p className="mt-2 max-w-xl text-sm text-text-secondary">
            按冲刺 / 匹配 / 保底 三档分组管理你的目标学校,顾问可基于清单生成评估报告。
          </p>
        </div>
        <Link
          href="/s/home"
          className="inline-flex h-control items-center gap-1 rounded-control border border-border-soft bg-surface-1 px-3 text-[13px] font-medium text-text-secondary transition hover:border-cobalt/40 hover:text-cobalt"
        >
          返回工作台
        </Link>
      </header>
      {dbError && (
        <div className="mt-6 rounded-control border border-amber-300/40 bg-amber-50 px-4 py-3 text-[13px] text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200">
          {dbError}
        </div>
      )}
      <ShortlistList
        initialLists={lists}
        initialError={searchParams?.error ?? null}
        initialOk={searchParams?.ok ?? null}
      />
      {lists.length === 0 && !dbError && (
        <section className="mt-10 rounded-control border border-dashed border-border-soft bg-surface-1 p-8 text-center">
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-control bg-cobalt/10 text-cobalt">
            <ListChecks size={18} aria-hidden="true" />
          </div>
          <h2 className="mt-3 text-base font-semibold text-text-primary">还没有选校清单</h2>
          <p className="mt-1 text-[13px] text-text-secondary">
            建议按申请季创建一份(例如 <span className="font-medium text-text-primary">Fall 2027 申请季</span>)。
          </p>
        </section>
      )}
    </main>
  );
}
