# use-search-params-suspense-false-positive

Minimal reproduction for a production-build diagnostic that says a Client
Component calls `useSearchParams()` outside `<Suspense>` even though the
component is directly wrapped in an explicit server-rendered boundary.

The reported behavior matters because the build then continues, prerenders the
route, and exits successfully. A fatal-looking diagnostic paired with exit code
`0` can mislead both people and automation.

## App shape

- `cacheComponents: true`
- Turbopack production build (the Next.js default)
- A Client Component that calls `useSearchParams()`
- The Client Component is directly wrapped in `<Suspense>` by `app/page.tsx`

## Run

```bash
pnpm install
pnpm reproduce
```

The script deletes `.next` between runs, builds the identical app once with
Node and once with `bun --bun`, writes the complete output to `build-node.log`
and `build-bun.log`, and reports both exit statuses and whether the false
diagnostic appeared. It exits non-zero when the false diagnostic is detected,
even though the affected underlying `next build` exits `0`.

Expected output:

```text
Node
  exit status: 0
  false Suspense diagnostic: no
  runtime timer warning: no

Bun
  exit status: 0
  false Suspense diagnostic: no
  runtime timer warning: no
```

The originally reported failure was the Bun row showing exit status `0` and
`false Suspense diagnostic: YES`. A later report described the same symptom
from a normal `next build` without identifying the runtime, so the Node/Bun
comparison is intentionally part of this reproduction.

## Reproduced result

On 2026-10-07, the issue still reproduces with the latest published canary:

| Runtime | Versions                              | Build exit | False diagnostic | Route output |
| ------- | ------------------------------------- | ---------: | ---------------- | ------------ |
| Node    | Node 20.20.2, Next.js 16.5.0-canary.2 |          0 | No               | `○ /`        |
| Bun     | Bun 1.3.14, Next.js 16.5.0-canary.2   |          0 | **Yes**          | `○ /`        |

Five additional clean Node builds all exited `0` without the diagnostic. That
does not rule out a rare Node race, but the available reproduction is currently
deterministic under Bun and has not reproduced under Node.

The Bun output prints the `CLIENT_HOOK_DYNAMIC` error after the route table. In
one run it also printed Next.js's warning that Cache Components behavior could
not be guaranteed with the runtime's `setTimeout()` implementation; the warning
was not present on every run, while the false diagnostic was.

The comparison proves this is runtime-dependent, not a missing boundary. Source
review points to scheduling as the likely mechanism:

1. The Client Component suspends on a hanging promise during prerender.
2. Next.js advances and aborts prerender stages with atomic timer groups
   (`packages/next/src/server/app-render/app-render-scheduling.ts`).
3. The affected Bun run can violate the ordering assumed by that scheduling
   path; Next.js sometimes detects this and emits its timer warning.
4. The rejected client-hook promise surfaces late as an unhandled rejection.
   Next.js logs unhandled rejections without crashing the process
   (`process-error-handlers.ts`), explaining the contradictory error plus
   successful exit status.

The route is nevertheless listed as static, so the diagnostic does not describe
the actual rendered result and should not be emitted.

## Manual commands

```bash
pnpm build:node
pnpm build:bun
```

The route itself is also visible with `pnpm dev`; open
`http://localhost:3000/?q=hello`.
