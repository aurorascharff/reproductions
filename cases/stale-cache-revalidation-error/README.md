# use-cache-remote-revalidation-error

Minimal repro for a `use cache: remote` entry that has a valid stale value, then triggers a deterministic async failure during revalidation.

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

Expected: the stale cached value remains visible and the failed remote revalidation is contained.

Actual: the stale revalidation failure escapes the route boundary. In `next start`, the browser may keep showing the stale cached value while the terminal logs:

```text
Error: Deterministic async failure escaped the route error boundary.
```

In production this can show up as a failed request, process-level error, or interrupted stream.

## Production Symptom

In the affected app, errors escaping cached work showed up as:

```text
Unhandled Rejection: Error: upstream failure
Node.js process exited with exit status: 128.
Error: Connection closed.
```

Adding an `unhandledRejection` listener in `instrumentation.ts` confirmed the rejection escaped, but did not reliably prevent Vercel from treating the function as fatal.
