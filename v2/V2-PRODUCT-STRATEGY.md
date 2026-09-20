# PathOS v2 PRODUCT STRATEGY（企业级 + 产品级完整规划）v2.1

> **核心目的**：完整的企业级 + 产品级规划文档，让 PathOS v2 不仅是一个 MVP，而是一个**可运营、可规模化、可商业化**的产品。
>
> **修订**：基于 v2.1 蓝图（功能模块 14 项 + 6 项骨架硬标准 + 12 项决策）扩展。

---

## 目录

- 第 1 章 战略层（4.1 使命 / 4.2 战略目标 / 4.3 商业模式 / 4.4 竞品定位 / 4.5 目标用户 / 4.6 价值主张）
- 第 2 章 产品层（用户旅程 / KPI 体系 / 信息架构 / MVP / 路线图 / A/B 测试）
- 第 3 章 技术层（系统架构 / 数据治理 / 安全合规 / 性能工程 / 监控运维）
- 第 4 章 运营层（内容运营 / 用户运营 / 数据运营）
- 第 5 章 风险管理（技术 / 产品 / 商业 / 政策）
- 第 6 章 团队与时间表（RACI / 20 周甘特图 / 关键里程碑）
- 第 7 章 财务模型（启动成本 / 收入预测 / Unit Economics / 盈亏平衡）
- 第 8 章 附录

---

## 第 1 章 战略层

### 1.1 使命与愿景

**使命（Mission）**：让中国留学家庭的每一个决策都基于可验证、可追溯、可对比的数据。

**愿景（Vision）**：成为中国留学家庭和学校的"信息基础设施"——所有留学相关信息的可信来源。

**核心价值观**：
- **可信**（Trust）：每个数据点都有 verified 来源
- **完整**（Complete）：不省略，不藏匿
- **诚实**（Honest）：missing 字段显示"暂无"而非 0
- **专业**（Professional）：专业版工具的体验
- **家庭优先**（Family-First）：以家庭真实需求为中心

### 1.2 战略目标（3 年）

| 阶段 | 时段 | 关键目标 |
|---|---|---|
| **V2 启动版** | 2026 Q4 | 5-10 所学校深度数据 + 学校端专业版上线 + 家庭端免费 |
| **V2.1 扩展** | 2027 H1 | 30 所学校 + 用户运营 + 内容渠道 |
| **V2.2 增收** | 2027 H2 | 100 所学校 + 学校端订阅达到 100 付费 + 家庭端高级订阅 |
| **V3 平台化** | 2028 | 200+ 所学校 + 数据 API + 顾问协作 + 多语言 |

**3 年关键 KPI 目标**：
- 5-10 所学校 → 200+ 所学校
- 0 用户 → 月活 5 万家庭 + 1000 学校端付费
- 0 收入 → 月收入 ¥100 万
- 0 内容 → 累计 1000+ 深度解读文章

### 1.3 商业模式

#### 1.3.1 双边平台

PathOS v2 服务两类用户：
- **C 端（家庭）**：免费 + 高阶订阅
- **B 端（学校 / 顾问）**：订阅制专业版

#### 1.3.2 收入模型

| 用户群 | 模型 | 价格 | 转化目标 |
|---|---|---|---|
| **家庭免费版** | 全功能免费（含基础学校数据） | ¥0 | 流量入口 |
| **家庭高级订阅** | 深度内容 + ROI 计算 + 报告下载 | ¥299-499/年 | 5% 转化 |
| **学校基础版** | 单所学校深度数据 + 工具 | ¥0（学校信息必须公开） | 数据可信 |
| **学校专业版** | 全部学校 + 时序可视化 + 数据导出 + API | ¥1,200-3,600/年（顾问） | 100 付费 |
| **机构版** | 10+ 顾问 + 多账号 + 协作 | ¥12,000-36,000/年 | 10 机构 |

#### 1.3.3 Unit Economics（目标值）

| 指标 | 学校端订阅 | 家庭端订阅 |
|---|---|---|
| ARPU | ¥2,400/年 | ¥399/年 |
| CAC | ¥800-1,200 | ¥80-150（SEO + 内容） |
| LTV | ¥7,200（3 年留存） | ¥600（1.5 年留存） |
| LTV/CAC | 6-9× | 4-6× |
| 月流失率 | 2-3% | 5-8% |
| 获客渠道 | 顾问协会 / 学校合作 / 内容 SEO | SEO / 公众号 / 小红书 |

#### 1.3.4 现金流目标（3 年）

| 阶段 | 月收入目标 | 现金流 |
|---|---|---|
| V2 启动版（Q4 2026） | ¥5,000-20,000（种子用户） | -¥60,000（净亏损） |
| V2.1 扩展（2027 H1） | ¥50,000-150,000 | -¥30,000/月 → 接近平衡 |
| V2.2 增收（2027 H2） | ¥300,000-800,000 | +¥100,000/月（盈利） |
| V3 平台化（2028） | ¥1,000,000+ | +¥300,000/月 |

### 1.4 竞品定位（4 象限图）

```
                    工具型
                      ↑
        选校帝 ●       |
                      |
        PathOS v2 ●    |  ● 启德 / 新东方
   家庭 <-----+-------+-------> 学校
        棕榈大道 ●    |  ● 启德考培
                      |
        美世留学 ●    |
                      |
                    内容型 ↓
```

**PathOS v2 定位**：**工具型 + 家庭端** 象限（与选校帝相邻，但不重叠）

**与各竞品的关系**：
| 竞品 | 关系 | 借鉴 |
|---|---|---|
| 启德 | 中性（信息源） | 字段结构、报告矩阵 |
| 新东方 | 中性（信息源） | ROI 计算、方案包 |
| 选校帝 | 邻近竞品（最强对手） | 专业分类、工具矩阵、案例库 |
| 百利天下 | 中性（信息源） | 单校专题模式 |
| 棕榈大道 | 互补（不同定位） | 导师制（v2.1 探索） |
| 新航道 | 互补（不同业务） | 无借鉴 |

### 1.5 目标用户画像

#### 1.5.1 家庭端（C 端）

**核心用户**：中国留学家庭的家长（40-55 岁）+ 学生（15-22 岁）

**画像 1：高三家长（决策者）**
- 姓名：王女士，48 岁，北京
- 孩子：高三在读，准备申请美本
- 痛点：看不懂英文官网、不知道学校改了什么、对比 5 所学校没精力
- 期望：5 分钟内搞清楚 3 所学校的差别
- 行为：每天 30-45 分钟浏览，晚上 9-11 点集中研究
- 决策周期：6-12 个月

**画像 2：本科申请学生（执行者）**
- 姓名：小李，17 岁，上海
- 状态：SAT 1500 / GPA 3.8，准备 ED/EA
- 痛点：不知道选校策略、看不到时序变化
- 期望：看到 SAT 1450 的人能进什么学校
- 行为：手机 + 电脑切换使用，每天 1-2 小时
- 决策周期：3-6 个月

**画像 3：转学 / 研究生家长**
- 姓名：张先生，52 岁，深圳
- 孩子：美本大二，想转学到更好的学校
- 痛点：研究生院数据分散、不完整
- 期望：专业级对比 + ROI 计算
- 行为：周末 2-3 小时集中研究
- 决策周期：3-9 个月

#### 1.5.2 学校端（B 端）

**画像 1：留学顾问（独立工作者）**
- 姓名：陈顾问，35 岁，北京
- 客户：每年 20-30 个家庭
- 痛点：手工查数据耗时、信息分散
- 期望：5 分钟生成对比报告
- 行为：上班时间用电脑，2-3 小时/天
- 付费意愿：¥100-200/月（顾问基础版）

**画像 2：国际学校升学指导（机构雇员）**
- 姓名：周老师，40 岁，深圳某国际学校
- 角色：负责 50-100 个学生的升学
- 痛点：批量管理学生档案、对比学校
- 期望：班级级别数据查看、批量报告
- 行为：办公时间，深度使用
- 付费意愿：¥1,200-3,600/年（学校机构版）

**画像 3：留学机构创始人（决策层）**
- 姓名：吴总，45 岁，上海
- 角色：5-20 人团队，专注美国方向
- 痛点：数据准确性、客户信任
- 期望：白标 / 品牌定制
- 行为：每月 review 几次
- 付费意愿：¥12,000-36,000/年（机构版）

### 1.6 价值主张

**家庭端**：
> **5 分钟，搞定一所学校的真实情况。** 不再被英文官网、不再被时差、不再被零散信息困扰。

**学校端**：
> **用 verified data 替代人工查表。** 让顾问 / 老师把时间花在咨询，而不是查资料。

---

## 第 2 章 产品层

### 2.1 用户旅程地图（User Journey Map）

#### 2.1.1 家庭端核心旅程

```
认知 → 兴趣 → 评估 → 试用 → 留存 → 推荐

阶段 1: 认知（Awareness）
- 用户搜索"美国大学排名 2026"、"哈佛怎么样"
- 看到 PathOS 公众号 / SEO 文章
- 点击进入 PathOS 网站

阶段 2: 兴趣（Interest）
- 浏览首页 → 看到"88 所 verified 数据"
- 进入学校详情页 → 看到数据出处 / 新鲜度
- 比较 2-3 所学校

阶段 3: 评估（Evaluation）
- 查时序数据（SAT / 录取率 / 学费 5 年变化）
- 看专业对比（CS / 工程）
- 看新专业（人类学、SAT 政策）

阶段 4: 试用（Trial）
- 注册免费账户
- 收藏学校到清单
- 保存对比结果
- 下载学校 PDF 报告

阶段 5: 留存（Engagement）
- 每周看时序解读文章
- 定期查看学校变化
- 接收学校动态推送

阶段 6: 推荐（Referral）
- 分享学校对比卡到朋友圈
- 推荐 PathOS 给其他家长
- 写小红书 / 知乎推荐
```

