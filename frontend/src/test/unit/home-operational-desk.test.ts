import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../../..");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");

describe("home operational information desk", () => {
  it("prioritizes executable tasks over a feature exhibition", () => {
    const home = read("src/app/page.tsx");
    expect(home).toContain("PRIMARY_TASKS.map");
    expect(home).toContain("浏览院校地图");
    expect(home).toContain("检查申请截止");
    expect(home).toContain("计算年度费用");
    expect(home).toContain("对比候选学校");
    expect(home).toContain("调整自主匹配");
    expect(home).toContain("进入数据工作台");
    expect(home).toContain("AI 学校评估");
    expect(home).toContain("AI 清单分析");
    expect(home).not.toContain("FlipModuleCard");
    expect(home).not.toContain("ChapterNav");
    expect(home).not.toContain("HeroTilt");
  });

  it("keeps data transparency modules on the first information platform surface", () => {
    const home = read("src/app/page.tsx");
    expect(home).toContain("DataCoverageDashboard");
    expect(home).toContain("LatestUpdatesSection");
    expect(home).toContain("FeaturedSchoolsSection");
    expect(home).toContain("Preview 数据只展示已收录与已验证内容");
  });

  it("keeps motion meaningful and reduced-motion safe", () => {
    const home = read("src/app/page.tsx");
    const fx = read("src/app/home-fx.css");
    expect(home).toContain("HomeScrollFx");
    expect(home).toContain("data-back-to-top");
    expect(fx).toContain("min-height: 44px");
    expect(fx).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });
});
