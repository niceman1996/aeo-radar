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
          Upload it to your site root:{" "}
          <code>https://yoursite.com/llms.txt</code>.
        </li>
        <li>
          Optionally also publish an expanded <code>llms-full.txt</code> with
          full page contents.
        </li>
      </ol>
    </div>
  );
}
