# server-action-current-time-import

Minimal repro for checking whether `new Date()` inside a Server Action body can trip `next-prerender-current-time` when the action is only imported by a Client Component on a dynamic route.

## Setup

```bash
cd cases/server-action-current-time-import
pnpm install
pnpm build
pnpm start
```

Open:

- <http://localhost:3000> for links.
- <http://localhost:3000/import-only/alice> for a dynamic route that imports the action but does not invoke it during render.
- <http://localhost:3000/invoked/alice> for a dynamic route that invokes the action during render.

## Expected

`/import-only/alice` should not throw `next-prerender-current-time`. The `new Date()` call is inside the Server Action body and should only run when the form is submitted.

`/invoked/alice` is intentionally wrong and should demonstrate the failure mode: invoking the action while rendering evaluates the current-time call during prerender.

