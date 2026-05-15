# instant-silence-warning-doesnt-work

Minimal repro for the "unrendered segment" instant validation warning where the **dev overlay's "Silence this warning" fix card lies**: setting `export const unstable_instant = false` on the parent layout does not actually silence the warning.

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

The overlay's second fix card says:

> **Silence this warning**
> ```
> // page.tsx or layout.tsx
> export const instant = false
> ```

That advice is already applied to `app/trigger/layout.tsx` in this repro — and the warning still fires.

## Why

`isPageAllowedToBlock()` in `packages/next/src/server/app-render/instant-validation/instant-config.tsx` walks the loader tree top-down. The first non-undefined `unstable_instant` config it finds wins:

- `unstable_instant = true` on `trigger/page.tsx` → page is *not* allowed to block → instant validation runs → unrendered-segment warning fires
- `unstable_instant = false` on `trigger/layout.tsx` → unreachable: the walk hits the page-level config first

The fix card implies the opt-out at the layout level will silence the warning. In practice the opt-out has to live on the segment whose `unstable_instant = true` requested validation, or above any segment that opted in. Putting `instant = false` on a sibling/parent that the validating segment doesn't depend on does nothing.

## Real-world impact

Per Josh's framing (vercel-site sidebar example): the segment may be conditionally rendered or opt out of SSR, and the user has no good way to express "this is intentional, don't validate". The overlay says "silence this warning" but the recipe doesn't work for the common case.

## Action items

- 🔧 Either make the fix card's recipe actually work (have `instant = false` on the parent layout cascade to suppress validation of its rendered/non-rendered children), or
- 🔧 Rewrite the fix card copy to be honest — the only way to silence is to remove `unstable_instant = true` from the child page (or set it to `false` on the *page*, which contradicts the user's original intent of wanting instant for that route).
