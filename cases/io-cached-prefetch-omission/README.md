# io-cached-prefetch-omission

Repro for [agent feedback finding 5688](https://next-maintainer-agent.vercel.tools/agent-feedback/5688): cached content reached after `io()` is omitted from a full-link prefetch on an otherwise static route.

## The shape

- Next.js `16.5.0-canary.31` in production mode.
- `cacheComponents: true` and `partialPrefetching: true`.
- `cacheMaxMemorySize: 0` so the four-second delay repeats on every visit.
- Three visible `<Link prefetch={true}>` links call the same cached function.
- The cached function waits four seconds before returning `content`.

| Route | Boundary before cached function | Purpose |
| --- | --- | --- |
| `/no-io` | None | Positive control |
| `/io` | `await io()` | Bug |
| `/connection` | `await connection()` | Negative control |

## Run

Automatic link prefetching only runs in production:

```bash
npm install
npm run build
npm start
```

Open <http://localhost:3000>, wait a few seconds for the visible links to prefetch, then click each link.

## Expected

| Route | Result after clicking |
| --- | --- |
| `/no-io` | `content` appears immediately |
| `/io` | `content` appears immediately because cached work after `io()` is prefetchable |
| `/connection` | `loading…` appears for four seconds because `connection()` blocks prefetching |

## Observed

| Route | Result after clicking |
| --- | --- |
| `/no-io` | `content` appears immediately |
| `/io` | `loading…` incorrectly appears for about four seconds |
| `/connection` | `loading…` correctly appears for about four seconds |

The `/io` route reads no params, search params, cookies, or headers. Its static prefetch stops at `io()`, but the route retains the hint that a static prefetch is sufficient, so the client does not request the cached content before navigation.
