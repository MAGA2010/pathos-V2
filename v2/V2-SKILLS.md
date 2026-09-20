# PathOS v2 SKILLS（可用 Skills 清单）v2.1

> **核心目的**：列出 v2 启动版可能用到的 Codex Skills。
>
> **v2.1 修订**：删除 §1 / §3 自相矛盾的 ship-pack 条目。

---

## 1. 启动版必用 Skills（P0）

### 1.1 数据采集

| Skill | 用途 | 调用方式 |
|---|---|---|
| `pdf` | 解析 IECG docx 文件 | `/pdf parse "path/to/file.docx"` |
| `baoyu-url-to-markdown` | 抓取学校官网内容 | `/url-to-md <url>` |

### 1.2 内容创作

| Skill | 用途 | 调用方式 |
|---|---|---|
| `baoyu-format-markdown` | 格式化学校文章 | `/baoyu-format <file>` |
| `multi-agent-meeting` | 编辑团队协作 | `/multi-agent-meeting` |

### 1.3 UI / 设计

| Skill | 用途 | 调用方式 |
|---|---|---|
| `frontend-design` | v2 视觉系统设计 | `/frontend-design` |
| `ui-ux-pro-max` | UI/UX 数据库 | `/ui-ux-pro-max <query>` |

### 1.4 可视化

| Skill | 用途 | 调用方式 |
|---|---|---|
| `visualize` | 时序图 / 对比图 | `/visualize <chart-spec>` |

### 1.5 项目管理

| Skill | 用途 | 调用方式 |
|---|---|---|
| `grilling` | 决策 grill | `/grilling` |
| `scope-knife` | v2 范围管理 | `/scope-knife` |
| `ship-pack` | v2 发布检查 | `/ship-pack` |
| `fast-verify` | 验证 | `/fast-verify` |
| `judge-sim` | v2 评审 | `/judge-sim` |

### 1.6 v2 启动版**不需要**的 Skills（v2.1 修复自相矛盾）

以下 Skills 在 v2 启动版**明确不需要**，请不要误用：

| Skill | 不需要的理由 |
|---|---|
| `ide-clarify` | 已 grill 完 |
| `pivot` | v2 启动版未启动，不存在转向 |
| `recovery-runbook` | v2 启动版未出现应急 |
| `moltbook` | AI 社交网络（不需要） |
| `contract-review` | 合同审查（v2 不涉及） |
| `video-creation-*` | 视频创作（v2 不做视频） |
| `bedtime-story` | 睡前故事（不相关） |
| `historical-*` | 历史科学视频（不相关） |
| `three-body-video-creator` | 三体视频（不相关） |
| `ecommerce-*` | 电商（不相关） |
| `pet-commerce-creator` | 萌宠带货（不相关） |
| `wechat-hotspot-publisher` | 微信公众号热点（v2 自己做内容） |
| `wechatsync-publisher` | 多平台发布（v2 启动版不做） |
| `xiaohongshu-makeup` | 小红书美妆（不相关） |
| `content-research-writer` | 内容研究写作（v2 自己写） |
| `data-storytelling` | 数据故事（v2 用 visualize） |
| `demo-coach` | Demo 教练（v2 不做 demo） |
| `template-creator` | 模板创建（不相关） |
| `book-to-skill` | 书籍转 skill（不相关） |
| `skill-creator` / `plugin-creator` | skill/插件创建（不相关） |

---

## 2. 用户必须提供 / 推荐的 Skills（v2 启动版关键依赖）

| # | Skill | 用户是否需要提供 | 用途 |
|---|---|---|---|
| 1 | `pdf` | ✅ 必须提供 | 解析 IECG docx（v2 数据补齐核心） |
| 2 | `frontend-design` | ✅ 必须提供 | v2 整体视觉语言设计 |
| 3 | `ui-ux-pro-max` | ✅ 必须提供 | UI/UX 参考（配色 / 字体） |
| 4 | `visualize` | ✅ 必须提供 | 时序图 / 对比图 |
| 5 | `baoyu-format-markdown` | ✅ 必须提供 | 学校文章格式化 |
| 6 | `baoyu-url-to-markdown` | ⚠️ 推荐提供 | 抓取学校官网内容 |
| 7 | `imagegen` | ⚠️ 推荐提供 | 学校配图（校园摄影生成） |
| 8 | `scope-knife` | ⚠️ 推荐提供 | v2 范围管理 |
| 9 | `fast-verify` | ⚠️ 推荐提供 | v2 端到端验证 |
| 10 | `judge-sim` | ⚠️ 推荐提供 | v2 评审 |
| 11 | `multi-agent-meeting` | ⚠️ 选用 | 编辑团队协作 |
| 12 | `ship-pack` | ⚠️ 选用 | v2 发布检查 |

