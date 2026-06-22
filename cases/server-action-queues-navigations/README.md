# server-action-queues-navigations

Deployment: <https://server-action-queues-navigations.labs.vercel.dev>

Minimal repro: a fire-and-forget Server Action holds the next `<Link>` click
when the destination's prefetched RSC was tagged with something the action
invalidates.

## The mechanic

- Destination has a cached function tagged `'items'` and is prefetched.
- Action does `updateTag('items')` (after a 1.5s sleep that mimics a real DB
  write).
- User clicks the action button, then immediately clicks the prefetched link.

The link's prefetched RSC payload is now known-stale — the action just
invalidated the tag it was built from. The router can't commit the stale
prefetch, and it can't render a fresh one until the action returns (the
action's response is what carries the new RSC for the invalidated tag). So
the navigation sits until the action completes.

This is not specific to fire-and-forget. The same thing happens with any
Server Action whose effects overlap the next destination — the router has
to apply the action's RSC update before it commits the navigation, or the
user would land on a stale page they just invalidated.

## Setup

```bash
cd cases/server-action-queues-navigations
pnpm install
pnpm dev
# open http://localhost:3000
```

## What to do

1. Click **Go to destination** on its own. It commits in a few ms — the
   destination is `'use cache'`'d and prefetched.
2. Reload. Click **Fire Server Action**, then *immediately* click
   **Go to destination**. The navigation hangs for ~1.5s, then commits.
   The button next to it stays in its "Working…" state for the same window
   — they finish at the same time, because the navigation is waiting for the
   action's invalidation to land first.

## Workaround for background-only writes

When the write doesn't actually need to invalidate the destination's cache
on the same click — pure telemetry, view pings, play counters — bypass the
queue by going through a Route Handler. Route Handler calls don't enter
the router's dispatch queue, so the next navigation commits independently.
`revalidateTag` still works from inside a Route Handler if you do want
eventual invalidation.

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
- [`app/demo.tsx`](./app/demo.tsx) — `void bumpItems()` button next to a
  prefetched `<Link>`.
- [`app/actions.ts`](./app/actions.ts) — `bumpItems()`: sleep 1.5s, then
  `updateTag('items')`.
- [`app/destination/page.tsx`](./app/destination/page.tsx) — cached read
  tagged `'items'`.

## Source

[`packages/next/src/client/components/use-action-queue.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/client/components/use-action-queue.ts)
— `dispatchAppRouterAction` serializes Server Action responses and
navigation results through the same queue so cache invalidations apply
before any downstream navigation commits.
