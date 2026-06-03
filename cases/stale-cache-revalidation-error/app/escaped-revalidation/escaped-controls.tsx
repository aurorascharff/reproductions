'use client';

import { armEscapedProfileFailure, resetEscapedProfileAction, warmEscapedProfile } from './actions';

type EscapedControlsProps = {
  handle: string;
};

export function EscapedControls({ handle }: EscapedControlsProps) {
  return (
    <div className="panel">
      <ol>
        <li>Reset</li>
        <li>Warm success</li>
        <li>Arm failure, wait one second, refresh</li>
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
        <form action={armEscapedProfileFailure}>
          <input name="handle" type="hidden" value={handle} />
          <button type="submit">Arm failure</button>
        </form>
      </div>
    </div>
  );
}
