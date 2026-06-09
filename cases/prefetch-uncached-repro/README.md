# prefetch-uncached-repro

Next.js `16.3.0-canary.45` with `cacheComponents: true`.

Under PPR (the default when `cacheComponents` is on), `<Link prefetch={true}>` should only fetch the **cached** static shell. Uncached server code should NOT execute on hover/viewport prefetch — only on navigation.

## Repro

```bash
pnpm install
pnpm dev
```

1. Open <http://localhost:3000>
2. Watch the dev server terminal
3. Hover the link to `/uncached`

### Expected

No `[REPRO] UNCACHED RAN` log on hover. Logs only appear after clicking (navigation).

### Observed

`[REPRO] UNCACHED RAN at …` fires on hover even though no `unstable_prefetch = 'force-runtime'` is set on the destination route.

## Why this matters

`force-runtime` is the opt-in for prefetching uncached/runtime content. Without it, the default PPR strategy should respect the cache boundary and only prefetch cached content. Invoking uncached server functions on hover defeats the streaming benefit of leaving data uncached on purpose.

## Files

- `app/page.tsx` — home with `<Link>` to `/uncached`
- `app/uncached/page.tsx` — uncached server component that logs when its data fetch runs
- `next.config.ts` — `cacheComponents: true`, nothing else
