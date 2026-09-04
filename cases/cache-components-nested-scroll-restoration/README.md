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

1. Open **Library**, scroll down, and open a track.
2. Use the navigation to visit **Search**, **Favorites**, then **Home**.
3. Press the browser Back button four times.

## Expected

The list returns at the same numbered row. The Link documentation says
Back/Forward navigation maintains scroll position by default.

## Actual

The recreated nested scroll container returns at `scrollTop = 0`.

The app uses plain `Link` with its default `scroll` behavior. FastLink,
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

## Relevant documentation

- https://nextjs.org/docs/app/guides/preserving-ui-state
- https://nextjs.org/docs/app/api-reference/components/link#scroll
