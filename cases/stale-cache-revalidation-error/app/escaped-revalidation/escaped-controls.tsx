'use client';

import { armEscapedProfileFailure, resetEscapedProfileAction, warmEscapedProfile } from './actions';

type EscapedControlsProps = {
  handle: string;
};

export function EscapedControls({ handle }: EscapedControlsProps) {
  return (
    <>
      <div className="panel steps">
        <h2>How to reproduce the app break</h2>
        <ol>
          <li>Click <strong>Reset</strong>.</li>
          <li>Click <strong>Warm success</strong> to write a good cached value.</li>
          <li>Click <strong>Arm escaped failure</strong>.</li>
          <li>Wait at least one second so the cache entry becomes stale.</li>
          <li>Refresh this page in <span className="mono">next start</span> or production.</li>
        </ol>
      </div>
      <div className="panel warning">
        <h2>What this route is proving</h2>
        <p>
          The page has stable UI and a route <span className="mono">error.tsx</span>. A normal render error should be
          contained by that boundary. The escaped async failure happens outside that boundary path, so the visible
          symptom is a request or process-level failure instead of a contained fallback.
        </p>
      </div>
      <div className="actions">
        <form action={warmEscapedProfile}>
          <input name="handle" type="hidden" value={handle} />
          <button type="submit">Warm success</button>
        </form>
        <form action={armEscapedProfileFailure}>
          <input name="handle" type="hidden" value={handle} />
          <button type="submit">Arm escaped failure</button>
        </form>
        <form action={resetEscapedProfileAction}>
          <input name="handle" type="hidden" value={handle} />
          <button type="submit">Reset</button>
        </form>
      </div>
    </>
  );
}
