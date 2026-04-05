# instant-favicon-repro

Mirrored from **[github.com/aurorascharff/instant-favicon-repro](https://github.com/aurorascharff/instant-favicon-repro)** into the [reproductions](https://github.com/aurorascharff/reproductions) monorepo.

Minimal repro: **`app/favicon.ico`** (default `create-next-app` scaffold) + **`unstable_instant`** on the root page + **`cacheComponents`** → build-time validation error. Details in [`friction-log.md`](./friction-log.md) (upstream issue: [vercel/next.js#91787](https://github.com/vercel/next.js/issues/91787)).

## Setup

```bash
cd cases/instant-favicon-repro
# Restore default app icon (required for this repro — binary may not be in git depending on checkout)
curl -fsSL -o app/favicon.ico \
  https://raw.githubusercontent.com/aurorascharff/instant-favicon-repro/main/app/favicon.ico
npm install
npm run build
```

## Learn More

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
