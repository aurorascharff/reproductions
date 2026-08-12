# Stale dynamic metadata on sibling param navigation

Minimal reproduction for a Next.js 16.3.0 production-only soft-navigation bug
with Cache Components and Partial Prefetching.

## Run

```bash
pnpm install
pnpm build
pnpm start
```

Open <http://localhost:3000/alpha>, then click **Navigate to /beta**.

## Expected

- The URL changes to `/beta`.
- The heading changes to `beta`.
- The document title changes to `Beta · Dynamic metadata repro`.

## Actual

- The URL and heading update correctly.
- The document title remains `Alpha · Dynamic metadata repro` indefinitely.
- A hard refresh shows the correct Beta title.

Both links use `prefetch={false}`. The navigation RSC response is complete and
contains the correct Beta `<title>`, but the client does not commit it. Setting
`partialPrefetching: false` makes the title update correctly.

## Version matrix

| Next.js version | Result |
| --- | --- |
| `16.3.0` | Reproduces: title remains Alpha |
| `16.3.1-canary.0` | Reproduces |
| `16.3.1-canary.4` | Reproduces |
| `16.3.1-canary.5` | Fixed: title changes to Beta |
| `16.3.1-canary.9` | Fixed |

The fix first appears in canary.5, which contains the segment-cache response
refactor stack [#96406](https://github.com/vercel/next.js/pull/96406),
[#96439](https://github.com/vercel/next.js/pull/96439), and
[#96679](https://github.com/vercel/next.js/pull/96679). This case does not
isolate which individual PR in that stack fixes the stale head entry.

## Relevant shape

- `cacheComponents: true`
- `partialPrefetching: true`
- Sibling navigation inside one dynamic route: `/[slug]`
- `generateMetadata` awaits only `params`
- The page content awaits `params` below Suspense
- Next.js `16.3.0`

The failure does not require request data, an unrelated layout Suspense hole,
or prefetching. Those were all present in the source application but were
removed while reducing this case.
