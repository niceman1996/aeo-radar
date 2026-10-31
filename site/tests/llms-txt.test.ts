import { describe, it, expect } from "vitest";
import { generateLlmsTxt } from "../src/lib/llms-txt";

describe("generateLlmsTxt", () => {
  it("throws when name is empty", () => {
    expect(() =>
      generateLlmsTxt({ name: "", description: "d", sections: [] })
    ).toThrow("name is required");
  });

  it("renders full document with blockquote, details and sections", () => {
    const out = generateLlmsTxt({
      name: "Acme Docs",
      description: "Developer documentation for Acme.",
      details: "All docs are under CC-BY.",
      sections: [
        {
          title: "Guides",
          links: [
            {
              title: "Quickstart",
              url: "https://acme.com/quickstart",
              description: "Get running in 5 minutes",
            },
          ],
        },
      ],
    });
    expect(out).toBe(
      [
        "# Acme Docs",
        "",
        "> Developer documentation for Acme.",
        "",
        "All docs are under CC-BY.",
        "",
        "## Guides",
        "- [Quickstart](https://acme.com/quickstart): Get running in 5 minutes",
      ].join("\n")
    );
  });

  it("omits blockquote when description is empty", () => {
    const out = generateLlmsTxt({
      name: "X",
      description: "",
      sections: [],
    });
    expect(out).toBe("# X");
  });

  it("omits details when undefined or blank", () => {
    const withUndefined = generateLlmsTxt({
      name: "X",
      description: "d",
      sections: [],
    });
    const withBlank = generateLlmsTxt({
      name: "X",
      description: "d",
      details: "   ",
      sections: [],
    });
    expect(withUndefined).toBe("# X\n\n> d");
    expect(withBlank).toBe("# X\n\n> d");
  });

  it("omits link description when missing", () => {
    const out = generateLlmsTxt({
      name: "X",
      description: "d",
      sections: [
        { title: "S", links: [{ title: "Home", url: "https://x.com" }] },
      ],
    });
    expect(out).toContain("- [Home](https://x.com)");
    expect(out).not.toContain("- [Home](https://x.com):");
  });

  it("omits empty sections", () => {
    const out = generateLlmsTxt({
      name: "X",
      description: "d",
      sections: [
        { title: "Empty", links: [] },
        {
          title: "Real",
          links: [{ title: "A", url: "https://x.com/a" }],
        },
      ],
    });
    expect(out).not.toContain("Empty");
    expect(out).toContain("## Real");
  });
});
