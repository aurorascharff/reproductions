# server-action-queues-navigations

Deployment: <https://server-action-queues-navigations.labs.vercel.dev>

Minimal repro: a fire-and-forget Server Action holds the next `<Link>` click
until it returns. The App Router puts Server Action results and navigation
results in the same dispatch queue and applies them in order — so the next
navigation can't commit until the previous action's RSC payload has been
applied.

This is **not** about transitions, caching, prefetching, or revalidation.
The action in this repro does literally nothing (`setTimeout` and return).
The destination has no `'use cache'`, no `revalidateTag`, no shared state.
The queueing happens anyway.

## Setup

```bash
cd cases/server-action-queues-navigations
pnpm install
pnpm dev
# open http://localhost:3000
```

## What to do

1. Click **Go to destination** on its own. It commits in a few ms.
2. Reload. Click **Fire Server Action**, then *immediately* click
   **Go to destination**. The navigation hangs for ~1.5s, then commits.
   The button next to it stays in its "Working…" state for the same window —
   they finish at the same time, because the navigation is waiting for the
   action to land first.

## Expected vs actual

Expected: a Server Action I don't `await` shouldn't gate my next navigation.
The user perceives the second click as dead.

Actual: the App Router's dispatch queue holds the navigation until the
action's response (and the RSC re-render it triggers) has been applied to
the router state. Navigation commits only after the action finishes.

## Why this exists

Every Server Action implicitly re-renders the current route on the server
and ships back an RSC payload. The router needs to apply that payload
before processing the next action or navigation — otherwise the user could
land on a destination that's already been invalidated by the action's
effects, or miss an `updateTag` they just wrote.

In this repro the action does nothing, so the serialization is pure
overhead. But the router can't know that from the call site, so it queues
unconditionally.

## Workaround for background-only writes

If the Server Action is pure telemetry — play count, "mark as read",
view ping — bypass the queue by writing through a Route Handler instead.
Route Handler calls don't go through `dispatchAppRouterAction`; the next
navigation commits independently. `revalidateTag` still works from inside
a Route Handler if you need invalidation.

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

- [`app/page.tsx`](./app/page.tsx) — explanation and the demo.
- [`app/demo.tsx`](./app/demo.tsx) — `void slowAction()` button next to a
  `<Link>`, with the action's round-trip time displayed.
- [`app/actions.ts`](./app/actions.ts) — `slowAction()`: sleep 1.5s, return.
- [`app/destination/page.tsx`](./app/destination/page.tsx) — plain destination,
  no `'use cache'`, no `revalidateTag`.

## Source

[`packages/next/src/client/components/use-action-queue.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/client/components/use-action-queue.ts)
— `dispatchAppRouterAction` serializes all router state updates, including
Server Action responses and navigation results.
