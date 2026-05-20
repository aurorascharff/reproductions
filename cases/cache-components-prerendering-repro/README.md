# `use cache: private` — "Prerendering" on every revisit in dev

With `cacheComponents: true`, navigating to a page with `'use cache: private'` triggers "Prerendering" in the devtools overlay on every visit — even revisits to the same page. Pages without cache directives are instant on revisit.

## Setup

```bash
pnpm install
pnpm dev
```

## Steps

1. Click **Uncached /1** — compiles on first visit, instant on revisit ✅
2. Click **Private /1** — shows "Prerendering" on every revisit ❌

## Key files

- [`app/uncached/[id]/page.tsx`](./app/uncached/[id]/page.tsx) — no cache (baseline)
- [`app/cached-private/[id]/page.tsx`](./app/cached-private/[id]/page.tsx) — `'use cache: private'`

## Note

Only affects `next dev`. `next build && next start` works fine.

## Environment

- Next.js 16.3.0-canary.22
- `cacheComponents: true`