**每个阶段的关键动作 + 触点 + 痛点**：

| 阶段 | 动作 | 触点 | 痛点 | PathOS v2 解决方案 |
|---|---|---|---|---|
| 认知 | 搜索 | 百度 / 微信 | 信息分散 | SEO + 公众号 |
| 兴趣 | 浏览 | 学校页 | 数据不可信 | verified + 30+ 字段 |
| 评估 | 对比 | 时序图 | 没有时序 | B3 时序可视化 |
| 试用 | 注册 | 邮箱 | 复杂表单 | 极简注册 |
| 留存 | 订阅 | 邮件 / 公众号 | 没新内容 | 每周 1 篇时序解读 |
| 推荐 | 分享 | 朋友圈 | 没好看的卡片 | 对比分享卡 |

#### 2.1.2 学校端核心旅程

```
认知 → 试用 → 付费 → 续费 → 推荐

阶段 1: 认知
- 顾问协会推荐 / 同业口碑 / 内容 SEO

阶段 2: 试用
- 注册免费版
- 查看 5-10 所学校深度数据
- 试用工具（智能选校 / 时序 / 对比）

阶段 3: 付费
- 试用 14 天
- 觉得数据可信 + 节省时间
- 订阅专业版（¥100-200/月 或 ¥1,200-3,600/年）

阶段 4: 续费
- 第 12 个月续费
- 介绍给同事（推荐奖励）

阶段 5: 推荐
- 在顾问群里推荐
- 写评测文章
- 邀请同行加入（机构版）
```

### 2.2 核心 KPI 体系

#### 2.2.1 业务层 KPI（北极星）

**家庭端北极星**：**每周 verified 学校页浏览数**（体现"信息集合"价值）
**学校端北极星**：**每周 verified 数据查询次数**（体现"专业版工具"价值）

#### 2.2.2 增长 KPI（AARRR）

| 阶段 | KPI | 目标（V2 启动版 6 个月内） |
|---|---|---|
| Acquisition | 月新增访客 | 5,000 |
| Activation | 注册转化率 | 8%（每周浏览 ≥ 2 校） |
| Retention | 次月留存 | 25% |
| Revenue | 付费转化率 | 1%（家庭） / 5%（学校） |
| Referral | 推荐率 | 10%（分享学校对比） |

#### 2.2.3 内容质量 KPI

| 指标 | 目标 | 说明 |
|---|---|---|
| 数据覆盖率 | 100% | 所有展示字段都有 verified 标签 |
| 数据新鲜度 | 70% | 70% 字段 < 30 天更新 |
| 内容产出 | 12 篇/月 | 时序解读 + 学校深度文章 |
| 用户反馈 | NPS ≥ 40 | 月度 NPS 调研 |

#### 2.2.4 工程 KPI

| 指标 | 目标 |
|---|---|
| 性能 | LCP < 2.5s, INP < 200ms, CLS < 0.1 |
| 可用性 | 月 uptime ≥ 99.5% |
| 数据质量 | ETL 失败率 < 1% |
| 错误率 | 月错误率 < 0.5% |
| 部署频率 | 每周 1-2 次 |

### 2.3 信息架构（IA）

```
PathOS 域名
├── /                          首页（自动按角色跳转）
├── /s/*                       学校端（用户切换角色）
│   ├── /s/home                学校端首页
│   ├── /s/map                 留学地图（v1 升级）
│   ├── /s/[slug]              学校详情页
│   ├── /s/compare             学校对比工具
│   ├── /s/timeseries          时序可视化（B3）
│   ├── /s/majors              专业对比列表（B2）
│   ├── /s/major/[id]          专业详情页
│   ├── /s/radar               新专业雷达（S3）
│   ├── /s/calculator          工具首页
│   │   ├── /s/calculator/gpa  GPA 计算器
│   │   └── /s/calculator/roi  ROI 计算器
│   ├── /s/cases               案例库
│   └── /s/topic/[school-slug]/[article-slug]  单校专题
├── /f/*                       家庭端
│   ├── /f/home                家庭端首页（叙事型）
│   ├── /f/school/[slug]       学校故事
│   ├── /f/major/[id]          专业解读
│   ├── /f/policy              政策解读
│   ├── /f/case/[id]           案例
│   ├── /f/calculator/roi       ROI 计算（家庭版）
│   └── /f/about               关于 PathOS
├── /auth/*                    认证
│   ├── /auth/login            登录
│   ├── /auth/register         注册
│   └── /auth/logout           登出
├── /account/*                 账户
│   ├── /account/profile       个人资料
│   ├── /account/subscription  订阅管理
│   ├── /account/saved         收藏列表
│   └── /account/api-keys      API 密钥（B 端）
├── /admin/*                   后台（仅管理员）
│   ├── /admin/schools         学校管理
│   ├── /admin/data            数据管理
│   ├── /admin/subscriptions   订阅管理
│   └── /admin/analytics       分析
└── /api/*                     API
    ├── /api/pathos/preview    数据查询
    ├── /api/subscriptions     订阅 API
    ├── /api/cases             案例 API
    └── /api/policy-events     政策事件 API
```

### 2.4 MVP 功能（v2.1 启动版 = 14 项核心）

参考 V2-BLUEPRINT.md §2。

### 2.5 路线图（V2 → V3）

| 阶段 | 时段 | 核心目标 | 关键里程碑 |
|---|---|---|---|
| **V2 启动版** | 2026 Q4 | 14 项核心 + 5-10 校 | 6 项骨架达标 + 5-10 校上线 |
| **V2.1 内容扩展** | 2027 Q1 | 30 所学校 + 时序 12 篇 | 月活 1 万 |
| **V2.2 商业化** | 2027 Q2 | 学校端付费 100 + 家庭订阅 50 | 月收入 ¥5 万 |
| **V2.3 数据 API** | 2027 Q3 | 第三方数据 API 上线 | 5 个外部调用方 |
| **V2.4 多语言** | 2027 Q4 | 英文版上线 | 10% 国际用户 |
| **V3 平台化** | 2028 H1 | 200+ 校 + 顾问协作 | 月收入 ¥100 万 |

### 2.6 A/B 测试框架

#### 2.6.1 测试基础设施

- **工具**：PostHog（开源）+ 自建（如果预算有限）
- **部署**：A/B 测试 SDK 注入到所有页面
- **样本量计算**：最小可检测效应 5%，α=0.05，power=0.8 → 每组 3,000+
- **测试周期**：每个测试 2-4 周

#### 2.6.2 v2 启动版必测假设

| # | 假设 | 变体 A | 变体 B | 主要指标 |
|---|---|---|---|---|
| 1 | 首页 CTA 影响注册 | "探索地图" | "查找学校" | 注册率 |
| 2 | 学校详情页 verified 标签影响信任 | 显示 | 不显示 | 跳出率 |
| 3 | 时序图影响停留时长 | 折线图 | 表格 | 平均停留 |
| 4 | 对比卡影响分享 | 图片卡片 | 纯文本 | 分享次数 |
| 5 | 订阅页定价影响转化 | ¥299/年 | ¥499/年 | 付费率 |
| 6 | 时序解读文章影响 SEO | 长文（2000 字） | 短文（500 字） | 自然流量 |

---

## 第 3 章 技术层

### 3.1 系统架构

#### 3.1.1 总体架构

```
┌─────────────────────────────────────────────────────────────┐
│                         用户层                                 │
│  Web (Chrome / Safari / Firefox) / Mobile (Safari / Chrome)   │
│  PWA（v2.1 引入，渐进式 Web App）                              │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTPS / CDN
┌─────────────────────────────────────────────────────────────┐
│                      CDN + Edge (Cloudflare)                  │
│  静态资源缓存 / 全球加速 / DDoS 防护 / SSL                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14 (前端 + BFF)                     │
│  /src/app/* (页面) / /src/server/* (BFF) / /src/components/* │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       数据层（多源）                            │
│  v1 IECG + US News + IPEDS + College Scorecard + 学校官网     │
│  + 选校帝（公开数据）                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓ ETL
┌─────────────────────────────────────────────────────────────┐
│            PathOS-db-ranking-standalone (Python)               │
│  Schema validation / Provenance tracking / ETL 调度            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       存储层                                    │
│  PostgreSQL（结构化数据） + S3（图片 / 报告）+ Redis（缓存）   │
└─────────────────────────────────────────────────────────────┘
```

#### 3.1.2 部署架构

```
生产环境：
- Vercel（Next.js 前端 + BFF） - $20/月
- Railway / Render（Python ETL 后端）- $25/月
- Supabase（PostgreSQL + Auth）- $25/月
- Cloudflare R2（S3 兼容，图片存储）- $5/月
- Upstash Redis（缓存）- $10/月
- Sentry（错误监控）- $26/月
- PostHog Cloud（用户分析 + A/B 测试）- 免费层
- 域名 - $10/年

开发环境：
- 本地 Docker Compose
- v2 启动期最小化部署
```

#### 3.1.3 监控 / 日志 / 告警

| 监控项 | 工具 | 告警阈值 |
|---|---|---|
| 应用错误 | Sentry | 错误率 > 1% |
| 性能 | Vercel Analytics | LCP > 3s |
| 正常运行时间 | BetterStack | 下线 > 1 分钟 |
| 数据 ETL | 自建 cron + Sentry | 失败 > 10% |
| 支付 | Stripe Dashboard | 退款率 > 5% |
| 用户反馈 | Sentry + 客服 | 投诉 > 3/天 |

### 3.2 数据治理

#### 3.2.1 数据生命周期

