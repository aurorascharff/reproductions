# iOS Safari App Router Activity header flash

Minimal reproduction for a header paint issue during interactive Back and
Forward navigation in iOS Safari. The issue appears when Cache Components keeps
inactive routes mounted inside React Activity boundaries.

The example uses the same relevant structure as React.dev:

- an App Router section layout shared by two documentation pages
- a sticky header that stays mounted between page navigations
- a translucent background with `backdrop-filter`
- an `IntersectionObserver` that adds a shadow after scrolling
- statically generated routes with Cache Components enabled

It deliberately excludes MDX, Sandpack, custom history listeners, and React.dev's
Safari scroll-restoration workaround.

Next.js calls its in-memory route retention mechanism a BFCache and assigns each
entry a `bfcacheId`. This is separate from Safari's native page BFCache.

## Reproduction

1. Open `/docs` in iOS Safari.
2. Tap **Read the article**.
3. Use Safari's edge-swipe gesture to go Back and Forward several times.
4. Watch the shared header while the gesture completes.

The header should remain continuously painted. With the default retention of
three route trees, it can briefly flash or disappear while Next.js hides and
restores route content through React Activity.

A normal click on Safari's Back button does not reproduce the issue as
reliably. The interactive edge swipe is the important test.

## Run locally

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000/docs>. To test from an iOS device or Simulator,
open the network URL printed by Next.js.

## Live comparison

- [With BFCache route retention (3 route trees)](https://ios-activity-header-with-bfcache.vercel.app/docs)
- [Without inactive BFCache route retention (1 active route tree)](https://ios-activity-header-without-bfcache.vercel.app/docs)

Both deployments have Cache Components enabled. The only intended difference
is the maximum number of route trees retained by Next.js's in-memory BFCache.
Open each URL in iOS Safari and repeat the edge-swipe steps above.

## Comparison

By default, the reproduction uses Next.js's normal Cache Components behavior:

```bash
pnpm dev
```

To retain only the active route tree, stop the server and run:

```bash
NEXT_ACTIVITY_RETENTION=1 pnpm dev
```

The sidebar shows the retention value used for the current build. Setting it to
`1` keeps Cache Components enabled but prevents inactive routes from remaining
mounted in hidden Activity boundaries. In testing, this removed the flicker.

The comparison mode temporarily patches Next.js's internal
`bfcache-state-manager` before `next dev` or `next build`. It is diagnostic code,
not a proposed application workaround.

## Notes

The existing React.dev `history.scrollRestoration = 'auto'` workaround fixes a
different iOS Safari issue where the browser could show a gray snapshot during
the Back gesture. Removing it does not fix this header flash.
