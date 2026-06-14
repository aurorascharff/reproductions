# `prefetch = 'allow-runtime'` reuses a stale runtime prefetch when a mutation in another route doesn't invalidate it

Next.js `16.3.0-canary.48` with `cacheComponents: true` + `partialPrefetching: true` + `experimental.appShells: true`.

Live preview: <https://prefetch-uncached-repro-qfodui8ep-aurorascharff-7894s-projects.vercel.app>

## Setup

Two routes:

- `/` — the home page, exports `prefetch = 'allow-runtime'`. Renders a `<Suspense>` boundary around `QuickPlayGrid`. Grid reads a per-user list from a tiny on-disk store; the read goes through a React `cache()` wrapper that awaits a `'use cache: private'` helper for the session cookie. No `connection()`, no `cacheTag`.
- `/track` — a client component with buttons that POST to `/api/play`. The route handler mutates the store but does NOT call `revalidateTag` / `revalidatePath` (matching the way the real app records plays as a fire-and-forget background fetch).

This mirrors next-beats' home page (`getRecentlyPlayed` + `<Suspense fallback={<QuickPlayGridSkeleton />}>`) and its `/api/play` handler (revalidates `tracks` / `track-${id}` / `discover:*` but not the recently-played list).

## Repro

```bash
pnpm install
pnpm build
PORT=3010 pnpm start
```

In a real browser at <http://localhost:3010>:

1. Land on `/`. The grid renders `Nothing played yet.`
2. Click `Track`, then click any track button. The POST mutates the server store.
3. Click `Home`.

### Expected

The runtime-prefetched home payload is no longer valid because the underlying state changed. Either Next.js should re-run the segment on navigation or there should be a way to invalidate the runtime-prefetch entry for `/`. The grid should re-render with the just-played track.

### Observed

The grid shows `Nothing played yet.` — the prefetched payload from before the mutation is reused. The server log shows no `getRecentlyPlayed ran` after the navigation. Reloading the page (`Cmd-R`) fixes it because that bypasses the router cache and re-fetches.

## Why this matters

There's no way for `/api/play` to know which segments to invalidate. The whole point of `prefetch = 'allow-runtime'` is to serve personalized content instantly, but personalized content is exactly the content most likely to be mutated by background requests that don't go through a server action or `revalidateTag`.

This was reproduced on the deployed next-beats app (<https://next-beats.dev>):

- Sign in, play "Pixel Perfect" on `/track/t16`, click `Home`.
- Recently Played shows `Nothing played yet.` until a hard reload.

## Files

- `next.config.ts`: `cacheComponents: true`, `partialPrefetching: true`, `experimental.appShells: true`
- `app/layout.tsx`: nav with `<Link prefetch={true}>`
- `app/page.tsx`: `prefetch = 'allow-runtime'` + `<Suspense>` + `QuickPlayGrid`
- `app/track/page.tsx`: client buttons that POST to `/api/play`
- `app/api/play/route.ts`: mutates the store, does not revalidate
- `app/lib/store.ts`: file-backed per-user recently-played list

## Workaround

Tag the query and revalidate it from the mutation. In `app/page.tsx` split into a public `cache()` wrapper + a `'use cache'` inner tagged `recently:${userId}`, then call `revalidateTag(\`recently:${userId}\`)` from `/api/play`.

This works, but it requires the mutation endpoint to know the full list of tags every runtime-prefetched segment depends on — a cross-cutting concern that's easy to forget (as happened in next-beats).
