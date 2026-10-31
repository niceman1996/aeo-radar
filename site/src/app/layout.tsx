import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL("https://aeoradar.com"), // TODO: 域名确定后更新
  title: {
    default: "AEO Radar — Is Your Site Visible to AI Search?",
    template: "%s | AEO Radar",
  },
  description:
    "Check whether ChatGPT, Perplexity and Google AI Overviews cite your website. Free llms.txt generator available now, AI visibility tooling coming soon.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col max-w-3xl mx-auto w-full px-4 py-6 leading-relaxed text-slate-900 bg-white">
        <header className="mb-8">
          <a href="/" className="font-bold text-lg no-underline text-slate-900">
            AEO Radar
          </a>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mt-16 pt-6 border-t border-slate-200 text-sm text-slate-500">
          © 2026 AEO Radar. Your site, readable by AI.
        </footer>
      </body>
    </html>
  );
}
