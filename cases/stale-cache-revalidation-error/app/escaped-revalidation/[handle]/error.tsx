'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { EscapedControls } from '../escaped-controls';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EscapedRevalidationError({ error, reset }: ErrorProps) {
  const { handle } = useParams<{ handle?: string }>();

  return (
    <main className="page">
      <Link href="/">Back</Link>
      <p className="muted">Escaped revalidation repro</p>
      <h1>Route error boundary</h1>
      <div className="panel">
        <p>
          If you see only this page, the error was caught by <span className="mono">error.tsx</span>. The app-break
          symptom is different: the request fails or the process exits before this boundary can contain the failure.
        </p>
        <p>{error.message}</p>
        {error.digest ? (
          <p className="muted">
            <span className="mono">digest:</span> {error.digest}
          </p>
        ) : null}
        {handle ? <EscapedControls handle={handle} /> : null}
        <div className="actions">
          <button type="button" onClick={reset}>
            Reset boundary
          </button>
        </div>
      </div>
    </main>
  );
}
