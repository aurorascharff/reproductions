'use client';

import { failNextStaleRevalidation, resetStaleProfileAction, warmStaleProfile } from './actions';

type ReproControlsProps = {
  handle: string;
  redirectTo: string;
};

export function ReproControls({ handle, redirectTo }: ReproControlsProps) {
  return (
    <div className="actions">
      <form action={warmStaleProfile}>
        <input name="handle" type="hidden" value={handle} />
        <input name="redirectTo" type="hidden" value={redirectTo} />
        <button type="submit">Warm success</button>
      </form>
      <form action={failNextStaleRevalidation}>
        <input name="handle" type="hidden" value={handle} />
        <input name="redirectTo" type="hidden" value={redirectTo} />
        <button type="submit">Make revalidation fail</button>
      </form>
      <form action={resetStaleProfileAction}>
        <input name="handle" type="hidden" value={handle} />
        <input name="redirectTo" type="hidden" value={redirectTo} />
        <button type="submit">Reset</button>
      </form>
    </div>
  );
}
