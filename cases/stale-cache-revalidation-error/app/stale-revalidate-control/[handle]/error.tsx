'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ReproControls } from '../../stale-revalidate/repro-controls';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  const params = useParams<{ handle?: string }>();
  const handle = params.handle;

  return (
    <main className="page">
      <Link href="/">Back</Link>
      <p className="muted">Stale revalidation control</p>
      <h1>Error boundary</h1>
      <div className="panel">
        <p>{error.message}</p>
        {error.digest ? (
          <p className="muted">
            <span className="mono">digest:</span> {error.digest}
          </p>
        ) : null}
        {handle ? <ReproControls handle={handle} redirectTo={`/stale-revalidate-control/${handle}`} /> : null}
        <div className="actions">
          <button type="button" onClick={reset}>
            Reset boundary
          </button>
        </div>
      </div>
    </main>
  );
}
