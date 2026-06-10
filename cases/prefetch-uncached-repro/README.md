# `prefetch = 'allow-runtime'` caches `connection()`-marked data across navigations

Next.js `16.3.0-preview.3` with `cacheComponents: true` + `partialPrefetching: true` + `experimental.appShells: true`.

## Setup

Two pages, both with a Suspense boundary around an uncached section that:

- Calls `await connection()` first (per the [docs](https://nextjs.org/docs/canary/app/api-reference/functions/connection): "indicate rendering should wait for an incoming user request")
- Reads a `'use cache: private'` helper that depends on `cookies()`
- Returns `Date.now()` so the value is observably fresh per render

The two routes differ only in their `prefetch` route segment config:

- `/uncached` has no `prefetch` export (defaults to static-shell prefetch)
- `/allow-runtime` exports `prefetch = 'allow-runtime'`

All `<Link>` elements in the shared layout have `prefetch={true}`.

## Repro

```bash
pnpm install
pnpm build
PORT=3010 pnpm start
```

Then in a real browser at <http://localhost:3010>:

1. Click `/allow-runtime` from the nav. Note the `Uncached value: <timestamp>`. The server log shows `UNCACHED RAN`.
2. Click `Home`.
3. Click `/allow-runtime` again.

### Expected

`UNCACHED RAN` fires again, the value updates to the new `Date.now()`, and the Suspense fallback flashes briefly. The [`connection()`](https://nextjs.org/docs/canary/app/api-reference/functions/connection) docs say the function "always run per request"; a runtime prefetch is not the actual user request, so it should stop at the Suspense boundary instead of resolving the uncached read into the prefetched payload.

### Observed

`UNCACHED RAN` does NOT fire on the return navigation. The page renders the stale `Uncached value` from the first visit. No Suspense fallback is shown.

The control case (`/uncached`, no `prefetch` export) does not have this problem — its uncached section streams fresh on every visit because the runtime prefetch is not opted in.

## Why this matters

The [runtime prefetching guide](https://nextjs.org/docs/canary/app/guides/runtime-prefetching) explicitly says:

> The prerender advances through anything that's static or cached, then stops at uncached reads and falls back to the surrounding `<Suspense>` boundary.

But `prefetch = 'allow-runtime'` is resolving uncached `connection()`-marked reads into the prefetched payload, then serving that stale payload on every subsequent navigation to the route. There is no per-page way to say "prefetch the cached parts but always stream the uncached section" while keeping `'allow-runtime'` for `'use cache: private'` content.

## Files

- `next.config.ts`: `cacheComponents: true`, `partialPrefetching: true`, `experimental.appShells: true`
- `app/layout.tsx`: shared nav with `<Link prefetch={true}>`
- `app/page.tsx`: hub
- `app/uncached/page.tsx`: control — uncached section, no `prefetch` export
- `app/allow-runtime/page.tsx`: same uncached section, page exports `prefetch = 'allow-runtime'`