```
采集 → 校验 → 存储 → 处理 → 展示 → 更新 → 归档
```

| 阶段 | 工具 / 流程 |
|---|---|
| 采集 | v1 ETL + 第三方 API + 半自动爬虫 |
| 校验 | zod schema（前端）+ JSON Schema（后端）|
| 存储 | PostgreSQL + S3（按 verified status 分类） |
| 处理 | ETL 调度（每日 / 每周 / 每月） |
| 展示 | Next.js SSR + 缓存 |
| 更新 | IPEDS 每年 10 月 / US News 9 月 / 学校官网每周扫描 |
| 归档 | 1 年后归档到冷存储（S3 Glacier） |

#### 3.2.2 数据质量保证

**每条数据必须有**：
1. 来源（source: 'IECG' / 'IPEDS' / 'US News' / '学校官网' / '编辑部'）
2. 采集时间（asOf: ISO 8601 时间戳）
3. 验证人（verifiedBy: 编辑姓名或自动校验）
4. 置信度（confidence: 0-100）
5. 备注（notes: array of strings）

**校验规则**：
- zod schema 严格校验
- 单位换算（USD ↔ RMB）必须标注汇率
- 字段缺失 → 显示"暂无"，绝不显示 0
- 数据冲突（多源） → 显示调和规则

#### 3.2.3 隐私 / 合规

**国内合规**：
- 《个人信息保护法》（PIPL）：用户数据收集须明确告知
- 《数据安全法》：数据分级保护
- 《网络安全法》：用户实名认证

**PathOS v2 合规要求**：
1. 用户注册须明确告知数据用途（隐私政策）
2. 用户数据加密存储（AES-256）
3. 用户可导出 / 删除自己的数据
4. 第三方追踪（Analytics）须征得同意
5. 未成年用户（15-22 岁）须监护人同意

**GDPR（如未来做国际版）**：
- 数据处理须明确同意
- Cookie 须 opt-in
- 数据可移植（export）
- 被遗忘权（delete）

### 3.3 性能工程

#### 3.3.1 性能预算

| 页面 | LCP | INP | CLS | 总 JS |
|---|---|---|---|---|
| 首页 | < 2s | < 200ms | < 0.1 | < 100KB gzip |
| 学校详情页 | < 2.5s | < 200ms | < 0.1 | < 150KB gzip |
| 时序图 | < 3s | < 200ms | < 0.1 | < 200KB gzip |
| 专业对比 | < 3s | < 200ms | < 0.1 | < 200KB gzip |

#### 3.3.2 优化策略

| 策略 | 应用 |
|---|---|
| Next.js Image | 所有图片 |
| 字体子集化 | 中文 + 拉丁文子集 |
| 代码分割 | 按路由 + 按组件 |
| 服务端渲染 | 所有公共页面 |
| 静态生成 | 学校列表页 |
| 缓存 | Redis（5 分钟）+ CDN（1 天） |
| 预加载 | 关键路由 |
| Web Vitals 监控 | Vercel Analytics |

#### 3.3.3 数据库性能

- 索引：学校 slug / IPEDS unitid / College Scorecard unitid
- 慢查询监控：> 100ms 警告
- 连接池：max 20
- 读写分离：读副本（未来）

### 3.4 监控运维

#### 3.4.1 SLO（Service Level Objectives）

| 指标 | 目标 |
|---|---|
| 可用性 | 99.5%（月 downtime < 3.6 小时） |
| 错误率 | < 0.5%（HTTP 5xx / 总请求） |
| 响应时间 | P95 < 500ms |
| 数据新鲜度 | 80% 字段 < 30 天 |

#### 3.4.2 灾备

- **数据库备份**：每日自动备份（Supabase 自带）
- **代码备份**：Git（GitHub / 自建 GitLab）
- **数据导出**：每周手动导出 S3
- **灾备演练**：每季度一次

### 3.5 安全

#### 3.5.1 应用安全

- HTTPS only（强制）
- CSP（Content Security Policy）
- XSS 防护（React 默认）
- CSRF 防护（SameSite cookie）
- SQL 注入防护（参数化查询 / ORM）
- 速率限制（Vercel Edge Function）

#### 3.5.2 数据安全

- 静态数据加密（AES-256）
- 传输加密（HTTPS / TLS 1.3）
- 密钥管理（Vercel / Supabase Secrets）
- 用户密码（bcrypt，never log）

#### 3.5.3 合规检查清单

- [ ] 隐私政策发布
- [ ] Cookie 同意横幅
- [ ] 用户数据导出 / 删除功能
- [ ] 未成年用户保护
- [ ] GDPR（如未来国际版）
- [ ] 数据处理协议（DPA）
- [ ] 第三方供应商安全审查




## 第 4 章 运营层

### 4.1 内容运营

#### 4.1.1 内容矩阵

| 内容类型 | 频率 | 生产者 | 渠道 |
|---|---|---|---|
| 学校深度文章 | 5-10 篇/月 | 主编 + 编辑 + AI 起草 | 网站 / 公众号 / 小红书 |
| 时序解读文章 | 4 篇/月 | 编辑 + AI | 网站 / 公众号 |
| 政策解读 | 2 篇/月 | 主编 + 编辑 | 公众号 / 知乎 |
| 学校动态（雷达事件） | 2-5 篇/月 | 编辑 | 网站 / 推送 |
| 用户案例 | 4 篇/月 | UGC + 编辑 | 小红书 / 知乎 |
| 数据报告（季度） | 1 份/季 | 主编 | PDF 下载 / 邮件 |

#### 4.1.2 内容质量标准

- **数据准确性**：100% 字段有 verified 标签
- **写作质量**：编辑改写 ≥ 70%（不是直接 AI 生成）
- **可读性**：Flesch 阅读难度 60-70（高中水平可读）
- **SEO**：关键词布局（标题 / 首段 / H2 / Meta）
- **可分享性**：每篇都有可分享的 OG image

#### 4.1.3 内容生产工作流

```
选题（主编）
    ↓
AI 起草（DeepSeek）→ 500 字初稿
    ↓
编辑改写（编辑）→ 优化到 ≥ 70% 改写率
    ↓
主编审稿（主编）→ 校对 + verified 标签 + 配图
    ↓
发布（编辑）→ CMS + 自动分发（公众号同步）
    ↓
追踪（数据运营）→ 阅读 / 分享 / 评论
```

#### 4.1.4 SEO 策略

**目标关键词**：
- 院校名 + "怎么样"（例：哈佛大学怎么样）
- 院校名 + "申请要求"（例：MIT 申请要求）
- 院校名 + "录取率"（例：斯坦福录取率）
- 院校名 + "学费"（例：耶鲁学费）
- 专业名 + "院校"（例：CS 强校）
- "美国留学" + "2026"（时效性）

**SEO 工具**：
- Google Search Console（国际版）
- 百度站长工具（中文）
- Ahrefs / 5118（关键词研究）
- Screaming Frog（技术 SEO）

#### 4.1.5 多渠道分发

| 渠道 | 内容形式 | 频率 | KPI |
|---|---|---|---|
| PathOS 网站 | 完整文章 | 每周 3-5 篇 | 浏览 / 停留 |
| 微信公众号 | 摘要 + 链接 | 每周 2-3 篇 | 阅读 / 转发 |
| 小红书 | 图表 + 简短评论 | 每周 1-2 篇 | 收藏 / 点赞 |
| 知乎 | 长文回答 | 每周 1 篇 | 赞同 / 评论 |
| B 站 | 视频解读（v3） | 每月 1-2 个 | 播放 / 三连 |

### 4.2 用户运营

#### 4.2.1 用户获取渠道

| 渠道 | 类型 | 成本 | 预期获客 |
|---|---|---|---|
| SEO / 内容 | 自然 | 低（内容成本） | 月 +3,000 访客 |
| 公众号 | 内容 | 低 | 月 +500 关注 |
| 小红书 | KOC | 中（投放 ¥1-3/click） | 月 +200 注册 |
| 微信群 | 私域 | 低 | 月 +100 注册 |
| 知乎 | 内容 | 低 | 月 +100 注册 |
| B 端合作 | BD | 中 | 月 +10 顾问 |

#### 4.2.2 激活（Aha Moment）

**家庭端 Aha Moment**：首次看到"5 所学校时序对比图"
- 注册后 7 天内查看 3 所学校 = 已激活
- 注册后 7 天内保存学校 = 深度激活

**学校端 Aha Moment**：首次生成"学校对比报告"
- 注册后 14 天内使用对比工具 = 已激活
- 注册后 14 天内保存报告 = 深度激活

#### 4.2.3 留存策略

| 策略 | 频次 | 内容 |
|---|---|---|
| 周报邮件 | 每周一 | 上周新内容 + 5-10 所学校排名变化 |
| 学校动态推送 | 实时 | 用户收藏学校的重大变化 |
| 月度报告 | 每月初 | 时序数据月报 + 政策变化 |
| 季度报告 | 每季初 | 行业趋势报告 + 政策解读 |

#### 4.2.4 CRM 工具

- **家庭端**：邮件（Resend）+ 公众号（微信生态）
- **学校端**：邮件 + 站内通知 + Slack 集成（机构版）
- **管理后台**：自建 admin / Vercel Postgres Studio

#### 4.2.5 推荐机制

| 推荐场景 | 奖励 | 限制 |
|---|---|---|
| 学校分享给家长 | （间接） | 通过对比卡传播 |
| 家庭推荐家庭 | 双方各 1 个月高级订阅 | 月上限 10 次 |
| 顾问推荐顾问 | 双方各 1 个月免费 | 月上限 5 次 |
| 机构推荐机构 | ¥500 现金奖励 | 季度上限 |

### 4.3 数据运营

#### 4.3.1 埋点设计

