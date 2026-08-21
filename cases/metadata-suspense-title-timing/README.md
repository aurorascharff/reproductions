# Transient empty title during soft navigation

This case reproduces a transient empty document title during a client-side
navigation between pages with static metadata. It also tests whether the new
title is withheld while an unrelated `<Suspense>` boundary in the root layout
is pending.

**Live reproduction:** [metadata-suspense-title-timing.vercel.app](https://metadata-suspense-title-timing.vercel.app)

## Result: reproduced on `next@16.3.1`

Next.js removes the old `<title>` before it inserts the new one. During that
interval, the document has no `<title>` element and `document.title` is an empty
string. Chrome displays the URL as the tab title until the new title arrives.

One local run produced this trace in development:

```text
0ms: click /dynamic — document.title = "Static Title Repro"
146.8ms: title removed — document.title = ""; <title> count = 0
150.9ms: title inserted — document.title = "Dynamic Page Static Title"; <title> count = 1
```

The optimized production build reproduced the same sequence with a shorter
gap:

```text
0ms: click /dynamic — document.title = "Static Title Repro"
9.4ms: title removed — document.title = ""; <title> count = 0
11.6ms: title inserted — document.title = "Dynamic Page Static Title"; <title> count = 1
```

The exact duration varies with timing and network conditions. The static title
is not gated on the artificial three-second Navbar delay, but replacing it is
not atomic.

## Run

```bash
npm ci
npm run build
npm start
```

Open <http://localhost:3000>, then click **Go to /dynamic**. The page includes a
click-relative trace of every `<title>` removal and insertion.

## Shape of the test

- `next.config.ts` enables Cache Components and Partial Prefetching, matching the
  reported production app.
- `app/layout.tsx` exports static metadata and wraps only `<Navbar />` in
  `<Suspense>`. `{children}` remains outside the boundary.
- `app/_components/Navbar.tsx` reads `headers()` and suspends for three seconds,
  standing in for session-aware navigation.
- `app/dynamic/page.tsx` and its metadata are static.
- `app/_components/TitleWatcher.tsx` records the click and every title mutation
  using the same `performance.now()` clock.
- `app/dynamic/loading.tsx` covers the related loading-state variant. Removing
  it does not make the title replacement atomic.

The click-relative measurement matters: a timer that starts when the watcher
mounts cannot distinguish navigation delay from time spent on the page before
the link is clicked.

## Related reports

- [vercel/next.js#65872](https://github.com/vercel/next.js/issues/65872)
  reported the same temporary reset in 2024. A maintainer confirmed that
  `document.title` became empty. The issue later closed for inactivity.
- [vercel/next.js#96797](https://github.com/vercel/next.js/issues/96797) is the
  closest match. It reports the same removal of the old title before insertion
  of the new title and the effect on the App Router announcer. It was closed by
  automation because the report did not include a public reproduction.
- [vercel/next.js#83017](https://github.com/vercel/next.js/issues/83017) tracks a
  related URL-as-title flash while asynchronous `generateMetadata` resolves.
  This reproduction uses only static metadata.
- [vercel/next.js#75334](https://github.com/vercel/next.js/issues/75334)
- [vercel/next.js#79313](https://github.com/vercel/next.js/issues/79313)
- [vercel/next.js discussion #81452](https://github.com/vercel/next.js/discussions/81452)
