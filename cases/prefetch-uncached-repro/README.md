# `prefetch = 'allow-runtime'` reuses an uncached `<Suspense>` payload across navigations

Next.js `16.3.0-canary.48` with `cacheComponents: true` + `partialPrefetching: true` + `experimental.appShells: true`.

Live preview: <https://prefetch-uncached-repro-exvdtfqss-aurorascharff-7894s-projects.vercel.app>

## Setup

The home page (`/`) exports `prefetch = 'allow-runtime'` and renders this:

```tsx
<Suspense fallback={<p>loading…</p>}>
  <Counter />
</Suspense>
```

`Counter` calls `getCount`, which is wrapped in React `cache()` and awaits a `'use cache: private'` helper for the session cookie. The query itself has:

- **no `'use cache'`**
- **no `cacheTag` / `cacheLife`**
- **no `connection()`**

It's just an ordinary uncached read of mutable server state, behind a Suspense boundary.

`/mutate` POSTs to `/api/play`, which bumps that counter.

## Repro

1. Open `/`. The grid renders `count: 0`.
2. Click **Mutate**. Click **bump count**. Server reports the new value.
3. Click **Home**.

### Expected

`Counter` is uncached. On every navigation back to `/`, the Suspense boundary should resuspend and re-run `getCount`. The count should update.

### Observed

`count: 0` is still shown. The Suspense fallback does NOT flash. The server log shows no `getCount ran` after the navigation. A hard reload renders the correct count, confirming the server state is fine — only the client router cache is wrong.

## Why this matters

`prefetch = 'allow-runtime'` runs the segment at runtime to embed a per-user prefetch payload in the initial document. That payload includes the result of `Counter`, even though the component is uncached and lives behind `<Suspense>`. On subsequent client-side navigations to `/`, the router serves this prefetched payload as-is without re-running the segment.

There is no `'use cache'` and no `cacheTag` on this query, so there's no tag the mutation could revalidate. The user has no opt-out: any uncached query behind `<Suspense>` on a runtime-prefetched route gets baked into the prefetch and frozen for the router-cache lifetime.

## Files

- `next.config.ts`: `cacheComponents: true`, `partialPrefetching: true`, `experimental.appShells: true`
- `app/layout.tsx`: nav with `<Link prefetch={true}>` to `/` and `/mutate`
- `app/page.tsx`: `prefetch = 'allow-runtime'` + `<Suspense>` + uncached `Counter`
- `app/mutate/page.tsx`: client button that POSTs to `/api/play`
- `app/api/play/route.ts`: bumps the counter
- `app/lib/store.ts`: file-backed per-user counter
