'use client';

import Link from 'next/link';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EscapedRevalidationError({ error, reset }: ErrorProps) {
  return (
    <main className="page">
      <Link href="/">Back</Link>
      <h1>Route error boundary</h1>
      <div className="panel">
        <p>This boundary caught a normal render error.</p>
        <p className="mono">{error.message}</p>
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
