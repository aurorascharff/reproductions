import Link from 'next/link';
import { Suspense } from 'react';
import { StringProfilePanel } from '../../string-profile-panel';

export const unstable_prefetch = 'force-runtime';

export default function StringPage(props: PageProps<'/string/[handle]'>) {
  return (
    <main className="page">
      <Link className="muted" href="/">
        ← Back
      </Link>
      <Suspense fallback={<div className="panel muted">Loading cached string payload...</div>}>
        {props.params.then(params => (
          <StringProfilePanel handle={params.handle} />
        ))}
      </Suspense>
    </main>
  );
}
