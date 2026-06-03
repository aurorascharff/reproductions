# Cronotype `use cache: remote` Investigation

## User

why is this rsc error happening

---

## Assistant

Let me investigate the RSC errors in your cronotype project by pulling recent logs and project details.

Analyzed with 6 tools

Let me check the source code to understand how the GitHub API calls are structured.

Researched with 4 tools

Now let me check how caching is configured and how errors propagate in the RSC tree.

Worked with 3 tools

Checked recent error logs and source code for Next.js cronotype. Here's what's happening:

### Recent errors (production)

| host | method | status | message | request | timestamp |
|--------|--------|--------|--------|--------|--------|
| cronotype.vercel.app | GET | 0 | Unhandled Rejection: Error: GitHub rate limit hit. Try again in a minute. | /mikearnaldi | 2025-06-03T12:10:13Z |
| cronotype.vercel.app | GET | 0 | GitHub rate limit hit. Try again in a minute. (status: 403, digest: 1962906408) — Node.js process exited with exit status: 128 | /mikearnaldi | 2025-06-03T12:10:13Z |
| cronotype.vercel.app | POST | 0 | GitHub rate limit hit. Try again in a minute. (status: 403) — Node.js process exited with exit status: 128 | /mikearnaldi | 2025-06-03T12:10:13Z |
| cronotype.vercel.app | GET | 200 | Error: Connection closed. (cache: HIT) | /mikearnaldi | 2025-06-03T12:09:57Z |
| cronotype.vercel.app | GET | 200 | Error: Connection closed. (cache: HIT) | /mikearnaldi | 2025-06-03T12:09:40Z |
| cronotype.vercel.app | GET | 200 | Error: Connection closed. (cache: HIT) | /mikearnaldi | 2025-06-03T12:09:38Z |
| cronotype.vercel.app | GET | 200 | Error: Connection closed. (cache: HIT) | /mikearnaldi | 2025-06-03T12:09:22Z |
| cronotype.vercel.app | GET | 200 | Error: Connection closed. (cache: HIT) | /devlinduldulao | 2025-06-03T12:08:43Z |
| cronotype.vercel.app | GET | 200 | Unhandled Rejection: GitHub rate limit hit — Node.js process exited with exit status: 128 | /dmmulroy | 2025-06-03T12:02:43Z |
| cronotype.vercel.app | POST | 303 | Unhandled Rejection: GitHub rate limit hit — Node.js process exited with exit status: 128 | /dmmulroy | 2025-06-03T12:02:43Z |
| cronotype.vercel.app | GET | 200 | Unhandled Rejection: GitHub rate limit hit — Node.js process exited with exit status: 128 | /dmmulroy | 2025-06-03T12:02:39Z |

These aren't RSC framework errors -- they're GitHub API rate limit errors (403) that crash the serverless process during server rendering. Two error types are cascading:

### 1. Root cause: GitHub rate limit hit (403)

The `gh()` function in `profile-queries.ts` (line ~115) throws a `GitHubError` when GitHub returns `x-ratelimit-remaining: 0`.

This happens on routes like:

- `/mikearnaldi`
- `/dmmulroy`
- `/devlinduldulao`

All profile pages that call the GitHub REST & GraphQL APIs during RSC rendering.

### 2. Secondary: Connection closed

When the rate-limit error becomes an Unhandled Rejection, the Node.js process crashes (exit status 128).

Concurrent requests being streamed via RSC at that moment get their connection severed mid-stream, producing the Connection closed errors.

Notice these all show `cache: HIT` -- the stale cache data was being served, but the process died before the stream completed.

### Why it's unhandled

Your `'use cache: remote'` functions (e.g. `computeCronotypeCached`, `getProfileCached`) perform background revalidation after the stale window (5 minutes per your `cacheLife` config).

When revalidation fires a GitHub API call and gets rate-limited, the rejection propagates outside the request's error boundary, becoming an unhandled rejection that kills the process.

### Fixes to consider

- Catch errors during revalidation gracefully
- Increase your GitHub API quota
- Extend the stale window

Would you like me to clone the repo and draft a fix for the error handling in `profile-queries.ts`?

---

## User

is this a nextjs bug?

---

## Assistant

Not exactly. The crash mechanism has a framework dimension, but the root cause is in the app code.

### What's a framework concern

When a `'use cache: remote'` function throws during background revalidation (after the 5-minute stale window), Next.js ideally should catch that error and keep serving stale data -- similar to how ISR handles revalidation failures.

Instead, the rejection goes unhandled, which crashes the Node.js process (exit 128).

This could be worth filing as a Next.js issue since the stale-while-revalidate contract implies failed revalidations should be non-fatal.

### What's app-side

The `gh()` and `fetchContributionCalendar()` functions in `profile-queries.ts` intentionally throw `GitHubError` on rate limits.

That design works fine for initial renders (the error boundary in `app/[handle]/error.tsx` catches it), but it's destructive during background revalidation where there's no request-scoped error boundary to catch it.

Additionally, `fetchContributionCalendar()` (line ~147) calls the GitHub GraphQL API directly with raw `fetch`, bypassing the `MAX_CONCURRENT` semaphore that `gh()` uses.

The practical fix is in your code regardless of whether the framework improves here.

Example:

```ts
async function computeCronotypeCached(login: string, window: Window): Promise<CronotypeResult> {
  'use cache: remote';
  cacheTag(`cronotype-${login}-${window}`);
  cacheLife('cronotype');

  const profile = await getProfile(login);
  const today = profile.fetchedAtDate ?? (await getGitHubDateKey());
  const stats = await getStatsFor(login, window, today);
}
```

