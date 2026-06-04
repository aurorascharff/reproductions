'use client';

import { armEscapedProfileFailure, resetEscapedProfileAction, throwNormalProfileError, warmEscapedProfile } from './actions';

type EscapedControlsProps = {
  handle: string;
};

export function EscapedControls({ handle }: EscapedControlsProps) {
  return (
    <div className="panel">
      <ol>
        <li>Click Normal throw to confirm the route error boundary works.</li>
        <li>Reset, then Warm success to create a remote cached value.</li>
        <li>Arm escaped failure, wait one second, then refresh.</li>
        <li>The stale value stays visible, but the revalidation failure escapes in the server log.</li>
      </ol>
      <div className="actions">
        <form action={resetEscapedProfileAction}>
          <input name="handle" type="hidden" value={handle} />
          <button type="submit">Reset</button>
        </form>
        <form action={warmEscapedProfile}>
          <input name="handle" type="hidden" value={handle} />
          <button type="submit">Warm success</button>
        </form>
        <form action={throwNormalProfileError}>
          <input name="handle" type="hidden" value={handle} />
          <button type="submit">Normal throw</button>
        </form>
        <form action={armEscapedProfileFailure}>
          <input name="handle" type="hidden" value={handle} />
          <button type="submit">Arm escaped failure</button>
        </form>
      </div>
    </div>
  );
}
