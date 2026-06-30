# `prefetch = 'allow-runtime'` on every link in a list fires one runtime prerender per link on load

Next.js `16.3.0-preview.5` with `cacheComponents: true`, `partialPrefetching: true`.

**Live:** [allow-runtime-link-list-fanout.labs.vercel.dev](https://allow-runtime-link-list-fanout.labs.vercel.dev)

A sidebar of `<Link prefetch={true}>` to `prefetch = 'allow-runtime'` routes fires **one runtime server render per link** the moment the page loads — for an unbounded list (a user's playlists, a feed), that's N server renders before the user clicks anything.

This case mirrors next-beats' structure: `allow-runtime` routes behind Suspense fallbacks, `'use cache'` reads with data latency, **no artificial concurrency limits**.

## Setup

`app/layout.tsx` renders a sidebar — `Home` plus **20** playlist links — each `<Link prefetch={true}>`. They all point at `app/playlist/[id]/page.tsx`, which exports `prefetch = 'allow-runtime'` and renders its content inside `<Suspense>`.

`getPlaylist` (`app/lib/playlists.ts`) is a `'use cache'` function with a ~500ms delay standing in for a slow data read (like next-beats' `delay()` + DB). No connection pool, no mutex — just IO latency.

## Repro

1. `pnpm install`
2. `pnpm build && pnpm start` — automatic prefetch only runs in production, not `next dev`.
3. Open DevTools → Network → filter `_rsc=`; run with `NEXT_PRIVATE_DEBUG_CACHE=1` to see cache fills.
4. Hard-load `/`. Watch the terminal and Network tab, then click playlists.

## Observed

- On a single hard-load, **all 20** routes are runtime-prefetched: 20 `_rsc=` requests, and the terminal logs `[fill] <id>` for each — before any click.
- The fills run **~3–4 concurrent** (batched ~500ms apart) — Next's runtime-prefetch concurrency, not a limit added here.
- **The first click after a cold load has a brief delay** (~a few hundred ms to ~1s): the clicked route's runtime fill has to clear the queue behind the other in-flight prefetch fills. Once the cache is warm, clicks are instant.

### Honest note on scale

This is a **modest, real** cost — not a freeze. A single Node process handles the concurrent renders fine (IO waits yield), so the delay is bounded by Next's prefetch concurrency and the per-fill latency, not by list length. An earlier version of this repro faked a multi-second stall with an artificial connection pool; that was misleading and has been removed. If a cold nav on the real app feels worse than "brief," the extra cost is elsewhere — real DB/connection latency, or cache-entry generation dedup — and is worth checking on next-beats itself with `NEXT_PRIVATE_DEBUG_CACHE=1`.

## Why the fan-out still matters

Even when it doesn't slow navigation, `allow-runtime` + `<Link prefetch={true}>` on an unbounded list does N server renders' worth of work per page view, scaling with list length rather than with what the user navigates to. The docs flag this under [_Preventing too many prefetches_](https://preview.nextjs.org/docs/app/guides/prefetching) and ["skip `allow-runtime` when the route is rarely navigated — you pay per visible link"](https://preview.nextjs.org/docs/app/guides/runtime-prefetching).

## Workaround

Defer each list link's runtime prefetch until intent — hold it at the cheap deduped App Shell and only upgrade on hover/focus:

```tsx
<Link prefetch={intent ? true : false} onMouseEnter={() => setIntent(true)} />
```

## Files

- `next.config.ts` — `cacheComponents`, `partialPrefetching`
- `app/layout.tsx` — sidebar with `Home` + 20 `<Link prefetch={true}>` playlist links (`EAGER=0` build flips them off)
- `app/playlist/[id]/page.tsx` — `prefetch = 'allow-runtime'`, content in `<Suspense>`
- `app/lib/playlists.ts` — 20 playlists + `getPlaylist` (`'use cache'` with ~500ms latency, logs each fill)
- `app/page.tsx` — `allow-runtime` home
