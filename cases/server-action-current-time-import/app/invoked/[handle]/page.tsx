import { Suspense } from 'react';
import { actionWithCurrentTime } from '../../actions';

type Params = {
  handle: string;
};

export const unstable_prefetch = 'force-runtime';

export default function InvokedPage({ params }: { params: Promise<Params> }) {
  return (
    <main className="page">
      <Suspense fallback={<div className="panel muted">Loading invoked route...</div>}>
        {params.then(async ({ handle }) => <InvokedPanel handle={handle} />)}
      </Suspense>
    </main>
  );
}

async function InvokedPanel({ handle }: { handle: string }) {
  await actionWithCurrentTime();

  return (
    <>
      <h1>Invoked during render: {handle}</h1>
      <p className="muted">This route intentionally calls the action during render.</p>
    </>
  );
}
