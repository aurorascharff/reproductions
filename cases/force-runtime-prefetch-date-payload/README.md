# force-runtime-prefetch-date-payload

Minimal repro for noisy/aborted RSC streams with `cacheComponents`, `cachedNavigations`, `unstable_prefetch = 'force-runtime'`, and a cached payload that includes a `Date`.

## Setup

```bash
cd cases/force-runtime-prefetch-date-payload
pnpm install
pnpm build
pnpm start
```

Open <http://localhost:3000>, then click quickly between the root page and the profile links in each grid.

The first grid uses `app/[handle]/page.tsx`, which exports:

```ts
export const unstable_prefetch = 'force-runtime';
```

That route renders a cached payload including a real `Date` object passed to a Client Component. In the affected app, production logs showed repeated `Error: Connection closed` entries for profile routes while the request still returned `200`.

Removing the `unstable_prefetch` export from `app/[handle]/page.tsx` stopped the issue in the app.

## What to compare

1. Run `pnpm build && pnpm start`.
2. Open `/` in a browser so the links can prefetch.
3. Click quickly between `/`, `/icyJoseph`, `/karpathy`, and `/gaearon`.
4. Compare with `/control/icyJoseph` and `/control/karpathy`: same cached `Date` payload, no `unstable_prefetch` export.
5. Compare with `/string/icyJoseph` and `/string/karpathy`: same `unstable_prefetch` export, but the cached payload serializes the timestamp as an ISO string instead of a `Date`.
6. Remove `export const unstable_prefetch = 'force-runtime'` from `app/[handle]/page.tsx`, rebuild, and repeat.

The profile payload includes React's Date serialization marker:

```text
"generatedAt":"$D2026-..."
```

Local `next start` may not always print the same `Connection closed` log as Vercel. The original failure was observed in deployed production logs, and removing the `unstable_prefetch` export from the dynamic profile route stopped the noisy profile stream errors there.
