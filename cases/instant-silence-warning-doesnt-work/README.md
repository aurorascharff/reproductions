# instant-silence-warning-doesnt-work

Minimal repro for the "unrendered segment" instant validation warning. The dev overlay's "Allow no validation" fix card was previously ambiguous about **where** `instant = false` has to go.

## Setup

```bash
cd cases/instant-silence-warning-doesnt-work
pnpm install
pnpm dev
# open http://localhost:3000 → click "Go to /trigger"
```

You will see the dev overlay:

```
Next.js could not validate instant UI because an expected segment was not rendered.

Unrendered segment:
  app/trigger/page.tsx
```

`app/trigger/layout.tsx` drops `{children}` so the page never renders during instant validation.

## What actually silences it

Set `export const instant = false` on the **unrendered segment file itself** (the one named in the error — `app/trigger/page.tsx` here), not on the parent layout that fails to render it. Putting the opt-out on `trigger/layout.tsx` is unreachable because the loader-tree walk in `isPageAllowedToBlock()` (see `packages/next/src/server/app-render/instant-validation/instant-config.tsx`) hits the page-level config first when the page itself declared `unstable_instant = true`.

Per Josh Story (vercel/next.js#93770 thread, May 16):

> *"so in this case the page is saying 'i must be instant' and the false on the layout is irrelevant. if something higher up than `trigger/layout.tsx` didn't render children then this false should suppress the warning. … so if you move the false to the page it should go away."*

## Action items

- Fix-card copy on `aurorascharff/redesign-unrendered-segment-overlay` updated:
  - Snippet now reads `// unrendered segment` rather than `// page.tsx or layout.tsx`.
  - Build-message bullet now reads `Set \`export const instant = false\` on the unrendered segment to allow no validation and silence this warning`.
- Docs: explain that `instant = false` on a parent layout silences validation for descendants only when no descendant explicitly opted in via `unstable_instant = true`. The truthy config on a descendant wins.
