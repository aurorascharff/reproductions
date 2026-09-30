# Request-dependent promise produces a locationless error

This reproduction passes a request-dependent promise from a Server Component
to a Client Component. The Client Component retains the promise for browser use
but does not read it during the server render.

## Reproduce

From the `ensure-static-framework-followups` directory:

```bash
pnpm install --config.minimumReleaseAge=0
pnpm dev
```

Open <http://localhost:3000/unused-client-promise> and inspect the dev overlay.

## Current behavior

The overlay reports that it cannot provide a source location for the
request-dependent promise.

## Expected behavior

The error should point to the `connection()` promise passed from the page to
the Client Component.

## Relevant files

- [Page that creates the promise](./page.tsx)
- [Client Component that receives the promise](./client.tsx)