**事件分类**：
- 页面浏览（page_view）
- 交互（click / scroll / hover）
- 转化（sign_up / subscribe / share）
- 工具使用（compare_used / timeseries_viewed）
- 内容消费（article_read / video_played）

**埋点工具**：PostHog（自托管 / 云端）
**采样率**：100%（v2 启动期权衡隐私与数据完整性）
**保留期**：2 年（业务分析）

#### 4.3.2 关键分析指标

| 指标 | 定义 | 目标 |
|---|---|---|
| DAU / MAU | 日活 / 月活 | 30% |
| 平均会话时长 | session / visit | > 3 分钟 |
| 跳出率 | 单页会话 / 总会话 | < 60% |
| 转化率 | 转化 / 访客 | 1% |
| NPS | 推荐意愿 | ≥ 40 |

#### 4.3.3 A/B 测试框架

（详见 §2.6）

#### 4.3.4 业务智能

- **周报**：关键指标看板（GA / PostHog + 自建 dashboard）
- **月报**：业务回顾 + 用户增长 + 内容效果 + 财务
- **季报**：战略评估 + 路线图调整
- **年报**：全盘战略复盘

---

## 第 5 章 风险管理

### 5.1 风险矩阵

| # | 风险类别 | 风险描述 | 概率 | 影响 | 风险等级 |
|---|---|---|---|---|---|
| R1 | 技术 | v1 数据迁移失败（124 detail JSON） | 中 | 高 | **高** |
| R2 | 技术 | IPEDS / Scorecard API 变更 | 低 | 中 | 中 |
| R3 | 技术 | 学校官网爬虫被 ban | 中 | 低 | 低 |
| R4 | 技术 | 数据冲突（多源）未调和 | 高 | 中 | **高** |
| R5 | 数据 | 时序数据缺失（v1 904 records 之外） | 高 | 高 | **高** |
| R6 | 产品 | 用户不接受 verified 数据理念 | 中 | 高 | **高** |
| R7 | 产品 | 竞品（启德 / 选校帝）跟进差异化 | 高 | 中 | **高** |
| R8 | 商业 | 编辑招聘失败（找不到合适的兼职） | 中 | 高 | **高** |
| R9 | 商业 | 学校端订阅转化率 < 1% | 中 | 高 | **高** |
| R10 | 商业 | 现金流断裂（资金不足） | 中 | 高 | 中 |
| R11 | 政策 | 个保法 / 数据法变化 | 低 | 中 | 低 |
| R12 | 政策 | 留学政策变化（标化 / 签证） | 中 | 中 | 中 |
| R13 | 团队 | 关键人员离职（你 / 编辑） | 中 | **极高** | **高** |
| R14 | 运营 | 内容质量下降（编辑离职） | 中 | 高 | 中 |
| R15 | 合规 | 未成年用户数据合规问题 | 低 | 高 | 中 |

### 5.2 风险缓解策略

#### R1-R5（技术 / 数据风险）

- R1（数据迁移）：Week 1 验证，使用 git show 命令而不是 git checkout
- R2（API 变更）：抽象数据适配层（adapter pattern），API 变更只需更新适配层
- R3（爬虫 ban）：A6 半自动方案（RSS / 编辑触发），不依赖高频爬虫
- R4（数据冲突）：跨源调和（模块 #14c），明确标注差异
- R5（时序缺失）：Week 1-4 接入 IPEDS（9 年时序）+ College Scorecard

#### R6-R10（产品 / 商业风险）

- R6（用户接受）：MVP 验证（A/B 测试 §2.6）
- R7（竞品跟进）：深耕数据深度（专业级 50+ 字段 + verified），竞品难复制
- R8（编辑招聘）：Week 1-2 启动招聘，多渠道（豆瓣 / 知乎 / 公众号），准备 Plan B（外包）
- R9（订阅转化）：M3 之前免费 + 试用 30 天，降低决策门槛
- R10（现金流）：3-6 个月运营预算（¥60,000-90,000），控制成本

#### R11-R15（政策 / 合规风险）

- R11（数据法）：合规检查（§3.2.3）
- R12（留学政策）：内容团队持续跟踪
- R13（关键人员）：知识文档化（V2-EXEC-SPEC.md + V2-PRODUCT-STRATEGY.md）+ 备份编辑
- R14（内容质量）：主编审稿 + 4-eye 检查
- R15（未成年合规）：明确告知 + 监护人同意

### 5.3 应急响应

| 场景 | 响应时间 | 负责人 |
|---|---|---|
| 网站下线 | < 30 分钟 | 全栈工程师 |
| 数据损坏 | < 4 小时 | 数据工程师 |
| 安全漏洞 | < 1 小时 | 全栈工程师 + 主编 |
| 内容事故 | < 12 小时 | 主编 + 编辑 |
| 支付问题 | < 24 小时 | 主编 + 客服 |

---

## 第 6 章 团队与时间表

### 6.1 角色与 RACI

#### 6.1.1 v2 启动期最小团队

| 角色 | 人数 | 投入时间 | 职责 |
|---|---|---|---|
| **主编 / 产品负责人** | 1（你） | 8-10 h/周 | 选题 / 审稿 / 排期 / 数据决策 / 商业决策 |
| **兼职编辑** | 1 | 20-30 h/周 | 写作 / 改写 / 配图 / 学校官网扫描 |
| **全栈工程师** | 1（你 + 外包） | 按需 | 前端 / BFF / 数据库 / ETL |
| **数据工程师** | 1（兼职） | 10 h/周 | IPEDS / Scorecard 接入 / ETL 维护 |

#### 6.1.2 RACI 矩阵

| 任务 | 主编 | 编辑 | 全栈 | 数据 |
|---|---|---|---|---|
| 选题 | **R/A** | C | I | I |
| AI 起草 | I | C | **R** | I |
| 编辑改写 | A | **R** | I | I |
| 主编审稿 | **R/A** | C | I | I |
| 数据采集 | A | C | I | **R** |
| ETL 开发 | C | I | **R** | **R** |
| UI 开发 | A | I | **R** | I |
| 测试 | A | C | **R** | C |
| 发布 | A | **R** | C | I |
| 数据校验 | A | C | C | **R** |

R = Responsible, A = Accountable, C = Consulted, I = Informed

### 6.2 20 周详细甘特图

#### Week 1-2：骨架启动 + 数据补齐

| 任务 | Week 1 | Week 2 |
|---|---|---|
| 验证 v1 数据（97 所 + 904 records） | ✓ | |
| 启动 v2 分支（已做） | ✓ | |
| 创建蓝图文件（已做） | ✓ | |
| A5 第三方接入（IPEDS） | ✓ | ✓ |
| A5 第三方接入（College Scorecard） | | ✓ |
| 数据 schema 定义（zod） | ✓ | ✓ |
| 招聘兼职编辑 | ✓ | ✓ |

#### Week 3-4：UI 设计系统 + 数据采集

| 任务 | Week 3 | Week 4 |
|---|---|---|
| v1 资产复用（ProvenanceBadge / UniversityProfilePanel） | ✓ | |
| Tailwind config + CSS vars | ✓ | |
| Design tokens 实现 | ✓ | |
| 设计 tokens 文档化 | ✓ | |
| A1 学校字段补齐（30+ 字段） | ✓ | ✓ |
| 编辑招聘完成 + 工作流定稿 | | ✓ |
| 启动 5-10 所学校内容规划 | | ✓ |

#### Week 5-6：核心组件开发

| 任务 | Week 5 | Week 6 |
|---|---|---|
| B1 学校深度页（SchoolDetailView） | ✓ | ✓ |
| DataProvenanceCard / DataStalenessIndicator | ✓ | |
| SchoolHeader / RankingCard | | ✓ |
| FinancialTable / RequirementTable | | ✓ |
| MajorStrengthsGrid / HistoryTimeline | | ✓ |

#### Week 7-8：核心组件完成 + 骨架验收

| 任务 | Week 7 | Week 8 |
|---|---|---|
| TimeSeriesChart (B3) + MajorTimeSeries | ✓ | |
| SchoolComparisonTable (B2 跨校对比) | ✓ | |
| GPACalculator + ROICalculator | | ✓ |
| NotableAlumniGrid / FacilityGrid | | ✓ |
| PWA 配置（manifest + service worker） | | ✓ |
| **M1 骨架完成验收** | | ✓ |

#### Week 9-12：内容生产 + S3 雷达

| 任务 | Week 9 | Week 10 | Week 11 | Week 12 |
|---|---|---|---|---|
| B1 学校深度 5-10 所 × 5 篇 | ✓ | ✓ | ✓ | ✓ |
| S3 新专业雷达（事件库 + 编辑工作流） | ✓ | ✓ | ✓ | ✓ |
| A2 专业级数据采集 | ✓ | ✓ | | |
| B3 时序解读 4 篇 | | ✓ | | ✓ |
| A6 半自动爬虫 + AI 起草 | | ✓ | ✓ | |
| **M2 中期验证** | | | | ✓ |

#### Week 13-16：内容扩展 + 商业化准备

| 任务 | Week 13 | Week 14 | Week 15 | Week 16 |
|---|---|---|---|---|
| B1 全部 5-10 校完成 | ✓ | ✓ | | |
| B2 专业对比 8-12 个 | ✓ | ✓ | ✓ | |
| B3 时序解读 8 篇 | ✓ | | ✓ | |
| 学校端订阅页 + 付费流程 | | ✓ | ✓ | ✓ |
| 家庭端高级订阅页 + 付费流程 | | ✓ | ✓ | ✓ |
| Stripe 接入 | | | ✓ | ✓ |

#### Week 17-20：完整商业化 + 启动版完成

