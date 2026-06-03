'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { regenerateFlakyProfile, resetFlakyProfileAction } from '../actions';

export default function FlakyProfileError(props: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ handle?: string }>();
  const handle = params.handle ?? '';

  return (
    <main className="page">
      <Link className="muted" href="/">
        ← Back
      </Link>
      <div className="panel">
        <p className="muted">Route error boundary</p>
        <h1>Profile failed</h1>
        <p>{props.error.message}</p>
        {props.error.digest ? (
          <p className="muted">
            <span className="mono">digest:</span> {props.error.digest}
          </p>
        ) : null}
        <div className="actions">
          <button type="button" onClick={props.reset}>
            Reset boundary
          </button>
          <form action={regenerateFlakyProfile}>
            <input name="handle" type="hidden" value={handle} />
            <button type="submit">Regenerate and warm cache</button>
          </form>
          <form action={resetFlakyProfileAction}>
            <input name="handle" type="hidden" value={handle} />
            <button type="submit">Reset to first-request failure</button>
          </form>
        </div>
      </div>
    </main>
  );
}
