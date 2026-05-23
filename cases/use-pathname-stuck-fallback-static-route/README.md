# `usePathname()` inside Suspense never resolves on a fully static route

With `cacheComponents: true`, a `<Suspense>` boundary around a Client Component that calls `usePathname()` gets stuck on the fallback after hard reload — but only on **fully static routes**. On dynamic routes it works as expected.

## Setup

```bash
pnpm install
pnpm dev
```

## Steps

1. Visit `http://localhost:3000/` (fully static — no dynamic APIs).
2. Hard reload.
   - **Expected:** green "RESOLVED pathname: /" appears after hydration.
   - **Actual:** red "FALLBACK" text stays visible forever. The Suspense never resolves on the client.
3. Click "Go to dynamic route →".
4. Hard reload.
   - You see green "RESOLVED pathname: /dynamic" — works as expected because the route is dynamic via `await connection()`.

## Why it's a problem

The `usePathname()` docs treat it as a normal client hook. When cache components is on, it suspends during prerender (since the path isn't known at build time) — which is fine, that's what the Suspense boundary is for. The issue is that the **suspended boundary's content never gets streamed/resolved for a fully static route**, so the prerendered HTML ships with a permanently-pending Suspense placeholder. The client has the router context available immediately on hydration, but the fallback never gets replaced.

This breaks a very common pattern: any client-side use of `usePathname()` (active nav links, breadcrumbs, conditional UI) that the docs encourage wrapping in Suspense to keep the parent prerenderable.

## Workaround

Use a `mounted` state flag instead of Suspense:

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

This forces SSR/prerender to render with `isActive: false`, hydration matches the server, then `useEffect` flips `mounted: true` and the active state appears one render later. But this defeats the purpose of `usePathname()` returning a real value synchronously on the client.

## Affected versions

- `next@16.3.0-canary.27`
- React `19.2.4`
- Cache Components enabled
