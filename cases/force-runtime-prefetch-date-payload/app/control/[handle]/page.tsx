import Link from 'next/link';
import { Suspense } from 'react';
import { ProfilePanel } from '../../profile-panel';

export default function ControlPage(props: PageProps<'/control/[handle]'>) {
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
