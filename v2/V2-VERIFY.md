# PathOS v2 VERIFY（AI 验收标准）

> **核心目的**：AI 执行每个模块后，对照本清单自检，确保 v2 启动版质量。

---

## 1. 每个模块的验收标准

### 1.1 模块 #1：v1 数据补齐

#### 自动化验收
```bash
cd frontend
ls data/preview/university-details/ | wc -l    # ≥ 62
cat data/preview/universities.json | jq 'length'    # ≥ 97
npx tsc --noEmit    # 0 错误
```

#### 人工验收
- [ ] 随机抽 3 所学校（普林斯顿/哈佛/斯坦福）的 detail JSON
- [ ] 每个字段都有值或明确的 `null`
- [ ] 7 个 P0 字段（usNewsRanks 等）都解析成功

### 1.2 模块 #2：A1 学校字段补齐

#### 自动化验收
```bash
npm run build
npm test -- --grep "university-detail"
npx tsc --noEmit
```

#### 人工验收
- [ ] 5-10 所学校都有完整 30+ 字段
- [ ] 每个字段都有 `verified` 元数据
- [ ] missing 字段不显示 0，显示"暂无"
- [ ] 数据出处可点击

### 1.3 模块 #3：A2 专业级数据

#### 自动化验收
```bash
npm run build
ls .next/server/app/s/major/ | wc -l    # ≥ 50
npm test -- --grep "major"
```

#### 人工验收
- [ ] 50+ 专业都有 schema 校验
- [ ] 7 大类分类完整
- [ ] 每个专业 5-10 所学校的对比数据

### 1.4 模块 #4：A5 第三方接入

#### 自动化验收
```bash
npm test -- --grep "integrations"
```

#### 人工验收
- [ ] IPEDS API 调用成功（3 所学校测试）
- [ ] College Scorecard API 调用成功
- [ ] API 失败时有 fallback 到 IECG

### 1.5 模块 #5：A6 半自动爬虫

#### 自动化验收
```bash
npm test -- --grep "radar"
```

#### 人工验收
- [ ] 编辑触发 1 个新事件 → AI 起草 → 编辑改写 → 发布
- [ ] 事件库 schema 完整

### 1.6 模块 #6：B1 学校深度页

#### 自动化验收
```bash
npm run build
npm test -- --grep "school-detail"
```

#### 人工验收
- [ ] /s/princeton-university 完整渲染 30+ 字段
- [ ] 每个字段都有 verified 标签
- [ ] 数据新鲜度颜色编码正确
- [ ] missing 字段显示"暂无"而非 0
- [ ] 数据出处卡片可点击

### 1.7 模块 #7：B2 专业对比

#### 自动化验收
```bash
npm test -- --grep "major-comparison"
```

#### 人工验收
- [ ] 8-12 个专业的跨校对比页能渲染
- [ ] 每个专业 5-10 所学校的对比表

### 1.8 模块 #8：B3 时序可视化

#### 自动化验收
```bash
npm test -- --grep "timeseries"
```

#### 人工验收
- [ ] 5-10 所学校的 5-10 年时序数据能渲染
- [ ] 政策事件标注（SAT 取消）正确显示

### 1.9 模块 #9：S3 新专业雷达

#### 自动化验收
```bash
npm test -- --grep "radar"
```

#### 人工验收
- [ ] 新专业事件流能显示
- [ ] AI 解读 500 字
- [ ] 适合度标签可见

### 1.10 模块 #11：案例库

#### 自动化验收
```bash
npm test -- --grep "cases"
```

#### 人工验收
- [ ] 案例详情含 GPA/SAT/文书片段
- [ ] 三维度交叉（学校/专业/学校+专业）

### 1.11 模块 #12：GPA 计算器

#### 自动化验收
```bash
npm test -- --grep "gpa"
```

#### 人工验收
- [ ] 至少 3 种算法可切换
- [ ] 输入成绩后实时计算 GPA

### 1.12 模块 #13：ROI 计算器

#### 自动化验收
```bash
npm test -- --grep "roi"
```

#### 人工验收
- [ ] 输入学校 + 学费 + 生活 + 预期薪资 → 输出投资回收期
- [ ] 回收期图清晰

### 1.13 模块 #14：4 项增量改进

#### 数据出处卡片 (14a)
- [ ] 每个字段标 source + asOf + verified
- [ ] 来源颜色编码正确（IECG 绿 / IPEDS 蓝 / etc.）

#### 数据新鲜度指示 (14b)
- [ ] < 30 天绿 / 30-90 天黄 / > 90 天红
- [ ] 颜色编码自动计算

#### 跨源数据调和 (14c)
- [ ] US News + QS + THE 同时展示
- [ ] 调和规则说明可见

