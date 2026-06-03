import { Suspense } from 'react';
import { ActionForm } from '../../action-form';

type Params = {
  handle: string;
};

export const unstable_prefetch = 'force-runtime';

export default function ImportOnlyPage({ params }: { params: Promise<Params> }) {
  return (
    <main className="page">
      <Suspense fallback={<div className="panel muted">Loading import-only route...</div>}>
        {params.then(({ handle }) => (
          <>
            <h1>Import only: {handle}</h1>
            <p className="muted">
              This route renders a Client Component that imports a Server Action containing <code>new Date()</code>.
              The action is not invoked while rendering.
            </p>
            <div className="panel">
              <ActionForm handle={handle} />
            </div>
          </>
        ))}
      </Suspense>
    </main>
  );
}
