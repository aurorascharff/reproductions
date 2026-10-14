# `use(io())` current-time hydration mismatch

Minimal reproduction for the Client Component pattern proposed in
[vercel/next.js#99677](https://github.com/vercel/next.js/pull/99677). The
error page recommends calling `use(io())` before `Date.now()` in a Client
Component. On a dynamic request, the server renders one value and the browser
renders another during hydration.

## App shape

- Next.js `16.5.0-canary.10`
- `cacheComponents: true`
- `partialPrefetching: true`
- A Server Component calls `await connection()` inside `<Suspense>` so the
  timestamp renders on each request
- A nested Client Component calls `use(io())`, then renders `Date.now()`

## Run

```bash
pnpm install
pnpm build
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) and inspect the browser
console during a direct navigation.

## Expected result

The production build succeeds, but a direct navigation reports a hydration
mismatch. The development error shows the two values explicitly:

```text
Hydration failed because the server rendered text didn't match the client.

+ 1791982169108
- 1791982168993
```

The mismatch is deterministic because `Date.now()` has millisecond precision.
The server includes the request-time value in the streamed HTML, then the
Client Component recomputes the value in the browser.
