# stale-cache-revalidation-error

Minimal repro for a cached route that has a valid stale value, then surfaces a deterministic upstream error when the backing source fails during revalidation.

The app uses Next.js 16 canary with `cacheComponents`, `cachedNavigations`, and routes that mimic a profile page whose upstream data can become stale.

Deployment: <https://stale-cache-revalidation-error.vercel.app>

## Setup

```bash
cd cases/stale-cache-revalidation-error
pnpm install
pnpm build
pnpm start
```

Open <http://localhost:3000/stale-revalidate/icyJoseph>.

## Primary Repro: Thrown Revalidation Error

1. Click **Reset**.
2. Click **Warm success**.
3. Click **Make source throw**.
4. Wait at least one second so the cache entry is stale.
5. Refresh the page.

Expected: the previous cached profile payload stays visible, or the revalidation failure is handled without poisoning the route.

Actual in `next start`: the route falls into the error boundary with a deterministic upstream error. Repeated refreshes keep showing the same error until the cache is explicitly warmed or reset.

## Control: No Runtime Prefetch Export

Run the same steps on <http://localhost:3000/stale-revalidate-control/icyJoseph>.

That route uses the same cached function and failure path, but does not export:

```ts
export const unstable_prefetch = 'force-runtime';
```

This helps separate a general stale revalidation failure from a runtime-prefetch/cached-navigation-specific failure.

## Fallback Poison Repro

Run the same steps on <http://localhost:3000/stale-revalidate-fallback/icyJoseph>.

This route catches the deterministic upstream failure inside the cached function and returns an explicit fallback payload:

```ts
if (shouldFail.has(lower)) {
  return { attempt, generatedAt: new Date(), handle: lower, status: 'fallback' };
}
```

Expected: if a stale revalidation fails, the previous successful cache entry should remain the value users see.

Actual: the fallback can become the cached value. That mirrors the app bug where returning `null` or fallback data from `use cache` avoided a crash, but replaced a previously good profile with an error-like cache entry.

## Whole App Break Repro

Open <http://localhost:3000/escaped-revalidation/icyJoseph>.

1. Click **Reset**.
2. Click **Warm success**.
3. Click **Arm escaped failure**.
4. Wait at least one second so the cached entry is stale.
5. Refresh the page in `next start` or production.

The route includes stable sibling UI and a route-level `error.tsx`. A normal render error should be contained by that boundary. The failure being demonstrated escapes that boundary path, so the app-level symptom is a failed request, process-level error, or interrupted stream instead of a local fallback.

## Related Routes

- `/flaky/icyJoseph`: first cached render throws; the error UI can warm the same cache tag.
- `/flaky-double/icyJoseph`: two sibling streamed regions read the same flaky cached profile.
- `/stale-revalidate-fallback/icyJoseph`: catches the stale upstream failure and demonstrates fallback-cache poisoning.
- `/escaped-revalidation/icyJoseph`: stable sibling UI plus an escaped async failure that is not contained by route `error.tsx`.
- `/icyJoseph`: runtime prefetch route with a cached payload that includes a real `Date`.
- `/control/icyJoseph`: same cached `Date` payload, no force-runtime prefetch export.
- `/string/icyJoseph`: same force-runtime prefetch export, cached timestamp serialized as a string.
- `/current-time/icyJoseph`: `Date.now()` in the render path.
- `/cached-current-time/icyJoseph`: current time moved inside a cached function.

## Production Symptom

In the affected app, errors escaping cached work showed up as:

```text
Unhandled Rejection: Error: upstream failure
Node.js process exited with exit status: 128.
Error: Connection closed.
```

Adding an `unhandledRejection` listener in `instrumentation.ts` confirmed the rejection escaped, but did not reliably prevent Vercel from treating the function as fatal.

The fallback route shows why catching an upstream failure inside the same cached function and returning `null` or fallback data is dangerous: the fallback can replace the last good value. The safer app-side mitigation is to avoid frequent time-based background revalidation for upstream-backed profile data, use explicit `updateTag` from the user action that owns regeneration, and avoid caching error sentinels as successful values.
