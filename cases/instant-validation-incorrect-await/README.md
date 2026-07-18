# instant-validation-incorrect-await

Repro for **NAR-854 — "Instant Validation points to incorrect await."**

## The bug

With two sequential blocking `await`s, the instant-validation code-frame caret
(`>`) points at the **second** await — the most-recent suspending call — instead
of the **first**, which is the actual first blocking cause.

`app/products/page.tsx` does two uncached fetches:

```tsx
const featured = await fetch("/products", { cache: "no-store" });   // FIRST — the first cause
const deals    = await fetch("/products?deals=1", { cache: "no-store" }); // SECOND — caret lands here
```

The insight headline is **"Next.js encountered uncached data during a
navigation"** and the caret sits on the **second** fetch. Both awaits are the
same kind (uncached fetch), so there's no ambiguity: the first fetch is the
first thing that blocks, but the caret points at the second.

## Why two fetches (and not `fetch` + `params`)

The original ticket screenshot used `await getFeatured()` then `await
props.params`. On current canary that shape is classified as *runtime* data
(because `params` is runtime/link data), so the overlay self-consistently labels
it "runtime data" and points the caret at `params` — which looks correct and
hides the bug. Using two **uncached fetches** removes that classification
ambiguity: the headline is unambiguously "uncached data" and the mis-placed
caret is obvious.

## Why the root layout matters

The `<Suspense>` above `<body>` in `app/layout.tsx` makes the route eligible for
a static shell / instant navigation, so the instant-validation ("during a
navigation") path runs — the path where the caret bug appears. Without it the
route takes the prerender path instead, which points the caret correctly.

## Run it

```bash
pnpm install
pnpm dev
# open http://localhost:3000/products, open the dev overlay (Insights tab)
```

Expected (buggy) result: headline "…uncached data during a navigation", caret on
the **second** `await fetch(...)` (`deals`) instead of the first (`featured`).

## Expected fix

The caret should point at the **first** blocking await (`featured`), not the
most-recent suspending call. Already looked at by Josh Story.

## Notes

- Pinned to `next@16.3.0-canary.67` (the ticket-screenshot version); unfixed on
  later canaries too.
- Uses uncached `fetch`, so the dev server needs network access.
- Verified in the Next.js e2e harness across three shapes (two-fetch,
  cookies→headers, cookies→params): the caret always lands on the second await.
