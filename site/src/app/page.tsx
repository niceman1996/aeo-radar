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
          <a href="/llms-txt-generator" className="underline text-blue-700">
            Free llms.txt Generator
          </a>{" "}
          — create a llms.txt file so AI assistants can understand and cite
          your site.
        </li>
      </ul>
      <p className="italic text-slate-500">AI visibility checker coming soon.</p>
    </div>
  );
}