| 任务 | Week 17 | Week 18 | Week 19 | Week 20 |
|---|---|---|---|---|
| 学校端试用（5-10 顾问） | ✓ | ✓ | | |
| 家庭端高级订阅上线 | ✓ | ✓ | | |
| 内容运营上线（公众号 / 小红书） | ✓ | | ✓ | |
| SEO 优化 | | ✓ | ✓ | ✓ |
| A/B 测试（5 个假设） | ✓ | ✓ | ✓ | ✓ |
| NPS 调研 | | | ✓ | |
| **M3 启动版完成验收** | | | | ✓ |

### 6.3 关键里程碑 + 验收标准

| 里程碑 | Week | 完成标准 | 验收 |
|---|---|---|---|
| **M1 骨架完成** | 8 | V2-SCAFFOLD-CHECKLIST.md 6 项硬标准全达 | 主编 + 全栈签字 |
| **M2 中期验证** | 14 | 5 所学校的 B1 + B3 内容齐全 + 2 个专业 B2 | 主编审稿 + 用户试用 |
| **M3 启动版完成** | 20 | V2-VERIFY.md 必达项全过 | 主编 + 全栈 + 财务签字 |

### 6.4 团队扩展（v2.1 → v2.2）

| 时段 | 新增角色 | 人数 | 职责 |
|---|---|---|---|
| V2.1（2027 Q1） | 全职编辑 | 1 | 内容生产 |
| V2.1（2027 Q1） | 内容运营 | 0.5 | 多渠道分发 |
| V2.2（2027 Q2） | B 端 BD | 1 | 学校端销售 |
| V2.2（2027 Q2） | 客服 | 0.5 | 学校端支持 |
| V2.3（2027 Q3） | 数据工程师 | 1 | 数据 API + ETL |

---

## 第 7 章 财务模型

### 7.1 启动成本（V2 启动版 20 周）

| 项目 | 金额 | 备注 |
|---|---|---|
| 兼职编辑 | ¥40,000-60,000 | 20 周 × ¥2,000-3,000/周 |
| AI 起草 API | ¥10,000-20,000 | DeepSeek / GPT |
| 服务器 / 部署 | ¥5,000-10,000 | Vercel + Render + Cloudflare |
| 域名 + SSL | ¥50 | ¥10/年 + ¥40/年 SSL |
| 监控 + 错误追踪 | ¥0-500 | Sentry 免费层 |
| 数据 API | ¥0 | IPEDS / College Scorecard 免费 |
| Strip 支付（按交易费） | ¥0 | 2.9% + ¥2/笔 |
| 数据采集工具 | ¥0-1,000 | SingleFile / Save Page |
| **启动总成本** | **¥55,000-91,000** | |
| 主编时间（你） | 不计费 | 8-10 h/周 |
| 全栈时间（你） | 不计费 | 按需 |

### 7.2 收入预测（保守 / 中性 / 乐观）

#### 7.2.1 V2 启动期（Week 1-20）

| 月份 | 家庭免费 | 家庭付费 | 学校免费 | 学校付费 | 月收入 |
|---|---|---|---|---|---|
| Month 1-3 | 0 | 0 | 5 | 0 | ¥0 |
| Month 4 | 50 | 1 | 10 | 2 | ¥200 |
| Month 5 | 200 | 5 | 20 | 5 | ¥1,500 |

#### 7.2.2 V2.1（2027 H1）

| 月份 | 家庭免费 | 家庭付费 | 学校免费 | 学校付费 | 月收入 |
|---|---|---|---|---|---|
| Month 6 | 500 | 10 | 50 | 20 | ¥5,000 |
| Month 7-9 | 1,000 | 25 | 100 | 50 | ¥15,000 |
| Month 10-12 | 2,000 | 60 | 200 | 100 | ¥40,000 |

#### 7.2.3 V2.2（2027 H2）

| 月份 | 家庭免费 | 家庭付费 | 学校免费 | 学校付费 | 月收入 |
|---|---|---|---|---|---|
| Month 13-15 | 3,000 | 100 | 400 | 200 | ¥80,000 |
| Month 16-18 | 5,000 | 200 | 800 | 500 | ¥200,000 |

#### 7.2.4 V3（2028）

| 月份 | 家庭免费 | 家庭付费 | 学校免费 | 学校付费 | 月收入 |
|---|---|---|---|---|---|
| 2028 全年 | 10,000+ | 500+ | 2,000+ | 1,000+ | ¥500,000+ |

### 7.3 Unit Economics

#### 7.3.1 学校端订阅（¥2,400/年）

| 指标 | 值 |
|---|---|
| ARPU | ¥2,400/年 |
| 获客成本（CAC） | ¥800-1,200（顾问 BD） |
| 生命周期 | 3 年 |
| LTV | ¥7,200 |
| LTV/CAC | 6-9× |
| 月流失率 | 2-3% |
| 边际成本 | < ¥10/年（服务器 + 数据） |
| 毛利率 | > 95% |

#### 7.3.2 家庭端订阅（¥399/年）

| 指标 | 值 |
|---|---|
| ARPU | ¥399/年 |
| 获客成本（CAC） | ¥80-150（SEO + 内容） |
| 生命周期 | 1.5 年 |
| LTV | ¥600 |
| LTV/CAC | 4-6× |
| 月流失率 | 5-8% |
| 边际成本 | < ¥5/年 |
| 毛利率 | > 95% |

### 7.4 盈亏平衡分析

#### 7.4.1 月成本结构（V2 启动期）

| 项目 | 月成本 |
|---|---|
| 兼职编辑 | ¥2,000-3,000 |
| AI API | ¥500-1,000 |
| 服务器 | ¥200-400 |
| 其他 | ¥300-500 |
| **月固定成本** | **¥3,000-4,900** |

#### 7.4.2 盈亏平衡点

| 指标 | 学校端 | 家庭端 |
|---|---|---|
| 月成本 | ¥4,000 | ¥4,000 |
| ARPU | ¥200/月 | ¥33/月 |
| 盈亏平衡订阅数 | 20 | 121 |
| 达成时间 | V2.1 Month 6 | V2.1 Month 9 |

### 7.5 融资需求（可选）

| 时段 | 资金用途 | 金额 |
|---|---|---|
| V2 启动期（2026 Q4） | 启动成本 + 6 个月运营 | ¥150,000 |
| V2.1 扩展（2027 H1） | 团队 + 内容 + 营销 | ¥500,000 |
| V2.2 商业化（2027 H2） | B 端 BD + API 开发 | ¥1,000,000 |

**估值参考**（如融资）：
- V2.1 完成时（2027 H1）：¥10,000,000-20,000,000
- V2.3 完成时（2027 Q4）：¥50,000,000-100,000,000

---

## 第 8 章 附录

### 8.1 文档地图

```
v2/
├── V2-BLUEPRINT.md            # 14 项核心模块 + 6 项骨架标准
├── V2-EXEC-SPEC.md            # 每个模块的 9 维度规范
├── V2-OPEN-DECISIONS.md       # 12 项决策 + 推荐方案
├── V2-SCAFFOLD-CHECKLIST.md   # 骨架验收清单
├── V2-UI-SPEC.md              # UI 设计系统
├── V2-SKILLS.md               # 可用 Skills
├── V2-VERIFY.md               # AI 验收标准
├── V2-PRODUCT-STRATEGY.md     # 本文档（企业级战略）
├── plans/
│   └── 5-10-schools.md        # 5-10 所候选清单
└── competitor-research/       # 6 家竞品 47 个文件
```

### 8.2 关键决策树

#### 8.2.1 内容生产决策树

```
新学校?
├── 是 → 启动 B1 + 单校专题工作流
│         ↓
│     数据采集（v1 IECG + IPEDS + 学校官网）
│         ↓
│     AI 起草（500 字）
│         ↓
│     编辑改写（70%+ 改写率）
│         ↓
│     主编审稿
│         ↓
│     发布 + SEO + 公众号
└── 否 → 进入 B2/B3/S3 工作流
```

#### 8.2.2 B 端转化决策树

```
顾问注册
├── 试用 14 天
│   ├── 使用 ≥ 3 次对比工具 → 深度激活
│   │   └── 试用到期 → 推送订阅页（¥100/月）
│   │       ├── 订阅 → 升级到专业版（¥2,400/年）
│   │       └── 不订阅 → 续期试用 7 天
│   │           └── 推送机构版试用（¥12,000/年）
│   └── 使用 < 3 次 → 推送"3 个用例"邮件
│       └── 激活 → 进入深度试用路径
└── 未激活 → 7 天后推送"v2 启动版"特色
```

### 8.3 详细功能映射（v2 启动版）

| 模块 | 功能 | 借鉴源 | v2 创新 |
|---|---|---|---|
| #1 | v1 数据完整性验证 | v1 已完成 | 时序延伸 |
| #2 | A1 学校字段补齐 | 启德 + 选校帝 | 30+ 字段 verified |
| #3 | A2 专业级数据 | 选校帝 7 大类 | 跨校对比 |
| #4 | A5 第三方接入 | IPEDS / Scorecard | 半自动 + 人工审核 |
| #5 | A6 半自动爬虫 | RSS / Newsletter | AI 起草 |
| #6 | B1 学校深度页 | 启德 + v1 | verified + missing-first |
| #7 | B2 专业对比 | 选校帝 200+ 分类 | 跨校对比（0 竞品） |
| #8 | B3 时序可视化 | 用户原话 | 折线图（0 竞品） |
| #9 | S3 新专业雷达 | 用户原话 | 半自动（0 竞品） |
| #10 | 单校专题 | 百利天下 | 5 篇/校 |
| #11 | 案例库 | 选校帝 17,448 | 含 GPA / SAT / 文书 |
| #12 | GPA 计算器 | 选校帝 6 算法 | 完整 3 种算法 |
| #13 | ROI 计算器 | 新东方 | 修复 growthRate BUG |
| #14 | 4 项增量改进 | v1 + 用户需求 | 数据出处 / 新鲜度 / 跨源 / 分享 |

