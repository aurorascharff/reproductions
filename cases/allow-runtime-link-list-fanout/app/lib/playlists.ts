import 'server-only';

export type Playlist = { id: string; name: string; description: string };

// A real-sized library — 20 distinct playlists. Every entry becomes a
// <Link prefetch={true}> in the sidebar, all in the viewport on load.
export const PLAYLISTS: Playlist[] = [
  { id: 'morning-coffee', name: 'Morning Coffee', description: 'Easy acoustic to ease into the day' },
  { id: 'deep-focus', name: 'Deep Focus', description: 'Minimal beats for heads-down work' },
  { id: 'late-night-drive', name: 'Late Night Drive', description: 'Synthwave for empty highways' },
  { id: 'rainy-day-jazz', name: 'Rainy Day Jazz', description: 'Smoky standards and slow brushes' },
  { id: 'gym-pump', name: 'Gym Pump', description: 'High-BPM bangers for the last rep' },
  { id: 'sunday-chill', name: 'Sunday Chill', description: 'Lo-fi and lazy afternoons' },
  { id: 'throwback-2000s', name: 'Throwback 2000s', description: 'Pop-punk and TRL nostalgia' },
  { id: 'indie-discovery', name: 'Indie Discovery', description: 'Fresh guitars off the beaten path' },
  { id: 'classical-study', name: 'Classical Study', description: 'Baroque focus, no lyrics' },
  { id: 'house-party', name: 'House Party', description: 'Four-on-the-floor crowd-pleasers' },
  { id: 'acoustic-covers', name: 'Acoustic Covers', description: 'Stripped-back takes on big hits' },
  { id: 'road-trip', name: 'Road Trip', description: 'Singalongs for the open road' },
  { id: 'soul-classics', name: 'Soul Classics', description: 'Motown and Stax essentials' },
  { id: 'electronic-flow', name: 'Electronic Flow', description: 'Melodic techno that keeps moving' },
  { id: 'coffeehouse-folk', name: 'Coffeehouse Folk', description: 'Fingerpicked and warm' },
  { id: 'hip-hop-heat', name: 'Hip-Hop Heat', description: 'Current bars and heavy 808s' },
  { id: 'ambient-sleep', name: 'Ambient Sleep', description: 'Drones and soft textures' },
  { id: 'summer-bbq', name: 'Summer BBQ', description: 'Reggae, funk, and sunshine' },
  { id: 'power-ballads', name: 'Power Ballads', description: 'Lighters up, every chorus' },
  { id: 'world-grooves', name: 'World Grooves', description: 'Afrobeat, cumbia, and more' },
];

// A small concurrency limiter — stands in for a scarce shared resource like a
// database connection pool. Real apps don't get unlimited parallelism: the
// per-link prefetch storm queues here, and so does the click the user makes.
// This is what turns "N extra requests" into "navigation is slow."
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

// Distinct, deterministic track list per playlist — different content per page.
function tracksFor(id: string, name: string) {
  const seed = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const count = 8 + (seed % 9); // 8–16 tracks
  return Array.from({ length: count }, (_, i) => `${name} — Track ${i + 1}`);
}

// Cached, keyed by playlist id. `allow-runtime` resolves this at prefetch time
// because `id` is a runtime param known when the prefetch fires. On a cold
// cache, each distinct id is a miss, so the body runs once per playlist link —
// and every miss competes for one of the POOL_SIZE connections.
export async function getPlaylist(id: string) {
  'use cache';
  return withConnection(async () => {
    console.log(`[runtime-prefetch] rendering ${id}`);
    await delay(2000);
    const meta = PLAYLISTS.find(p => p.id === id);
    const name = meta?.name ?? id;
    return { name, description: meta?.description ?? '', tracks: tracksFor(id, name) };
  });
}
