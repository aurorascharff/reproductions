# Static metadata with a slow layout Suspense boundary

This case tests whether a static page title is withheld during a client-side
navigation while an unrelated `<Suspense>` boundary in the root layout is still
pending.

## Result: not reproduced on `next@16.3.1-canary.0`

The target page title updates almost immediately, while the navigation's RSC
request remains open until the artificial three-second delay in `<Navbar />`
finishes.

Measured in a production build across fresh navigations:

| Variant | Title update after click | Navigation completion |
| --- | ---: | ---: |
| No `loading.tsx` | 6–11ms | ~3.04s |
| With `app/dynamic/loading.tsx` | 2ms | ~3.04s |

The static title is therefore not gated on the slow layout Suspense boundary in
this isolated setup. Direct requests also place the static `<title>` in
`<head>`.

## Run

```bash
npm ci
npm run build
npm start
```

Open <http://localhost:3000>, then click **Go to /dynamic**. The page includes a
click-relative timer. A reproducing failure would keep `Static Title Repro` in
the tab for roughly 3000ms; the observed behavior changes it to
`Dynamic Page Static Title` within a few milliseconds.

## Shape of the test

- `app/layout.tsx` exports static metadata and wraps only the slow `<Navbar />`
  in `<Suspense>`; `{children}` is outside the boundary.
- `app/_components/Navbar.tsx` suspends for three seconds.
- `app/dynamic/page.tsx` calls `headers()` to force dynamic rendering while
  exporting a static metadata object.
- `app/_components/TitleWatcher.tsx` records the click and title mutation using
  the same `performance.now()` clock.
- `app/dynamic/loading.tsx` covers the related loading-state variant. Removing
  it produced the same immediate title update.

The click-relative measurement matters: a timer that starts when the watcher
mounts cannot distinguish navigation delay from time spent on the page before
the link is clicked.

## Related reports

- [vercel/next.js#75334](https://github.com/vercel/next.js/issues/75334)
- [vercel/next.js#79313](https://github.com/vercel/next.js/issues/79313)
- [vercel/next.js discussion #81452](https://github.com/vercel/next.js/discussions/81452)
