import 'server-only';

// An "unbounded" list — stand-in for a user's playlist library in a sidebar.
// Every entry becomes a <Link prefetch={true}> in the layout, so every entry
// is in the viewport on load.
export const PLAYLISTS = Array.from({ length: 8 }, (_, i) => ({
  id: `pl-${i + 1}`,
  name: `Playlist ${i + 1}`,
}));

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Cached, keyed by playlist id. `allow-runtime` resolves this at prefetch time
// because `id` is a runtime param known when the prefetch fires. On a cold
// cache, each distinct id is a miss, so the body below runs once per playlist
// link — one log line per link in the dev server terminal, with zero clicks.
export async function getPlaylistTracks(id: string) {
  'use cache';
  console.log(`[runtime-prefetch] rendering tracks for ${id}`);
  await delay(300);
  return [`${id} — track A`, `${id} — track B`, `${id} — track C`];
}
