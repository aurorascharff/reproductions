# Partial Prefetching + Eve production routing repro

This is a minimal Next.js 16.3.3 app with Cache Components, Partial
Prefetching, and `withEve`. A visible `<Link>` from `/` to `/activity`
automatically requests the Activity App Shell in production.

The same route works with `next build && next start`, so an `instant()` test can
pass locally. On Vercel, however, adding `withEve` changes the Build Output API
configuration to include an Eve service. The browser's segment-prefetch request
then resolves to `/404` before Next's segment route is selected.

## Live comparison

- Broken, Partial Prefetching enabled:
  <https://ppf-eve-partial-prefetch-broken.vercel.app>
- Working control, only Partial Prefetching disabled:
  <https://partial-prefetch-segment-routing-re.vercel.app>

Both deployments use Next.js 16.3.3, Cache Components, Eve 0.52.2, and the
same two pages. The working control sets the `PARTIAL_PREFETCHING=false` build
environment variable; the source defaults to the broken configuration.

## Reproduce in the browser

1. Open either deployment with DevTools Network recording.
2. Reload `/`.
3. Filter for `activity`.

The broken deployment sends an automatic request with these routing headers:

```text
RSC: 1
Next-Router-Prefetch: 1
Next-Router-Segment-Prefetch: /_tree
Next-Url: /
```

That request returns `404` with `x-matched-path: /404`. The working control
uses the pre-Partial-Prefetching RSC request instead; it returns `200` with
`x-matched-path: /activity.rsc` and warms the client router cache.

The broken response can also be checked directly:

```bash
curl -i 'https://ppf-eve-partial-prefetch-broken.vercel.app/activity?_rsc=repro' \
  -H 'RSC: 1' \
  -H 'Next-Router-Prefetch: 1' \
  -H 'Next-Router-Segment-Prefetch: /_tree' \
  -H 'Next-Url: /'
```

## Run locally

```bash
pnpm install
pnpm build
pnpm start
```

Open <http://127.0.0.1:3000>. The segment-prefetch request is handled by Next
and returns `200`, which is why a local `instant()` assertion does not detect
the deployed failure.

## Isolation matrix

| Configuration | Deployed segment request |
| --- | --- |
| Next.js + Cache Components + Partial Prefetching | `200` |
| Add `experimental.useOffline` | `200` |
| Add `withWorkflow` | `200` |
| Add `withEve` | `404`, matched as `/404` |
| Upgrade Eve from 0.40.0 to 0.52.2 | Still `404` |

This isolates the failure to the deployed Eve service-routing integration, not
the page render or the Partial Prefetching output itself. Moving Eve's service
route earlier in the generated route list also did not fix it. An app-level
`proxy.ts` rewrite did not run because the deployment returned the static 404
before Next middleware/proxy execution.

The safe application workaround is to keep Cache Components enabled and leave
Partial Prefetching disabled until the service-routing integration preserves
Next's segment-prefetch handling.
