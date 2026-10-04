# ensure-static-instant-false-empty-prefetch

Repro for: **`ensureStatic = 'shell'` (or `'prefetch'`) plus `instant = false` builds, but the static App Shell guarantee no longer holds.** The route's static prefetch is served, but the navigation still waits on the server, as if `ensureStatic` were not set.

`ensureStatic = 'navigation'` does not have this gap: its static-route check runs even with `instant = false`.

## The shape

- `cacheComponents: true` and `partialPrefetching: true` in [`next.config.ts`](next.config.ts).
- A layout with `ensureStatic = 'shell'` whose `CartButton` reads `cookies()`.
- Two sibling routes, identical except for the boundary around the cart:

| Route | Layout | `next build` |
| --- | --- | --- |
| [`/with-suspense`](app/with-suspense/layout.tsx) | `ensureStatic = 'shell'`, cart inside `<Suspense>` | `◐`, static shell with nav and the `Cart (0)` fallback |
| [`/no-suspense`](app/no-suspense/layout.tsx) | `ensureStatic = 'shell'` + `instant = false`, cart without `<Suspense>` | `ƒ`, `no-suspense.html` is 0 bytes |

Without `instant = false`, `/no-suspense` fails the build with `blocking-prerender-dynamic`, which is expected. With it, the build passes.

## Run

```bash
pnpm install        # if the canary is release-age gated:
                    # pnpm install --config.minimumReleaseAge=0
pnpm build
pnpm start
```

Open `http://localhost:3000`, set a cookie (`document.cookie = 'cart-count=5; path=/'`), wait for the viewport prefetches, then click each link. The cart read is delayed by 3 seconds so the difference is visible.

## Result (`16.4.0-canary.59`, `next start`)

Time from click until each part appears:

| Route | URL changes | Nav shows | Cart shows |
| --- | --- | --- | --- |
| `/with-suspense` | 29 ms | 29 ms (with `Cart (0)` fallback) | 3057 ms |
| `/no-suspense` | 3023 ms | 3023 ms | 3023 ms |

`/no-suspense` waits for the server to render the cart before anything changes.

## What gets prefetched

Both routes have identical `prefetchHints` in `.next/server/app/*.meta`, so the client attempts a static prefetch for both. The static segment payloads in `.next/server/app/<route>.segments/`:

| Segment | `/with-suspense` | `/no-suspense` |
| --- | --- | --- |
| `__PAGE__.segment.rsc` | nav, `Cart (0)` fallback, page content | nav, page content, **no cart** |
| HTML shell | 1354 bytes | **0 bytes** |

So `/no-suspense` does prefetch the nav and the page from static output, with the cart left as a hole. With no `<Suspense>` above the cart there is no fallback to show in its place, so the prefetched UI cannot be committed, and the navigation blocks until the cart resolves on the server.

## Why

`ensureStatic = 'shell'` does two things in the renderer:

1. It keeps the route's prefetch hints static: reading `cookies()` no longer switches the route to runtime prefetches (`trackRuntimeDataAccessed` in `dynamic-rendering-utils.ts`). That part still applies here.
2. It switches Instant Navigation validation to the static App Shell, which reports request data outside `<Suspense>`. `instant = false` turns that validation off (`instant-config.tsx`: the segment is allowed to block).

With (2) off, nothing reports the blocking read, and (1) only guarantees that the prefetch comes from static output, not that the output can be shown. The level stops guaranteeing anything useful.

## Question

Should the build reject `instant = false` together with `ensureStatic = 'shell'` / `'prefetch'` on the same route, the way `'navigation'` already rejects incompatible param matching? Or should the `ensureStatic` reference document this combination?
