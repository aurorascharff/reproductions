import Link from 'next/link';
import { Suspense } from 'react';
import { FlakyProfilePanel } from '../flaky-profile';
import { regenerateFlakyProfile, resetFlakyProfileAction } from '../actions';

export const unstable_prefetch = 'force-runtime';

export default function FlakyProfilePage(props: PageProps<'/flaky/[handle]'>) {
  return (
    <main className="page">
      <Link className="muted" href="/">
        ← Back
      </Link>
      <p className="muted">force-runtime prefetch + cached throw/success repro</p>
      <Suspense fallback={<div className="panel muted">Loading flaky profile...</div>}>
        {props.params.then(params => (
          <>
            <FlakyProfilePanel handle={params.handle} />
            <FlakyProfileActions handle={params.handle} />
          </>
        ))}
      </Suspense>
    </main>
  );
}

function FlakyProfileActions(props: { handle: string }) {
  return (
    <div className="actions">
      <form action={regenerateFlakyProfile}>
        <input name="handle" type="hidden" value={props.handle} />
        <button type="submit">Regenerate and warm cache</button>
      </form>
      <form action={resetFlakyProfileAction}>
        <input name="handle" type="hidden" value={props.handle} />
        <button type="submit">Reset to first-request failure</button>
      </form>
    </div>
  );
}
