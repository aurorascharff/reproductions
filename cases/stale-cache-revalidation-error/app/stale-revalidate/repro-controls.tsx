'use client';

import { failNextStaleRevalidation, resetStaleProfileAction, warmStaleProfile } from './actions';

type ReproControlsProps = {
  handle: string;
  redirectTo: string;
};

export function ReproControls({ handle, redirectTo }: ReproControlsProps) {
  return (
    <>
      <div className="panel steps">
        <h2>How to reproduce</h2>
        <ol>
          <li>Click <strong>Reset</strong> to clear this handle.</li>
          <li>Click <strong>Warm success</strong> to write a good cached value.</li>
          <li>Click <strong>Make source throw</strong> to make the backing source fail deterministically.</li>
          <li>Wait at least one second so the cache entry becomes stale.</li>
          <li>Refresh this page.</li>
        </ol>
      </div>
      <div className="actions">
        <form action={warmStaleProfile}>
          <input name="handle" type="hidden" value={handle} />
          <input name="redirectTo" type="hidden" value={redirectTo} />
          <button type="submit">Warm success</button>
        </form>
        <form action={failNextStaleRevalidation}>
          <input name="handle" type="hidden" value={handle} />
          <input name="redirectTo" type="hidden" value={redirectTo} />
          <button type="submit">Make source throw</button>
        </form>
        <form action={resetStaleProfileAction}>
          <input name="handle" type="hidden" value={handle} />
          <input name="redirectTo" type="hidden" value={redirectTo} />
          <button type="submit">Reset</button>
        </form>
      </div>
    </>
  );
}
