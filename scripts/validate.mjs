import fs from "node:fs";
import vm from "node:vm";

const codePath = "src/Code.gs";
const htmlPath = "src/index.html";
const manifestPath = "src/appsscript.json";

for (const path of [codePath, htmlPath, manifestPath]) {
  if (!fs.existsSync(path)) {
    throw new Error(`필수 파일이 없습니다: ${path}`);
  }
}

const code = fs.readFileSync(codePath, "utf8");
new vm.Script(code, { filename: codePath });

const html = fs.readFileSync(htmlPath, "utf8");
if (!/<html[\s>]/i.test(html) || !/<script>/i.test(html)) {
  throw new Error("index.html의 기본 HTML 또는 script 블록을 확인할 수 없습니다.");
}

const scriptBlocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1])
  .join("\n")
  .replace(
    /var SERVER_DRAFT_ID\s*=\s*<\?!=\s*JSON\.stringify\(initialDraftId\s*\|\|\s*''\)\s*\?>\s*;/,
    "var SERVER_DRAFT_ID = '';"
  );
new vm.Script(scriptBlocks, { filename: htmlPath });

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (manifest.runtimeVersion !== "V8") {
  throw new Error("appsscript.json의 runtimeVersion은 V8이어야 합니다.");
}

console.log("Code.gs, index.html, appsscript.json 구문 검사를 통과했습니다.");
