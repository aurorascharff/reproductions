import Link from 'next/link';
import { Suspense } from 'react';
import { CurrentTimePanel } from '../../current-time-panel';

export const unstable_prefetch = 'force-runtime';

export default function CurrentTimePage(props: PageProps<'/current-time/[handle]'>) {
  return (
    <main className="page">
      <Link className="muted" href="/">
        ← Back
      </Link>
      <Suspense fallback={<div className="panel muted">Loading current time payload...</div>}>
        {props.params.then(params => (
          <CurrentTimePanel handle={params.handle} />
        ))}
      </Suspense>
    </main>
  );
}
