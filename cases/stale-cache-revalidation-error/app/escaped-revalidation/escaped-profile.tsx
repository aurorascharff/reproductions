import { cacheLife, cacheTag } from 'next/cache';

type EscapedProfile = {
  attempt: number;
  handle: string;
  status: 'success';
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
    throw new EscapedRevalidationError();
  }

  return {
    attempt,
    handle: lower,
    status: 'success',
  };
}

export async function EscapedProfilePanel({ handle }: { handle: string }) {
  const profile = await getEscapedProfile(handle);

  return (
    <div className="panel">
      <p className="muted">Cached value</p>
      <h2>@{profile.handle}</h2>
      <p className="mono">attempt {profile.attempt}</p>
      <p className="mono">status {profile.status}</p>
    </div>
  );
}
