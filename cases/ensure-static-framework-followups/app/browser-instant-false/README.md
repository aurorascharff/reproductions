# Blocking browser work with instant disabled

This reproduction shows `use(browser())` failing static navigation validation
even though the parent layout sets `instant = false`.

## Reproduce

From the `ensure-static-framework-followups` directory:

```bash
pnpm install --config.minimumReleaseAge=0
pnpm dev
```

Open <http://localhost:3000/browser-instant-false>.

## Current behavior

The route fails because the Client Component suspends on `browser()`. Next.js
still treats that browser-only work as blocking static navigation validation.

## Expected behavior

The route should render successfully. The parent layout opts out of instant
navigation, and browser-only content does not require a server resume render.

## Relevant files

- [Page](./page.tsx)
- [Parent layout](./layout.tsx)
- [Browser-only Client Component](./browser-only.tsx)
