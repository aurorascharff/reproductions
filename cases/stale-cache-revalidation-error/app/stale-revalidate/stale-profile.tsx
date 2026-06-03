import { cacheLife, cacheTag } from 'next/cache';

type StaleProfile = {
  attempt: number;
  generatedAt: Date;
  handle: string;
  status: 'fallback' | 'success';
};

class UpstreamRevalidationError extends Error {
  status = 503;

  constructor() {
    super('Deterministic upstream failure during cache revalidation.');
  }
}

const attempts = new Map<string, number>();
const shouldFail = new Set<string>();

export function makeStaleProfileFail(handle: string) {
  shouldFail.add(handle.toLowerCase());
}

export function makeStaleProfileSucceed(handle: string) {
  shouldFail.delete(handle.toLowerCase());
}

export function resetStaleProfile(handle: string) {
  const lower = handle.toLowerCase();
  attempts.delete(lower);
  attempts.delete(`fallback:${lower}`);
  shouldFail.delete(lower);
}

export async function getStaleProfile(handle: string): Promise<StaleProfile> {
  'use cache';
  cacheTag(`stale-profile-${handle}`);
  cacheLife({ expire: 3600, revalidate: 1, stale: 1 });

  const lower = handle.toLowerCase();
  const attempt = (attempts.get(lower) ?? 0) + 1;
  attempts.set(lower, attempt);

  if (shouldFail.has(lower)) {
    throw new UpstreamRevalidationError();
  }

  return {
    attempt,
    generatedAt: new Date(),
    handle: lower,
    status: 'success',
  };
}

export async function StaleProfilePanel({ handle }: { handle: string }) {
  const profile = await getStaleProfile(handle);

  return (
    <div className="panel">
      <p className="muted">Cached profile payload with 1s revalidate</p>
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

export async function getFallbackStaleProfile(handle: string): Promise<StaleProfile> {
  'use cache';
  cacheTag(`fallback-stale-profile-${handle}`);
  cacheLife({ expire: 3600, revalidate: 1, stale: 1 });

  const lower = handle.toLowerCase();
  const attempt = (attempts.get(`fallback:${lower}`) ?? 0) + 1;
  attempts.set(`fallback:${lower}`, attempt);

  if (shouldFail.has(lower)) {
    return {
      attempt,
      generatedAt: new Date(),
      handle: lower,
      status: 'fallback',
    };
  }

  return {
    attempt,
    generatedAt: new Date(),
    handle: lower,
    status: 'success',
  };
}

export async function FallbackStaleProfilePanel({ handle }: { handle: string }) {
  const profile = await getFallbackStaleProfile(handle);

  return (
    <div className="panel">
      <p className="muted">Cached profile payload that catches the deterministic upstream error and returns fallback data</p>
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
