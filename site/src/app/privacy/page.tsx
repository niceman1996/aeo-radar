import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy and Cookie Notice",
  description: "How AEO Radar uses Google Analytics and handles information on this site.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="space-y-5">
      <h1 className="text-3xl font-bold tracking-tight">Privacy and Cookie Notice</h1>
      <p className="text-sm text-slate-500">Last updated: October 31, 2026</p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Analytics and cookies</h2>
        <p>
          We use Google Analytics to measure page views and understand how visitors use
          AEO Radar. The page-view events we send contain the page URL, path and title,
          without query-string values. Google may also collect usage and device
          information and use cookies. We do not add the content entered into the
          llms.txt generator or the generated text to our analytics events.
        </p>
        <p>
          Google processes information collected through its tag under the{" "}
          <a
            className="underline"
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
          >
            Google Privacy Policy
          </a>
          . You can manage cookies through your browser settings.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The generator</h2>
        <p>
          We do not intentionally send the text you enter or the generated text as a
          Google Analytics event.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Hosting</h2>
        <p>
          This site is hosted on GitHub Pages. GitHub may process request data needed to
          deliver the site under its{" "}
          <a
            className="underline"
            href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Statement
          </a>
          .
        </p>
      </section>
    </main>
  );
}
