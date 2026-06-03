'use client';

import { armEscapedProfileFailure, resetEscapedProfileAction, throwNormalProfileError, warmEscapedProfile } from './actions';

type EscapedControlsProps = {
  handle: string;
};

export function EscapedControls({ handle }: EscapedControlsProps) {
  return (
    <div className="panel">
      <ol>
        <li>Click Normal throw. It should render the route error boundary.</li>
        <li>Go back, then Reset, Warm success, Arm escaped failure.</li>
        <li>Wait one second and refresh. The failure should appear in the server log, not this boundary.</li>
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
