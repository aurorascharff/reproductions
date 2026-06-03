import Link from 'next/link';
import { Suspense } from 'react';
import { ReproControls } from '../../stale-revalidate/repro-controls';
import { StaleProfilePanel } from '../../stale-revalidate/stale-profile';

type PageProps = {
  params: Promise<{ handle: string }>;
};

export default function Page(props: PageProps) {
  const { params } = props;
  return (
    <main className="page">
      <Link href="/">Back</Link>
      <p className="muted">Stale revalidation control</p>
      <Suspense fallback={<div className="panel muted">Loading stale revalidation control...</div>}>
        <StaleRevalidationControl params={params} />
      </Suspense>
    </main>
  );
}

async function StaleRevalidationControl({ params }: PageProps) {
  const { handle } = await params;

  return (
    <>
      <h1>@{handle}</h1>
      <p className="muted">
        Same cached function and same failing revalidation path, but this route does not export force-runtime prefetch.
      </p>
      <ReproControls handle={handle} redirectTo={`/stale-revalidate-control/${handle}`} />
      <StaleProfilePanel handle={handle} />
    </>
  );
}
