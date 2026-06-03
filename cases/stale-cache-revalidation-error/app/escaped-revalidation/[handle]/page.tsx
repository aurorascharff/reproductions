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
      <p className="muted">Escaped revalidation repro</p>
      <Suspense fallback={<div className="panel muted">Loading escaped revalidation repro...</div>}>
        <EscapedRevalidationRepro params={params} />
      </Suspense>
    </main>
  );
}

async function EscapedRevalidationRepro({ params }: PageProps) {
  const { handle } = await params;

  return (
    <>
      <h1>@{handle}</h1>
      <p className="muted">
        This route demonstrates the failure mode where cached async work escapes the route error boundary and can break
        the whole response instead of rendering a contained error UI.
      </p>
      <EscapedControls handle={handle} />

      <div className="panel stable">
        <h2>Stable sibling UI</h2>
        <p>
          This section does not read the cached profile. If the failure were contained by a nearby boundary, this shell
          would keep rendering. When the request or process is interrupted, this stable UI is lost too.
        </p>
      </div>

      <Suspense fallback={<div className="panel muted">Loading cached profile region...</div>}>
        <EscapedProfilePanel handle={handle} />
      </Suspense>
    </>
  );
}
