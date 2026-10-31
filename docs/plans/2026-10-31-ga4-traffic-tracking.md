# GA4 Multi-Site Traffic Tracking Plan

**Goal:** Record page views for the two already published sites that are missing tracking: AgentForge and AEO Radar (`zl1.top`).

**Architecture:** Reuse the existing GA4 Measurement ID `G-D8MHQP9BK9` so all three sites appear in the existing Analytics resource. Send page views on initial load and App Router path changes. Custom domains are separated by hostname; AgentForge is identified by its `/agentforge/` path on the shared `niceman1996.github.io` hostname. Do not send tool form values as custom events.

**Tech Stack:** Next.js App Router, `next/script`, static GitHub Pages exports.

**Spec:** Existing YardCalc setup in `docs/analytics-setup.md` in `seo-tool-sites`; no additional Google Analytics property is needed.

## Global Constraints

- Keep both websites static and hosted on GitHub Pages; add no server or analytics dependency.
- Treat the GA4 Measurement ID as public build configuration; never add credentials.
- Update privacy disclosures to describe Google Analytics and its cookies.
- Do not add or run tests unless requested; build and live-page inspection are deployment checks.

## Review Focus

- All sites send events to the same Measurement ID and remain distinguishable by hostname or, for AgentForge, the `/agentforge/` path.
- Client-side route changes send page views after the initial page load.
- The analytics code does not include content entered into the AEO Radar generator.
- Privacy copy no longer claims that analytics or tracking is absent.

---

### Task 1: AgentForge

**Files:** `G:/ai/projects/agentforge/scripts/next.mjs`, `app/layout.tsx`, `components/GoogleAnalytics.tsx`, `app/privacy/page.tsx`.

- [x] Add the public Measurement ID to the existing build environment, add a client component that queues `page_view` on pathname changes, and render it from the root layout.
- [x] Update the privacy page to disclose Google Analytics page, device, referrer and cookie data, and link to Google's privacy policy.
- [x] Build and deploy through the existing `scripts/deploy-gh-pages.mjs`; verify the public site contains the tag.

### Task 2: AEO Radar

**Files:** `site/src/app/layout.tsx`, `site/src/components/google-analytics.tsx`, `site/src/app/privacy/page.tsx`, `docs/deploy.md` only if its deployment description proves inaccurate.

- [x] Add the same client-side page-view tracking component to the App Router root layout.
- [x] Add a privacy page and a visible footer notice linking to it; describe GA4 and cookies without claiming that generator input is sent as an analytics event.
- [x] Build and deploy through the existing `scripts/deploy-gh-pages.mjs`; verify `https://zl1.top/` contains the tag and privacy link.

## Rollout verification

- `https://zl1.top/` and its `/llms-txt-generator` route sent `page_view` events; the Google Analytics collection endpoint returned HTTP 204.
- `https://niceman1996.github.io/agentforge/` sent a `page_view` with the `/agentforge/` path; the collection endpoint returned HTTP 204.
- `https://yardcalc.xyz/` sent a `page_view`; the collection endpoint returned HTTP 204.
- All three public privacy pages returned HTTP 200.
