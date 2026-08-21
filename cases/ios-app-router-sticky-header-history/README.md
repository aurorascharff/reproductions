# iOS Safari App Router sticky header flash

Minimal reproduction for a header paint issue during interactive Back and
Forward navigation in iOS Safari.

The example uses the same relevant structure as React.dev:

- an App Router section layout shared by two documentation pages
- a sticky header that stays mounted between page navigations
- a translucent background with `backdrop-filter`
- an `IntersectionObserver` that adds a shadow after scrolling
- statically generated routes with Cache Components enabled

It deliberately excludes MDX, Sandpack, custom history listeners, and React.dev's
Safari scroll-restoration workaround.

## Reproduction

1. Open `/docs` in iOS Safari.
2. Tap **Read the article**.
3. Use Safari's edge-swipe gesture to go Back and Forward several times.
4. Watch the shared header while the gesture completes.

The header should remain continuously painted. In the affected React.dev
preview, it briefly flashes or disappears during the history gesture.

A normal click on Safari's Back button does not reproduce the issue as
reliably. The interactive edge swipe is the important test.

## Run locally

```bash
pnpm install
pnpm dev
```

Then open the printed network URL from an iOS device or Simulator.

## Notes

The existing React.dev `history.scrollRestoration = 'auto'` workaround fixes a
different iOS Safari issue where the browser could show a gray snapshot during
the Back gesture. Removing it does not fix this header flash.
