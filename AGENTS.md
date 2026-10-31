# aeo-radar

> 一句话说明：AEO Radar 是面向英文市场的「AI 搜索可见度」工具站 + 内容站：从真实 Google 关键词出发，检测该词是否触发 AI Overviews / AI 引用、用户域名是否被提及，并给出优化建议；同时用独立内容站捕获 AEO/GEO 信息型关键词流量（广告 + 竞品工具联盟佣金），为自己的工具导流。

## 快速事实

- 市场 / 语言：英语市场（US 优先），全英文内容
- 技术栈：Next.js 16（App Router，静态导出 `output: "export"`）+ TypeScript + Tailwind v4 + shadcn/ui + Vitest
- 部署：GitHub Pages；执行流程见 [`docs/deploy.md`](docs/deploy.md)，部署脚本为 `node scripts/deploy-gh-pages.mjs`
- 仓库：本目录独立 git 仓库

## 常用命令

```bash
# 站点开发（均在 site/ 目录下执行）
cd site
npm install        # 安装依赖
npm run dev        # 本地开发 http://localhost:3000
npm test           # Vitest 单测
npm run build      # 静态导出产出 site/out/
npm run lint       # ESLint
```

## 目录说明

（只写本项目特有的约定；通用规范见根目录 SOE/AGENTS.md）

## 约束与红线

- 秘密永不落盘：API key（关键词数据、AI 引擎接口等）只进 `.env`，`.env.example` 只留键名
- 不做虚假数据：工具展示的可见度/引用数据必须来自真实检测，不编造
- 内容合规：测评/联盟内容需带 affiliate 披露（FTC 要求），隐私政策、Cookie 提示上线前必须就位
- 不碰竞品商标：对比页面不得冒用竞品 logo 或误导性表述

## Agent 工作方式

- 执行计划放 `docs/plans/`，按计划逐任务推进，完成一项勾一项。
- 提示词资产放 `prompts/`，评估用例放 `evals/`。
- 项目私有 skills / 子 agent / workflow 放 `.zcode/` 对应子目录。
- 关键词研究数据（词簇、搜索意图、变现映射）放 `docs/plans/` 或 `docs/`，作为选题与开发依据。
