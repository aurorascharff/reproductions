# App Router hash Back restores stale content

Minimal reproduction for a Next.js 16.3.0 App Router history bug. Browser Back
restores a URL containing a fragment while the rendered dynamic route remains
on the page that the user navigated away from.

The trigger is a native same-page fragment link followed by a Next.js route
navigation. The case uses one statically generated dynamic route and no MDX,
Cache Components, custom history handling, client layout, or Suspense boundary.

## Run

```bash
pnpm install
pnpm build
pnpm start
```

Open <http://localhost:3000/docs/alpha>.

## Reproduce

1. Click **1. Jump to the details fragment**.
2. Click **2. Navigate to the beta page**.
3. Press the browser Back button once.

## Expected

- The URL is `/docs/alpha#details`.
- The rendered heading is `alpha`.

## Actual

- The URL is `/docs/alpha#details`.
- The rendered heading remains `beta`.
- Pressing Back a second time restores the `alpha` content at `/docs/alpha`.

## Minimal trigger

The fragment entry is created by a native anchor:

```tsx
<a href="#details">Jump to details</a>
```

Replacing that element with `Link` from `next/link` makes Back restore both the
URL and the correct page content. This suggests the native fragment entry lacks
the App Router tree state needed when Next handles the later `popstate`.

The bug reproduces with the default Turbopack production build. Webpack, Cache
Components, React Compiler, client components, and a persistent sidebar were
tested and are not required.

## Related issue

- https://github.com/vercel/next.js/issues/56112
