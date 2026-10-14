# Date and hydration matrix

This app compares how current-time reads behave with Cache Components across Client and Server Components, `io()`, `connection()`, `<Suspense>`, and `instant = false`.

It was created while validating the guidance in [vercel/next.js#99677](https://github.com/vercel/next.js/pull/99677).

## Run it

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), open the browser console, and use the dashboard links. They intentionally perform full document navigations so each case hydrates server HTML.

## Results

| Case | Production build | Browser result |
| --- | --- | --- |
| Direct Client year, no Suspense | Fails | Not applicable |
| Direct Client timestamp with Suspense | Passes | Clean |
| Client `use(io())` timestamp, no Suspense | Fails | Not applicable |
| Client `use(io())` year with Suspense | Passes | Clean |
| Client `use(io())` timestamp with Suspense | Passes | Clean |
| Client `use(io())` timestamp, Suspense, `instant = false` | Passes | Clean |
| `connection()` followed by Client year | Passes | Looks clean only because the year matches |
| `connection()` followed by Client timestamp | Passes | Hydration error |
| `connection()` followed by Client `use(io())` timestamp | Passes | Hydration error |
| Server Component with `await io()` | Passes | Clean |
| `connection()` inside Suspense, then Client `use(io())` | Passes | Hydration error |
| Direct Client timestamp, no Suspense, `instant = false` | Fails | Hydration error in development |
| Client `use(io())` timestamp, no Suspense, `instant = false` | Fails | Hydration error in development |

The important distinction is that `io()` interrupts the static prerender. When it is bounded by Suspense, the static HTML contains the fallback rather than a server timestamp, so the browser has nothing unstable to mismatch against. `connection()` instead opts into a request render. If a Client Component reads the time after that point, it runs once on the server and again during hydration, which can produce different values.

`instant = false` changes the validation policy. It does not turn request-rendered Client Component output into hydration-safe output, and it does not make an unbounded Client Component bailout buildable.

The intentionally failing cases mean a full `pnpm build` is expected to fail. Build one route at a time with Next.js's debug path filter, for example:

```bash
pnpm next build --debug-build-paths app/cases/08-connection-client-timestamp/page.tsx
```
