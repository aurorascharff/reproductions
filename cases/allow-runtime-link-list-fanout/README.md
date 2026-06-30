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

- On a single hard-load, **all 20** routes are runtime-prefetched: ~21 `_rsc=` requests, and the terminal logs `[fill] <id>` for each — before any click.
- **Clicking a link whose runtime prefetch is still in-flight shows no Suspense fallback.** The router waits for the in-flight `allow-runtime` prefetch (which carries the resolved content) instead of rendering the route's own skeleton — so the click is unresponsive: the old page stays, no skeleton, until the prefetch resolves. Clicking a link whose prefetch hasn't started yet does a fresh nav and *does* show the skeleton.

Measured on the **live Vercel deployment** ([allow-runtime-link-list-fanout.labs.vercel.dev](https://allow-runtime-link-list-fanout.labs.vercel.dev)), clicking ~300ms after a hard-load:

| link clicked | prefetch state | skeleton | content |
| --- | --- | --- | --- |
| `World Grooves` (prefetched first) | in-flight | **never shows** | ~520 ms |
| `Soul Classics` | not yet started | ~90 ms | ~590 ms |
| `Hip-Hop Heat` | not yet started | ~50 ms | ~580 ms |

The delay here is small (~0.5s, the `'use cache'` latency); the point is the **missing fallback** on in-flight links — with a slower backend or a longer prefetch queue, that no-feedback window grows.

### Honest note on scale

This is a **modest, real** cost — not a freeze. A single Node process handles the concurrent renders fine (IO waits yield), so the delay is bounded by Next's prefetch concurrency and the per-fill latency, not by list length. An earlier version of this repro faked a multi-second stall with an artificial connection pool; that was misleading and has been removed. If a cold nav on the real app feels worse than "brief," the extra cost is elsewhere — real DB/connection latency, or cache-entry generation dedup — and is worth checking on next-beats itself with `NEXT_PRIVATE_DEBUG_CACHE=1`.

## Control: the same route without `allow-runtime`

The sidebar has a second list — **Albums** — pointing at `/album/[id]`, identical to `/playlist/[id]` (same data, same Suspense) but with **no `prefetch = 'allow-runtime'`** (so it uses the default per-route App Shell prefetch). Clicking the same item (`World Grooves`) in each list, ~300ms after a cold load on the live deploy:

| list | route | skeleton | content |
| --- | --- | --- | --- |
| Playlists | `allow-runtime` | ~1180 ms (or never) | ~1700 ms |
| Albums | default (control) | **~85 ms** | ~570 ms |

Without `allow-runtime`, the click commits to the App Shell immediately (skeleton in ~85ms) and content streams in ~570ms. With it, there's ~1.2s of **no feedback** while the navigation waits on the in-flight runtime prefetch. The only difference is the `allow-runtime` export and the load-time fan-out it triggers.

## Prefetch order prioritizes the wrong links

The in-viewport scan prefetches the list **bottom-up** — the last link fires first. Clicking ~900ms after a cold load on the live deploy:

| link clicked | position | skeleton | content |
| --- | --- | --- | --- |
| `World Grooves` | bottom (prefetched first) | never (cached) | **~50 ms** |
| `Coffeehouse Folk` | middle | ~60 ms | ~600 ms |
| `Morning Coffee` | top (prefetched last) | ~60 ms | ~600 ms |

The bottom link is already warm and navigates instantly; the top and middle links aren't ready yet and pay a fresh nav (skeleton + one ~500ms fill). The prefetch budget lands on the bottom of the list first — so if the user's likely target is near the top, it's the **last** to become ready. Same total work, ordered against the click.

## Why the fan-out still matters

Even when it doesn't slow navigation, `allow-runtime` + `<Link prefetch={true}>` on an unbounded list does N server renders' worth of work per page view, scaling with list length rather than with what the user navigates to. The docs flag this under [*Preventing too many prefetches*](https://preview.nextjs.org/docs/app/guides/prefetching) and ["skip `allow-runtime` when the route is rarely navigated — you pay per visible link"](https://preview.nextjs.org/docs/app/guides/runtime-prefetching).

## Workaround

Defer each list link's runtime prefetch until intent — hold it at the cheap deduped App Shell and only upgrade on hover/focus:

```tsx
<Link prefetch={intent ? true : false} onMouseEnter={() => setIntent(true)} />
```

## Files

- `next.config.ts` — `cacheComponents`, `partialPrefetching`
- `app/layout.tsx` — sidebar with `Home` + 20 `<Link prefetch={true}>` playlist links (`EAGER=0` build flips them off)
- `app/playlist/[id]/page.tsx` — `prefetch = 'allow-runtime'`, content in `<Suspense>`
- `app/album/[id]/page.tsx` — the control: same page, **no** `allow-runtime`
- `app/lib/playlists.ts` — 20 playlists + `getPlaylist` (`'use cache'` with ~500ms latency, logs each fill)
- `app/page.tsx` — `allow-runtime` home
