# Cached content after `io()` is omitted from a static prefetch

Visual reproduction for [agent feedback finding 5688](https://next-maintainer-agent.vercel.tools/agent-feedback/5688), pinned to Next.js `16.5.0-canary.31`. `cacheMaxMemorySize: 0` keeps the four-second delay repeatable.

The home page has three `<Link prefetch={true}>` links:

1. `/no-io` is instant.
2. `/io` incorrectly shows `loading…` for four seconds.
3. `/connection` correctly shows `loading…` for four seconds.

## Run

Automatic link prefetching only runs in production:

```bash
npm install
npm run build
npm start
```

Open <http://localhost:3000>, wait a few seconds for the visible links to prefetch, then click them in order. Restart the server to repeat the cold-cache delay.

`getCachedData()` waits four seconds on a cold fill. `/no-io` fills during the build. A correct full-link prefetch would fill `/io` before the click; `/connection` must wait for the click.
