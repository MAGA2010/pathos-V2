// /workbench/orgs -- list every organization the caller is a member of.
//
// Server component. We render an empty-state and a meta-panel rather
// than a redirect so a brand-new visitor who just signed in still
// sees a coherent page (the AuthButton + NavBar already cover
// unauthenticated state via /login).
import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { DatabaseNotConfiguredError } from "@/server/db";
import { listOrganizationsForUser } from "@/lib/orgs";
import OrgList from "./OrgList";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: { error?: string; ok?: string };
}

export default async function OrgsPage({ searchParams }: PageProps): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/workbench/orgs");
  }
  let orgs: Awaited<ReturnType<typeof listOrganizationsForUser>> = [];
  let dbError: string | null = null;
  try {
    orgs = await listOrganizationsForUser(user.id);
  } catch (e) {
    if (e instanceof DatabaseNotConfiguredError) {
      dbError = "数据库未配置,无法加载组织列表。请联系管理员。";
    } else {
      dbError = "暂时无法加载组织列表,请稍后重试。";
    }
    orgs = [];
  }
  return (
    <main className="mx-auto w-full max-w-page px-4 pb-16 pt-8 sm:px-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cobalt">
            ORGS / PATHOS
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text-primary">
            我的组织
          </h1>
          <p className="mt-2 max-w-xl text-sm text-text-secondary">
            在这里创建你的顾问公司/工作室,邀请团队成员加入,并管理待处理的邀请链接。
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
      <OrgList
        initialOrgs={orgs}
        initialError={searchParams?.error ?? null}
        initialOk={searchParams?.ok ?? null}
      />
      {orgs.length === 0 && !dbError && (
        <section className="mt-10 rounded-control border border-dashed border-border-soft bg-surface-1 p-8 text-center">
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-control bg-cobalt/10 text-cobalt">
            <Building2 size={18} aria-hidden="true" />
          </div>
          <h2 className="mt-3 text-base font-semibold text-text-primary">
            创建你的第一个组织
          </h2>
          <p className="mt-1 text-[13px] text-text-secondary">
            组织是一所学校一码,可以容纳多位顾问、共享报告、协同管理学生清单。
          </p>
        </section>
      )}
    </main>
  );
}

