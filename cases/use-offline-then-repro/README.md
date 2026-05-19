# use-offline + params.then() repro

Offline navigation breaks when using `params.then()` inside `<Suspense>` instead of `await params`.

## Setup

```bash
pnpm install
pnpm dev
```

## Steps to reproduce

1. Open http://localhost:3000
2. Click "Async page" and "Then page" once each (to confirm they both work online)
3. Go back to Home
4. Open DevTools → Network → set to **Offline**
5. Click **"Async page (works)"** → ✅ Shows loading shell, offline indicator visible
6. Go back to Home
7. Click **"Then page (breaks)"** → ❌ Does not show loading shell / navigation fails

## Expected

Both patterns should show the `loading.tsx` shell when navigating offline.

## Actual

Only `await params` pages show the shell. `params.then()` pages fail to navigate offline.

## Key files

- [`app/async/[id]/page.tsx`](./app/async/[id]/page.tsx) — uses `await params` ✅
- [`app/then/[id]/page.tsx`](./app/then/[id]/page.tsx) — uses `params.then()` ❌
- Both have identical `loading.tsx` files

## Environment

- Next.js 16.3.0-canary.22
- `cacheComponents: true`
- `experimental.cachedNavigations: true`
- `experimental.useOffline: true`
