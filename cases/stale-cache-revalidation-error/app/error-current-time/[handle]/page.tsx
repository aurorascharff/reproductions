import Link from 'next/link';
import type { Route } from 'next';
import { Suspense } from 'react';

type ErrorCurrentTimePageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ throw?: string }>;
};

export default function ErrorCurrentTimePage(props: ErrorCurrentTimePageProps) {
  return (
    <main className="page">
      <Link className="muted" href="/">
        ← Back
      </Link>
      <Suspense fallback={<div className="panel muted">Loading repro...</div>}>
        <ErrorCurrentTimeContent params={props.params} searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function ErrorCurrentTimeContent(props: ErrorCurrentTimePageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  if (searchParams.throw === '1') {
    throw new Error('This route intentionally renders error.tsx.');
  }

  return (
    <>
      <h1>Current time in error.tsx</h1>
      <div className="panel">
        <p>
          Open the failing route to render <span className="mono">error.tsx</span>. The boundary contains{' '}
          <span className="mono">Date.now()</span>, so the build can pass while runtime prerendering fails when the
          boundary is reached.
        </p>
        <p>
          <Link href={`/error-current-time/${params.handle}?throw=1` as Route}>Open failing route</Link>
        </p>
      </div>
    </>
  );
}
