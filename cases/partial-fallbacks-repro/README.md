# Partial Fallbacks Repro

> **Production only** — This issue does not appear in `next dev`. You must build and run a production server (or deploy to Vercel) to observe the behavior.

## Feature

`experimental.partialFallbacks` ([Inside Next.js episode](https://nextjs.org/blog/inside-nextjs)) should provide two behaviors for high-cardinality dynamic routes:

1. **Instant fallback shells for runtime-discovered slugs** — When visiting a slug NOT in `generateStaticParams`, the user should immediately get the generic fallback shell from CDN while the dynamic data streams in, instead of a fully blocking server render.

2. **Automatic upgrade** — After the first visit, the page is cached and upgraded from the generic shell to a fully static version. Subsequent visits should be instant without needing the slug in `generateStaticParams`.

## Expected vs actual behavior

| Route | Expected | Actual |
|---|---|---|
| `/items/alpha` (in GSP) | Instant, pre-rendered at build time | Shows `loading.tsx` skeleton on every navigation |
| `/items/beta` (not in GSP, 1st visit) | Fallback shell while content streams in | Shows `loading.tsx` skeleton (same) |
| `/items/beta` (not in GSP, 2nd visit) | Instant after auto-upgrade | Still shows `loading.tsx` skeleton |

## Build output

```
Route (app)        Revalidate  Expire
┌ ○ /
├ ○ /_not-found
└ ◐ /items/[slug]         15m      1y
  ├ /items/[slug]         15m      1y
  └ /items/alpha          15m      1y

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
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

### Deployed

https://partial-fallbacks-repro.vercel.app

## Versions

- `next@canary` (16.2.1-canary.24)
- `react@19.2.4`
