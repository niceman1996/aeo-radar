# 部署 — Cloudflare Pages

站点为 Next.js 静态导出（`output: "export"`），产物在 `site/out/`，纯静态托管，零运行时成本。

## 步骤

1. 把 `aeo-radar` 仓库推到 GitHub（由用户完成）。
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git，选择本仓库。
3. 构建配置：
   - **Build command**: `cd site && npm ci && npm run build`
   - **Build output directory**: `site/out`
4. 部署后绑定自定义域名。

## 红线

- **域名注册、Cloudflare/GitHub 账号操作由用户本人完成**，agent 不代管 DNS、账号或支付信息。
- 域名：`zl1.top`（已写入 `site/src/app/layout.tsx` 的 `metadataBase` 与 `site/public/llms.txt`）。DNS 解析、Cloudflare 绑定由用户本人操作。

## 本地预览构建产物

```bash
cd site && npm run build && npx serve out
```
