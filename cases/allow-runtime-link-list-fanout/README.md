# Initial navigations are slow when a link list points at `allow-runtime` routes

Next.js `16.3.0-preview.5` with `cacheComponents: true`, `partialPrefetching: true`.

**Live:** [allow-runtime-link-list-fanout.labs.vercel.dev](https://allow-runtime-link-list-fanout.labs.vercel.dev) — hard-load, then click a playlist near the **top** of the sidebar (e.g. _Morning Coffee_) and watch the content lag for several seconds.

A sidebar of `<Link prefetch={true}>` to `prefetch = 'allow-runtime'` routes fires **one runtime server render per link** the moment the page loads. Under any scarce server resource (a DB connection pool), those renders queue — and the link the user clicks queues behind them. The click commits to its App Shell instantly, but the content streams in **slowly**, because its render is waiting in line behind the prefetch storm it didn't ask for.

## Setup

`app/layout.tsx` renders a sidebar — `Home` plus **20** playlist links — each `<Link prefetch={true}>`. They all point at `app/playlist/[id]/page.tsx`, which exports `prefetch = 'allow-runtime'` and renders distinct param-dependent cached content via `getPlaylist(id)`.

`getPlaylist` is a `'use cache'` function gated behind a **`POOL_SIZE = 1` connection limiter** (`app/lib/playlists.ts`) — a stand-in for a constrained DB pool (the same shape as the real app's Neon pool). Each render takes ~2 s and holds the one connection.

The sidebar is always in the viewport, so the in-viewport prefetch scan sees all 20 links at once.

## Repro

1. `pnpm install`
2. `pnpm build && pnpm start` — **automatic prefetch only runs in production**, not under `next dev` (a dev run fires zero prefetches, so there's nothing to see).
3. Open DevTools → Network → filter `_rsc=`.
4. Hard-load `/`, wait ~1.5 s, then click a playlist near the **top** of the list (e.g. `Morning Coffee`).
5. Watch how long the playlist content takes to appear, and watch the terminal running `pnpm start`.

> The router prefetches the list **bottom-up** (last link first), so the **top** links are last in line for the connection — those are the slow navigations. Clicking a link near the bottom is fast because it was prefetched early.

### Expected

`/playlist/[id]` is one route. The in-viewport links should share a single deduped per-route **App Shell** prefetch; a specific playlist's runtime render should happen on intent (hover) or on the click itself — not for all 20 at once on load, ahead of whatever the user actually clicks.

### Observed — verified on `16.3.0-preview.5`

Hard-load `/`, wait ~1.5 s, click `Morning Coffee` (top of list → prefetched last). Measured time from click to **shell** vs to **content**:

| Build | `_rsc=` requests on load | runtime renders | shell visible | **content visible** |
| ----- | ------------------------ | --------------- | ------------- | ------------------- |
| default (eager storm) | ~19 | 20 (one per link) | ~70 ms | **~6.9 s** |
| `EAGER=0 pnpm build` (no prefetch) | 1 | 1 | ~70 ms | **~2 s** (one render) |

The shell commits in ~70 ms either way — navigation is **not** blocked. What's slow is the content: with the storm on, the clicked playlist's render sits behind ~20 other prefetch renders draining through the single connection, so the user stares at the `loading playlist…` fallback for ~7 s. The terminal prints all 20 `[runtime-prefetch] rendering <id>` lines on the single load, with zero clicks.

## Why this matters

`prefetch = 'allow-runtime'` + `<Link prefetch={true}>` is the documented recipe for runtime prefetching, and it's the right call for a **bounded** set of primary nav links. Applied to an **unbounded** list (a user's playlists, a feed, search results), the same recipe makes _initial navigation slower than doing nothing_: N visible links each wake a server render on load, and the link the user actually clicks competes with all of them for the same scarce resource.

The docs warn about this under [_Preventing too many prefetches_](https://preview.nextjs.org/docs/app/guides/prefetching) and ["skip `allow-runtime` when the route is rarely navigated — you pay per visible link"](https://preview.nextjs.org/docs/app/guides/runtime-prefetching), but there's no built-in per-list cap, and eager-everything is the default for any list-shaped UI.

## Workaround

Defer each list link's runtime prefetch until intent — hold it at the cheap deduped App Shell and only upgrade to the runtime prefetch on hover/focus, so nothing competes for the pool on load:

```tsx
// prefetch={false} until intent; then `null` (default → App Shell + runtime for
// this allow-runtime route). The list no longer storms the pool on page load.
<Link prefetch={intent ? true : false} onMouseEnter={() => setIntent(true)} />
```

## Files

- `next.config.ts` — `cacheComponents`, `partialPrefetching`
- `app/layout.tsx` — sidebar with `Home` + 20 `<Link prefetch={true}>` playlist links (`EAGER=0` build flips them off)
- `app/playlist/[id]/page.tsx` — `prefetch = 'allow-runtime'`, distinct param-dependent content behind `<Suspense>`
- `app/lib/playlists.ts` — the 20-playlist list + `getPlaylist` (`'use cache'`, behind a 1-connection pool, logs once per render)
- `app/page.tsx` — `allow-runtime` home
