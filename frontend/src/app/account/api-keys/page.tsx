import type { Metadata } from "next";
import Link from "next/link";
import { Code2, KeyRound, ShieldCheck, Webhook } from "lucide-react";

export const metadata: Metadata = {
  title: "数据 API 文档",
  description: "PathOS 数据 API 鉴权、速率限制、字段说明与示例代码。",
};

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/universities",
    desc: "获取学校列表（分页、按 state / tier 过滤）。",
    example: `curl https://personal-os-zu9q.onrender.com/api/v1/universities \\
  -H "Authorization: Bearer pk_xxx" \\
  -G --data-urlencode "state=CA" --data-urlencode "limit=20"`,
    response: `{
  "ok": true,
  "data": {
    "universities": [{ "id": "candidate-v2:stanford-university", "name": "Stanford University", ... }],
    "pagination": { "limit": 20, "nextCursor": null, "hasMore": false },
    "rateLimit": { "remaining": 59, "perMinute": 60 },
    "quota":     { "used": 12, "limit": 10000 }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/universities/[id]",
    desc: "获取单个学校的精简字段 + 详情 JSONB。",
    example: `curl https://personal-os-zu9q.onrender.com/api/v1/universities/candidate-v2%3Astanford-university \\
  -H "Authorization: Bearer pk_xxx"`,
    response: `{
  "ok": true,
  "data": {
    "id": "candidate-v2:stanford-university",
    "name": "Stanford University",
    "chineseName": "斯坦福大学",
    "state": "CA",
    "nationalRanking": 3,
    "latitude": 37.4275,
    "longitude": -122.1697,
    "detail": { ... 详情 JSONB ... }
  }
}`,
  },
];

const SCOPES = [
  { id: "universities.read", desc: "读取学校列表与详情（默认）" },
  { id: "reports.write", desc: "生成 AI 解读报告（计划中）" },
  { id: "*", desc: "所有权限（仅供内部测试）" },
];

export default function AccountApiKeysPage() {
  return (
    <main className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:py-16">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">数据 API 文档</h1>
        <p className="mt-2 max-w-2xl text-base text-text-secondary">
          PathOS 数据 API（v1）面向留学机构、国际学校、教辅平台开放。基于学校基础字段 +
          IPEDS 评级详情，提供 JSON / 简单鉴权 + 速率限制。
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-border-soft bg-surface-1 p-5">
          <KeyRound size={20} className="text-cobalt" aria-hidden="true" />
          <h2 className="mt-3 text-base font-semibold text-text-primary">Bearer Token 鉴权</h2>
          <p className="mt-2 text-sm text-text-secondary">
            每个请求需要 <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">Authorization: Bearer pk_xxx</code> 或
            <code className="ml-1 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">X-Api-Key: pk_xxx</code>。
          </p>
        </article>
        <article className="rounded-2xl border border-border-soft bg-surface-1 p-5">
          <ShieldCheck size={20} className="text-cobalt" aria-hidden="true" />
          <h2 className="mt-3 text-base font-semibold text-text-primary">速率限制 + 配额</h2>
          <p className="mt-2 text-sm text-text-secondary">
            默认每分钟 60 次调用、每月 10000 次配额。超出后会返回 429 并附带
            <code className="ml-1 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">Retry-After</code> 头。
          </p>
        </article>
        <article className="rounded-2xl border border-border-soft bg-surface-1 p-5">
          <Webhook size={20} className="text-cobalt" aria-hidden="true" />
          <h2 className="mt-3 text-base font-semibold text-text-primary">Webhook + 实时变更</h2>
          <p className="mt-2 text-sm text-text-secondary">
            数据集更新（每两周一次）会通过 webhook 推送到企业用户；目前仅支持 Slack /
            飞书 / 邮件通知。
          </p>
        </article>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-text-primary">端点</h2>
        <div className="mt-4 space-y-4">
          {ENDPOINTS.map((endpoint) => (
            <article key={endpoint.path} className="rounded-3xl border border-border-soft bg-surface-1 p-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 items-center rounded-full bg-emerald-500/10 px-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  {endpoint.method}
                </span>
                <code className="font-mono text-sm text-text-primary">{endpoint.path}</code>
              </div>
              <p className="mt-3 text-sm text-text-secondary">{endpoint.desc}</p>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div className="rounded-2xl border border-border-soft bg-surface-2/70">
                  <div className="flex items-center gap-1.5 border-b border-border-soft bg-surface-2 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
                    <Code2 size={12} aria-hidden="true" /> 请求示例
                  </div>
                  <pre className="overflow-x-auto p-3 text-[12px] leading-relaxed text-text-primary"><code>{endpoint.example}</code></pre>
                </div>
                <div className="rounded-2xl border border-border-soft bg-surface-2/70">
                  <div className="flex items-center gap-1.5 border-b border-border-soft bg-surface-2 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
                    <Code2 size={12} aria-hidden="true" /> 响应示例
                  </div>
                  <pre className="overflow-x-auto p-3 text-[12px] leading-relaxed text-text-primary"><code>{endpoint.response}</code></pre>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-text-primary">权限（scope）</h2>
        <ul className="mt-3 space-y-2">
          {SCOPES.map((scope) => (
            <li key={scope.id} className="flex items-start gap-3 rounded-control border border-border-soft bg-surface-1 px-3 py-2 text-sm">
              <code className="shrink-0 font-mono text-[12px] text-cobalt">{scope.id}</code>
              <span className="text-text-secondary">{scope.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="mt-12 rounded-3xl border border-border-soft bg-surface-1 p-6">
        <h2 className="text-base font-semibold text-text-primary">申请 API Key</h2>
        <p className="mt-2 text-sm text-text-secondary">
          数据 API 方案默认包含 1 个生产 key + 1 个测试 key。如需申请，前往
          <Link href="/pricing" className="ml-1 underline decoration-text-tertiary underline-offset-2 hover:text-text-primary">/pricing</Link>
          选择「数据 API（企业）」方案，我们会在 3 个工作日内与您联系。
        </p>
      </aside>
    </main>
  );
}