### 8.4 v2 启动版总览（一图看懂）

```
┌─────────────────────────────────────────────────────────────┐
│                      PathOS v2 启动版                        │
│              （信息集合与展示 + 专业版工具）                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  数据底座（5）                                                │
│  ├─ v1 数据（97 所 / 904 records）                            │
│  ├─ A1 学校字段（30+ verified）                              │
│  ├─ A2 专业级数据（50+ 专业）                                 │
│  ├─ A5 第三方（IPEDS / Scorecard / US News）                  │
│  └─ A6 半自动爬虫（RSS + AI）                                │
│                                                              │
│  核心功能（5）                                                │
│  ├─ B1 学校深度页（verified + missing-first）                │
│  ├─ B2 专业对比（0 竞品）                                    │
│  ├─ B3 时序可视化（0 竞品）                                  │
│  ├─ S3 新专业雷达（0 竞品）                                  │
│  └─ 单校专题（5-10 校 × 5 篇）                               │
│                                                              │
│  借鉴模块（3）                                                │
│  ├─ 案例库（17,448 借鉴）                                    │
│  ├─ GPA 计算器（3 算法）                                     │
│  └─ ROI 计算器                                                │
│                                                              │
│  增量改进（4）                                                │
│  ├─ 数据出处卡片                                              │
│  ├─ 数据新鲜度指示                                            │
│  ├─ 跨源数据调和                                              │
│  └─ 对比分享卡                                                │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  商业模式                                                     │
│  ├─ 家庭端：免费 + 高阶订阅（¥299-499/年）                   │
│  ├─ 学校端：基础版免费 + 专业版订阅（¥1,200-3,600/年）        │
│  └─ 机构端：多账号版（¥12,000-36,000/年）                    │
│                                                              │
│  时间表                                                       │
│  └─ Week 1-8 骨架 / Week 9-20 内容（20 周）                  │
│                                                              │
│  资源                                                         │
│  └─ 启动总成本 ¥55,000-91,000                                │
│                                                              │
│  风险                                                         │
│  └─ 15 项已识别风险 + 缓解策略（详见 §5）                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 8.5 联系与版本

- **文档版本**：v2.1
- **创建日期**：2026-09-20
- **负责人**：主编（你）
- **联系方式**：基于 v2 工作分支 `codex/v2-scaffold`

---

**附录**：
- v2 蓝图文件 8 份（V2-BLUEPRINT / EXEC-SPEC / OPEN-DECISIONS / SCAFFOLD-CHECKLIST / UI-SPEC / SKILLS / VERIFY / PRODUCT-STRATEGY）
- 竞品研究 47 个文件
- v1 资产 4 个（ProvenanceBadge / UniversityProfilePanel / frontend-fields.json / StatusDictionaryMap）
- v1 审计文档 2 个（PATHOS-DEEP-AUDIT-2026-09-17.md / PATHOS-DATA-FILL-GAPS.md）
- 20 周甘特图（详见 §6.2）

---

**总结**：本文档是 PathOS v2 启动版的**完整企业级 + 产品级规划**。任何团队成员 / 投资人 / AI 拿到本文档，都能完整理解 v2 的战略目标、商业模式、用户旅程、技术架构、运营体系、风险管理和 20 周执行计划。




---

## 第 9 章 补充深度细节

### 9.1 详细用户旅程地图（深度版）

#### 9.1.1 家庭端"高三家长"完整旅程（90 天）

```
Phase 1: 认知（Day 1-7）
Day 1: 在微信看到朋友转发的文章"2026 美本申请趋势"
  - 触发：朋友推荐 + 微信公众号
  - 痛点：信息分散、英文官网看不懂
  - 动作：点击文章 -> 进入 PathOS 网站
Day 2: 浏览首页，看到"88 所 verified 数据"
  - 关键视觉：verified 徽章、新鲜度指示、数据出处卡片
  - 决策点：是否信任这个网站？
  - 信号：看到 IECG / IPEDS 来源 -> 信任建立
Day 3: 收到欢迎邮件 + 3 篇推荐文章
  - 邮件主题：欢迎使用 PathOS - 让留学决策更可信
  - 文章示例：哈佛 vs MIT 的 5 年录取率变化
Day 7: 第一次注册（仅邮箱 + 密码）
  - 转化率：100% 浏览 -> 30% 注册（30% 转化）

Phase 2: 兴趣（Day 8-30）
Day 8-14: 探索学校
  - 浏览 5-10 所学校详情页（哈佛 / 耶鲁 / 普林斯顿 / MIT / 斯坦福 / 哥大 / 宾大 / 布朗 / 康奈尔 / 达特茅斯）
  - 每个学校停留 3-5 分钟
  - 关键行为：保存学校到清单
Day 15: 第一次对比 2 所学校
  - 触发：看到学校页的"对比其他学校"按钮
  - 关键功能：跨校对比表
Day 20: 第一次看时序图
  - 触发：学校页的"查看 5 年趋势"按钮
  - [Aha Moment 2]：发现"哈佛录取率 5 年下降 1.5%"
  - 信号：用户停留时间 > 5 分钟
Day 25: 第一次查看新专业雷达
  - 触发：学校页的"新专业雷达"按钮
  - [Aha Moment 3]：发现"哈佛新开了人类学专业"
  - 信号：用户分享对比卡

Phase 3: 评估（Day 31-60）
Day 30-40: 深度研究
  - 查时序数据（SAT / 录取率 / 学费 5 年变化）
  - 看专业对比（CS / 工程 / 商业）
  - 看新专业（哈佛 / MIT / 斯坦福）
Day 40: 第一次保存对比结果
  - 关键行为：保存到清单
  - 信号：30 天内保存 5+ 学校 = 高意向用户
Day 50: 阅读时序解读文章 5+ 篇
  - 关键内容：政策变化 / 录取趋势 / 学校动态
Day 60: 决定购买高阶订阅
  - 触发：看到订阅页 + 限时优惠
  - 转化率：80% -> 1%（1% 月订阅转化）

Phase 4: 留存（Day 61+）
每周一收到周报：
  - "上周新内容 + 5-10 所学校排名变化"
  - 点击率：30%
每月初收到月报：
  - "行业趋势报告 + 政策变化"
  - 阅读率：20%
重要事件推送：
  - 用户收藏学校的招生政策变化
  - 推送率：80% 用户收到，30% 点击
每日访问：1-2 次（早 9 点 / 晚 9 点）
平均停留：5-8 分钟
次月留存：25%

Phase 5: 推荐（Day 90+）
Day 90: 推荐给其他家长
  - 触发：NPS 调研（评分 >= 9）
  - 机制：分享学校对比卡 + 推荐码
  - 奖励：双方各 1 个月高级订阅
  - 转化率：1% -> 0.3%（每用户带来 0.3 个新用户）

关键转化点：
| 节点 | 触发 | 转化率 | KPI |
|-----|------|--------|-----|
| 注册 | 阅读 3 篇 | 100% -> 30% | 注册转化 |
| Aha 1 | 看到 verified | 30% -> 60% | 7 日留存 |
| Aha 2 | 看到时序图 | 60% -> 80% | 14 日留存 |
| 订阅 | 看完 5 校 | 80% -> 1% | 月订阅 |
| 推荐 | 订阅 30 天 | 1% -> 0.3% | 推荐率 |
```

#### 9.1.2 学校端"留学顾问"完整旅程

```
Phase 1: 认知（Day 1-30）
渠道 A: 顾问协会推荐（推荐奖金 ¥500）
渠道 B: 知乎文章"顾问如何用 AI 提升 5 倍效率"
渠道 C: 同行口碑
Day 1: 访问 PathOS 网站 -> 注册（工作邮箱）
Day 7: 试用期开始（14 天）

Phase 2: 试用（Day 8-21）
Day 8: 使用智能选校工具（输入 3 个学生画像）
  - 输出：5 所推荐学校 + 匹配度评分
Day 10: 查 5 所学校深度数据
  - 关键数据：verified 字段 + missing-first 占位
Day 12: 用时序图给客户展示"录取率变化"
  - 关键行为：截图 / PDF 导出
Day 14: 用对比工具生成对比报告（PDF 下载）
  - 输出：2-3 所学校的可视化对比
Day 18: 收到"试用期剩余 3 天"提醒
  - 推送：邮件 + 站内通知

Phase 3: 付费（Day 22+）
Day 22: 试用期结束 -> 推送订阅页
  - 月付 ¥100 / 年付 ¥1,200（5 折）
Day 25: 选择年付 ¥1,200 -> 续 1 年
  - 转化率：30%

Phase 4: 续费（Year 2+）
Year 2 Day 25: 续费提醒（提前 30 天）
Year 2 Day 30: 推荐同行注册（双向奖励）
Year 2 Day 35: 续费成功
  - 续费率：70%

Phase 5: 机构版升级（Year 2+）
陈顾问加入的机构升级到机构版
  - 5 个账号共享数据
  - 协作功能
  - 机构版 ¥12,000/年 = 5 x ¥2,400/年（单买）
  - 升级率：20%
```

### 9.2 详细 A/B 测试设计

#### 9.2.1 测试基础设施

```typescript
// lib/analytics.ts
import posthog from 'posthog-js';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: 'https://app.posthog.com',
});

const EXPERIMENTS = {
  'home-cta-copy': {
    variants: {
      control: '探索留学地图',
      variant_a: '查找学校',
      variant_b: '开始你的留学规划',
    },
    primaryMetric: 'signup_rate',
    sampleSize: 9000,
  },
};

