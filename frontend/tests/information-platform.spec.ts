import { expect, test, type Page } from "@playwright/test";

const MAIN_ROUTES = [
  "/",
  "/compare?ids=princeton-university,harvard-university",
  "/majors",
  "/majors/computer-science",
  "/deadlines",
  "/costs",
  "/search?q=computer",
  "/opportunities",
  "/topics/us-university-cost-comparison",
  "/s/home",
];

async function open(page: Page, pathname: string) {
  const response = await page.goto(pathname, { waitUntil: "domcontentloaded" });
  expect(response, `Failed to open ${pathname}`).not.toBeNull();
  expect(response!.status(), `Unexpected status for ${pathname}`).toBe(200);
  await page.waitForLoadState("load");
}

test("homepage renders the information-platform entry", async ({ page }) => {
  await open(page, "/");

  await expect(page.getByRole("heading", { level: 1, name: "PathOS" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "把选校拆成可以执行的三步。" })).toBeVisible();
});

test("interactive map leaves its loading state and renders controls", async ({ page }) => {
  await open(page, "/map");

  const loading = page.getByRole("status").filter({ hasText: "加载地图中" });
  await expect(loading).toHaveCount(0, { timeout: 15_000 });
  await expect(page.getByRole("button", { name: "Zoom in" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "选择区域图层" })).toBeVisible();
});

test("compare renders a two-school matrix with explicit preview provenance", async ({ page }) => {
  await open(page, "/compare?ids=princeton-university,harvard-university");

  await expect(page.getByRole("heading", { level: 1, name: "学校对比工作台" })).toBeVisible();
  const table = page.getByRole("table");
  await expect(table).toBeVisible();
  await expect(table.getByRole("columnheader", { name: /普林斯顿大学/ })).toBeVisible();
  await expect(table.getByRole("columnheader", { name: /哈佛大学/ })).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "字段" })).toBeVisible();
  await expect(table.getByText("Preview").first()).toBeVisible();
});

test("major catalog and computer-science profile render from stable slugs", async ({ page }) => {
  await open(page, "/majors");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByText("专业档案").first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "计算机科学" })).toBeVisible();

  await open(page, "/majors/computer-science");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "申请要求" })).toBeVisible();
  await expect(page.getByText("尚未采集或尚未完成审核").first()).toBeVisible();
});

test("application deadlines fail closed without fabricating dates", async ({ page }) => {
  await open(page, "/deadlines");

  const alert = page.getByRole("alert").filter({ hasText: "申请日历暂不可用" });
  await expect(alert).toBeVisible();
  await expect(alert.getByText("已审核事实层暂不可用")).toBeVisible();
});

test("cost center keeps selection state and reports unavailable facts", async ({ page }) => {
  await open(page, "/costs");
  await expect(page.getByRole("heading", { level: 1, name: "成本与奖学金中心" })).toBeVisible();
  await expect(page.getByText("选择学校后生成预算")).toBeVisible();

  await page.getByRole("button", { name: /^选择$/ }).click();
  await page.locator('[data-picker-row-id="princeton-university"]').click();
  await expect(page.getByText("普林斯顿大学").first()).toBeVisible();

  await page.getByRole("button", { name: "生成预算" }).click();
  await expect(page.getByText(/成本事实层暂不可用：/)).toBeVisible();
});

test("global search falls back to preview schools and local major profiles", async ({ page }) => {
  await open(page, "/search?q=computer");
  await expect(page.getByRole("heading", { level: 2, name: "专业" })).toBeVisible();
  await expect(page.getByRole("link", { name: /计算机科学/ }).first()).toBeVisible();
  await expect(page.getByText("已自动保留 Preview 学校与本地专业检索。")).toBeVisible();

  await page.getByLabel("全局搜索").fill("Princeton");
  await expect(page.getByText("普林斯顿大学").first()).toBeVisible();
  await expect(page.getByText("Preview", { exact: true }).first()).toBeVisible();
});

test("opportunities feed fails closed without promoting unreviewed records", async ({ page }) => {
  await open(page, "/opportunities");

  const alert = page.getByRole("alert").filter({ hasText: "机会动态暂不可用" });
  await expect(alert).toBeVisible();
  await expect(alert.getByText("已审核事件层暂不可用")).toBeVisible();
});

test("university cost answer card exposes traceable evidence and boundaries", async ({ page }) => {
  await open(page, "/topics/us-university-cost-comparison");

  await expect(page.getByRole("heading", { level: 1, name: "美国大学学费成本对比" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "PathOS 答案" })).toBeVisible();
  await expect(page.getByText("Traceable preview").first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "结论边界" })).toBeVisible();
});

test("student workbench renders with fact coverage degraded transparently", async ({ page }) => {
  await open(page, "/s/home");

  await expect(page.getByText("学生数据工作台").first()).toBeVisible();
  await expect(page.getByText("已审核事实覆盖").first()).toBeVisible();
  await expect(page.getByText(/暂不可用/).first()).toBeVisible();
});

test("core information-platform routes have no horizontal overflow at 390px", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of MAIN_ROUTES) {
    await open(page, route);
    const overflow = await page.evaluate(() => {
      const root = document.documentElement;
      return Math.max(root.scrollWidth, document.body.scrollWidth) - root.clientWidth;
    });
    expect(overflow, `${route} overflows horizontally at 390px`).toBeLessThanOrEqual(1);
  }
});

test("deadline and search information APIs return 503 with no-store", async ({ request }) => {
  const endpoints = [
    "/api/information/deadlines",
    "/api/information/search?q=computer&limit=8",
  ];

  for (const endpoint of endpoints) {
    const response = await request.get(endpoint);
    expect(response.status(), endpoint).toBe(503);
    expect(response.headers()["cache-control"], endpoint).toContain("no-store");

    const body = await response.json();
    expect(body.ok, endpoint).toBe(false);
    expect(typeof body.code, endpoint).toBe("string");
  }
});
