import Link from 'next/link';
import { Suspense } from 'react';
import { ReproControls } from '../../stale-revalidate/repro-controls';
import { FallbackStaleProfilePanel } from '../../stale-revalidate/stale-profile';

export const unstable_prefetch = 'force-runtime';

type PageProps = {
  params: Promise<{ handle: string }>;
};

export default function Page({ params }: PageProps) {
  return (
    <main className="page">
      <Link href="/">Back</Link>
      <p className="muted">Cached fallback repro</p>
      <Suspense fallback={<div className="panel muted">Loading cached fallback repro...</div>}>
        <FallbackRevalidationRepro params={params} />
      </Suspense>
    </main>
  );
}

async function FallbackRevalidationRepro({ params }: PageProps) {
  const { handle } = await params;

  return (
    <>
      <h1>@{handle}</h1>
      <p className="muted">
        Same stale setup, but the cached function catches the rate-limit-shaped failure and returns fallback data.
        Refresh after the entry becomes stale to see whether the fallback replaces the previous success.
      </p>
      <ReproControls handle={handle} redirectTo={`/stale-revalidate-fallback/${handle}`} />

      <FallbackStaleProfilePanel handle={handle} />
    </>
  );
}