export function useExperiment(experimentKey) {
  const variant = useFeatureFlag(experimentKey);
  return EXPERIMENTS[experimentKey].variants[variant] || 'control';
}
```

#### 9.2.2 v2 启动版 10 个测试假设

| # | 假设 | 变体 | 主要指标 | 次要指标 | 样本 | 时长 |
|---|------|------|----------|----------|------|------|
| 1 | 首页 CTA 影响注册 | control vs A vs B | 注册率 | 跳出率 | 9000 | 14 天 |
| 2 | 学校详情页 verified 标签 | control vs A | 跳出率 | 平均停留 | 6000 | 14 天 |
| 3 | 时序图 vs 表格 | control vs A | 平均停留 | 分享率 | 6000 | 14 天 |
| 4 | 对比卡 vs 纯文本 | control vs A | 分享率 | 注册率 | 9000 | 14 天 |
| 5 | 订阅页定价 | control vs A | 付费率 | 订阅数 | 9000 | 21 天 |
| 6 | 时序解读文章长度 | control vs A | SEO 流量 | 阅读完成率 | 12000 | 30 天 |
| 7 | 学校详情页排序 | control vs A | 跳转率 | 停留时间 | 6000 | 14 天 |
| 8 | 家庭端首页首屏 | control vs A | 注册率 | 跳出率 | 9000 | 14 天 |
| 9 | 学校端首页首屏 | control vs A | 试用率 | 工具使用率 | 6000 | 14 天 |
| 10 | 邮件周报发送时间 | control vs A | 打开率 | 点击率 | 12000 | 30 天 |

### 9.3 详细数据流程图

#### 9.3.1 ETL 调度

```python
# backend/etl/scheduler.py
from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler()

@scheduler.scheduled_job("cron", hour=2, minute=0)
async def daily_etl():
    await scan_school_websites()  # A6 half-automatic crawler
    await validate_v1_data()  # v1 data integrity check
    await refresh_frontend_cache()  # refresh frontend cache

@scheduler.scheduled_job("cron", day_of_week="mon", hour=3)
async def weekly_etl():
    await update_timeseries_data()
    await generate_weekly_report()
    await scan_policy_events()  # S3 radar

@scheduler.scheduled_job("cron", day=1, hour=4)
async def monthly_etl():
    await sync_with_ipeds()
    await sync_with_college_scorecard()
    await sync_with_us_news()
    await archive_old_data()

scheduler.start()
```

#### 9.3.2 数据校验流程

```python
# backend/etl/validator.py
from zod import ZodSchema

async def validate_university_data(data, schema):
    """数据校验：zod schema 严格校验"""
    try:
        parsed = schema.parse(data)
        return ValidationResult(success=True, data=parsed)
    except ValidationError as e:
        # missing-first fix
        fixed_data = apply_missing_first_fix(data, e.errors())
        return ValidationResult(success=False, data=fixed_data, errors=e.errors())

def apply_missing_first_fix(data, errors):
    for error in errors:
        path = error["path"]
        set_nested(data, path, None)
    return data
```

#### 9.3.3 数据更新流程

```
触发条件：
1. 定时任务（每日 / 每周 / 每月）
2. 编辑手动触发（S3 新专业事件）
3. 数据 stale 警告（新鲜度 > 90 天）

更新流程：
1. 数据采集 -> 2. 数据校验 -> 3. 数据合并 -> 4. 数据写入 -> 5. 缓存失效 -> 6. 通知用户
```

### 9.4 详细技术架构

#### 9.4.1 Next.js 14 App Router 结构

```
frontend/src/app/
├── (school)/
│   ├── s/
│   │   ├── home/page.tsx
│   │   ├── map/page.tsx
│   │   ├── [slug]/page.tsx
│   │   ├── [slug]/timeseries/page.tsx
│   │   ├── [slug]/cases/page.tsx
│   │   ├── majors/page.tsx
│   │   ├── major/[id]/page.tsx
│   │   ├── radar/page.tsx
│   │   ├── calculator/page.tsx
│   │   ├── calculator/gpa/page.tsx
│   │   ├── calculator/roi/page.tsx
│   │   ├── compare/page.tsx
│   │   ├── cases/page.tsx
│   │   └── topic/[school-slug]/[article-slug]/page.tsx
│   └── layout.tsx
├── (family)/
│   ├── f/
│   │   ├── home/page.tsx
│   │   ├── school/[slug]/page.tsx
│   │   ├── major/[id]/page.tsx
│   │   ├── policy/page.tsx
│   │   ├── case/[id]/page.tsx
│   │   ├── calculator/roi/page.tsx
│   │   └── about/page.tsx
│   └── layout.tsx
├── auth/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── logout/route.ts
├── account/
│   ├── profile/page.tsx
│   ├── subscription/page.tsx
│   ├── saved/page.tsx
│   └── api-keys/page.tsx
├── admin/
│   ├── schools/page.tsx
│   ├── data/page.tsx
│   ├── subscriptions/page.tsx
│   └── analytics/page.tsx
├── api/
│   ├── pathos/preview/route.ts
│   ├── subscriptions/route.ts
│   ├── cases/route.ts
│   └── policy-events/route.ts
├── layout.tsx
├── page.tsx
└── globals.css
```

#### 9.4.2 数据库 Schema（PostgreSQL）

```sql
-- universities table
CREATE TABLE universities (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name_zh VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  country VARCHAR(50) NOT NULL,
  state VARCHAR(50),
  city VARCHAR(100) NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  ranking_tier VARCHAR(20),
  ipeds_unitid INTEGER,
  scorecard_unitid INTEGER,
  data_envelope JSONB NOT NULL DEFAULT "{}",
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_universities_slug ON universities(slug);
CREATE INDEX idx_universities_ipeds ON universities(ipeds_unitid);
CREATE INDEX idx_universities_country ON universities(country);

-- university_details table
CREATE TABLE university_details (
  university_id UUID PRIMARY KEY REFERENCES universities(id),
  ranking_usnews INTEGER,
  ranking_qs INTEGER,
  ranking_the INTEGER,
  ranking_reconciliation_note TEXT,
  tuition_bachelor_highest NUMERIC,
  tuition_bachelor_lowest NUMERIC,
  tuition_master_highest NUMERIC,
  tuition_master_lowest NUMERIC,
  tuition_phd_highest NUMERIC,
  tuition_phd_lowest NUMERIC,
  accommodation NUMERIC,
  living_cost_min NUMERIC,
  living_cost_max NUMERIC,
  application_fee NUMERIC,
  toefl_min INTEGER,
  ielts_min NUMERIC,
  sat_mid INTEGER,
  act_mid INTEGER,
  history JSONB,
  notable_alumni JSONB,
  facilities JSONB,
  field_meta JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- university_timeseries table
CREATE TABLE university_timeseries (
  id SERIAL PRIMARY KEY,
  university_id UUID REFERENCES universities(id),
  semester VARCHAR(20) NOT NULL,
  sat_mid INTEGER,
  gpa_mid NUMERIC,
  acceptance_rate NUMERIC,
  tuition_usd NUMERIC,
  field_meta JSONB NOT NULL,
  UNIQUE(university_id, semester)
);

CREATE INDEX idx_timeseries_university ON university_timeseries(university_id);
CREATE INDEX idx_timeseries_semester ON university_timeseries(semester);

-- majors table
CREATE TABLE majors (
  id VARCHAR(100) PRIMARY KEY,
  name_zh VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  field_meta JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- school_major_comparisons table
CREATE TABLE school_major_comparisons (
  id SERIAL PRIMARY KEY,
  university_id UUID REFERENCES universities(id),
  major_id VARCHAR(100) REFERENCES majors(id),
  program_rank INTEGER,
  acceptance_rate NUMERIC,
  enrollment_count INTEGER,
  tuition_usd NUMERIC,
  graduation_salary_usd NUMERIC,
  field_meta JSONB NOT NULL,
  UNIQUE(university_id, major_id)
);

-- radar_events table
CREATE TABLE radar_events (
  id UUID PRIMARY KEY,
  university_id UUID REFERENCES universities(id),
  program_name VARCHAR(255) NOT NULL,
  source_url TEXT NOT NULL,
  discovered_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ("draft", "review", "published")),
  ai_draft TEXT NOT NULL CHECK (length(ai_draft) >= 200),
  editor_final TEXT,
  suitability_tags TEXT[],
  published_at TIMESTAMP WITH TIME ZONE,
  version_history JSONB,
  field_meta JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- admission_cases table
CREATE TABLE admission_cases (
  id UUID PRIMARY KEY,
  from_school VARCHAR(255),
  from_major VARCHAR(255),
  to_school_id UUID REFERENCES universities(id),
  to_major VARCHAR(255),
  to_degree VARCHAR(20),
  gpa NUMERIC,
  sat INTEGER,
  toefl INTEGER,
  essay_excerpt TEXT,
  activities TEXT[],
  admission_year INTEGER NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  field_meta JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  stripe_subscription_id VARCHAR(255),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  role VARCHAR(20) NOT NULL CHECK (role IN ("family", "school", "admin")),
  subscription_id UUID REFERENCES subscriptions(id),
  email_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### 9.5 详细 Vercel 部署配置

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "env": {
    "NEXT_PUBLIC_PATHOS_MAP_PROVIDER": "maplibre",
    "COLLEGE_SCORECARD_API_KEY": "@college-scorecard-api-key",
    "DEEPSEEK_API_KEY": "@deepseek-api-key"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### 9.6 详细 Sentry 错误监控配置

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    if (event.user) {
      delete event.user.email;
    }
    return event;
  },
});
```

### 9.7 详细 Stripe 订阅配置

```typescript
// lib/stripe.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export const SUBSCRIPTION_PLANS = {
  family_premium: {
    priceId: "price_family_premium_year",
    amount: 39900,  // cents
    currency: "cny",
    interval: "year",
    features: ["all data access", "deep insights", "ROI calculator", "PDF download"],
  },
  school_pro: {
    priceId: "price_school_pro_year",
    amount: 120000,  // cents
    currency: "cny",
    interval: "year",
    features: ["all schools", "timeseries", "compare", "export"],
  },
  school_enterprise: {
    priceId: "price_school_enterprise_year",
    amount: 1200000,  // cents
    currency: "cny",
    interval: "year",
    features: ["school_pro features", "10 accounts", "collaboration", "API"],
  },
};
```

### 9.8 详细 SEO 配置（next-seo）

```typescript
// app/s/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const detail = await getUniversityDetail(params.slug);
  return {
    title: `${detail.name.zh} ${detail.name.en} - 完整数据 | PathOS`,
    description: `${detail.name.zh} ${detail.name.en}：${detail.ranking?.usNews?.value} 名`,
    keywords: [
      detail.name.zh, detail.name.en,
      `${detail.name.zh} 怎么样`, `${detail.name.en} 申请要求`,
      `${detail.name.zh} 学费`, `${detail.name.zh} 录取率`,
    ],
    openGraph: {
      title: `${detail.name.zh} 完整数据`,
      description: `${detail.name.zh} ${detail.name.en} verified 数据`,
      images: [`/api/og/school/${params.slug}`],
    },
  };
}
```

### 9.9 详细权限系统

```typescript
// lib/auth/permissions.ts
export const ROLES = {
  ANONYMOUS: "anonymous",
  FAMILY: "family",
  FAMILY_PREMIUM: "family_premium",
  SCHOOL: "school",
  SCHOOL_PRO: "school_pro",
  SCHOOL_ENTERPRISE: "school_enterprise",
  ADMIN: "admin",
};

