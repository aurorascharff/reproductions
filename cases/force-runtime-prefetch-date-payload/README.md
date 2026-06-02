# force-runtime-prefetch-date-payload

Minimal repro for noisy/aborted RSC streams with `cacheComponents`, `cachedNavigations`, `unstable_prefetch = 'force-runtime'`, and a cached payload that includes a `Date`.

## Setup

```bash
cd cases/force-runtime-prefetch-date-payload
pnpm install
pnpm build
pnpm start
```

Open <http://localhost:3000>, then click quickly between the root page and the profile links in the first grid.

The first grid uses `app/[handle]/page.tsx`, which exports:

```ts
export const unstable_prefetch = 'force-runtime';
```

That route renders the same cached payload as the control route, including a real `Date` object passed to a Client Component. In the affected app, production logs showed repeated `Error: Connection closed` entries for profile routes while the request still returned `200`.

Removing the `unstable_prefetch` export from `app/[handle]/page.tsx` stopped the issue in the app. The second grid is the control: same cached `Date` payload, no `unstable_prefetch` export.
