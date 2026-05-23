# Cache components: Suspense fallbacks don't show in dev

With `cacheComponents: true`, any route using caching triggers "Prerendering" in the devtools overlay instead of showing Suspense fallbacks. This makes it impossible to see/test loading states during development.

## Setup

```bash
pnpm install
pnpm dev
```

## Steps

1. Click **Uncached /1** — shows Suspense fallback, then content ✅
2. Click **Cached /1** (`'use cache'` on component) — blocks first time with "Prerendering", no skeleton ❌
3. Click **Private /1** (`'use cache: private'` on component) — blocks with "Prerendering" every revisit ❌

## Key files

| Route | Strategy | File |
|-------|----------|------|
| `/uncached/[id]` | No cache (baseline) | [`app/uncached/[id]/page.tsx`](./app/uncached/[id]/page.tsx) |
| `/cached-default/[id]` | `'use cache'` on component | [`app/cached-default/[id]/page.tsx`](./app/cached-default/[id]/page.tsx) |
| `/cached-private/[id]` | `'use cache: private'` on component | [`app/cached-private/[id]/page.tsx`](./app/cached-private/[id]/page.tsx) |

## The problem

In dev mode, Suspense fallbacks are never visible on cached routes. Instead the devtools overlay shows "Prerendering" which blocks the entire page. With `'use cache: private'` it re-triggers prerendering on every navigation, not just first visit.

Only affects `next dev`. `next build && next start` works fine.

## Environment

- Next.js 16.3.0-canary.22
- `cacheComponents: true`
