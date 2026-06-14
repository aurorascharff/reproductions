# `prefetch = 'allow-runtime'` reuses an uncached `<Suspense>` payload across navigations

Next.js `16.3.0-canary.48` with `cacheComponents: true` + `partialPrefetching: true` + `experimental.appShells: true`.

Live preview: <https://prefetch-uncached-repro-8m1m1kvt0-aurorascharff-7894s-projects.vercel.app>

## Setup

The home page (`/`) exports `prefetch = 'allow-runtime'` and renders this:

```tsx
<Suspense fallback={...}>
  <QuickPlayGrid />
</Suspense>
```

`QuickPlayGrid` reads a per-user list via a query wrapped in React `cache()` that awaits a `'use cache: private'` helper for the session cookie. The query itself has:

- **no `'use cache'`**
- **no `cacheTag` / `cacheLife`**
- **no `connection()`**

It's just an ordinary uncached read of mutable server state, behind a Suspense boundary, like any other dynamic query in an app router page.

`/track` POSTs to `/api/play`, which mutates that mutable state.

## Repro

1. Open the home page. Grid says `Nothing played yet.`
2. Click **Track**. Click any track to record a play.
3. Click **Home**.

### Expected

`QuickPlayGrid` is uncached. On every navigation back to `/`, the Suspense boundary should resuspend and re-run the query. The grid should show the just-played track.

### Observed

The grid still says `Nothing played yet.` The Suspense fallback does NOT flash. The server log shows no `getRecentlyPlayed ran` after the navigation. A hard reload (`Cmd-R`) renders the correct list, confirming the server state is fine — only the client router cache is wrong.

## Why this matters

`prefetch = 'allow-runtime'` runs the segment at runtime to embed a per-user prefetch payload in the initial document. That payload includes the result of `QuickPlayGrid`, even though the component is uncached and lives behind `<Suspense>`. On subsequent client-side navigations to `/`, the router serves this prefetched payload as-is without re-running the segment.

There is no `'use cache'` and no `cacheTag` on this query, so there's no tag the mutation could revalidate. The user has no opt-out: any uncached query behind `<Suspense>` on a runtime-prefetched route gets baked into the prefetch and frozen for the router-cache lifetime.

## Files

- `next.config.ts`: `cacheComponents: true`, `partialPrefetching: true`, `experimental.appShells: true`
- `app/layout.tsx`: nav with numbered steps and `<Link prefetch={true}>`
- `app/page.tsx`: `prefetch = 'allow-runtime'` + `<Suspense>` + uncached `QuickPlayGrid`
- `app/track/page.tsx`: client buttons that POST to `/api/play`
- `app/api/play/route.ts`: mutates the store, no revalidation
- `app/lib/store.ts`: file-backed per-user recently-played list
