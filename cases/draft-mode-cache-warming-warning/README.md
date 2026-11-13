# Draft Mode triggers a cache-warming warning for deterministic content

With Cache Components and Partial Prefetching enabled, visiting a cached page in
Draft Mode logs an unexpected cache miss. The cached function takes **no arguments**
and returns a constant string. There is no database, authentication service,
network request, client component or test instrumentation.

Related issue: [vercel/next.js#100680](https://github.com/vercel/next.js/issues/100680).

## Run

Requires Node.js 20.9 or later. Tested with Next.js **16.4.5**, React **19.1.0**,
and a Turbopack production build.

```sh
npm install
npm run build
npm start
```

1. Open <http://localhost:3000>. The content renders without a warning.
2. Click **Enable Draft Mode**. The same content renders, but the server logs the warning below.
3. Click **Disable Draft Mode**. Reloading the page no longer logs it.

The preview endpoint deliberately has no authorization because this is a local
reproduction. Do not deploy it as an application's preview endpoint.

## Automated reproduction

After building, this starts its own production server on port 3199, visits the
page without a Draft Mode cookie, with the cookie, then without it again. It
checks that every response succeeds and contains the content.

```sh
npm run build
npm run reproduce
```

Observed on November 13, 2026:

| Condition | HTTP status | Cache-warming warnings |
| --- | --- | --- |
| Draft Mode off | 200 | 0 |
| Draft Mode on | 200 | 1 |
| Draft Mode off again | 200 | 0 |

```text
Error: Route "/": Unexpected cache miss after cache warming phase during prerendering. This is likely caused by non-deterministic arguments that differ between the cache warming phase and the final prerender phase (e.g. unstable array order). Ensure that arguments passed to cached functions are deterministic.
```

The warning suggests unstable arguments, but [`getContent()`](lib/content.js)
has none. Draft Mode bypassing the cache is expected. This diagnostic is not.

## Control without Partial Prefetching

Rebuild with Partial Prefetching disabled, keeping Cache Components enabled:

```sh
PARTIAL_PREFETCHING=0 npm run build
PARTIAL_PREFETCHING=0 EXPECT_WARNING=0 npm run reproduce
```

All three requests returned HTTP 200 with **zero warnings**. Restore the default
build with `npm run build` before trying the reproduction again.
