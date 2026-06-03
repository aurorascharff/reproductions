'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EscapedRevalidationError({ error, reset }: ErrorProps) {
  const pathname = usePathname();
  const router = useRouter();

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
          <button
            type="button"
            onClick={() => {
              router.replace(pathname as Route);
              reset();
            }}
          >
            Reset boundary
          </button>
        </div>
      </div>
    </main>
  );
}
