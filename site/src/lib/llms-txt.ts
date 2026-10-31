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

function isBlank(s: string | undefined): boolean {
  return !s || s.trim() === "";
}

export function generateLlmsTxt(input: LlmsTxtInput): string {
  if (isBlank(input.name)) {
    throw new Error("name is required");
  }

  const lines: string[] = [`# ${input.name}`];

  if (!isBlank(input.description)) {
    lines.push("", `> ${input.description.trim()}`);
  }

  if (!isBlank(input.details)) {
    lines.push("", input.details.trim());
  }

  for (const section of input.sections) {
    if (section.links.length === 0) continue;
    lines.push("", `## ${section.title}`);
    for (const link of section.links) {
      const desc = isBlank(link.description)
        ? ""
        : `: ${link.description.trim()}`;
      lines.push(`- [${link.title}](${link.url})${desc}`);
    }
  }

  return lines.join("\n");
}
