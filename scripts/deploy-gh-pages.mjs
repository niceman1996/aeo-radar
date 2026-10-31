// Deploy AEO Radar to GitHub Pages using the machine's stored GitHub credentials.
// Steps: credentials via `git credential fill` → ensure public repo exists → push
// source (main) → push built site (site/out/) to gh-pages → enable Pages → bind
// custom domain → verify live.
// Run: node scripts/deploy-gh-pages.mjs   (override domain: SOE_DOMAIN=xxx node ...)
import { spawnSync } from "node:child_process";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const REPO = "aeo-radar";
const SITE_URL = `https://niceman1996.github.io/${REPO}/`;
const DOMAIN = process.env.SOE_DOMAIN ?? "zl1.top";
// Deep page fetched after go-live to confirm real content is serving.
const VERIFY_PATH = "llms-txt-generator";

function git(args, opts = {}) {
  return spawnSync("git", args, { encoding: "utf8", cwd: root, ...opts });
}

// 1. credentials
const fill = git(["credential", "fill"], { input: "protocol=https\nhost=github.com\n" });
if (fill.status !== 0) throw new Error("git credential fill failed");
const cred = Object.fromEntries(
  fill.stdout.split("\n").filter((l) => l.includes("=")).map((l) => {
    const i = l.indexOf("=");
    return [l.slice(0, i), l.slice(i + 1)];
  }),
);
const { username, password: TOKEN } = cred;
if (!TOKEN) throw new Error("no GitHub token available from credential helper");
console.log(`[1] credentials: ${username} (token present, ${TOKEN.length} chars)`);

const api = (path, init = {}) =>
  fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "soe-deploy",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

// 2. ensure repo (public — required for free GitHub Pages)
let res = await api(`/repos/${username}/${REPO}`);
if (res.status === 404) {
  console.log(`[2] creating repo ${username}/${REPO} (public)`);
  res = await api("/user/repos", {
    method: "POST",
    body: JSON.stringify({
      name: REPO,
      private: false,
      description: "AEO Radar — AI search visibility tools (free llms.txt generator)",
    }),
  });
  if (!res.ok) throw new Error(`repo create failed: ${res.status} ${await res.text()}`);
} else if (!res.ok) {
  throw new Error(`repo check failed: ${res.status} ${await res.text()}`);
} else {
  console.log(`[2] repo ${username}/${REPO} exists`);
}

// 3. push source branch
const origin = `https://x-access-token:${TOKEN}@github.com/${username}/${REPO}.git`;
console.log("[3] pushing source (main)");
let p = git(["push", origin, "main:main"]);
if (p.status !== 0) {
  p = git(["push", "-u", origin, "main:main"]);
  if (p.status !== 0) throw new Error(`source push failed:\n${p.stderr}`);
}
console.log("    source pushed");

// 4. push site/out as gh-pages (orphan repo inside out/)
const outDir = join(root, "site", "out");
if (!existsSync(outDir)) throw new Error("site/out missing — run `cd site && npm run build` first");
console.log("[4] pushing site build to gh-pages");
// GitHub Pages runs Jekyll by default, which drops underscore-prefixed dirs (_next)
writeFileSync(join(outDir, ".nojekyll"), "");
// CNAME file makes Pages serve the custom domain
writeFileSync(join(outDir, "CNAME"), `${DOMAIN}\n`);
console.log(`    CNAME → ${DOMAIN}`);
rmSync(join(outDir, ".git"), { recursive: true, force: true });
const gitIn = (args) => spawnSync("git", args, { encoding: "utf8", cwd: outDir });
let q = gitIn(["init", "-b", "gh-pages"]);
if (q.status !== 0) throw new Error(`out git init failed: ${q.stderr}`);
gitIn(["add", "-A"]);
q = gitIn(["commit", "-m", `deploy ${new Date().toISOString()}`]);
if (q.status !== 0) throw new Error(`out commit failed: ${q.stderr}`);
q = gitIn(["push", "--force", origin, "gh-pages:gh-pages"]);
if (q.status !== 0) throw new Error(`gh-pages push failed:\n${q.stderr}`);
console.log("    gh-pages pushed");

// 5. enable Pages on gh-pages branch + bind custom domain
console.log("[5] enabling GitHub Pages (gh-pages / root) + binding domain");
res = await api(`/repos/${username}/${REPO}/pages`);
if (res.status === 404) {
  res = await api(`/repos/${username}/${REPO}/pages`, {
    method: "POST",
    body: JSON.stringify({
      source: { branch: "gh-pages", path: "/" },
      cname: DOMAIN,
    }),
  });
  if (!res.ok && res.status !== 409) {
    throw new Error(`pages enable failed: ${res.status} ${await res.text()}`);
  }
} else if (res.ok) {
  const info = await res.json();
  if (info.source?.branch !== "gh-pages" || info.cname !== DOMAIN) {
    await api(`/repos/${username}/${REPO}/pages`, {
      method: "PUT",
      body: JSON.stringify({
        source: { branch: "gh-pages", path: "/" },
        cname: DOMAIN,
      }),
    });
  }
}
console.log(`    pages enabled, cname: ${DOMAIN}`);

// 6. wait for the first build then verify over the public internet
console.log("[6] waiting for deployment to go live…");
const checkUrl = `https://${DOMAIN}/`;
const deadline = Date.now() + 10 * 60 * 1000;
let live = false;
while (Date.now() < deadline) {
  try {
    const r = await fetch(checkUrl, { cache: "no-store" });
    if (r.ok) { live = true; break; }
  } catch {}
  await new Promise((s) => setTimeout(s, 15000));
}
if (!live) throw new Error("site did not go live within timeout — check DNS for " + DOMAIN);

// verify a deep page and llms.txt too
const tool = await fetch(`${checkUrl}${VERIFY_PATH}`, { cache: "no-store" });
const llms = await fetch(`${checkUrl}llms.txt`, { cache: "no-store" });
console.log(`\nLIVE: ${checkUrl} (home 200, /${VERIFY_PATH} ${tool.status}, /llms.txt ${llms.status})`);
