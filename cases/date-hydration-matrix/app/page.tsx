const cases = [
  {
    path: "/cases/01-direct-year",
    title: "Direct year, no Suspense",
    config: "Client · new Date().getFullYear() · instant default",
    result: "Prerender error",
    tone: "error",
  },
  {
    path: "/cases/02-direct-timestamp-suspense",
    title: "Direct timestamp with Suspense",
    config: "Client · Date.now() · Suspense · no io()",
    result: "Clean",
    tone: "clean",
  },
  {
    path: "/cases/03-io-timestamp-no-suspense",
    title: "io() timestamp, no Suspense",
    config: "Client · use(io()) · Date.now() · no boundary",
    result: "Missing-boundary error",
    tone: "error",
  },
  {
    path: "/cases/04-io-year-suspense",
    title: "io() year with Suspense",
    config: "Client · use(io()) · year · Suspense",
    result: "Clean",
    tone: "clean",
  },
  {
    path: "/cases/05-io-timestamp-suspense",
    title: "io() timestamp with Suspense",
    config: "Client · use(io()) · Date.now() · Suspense",
    result: "Clean",
    tone: "clean",
  },
  {
    path: "/cases/06-io-timestamp-instant-false",
    title: "io() timestamp with instant = false",
    config: "Client · use(io()) · Suspense · instant = false",
    result: "Clean; opt-out is unnecessary",
    tone: "clean",
  },
  {
    path: "/cases/07-connection-client-year",
    title: "connection() followed by client year",
    config: "Request render · Client · year · instant = false",
    result: "Looks clean by coincidence",
    tone: "warn",
  },
  {
    path: "/cases/08-connection-client-timestamp",
    title: "connection() followed by client timestamp",
    config: "Request render · Client · Date.now() · instant = false",
    result: "Hydration error",
    tone: "hydrate",
  },
  {
    path: "/cases/09-connection-io-timestamp",
    title: "connection() followed by client use(io())",
    config: "Request render · Client · use(io()) · Suspense · instant = false",
    result: "Hydration error",
    tone: "hydrate",
  },
  {
    path: "/cases/10-server-io-timestamp",
    title: "Server Component with await io()",
    config: "Server · await io() · Date.now() · Suspense",
    result: "Clean",
    tone: "clean",
  },
  {
    path: "/cases/11-connection-inside-suspense",
    title: "connection() inside Suspense",
    config: "Instant shell · request-rendered Client timestamp",
    result: "Hydration error",
    tone: "hydrate",
  },
  {
    path: "/cases/12-direct-timestamp-instant-false",
    title: "Direct timestamp with instant = false",
    config: "Client · Date.now() · no Suspense · instant = false",
    result: "Build fails; dev hydration error",
    tone: "error",
  },
  {
    path: "/cases/13-io-no-suspense-instant-false",
    title: "Unbounded io() with instant = false",
    config: "Client · use(io()) · no Suspense · instant = false",
    result: "Build fails; dev hydration error",
    tone: "error",
  },
] as const;

export default function Page() {
  return (
    <main className="dashboard">
      <header className="hero">
        <p className="eyebrow">Next.js Cache Components</p>
        <h1>Date and hydration matrix</h1>
        <p>
          Each link performs a full document navigation so the browser hydrates
          server HTML. Open DevTools to see hydration errors.
        </p>
      </header>

      <section className="grid" aria-label="Hydration cases">
        {cases.map((item, index) => (
          <a className="card" href={item.path} key={item.path}>
            <span className="case-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2>{item.title}</h2>
            <p>{item.config}</p>
            <strong className={`result ${item.tone}`}>{item.result}</strong>
          </a>
        ))}
      </section>
    </main>
  );
}
