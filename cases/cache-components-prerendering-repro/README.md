# Cache Components "Prerendering" DX repro

With `cacheComponents: true`, every navigation in dev triggers "Prerendering" in the devtools overlay — even revisits to the same page with a warm cache. Without `'use cache'` directives, revisits are instant after the first compile.

## Setup

```bash
pnpm install
pnpm dev
```

## Steps

1. Open http://localhost:3000
2. Click `/uncached/1` — first visit compiles + renders. Click Home, then `/uncached/1` again — instant (no "Prerendering")
3. Click `/cached/1` — first visit compiles + renders. Click Home, then `/cached/1` again — shows "Prerendering" again despite warm cache
4. Try the same with `/cached-fn/1` and `/cached-private/1`

## Expected

Revisits to a cached page with a warm cache should be instant in dev, just like uncached pages.

## Actual

Every navigation to a `'use cache'` page triggers "Prerendering", making dev feel slow.

## Note

This only affects `next dev`. `next build && next start` works perfectly — the cache is warm after the first request.

## Routes

| Route | Pattern | Expected revisit behavior |
|---|---|---|
| `/uncached/[id]` | No cache | ✅ Instant |
| `/cached/[id]` | `'use cache'` on component | ❌ "Prerendering" every time |
| `/cached-fn/[id]` | `'use cache'` on data function | ❌ "Prerendering" every time |
| `/cached-private/[id]` | `'use cache: private'` | ❌ "Prerendering" every time |

## Environment

- Next.js 16.3.0-canary.22
- `cacheComponents: true`
