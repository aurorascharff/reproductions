# server-action-queues-navigations

Deployment: <https://server-action-queues-navigations.labs.vercel.dev>

The App Router's dispatch queue serializes Server Action responses with the
next navigation — usually. When a navigation is initiated in the same React
tick as the action's dispatch, it slips past the queue. The router commits
the prefetched payload immediately, the action runs to completion and
invalidates the tag, but the user lands on stale data with no signal that
anything went wrong.

This repro shows both paths side by side.

## Setup

```bash
cd cases/server-action-queues-navigations
pnpm install
pnpm dev
# open http://localhost:3000
```

## What to compare

**Slow path (queue engages).** Click *Fire Server Action*, wait until the
button reads "Working…", then click *Go to destination*. The click sits ~1s
while the action finishes, then commits with the post-action count. Works as
designed — actions and navigations are serialized.

**Fast path (queue bypassed).** Click *Fire + navigate (same tick)*. This
fires the Server Action and calls `router.push("/destination")` in the same
synchronous handler. The navigation commits in ~10ms showing the *old*
count. The action still completes server-side and `updateTag('items')` still
runs — but the prefetched RSC was built before the invalidation, and the
router used it as-is.

Go back home (count is now correct, because back-navigation reads server
state that's already been invalidated and re-fetched). Click *Fire +
navigate* again. Destination shows the count *one behind* the server, every
time.

## Why this matters

The slow-path behavior is the contract: "actions and navigations serialize,
so you never land on stale content you just invalidated." The fast path
quietly breaks that contract. Power users — anyone who clicks quickly, or
any code that does `action(); router.push()` in one handler — gets silent
staleness.

In real apps this looks like: favorite a track, immediately click
/favorites, the page doesn't show your new favorite. Refresh and it's
there. Look like a cache bug, but it's the router queue being bypassable.

This is the same friction we hit in the [next-beats](https://github.com/vercel-labs/next-beats)
demo. Server Action + immediate `<Link>` click felt like a dead click, and
the wait read as broken UI rather than as the framework keeping the
destination consistent. That trade-off is intentional in React's concurrent
model — transitions hold the previous state mounted rather than flicker to
a loading screen, on the assumption that the developer will surface pending
feedback if the wait gets noticeable (`useLinkStatus`, an active state
swap, anything). Without that affordance, "the framework is being careful"
and "the framework is broken" look identical to the user. The slow-path
behavior here is right; the missing piece is making the wait legible.

## Workaround for background-only writes

When the write doesn't need read-your-own-writes on the next navigation —
pure telemetry, view pings, play counters — write through a Route Handler.
Route Handler calls don't enter the dispatch queue. `revalidateTag` still
works from inside a Route Handler.

```ts
// Instead of
void recordPlay(trackId); // Server Action — racey with next click

// Do
void fetch("/api/play", {
  method: "POST",
  body: JSON.stringify({ trackId }),
  keepalive: true,
}); // Route Handler — out of band
```

## Files

- [`app/page.tsx`](./app/page.tsx) — Home reads `getCount()`, renders both demos.
- [`app/demo.tsx`](./app/demo.tsx) — two buttons: fire-and-forget vs.
  fire-plus-navigate-same-tick.
- [`app/actions.ts`](./app/actions.ts) — `bumpItems()`: sleep 1.5s, increment
  the shared counter, `updateTag('items')`.
- [`app/destination/page.tsx`](./app/destination/page.tsx) — reads `getCount()`.
- [`app/data.ts`](./app/data.ts) — `getCount()`: `'use cache'` + `cacheTag('items')`.
- [`app/store.ts`](./app/store.ts) — file-backed counter so the value
  persists across worker processes and we can prove which value is being
  read at each step.

## Source

[`packages/next/src/client/components/use-action-queue.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/client/components/use-action-queue.ts)
