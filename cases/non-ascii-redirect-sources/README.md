# Non-ASCII redirect source matching

Compare literal Unicode, ASCII, and percent-encoded `redirects().source` patterns
on Next.js **16.5.0-canary.51**. The three rules use the same destination and
status code, with `trailingSlash: true`.

Based on the [original minimal reproduction](https://github.com/vercel-internal-apps/next.js-experimental/tree/9ea25887a3a9770a083f72be21c0f834ee8df0a0).
Background: [Next.js #33470](https://github.com/vercel/next.js/issues/33470),
[documentation PR #101845](https://github.com/vercel/next.js/pull/101845).

Live reproduction: <https://non-ascii-redirect-sources.vercel.app>.

## Run

```bash
npm install
npx playwright install chromium
npm run dev
```

Open `http://127.0.0.1:3000/` and follow the ordinary links, or run the probe in a
second terminal:

```bash
npm run probe -- http://127.0.0.1:3000
```

The probe passes each literal Unicode and percent-encoded URL to
`curl --path-as-is`, without following redirects. It then navigates Chromium to each URL, records the
network URL, status, Location header, and final URL, and follows redirects.
Each browser navigation uses a fresh context to avoid cached 301 responses.

Other server modes:

```bash
npm run dev:webpack

# Stop the development server before building.
npm run build
npm start

# Or use webpack for the production build.
npm run build:webpack
npm start
```

Probe a deployed instance with the same script by passing its base URL.

## Results

Verified November 16, 2026, with Next.js 16.5.0-canary.51, React/React DOM 19.3.1,
and Chromium 149.0.7827.55. Local servers and the probe ran on Node.js 26.13.1.

| Environment                 | Literal `/über/:path*` source | ASCII `/uber/:path*` source | Encoded `/%C3%BCber-encoded/:path*` source |
| --------------------------- | ----------------------------- | --------------------------- | ------------------------------------------ |
| Local Turbopack development | 404                           | 301 → `/target/`            | 301 → `/target/`                           |
| Local webpack development   | 404                           | 301 → `/target/`            | 301 → `/target/`                           |
| Local Turbopack production  | 404                           | 301 → `/target/`            | 301 → `/target/`                           |
| Local webpack production    | 404                           | 301 → `/target/`            | 301 → `/target/`                           |
| Vercel production           | 404                           | 301 → `/target/`            | 301 → `/target/`                           |

Curl and Chromium agree in every row. Both literal Unicode and percent-encoded
URL inputs give the same initial status and Location for each source. The target
itself returns 200. Chromium follows each successful 301 to that 200 response.

Chromium sends `/über/example/` as `/%C3%BCber/example/`, locally and on Vercel.
Automatic browser encoding changes the request URL, while the literal Unicode
source in the configuration remains unchanged. Encoding the request therefore
does not make the literal config pattern match. The encoded config pattern works
across all tested environments.

The [recorded probe output](./results.json) includes every input spelling,
initial response, browser network URL, redirect chain, and final URL. It contains
60 initial-response observations across five environments and two clients.

### Raw UTF-8 request targets

The curl wire trace also shows automatic URL encoding: a literal `/über/example/`
URL argument becomes `/%c3%bcber/example/`. Literal Unicode URL input is therefore
different from sending raw UTF-8 bytes in the HTTP request target.

To force the latter, the probe can use `curl --http1.1 --request-target` and skip
the browser:

```bash
npm run probe -- http://127.0.0.1:3000 --raw-request-target
npm run probe -- https://non-ascii-redirect-sources.vercel.app --raw-request-target
```

| Environment              | Raw `/über/example/` target | Raw `/über-encoded/example/` target | ASCII control    |
| ------------------------ | --------------------------- | ----------------------------------- | ---------------- |
| Local webpack production | 400                         | 400                                 | 301 → `/target/` |
| Vercel production        | 404                         | 301 → `/target/`                    | 301 → `/target/` |

Vercel accepts the forced raw UTF-8 targets and produces the same matching result
as the encoded requests. Local production rejects those raw targets with 400.
This is a platform difference outside ordinary browser requests. It does not make
the literal Unicode config source match on Vercel.
