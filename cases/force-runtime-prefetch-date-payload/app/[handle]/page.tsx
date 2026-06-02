import Link from 'next/link';
import { Suspense } from 'react';
import { ProfilePanel } from '../profile-panel';

export const unstable_prefetch = 'force-runtime';

export default function ProfilePage(props: PageProps<'/[handle]'>) {
  return (
    <main className="page">
      <Link className="muted" href="/">
        ← Back
      </Link>
      <Suspense fallback={<div className="panel muted">Loading cached Date payload...</div>}>
        {props.params.then(params => (
          <ProfilePanel handle={params.handle} />
        ))}
      </Suspense>
    </main>
  );
}
