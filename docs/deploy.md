# 部署 — GitHub Pages（全自动脚本）

站点为 Next.js 静态导出（`output: "export"`），复用 `seo-tool-sites` 项目的部署流水线，部署到 GitHub Pages 并绑定 `zl1.top`。

## 在线地址

- **https://zl1.top/** （自定义域名，HTTPS 已强制）
- 仓库：`niceman1996/aeo-radar`（public，源码在 main，构建产物在 gh-pages 分支）

## 日常部署

```bash
cd site && npm run build     # 构建静态导出
cd .. && node scripts/deploy-gh-pages.mjs
```

脚本自动完成：凭据读取（`git credential fill`）→ 确保仓库存在 → 推源码 main → 推 `site/out/` 到 gh-pages（写入 `.nojekyll` + `CNAME`）→ 开启 Pages 并绑定域名 → 线上验证（首页 / `/llms-txt-generator` / `/llms.txt` 三个 200）。

注意：仓库是 public（GitHub Pages 免费版要求），源码与 docs 均公开 —— 沿用 yardcalc 的既有做法。不想公开策略文档时，先移出仓库再部署。

## 关键细节

- `.nojekyll` 必须写入 out/，否则 Jekyll 会丢弃 `_next/` 目录
- 无扩展名 URL（`/llms-txt-generator`）由 GitHub Pages 的 `.html` 回退支持，无需配置
- 域名 DNS 已指向 GitHub Pages（yardcalc 遗留配置，直接复用）；`yardcalc.xyz` 是 yardcalc 现用域名，与本项目无关