---

## 3. Skill 调用顺序建议（v2 启动版 20 周）

### Week 1-2：数据补齐 + 第三方接入
- `pdf`（解析 IECG docx）
- `baoyu-url-to-markdown`（备 A6 爬虫）

### Week 3-4：UI 设计系统
- `frontend-design`（v2 整体视觉）
- `ui-ux-pro-max`（配色 / 字体）

### Week 5-6：可视化
- `visualize`（折线图 / 对比图）

### Week 7-8：组件库
- 基于 v1 ProvenanceBadge 扩展
- 基于 v1 UniversityProfilePanel 升级

### Week 9-20：内容生产 + 验证
- `imagegen`（学校配图）
- `baoyu-format-markdown`（文章格式化）
- `multi-agent-meeting`（编辑协作）
- `fast-verify`（每个里程碑验证）
- `scope-knife`（范围管理）
- `judge-sim`（评审）
- `ship-pack`（发布检查）

---

## 4. Skill 调用示例

### 4.1 pdf（解析 IECG docx）

```bash
/pdf parse "D:/pathOS/IECG 美本院校资料 Top90-2025(1)/IECG 美本院校资料 Top90-2025/院校资料-U1-普林斯顿大学.docx"
```

### 4.2 imagegen（学校配图）

```bash
/imagegen "Princeton University campus, autumn, Gothic architecture, aerial view, cinematic"
```

### 4.3 frontend-design（v2 视觉语言）

```bash
/frontend-design "PathOS v2 信息集合与展示平台，学校端工具型 + 家庭端叙事型"
```

### 4.4 ui-ux-pro-max

```bash
/ui-ux-pro-max color-palettes --category "education"
/ui-ux-pro-max font-pairings --style "data-platform"
```

### 4.5 visualize（折线图）

```bash
/visualize "MIT/Stanford/Harvard SAT 中位数近 10 年趋势，多线折线图"
```

### 4.6 scope-knife

```bash
/scope-knife "v2 启动版 14 项功能：哪些必做 / 哪些 P1 / 哪些 P2 延后"
```

### 4.7 ship-pack

```bash
/ship-pack "v2 启动版发布前检查"
```

### 4.8 fast-verify

```bash
/fast-verify "v2 端到端验证：6 项骨架硬标准 + 14 项核心功能"
```

### 4.9 judge-sim

```bash
/judge-sim "v2 启动版：评分 0-5（设计 / 完整性 / 用户体验 / 差异化 / 可行性）"
```

---

## 5. Skill 选用决策矩阵

| 任务 | 推荐 Skill | 备注 |
|---|---|---|
| 解析 IECG docx | `pdf` | 必用 |
| 抓取学校官网 | `baoyu-url-to-markdown` | 备 A6 爬虫 |
| 生成学校配图 | `imagegen` | 校园摄影替代品 |
| v2 整体视觉 | `frontend-design` | P0 |
| 配色 / 字体 | `ui-ux-pro-max` | P0 |
| 时序图 / 对比图 | `visualize` | P0 |
| 文章格式化 | `baoyu-format-markdown` | P0 |
| 编辑协作 | `multi-agent-meeting` | P1 |
| 范围管理 | `scope-knife` | P1 |
| 端到端验证 | `fast-verify` | P1 |
| v2 评审 | `judge-sim` | P1 |
| 发布检查 | `ship-pack` | P2 |

---

## 6. 总结

**v2 启动版 Skills 必选（6 项）**：
1. `pdf` - 数据补齐
2. `frontend-design` - 视觉语言
3. `ui-ux-pro-max` - UI/UX 参考
4. `visualize` - 时序图 / 对比图
5. `baoyu-format-markdown` - 文章格式化
6. `baoyu-url-to-markdown` - 学校官网抓取

**项目管理 Skills 必选（3 项）**：
1. `scope-knife`
2. `fast-verify`
3. `judge-sim`

**v2 启动版明确不需要的 Skills**：见 §1.6
