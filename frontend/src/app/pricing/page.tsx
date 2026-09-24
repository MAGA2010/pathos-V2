import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { PricingForm } from "@/components/PricingForm";

export const metadata: Metadata = {
  title: "付费方案",
  description: "PathOS 顾问年付 / 单次 AI 解读报告 / 数据 API 三种付费路径。所有方案均接受微信、银行转账和企业开票。",
};

const PLANS = [
  {
    id: "single_report" as const,
    name: "单次 AI 解读报告",
    price: "¥500 - 2,000",
    unit: "/ 份",
    summary: "适合已经初步定校的家庭。一份 PDF + 一位顾问 30 分钟电话沟通。",
    bullets: [
      "1 份定制 PDF：选校定位 + 风险点 + 文书建议",
      "30 分钟顾问 1v1 电话",
      "5 个工作日内交付",
      "可指定 1-3 所目标学校",
    ],
  },
  {
    id: "advisor_annual" as const,
    name: "顾问年付",
    price: "¥3,000 - 5,000",
    unit: "/ 年",
    summary: "整个申请季持续跟进。PathOS 主推方案，月活顾问随时响应。",
    bullets: [
      "PathOS 平台全功能（含地图、AI 评估、清单分析）",
      "1 名固定顾问 + 微信群即时响应",
      "每月 1 次 30 分钟复盘通话",
      "选校 / 文书 / 面试 / 签证四个阶段全覆盖",
      "10 个家庭以内名额，按报名顺序分配",
    ],
    featured: true,
  },
  {
    id: "data_api" as const,
    name: "数据 API（企业）",
    price: "¥10,000 - 50,000",
    unit: "/ 年",
    summary: "面向留学机构、国际学校、教辅平台的批量数据接入。",
    bullets: [
      "/api/v1/universities 全量接入",
      "按月配额（10k - 100k 次调用）",
      "可定制字段过滤 / webhook 回调",
      "签署 NDA + 数据使用协议",
      "7×12 工单支持",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          选校不再靠感觉，决策有据可依
        </h1>
        <p className="mt-4 text-base text-text-secondary sm:text-lg">
          三种付费路径：单次报告轻量起步、顾问年付全程陪伴、数据 API 服务机构与企业。
          所有方案均在 PathOS 平台数据基础上，由 PathOS 顾问团队直接交付。
        </p>
      </header>

      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={
              "flex flex-col rounded-3xl border bg-surface-1 p-6 shadow-sm transition " +
              (plan.featured
                ? "border-cobalt/40 ring-2 ring-cobalt/30 lg:scale-[1.02]"
                : "border-border-soft hover:border-border-strong/50")
            }
          >
            {plan.featured && (
              <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-cobalt/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-cobalt">
                主推方案
              </span>
            )}
            <h2 className="text-lg font-semibold text-text-primary">{plan.name}</h2>
            <p className="mt-1 text-sm text-text-secondary">{plan.summary}</p>
            <div className="mt-5 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
              <span className="text-sm text-text-tertiary">{plan.unit}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-text-secondary">
              {plan.bullets.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-cobalt" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <PricingForm plan={plan.id} planName={plan.name} featured={plan.featured} />
          </article>
        ))}
      </section>

      <section className="mt-16 rounded-3xl border border-border-soft bg-surface-1 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-text-primary">其它问题</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-text-primary">付款方式？</dt>
            <dd className="mt-1 text-sm text-text-secondary">
              微信、银行转账、企业开票均可。Stripe / 微信支付正在接入，
              接入完成后可直接线上付款。
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-text-primary">顾问是谁？</dt>
            <dd className="mt-1 text-sm text-text-secondary">
              PathOS 团队成员，全部拥有美本 / 美研申请经验，平台数据由我们维护。
              我们不做「分销给兼职学生」的模式。
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-text-primary">能开发票吗？</dt>
            <dd className="mt-1 text-sm text-text-secondary">
              支持。顾问年付与数据 API 默认开「咨询服务费」增值税普通发票；
              加 6 个点可开增值税专用发票。
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-text-primary">可以退款吗？</dt>
            <dd className="mt-1 text-sm text-text-secondary">
              顾问年付 7 天内未与顾问沟通可全额退款；单次报告在交付前可退 80%
              详细条款见
              <Link href="/about" className="ml-1 underline decoration-text-tertiary underline-offset-2 hover:text-text-primary">
                服务条款
              </Link>
              。
            </dd>
          </div>
        </dl>
      </section>

      <aside className="mt-12 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-text-secondary">没有看到合适的方案？</p>
        <a
          href="weixin://"
          className="inline-flex items-center gap-1.5 rounded-control border border-border-soft bg-surface-1 px-4 py-2 text-[13px] font-medium text-text-primary transition hover:border-cobalt/40 hover:text-cobalt"
        >
          <MessageCircle size={14} aria-hidden="true" />
          加 PathOS 顾问微信详聊
        </a>
        <p className="text-xs text-text-tertiary">顾问会在 24 小时内回复</p>
      </aside>
    </main>
  );
}