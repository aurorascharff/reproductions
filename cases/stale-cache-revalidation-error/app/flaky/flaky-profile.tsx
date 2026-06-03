import { cacheLife, cacheTag } from 'next/cache';

type FlakyProfile = {
  generatedAt: Date;
  handle: string;
  attempt: number;
};

class GitHubRateLimitError extends Error {
  status = 403;

  constructor() {
    super('GitHub rate limit hit. Try again in a minute.');
  }
}

const attempts = new Map<string, number>();
const ready = new Set<string>();

export function markFlakyProfileReady(handle: string) {
  ready.add(handle.toLowerCase());
}

export function resetFlakyProfile(handle: string) {
  const lower = handle.toLowerCase();
  attempts.delete(lower);
  ready.delete(lower);
}

export async function getFlakyProfile(handle: string): Promise<FlakyProfile> {
  'use cache';
  cacheTag(`flaky-profile-${handle}`);
  cacheLife({ expire: 3600, revalidate: 3600, stale: 60 });

  const lower = handle.toLowerCase();
  const attempt = (attempts.get(lower) ?? 0) + 1;
  attempts.set(lower, attempt);

  if (!ready.has(lower) && attempt === 1) {
    throw new GitHubRateLimitError();
  }

  return {
    attempt,
    generatedAt: new Date(),
    handle: lower,
  };
}

export async function FlakyProfilePanel(props: { handle: string }) {
  const profile = await getFlakyProfile(props.handle);

  return (
    <div className="panel">
      <p className="muted">Cached profile payload</p>
      <h1>@{profile.handle}</h1>
      <p>
        <span className="mono">generatedAt:</span> {profile.generatedAt.toISOString()}
      </p>
      <p>
        <span className="mono">attempt:</span> {profile.attempt}
      </p>
    </div>
  );
}
