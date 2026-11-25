# playwright-route-hides-dev-blocking-route

Minimal reproduction: registering any Playwright `route()` makes `next dev` stop
reporting a blocking route.

With Cache Components on, `next dev` normally reports uncached or request-time
data read outside `<Suspense>` (the `blocking-prerender-*` errors). A test that
calls `page.route()` or `context.route()` loses that report. The page renders,
nothing fails, and the same mistake then fails `next build`.

## Cause

1. Registering a Playwright route turns on request interception, which turns
   the browser's HTTP cache off.
2. With the cache off, Chromium adds `Cache-Control: no-cache` and
   `Pragma: no-cache` to every request, including the document request.
3. `next dev` treats `Cache-Control: no-cache` as "render with server caches
   disabled" (`isBypassingCachesInDev` in `app-render`). For that request it
   skips dev-time validation and prints only:

   ```text
   Route / is rendering with server caches disabled. For this navigation,
   Component Metadata in React DevTools will not accurately reflect what is
   statically prerenderable and runtime prefetchable.
   See more info here: https://nextjs.org/docs/messages/cache-bypass-in-dev
   ```

The route does not have to match the page. One route for a URL that is never
requested is enough.

## App shape

- `cacheComponents: true`
- `app/page.tsx` awaits `connection()` with no `<Suspense>` above it
- `app/api/echo/route.ts` returns the `Cache-Control` and `Pragma` headers the
  server received

## Run

```bash
pnpm install
pnpm reproduce
```

`run.mjs` starts a fresh `next dev` for each scenario, requests `/`, and reports
whether the bypass warning and the blocking-route error appeared.
`node run.mjs <text>` runs only the scenarios whose name contains `<text>`.

## Result

Next.js 16.4.6 and 16.5.0-canary.59, Playwright 1.65.1, Chromium headless shell.

| Request | Headers the server received | Bypass warning | Blocking-route error |
| --- | --- | --- | --- |
| `curl` | none | no | terminal |
| `curl -H 'Cache-Control: no-cache'` | `no-cache` | yes | **none** |
| Playwright, plain `goto` | none | no | terminal, console |
| Playwright, `goto` then `reload` | none | no | terminal, console |
| Playwright, `page.on('request')` listener only | none | no | terminal, console |
| Playwright, `page.route` on a URL that never matches | `no-cache` | yes | **none** |
| Playwright, `page.route` on everything | `no-cache` | yes | **none** |
| Playwright, `context.route` on an API path | `no-cache` | yes | **none** |
| Playwright, no route, `setExtraHTTPHeaders({ 'cache-control': 'no-cache' })` | `no-cache` | yes | **none** |
| Playwright, `page.route` then `unrouteAll` before the visit | none | no | terminal, console |
| Playwright, `page.route` that rewrites the header to `max-age=0` | `max-age=0` | no | terminal, console |
| Playwright, `instant()` around `goto` (the only load) | none | no | **none**; the load fails with a generic error |
| Playwright, `instant()` around `goto`, with `page.route` on a URL that never matches | `no-cache` | no | **none**; the same generic error |

`pnpm build` fails on the same page with `blocking-prerender-dynamic`, so the
mistake is only found at build.

## The dev MCP tools do not recover it

```bash
pnpm reproduce:mcp
```

`mcp.mjs` calls the dev server's MCP endpoint (`/_next/mcp`) after each kind of
visit, with the page left open.

| Visit | `get_errors` | `get_compilation_issues` | `compile_route` |
| --- | --- | --- | --- |
| none | no browser session | no issues | no issues |
| `curl` | no browser session | no issues | no issues |
| Playwright, plain `goto` | reports the blocking route | no issues | no issues |
| Playwright with a `route()` registered | **empty** | no issues | no issues |

`get_errors` reads from the browser session, so it is empty for the same reason
the console is. `get_compilation_issues` and `compile_route` report compile
errors only; a blocking route is not one.

## Workarounds

- Rewrite the header in the route handler:

  ```js
  await page.route('**/*', route =>
    route.continue({ headers: { ...route.request().headers(), 'cache-control': 'max-age=0' } }),
  );
  ```

- Or visit the page once with no routes registered before running tests that
  mock requests.

## Expected

One of:

- dev-time validation still runs when the only reason for the bypass is a
  `Cache-Control: no-cache` request header from an automated browser, or
- the bypass warning says that blocking-route validation was skipped for this
  request and which header caused it, and the Playwright guide mentions it.

## `instant()` on a blocking route

`instant()` from `@next/playwright` does not intercept requests, so it does not turn validation off.
But when the only load of a blocking route happens inside `instant()`, the specific error is not
reported either. The request answers 500, and the terminal and the browser show:

```text
The Navigation Inspector was active, but you attempted to load a blocking route.
Reload the page to reset the inspector.
To identify why this route is blocking, refer to the Instant Navigation docs
```

It says the route is blocking, not which read blocks it or where. Loading the route once without
`instant()` and without a route handler prints the full `blocking-prerender-dynamic` error with
its source line. Checked on Next.js 16.4.6 with `@next/playwright` 16.4.6.
