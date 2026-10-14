# `use(io())` current-time hydration check

Minimal app for checking the Client Component pattern proposed in
[vercel/next.js#99677](https://github.com/vercel/next.js/pull/99677). The
component and its parent match the guide's **Suspend static prerendering with
`use(io())`** example.

## App shape

- Next.js `16.5.0-canary.10`
- `cacheComponents: true`
- `partialPrefetching: true`
- A Client Component calls `use(io())`, then renders
  `new Date().toLocaleString()`
- A Server Component wraps it in `<Suspense>`

## Run

```bash
pnpm install
pnpm build
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) and inspect the browser
console during a direct navigation or hard reload.

## Verified result

On 2026-10-14, the production build succeeded. The initial prerendered HTML
contained the Suspense fallback, and the current time appeared in the browser.
No hydration error or warning appeared across 15 hard reloads in Chrome.

This case preserves the exact guide pattern so the reported hydration behavior
can be tested independently.
