# PathOS v2 SKILLS（可用 Skills 清单）

> **核心目的**：列出 v2 启动版可能用到的 Codex Skills，按用途分类，标注必用 / 选用 / 不需要。

---

## 1. 启动版必用 Skills（P0）

### 1.1 数据采集

| Skill | 用途 | 调用方式 | 必用 |
|---|---|---|---|
| `pdf` | 解析 IECG docx 文件 | Skill 调用 | ✅ |
| `baoyu-url-to-markdown` | 抓取学校官网内容 | Skill 调用 | ✅（备 A6 爬虫） |
| `chrome-automation` | 浏览器自动化（如果 JS 渲染必需） | Skill 调用 | ⚠️ 选用 |

### 1.2 内容创作

| Skill | 用途 | 调用方式 | 必用 |
|---|---|---|---|
| `baoyu-format-markdown` | 格式化学校文章 | Skill 调用 | ✅ |
| `multi-agent-meeting` | 多智能体协作（编辑团队） | Skill 调用 | ⚠️ 选用 |
| `imagegen` | 学校配图 / 校园摄影 | Skill 调用 | ⚠️ 选用 |
| `baoyu-post-to-wechat` | 公众号同步 | Skill 调用 | ⚠️ 选用 |

### 1.3 UI / 设计

| Skill | 用途 | 调用方式 | 必用 |
|---|---|---|---|
| `frontend-design` | v2 视觉系统设计 | Skill 调用 | ✅ |
| `ui-ux-pro-max` | UI/UX 数据库（84 风格 / 192 配色 / 74 字体配对） | Skill 调用 | ✅ |
| `web-design-analyzer` | 分析竞品设计 | Skill 调用 | ⚠️ 选用 |

### 1.4 可视化

| Skill | 用途 | 调用方式 | 必用 |
|---|---|---|---|
| `visualize` | 时序图 / 对比图 | Skill 调用 | ✅ |

### 1.5 项目管理

| Skill | 用途 | 调用方式 | 必用 |
|---|---|---|---|
| `grilling` | 决策 grill | Skill 调用 | ✅（已用） |
| `scope-knife` | v2 范围管理 | Skill 调用 | ✅ |
| `ship-pack` | v2 发布检查 | Skill 调用 | ✅ |
| `fast-verify` | 验证 | Skill 调用 | ✅ |
| `judge-sim` | v2 评审 | Skill 调用 | ✅ |
| `pivot` | v2 转向 | Skill 调用 | ⚠️ 选用 |
| `recovery-runbook` | v2 应急 | Skill 调用 | ⚠️ 选用 |

### 1.6 协作 / 决策

| Skill | 用途 | 调用方式 | 必用 |
|---|---|---|---|
| `agent-team` | 多智能体团队 | Skill 调用 | ⚠️ 选用 |

---

## 2. v2 启动版可能需要但用户提供的 Skills

### 2.1 数据 / 内容类

- **`pdf`** - 解析 IECG docx（v2 数据补齐必须）
- **`imagegen`** - 生成学校配图（如不抓真实校园照）
- **`baoyu-format-markdown`** - 格式化学校专题文章

### 2.2 UI / 设计类

- **`frontend-design`** - v2 整体视觉语言
- **`ui-ux-pro-max`** - UI/UX 设计参考（配色 / 字体）
- **`visualize`** - 时序图 / 对比图

### 2.3 项目管理类

- **`scope-knife`** - v2 范围裁剪
- **`ship-pack`** - v2 发布检查
- **`fast-verify`** - v2 端到端验证
- **`judge-sim`** - v2 评审

---

## 3. v2 不需要的 Skills

