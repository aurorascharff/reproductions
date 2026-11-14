# Query-only navigation stalls inside `instant()`

A fully prefetched link from `/shop/uk?category=all` to
`/shop/uk?category=home` does not commit while `@next/playwright`'s
`instant()` lock is held. The same navigation works without the lock.

The app uses Cache Components and Partial Prefetching. The category content
is available during prefetch, while a nested stock component calls
`navigation()` and renders behind Suspense. There is no backend, authentication,
external data, or artificial delay.

## Run

```sh
npm ci
npx playwright install chromium
npm run build
npm test
```

Playwright starts a production server on port 3424 and stops it afterward.
To browse the app manually, run `npm start` and open
<http://localhost:3424/shop/uk?category=all>.

## Expected and observed

| Test | Expected | Observed |
| --- | --- | --- |
| Ordinary category navigation | New category and stock appear | Pass |
| Category navigation inside `instant()` | URL and category update, stock fallback appears; stock resolves after unlock | URL wait times out |
| Region navigation inside `instant()` | New region appears with stock fallback | Pass |

Reproduced on Next.js and `@next/playwright` **16.4.6** and
**16.5.0-canary.48**, with React 19.2.4 and Playwright 1.61.0.
The lockfile pins canary.48. A bounded navigation timeout keeps the original
failure visible instead of waiting for Playwright to tear down the browser.

The links already use `prefetch={true}`, and the category subtree has a
category-dependent Suspense key.

## Related fix

[Next.js PR #98634](https://github.com/vercel/next.js/pull/98634) addresses the
same deferred-render deadlock. Its layout-router patch passes the query-navigation
regression in production and development. The regression also checks repeated
query changes, retained input state, and dynamic content after unlocking.

This reproduction stays pinned to an affected published version. The fix is not
included in its dependencies.
