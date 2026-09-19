// PathOS — debug why specific fields fail to parse
import { readFileSync } from "node:fs";
import path from "node:path";

const project = path.resolve(__dirname, "..");
const iecg = JSON.parse(
  readFileSync(path.join(project, "data/college-guides/iecg-2025.json"), "utf8"),
);

const targets = [
  "Cornell University康奈尔大学",
  "University of California, Los Angeles加州大学洛杉矶分校",
  "Stanford University 斯坦福大学",
  "Duke University杜克大学",
  "Purdue University 普渡大学",
  "Tulane University 杜兰大学",
  "University of Wisconsin-Madison威斯康星大学麦迪逊分校",
  "Yale University 耶鲁大学",
  "University of California, Berkeley加州大学伯克利分校",
];

for (const p of iecg.profiles) {
  if (!targets.includes(p.schoolNameRaw)) continue;
  const sections = p.sections || [];
  console.log("\n========== " + p.schoolNameRaw + " ==========");
  for (const s of sections) {
    if (s.title && (s.title.includes("基本情况") || s.title.includes("USNEWS") || s.title.includes("课程") || s.title.includes("专业") || s.title.includes("中位") || s.title.includes("基本要求"))) {
      console.log("\n[" + s.title + "]");
      console.log(s.text);
    }
  }
}
