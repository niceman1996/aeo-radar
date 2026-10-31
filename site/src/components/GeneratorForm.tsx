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
            ? {
                ...s,
                links: s.links.map((l, j) =>
                  j === li ? { ...l, ...patch } : l
                ),
              }
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
      prev.map((s, i) =>
        i === si ? { ...s, links: [...s.links, emptyLink()] } : s
      )
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
          <legend className="font-semibold mb-2">Sections &amp; links</legend>
          <div className="space-y-4">
            {sections.map((s, si) => (
              <div key={si} className="rounded border border-slate-200 p-3">
                <div className="flex gap-2 items-center mb-2">
                  <input
                    className={inputCls}
                    placeholder="Section title"
                    value={s.title}
                    onChange={(e) =>
                      updateSection(si, { title: e.target.value })
                    }
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
                      onChange={(e) =>
                        updateLink(si, li, { title: e.target.value })
                      }
                    />
                    <input
                      className={inputCls}
                      placeholder="https://example.com/page"
                      type="url"
                      value={l.url}
                      onChange={(e) =>
                        updateLink(si, li, { url: e.target.value })
                      }
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
