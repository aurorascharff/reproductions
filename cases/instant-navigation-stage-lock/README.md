# `instant()` exposes content below `unstable_navigation()`

This reproduction isolates a discrepancy between the documented Partial
Prefetching navigation stage and the public `instant()` Playwright helper.

The source page contains one `<Link prefetch={true}>`. Its destination renders:

- a cached summary that should be included in the per-link prefetch;
- cached related sessions below `await unstable_navigation()`, which should
  wait for navigation; and
- uncached live questions below `await connection()`, which should stay fresh.

According to the [`unstable_navigation()` documentation](https://nextjs.org/docs/app/api-reference/functions/navigation),
the related sessions should be excluded from both the App Shell and per-link
prefetches. The existing framework test for a speculative runtime prefetch
asserts the same behavior.

## Expected behavior

The production test uses `@next/playwright`'s `instant()` helper to pause after
the prefetched UI is applied but before navigation-only work can commit. At that
point it expects:

| Region                                                | During the `instant()` lock | After the lock |
| ----------------------------------------------------- | --------------------------- | -------------- |
| Cached summary                                        | Visible                     | Visible        |
| Cached related sessions below `unstable_navigation()` | Fallback only               | Visible        |
| Fresh live questions below `connection()`             | Fallback only               | Visible        |

## Failing behavior

Only the navigation-only row is wrong. During the `instant()` lock:

| Region                                                | Expected                 | Actual                   |
| ----------------------------------------------------- | ------------------------ | ------------------------ |
| Cached summary                                        | Visible                  | Visible                  |
| Cached related sessions below `unstable_navigation()` | Absent; fallback visible | **Visible**              |
| Fresh live questions below `connection()`             | Absent; fallback visible | Absent; fallback visible |

The test fails here because Playwright finds one `related-sessions` element
instead of none:

```ts
await expect(page.getByTestId("related-sessions")).toHaveCount(0);
```

The first `[setup]` test passes. It warms the reusable related-session **server
cache** without warming the reproduction test's browser cache. The second
`[reproduction]` test fails in its step named `FAILS: the navigation-only region
is absent and its fallback is visible`. Playwright stops there, so later steps
do not run in that attempt.

The navigation-stage placement matches the documented pattern:
`unstable_navigation()` is awaited in the uncached component before resolving
`params`, and the reusable lookup is in a separate `"use cache"` function below
it.

As a control, the same production test passes with the published
`next@16.4.0-canary.21` package. It fails with the locally packed artifact from
the updated optimizer branch, which narrows the discrepancy to newer framework
changes rather than the fixture alone.

This case intentionally keeps the expected assertion instead of weakening it
to match the observed result.

## Reproduce

```bash
cp /path/to/next.tgz ./next.tgz
pnpm install
pnpm build
pnpm test:e2e
```

`next.tgz` must be packed from the Next.js branch under test. The artifact used
for the observed failure was built from `vercel/next.js#96471` after commit
`626f2bfaaa` updated it from Canary on September 9, 2026. The package reports
version `16.4.0-canary.20`, but contains newer navigation-stage changes. The
tarball is intentionally ignored instead of checking a framework build into
this repository.
