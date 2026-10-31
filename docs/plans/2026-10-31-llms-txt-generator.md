# llms.txt Generator 免费工具 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 上线 `/llms-txt-generator` 免费工具页：纯客户端生成符合 llmstxt.org 规范的 llms.txt，可实时预览、复制、下载，作为 aeo-radar 的 SEO 引流入口。

**Architecture:** Next.js 15 App Router（`site/` 目录，静态导出模式 `output: "export"`），生成逻辑是独立的纯函数 TS 模块（浏览器端运行，无后端、无 API 调用）；工具页为 `"use client"` 组件。部署目标 Cloudflare Pages（静态导出，零成本）。

**Tech Stack:** Next.js 15 + React 19、TypeScript、Tailwind CSS v4、Vitest（AI 开发生态中最主流、生成质量最高的栈；后续加登录/Stripe 无需换架构）

**Spec:** `docs/prd.md`（免费工具引流策略）；`docs/plans/2026-10-31-keyword-clusters-round1.md` 簇 5（`llms.txt generator` 为目标词）

## Global Constraints

- 全英文 UI 文案（英语市场）
- 生成逻辑必须是纯函数：无 DOM 依赖、无 IO，全部放 `src/lib/`，可单测（不标 `"use client"`）
- 零后端：不发任何网络请求，不收集数据；页面组件均为静态
- 输出格式必须符合 llmstxt.org 规范：H1 标题 → blockquote 摘要（可选）→ 补充说明（可选）→ H2 分节 + `- [title](url): description` 链接列表
- 样式用 Tailwind utility classes，不引入组件库（页面少，YAGNI）
- 提交信息用 conventional commits（feat:/test:/chore:）
- 每个任务结束必须 `git commit`

---

### Task 1: 脚手架 Next.js 项目 + Vitest

**Files:**
- Create: `site/`（create-next-app）
- Create: `site/vitest.config.ts`
- Modify: `site/package.json`（添加 test script）

**Interfaces:**
- Produces: 可运行的 `npm run dev` / `npm run build` / `npm test`；后续任务的测试放 `site/tests/`，页面放 `site/src/app/`

- [ ] **Step 1: 创建 Next.js 项目**

```bash
cd G:\ai\projects\SOE\aeo-radar
npx create-next-app@latest site --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack --skip-install
cd site && npm install
```

（aeo-radar 已是 git 仓库，create-next-app 检测到后不会重复 init。）

- [ ] **Step 2: 配置静态导出**

`site/next.config.ts` 改为：

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
```

- [ ] **Step 3: 安装 Vitest 并配置**

```bash
npm install -D vitest
```

创建 `site/vitest.config.ts`：

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
```

`site/package.json` scripts 添加：

```json
"test": "vitest run"
```

- [ ] **Step 4: 冒烟测试验证测试链路**

创建 `site/tests/smoke.test.ts`：

```ts
import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("runner works", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: 运行测试和构建验证**

Run: `npm test && npm run build`
Expected: 测试 1 passed；`next build` 静态导出产出 `site/out/`

- [ ] **Step 6: Commit**

```bash
git add site
git commit -m "chore: scaffold Next.js site with Vitest"
```

---

### Task 2: 生成器核心逻辑（TDD）

**Files:**
- Create: `site/src/lib/llms-txt.ts`
- Test: `site/tests/llms-txt.test.ts`

**Interfaces:**
- Produces:

```ts
export interface LlmsTxtLink {
  title: string;
  url: string;
  description?: string;
}
export interface LlmsTxtSection {
  title: string;
  links: LlmsTxtLink[];
}
export interface LlmsTxtInput {
  name: string;          // 站点名，必填
  description: string;   // blockquote 摘要
  details?: string;      // blockquote 后的自由文本（可选）
  sections: LlmsTxtSection[];
}
export function generateLlmsTxt(input: LlmsTxtInput): string;
```

输出格式（llmstxt.org）：

```
# {name}

> {description}

