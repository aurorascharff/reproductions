# server-action-queues-navigations

Minimal repro showing that a **fire-and-forget Server Action serializes the
next `<Link>` navigation** — even when the call site doesn't `await` it, isn't
inside a `startTransition`, and the action has no effect on cached data.

This is the App Router's internal action queue. Server Actions and navigations
share one queue; the next navigation can't commit until the in-flight action's
response (and its RSC payload) is applied.

For background-only writes (telemetry, view counts, "mark as read", play
tracking), this means the user feels every action as a navigation delay —
even when nothing in the action could possibly affect where they're going.

## Setup

```bash
cd cases/server-action-queues-navigations
pnpm install
pnpm dev
# open http://localhost:3000
```

## Steps

1. **Cold click is instant.** Reload the page, then click **Target A**. It
   commits in a couple of milliseconds — the destination is cached with
   `'use cache'` and was prefetched by `<Link prefetch={true}>`.

2. **Click after a fire-and-forget action is delayed.** Reload the page, then:
   1. Click the **Fire** button. This calls `void slowAction()` — fire-and-forget,
      no `await`, no `startTransition`. The action just sleeps 1.5 seconds
      server-side.
   2. **Immediately** click **Target B**.

   The navigation will sit for ~1.5s before committing — the entire duration
   of the in-flight action — even though Target B was fully prefetched and the
   action has nothing to do with it.

## Expected vs actual

Expected: a click I don't `await` and don't put in a transition shouldn't gate
my next navigation. The user perceives this as a dead click.

Actual: the App Router's action queue processes the action's response before
processing the navigation. Navigation commits only after the action returns.

## Why this matters

This is the right behavior when the action's response includes a
`revalidateTag` / `updateTag` that the next page reads — committing the
navigation first would risk showing stale data the user just wrote.

It's the wrong behavior when the action is pure telemetry. A play counter, a
"mark as read" ping, a view increment — these don't affect what the user is
navigating to, but they still gate the navigation.

**Workaround:** for background-only writes, use a `fetch()` to a Route Handler
instead of a Server Action. Route Handler calls don't enter the router's
action queue; the next navigation commits independently. `revalidateTag` still
works from inside a Route Handler if invalidation is needed.

```ts
// Instead of
void recordPlay(trackId); // Server Action — queued

// Do
void fetch("/api/play", {
  method: "POST",
  body: JSON.stringify({ trackId }),
  keepalive: true,
}); // Route Handler — not queued
```

## Files

- [`app/page.tsx`](./app/page.tsx) — home with two prefetched Links + a button.
- [`app/actions.ts`](./app/actions.ts) — the `slowAction` Server Action (1.5s sleep, no side effects).
- [`app/fire-and-forget-button.tsx`](./app/fire-and-forget-button.tsx) — `void slowAction()` on click.
- [`app/target-a/page.tsx`](./app/target-a/page.tsx), [`app/target-b/page.tsx`](./app/target-b/page.tsx) — cached destinations.

## Source

Action queue implementation:
[`packages/next/src/client/components/use-action-queue.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/client/components/use-action-queue.ts)
— navigations and server-action results go through the same
`dispatchAppRouterAction` pipeline, applied one at a time.
