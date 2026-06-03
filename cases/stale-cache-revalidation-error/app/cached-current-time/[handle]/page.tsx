import Link from 'next/link';
import { Suspense } from 'react';
import { CachedCurrentTimePanel } from '../../current-time-panel';

export const unstable_prefetch = 'force-runtime';

export default function CachedCurrentTimePage(props: PageProps<'/cached-current-time/[handle]'>) {
  return (
    <main className="page">
      <Link className="muted" href="/">
        ← Back
      </Link>
      <Suspense fallback={<div className="panel muted">Loading cached current time payload...</div>}>
        {props.params.then(params => (
          <CachedCurrentTimePanel handle={params.handle} />
        ))}
      </Suspense>
    </main>
  );
}
