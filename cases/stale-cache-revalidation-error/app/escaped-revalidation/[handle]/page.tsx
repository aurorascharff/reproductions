import Link from 'next/link';
import { Suspense } from 'react';
import { EscapedControls } from '../escaped-controls';
import { EscapedProfilePanel } from '../escaped-profile';

export const unstable_prefetch = 'force-runtime';

type PageProps = {
  params: Promise<{ handle: string }>;
};

export default function EscapedRevalidationPage({ params }: PageProps) {
  return (
    <main className="page">
      <Link href="/">Back</Link>
      <Suspense fallback={<div className="panel muted">Loading repro...</div>}>
        <EscapedRevalidationRepro params={params} />
      </Suspense>
    </main>
  );
}

async function EscapedRevalidationRepro({ params }: PageProps) {
  const { handle } = await params;

  return (
    <>
      <h1>Escaped cached failure</h1>
      <p className="muted">
        Warm a cached value, arm a deterministic async failure, wait one second, then refresh. Expected: the route error
        boundary catches it or the stale value remains. Actual: the response can fail before the boundary contains it.
      </p>
      <EscapedControls handle={handle} />

      <Suspense fallback={<div className="panel muted">Loading cached value...</div>}>
        <EscapedProfilePanel handle={handle} />
      </Suspense>
    </>
  );
}
