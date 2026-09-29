# SSR stack overflow has no useful frames

Minimal App Router reproduction for a server-render stack overflow whose
development-server log contains only `at ignore-listed frames`.

## Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The browser remains blank
while the request runs, then receives an HTTP 500. The terminal prints output
like:

```text
RangeError: Maximum call stack size exceeded
    at ignore-listed frames
TypeError: chunk.reason.error is not a function
    at ignore-listed frames
TypeError: frame.join is not a function
    at ignore-listed frames
```

The recursive Server Component intentionally overflows inside React's Flight
rendering. The expected development log should retain at least one useful
React, Next.js, or application frame identifying where the overflow started.
