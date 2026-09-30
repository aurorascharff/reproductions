# Allowed client IO is reported beside the server error

This reproduction shows an allowed Client Component `use(io())` hole being
reported alongside the actual server-side `connection()` error.

## Reproduce

From the `ensure-static-framework-followups` directory:

```bash
pnpm install --config.minimumReleaseAge=0
pnpm dev
```

Open <http://localhost:3000/duplicate-client-io-error> and inspect the dev
overlay.

## Current behavior

The overlay reports two problems: the Client Component using `io()` and the
Server Component using `connection()`.

## Expected behavior

Only the `connection()` access should be reported. The `io()` call is in a
Client Component behind Suspense and is allowed to resolve in the browser.

## Relevant files

- [Page and server hole](./page.tsx)
- [Client IO component](./client-io.tsx)
