import Link from 'next/link';
import { Suspense } from 'react';
import { ReproControls } from '../repro-controls';
import { StaleProfilePanel } from '../stale-profile';

export const unstable_prefetch = 'force-runtime';

type PageProps = {
  params: Promise<{ handle: string }>;
};

export default function Page({ params }: PageProps) {
  return (
    <main className="page">
      <Link href="/">Back</Link>
      <p className="muted">Stale revalidation repro</p>
      <Suspense fallback={<div className="panel muted">Loading stale revalidation repro...</div>}>
        <StaleRevalidationRepro params={params} />
      </Suspense>
    </main>
  );
}

async function StaleRevalidationRepro({ params }: PageProps) {
  const { handle } = await params;

  return (
    <>
      <h1>@{handle}</h1>
      <p className="muted">
        Warm the cache, mark the backing source as rate-limited, wait at least one second, then refresh this route. The
        cached value should stay visible while the stale revalidation failure is handled.
      </p>
      <ReproControls handle={handle} redirectTo={`/stale-revalidate/${handle}`} />

      <StaleProfilePanel handle={handle} />
    </>
  );
}
