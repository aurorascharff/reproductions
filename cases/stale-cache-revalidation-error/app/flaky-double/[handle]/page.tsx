import Link from 'next/link';
import { Suspense } from 'react';
import { FlakyProfilePanel } from '../../flaky/flaky-profile';
import { regenerateFlakyProfile, resetFlakyProfileAction } from '../../flaky/actions';

export const unstable_prefetch = 'force-runtime';

export default function FlakyDoubleProfilePage(props: PageProps<'/flaky-double/[handle]'>) {
  return (
    <main className="page">
      <Link className="muted" href="/">
        ← Back
      </Link>
      <p className="muted">force-runtime prefetch + two sibling cached profile reads</p>
      <Suspense fallback={<div className="panel muted">Loading first profile region...</div>}>
        {props.params.then(params => <FlakyProfilePanel handle={params.handle} />)}
      </Suspense>
      <Suspense fallback={<div className="panel muted">Loading second profile region...</div>}>
        {props.params.then(params => <FlakyProfilePanel handle={params.handle} />)}
      </Suspense>
      <Suspense fallback={<div className="actions muted">Loading actions...</div>}>
        {props.params.then(params => <FlakyDoubleActions handle={params.handle} />)}
      </Suspense>
    </main>
  );
}

function FlakyDoubleActions(props: { handle: string }) {
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
