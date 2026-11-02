# SSR stack overflow has no useful frames

Minimal App Router reproduction for a server-render stack overflow whose
development-server log contains only `at ignore-listed frames`.

Originally reproduced on Next.js `16.4.0-canary.38`. Rechecked on
`16.5.0-canary.3` with both Turbopack and webpack; the diagnostic is still
missing an application frame.

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

## Diagnostic notes

Run with ignore-listed frames exposed:

```bash
__NEXT_SHOW_IGNORE_LISTED=true pnpm dev
```

The hidden stack contains only React Server Components internals such as
`collectStackTracePrivate`, `parseStackTrace`, `renderFunctionComponent`,
`renderElement`, and `renderModelDestructive`. There is no omitted application
frame for Next.js to reveal.

The recursive component returns a new React element before React renders the
next instance, so the component function is no longer on the JavaScript stack
when React's render loop eventually overflows. Next.js then ignore-lists every
remaining framework frame and collapses the result to `at ignore-listed
frames`.

As a control, recursion that occurs directly inside application code is
reported correctly with an application frame and code frame:

```text
RangeError: Maximum call stack size exceeded
    at recurse (app/direct/page.tsx:2:3)
    at recurse (app/direct/page.tsx:2:10)
```

This points to a missing component-owner-stack fallback for render-loop stack
overflows rather than a failure to source-map an existing application frame.
