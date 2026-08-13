# App Router hash Back restores stale content

Minimal reproduction for a Next.js 16.3.0 App Router history bug. Browser Back
restores the URL of a documentation article, including its fragment, while the
rendered content can remain on the article that the user navigated away from.

The reproduction looks and behaves like a typical documentation site:

- The right-hand **On this page** table of contents uses native HTML anchors to
  navigate to sections in the current article.
- The **Next article** card uses `Link` from `next/link` to navigate to another
  App Router page.

There is no iframe, MDX, Cache Components, custom history handling, client
layout, or Suspense boundary in this case.

## Live reproduction

https://app-router-hash-back-stale-content.vercel.app/docs/rendering-lists

## Run

```bash
pnpm install
pnpm build
pnpm start
```

Open <http://localhost:3000/docs/rendering-lists>.

## Reproduce

1. In **On this page**, click **Keeping list items in order with key**. This is
   an ordinary `<a href="#keeping-list-items-in-order-with-key">` section link.
2. Scroll to the bottom and click **Next article: Managing State**. This is a
   Next.js `Link` to another route.
3. Press the browser Back button once.

## Expected

- The URL is `/docs/rendering-lists#keeping-list-items-in-order-with-key`.
- The rendered article is **Rendering Lists** at the selected section.

## Actual

- The URL is `/docs/rendering-lists#keeping-list-items-in-order-with-key`.
- The rendered article can remain **Managing State**.
- Pressing Back a second time restores the **Rendering Lists** content.

## Minimal trigger

The table of contents creates the fragment history entry with the same native
anchor pattern commonly used on documentation pages:

```tsx
<a href="#keeping-list-items-in-order-with-key">
  Keeping list items in order with key
</a>
```

Replacing that element with `Link` from `next/link` makes Back restore both the
URL and the correct article content. This suggests the native fragment entry
lacks the App Router tree state needed when Next handles the later `popstate`.

The bug reproduces with the default Turbopack production build. Webpack, React
Compiler, client components, and a persistent sidebar were tested and are not
required.

## Related issue

- https://github.com/vercel/next.js/issues/56112
