# SSR stack overflow has no useful frames

Minimal App Router reproduction for a server-render stack overflow whose
development-server log contains only `at ignore-listed frames`.

## Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## What we expected

The development-server log should include at least one useful application,
React, or Next.js frame identifying where the stack overflow started. For this
fixture, an application frame should point back to the recursive component in
`app/page.tsx`.

## What you actually see

The browser remains blank while the request runs, then receives an HTTP 500.
The terminal prints output like:

```text
RangeError: Maximum call stack size exceeded
    at ignore-listed frames
TypeError: chunk.reason.error is not a function
    at ignore-listed frames
TypeError: frame.join is not a function
    at ignore-listed frames
```

The exact error digest and number of follow-up `TypeError` messages can vary.
The bug is reproduced when the original `RangeError` has only
`at ignore-listed frames`, with no frame pointing to `app/page.tsx`.

The recursive component is only the minimal trigger. A plain recursive
function does not reproduce this bug because its application frame remains in
the stack. The missing-frame behavior occurs when the overflow happens inside
React's server-render loop.
