# `use(io())` current-time hydration check

Minimal verification of the Client Component pattern proposed in
[vercel/next.js#99677](https://github.com/vercel/next.js/pull/99677). The
error page recommends calling `use(io())` before `Date.now()` in a Client
Component and wrapping it in `<Suspense>`.

## App shape

- Next.js `16.5.0-canary.10`
- `cacheComponents: true`
- `partialPrefetching: true`
- A Client Component calls `use(io())`, then renders `Date.now()`
- The parent Server Component wraps it in `<Suspense>`

## Run

```bash
pnpm install
pnpm build
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) and inspect the browser
console during a direct navigation.

## Expected result

The production build succeeds and a direct navigation does **not** report a
hydration mismatch.

During static prerendering, `io()` suspends and the nearest `<Suspense>`
fallback is prerendered. The timestamp is not included in the prerendered HTML.
In the browser, `io()` resolves immediately and the Client Component renders
the current timestamp without comparing it with a server-rendered timestamp.

Adding `await connection()` changes this into a dynamic-request scenario. In
that separate case, both the server and browser render `Date.now()`, which can
produce a hydration mismatch. That is not the static-prerender case shown here.
