# An `allow-runtime` link list makes nav clicks entirely unresponsive on initial load

Next.js `16.3.0-preview.5` with `cacheComponents: true`, `partialPrefetching: true`.

**Live:** [allow-runtime-link-list-fanout.labs.vercel.dev](https://allow-runtime-link-list-fanout.labs.vercel.dev) — hard-load, then click any playlist. The click does nothing for several seconds — no spinner, no skeleton, the URL doesn't even change — then the page appears all at once.

A sidebar of `<Link prefetch={true}>` to `prefetch = 'allow-runtime'` routes fires **one runtime server render per link** the moment the page loads. The destination is a **blocking route** (`instant = false`, no Suspense fallback), so a navigation can't stream a fallback — it's held on the old page until the render resolves. Under the prefetch storm that render is stuck behind a shared resource (a connection pool), so the click is **dead for seconds**: no feedback at all, then the page swaps in.

## Setup

`app/layout.tsx` renders a sidebar — `Home` plus **20** playlist links — each `<Link prefetch={true}>`. They all point at `app/playlist/[id]/page.tsx`, which:

- exports `prefetch = 'allow-runtime'` — every visible link prerenders at runtime on load, and
- exports `instant = false` with **no `<Suspense>`** — a blocking route, so navigation shows no fallback and waits for the full render.

`getPlaylist` (`app/lib/playlists.ts`) is a `'use cache'` function behind a **`POOL_SIZE = 1` connection limiter** — a stand-in for a constrained DB pool (the same shape as the real app's Neon pool). Each render takes ~2 s and holds the one connection.

The sidebar is always in the viewport, so the in-viewport prefetch scan sees all 20 links at once.

## Repro

1. `pnpm install`
2. `pnpm build && pnpm start` — **automatic prefetch only runs in production**, not under `next dev`.
3. Hard-load `/`, wait ~1 s, then click any playlist (e.g. `Morning Coffee`).
4. Watch the page and the terminal running `pnpm start`.

### Expected

The click should give immediate feedback — commit to a per-route App Shell, then stream the rest. A specific playlist's runtime render should happen on intent (hover) or on the click, not for all 20 at once on load, ahead of whatever the user actually clicks.

### Observed — verified on `16.3.0-preview.5`

Hard-load `/`, wait ~1 s, click `Morning Coffee`. Timeline measured from the click (one run):

| event | when |
| ----- | ---- |
| URL changes to `/playlist/...` | **7.1 s** |
| old page (`NextBeats-ish`) leaves | **7.1 s** |
| playlist content visible | **7.1 s** |
| any spinner / skeleton | **never** |

For ~7 s after the click, **nothing happens** — the URL doesn't change, no fallback renders, the old page just sits there — then the whole page swaps in at once. The terminal prints all 20 `[runtime-prefetch] rendering <id>` lines on the single load, before the click. The exact stall scales with how far the clicked link's render is queued behind the storm; rebuild with `EAGER=0` (no prefetch storm) and the same click stalls only for one render (~2 s).

## Why this matters

`prefetch = 'allow-runtime'` + `<Link prefetch={true}>` is the documented recipe for runtime prefetching, and it's the right call for a **bounded** set of primary nav links. Applied to an **unbounded** list (a user's playlists, a feed, search results), every visible link wakes a server render on load, and they contend for one shared resource. On a blocking route — or any route that holds the old frame during navigation, e.g. via View Transitions — there's no fallback to mask the wait, so the navigation the user actually triggers is held behind the storm and the click looks **broken**.

The docs warn about the storm under [_Preventing too many prefetches_](https://preview.nextjs.org/docs/app/guides/prefetching) and ["skip `allow-runtime` when the route is rarely navigated — you pay per visible link"](https://preview.nextjs.org/docs/app/guides/runtime-prefetching), but there's no built-in per-list cap, and eager-everything is the default for any list-shaped UI.

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
- `app/playlist/[id]/page.tsx` — `prefetch = 'allow-runtime'` + `instant = false`, blocking route with no Suspense fallback
- `app/lib/playlists.ts` — the 20-playlist list + `getPlaylist` (`'use cache'`, behind a 1-connection pool, logs once per render)
- `app/page.tsx` — `allow-runtime` home
