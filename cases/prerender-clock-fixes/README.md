# Clock reads during prerendering

Standalone reproduction for [Next.js #102245](https://github.com/vercel/next.js/pull/102245). Uses Next.js 16.4.6, Turbopack, Cache Components, and Partial Prefetching. No accounts, external data, or API keys are needed. The local `clock-reader` package is installed into `node_modules` as a copy so dependency ignore-listing is exercised.

Run on Node.js 22 with npm:

```sh
npm ci
npm run verify -- diagnostic
npm run verify -- clock-controls
npm run verify -- other-controls
npx playwright install --with-deps chromium
npm run verify -- production
```

| Suite | What it checks |
| --- | --- |
| diagnostic | Build an unguarded dependency clock read normally, in debug mode, and with `__NEXT_SHOW_IGNORE_LISTED=true`. The last build must still fail but name the dependency function and the app caller. |
| clock-controls | A server clock read with Suspense alone, explicit deferral without a parent Suspense boundary, `instant = false` with a direct `new Date()`, and a render-time clock in a Client Component without a boundary. These builds must fail for the relevant reason. |
| other-controls | Direct `Math.random()` and `crypto.randomUUID()` checks for the two parallel error pages linked by the migration guide. |
| production | Inspect prerendered HTML and repeated production requests for both `await io()` and `await connection()` under Suspense, caching a helper that reads the clock, and elapsed-time telemetry. In Chromium compare HTML with the hydrated DOM for effects, event handlers, a library initialized after mount, and a server timestamp passed as a prop. Also includes a bounded client calendar, a deliberate SSR/hydration mismatch, and real session prefetches with and without explicit deferral after cookies and headers. |

The browser clock is deliberately different from the server clock. This makes an unstable first render visible even on fast machines. A separate pair formats a fixed instant near midnight on a UTC server and in a Los Angeles browser; specifying the same time zone is the control. That failure mode does not involve a clock read. The mismatch control is expected to produce a React hydration diagnostic. The same Client Component with `use(io())` is also exercised under a static Suspense fallback and under a parent that waits for a request. The production suite checks `Date()`, `Math.random()` and `crypto.randomUUID()` inside both cached and request-time scopes. The browser-only and supplied-value fixes must not. A build passing alone is not evidence of matching HTML.

The verification script temporarily creates `app/probe` for isolated negative controls. Do not run two suites concurrently in the same checkout. Hosted CI runs each in its own checkout and saves build and server output. See also the [original dependency stack case](../third-party-new-date-missing-stack) and [earlier hydration matrix](../date-hydration-matrix).