{details}

## {sectionTitle}
- [{link.title}]({link.url}): {link.description}
```

规则：description 为空时省略 blockquote 行；details 为空/undefined 时省略该段；section 无 links 时整个 section 省略；link.description 缺省时输出 `- [title](url)`；函数对空 name 抛 `Error("name is required")`。

- [ ] **Step 1: 写失败测试**

创建 `site/tests/llms-txt.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { generateLlmsTxt } from "../src/lib/llms-txt";

describe("generateLlmsTxt", () => {
  it("throws when name is empty", () => {
    expect(() =>
      generateLlmsTxt({ name: "", description: "d", sections: [] })
    ).toThrow("name is required");
  });

  it("renders full document with blockquote, details and sections", () => {
    const out = generateLlmsTxt({
      name: "Acme Docs",
      description: "Developer documentation for Acme.",
      details: "All docs are under CC-BY.",
      sections: [
        {
          title: "Guides",
          links: [
            {
              title: "Quickstart",
              url: "https://acme.com/quickstart",
              description: "Get running in 5 minutes",
            },
          ],
        },
      ],
    });
    expect(out).toBe(
      [
        "# Acme Docs",
        "",
        "> Developer documentation for Acme.",
        "",
        "All docs are under CC-BY.",
        "",
        "## Guides",
        "- [Quickstart](https://acme.com/quickstart): Get running in 5 minutes",
      ].join("\n")
    );
  });

  it("omits blockquote when description is empty", () => {
    const out = generateLlmsTxt({
      name: "X",
      description: "",
      sections: [],
    });
    expect(out).toBe("# X");
  });

  it("omits details when undefined or blank", () => {
    const withUndefined = generateLlmsTxt({
      name: "X",
      description: "d",
      sections: [],
    });
    const withBlank = generateLlmsTxt({
      name: "X",
      description: "d",
      details: "   ",
      sections: [],
    });
    expect(withUndefined).toBe("# X\n\n> d");
    expect(withBlank).toBe("# X\n\n> d");
  });

  it("omits link description when missing", () => {
    const out = generateLlmsTxt({
      name: "X",
      description: "d",
      sections: [
        { title: "S", links: [{ title: "Home", url: "https://x.com" }] },
      ],
    });
    expect(out).toContain("- [Home](https://x.com)");
    expect(out).not.toContain("- [Home](https://x.com):");
  });

  it("omits empty sections", () => {
    const out = generateLlmsTxt({
      name: "X",
      description: "d",
      sections: [
        { title: "Empty", links: [] },
        {
          title: "Real",
          links: [{ title: "A", url: "https://x.com/a" }],
        },
      ],
    });
    expect(out).not.toContain("Empty");
    expect(out).toContain("## Real");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test`
Expected: FAIL，`Cannot find module '../src/lib/llms-txt'`

- [ ] **Step 3: 写最小实现**

创建 `site/src/lib/llms-txt.ts`：

```ts
export interface LlmsTxtLink {
  title: string;
  url: string;
  description?: string;
}

export interface LlmsTxtSection {
  title: string;
  links: LlmsTxtLink[];
}

export interface LlmsTxtInput {
  name: string;
  description: string;
  details?: string;
  sections: LlmsTxtSection[];
}

function isBlank(s: string | undefined): boolean {
  return !s || s.trim() === "";
}

export function generateLlmsTxt(input: LlmsTxtInput): string {
  if (isBlank(input.name)) {
    throw new Error("name is required");
  }

  const lines: string[] = [`# ${input.name}`];

  if (!isBlank(input.description)) {
    lines.push("", `> ${input.description.trim()}`);
  }

  if (!isBlank(input.details)) {
    lines.push("", input.details.trim());
  }

  for (const section of input.sections) {
    if (section.links.length === 0) continue;
    lines.push("", `## ${section.title}`);
    for (const link of section.links) {
      const desc = isBlank(link.description)
        ? ""
        : `: ${link.description.trim()}`;
      lines.push(`- [${link.title}](${link.url})${desc}`);
    }
  }

  return lines.join("\n");
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test`
Expected: 全部 PASS

- [ ] **Step 5: Commit**

```bash
git add site/src/lib site/tests/llms-txt.test.ts
git commit -m "feat: llms.txt generator core logic"
```

---

### Task 3: 根布局 + 首页（SEO meta）

**Files:**
- Modify: `site/src/app/layout.tsx`
- Modify: `site/src/app/page.tsx`

**Interfaces:**
- Produces: 首页含指向 `/llms-txt-generator` 的入口链接；全站 SEO 基线（metadata API）

- [ ] **Step 1: 重写根布局 metadata**

替换 `site/src/app/layout.tsx`：

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aeoradar.com"), // TODO: 域名确定后更新
  title: {
    default: "AEO Radar — Is Your Site Visible to AI Search?",
    template: "%s | AEO Radar",
  },
  description:
    "Check whether ChatGPT, Perplexity and Google AI Overviews cite your website. Free llms.txt generator available now, AI visibility tooling coming soon.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased max-w-3xl mx-auto px-4 py-6 leading-relaxed text-slate-900">
        <header className="mb-8">
          <a href="/" className="font-bold text-lg no-underline text-slate-900">
            AEO Radar
          </a>
        </header>
        <main>{children}</main>
        <footer className="mt-16 pt-6 border-t border-slate-200 text-sm text-slate-500">
          © 2026 AEO Radar. Your site, readable by AI.
        </footer>
      </body>
    </html>
  );
}
```

（删除脚手架自带的 `src/app/page.module.css`、字体相关代码；`globals.css` 只保留 Tailwind 引入。）

- [ ] **Step 2: 重写首页**

替换 `site/src/app/page.tsx`：

```tsx
export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Make your site readable by AI search
      </h1>
      <p className="mb-6">
        ChatGPT, Perplexity and Google AI Overviews decide which sites get
        cited. AEO Radar shows you where you stand — and how to get quoted.
      </p>
      <h2 className="text-xl font-semibold mb-2">Free tools</h2>
      <ul className="list-disc pl-6 mb-6">
        <li>
          <a
            href="/llms-txt-generator"
            className="underline text-blue-700"
          >
            Free llms.txt Generator
          </a>{" "}
          — create a llms.txt file so AI assistants can understand and cite
          your site.
        </li>
      </ul>
      <p className="italic text-slate-500">
        AI visibility checker coming soon.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: 构建验证**

Run: `npm run build`
Expected: 构建成功，`site/out/index.html` 存在且含 `llms-txt-generator` 链接

- [ ] **Step 4: Commit**

```bash
git add site/src/app
git commit -m "feat: root layout with SEO metadata and homepage"
```

---

### Task 4: 工具页 UI（"use client" 组件）

**Files:**
- Create: `site/src/app/llms-txt-generator/page.tsx`
- Create: `site/src/components/GeneratorForm.tsx`

**Interfaces:**
- Consumes: `generateLlmsTxt(input: LlmsTxtInput): string`（Task 2）

页面结构：`page.tsx` 为服务端组件（导出 metadata），渲染 `<GeneratorForm />`；`GeneratorForm.tsx` 标 `"use client"`，含表单（站名、描述、补充说明、动态分节+链接行）+ 实时预览 `<pre>` + Copy / Download 按钮，全部客户端运行。

- [ ] **Step 1: 创建客户端组件**

创建 `site/src/components/GeneratorForm.tsx`：

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateLlmsTxt } from "@/lib/llms-txt";

type LinkRow = { title: string; url: string; description: string };
type SectionRow = { title: string; links: LinkRow[] };

const emptyLink = (): LinkRow => ({ title: "", url: "", description: "" });

export default function GeneratorForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [sections, setSections] = useState<SectionRow[]>([
    { title: "", links: [emptyLink()] },
  ]);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState("");
  const downloadUrlRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      setOutput(
        generateLlmsTxt({
          name,
          description,
          details: details || undefined,
          sections: sections.map((s) => ({
            title: s.title,
            links: s.links
              .filter((l) => l.title.trim() && l.url.trim())
              .map((l) => ({
                title: l.title,
                url: l.url,
                description: l.description || undefined,
              })),
          })),
        })
      );
    } catch {
      setOutput("");
    }
  }, [name, description, details, sections]);

  useEffect(() => {
    return () => {
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    };
  }, []);

  const updateSection = useCallback(
    (si: number, patch: Partial<SectionRow>) => {
      setSections((prev) =>
        prev.map((s, i) => (i === si ? { ...s, ...patch } : s))
      );
    },
    []
  );

  const updateLink = useCallback(
    (si: number, li: number, patch: Partial<LinkRow>) => {
      setSections((prev) =>
        prev.map((s, i) =>
          i === si
            ? { ...s, links: s.links.map((l, j) => (j === li ? { ...l, ...patch } : l)) }
            : s
        )
      );
    },
    []
  );

  const addSection = () =>
    setSections((prev) => [...prev, { title: "", links: [emptyLink()] }]);

  const addLink = (si: number) =>
    setSections((prev) =>
      prev.map((s, i) => (i === si ? { ...s, links: [...s.links, emptyLink()] } : s))
    );

  const removeSection = (si: number) =>
    setSections((prev) => prev.filter((_, i) => i !== si));

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    downloadUrlRef.current = url;
    const a = document.createElement("a");
    a.href = url;
    a.download = "llms.txt";
    a.click();
  };

  const inputCls =
    "w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Site</legend>
          <div className="space-y-3">
            <label className="block text-sm">
              Site name
              <input
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Short description
              <input
                className={inputCls}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Extra details (optional)
              <textarea
                className={inputCls}
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-semibold mb-2">Sections & links</legend>
          <div className="space-y-4">
            {sections.map((s, si) => (
              <div key={si} className="rounded border border-slate-200 p-3">
                <div className="flex gap-2 items-center mb-2">
                  <input
                    className={inputCls}
                    placeholder="Section title"
                    value={s.title}
                    onChange={(e) => updateSection(si, { title: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeSection(si)}
                    className="text-sm text-red-600 shrink-0"
                    aria-label={`Remove section ${si + 1}`}
                  >
                    ✕
                  </button>
                </div>
                {s.links.map((l, li) => (
                  <div key={li} className="space-y-2 mb-2">
                    <input
                      className={inputCls}
                      placeholder="Link title"
                      value={l.title}
                      onChange={(e) => updateLink(si, li, { title: e.target.value })}
                    />
                    <input
                      className={inputCls}
                      placeholder="https://example.com/page"
                      type="url"
                      value={l.url}
                      onChange={(e) => updateLink(si, li, { url: e.target.value })}
                    />
                    <input
                      className={inputCls}
                      placeholder="Description (optional)"
                      value={l.description}
                      onChange={(e) =>
                        updateLink(si, li, { description: e.target.value })
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addLink(si)}
                  className="text-sm text-blue-700 underline"
                >
                  + Add link
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSection}
            className="mt-3 text-sm text-blue-700 underline"
          >
            + Add section
          </button>
        </fieldset>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Preview</h2>
        <pre
          aria-live="polite"
          className="bg-slate-900 text-slate-100 rounded p-4 text-xs overflow-x-auto min-h-64 whitespace-pre-wrap"
        >
          {output}
        </pre>
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={copy}
            className="rounded bg-blue-700 text-white px-4 py-2 text-sm font-medium"
          >
            {copied ? "Copied!" : "Copy llms.txt"}
          </button>
          <button
            type="button"
            onClick={download}
            className="rounded border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            Download llms.txt
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建页面**

创建 `site/src/app/llms-txt-generator/page.tsx`：

```tsx
import type { Metadata } from "next";
import GeneratorForm from "@/components/GeneratorForm";

export const metadata: Metadata = {
  title: "Free llms.txt Generator — Make Your Site AI-Readable",
  description:
    "Generate a free llms.txt file in seconds. Follow the llmstxt.org standard so ChatGPT, Perplexity and Claude can find and cite your content. No signup, runs in your browser.",
  alternates: { canonical: "/llms-txt-generator" },
};

export default function Page() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Free llms.txt Generator</h1>
      <p className="mb-6">
        <code>llms.txt</code> is a standard file that tells AI assistants
        (ChatGPT, Claude, Perplexity) what your site is about and which pages
        matter. Fill in the form — everything runs locally in your browser,
        nothing is uploaded.
      </p>
      <GeneratorForm />
      <h2 className="text-xl font-semibold mt-10 mb-2">How to use it</h2>
      <ol className="list-decimal pl-6 space-y-1">
        <li>Download the file.</li>
        <li>
          Upload it to your site root: <code>https://yoursite.com/llms.txt</code>.
        </li>
        <li>
          Optionally also publish an expanded <code>llms-full.txt</code> with
          full page contents.
        </li>
      </ol>
    </div>
  );
}
```

- [ ] **Step 3: 构建验证**

Run: `npm run build && npx serve out`（或 `python -m http.server -d out`）
Expected: 构建成功；打开 `http://localhost:3000/llms-txt-generator`，添加 section/link 后预览实时更新，Copy 和 Download 按钮可用

- [ ] **Step 4: 手动验收清单**

- 空 name 时不崩溃（预览为空）
- 一个 section 两个 link 正确渲染 `- [title](url): desc`
- Copy 后剪贴板内容 = 预览内容
- Download 得到 `llms.txt` 文件，内容正确
- 空链接行（title/url 缺一）不进入输出

- [ ] **Step 5: Commit**

```bash
git add site/src/app/llms-txt-generator site/src/components
git commit -m "feat: llms.txt generator tool page with live preview"
```

---

### Task 5: 收尾 — 命令文档、robots.txt、部署说明

**Files:**
- Modify: `AGENTS.md`（快速事实-技术栈、常用命令段）
- Create: `site/public/robots.txt`
- Create: `docs/deploy.md`

- [ ] **Step 1: 更新 AGENTS.md**

技术栈行改为：`Next.js 15 + Tailwind（静态导出）+ Vitest`。
常用命令段填入：

```bash
cd site
npm install        # 安装依赖
npm run dev        # 本地开发 http://localhost:3000
npm test           # Vitest 单测
npm run build      # 静态导出产出 site/out/
```

- [ ] **Step 2: robots.txt**

创建 `site/public/robots.txt`：

```
User-agent: *
Allow: /
```

（注意：这同时允许 GPTBot 等 AI 爬虫抓取 —— 对 AEO 站是故意的。）

- [ ] **Step 3: 部署文档**

创建 `docs/deploy.md`：记录 Cloudflare Pages 部署步骤（连接 git 仓库、构建命令 `cd site && npm ci && npm run build`、输出目录 `site/out`）。**域名注册、Cloudflare 账号绑定由用户本人操作，agent 不代管 DNS/账号。** 域名确定后更新 `site/src/app/layout.tsx` 中的 `metadataBase`。

- [ ] **Step 4: 最终验证并提交**

Run: `npm test && npm run build`
Expected: 测试全过，构建成功

```bash
git add AGENTS.md site/public/robots.txt docs/deploy.md
git commit -m "chore: commands doc, robots.txt, deploy guide"
```

---

## 验收标准（整体）

- `npm test` 全过（7 个用例：1 冒烟 + 6 生成器）
- `npm run build` 成功且静态导出 `site/out/`
- 工具页在浏览器中可用：实时预览、复制、下载均正常
- 零网络请求（无外链资源、无分析脚本）
- 首页有指向工具页的链接，工具页 metadata 齐全（title/description/canonical）
