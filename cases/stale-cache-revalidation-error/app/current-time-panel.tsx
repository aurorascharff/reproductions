import { cacheLife } from 'next/cache';

function readCurrentTimeDuringRender(handle: string) {
  return {
    generatedAt: Date.now(),
    handle,
  };
}

async function readCurrentTimeInCache(handle: string) {
  'use cache';
  cacheLife({ expire: 3600, revalidate: 3600, stale: 60 });

  return {
    generatedAt: Date.now(),
    handle,
  };
}

export async function CurrentTimePanel(props: { handle: string }) {
  const profile = readCurrentTimeDuringRender(props.handle);

  return (
    <div className="panel">
      <p className="muted">Uncached render path</p>
      <h1>@{profile.handle}</h1>
      <p>
        <span className="mono">Date.now():</span> {profile.generatedAt}
      </p>
    </div>
  );
}

export async function CachedCurrentTimePanel(props: { handle: string }) {
  const profile = await readCurrentTimeInCache(props.handle);

  return (
    <div className="panel">
      <p className="muted">Cached render path</p>
      <h1>@{profile.handle}</h1>
      <p>
        <span className="mono">Date.now():</span> {profile.generatedAt}
      </p>
    </div>
  );
}
