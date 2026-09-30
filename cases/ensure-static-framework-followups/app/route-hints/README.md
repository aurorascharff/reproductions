# Route-hint rendering-stage baseline

This case compares how `unstable_ensureStatic` communicates the allowed static
stage for automatic and explicit prefetches. It is a behavior baseline for the
internal route-hint and static-stage cleanup, not a separate error.

Each target reads `cookies()` behind Suspense. The only variable is the
`unstable_ensureStatic` value: `false`, `shell`, or `prefetch`.

## Reproduce

Prefetching is disabled in development, so build and start the production app
from the `ensure-static-framework-followups` directory:

```bash
pnpm install --config.minimumReleaseAge=0
pnpm exec next build --debug-build-paths 'app/route-hints/**'
pnpm start
```

Open <http://localhost:3000/route-hints>. Reveal one link at a time and inspect
the RSC requests in the browser network panel before navigating.

## Expected behavior

- `false` permits a runtime shell prefetch.
- `shell` keeps automatic prefetches on the static shell, while an explicit
  full prefetch may include the runtime cookie content.
- `prefetch` keeps both automatic and explicit prefetches static. The cookie
  content arrives with the navigation response.

## Relevant files

- [Comparison page](./page.tsx)
- [Controlled prefetch link](./prefetch-link.tsx)
- [Shared cookie content](./cookie-content.tsx)
- [Validation disabled](./false/page.tsx)
- [Shell stage](./shell/page.tsx)
- [Prefetch stage](./prefetch/page.tsx)
