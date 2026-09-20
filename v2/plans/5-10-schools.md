# 5-10 所热门学校候选清单 v2.1

**说明**：v2 启动版 5-10 所学校的候选名单。每所学校分配内容选题 + 数据采集任务。
**v2.1 修订**：加入 v1 已有 97 所学校的验证步骤。

---

## v1 数据基础（验证起点）

```bash
cd frontend
node -e "const u = require('./data/preview/universities.json'); console.log('Schools:', u.length);"
# 期望输出：Schools: 97（v1 commit dcbd287 已完成 35 POI backfill）
```

**v2 不需要补 35 POI**——v1 已经 97 所。v2 只需要在 v1 基础上做字段扩展和时序数据补齐。

**35 POI 名单**（已由 v1 commit dcbd287 完成）：
- 北卡教堂山 / 德州奥斯汀 / 伊利诺伊香槟 / 维克森林 / 凯斯西储 / 弗吉尼亚理工 / 佛州州立 / 威廉玛丽 / UC Merced / 北卡州立 / Stony Brook / 维拉诺瓦 / UMass Amherst / 乔治华盛顿 / Penn State / 密歇根州立 / Brandeis / 杜兰 / 迈阿密 / RPI / 匹兹堡 / 康涅狄格 / Syracuse / UC Riverside / Stevens / 科罗拉多矿业 / UB / 伊利诺伊芝加哥 / 克莱姆森 / UC Santa Cruz / 伍斯特 / 特拉华 / Fordham / SMU / Marquette

---

## 候选 Top 10（5-10 所由你拍板）

| # | 学校 | 排名（US News 2026） | slug（用于路由） | IECG 覆盖 |
|---|---|---|---|---|
| 1 | **普林斯顿大学** | 1 | `princeton-university` | ✅ |
| 2 | **哈佛大学** | 3 | `harvard-university` | ✅ |
| 3 | **耶鲁大学** | 5 | `yale-university` | ✅ |
| 4 | **MIT** | 2 | `mit` | ✅ |
| 5 | **斯坦福大学** | 4 | `stanford-university` | ✅ |
| 6 | **哥伦比亚大学** | 12 | `columbia-university` | ✅ |
| 7 | **宾夕法尼亚大学** | 6 | `upenn` | ✅ |
| 8 | **布朗大学** | 9 | `brown-university` | ✅ |
| 9 | **康奈尔大学** | 11 | `cornell-university` | ✅ |
| 10 | **达特茅斯学院** | 13 | `dartmouth-college` | ✅ |

**注**：v1 detail JSON 文件名格式是 `candidate-v2:<slug>.json`（如 `candidate-v2:princeton-university.json`），与上表 slug 对应。

---

## 每所学校的内容规划（5 篇/校）

每所学校分配 5 篇深度文章：

1. **学校概览**（基于 IECG + 第三方数据 + verified）
2. **录取数据深度解读**（SAT / GPA / 录取率 5 年趋势 → 嵌入 B3 时序图）
3. **强势专业横向对比**（CS / 工程 / 商业 / 文科 + 跨校对比 → 嵌入 B2 对比表）
4. **校园生活 + 校友**（基于 IECG + 学校官网 + verified）
5. **新专业 / 政策变化**（嵌入 S3 雷达事件）

---

## 数据采集任务

每所学校需要：

### v1 已有字段（保留）
- rankingBand / rankingTier / annualCostRmb / safetyScore / recognitionScore
- chineseCommunity / directFlight / postStudyVisa
- programs / parentHighlights / studentHighlights / nearby
- 详细字段定义见 `frontend/src/domain/dataset.ts`

### v2 增量字段（必须扩展）
- 各 ranking（US News / QS / THE 单独字段）
- 学费明细（学位 × 类型 × 最高/最低）
- 录取要求（语言 / 标化）
- 学校历史（结构化时间轴）
- 校友（分类：总统/诺奖/普利策/商业/其他）
- 设施（结构化：图书馆/校园/实验室/体育）
- 时序数据（SAT/GPA/录取率/学费 5-10 年）
- verified 元数据（source + asOf + verifiedBy + confidence）

### 数据源
- IECG docx（v1 已有）
- 学校官网（招生办 / About / Academics / Admissions）
- US News 排名（订阅）
- IPEDS 数据库（免费）
- College Scorecard（免费）

### 路由说明

v2 启动版使用：
- 学校端：`/s/[slug]`（如 `/s/princeton-university`）
- 家庭端：`/f/school/[slug]`（如 `/f/school/princeton-university`）

---

## 编辑分配（1 主编 + 1 编辑）

| 编辑 | 负责学校 | 周产 |
|---|---|---|
| 主编（你） | 选题 + 审稿 + 排期 + 学校 1-2 篇/周 | 8-10 h/周 |
| 编辑 1 | 写作 3-5 所学校（轮流） | 20-30 h/周 |
| AI | 起草初稿 + 数据查询 | 全自动 |

**每周产出**：3-5 篇深度文章（约 5-10 所学校每 4-5 周覆盖 1 轮）

---

## 5-10 所最终确认（待你拍板）

候选 10 所都已通过 IECG 覆盖检查。**请你确认是否就是这 10 所**，或者：
- 替换某几所（比如把哥大换成杜克 / 西北 / 芝大）
- 加 UC 系（伯克利 / 洛杉矶 / 圣地亚哥 / 戴维斯）
- 加莱斯 / 范德堡 / 圣路易斯华盛顿
- 减到 5 所（Top 5：普林斯顿 / 哈佛 / 耶鲁 / MIT / 斯坦福）

**确认后**，我会更新 V2-SCAFFOLD-CHECKLIST.md 标准 5。