#### 对比分享卡 (14d)
- [ ] 对比结果可视化
- [ ] 一键生成 PNG 图片
- [ ] 二维码跳转回 v2

---

## 2. 全局验收（v2 启动版完成时）

### 2.1 代码质量

```bash
cd frontend
npx tsc --noEmit              # 0 错误
npm run lint                  # 0 警告
npm test -- --run             # 100% 通过
npm run build                 # 通过
```

### 2.2 数据质量

- [ ] 5-10 所学校 30+ 字段全部 verified
- [ ] 50+ 专业全部有跨校对比
- [ ] 案例库 100+ 条
- [ ] 时序数据 5-10 年

### 2.3 UI / UX

- [ ] 所有页面有 missing-first 占位
- [ ] 所有数据点有 verified + asOf
- [ ] 数据新鲜度颜色编码正确
- [ ] 移动端响应式

### 2.4 性能

- [ ] 首次内容绘制 (FCP) < 1.5s
- [ ] 最大内容绘制 (LCP) < 2.5s
- [ ] 累积布局偏移 (CLS) < 0.1
- [ ] 首次输入延迟 (FID) < 100ms

### 2.5 可访问性

- [ ] WCAG AA 标准
- [ ] 键盘导航
- [ ] 屏幕阅读器
- [ ] 颜色对比度

---

## 3. AI 自检流程

每个模块完成后，AI 必须按以下流程自检：

```
1. 读取 V2-EXEC-SPEC.md 对应章节
2. 读取本文件对应模块的验收标准
3. 运行自动化验收命令
4. 人工验收清单逐项打勾
5. 如有失败项：
   - 修复并重试
   - 如无法修复，记录到 v2/decisions/D-FAIL-[module-id].md
6. 全部通过后：
   - Git commit
   - 更新 V2-SCAFFOLD-CHECKLIST.md 对应项
   - 通知用户
```

---

## 4. 失败处理流程

### 4.1 自动化验收失败

```bash
# 查看具体错误
npm test -- --grep "module-name" 2>&1 | head -50

# 常见问题
# 1. zod schema 不匹配 → 修改 schema
# 2. TypeScript 类型错误 → 修复类型
# 3. 测试失败 → 修复测试
```

### 4.2 人工验收失败

- [ ] 重新阅读 V2-EXEC-SPEC.md 模块章节
- [ ] 重新阅读竞品 raw 数据（`competitor-research/raw-*.html`）
- [ ] 修复后重新跑自检

### 4.3 无法修复

记录到 `v2/decisions/D-FAIL-[module-id].md`：
```markdown
# 模块 #X 验收失败

## 失败项
- [ ] 自动化：[具体命令 + 错误]
- [ ] 人工：[具体项 + 原因]

## 计划
- [ ] 修复方案
- [ ] 修复时间

## 备注
- 是否阻塞其他模块？
- 是否影响 v2 启动版完成？
```

---

## 5. v2 启动版完成的硬标准

### 5.1 必达（任何一项不达 = v2 启动版不达标）

- [ ] 6 项骨架硬标准全部达标
- [ ] 14 项核心功能全部完成
- [ ] 所有自动化验收 0 错误
- [ ] 所有人工验收清单打勾
- [ ] TypeScript 0 错误 / ESLint 0 警告
- [ ] npm run build 通过

### 5.2 应达（v2 启动版质量保证）

- [ ] 5-10 所学校 30+ 字段全部 verified
- [ ] 50+ 专业全部有跨校对比
- [ ] 时序数据 5-10 年
- [ ] 案例库 100+ 条

### 5.3 期望（v2 启动版差异化）

- [ ] 0 竞品做的功能（时序 / 新专业雷达 / 跨校对比）全部上线
- [ ] 数据出处 / 新鲜度 / 跨源调和 / 对比分享卡 4 项增量改进全部上线
- [ ] 用户原话直接命中的例子（哈佛人类学 / SAT 趋势）都有专门呈现

---

## 6. AI 验收报告模板

每个模块完成后，AI 必须输出：

```markdown
# 模块 #X 验收报告

## 自动化验收
- [ ] npx tsc --noEmit: [PASS/FAIL]
- [ ] npm run lint: [PASS/FAIL]
- [ ] npm test: [PASS/FAIL]
- [ ] npm run build: [PASS/FAIL]

## 人工验收
- [ ] [具体项 1]: [PASS/FAIL]
- [ ] [具体项 2]: [PASS/FAIL]

## 成功点
- [列出 3-5 个做对的事]

## 改进点
- [列出 2-3 个可以优化的地方]

## 是否阻塞其他模块
- [YES/NO]

## Commit 信息
- [git commit hash + message]
```

---

**总结：AI 必须严格执行本文件所有验收标准。任何一项失败必须记录并修复，不得跳过。**
