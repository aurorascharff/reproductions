import type { ReactNode } from "react";
import { HydrationStatus } from "./hydration-status";

export function CaseLayout({
  title,
  summary,
  facts,
  children,
}: {
  title: string;
  summary: string;
  facts: string[];
  children: ReactNode;
}) {
  return (
    <main className="case-page">
      <a className="back" href="/">
        ← All cases
      </a>
      <header className="case-header">
        <p className="eyebrow">Hydration case</p>
        <h1>{title}</h1>
        <p className="case-intro">{summary}</p>
        <ul className="facts">
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </header>
      <section className="demo">
        <p className="demo-label">Rendered value</p>
        {children}
        <HydrationStatus />
      </section>
    </main>
  );
}
