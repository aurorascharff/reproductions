# `'use cache: private'` in a shared layout causes duplicate runtime prefetches per route

Next.js `16.3.0-canary.51` with `cacheComponents: true`, `partialPrefetching: true`, `experimental.appShells: true`.

## Setup

Root layout (`app/layout.tsx`) renders a nav and a per-user greeting:

```tsx
<Suspense fallback={<span>…</span>}>
  <Greeting />
</Suspense>
```

`Greeting` calls `getUser()`, a `'use cache: private'` function that reads a session cookie. It's correctly per-request cached.

The home page (`app/page.tsx`) and three other routes (`/a`, `/b`, `/c`) all export `prefetch = 'allow-runtime'`. The layout's nav links to all four via `<Link prefetch={true}>`.

## Repro

1. `pnpm install && pnpm dev`
2. Open DevTools → Network → filter for `_rsc=`.
3. Hard-load `/`.
4. Wait for the in-viewport Partial-Prefetch scan to fire.

### Expected

Each of `/`, `/a`, `/b`, `/c` is prefetched **once**. Subsequent client-side navigations between the four reuse the prefetch payload without new RSC fetches.

### Observed

Each route is fetched **2-4 times** with different `_rsc=` keys on initial load alone. Navigating between routes triggers more RSC fetches even for routes that were just prefetched. The client nav cache misses on every back-nav.

## Why this matters

A root layout commonly contains per-user data (user avatar, notifications badge, profile link with the user's handle). The recommended pattern is `'use cache: private'` for the cookie read. But pairing that with `prefetch = 'allow-runtime'` on child routes — also recommended for instant nav — produces a prefetch storm: each prefetch gets a different cache key because the private section is re-serialized per request.

Result: more bandwidth, slower navigations, and a visible "reload" of the layout's per-user pieces every time the user navigates back to a previously-visited route.

## Files

- `next.config.ts` — the three flags
- `app/layout.tsx` — nav + per-user `Suspense` boundary
- `app/lib/user.ts` — `'use cache: private'` cookie read
- `app/page.tsx`, `app/a/page.tsx`, `app/b/page.tsx`, `app/c/page.tsx` — four runtime-prefetched routes
