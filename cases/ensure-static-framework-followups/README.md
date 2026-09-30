# ensureStatic framework follow-ups

Standalone reproductions for the framework follow-ups recorded after
`unstable_ensureStatic` was implemented in
[vercel/next.js#99171](https://github.com/vercel/next.js/pull/99171).

## Run

```bash
pnpm install --config.minimumReleaseAge=0
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Each route isolates one
follow-up:

| Route | Current behavior | Expected behavior |
| --- | --- | --- |
| `/browser-instant-false` | The render fails because `use(browser())` blocks the root. | `instant = false` should allow the browser-only render; it does not require a server resume. |
| `/duplicate-client-io-error` | The overlay reports both `use(io())` and `connection()` as server holes. | It should report only `connection()`; `use(io())` is allowed in the Client Component behind Suspense. |
| `/unused-client-promise` | The overlay says it is unable to provide a location. | The error should point to the request-dependent promise passed from `page.tsx`. |
| `/short-lived-cache` | The overlay labels the cache as generic uncached/runtime data and recommends adding `"use cache"`, which is already present. | The guidance should say that `expire` must be at least five minutes. |
| `/route-hints` | Provides `false`, `shell`, and `prefetch` links for inspecting static and runtime prefetch requests. | This is a behavior baseline for the route-hint cleanup, not a separate error. |

## Route-hint baseline

Next.js does not prefetch in development. Build only the route-hint pages, then
start the production server:

```bash
pnpm exec next build --debug-build-paths 'app/route-hints/**'
pnpm start
```

The three target routes all read `cookies()` behind Suspense:

- `false` permits a runtime shell prefetch.
- `shell` requires an automatic prefetch to use the static shell, but an
  explicit `prefetch={true}` may fetch the runtime cookie content.
- `prefetch` requires both automatic and explicit prefetches to remain static;
  cookie content arrives with the navigation response.

This comparison makes the client-visible contract inspectable while the
internal route-facts/route-hints refactor remains implementation cleanup.

## Versions

- `next@16.4.0-canary.53`
- `react@19.3.0-canary-7c6ac13e-20260929`
- `react-dom@19.3.0-canary-7c6ac13e-20260929`
