# `usePathname()` returns the rewritten internal path, not the user-facing URL

When middleware/proxy rewrites a request internally (e.g. `/` → `/noprefetch/`), `usePathname()` on the client returns the **rewritten internal path**, not the URL the user sees in the address bar.

This breaks active-link styling: a `NavLink` with `href="/"` compares its `href` to `usePathname()` and gets `false` because `usePathname()` returns `/noprefetch/` instead of `/`.

## Setup

```bash
pnpm install
pnpm build
pnpm start
```

## Steps

1. Visit `http://localhost:3000/` — `Home` in the sidebar shows `✅ ACTIVE`. Correct.
2. In devtools, set a cookie `no-prefetch=1` for `localhost`.
3. Hard reload `/`.
4. `Home` now shows `(inner, inactive)` — even though the URL bar still says `/`.

The proxy at `proxy.ts` rewrites `/` to `/noprefetch/` internally when the cookie is set. `usePathname()` returns the rewritten value.

## What should happen

`usePathname()` should return the **user-facing URL** (`/`), not the internal rewrite target (`/noprefetch/`). The user's address bar says `/`, the link's `href="/"` matches that intent — but `usePathname()` doesn't.

## Affected versions

- `next@16.3.0-canary.24`
- `react@19.2.4`
- `cacheComponents: true`