If `getProfile` or `getStatsFor` throws a rate-limit error during revalidation, the whole process dies.

---

## User

yes

---

## Assistant

Let me read the rest of the file to understand all the cached functions that need the fix.

Analyzed with 7 tools

go

Explored with 10 tools

Now I have the full picture.

Two changes needed:

- `profile-queries.ts` — fetchContributionCalendar bypasses the MAX_CONCURRENT semaphore
- `instrumentation.ts` — prevent process crashes from unhandled rejections during use cache background revalidation

Per your AGENTS.md cache discipline ("don't catch errors inside use cache functions"), I'm not adding try/catch inside cached functions.

### New file: instrumentation.ts

```ts
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    process.on('unhandledRejection', (reason: unknown) => {
      console.error('[instrumentation] Unhandled rejection (likely use-cache revalidation):', reason);
    });
  }
}
```

### fetchContributionCalendar semaphore fix

```ts
await acquireSlot();

let res: Response;

try {
  res = await fetch(`${API}/graphql`, {
    ...
  });
} catch (err) {
  releaseSlot();
  throw err;
}

releaseSlot();
```

Why not catch inside use cache functions:

Per your AGENTS.md cache discipline, catching inside use cache would pin the failure for the entire cacheLife window.

These fixes respect that convention.

---

## User

check now after the fix

---

## Assistant

The logs confirm the problem:

The instrumentation.ts handler fires but does NOT prevent the crash on Vercel.

### Post-fix errors

| timestamp | method | status | request | message |
|------------|------------|------------|------------|------------|
| 2025-06-03T12:18:11Z | GET | 500 | /devlinduldulao/opengraph-image | Error: Connection closed. (cache MISS) |
| 2025-06-03T12:18:10Z | GET | 200 | /devlinduldulao | Unhandled Rejection: GitHub rate limit hit |
| 2025-06-03T12:18:06Z | GET | 200 | /devlinduldulao | GitHub rate limit hit — instrumentation fired, STILL exit 128 |
| 2025-06-03T12:18:06Z | GET | 200 | /aurorascharff | GitHub rate limit hit — instrumentation fired, STILL exit 128 |
| 2025-06-03T12:17:21Z | POST | 303 | /devlinduldulao | Unhandled Rejection during regenerate server action |
| 2025-06-03T12:16:39Z | GET | 500 | /useraugustos/opengraph-image | GitHub rate limit hit |

The logs show:

- instrumentation handler is running
- Vercel still exits with status 128
- listener cannot override runtime behavior

This is a Next.js framework bug.

The regenerate flow works because:

1. cache tags are invalidated
2. cronotype is recomputed
3. redirect occurs
4. CachedEvolutionStrip reruns
5. GitHub gets hit again
6. rate limit triggers
7. process crashes again

Temporary mitigation:

```ts
async function computeCronotypeCached(login: string, window: Window): Promise<CronotypeResult | null> {
  'use cache: remote';

  try {
    ...
  } catch (err) {
    if (isRateLimitError(err)) return null;
    throw err;
  }
}
```

Wrapper:

```ts
export const computeCronotype = cache(async (...) => {
  const result = await computeCronotypeCached(...);

  if (!result) {
    throw new GitHubError(
      'GitHub rate limit hit. Try again in a minute.',
      403
    );
  }

  return result;
});
```

Tradeoff:

A null cached for 5 minutes vs process crashes that kill all concurrent requests.

---

## User

what would the nextjs fix look like, in the framework

---

## Assistant

The bug is in how the Next.js use cache runtime handles errors from cached function execution.

### Conceptual current implementation

```ts
async function cachedFn(...args) {
  const cacheKey = buildKey(fn, args);
  const entry = await remoteCache.get(cacheKey);

  if (entry && isFresh(entry, lifetime)) {
    return deserializeFlight(entry.value);
  }

  if (entry && isStale(entry, lifetime)) {
    executeFn(...args).then(result =>
      remoteCache.set(cacheKey, serializeFlight(result), { tags, lifetime })
    );

    return deserializeFlight(entry.value);
  }

  const result = await executeFn(...args);

  await remoteCache.set(
    cacheKey,
    serializeFlight(result),
    { tags, lifetime }
  );

  return result;
}
```

### Leak A

Background revalidation:

```ts
executeFn(...args).then(...)
```

No `.catch()` attached.

Rejected promise becomes unhandled.

### Leak B

Foreground execution:

If streaming cache writes start before execution fully settles, a thrown error can orphan a write promise.

### Proposed framework fix

```ts
if (entry && isStale(entry, lifetime)) {
  executeFn(...args).then(
    result => {
      remoteCache.set(cacheKey, serializeFlight(result), {
        tags,
        lifetime
      });
    },
    error => {
      // log
      // preserve stale value
    }
  );

  return deserializeFlight(entry.value);
}
```

And for foreground execution:

```ts
const writeController = new AbortController();
const writePromise = createStreamingCacheWrite(
  cacheKey,
  writeController.signal
);

try {
  const result = await executeFn(...args);

  await finalizeWrite(writePromise, result);

  return result;
} catch (error) {
  writeController.abort();
  await writePromise.catch(() => {});
  throw error;
}
```

### Desired behavior

| Scenario | Current | Fixed |
|-----------|-----------|-----------|
| Background revalidation throws | Process crash | Log + serve stale |
| Foreground miss throws | Error boundary + possible crash | Error boundary only |
| Cache hit | Works | Works |
| Success path | Works | Works |

The key principle:

Stale-while-revalidate should behave like ISR.

Revalidation failures should be surfaced through observability, not process-killing unhandled rejections.