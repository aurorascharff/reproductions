# Third-party `new Date()` frames missing from the dev overlay

A Server Component in a dependency calls `new Date()` during rendering with
Cache Components enabled. Next.js correctly reports the unstable value, but the
dev overlay loses both dependency frames and points at `<BlockingWidget />` in
the page. Showing all overlay frames does not recover the library call site.

Verified with **Next.js 16.4.0-canary.62**, Turbopack, React 19.2.5, and Node.js
20.20.2. `blocking-widget` is a minimal mock dependency, not a report about an
existing npm package. No external service or credentials are needed.

## Run

```sh
cd cases/third-party-new-date-missing-stack
npm ci
npm run dev:full
```

Open http://localhost:3000, click the issue badge, and inspect the call stack.
Expand any ignore-listed frames. The library frames are absent from the browser
error payload itself, so expanding the stack cannot restore them.

`dev:full` sets `__NEXT_SHOW_IGNORE_LISTED=true`. This is a terminal stack
formatting flag, not an overlay setting. Use the literal value `true`: `=1`
does not enable it.

The dependency is installed from the committed `blocking-widget-1.0.0.tgz`, so
its code actually lives in `node_modules/blocking-widget/`. A `file:` directory
symlink can resolve to app source and change the behavior being reproduced.
The readable package source is in `packages/blocking-widget/`; to regenerate
its tarball, run `npm pack --pack-destination ../..` there.

## Debug-prerender output with all terminal frames

```sh
__NEXT_SHOW_IGNORE_LISTED=true npm exec -- next build --debug-prerender
# Equivalent:
npm run build:debug:full
```

The build compiles successfully, then fails prerendering `/` with exit code 1.
`--debug-prerender` enables development rendering and source maps and disables
minification. With ignore-listed terminal frames enabled, the output includes
the real `new Date()` call in the dependency:

```text
Error: Route "/": Next.js encountered the unstable value `new Date()` while prerendering.
    at createSyncIOErrorImpl (node_modules/next/src/server/app-render/sync-io-messages.ts:33:10)
    at createSyncIOError (node_modules/next/src/server/app-render/sync-io-messages.ts:50:10)
    at io (node_modules/next/src/server/node-environment-extensions/io-utils.tsx:34:44)
    at new Date (node_modules/next/src/server/node-environment-extensions/date.tsx:38:11)
    at readCurrentTime (node_modules/blocking-widget/index.js:4:10)
    at BlockingWidget (node_modules/blocking-widget/index.js:8:44)
    at Page (app/page.jsx:7:7)
```

The excerpt omits the explanatory message and fix suggestions between the first
line and stack. See [the complete captured output](./debug-prerender-output.txt).
Despite retaining the library frames, the terminal code frame highlights the
page's mount site, `<BlockingWidget />`, rather than the `new Date()` call.

## Browser stack versus terminal stack

After clicking **Show 13 ignore-listed frame(s)**, all 14 browser frames
contain `Page` followed by React client error-revival and Flight parsing frames.
See [the complete expanded browser stack](./browser-stack-expanded.txt). Neither `readCurrentTime` nor
`BlockingWidget` is present. This is different from frames merely hidden by
the overlay's ignore-list toggle. The terminal retains both when the flag above
is enabled.

The expected behavior is for the browser to retain enough information to name
the originating dependency and its call site, including when all frames are
shown. The unstable-time diagnostic itself is expected; the lost location is
the bug.

## Where the frames are lost

Next.js
[`filterStackFrameDEV`](https://github.com/vercel/next.js/blob/v16.4.0-canary.62/packages/next/src/server/lib/source-maps.ts)
returns `false` for source URLs containing `node_modules`. React's RSC serializer
uses this filter when constructing the stack sent to the browser. The library
frames are discarded before the overlay receives the error; they are not simply
collapsed by the UI. The `__NEXT_SHOW_IGNORE_LISTED` terminal flag does not
change this serialization filter.

The underlying access is in
[`packages/blocking-widget/index.js:4`](./packages/blocking-widget/index.js),
called from its `BlockingWidget` Server Component. The page only mounts that
component. No framework files are modified by this reproduction.
