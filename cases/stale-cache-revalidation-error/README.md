# stale-cache-revalidation-error

Minimal repro for a cached route that has a valid stale value, then triggers a deterministic async failure after stale revalidation.

The app uses Next.js 16 canary with `cacheComponents` and `cachedNavigations`.

Deployment: <https://stale-cache-revalidation-error.vercel.app>

## Setup

```bash
cd cases/stale-cache-revalidation-error
pnpm install
pnpm build
pnpm start
```

Open <http://localhost:3000/escaped-revalidation/icyJoseph>.

Control: click **Normal throw**. It should render the route `error.tsx` in the browser.

Repro:

1. Click **Reset**.
2. Click **Warm success**.
3. Click **Arm escaped failure**.
4. Wait at least one second so the cached entry is stale.
5. Refresh the page in `next start` or production.

Expected: the route error boundary catches the failure, or the stale cached value remains visible without a server error.

Actual: the stale revalidation failure escapes the route boundary. In `next start`, the browser may keep showing the stale cached value while the terminal logs:

```text
Error: Deterministic async failure escaped the route error boundary.
```

In production this can show up as a failed request, process-level error, or interrupted stream.

## Error Boundary Current Time

Open <http://localhost:3000/error-current-time/icyJoseph>.

1. Run `pnpm build`.
2. Notice the build passes because `error.tsx` is not rendered during build.
3. Open the failing route from the page.

Expected: either the build catches the unsafe `Date.now()` in `error.tsx`, or the runtime boundary renders normally.

Actual: the unsafe current-time read is only discovered when the error boundary renders.

## Production Symptom

In the affected app, errors escaping cached work showed up as:

```text
Unhandled Rejection: Error: upstream failure
Node.js process exited with exit status: 128.
Error: Connection closed.
```

Adding an `unhandledRejection` listener in `instrumentation.ts` confirmed the rejection escaped, but did not reliably prevent Vercel from treating the function as fatal.
