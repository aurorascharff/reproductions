# Cache Components nested scroll restoration

Minimal reproduction for a Next.js 16.3.1-canary.26 App Router scroll
restoration gap. With `cacheComponents: true`, browser history preserves a
route-owned nested scroller while its route remains retained by React Activity.
After enough distinct navigations evict that route, returning through history
recreates the list at `scrollTop = 0`.

## Live reproduction

https://cache-components-nested-scroll-rest.vercel.app

## Run

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Reproduce

1. Open **Visit four routes first**.
2. Scroll down to a clearly numbered row, such as row 25.
3. Open that row and continue through all four distinct routes.
4. Click **Return to the list through history**.

## Expected

The list returns at the same numbered row. The Link documentation says
Back/Forward navigation maintains scroll position by default.

## Actual

The recreated nested scroll container returns at `scrollTop = 0`.

## Control

Repeat the shorter **Back immediately** flow. With only one intervening route,
Activity retains the list DOM and Back restores the nested scroll offset. The
failing flow adds four ordinary route navigations so the list falls outside the
documented three-route retention window.

The two paths use plain `Link` with its default `scroll` behavior. FastLink,
`scroll={false}`, prefetching, data fetching, Suspense, View Transitions, and
animation are not involved.

## App shape

The shared layout provides a fixed-height viewport:

```tsx
<main className="route-viewport">{children}</main>
```

The failing route owns its scroll surface:

```tsx
<div className="page-scroll">{children}</div>
```

```css
.route-viewport {
  min-height: 0;
  overflow: hidden;
}

.page-scroll {
  height: 100%;
  overflow-y: auto;
}
```

The final button calls `window.history.go(-4)` only to make the four Back actions
repeatable with one click. Pressing the browser Back button four times produces
the same result.

## Relevant documentation

- https://nextjs.org/docs/app/guides/preserving-ui-state
- https://nextjs.org/docs/app/api-reference/components/link#scroll
