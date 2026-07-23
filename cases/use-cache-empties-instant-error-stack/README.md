# use-cache-empties-instant-error-stack

Repro for: **a `use cache` page makes the `instant-shell-url-data` insight fire
with an empty Call Stack** — no frame points into user code. Per Sebbie: "no
codeframe, or a stack that doesn't point into usercode, is always a bug."

Removing `use cache` from the top of the page brings the stack back (it points
at the `await params` line). Same route, same everything else — `use cache` is
the only variable.

## The shape (what's required to reproduce)

- `cacheComponents: true` **and** `partialPrefetching: true` in `next.config.ts`
  — PPF is what runs the instant-navigation / GSP shell validation. Without it
  the insight does not fire.
- An upper `<Suspense>` boundary (here: above `<body>` in `app/layout.tsx`) so
  the route gets a static shell to validate.
- A `generateStaticParams` (generic) on the dynamic route.
- `params` read on the page.
- `"use cache"` at the top of the page file.

Two sibling routes, identical except for `"use cache"`:

| Route | `use cache`? | Insight fires? | Call Stack |
|-------|--------------|----------------|------------|
| [`/with-cache/1`](app/with-cache/[id]/page.tsx) | **yes** | yes (`instant-shell-url-data`) | **empty** — only ignore-listed `react-server-dom` frames, no `page.tsx` |
| [`/no-cache/1`](app/no-cache/[id]/page.tsx) | no | yes (same insight) | points at the `await params` line in `page.tsx` |

## Run

```bash
pnpm install        # if next 16.3.0-preview.9 is < release-age gated:
                    # pnpm install --config.minimumReleaseAge=0
pnpm dev
```

Open `http://localhost:3000/with-cache/1`, open the dev overlay → **Insights**.
The `instant-shell-url-data` insight is present, but its **Call Stack** contains
only ignore-listed frames — nothing points at `app/with-cache/[id]/page.tsx`.

Now open `http://localhost:3000/no-cache/1`. Same insight, but the Call Stack
points straight at the `await params` line.

Both routes firing the exact `instant-shell-url-data` insight is verified from
`.next/dev/logs/next-development.log` (2 entries per route). The empty-vs-framed
Call Stack is what the dev overlay renders (the structured log strips stacks).

## Terminal proof (captured from the source playground page)

The identical mechanism on the real
[`app/view-transitions/posts/[id]`](https://github.com/vercel/next-app-router-playground/tree/main/app/view-transitions/%5Bid%5D)
page, where the insight is emitted to the dev server's stderr with its stack:

**With `use cache` at the top of the file:**

```
Error: Route "/view-transitions/posts/[id]": Next.js encountered URL data during prerendering or a navigation.
…
    at ignore-listed frames
```

**Without `use cache` (only line removed):**

```
Error: Route "/view-transitions/posts/[id]": Next.js encountered URL data during prerendering or a navigation.
…
    at Page (app/view-transitions/posts/[id]/page.tsx:25:18)
  23 |   params: Promise<{ id: string }>;
  24 | }) {
> 25 |   const { id } = await params;
     |                  ^
```

## Why (mechanism)

The instant-navigation insight is assembled by `addErrorContext()` in
`node_modules/next/dist/esm/server/app-render/dynamic-rendering.js`:

```js
error.stack = error.name + ': ' + error.message + (ownerStack || componentStack);
```

It builds the stack from `React.captureOwnerStack()` (falling back to
`errorInfo.componentStack`). Inside a `use cache` boundary React renders the
subtree as a detached task, so **both** the owner stack and the component stack
are truncated at the cache boundary — the user's `Page` frame isn't in either.
The empty stack is then serialized to the client and revived
(`resolveErrorDev` → `reviveModel`), leaving only the ignore-listed
`react-server-dom` revive frames the overlay shows.

The sibling request-API path (`applyOwnerStack()` in
`dynamic-rendering-utils.js`) is **cache-aware** — it stitches in
`workUnitStore.outerOwnerStack` for `cache` / `private-cache` work units. The
instant-navigation path does not (there's a literal `// TODO go back to owner
stack here` next to the assignment), which is why the frame is lost only here.

## Possibly related

- vercel/next.js#96028 — flagged in the original thread as possibly the same
  root cause.

## Versions

- `next@16.3.0-preview.9`, `react@19.2.4`, `react-dom@19.2.4`
