# Friction Log: favicon.ico conflict with unstable_instant — minimal repro

**Date:** 2026-03-22
**Task:** Verify that `app/favicon.ico` scaffolded by `create-next-app` conflicts with `unstable_instant` validation on a dynamic route

---

## Prompt

> lets do a minimal task now to verify this issue. do another friction log setting up a new nextjs app with instant, minimal repro. log the friction log also in that repo

---

## Summary

The favicon conflict is confirmed. A fresh `create-next-app` 16.2.1 scaffold with `cacheComponents: true` and `unstable_instant` on the root page fails to build out of the box — the scaffolded `app/favicon.ico` causes a build-time instant validation error. The error message doesn't name the file or suggest a fix. Two additional friction points found along the way: `unstable_instant` reads like an import but is a plain object export, and `await params` at the page level needs to be inside Suspense.

## Action Items

### Docs

- 🔧 `unstable_instant` reads like a named import — the export name pattern (`unstable_*`) doesn't signal that it's a file-level config object. A brief note in the API reference or type definition would help
- 🔧 The `await params` / Suspense requirement is non-obvious for the `prefetch: 'runtime'` pattern — the docs example only shows `prefetch: 'static'`

### Framework

- 🔧 `create-next-app` scaffolds `app/favicon.ico` which immediately conflicts with `unstable_instant` on the root page — the scaffold and the feature ship in the same version but are incompatible out of the box → **Filed:** https://github.com/vercel/next.js/issues/91787
- 🔧 The build error names neither the file nor the fix: *"you have file-based metadata such as icons that depend on dynamic params segments"* — the filename is available in `componentStack` at `dynamic-rendering.js:706` but is discarded

### DX / Research

- 🔍 `create-next-app` now prompts "Would you like to include AGENTS.md?" — worth checking whether the generated AGENTS.md matches the directive in `ai-improvements/` and whether agents actually benefit from it shipping by default

## Log

- 🟢 `create-next-app@latest` scaffolded Next.js 16.2.1 cleanly
 - 🟡 New prompt: "Would you like to include AGENTS.md to guide coding agents?" — not documented anywhere visible, defaulted to Yes
 - `app/favicon.ico` present in scaffold as expected
- 🟢 Read AGENTS.md — bundled docs directive present, points to `node_modules/next/dist/docs/`
- 🟢 Read `instant-navigation.md` before writing code
- 🔴 Used wrong `unstable_instant` API — tried to import it as a named export from `next/server`
 - TypeScript error: `Module '"next/server"' has no exported member 'unstable_instant'`
 - 🟡 Checked bundled `instant-navigation.md` — `unstable_instant` is a plain object export from the route file, not an import
 - 🔧 The `unstable`_ prefix reads like a function/import; the type or docs could make the export pattern clearer
- 🔴 `await params` at page level caused build error
 - Error: "Uncached data was accessed outside of `<Suspense>`"
 - 🟡 Fixed by passing `params` as a Promise through Suspense: `{params.then(({ id }) => <Item id={id} />)}`
- 🔴 `prefetch: 'static'` on a dynamic route without `samples` errored
 - Error: "accessed param 'id' which is not defined in the `samples` of `unstable_instant`"
 - The docs example uses `prefetch: 'static'` on a dynamic route but doesn't show `samples` — it only works without `samples` when the route doesn't actually access params at validation time
 - Both `prefetch: 'static'` and `prefetch: 'runtime'` require `samples` for dynamic routes
 - `prefetch: 'static'` with `samples` is the simpler pattern — `prefetch: 'runtime'` is only needed when the prefetched shell itself needs to differ per param value
 - Fixed by adding `samples: [{ params: { id: '1' } }, { params: { id: '2' } }]` to `prefetch: 'static'`
 - 🔧 The error message doesn't distinguish between "you're missing samples" and "you're in the wrong prefetch mode" — easy to over-correct to `prefetch: 'runtime'` when samples on `prefetch: 'static'` is the right fix
- 🔴 Build failed — `app/favicon.ico` conflicts with `unstable_instant` on root page — **confirmed**
 - Added `unstable_instant = { prefetch: 'static' }` to `app/page.tsx`, ran `next build`
 - Error: *"Runtime data such as `cookies()`, `headers()`, `params`, or `searchParams` was accessed inside `generateMetadata` or you have file-based metadata such as icons that depend on dynamic params segments"*
 - No filename, no suggested fix — identical to the error found in the cache components task
 - Fix: remove `app/favicon.ico` or move it to `metadata.icons` in layout
