import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, FileSignature, Receipt } from "lucide-react";

export const metadata: Metadata = {
  title: "我的订阅",
  description: "查看您在 PathOS 的订阅记录、付款状态和服务进度。",
};

const STATUS_BADGES: Record<string, { label: string; tone: string; icon: React.ReactNode }> = {
  new: { label: "等待顾问联系", tone: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300", icon: <Clock size={14} aria-hidden="true" /> },
  contacted: { label: "顾问已联系", tone: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300", icon: <CheckCircle2 size={14} aria-hidden="true" /> },
  paid: { label: "已付款", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", icon: <Receipt size={14} aria-hidden="true" /> },
  closed_lost: { label: "已关闭", tone: "border-text-tertiary/30 bg-text-tertiary/10 text-text-secondary", icon: <FileSignature size={14} aria-hidden="true" /> },
};

const STEPS = [
  { key: "afterFormat", title: "1. 提交申请", desc: "在 /pricing 选择方案并留下联系方式。我们会立即收到通知。" },
  { key: "afterContact", title: "2. 顾问沟通", desc: "24 小时内会有顾问通过您填写的渠道主动联系，确认需求细节。" },
  { key: "afterSign", title: "3. 签署协议 / 付款", desc: "确认方案后，我们会发送电子协议并开具发票。可微信、银行转账、企业开票。" },
  { key: "afterService", title: "4. 服务启动", desc: "签约次日即开通平台账户，进入顾问年付群组；单次报告进入撰写队列。" },
];

export default function AccountSubscriptionPage() {
  return (
    <main className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:py-16">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">我的订阅</h1>
        <p className="mt-2 max-w-2xl text-base text-text-secondary">
          在这里查看您当前的订阅状态、服务协议和发票。还没有订阅？
          <Link href="/pricing" className="ml-1 underline decoration-text-tertiary underline-offset-2 hover:text-text-primary">
            看看三种付费方案
          </Link>
          。
        </p>
      </header>

      <section className="mt-10 rounded-3xl border border-border-soft bg-surface-1 p-6">
        <h2 className="text-base font-semibold text-text-primary">订阅状态说明</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.entries(STATUS_BADGES).map(([code, badge]) => (
            <li
              key={code}
              className={
                "inline-flex items-center gap-2 rounded-control border px-3 py-2 text-sm font-medium " +
                badge.tone
              }
            >
              {badge.icon}
              <span>{badge.label}</span>
              <code className="ml-auto font-mono text-[11px] text-text-tertiary">{code}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-3xl border border-border-soft bg-surface-1 p-6">
        <h2 className="text-base font-semibold text-text-primary">从提交到服务的 4 步流程</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li key={step.key} className="rounded-2xl border border-border-soft bg-surface-2/60 p-4">
              <p className="text-[13px] font-semibold uppercase tracking-wider text-cobalt">{step.title.split(".")[0]}</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{step.title.split(".").slice(1).join(".").trim()}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 rounded-3xl border border-border-soft bg-surface-1 p-6">
        <h2 className="text-base font-semibold text-text-primary">查询已有订阅</h2>
        <p className="mt-2 text-sm text-text-secondary">
          目前您提交订阅时填写的手机号 / 微信即为您在该订阅下的识别凭证如需查询订阅详情，
          请把您的姓名 + 联系方式发到 <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">support@pathos.example</code>，
          或直接联系当时和您沟通的顾问。后续我们将上线「绑定手机号」自助查询。
        </p>
      </section>
    </main>
  );
}