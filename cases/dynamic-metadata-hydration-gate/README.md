# Dynamic metadata marker hidden by a hydration gate

Minimal reproduction for a `generateMetadata()` Blocking Route diagnostic that
persists when the documented `connection()` marker is nested inside a client
hydration gate.

The use case is an app whose page content comes from browser-local data after
hydration while its server metadata still varies by URL. The page body has no
server data dependency.

## Routes

Both routes export `instant = true`, generate a title from `params`, and render
the same hydration-gated content. The only relevant difference is the marker
placement.

| Route | `DynamicMetadataMarker` placement | Observed diagnostic |
| --- | --- | --- |
| [`/song/sample`](http://localhost:3000/song/sample) | Inside `HydrationGate` | Persists |
| [`/control/sample`](http://localhost:3000/control/sample) | Outside `HydrationGate` | Clears |

The gate returns a static bootstrap shell until `useEffect` marks the browser as
hydrated. During instant-navigation validation, the nested marker is therefore
not rendered. Moving the same marker outside the gate makes it visible to the
server render and clears the metadata diagnostic.

## Run

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>, then visit each route and compare the dev overlay.

On `/song/sample`, the **Blocking Route** diagnostic reports:

```text
Route "/song/[id]": Next.js encountered runtime data in `generateMetadata()`.
```

The control route does not report that diagnostic.

The same difference appears in production builds:

```bash
# Fails on /song/[id] with blocking-prerender-metadata-runtime
pnpm build

# Passes when the build is scoped to the control route
pnpm exec next build --debug-build-paths='app/control/**/page.tsx'
```

The scoped control build reports `/control/[id]` as a Partial Prerender (`◐`).

## Versions

- `next@16.4.3`
- `react@19.3.1`
- `react-dom@19.3.1`

Verified with Turbopack in `next dev` on October 27, 2026.

Related documentation:
[Runtime data in `generateMetadata()`](https://nextjs.org/docs/messages/blocking-prerender-metadata-runtime)
