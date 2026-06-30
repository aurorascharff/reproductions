# Initial navigations are slow when a link list points at `allow-runtime` routes

Next.js `16.3.0-preview.5` with `cacheComponents: true`, `partialPrefetching: true`.

**Live:** [allow-runtime-link-list-fanout.labs.vercel.dev](https://allow-runtime-link-list-fanout.labs.vercel.dev) — hard-load, then click a playlist near the bottom of the list and watch the content lag.

A sidebar of `<Link prefetch={true}>` to `prefetch = 'allow-runtime'` routes fires **one runtime server render per link** the moment the page loads. Under any scarce server resource (a DB connection pool), those renders queue — and the first link the user clicks queues behind them. The click commits to its App Shell instantly, but the content streams in **slowly**, because its render is waiting in line behind the prefetch storm it didn't ask for.

## Setup

`app/layout.tsx` renders a sidebar — `Home` plus 8 "playlist" links — each `<Link prefetch={true}>`. They all point at `app/playlist/[id]/page.tsx`, which exports `prefetch = 'allow-runtime'` and renders param-dependent cached content via `getPlaylistTracks(id)`.

`getPlaylistTracks` is a `'use cache'` function gated behind a **`POOL_SIZE = 1` connection limiter** (`app/lib/playlists.ts`) — a stand-in for a constrained DB pool. Each render takes ~800ms and holds the one connection.

The sidebar is always in the viewport, so the in-viewport prefetch scan sees all 8 links at once.

## Repro

1. `pnpm install`
2. `pnpm build && pnpm start` — **automatic prefetch only runs in production**, not under `next dev` (a dev run fires zero prefetches, so there's nothing to see).
3. Open DevTools → Network → filter `_rsc=`.
4. Hard-load `/`, then **immediately click a playlist near the bottom of the list** (e.g. `Playlist 1`).
5. Watch how long the playlist content takes to appear, and watch the terminal running `pnpm start`.

> The scheduler prefetches recently-added / most-recently-seen links first, so links **lower in a long list** are the ones still queued when you click — those are the slow navigations.

### Expected

`/playlist/[id]` is one route. The in-viewport links should share a single deduped per-route **App Shell** prefetch; the specific playlist's runtime render should happen on intent (hover) or on the click itself — not for all 8 at once on load, ahead of whatever the user actually clicks.

### Observed — verified on `16.3.0-preview.5`

Hard-load `/`, then click `Playlist 1` (last to be prefetched). Measured click → content-visible:

| Build | `_rsc=` requests on load | runtime renders | **click → content** |
| ----- | ------------------------ | --------------- | ------------------- |
| default (eager storm) | 18 | 8 | **~2870 ms** |
| `EAGER=0 pnpm build` (no prefetch) | 1 | 1 | **~1360 ms** |

Same click, same render cost — but with the storm on it takes **~2× as long**, because the clicked playlist's render sits behind the other prefetch renders holding the single connection. The terminal prints all 8 `[runtime-prefetch] rendering tracks for pl-N` lines on the single load, with zero clicks. Add more playlists and the queue in front of a late click grows.

## Why this matters

`prefetch = 'allow-runtime'` + `<Link prefetch={true}>` is the documented recipe for runtime prefetching, and it's the right call for a **bounded** set of primary nav links. Applied to an **unbounded** list (a user's playlists, a feed, search results), the same recipe makes *initial navigation slower than doing nothing*: N visible links each wake a server render on load, and the link the user actually clicks competes with all of them for the same scarce resource.

The docs warn about this under [*Preventing too many prefetches*](https://preview.nextjs.org/docs/app/guides/prefetching) and ["skip `allow-runtime` when the route is rarely navigated — you pay per visible link"](https://preview.nextjs.org/docs/app/guides/runtime-prefetching), but there's no built-in per-list cap, and eager-everything is the default for any list-shaped UI.

## Workaround

Defer each list link's runtime prefetch until intent — hold it at the cheap deduped App Shell and only upgrade to the runtime prefetch on hover/focus, so nothing competes for the pool on load:

```tsx
// prefetch={false} until intent; then `null` (default → App Shell + runtime for
// this allow-runtime route). The list no longer storms the pool on page load.
<Link prefetch={intent ? true : false} onMouseEnter={() => setIntent(true)} />
```

## Files

- `next.config.ts` — `cacheComponents`, `partialPrefetching`
- `app/layout.tsx` — sidebar with `Home` + 8 `<Link prefetch={true}>` playlist links (`EAGER=0` build flips them off)
- `app/playlist/[id]/page.tsx` — `prefetch = 'allow-runtime'`, param-dependent cached content behind `<Suspense>`
- `app/lib/playlists.ts` — the list + `getPlaylistTracks` (`'use cache'`, behind a 1-connection pool, logs once per render)
- `app/page.tsx` — `allow-runtime` home
