import 'server-only';

// An "unbounded" list — stand-in for a user's playlist library in a sidebar.
// Every entry becomes a <Link prefetch={true}> in the layout, so every entry
// is in the viewport on load.
export const PLAYLISTS = Array.from({ length: 8 }, (_, i) => ({
  id: `pl-${i + 1}`,
  name: `Playlist ${i + 1}`,
}));

// A tiny concurrency limiter — stands in for a scarce server resource like a
// database connection pool. Real apps don't get unlimited parallelism: the
// per-link prefetch storm queues here, and so does the click the user actually
// makes. This is what turns "N extra requests" into "navigation is slow."
const POOL_SIZE = 1;
let inFlight = 0;
const waiters: Array<() => void> = [];

async function withConnection<T>(fn: () => Promise<T>): Promise<T> {
  if (inFlight >= POOL_SIZE) {
    await new Promise<void>(resolve => waiters.push(resolve));
  }
  inFlight++;
  try {
    return await fn();
  } finally {
    inFlight--;
    waiters.shift()?.();
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Cached, keyed by playlist id. `allow-runtime` resolves this at prefetch time
// because `id` is a runtime param known when the prefetch fires. On a cold
// cache, each distinct id is a miss, so the body runs once per playlist link —
// and every miss competes for one of the POOL_SIZE connections.
export async function getPlaylistTracks(id: string) {
  'use cache';
  return withConnection(async () => {
    console.log(`[runtime-prefetch] rendering tracks for ${id}`);
    await delay(800);
    return [`${id} — track A`, `${id} — track B`, `${id} — track C`];
  });
}
