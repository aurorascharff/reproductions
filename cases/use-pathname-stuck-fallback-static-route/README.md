# `usePathname()` inside `<Suspense>` never resolves on a fully static route

With `cacheComponents: true`, wrapping a Client Component that calls `usePathname()` in `<Suspense>` is the documented pattern to keep the parent prerenderable. On dynamic routes this works. On a **fully static** route (no `await connection()`, `cookies()`, etc.) the Suspense boundary stays on its fallback forever — even though `usePathname()` returns a real value synchronously in the client bundle.

## Setup

```bash
pnpm install
pnpm dev
```

## Steps

### Static route (broken)

1. Visit `http://localhost:3000/` (fully static — no dynamic APIs).
2. Hard reload.
3. The page shows **red FALLBACK** text forever. The Suspense boundary's children never render on the client.
4. View source: the HTML contains the suspended placeholder (`<!--$?-->` ... `<template id="B:0"></template>`) but no resolution chunk ever arrives.

### Dynamic route (works)

1. Click "Go to dynamic route →".
2. Hard reload `/dynamic`.
3. The page shows **green RESOLVED pathname: /dynamic** correctly after hydration.
4. The only difference between this route and `/` is `await connection()` somewhere on the page — which makes the route dynamic and apparently activates the Suspense streaming machinery.

## What should happen

`usePathname()` is a client-only hook. Once React hydrates on the client, the router context is available synchronously. The Suspense boundary's children should render immediately on hydration, replacing the fallback — same as the dynamic route does.

Instead, on fully static routes, the suspended placeholder is shipped in the prerendered HTML with no client-side resolution path. The fallback persists indefinitely.

## Workaround

Skip the documented Suspense pattern and use a `mounted` state flag instead:

```tsx
'use client';

export function NavLink({ href }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => setMounted(true), []);
  const isActive = mounted ? pathname === href : false;
  // ...
}
```

SSR/prerender produces `isActive: false`. Hydration matches. `useEffect` fires post-mount → `setMounted(true)` → re-render with the resolved pathname. Works on every route (static or dynamic) at the cost of one extra render after hydration.

## Affected versions

- `next@16.3.0-canary.27`
- `react@19.2.4`
- `cacheComponents: true`
