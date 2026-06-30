# A list of `<Link prefetch={true}>` to `allow-runtime` routes fires one runtime prerender *per link* on load

Next.js `16.3.0-preview.5` with `cacheComponents: true`, `partialPrefetching: true`.

## Setup

The root layout (`app/layout.tsx`) renders a sidebar — a `Home` link plus a list of 8 "playlist" links — and every link is `<Link prefetch={true}>`:

```tsx
{PLAYLISTS.map(pl => (
  <Link key={pl.id} prefetch={true} href={`/playlist/${pl.id}`}>
    {pl.name}
  </Link>
))}
```

Every playlist link points at the same dynamic route, `app/playlist/[id]/page.tsx`, which exports `prefetch = 'allow-runtime'` and renders param-dependent, cached content (`getPlaylistTracks(id)`, a `'use cache'` function that logs and waits 300ms).

The sidebar is always in the viewport, so the in-viewport prefetch scan sees all 8 links at once.

## Repro

1. `pnpm install && pnpm dev`
2. Open DevTools → Network → filter for `_rsc=`.
3. Hard-load `/` (cold cache — restart `pnpm dev` first to be sure).
4. Watch the Network tab **and** the dev server terminal.

### Expected

`/playlist/[id]` is one route. The in-viewport links should share a single deduped per-route **App Shell** prefetch, and runtime work for a specific playlist should happen when the user shows intent (hover) or navigates — not for all 8 at once on load.

### Observed

- **Network:** 8 separate `_rsc=` runtime prefetch requests fire on load — one per playlist link — before any click.
- **Terminal:** 8 `[runtime-prefetch] rendering tracks for pl-N` lines print on the cold load, with zero clicks. Each is a full server prerender (300ms each), competing for the same server.

Add more entries to `PLAYLISTS` and the count grows 1:1 — the cost scales with list length, not with what the user actually navigates to.

## Why this matters

`prefetch = 'allow-runtime'` + `<Link prefetch={true}>` is the documented recipe for runtime prefetching, and it's the right call for a **bounded** set of primary nav links. But the same recipe applied to an **unbounded** list (a user's playlists, a feed, search results) turns into a load-time prerender storm: N visible links wake N servers, each doing real work, before the user clicks anything. On a cold cache that work is fully repeated per link.

The docs call this out under [*Preventing too many prefetches*](https://preview.nextjs.org/docs/app/guides/prefetching) and ["skip `allow-runtime` when the route is rarely navigated — you pay per visible link"](https://preview.nextjs.org/docs/app/guides/runtime-prefetching), but there's no built-in per-list cap, and the eager-everything default is an easy foot-gun for any list-shaped UI.

## Workaround

Defer each list link's runtime prefetch until intent — hold it at the cheap deduped App Shell and only upgrade to the runtime prefetch on hover/focus:

```tsx
// false until the user shows intent; then `null` (default → App Shell + runtime
// for this allow-runtime route). Collapses the load-time storm to on-demand.
<Link prefetch={intent ? true : false} onMouseEnter={() => setIntent(true)} />
```

With this, load fires one shared App Shell prefetch for `/playlist/[id]` instead of 8 runtime prerenders, and the runtime prefetch for a given playlist happens only when the user is about to click it.

## Files

- `next.config.ts` — `cacheComponents`, `partialPrefetching`
- `app/layout.tsx` — sidebar with `Home` + 8 `<Link prefetch={true}>` playlist links
- `app/playlist/[id]/page.tsx` — `prefetch = 'allow-runtime'`, param-dependent cached content
- `app/lib/playlists.ts` — the list + `getPlaylistTracks` (`'use cache'`, logs once per render)
- `app/page.tsx` — `allow-runtime` home
