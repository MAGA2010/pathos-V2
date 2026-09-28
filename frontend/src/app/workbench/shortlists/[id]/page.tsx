// /workbench/shortlists/[id] -- the per-list dashboard.
//
// Server component. Fetches the list and the items grouped by bucket
// in one round trip, then hands off to ShortlistBoard for the
// drag-friendly three-column view.
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DatabaseNotConfiguredError } from "@/server/db";
import {
  getShortlist,
  getShortlistGrouped,
} from "@/lib/shortlists";
import ShortlistBoard from "./ShortlistBoard";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function ShortlistDetailPage({ params }: PageProps): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=/workbench/shortlists/${encodeURIComponent(params.id)}`);
  }
  if (!params.id || params.id.length > 64) notFound();

  let list;
  let groups;
  let dbError: string | null = null;
  try {
    list = await getShortlist(params.id);
    if (!list || list.ownerUserId !== user.id) notFound();
    groups = await getShortlistGrouped(params.id);
  } catch (e) {
    if (e instanceof DatabaseNotConfiguredError) {
      dbError = "数据库未配置,无法加载选校清单。";
    } else {
      dbError = "暂时无法加载选校清单,请稍后重试。";
    }
    list = null;
    groups = { reach: [], match: [], safety: [] };
  }
  return (
    <main className="mx-auto w-full max-w-page px-4 pb-16 pt-8 sm:px-6">
      <Link
        href="/workbench/shortlists"
        className="inline-flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-cobalt"
      >
        ← 返回选校清单
      </Link>
      {dbError ? (
        <div className="mt-6 rounded-control border border-amber-300/40 bg-amber-50 px-4 py-3 text-[13px] text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200">
          {dbError}
        </div>
      ) : list ? (
        <ShortlistBoard shortlist={list} groups={groups} />
      ) : null}
    </main>
  );
}
