import { cacheLife, cacheTag } from 'next/cache';

type EscapedProfile = {
  attempt: number;
  generatedAt: Date;
  handle: string;
  status: 'armed' | 'success';
};

class EscapedRevalidationError extends Error {
  status = 503;

  constructor() {
    super('Deterministic async failure escaped the route error boundary.');
  }
}

const attempts = new Map<string, number>();
const shouldEscape = new Set<string>();

export function armEscapedRevalidation(handle: string) {
  shouldEscape.add(handle.toLowerCase());
}

export function resetEscapedRevalidation(handle: string) {
  const lower = handle.toLowerCase();
  attempts.delete(lower);
  shouldEscape.delete(lower);
}

export async function getEscapedProfile(handle: string): Promise<EscapedProfile> {
  'use cache';
  cacheTag(`escaped-profile-${handle}`);
  cacheLife({ expire: 3600, revalidate: 1, stale: 1 });

  const lower = handle.toLowerCase();
  const attempt = (attempts.get(lower) ?? 0) + 1;
  attempts.set(lower, attempt);

  if (shouldEscape.has(lower)) {
    shouldEscape.delete(lower);
    setTimeout(() => {
      throw new EscapedRevalidationError();
    }, 0);

    return {
      attempt,
      generatedAt: new Date(),
      handle: lower,
      status: 'armed',
    };
  }

  return {
    attempt,
    generatedAt: new Date(),
    handle: lower,
    status: 'success',
  };
}

export async function EscapedProfilePanel({ handle }: { handle: string }) {
  const profile = await getEscapedProfile(handle);

  return (
    <div className="panel">
      <p className="muted">Cached region with 1s revalidate</p>
      <h1>@{profile.handle}</h1>
      <p>
        <span className="mono">generatedAt:</span> {profile.generatedAt.toISOString()}
      </p>
      <p>
        <span className="mono">attempt:</span> {profile.attempt}
      </p>
      <p>
        <span className="mono">status:</span> {profile.status}
      </p>
    </div>
  );
}
