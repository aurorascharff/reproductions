# Product Catalog — Build Info Test

Tests [vercel/next.js#92518](https://github.com/vercel/next.js/pull/92518): per-param `○`/`◐` symbols in `generateStaticParams` build output.

## Setup

Uses a preview Next.js build with `cacheComponents: true`. Five products, all with `hasReviews: false` (no Suspense renders).

```bash
pnpm install
pnpm build
```

## What happens

```
Route (app)
┌ ○ /
├ ○ /_not-found
└ /products/[id]
  ├ ◐ /products/[id]
  ├ ○ /products/1
  ├ ○ /products/2
  └ ◐ [+3 more paths]
```

- `/products/1` and `/products/2` correctly show `○` (fully static).
- The fallback `/products/[id]` correctly shows `◐` (PPR shell for unlisted params).
- `[+3 more paths]` shows `◐` even though products 3, 4, and 5 are also fully static with no Suspense.

## Expected

```
Route (app)
┌ ○ /
├ ○ /_not-found
└ /products/[id]
  ├ ◐ /products/[id]
  ├ ○ /products/1
  ├ ○ /products/2
  └ ○ [+3 more paths]
```

The truncated `[+3 more paths]` should show `○` since all three remaining products are fully static (no Suspense, no dynamic content).

## Toggling reviews

Set `hasReviews: true` on individual products in `src/lib/data.ts` to add a `<Suspense>`-wrapped reviews section. Products with reviews become `◐`, products without stay `○`. This produces a mixed build output to test the per-param symbol distinction.
