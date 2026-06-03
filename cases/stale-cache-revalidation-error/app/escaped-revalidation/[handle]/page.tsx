import Link from 'next/link';
import { Suspense } from 'react';
import { EscapedControls } from '../escaped-controls';
import { EscapedProfilePanel } from '../escaped-profile';

export const unstable_prefetch = 'force-runtime';

type PageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ 'normal-error'?: string }>;
};

export default function EscapedRevalidationPage({ params, searchParams }: PageProps) {
  return (
    <main className="page">
      <Link href="/">Back</Link>
      <Suspense fallback={<div className="panel muted">Loading repro...</div>}>
        <EscapedRevalidationRepro params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function EscapedRevalidationRepro({ params, searchParams }: PageProps) {
  const { handle } = await params;
  const query = await searchParams;

  if (query['normal-error'] === '1') {
    throw new Error('Normal render error caught by the route error boundary.');
  }

  return (
    <>
      <h1>Escaped cached failure</h1>
      <p className="muted">
        The normal throw renders <span className="mono">error.tsx</span>. The cached revalidation throw escapes to the
        server log instead.
      </p>
      <EscapedControls handle={handle} />

      <Suspense fallback={<div className="panel muted">Loading cached value...</div>}>
        <EscapedProfilePanel handle={handle} />
      </Suspense>
    </>
  );
}
