import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page">
      <h1>Server Action current time import repro</h1>
      <p className="muted">
        Compare an import-only route with a route that intentionally invokes the action during render.
      </p>
      <div className="grid">
        <Link className="card" href="/import-only/alice">
          Import only
          <br />
          <span className="muted">Client Component imports the action.</span>
        </Link>
        <Link className="card" href="/invoked/alice">
          Invoked during render
          <br />
          <span className="muted">Server Component calls the action.</span>
        </Link>
      </div>
    </main>
  );
}

