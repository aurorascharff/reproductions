# server-action-queues-navigations

Deployment: <https://server-action-queues-navigations.labs.vercel.dev>

Minimal repro: a fire-and-forget Server Action holds the next `<Link>` click
because Server Action responses and navigation results go through the App
Router's same dispatch queue. The next navigation can't commit until the
in-flight action's response (and its RSC re-render of the current route)
has been applied.

When the action also `updateTag`s a tag the destination reads, the
destination's `<Suspense>`'d data re-fetches once the click commits and
shows the post-action value — so the user lands on fresh content. The cost
is the click felt non-responsive while the action was in flight.

## Setup

```bash
cd cases/server-action-queues-navigations
pnpm install
pnpm dev
# open http://localhost:3000
```

Or `pnpm build && pnpm start` for the production behavior — the queueing is
visible in both, but the timing is cleaner in production.

## What to do

1. Click **Go to destination** on its own → instant (~10ms). The destination
   shows the same count as Home.
2. Reload. Click **Fire Server Action**, then *immediately* click
   **Go to destination**. The navigation hangs for ~half a second while the
   action runs; when it commits, the destination shows the *new* count.

The button next to the link reports `action took Nms`. Compare that to how
long the link click felt — they overlap. The router can't commit the
navigation until the action's RSC update has been applied.

## What this isn't about

- **Not transitions.** The call site is `void slowAction()` — no `await`, no
  `startTransition`. The queueing is the App Router's, not React's.
- **Not the destination being slow.** `getCount()` is a cached read.
  Without the action firing, the click commits in milliseconds.

## Workaround for background-only writes

When the write doesn't actually need read-your-own-writes on the next
navigation — pure telemetry, view pings, play counters — bypass the queue
by going through a Route Handler. Route Handler calls don't enter the
router's dispatch queue, so the next navigation commits independently.
`revalidateTag` still works from inside a Route Handler if you want eventual
invalidation.

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

- [`app/page.tsx`](./app/page.tsx) — Home reads `getCount()`, renders the demo.
- [`app/demo.tsx`](./app/demo.tsx) — `void bumpItems()` button next to a
  prefetched `<Link>`.
- [`app/actions.ts`](./app/actions.ts) — `bumpItems()`: sleep 1.5s, increment
  the shared counter, then `updateTag('items')`.
- [`app/destination/page.tsx`](./app/destination/page.tsx) — reads `getCount()`,
  shows the post-action value once the navigation commits.
- [`app/data.ts`](./app/data.ts) — `getCount()`: `'use cache'` + `cacheTag('items')`.
- [`app/store.ts`](./app/store.ts) — file-backed counter so the value
  actually changes between fetches and persists across worker processes.

## Source

[`packages/next/src/client/components/use-action-queue.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/client/components/use-action-queue.ts)
— `dispatchAppRouterAction` serializes Server Action responses and
navigation results through the same queue.
