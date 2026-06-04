'use client';

import Link from 'next/link';

const moduleRenderedAt = Date.now();

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorCurrentTimeBoundary({ error, reset }: ErrorProps) {
  const renderedAt = Date.now();

  return (
    <main className="page">
      <Link className="muted" href="/">
        ← Back
      </Link>
      <h1>Error boundary with current time</h1>
      <div className="panel">
        <p className="mono">{error.message}</p>
        <p>
          <span className="mono">Date.now():</span> {renderedAt}
        </p>
        <p>
          <span className="mono">module Date.now():</span> {moduleRenderedAt}
        </p>
        {error.digest ? (
          <p className="muted">
            <span className="mono">digest:</span> {error.digest}
          </p>
        ) : null}
        <div className="actions">
          <button type="button" onClick={reset}>
            Reset boundary
          </button>
        </div>
      </div>
    </main>
  );
}