export const PERMISSIONS = {
  [ROLES.ANONYMOUS]: ["view_public_data"],
  [ROLES.FAMILY]: ["view_public_data", "save_schools", "compare_schools"],
  [ROLES.FAMILY_PREMIUM]: [
    "view_public_data", "save_schools", "compare_schools",
    "view_timeseries", "view_pdf_reports", "use_roi_calculator",
  ],
  [ROLES.SCHOOL]: ["view_public_data", "use_compare_tools"],
  [ROLES.SCHOOL_PRO]: [
    "view_public_data", "use_compare_tools",
    "view_timeseries", "export_data", "api_access",
  ],
  [ROLES.SCHOOL_ENTERPRISE]: [
    "all_school_pro_permissions",
    "multi_account", "collaboration", "priority_support",
  ],
  [ROLES.ADMIN]: ["all"],
};

export function hasPermission(role, permission) {
  return PERMISSIONS[role]?.includes(permission) || PERMISSIONS[role]?.includes("all");
}
```

### 9.10 详细邮箱系统

```typescript
// lib/email/types.ts
export const EMAIL_TEMPLATES = {
  WELCOME: {
    subject: "欢迎使用 PathOS",
    trigger: "signup",
  },
  WEEKLY_DIGEST: {
    subject: "本周留学数据更新 ({{count}} 所学校)",
    trigger: "cron_monday_9am",
  },
  MONTHLY_REPORT: {
    subject: "{{month}} 留学行业月报",
    trigger: "cron_first_of_month",
  },
  SCHOOL_DYNAMIC: {
    subject: "{{school}} 重大变化通知",
    trigger: "event:radar_published",
  },
  POLICY_CHANGE: {
    subject: "{{policy}} 政策变化解读",
    trigger: "event:policy_event",
  },
  ABANDONED_CART: {
    subject: "您的对比报告还未保存",
    trigger: "cart_abandoned_24h",
  },
  REENGAGEMENT: {
    subject: "您已 {{days}} 天没访问 PathOS",
    trigger: "inactive_30d",
  },
};
```

### 9.11 详细 KPI Dashboard（PostHog）

```json
{
  "dashboards": {
    "v2_overview": {
      "widgets": [
        { "type": "trend", "metric": "weekly_active_users" },
        { "type": "funnel", "steps": ["visit", "signup", "active", "subscribe"] },
        { "type": "retention", "cohort": "weekly" },
        { "type": "revenue", "metric": "monthly_recurring_revenue" }
      ]
    },
    "content_quality": {
      "widgets": [
        { "type": "trend", "metric": "data_freshness_pct" },
        { "type": "distribution", "metric": "field_verification_rate" },
        { "type": "top", "metric": "most_viewed_schools" }
      ]
    },
    "engineering": {
      "widgets": [
        { "type": "trend", "metric": "lcp" },
        { "type": "trend", "metric": "inp" },
        { "type": "count", "metric": "errors_per_min" },
        { "type": "trend", "metric": "etl_success_rate" }
      ]
    }
  }
}
```

### 9.12 详细 SOP

#### 9.12.1 编辑 SOP

```
Daily:
09:00-09:30  Check PathOS / email / school website RSS
09:30-10:00  Topic selection (5-10 core school updates)
10:00-12:00  AI drafting (500 words per topic)
14:00-17:00  Editing (>= 70% rewrite rate)
17:00-17:30  Submit to editor-in-chief

Weekly:
Monday 09:00  Team meeting (topic confirmation)
Wednesday 14:00  Content quality review (4-eye check)
Friday 17:00  Weekly publication review
```

#### 9.12.2 Full-stack SOP

```
Daily:
09:00-09:30  Check Sentry errors
09:30-10:00  Check monitoring / logs
10:00-12:00  Fix P3 / P4 bugs
14:00-17:00  Develop new features

Weekly:
Tuesday 14:00  Deploy (weekly major release)
Thursday 14:00  Code review
Friday 17:00  Sprint retrospective

Monthly:
End of month  Data backup drill
End of month  Performance audit
```

### 9.13 详细术语表

| Term | Definition |
|------|------------|
| BFF | Backend For Frontend |
| CIP | Classification of Instructional Programs |
| DataEnvelope | Data wrapper (status / source / asOf / version) |
| ETL | Extract Transform Load |
| KOL | Key Opinion Leader |
| LTV | Life Time Value |
| NPS | Net Promoter Score |
| PII | Personally Identifiable Information |
| PWA | Progressive Web App |
| SLO | Service Level Objective |
| UGC | User Generated Content |
| verified | Data verified (has source + time + verifier) |
| missing-first | Missing fields display "暂无" not 0 |

### 9.14 详细 ChangeLog

| Version | Date | Changes |
|---------|------|---------|
| v2.0 | 2026-09-20 | Initial version (14 core + 6 scaffold standards) |
| v2.0.1 | 2026-09-20 | Fix 10 P0 bugs (route inconsistencies, IPEDS URL) |
| v2.1 | 2026-09-20 | Fix 50 bugs (round 2 research) + add V2-PRODUCT-STRATEGY.md |
| v2.2 | 2026-09-20 | Add detailed enterprise-level planning (this document) |

---

## 第 10 章 总结

**PathOS v2 启动版** 是一份完整的"信息集合与展示"产品，基于：

- **战略层**：Mission (Family decision trust) + Business model (dual subscription) + Value proposition (5 minutes)
- **产品层**：User journey (family + school) + KPI system (AARRR + North Star) + IA + Roadmap
- **技术层**：Next.js + PostgreSQL + ETL + Security + Monitoring
- **运营层**：Content (school articles / timeseries insights) + User (CRM) + Data (A/B testing)
- **风险层**：15 risks + mitigation + emergency response
- **团队层**：Minimum 4 people + RACI + 20-week Gantt chart
- **财务层**：Bootstrap ¥55,000-91,000 + V2 monthly revenue ¥5,000-20,000 + V2.1 near break-even

**关键成功因素**：
1. **Data credibility**: verified + missing-first is PathOS v2's core differentiation
2. **Differentiation anchors**: timeseries visualization / new major radar / cross-school comparison are 0-competitor blue oceans
3. **Reuse v1 assets**: ProvenanceBadge / UniversityProfilePanel / StatusDictionaryMap
4. **Data foundation**: v1 already has 97 schools + 904 records + 4 regional indicators
5. **Dual subscription model**: family + school dual payment, LTV/CAC 6-9x

**Highest risks**:
1. R1 (data migration) + R5 (timeseries missing) + R8 (editor recruitment) + R9 (subscription conversion)

**Final judgment**:
**PathOS v2 启动版 is an executable, commercializable, scalable product plan**. Any AI / team member / investor who gets this document + V2-BLUEPRINT.md + V2-EXEC-SPEC.md + 8 blueprint files can completely understand all the details of PathOS v2.

**Document statistics**:
- Total blueprint documents: 9 (8 v2 docs + this product strategy)
- Total competitor research files: 47
- Total content: ~80,000 words
- v1 assets reused: 4 (ProvenanceBadge, UniversityProfilePanel, StatusDictionaryMap, frontend-fields.json)
- v1 audits referenced: 2 (PATHOS-DEEP-AUDIT, PATHOS-DATA-FILL-GAPS)
- Lines of code templates: ~3,000
- B1 / B2 / B3 / S3 zero-competitor features: 4
- 14 core modules: 5 data + 5 features + 3 reference + 4 incremental
- 6 scaffold standards: routing + schema + components + placeholders + 5-10 schools + editor workflow
- 12 open decisions with recommended solutions
- 10 A/B test hypotheses
- 20-week Gantt chart with weekly tasks
- Financial model: bootstrap + Unit Economics + break-even + funding needs
- 15 risks with mitigation strategies
- Complete deployment architecture (Vercel + Supabase + Sentry + Stripe)

