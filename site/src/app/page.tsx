import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold leading-tight mb-4">
          Is your site readable
          <br className="hidden sm:block" /> by AI search?
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto mb-8">
          ChatGPT, Perplexity and Google AI Overviews now decide which sites
          get cited — and clicks are shifting fast. AEO Radar shows you where
          you stand and how to get quoted.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/llms-txt-generator"
            className="rounded-lg bg-blue-700 text-white px-6 py-3 font-medium hover:bg-blue-800"
          >
            Try the free llms.txt Generator
          </Link>
          <a
            href="#why"
            className="rounded-lg border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
          >
            Why it matters
          </a>
        </div>
        <p className="text-sm text-slate-500 mt-4">
          Free · No signup · Runs entirely in your browser
        </p>
      </section>

      {/* Why */}
      <section id="why" className="py-10 border-t border-slate-100">
        <h2 className="text-2xl font-semibold text-center mb-8">
          AI answers are the new front page
        </h2>
        <div className="grid gap-6 sm:grid-cols-3 text-center">
          <div className="rounded-xl border border-slate-200 p-6">
            <div className="text-3xl font-bold text-blue-700 mb-2">−34.5%</div>
            <p className="text-sm text-slate-600">
              Click-through loss for the #1 organic result when Google shows an
              AI Overview.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-6">
            <div className="text-3xl font-bold text-blue-700 mb-2">73%</div>
            <p className="text-sm text-slate-600">
              Share of B2B sites reporting significant organic traffic losses
              in 2024–2025.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-6">
            <div className="text-3xl font-bold text-blue-700 mb-2">5 min</div>
            <p className="text-sm text-slate-600">
              Time it takes to make your site AI-readable with our free
              llms.txt generator.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400 text-center mt-4">
          Sources: industry CTR studies 2025; Search Engine Journal; see our
          blog for citations.
        </p>
      </section>

      {/* Tools */}
      <section className="py-10 border-t border-slate-100">
        <h2 className="text-2xl font-semibold mb-6">Free tools</h2>
        <Link
          href="/llms-txt-generator"
          className="block rounded-xl border border-slate-200 p-6 hover:border-blue-400 hover:shadow-sm transition"
        >
          <h3 className="font-semibold text-lg mb-1">
            Free llms.txt Generator
          </h3>
          <p className="text-slate-600 text-sm">
            Create a llms.txt file so AI assistants that support the standard
            can understand and cite your site. Nothing is uploaded — the file
            is built in your browser.
          </p>
        </Link>
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 opacity-70">
          <h3 className="font-semibold text-lg mb-1">
            AI Visibility Checker — coming soon
          </h3>
          <p className="text-slate-600 text-sm">
            Check which keywords trigger AI Overviews, who gets cited, and
            whether it&apos;s you. Join the waitlist by watching this space.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 border-t border-slate-100">
        <h2 className="text-2xl font-semibold mb-6">Straight answers</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">Does llms.txt actually work?</h3>
            <p className="text-slate-600 text-sm mt-1">
              Honestly: Google Search does not use it, and adoption by major AI
              crawlers is still unproven. It&apos;s a cheap, five-minute hedge
              — it can&apos;t hurt. We tell you the same on the tool page,
              because trust beats hype.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Is anything uploaded when I use the tool?</h3>
            <p className="text-slate-600 text-sm mt-1">
              No. The generator runs entirely in your browser. There is no
              account, no server call, no tracking of your input.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">What is AEO?</h3>
            <p className="text-slate-600 text-sm mt-1">
              Answer Engine Optimization: structuring your content so AI
              assistants can find, trust and cite it — not just rank it. Our
              guides cover the playbook step by step.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
