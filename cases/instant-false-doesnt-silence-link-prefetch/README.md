# instant-false-doesnt-silence-link-prefetch

Minimal repro confirming that **`export const instant = false` does NOT silence
the `link-prefetch-partial` dev warning** — and neither does
`export const prefetch = 'allow-runtime'`, which the Adopting Partial
Prefetching guide recommends for "routes that read request data."

The only per-route value that silences the warning is `export const prefetch = 'partial'`
(or `'unstable_eager'`, `instant = true`, or the global `partialPrefetching: true`).

## Setup

```bash
cd cases/instant-false-doesnt-silence-link-prefetch
pnpm install
pnpm dev
# open http://localhost:3000 and click each link (navigate — the warning fires
# on navigation, not on hover/prefetch, because dev doesn't prefetch)
```

## The four links

The home page has four `<Link prefetch={true}>` links, each pointing at a route
that reads request data (`await connection()` + `new Date()`) so its dynamic
data would be pulled into a legacy "full" prefetch. Each target applies a
different per-route opt-out:

| Route                   | Opt-out tried                    | Result      |
| ----------------------- | -------------------------------- | ----------- |
| `/target-plain`         | none                             | **WARNS**   |
| `/target-instant-false` | `export const instant = false`   | **WARNS** ← surprising |
| `/target-allow-runtime` | `export const prefetch = 'allow-runtime'` | **WARNS** ← guide recommends this |
| `/target-partial`       | `export const prefetch = 'partial'` | **SILENT** (the only fix) |

The warning text:

```
A <Link prefetch={true}> navigated to "/target-instant-false", but Partial
Prefetching is not enabled for that route, so its dynamic data was included in
the prefetch. Enable Partial Prefetching app-wide by setting
`partialPrefetching: true` in next.config, or per-route by exporting
`const prefetch = 'partial'` from the page or layout.
```

## Why (source)

The warning gate is in
`packages/next/src/client/components/segment-cache/navigation.ts`:

```ts
(navigationSeed.routeTree.prefetchHints &
  PrefetchHint.SubtreeHasPartialPrefetching) === 0
```

The `SubtreeHasPartialPrefetching` bit is set in
`packages/next/src/server/app-render/create-flight-router-state-from-loader-tree.ts`:

```ts
const isInstant =
  instantConfig === true ||
  (typeof instantConfig === 'object' && instantConfig !== null)
if (isInstant) {
  prefetchHints |= PrefetchHint.SubtreeHasPartialPrefetching
}

if (prefetchConfig === 'partial') {
  prefetchHints |= PrefetchHint.SubtreeHasPartialPrefetching
} else if (prefetchConfig === 'unstable_eager') {
  prefetchHints |=
    PrefetchHint.SubtreeHasPartialPrefetching |
    PrefetchHint.SubtreeHasEagerPrefetch
} else if (prefetchConfig === 'force-disabled') {
  prefetchHints |= PrefetchHint.PrefetchDisabled
} else if (prefetchConfig === 'allow-runtime') {
  prefetchHints |= PrefetchHint.HasRuntimePrefetch  // ← different bit, not checked by the warning
}
```

So:

- `instant = false` → fails the `isInstant` check (`false` is neither `true` nor
  an object) → bit not set → **warns**.
- `prefetch = 'allow-runtime'` → sets `HasRuntimePrefetch`, a **different** bit
  the warning gate doesn't look at → **warns**.
- `prefetch = 'partial'` → sets the bit the gate checks → **silent**.

## The question for the framework team

Is this **working as intended** or a **gap**?

- **Working as intended:** the warning means "you're doing a full prefetch of a
  route that isn't partial." `instant = false` doesn't make the route partial —
  if anything it confirms the route blocks — so the warning arguably *should*
  still fire. The fix is to drop `prefetch={true}` on the link, not opt the
  route out.
- **A gap:** there's no per-link "I know, ignore this" escape hatch. The only
  ways out are remove the prop, make the route partial, or flip the global flag.
  And the Adopting Partial Prefetching guide's audit table actively recommends
  `'allow-runtime'` for request-data routes — which doesn't work — so at minimum
  that's a docs bug.

## Action items

- [ ] Decide intent (above). If "working as intended," the docs/guide must stop
      implying `instant = false` / `'allow-runtime'` silence this warning.
- [ ] Fix the Adopting Partial Prefetching guide's audit table: `'allow-runtime'`
      does not silence the warning.
- [ ] Create `errors/instant-link-prefetch-partial.mdx` documenting exactly
      which segment-config values silence the warning and that it fires on
      navigation, not hover.