- `contract-review` - 合同审查（v2 不涉及）
- `idea-clarify` - 创意澄清（已 grill 完）
- `moltbook` - AI 社交网络（不需要）
- `pet-commerce-creator` - 萌宠带货（不相关）
- `video-creation-*` - 视频创作（v2 不做视频）
- `bedtime-story` - 睡前故事（不相关）
- `historical-*` - 历史科学视频（不相关）
- `three-body-video-creator` - 三体视频（不相关）
- `ecommerce-*` - 电商（不相关）
- `wechat-hotspot-publisher` - 微信公众号热点（v2 自己做内容）
- `wechatsync-publisher` - 多平台发布（v2 启动版不做）
- `xiaohongshu-makeup` - 小红书美妆（不相关）
- `content-research-writer` - 内容研究写作（v2 自己写）
- `data-storytelling` - 数据故事（v2 用 visualize）
- `demo-coach` - Demo 教练（v2 不做 demo）
- `template-creator` - 模板创建（不相关）
- `book-to-skill` - 书籍转 skill（不相关）
- `skill-creator` / `plugin-creator` - skill/插件创建（不相关）
- `ship-pack` - 发布检查（已选）

---

## 4. Skill 使用顺序建议（v2 启动版）

### Week 1-2：数据补齐 + 第三方接入
- **pdf**（解析 IECG docx）
- **baoyu-url-to-markdown**（备 A6 爬虫）

### Week 3-4：UI 设计
- **frontend-design**（v2 整体视觉）
- **ui-ux-pro-max**（配色 / 字体）

### Week 5-6：可视化
- **visualize**（折线图 / 对比图）

### Week 7-8：内容生产
- **imagegen**（学校配图）
- **baoyu-format-markdown**（文章格式化）

### Week 9-20：内容持续 + 验证
- **multi-agent-meeting**（编辑协作）
- **fast-verify**（每个里程碑验证）
- **scope-knife**（范围管理）
- **judge-sim**（评审）
- **ship-pack**（发布检查）

---

## 5. Skill 调用示例

### 5.1 pdf（解析 IECG docx）

```bash
# 用户调用
/pdf parse "D:/pathOS/IECG 美本院校资料 Top90-2025(1)/IECG 美本院校资料 Top90-2025/院校资料-U1-普林斯顿大学.docx"
```

### 5.2 imagegen（学校配图）

```bash
/imagegen "Princeton University campus, autumn, Gothic architecture, aerial view, cinematic"
```

### 5.3 frontend-design（v2 视觉语言）

```bash
# 让 AI 设计 v2 整体视觉语言
/frontend-design "PathOS v2 信息集合与展示平台，学校端工具型 + 家庭端叙事型"
```

### 5.4 ui-ux-pro-max

```bash
# 查询配色
/ui-ux-pro-max color-palettes --category "education"
# 查询字体配对
/ui-ux-pro-max font-pairings --style "data-platform"
```

### 5.5 visualize（折线图）

```bash
/visualize "MIT/Stanford/Harvard SAT 中位数近 10 年趋势，多线折线图，数据：{2015:1450, 2016:1470, ...}"
```

### 5.6 scope-knife（范围管理）

```bash
/scope-knife "v2 启动版 14 项功能：哪些必做 / 哪些 P1 / 哪些 P2 延后"
```

### 5.7 ship-pack（发布检查）

```bash
/ship-pack "v2 启动版发布前检查"
```

---

## 6. 用户需要提供的 Skills 清单

**为了 v2 启动版顺利完成，我建议用户确认提供以下 Skills（按优先级）**：

### P0（必提供）
- [ ] `pdf` - IECG docx 解析
- [ ] `frontend-design` - v2 视觉设计
- [ ] `ui-ux-pro-max` - UI/UX 参考
- [ ] `visualize` - 数据可视化
- [ ] `baoyu-format-markdown` - 文章格式化
- [ ] `imagegen` - 学校配图

### P1（应提供）
- [ ] `baoyu-url-to-markdown` - 抓取学校官网
- [ ] `scope-knife` - 范围管理
- [ ] `fast-verify` - 验证
- [ ] `judge-sim` - 评审

### P2（选用）
- [ ] `multi-agent-meeting` - 编辑团队
- [ ] `chrome-automation` - 浏览器自动化
- [ ] `baoyu-post-to-wechat` - 公众号同步

---

**请用户告诉我：你愿意提供哪些 Skills？我会基于你的选择调整 v2 执行计划。**
