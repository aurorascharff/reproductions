# Case: `EmptyGenerateStaticParamsError` with Cache Components

Next.js **16.3.0-canary.19** — with `cacheComponents: true`, any dynamic route whose `generateStaticParams` returns `[]` fails the request with a 500 and a blank screen in the browser. The error message points at the route, but the **runtime** symptom is what users hit when an upstream data source (GitHub API, CMS, etc.) returns no entries in dev.

```bash
cd cases/empty-generate-static-params
npm install
npm run dev
```

Open `/` in the browser, click through to `/items/anything`, or curl directly:

```bash
curl -i http://localhost:3000/items/anything
```

You will see `HTTP 500` and the page renders blank. The dev terminal logs:

```
EmptyGenerateStaticParamsError: When using Cache Components, all
`generateStaticParams` functions must return at least one result.
Learn more: https://nextjs.org/docs/messages/empty-generate-static-params
```

## Why this happens

`cacheComponents: true` requires every `generateStaticParams` to yield at least one entry so Next.js can perform build-time validation that the route doesn't access uncached dynamic APIs. Returning `[]` (even as a "no data yet" fallback) trips that validation **at request time** in dev — the route never renders.

The reproducing route is intentionally minimal:

```ts
// app/items/[slug]/page.tsx
export async function generateStaticParams(): Promise<
  Array<{ slug: string }>
> {
  return [];
}
```

```ts
// next.config.ts
const nextConfig: NextConfig = {
  cacheComponents: true,
};
```

## What we expected

- A clearer end-user signal — at minimum, the dev overlay rather than a blank page.
- Guidance on how to handle the "data source returned nothing" case without dropping `cacheComponents`. A documented escape hatch (e.g. an opt-in to allow `[]`, or a recommended hard-coded fallback param) would unblock real-world usage where the dynamic source can be empty in dev (rate-limited GitHub API, missing CMS entries, etc.).

## What you actually see

`HTTP 500` and a blank page in the browser. The error is only visible in the dev terminal or by inspecting the response body's `__NEXT_DATA__` payload.

## Workarounds

1. Always return at least one hard-coded entry from `generateStaticParams` (e.g. a known "latest" slug).
2. Make the underlying data fetcher throw instead of returning `[]`, so the failure surfaces during the data call rather than as an empty params list.
3. Drop `cacheComponents` for the affected route (not viable if the rest of the app relies on it).

## Upstream

- Docs: <https://nextjs.org/docs/messages/empty-generate-static-params>
- First hit in `vercel/front` while wiring a `/releases/[version]` route against the GitHub Releases API; in dev with no `GITHUB_TOKEN` and a rate-limited host, `listReleaseEntries()` returned `[]`, `generateStaticParams` returned `[]`, and every `/releases/<version>` URL went blank.
