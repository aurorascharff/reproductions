# parallel-slot-instant-validation-gap

Minimal repro: **parallel-slot exclusion is not detected by instant validation when the slot has a `default.tsx`** (Next.js 16.3.0-canary.20).

## Setup

```bash
cd cases/parallel-slot-instant-validation-gap
pnpm install
pnpm build  # exits 0 — no error reported
```

## What I expected

The `@modal/page.tsx` segment declares `export const unstable_instant = true`, opting that slot into instant validation. The parent layout (`dashboard/layout.tsx`) conditionally excludes the `modal` slot (`shouldShowModal()` returns `false`), so the slot is never rendered. I expected the framework to emit the unrendered-segment wrapper:

```
Could not validate instant UI because an expected segment was not rendered.

Unrendered segment:
  app/dashboard/@modal/page.tsx
```

…the same way it does for `app/dashboard/page.tsx` when a parent layout drops its `{children}`.

## What actually happens

`pnpm build` succeeds with no warning. The dev overlay also stays silent. The framework treats the slot as legitimately empty because `default.tsx` returned `null` — even though the slot's `page.tsx` explicitly opted into instant validation via `unstable_instant = true`.

This means a real parallel-slot blocker (e.g. an auth-gated `@modal/page.tsx` that conditionally fetches dynamic data) wouldn't surface during instant validation in either dev or build.

## Why I think it's a bug

The same fixture without `default.tsx` (deleting that one file) would either fail TypeScript (because the framework's typed `LayoutProps` generator excludes `modal` when there's no `default.tsx`) or fail to resolve the route. Authors who follow Next.js conventions and provide a `default.tsx` end up silently disabling instant validation on the conditionally-rendered slot.

Two possible fixes:

1. **Prefer `page.tsx` over `default.tsx`** for instant validation when the page declared `unstable_instant = true`. The slot author opted in; the default shouldn't mask it.
2. **Track `default.tsx` as a fallback** in `requiredIds` and emit the wrapper when the route resolves to the default subtree but the slot's `page.tsx` was the requested instant segment.

## Per Aurora's experiments (May 16, vercel/next.js#93879 follow-ups)

Tested as part of the unrendered-segment redesign work — added five cause-variant fixtures to the demo grid alongside scenarios 81/82/83. Only the dropped-`{children}` and conditional-render variants produce the unrendered-segment wrapper. The parallel-slot variant (this fixture) is the only one that produces **no error at all**, which is what makes it a framework gap rather than a UX miss.

Related framework code:

- `packages/next/src/server/app-render/instant-validation/boundary-tracking.tsx` — `requiredIds` / `renderedIds` shape.
- `packages/next/src/server/app-render/dynamic-rendering.ts` — wrapper emission (`Unrendered segment(s)` message).
- `packages/next/src/server/app-render/instant-validation/boundary-impl.tsx` — `InstantValidationBoundary` mount-tracking.
