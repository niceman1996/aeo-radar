export interface LlmsTxtLink {
  title: string;
  url: string;
  description?: string;
}

export interface LlmsTxtSection {
  title: string;
  links: LlmsTxtLink[];
}

export interface LlmsTxtInput {
  name: string;
  description: string;
  details?: string;
  sections: LlmsTxtSection[];
}

function isBlank(s: string): boolean {
  return s.trim() === "";
}

export function generateLlmsTxt(input: LlmsTxtInput): string {
  if (isBlank(input.name)) {
    throw new Error("name is required");
  }

  const lines: string[] = [`# ${input.name}`];

  const description = input.description.trim();
  if (description) {
    lines.push("", `> ${description}`);
  }

  const details = input.details?.trim();
  if (details) {
    lines.push("", details);
  }

  for (const section of input.sections) {
    if (section.links.length === 0) continue;
    lines.push("", `## ${section.title}`);
    for (const link of section.links) {
      const desc = link.description?.trim();
      lines.push(`- [${link.title}](${link.url})${desc ? `: ${desc}` : ""}`);
    }
  }

  return lines.join("\n");
}
