# Short-lived cache receives unrelated guidance

This reproduction uses `use cache` with an expiration one second below the
five-minute minimum required by `unstable_ensureStatic = "navigation"`.

## Reproduce

From the `ensure-static-framework-followups` directory:

```bash
pnpm install --config.minimumReleaseAge=0
pnpm dev
```

Open <http://localhost:3000/short-lived-cache> and inspect the dev overlay.

## Current behavior

The overlay labels the cache as generic runtime data and suggests static
parameters or `useSearchParams()`. A production build reports uncached or
runtime data and suggests adding `use cache`, even though the function already
uses it.

## Expected behavior

The guidance should identify the short cache lifetime and explain that
`expire` must be at least 300 seconds for fully static navigation.

## Relevant file

- [Short-lived cache route](./page.tsx)
