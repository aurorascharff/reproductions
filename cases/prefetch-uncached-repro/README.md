# prefetch-uncached-repro

Next.js `16.3.0-canary.46` with `cacheComponents: true`.

Under PPR (the default when `cacheComponents` is on), viewport prefetch should only fetch the **cached** static shell. Uncached server code should NOT execute on prefetch — only on actual navigation. The `unstable_prefetch = 'force-runtime'` route segment is the opt-in for prefetching runtime/uncached content.

**Bug:** Even on a route with no `unstable_prefetch` set, viewport prefetch invokes uncached server code in a production build.

## Repro

```bash
pnpm install
pnpm build
pnpm start
```

1. Open <http://localhost:3000>
2. Watch the terminal for `[REPRO] UNCACHED RAN …`
3. Do not click anything

### Expected

No `[REPRO] UNCACHED RAN` log on viewport prefetch. The uncached server function should only execute when the user actually navigates to `/uncached`.

### Observed

Both fire within ~3s of page load without any click:

```
[REPRO force-runtime] UNCACHED RAN at 2026-06-09T15:44:18.370Z
[REPRO] UNCACHED RAN at 2026-06-09T15:44:18.371Z
```

- `/force-runtime` firing is **expected** — that route exports `unstable_prefetch = 'force-runtime'`.
- `/uncached` firing is the **bug** — that route has no `unstable_prefetch` setting and no `'use cache'` directives.

Removing the explicit `prefetch` prop from the `<Link>` to `/uncached` does not change the behavior — Next prefetches viewport-visible links by default.

## Why this matters

`force-runtime` is the documented opt-in for prefetching uncached/runtime content. Without it, the default PPR strategy should respect the cache boundary and only prefetch cached content. Invoking uncached server functions on viewport prefetch defeats the streaming benefit of leaving data uncached on purpose, and runs server work the user may never navigate to.

## Files

- `app/page.tsx` — three links to `/uncached` (no prefetch prop, explicit `prefetch`) and one to `/force-runtime`
- `app/uncached/page.tsx` — uncached server component (uses `connection()` + `console.log`)
- `app/force-runtime/page.tsx` — same component plus `export const unstable_prefetch = 'force-runtime'` (control case)
- `next.config.ts` — `cacheComponents: true`
