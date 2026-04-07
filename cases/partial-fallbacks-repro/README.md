# Partial Fallbacks Repro

## Feature

`experimental.partialFallbacks` ([Inside Next.js episode](https://nextjs.org/blog/inside-nextjs)) should provide two behaviors for high-cardinality dynamic routes:

1. **Instant fallback shells for runtime-discovered slugs** — When visiting a slug NOT in `generateStaticParams`, the user should immediately get the generic fallback shell from CDN while the dynamic data streams in, instead of a fully blocking server render.

2. **Automatic upgrade** — After the first visit, the page is cached and upgraded from the generic shell to a fully static version. Subsequent visits should be instant without needing the slug in `generateStaticParams`.

## Expected behavior

- `/items/alpha` (in GSP) — Instant. Pre-rendered at build time, no loading skeleton.
- `/items/beta` (not in GSP, first visit) — Immediately shows the fallback shell (`loading.tsx`) from CDN while dynamic content streams in.
- `/items/beta` (not in GSP, second visit) — Instant. Auto-upgraded to fully cached after the first visit.

## Actual behavior

All slugs — including `alpha` (in GSP) — show the `loading.tsx` skeleton on every client-side navigation. No auto-upgrade occurs; non-GSP pages always show the loading skeleton, even on repeat visits.

## Setup

```
app/
  page.tsx                  — Home with links to all slugs
  items/[slug]/
    page.tsx                — Async page, generateStaticParams returns only ["alpha"]
    loading.tsx             — Skeleton fallback
```

`next.config.ts`:

```ts
const nextConfig = {
  cacheComponents: true,
  experimental: {
    partialFallbacks: true,
  },
};
```

## Reproduce

```bash
pnpm install
pnpm run build
pnpm start
```

1. Open `http://localhost:3000`
2. Click `/items/alpha` (in GSP) — shows loading skeleton, **should be instant**
3. Go back, click `/items/beta` (not in GSP) — shows loading skeleton (expected on first visit)
4. Go back, click `/items/beta` again — still shows loading skeleton, **should be instant after auto-upgrade**

## Versions

- `next@canary` (16.2.1-canary.24)
- `react@19.2.4`
