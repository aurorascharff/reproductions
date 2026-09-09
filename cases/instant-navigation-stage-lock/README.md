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

The production test uses `@next/playwright`'s `instant()` helper and expects:

| Region | During the `instant()` lock | After the lock |
| --- | --- | --- |
| Cached summary | Visible | Visible |
| Cached related sessions below `unstable_navigation()` | Fallback only | Visible |
| Fresh live questions below `connection()` | Fallback only | Visible |

## Observed

The first test warms the reusable related-session cache in one browser context.
The second test starts with a fresh browser context and performs the
`prefetch={true}` navigation under `instant()`. The locked assertion fails
because `related-sessions` is already visible.

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
