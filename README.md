# reproductions

Public minimal repros for bugs and DX friction — **[github.com/aurorascharff/reproductions](https://github.com/aurorascharff/reproductions)**.

Each case is a standalone Next.js app under `cases/<name>/`. Install and run from that directory.

**Layout (this repo should look like this on disk and on GitHub):**

```text
reproductions/
├── README.md
├── docs/
│   └── repro-cookies-opaque-error.png
├── scripts/
│   └── publish-to-github.sh
└── cases/
    ├── next-cookies-opaque-error/   # Next app (own package.json)
    ├── 04-04-2026/                  # Next app
    └── instant-favicon-repro/       # Next app
```

If [github.com/aurorascharff/reproductions](https://github.com/aurorascharff/reproductions) shows a **single** Next app at the **root** (e.g. `app/` next to `package.json` with **no** `cases/`), you are either looking at an **old push** or `git push` was run from a **different folder**. Fix: `cd ~/Documents/Development/reproductions`, run `ls cases` (you should see three directories), then `git add -A && git status`, commit, and `git push`.

## Cases

| Folder | Description | Source |
|--------|-------------|--------|
| [`cases/next-cookies-opaque-error`](./cases/next-cookies-opaque-error) | `cookies()` not awaited → opaque `TypeError` at runtime | Authored for friction log |
| [`cases/04-04-2026`](./cases/04-04-2026) | App router demo: `/` → `/products/[id]`, `cacheComponents` | Mirrored from **[github.com/aurorascharff/04-04-2026](https://github.com/aurorascharff/04-04-2026)** |
| [`cases/instant-favicon-repro`](./cases/instant-favicon-repro) | `app/favicon.ico` vs `unstable_instant` + cache components build failure | Mirrored from **[github.com/aurorascharff/instant-favicon-repro](https://github.com/aurorascharff/instant-favicon-repro)** |
| [`cases/empty-generate-static-params`](./cases/empty-generate-static-params) | `cacheComponents: true` + `generateStaticParams` returning `[]` → 500 + blank screen at request time | Authored for friction log |
| [`cases/force-runtime-prefetch-date-payload`](./cases/force-runtime-prefetch-date-payload) | `unstable_prefetch = 'force-runtime'` + cached navigation payload containing `Date` → noisy `Connection closed` profile streams | Authored for friction log |
| [`cases/not-found-blocking-attribution`](./cases/not-found-blocking-attribution) | `cacheComponents` + root layout `cookies()` → `next build` fails on synthetic `/_not-found` without naming the root layout | Authored for friction log |
| [`cases/allow-runtime-link-list-fanout`](./cases/allow-runtime-link-list-fanout) | `prefetch = 'allow-runtime'` on every link in an unbounded list → one runtime prerender per link on load (N server renders per page view); mirrors next-beats' structure ([live](https://allow-runtime-link-list-fanout.labs.vercel.dev)) | Authored for friction log |
| [`cases/soft-nav-broken-canary-80`](./cases/soft-nav-broken-canary-80) | Soft `<Link>` nav stuck (URL commits, content stays on prev page) on canary builds **after** `16.3.0-canary.80` (React `20260707` upgrade, #95581) — #86151 resurfaced. canary.80 = 100% ok; branch HEAD = 0% ok | Authored for friction log |
| [`cases/metadata-suspense-title-timing`](./cases/metadata-suspense-title-timing) | Static metadata title updates immediately during soft navigation even while an unrelated layout Suspense boundary remains pending for 3s; original late-title report not reproduced on `16.3.1-canary.0` | Authored for friction log |
| [`cases/dynamic-metadata-sibling-title-stale`](./cases/dynamic-metadata-sibling-title-stale) | Dynamic `generateMetadata` title remains stale after sibling `/[slug]` soft navigation on Next.js 16.3.0, even with `prefetch={false}` | Extracted from next16-team-chat |
| [`cases/app-router-hash-back-stale-content`](./cases/app-router-hash-back-stale-content) | Browser Back restores a native fragment URL while App Router leaves the next dynamic route rendered | Extracted from the react.dev App Router migration |
| [`cases/use-cache-empties-instant-error-stack`](./cases/use-cache-empties-instant-error-stack) | `use cache` + `generateStaticParams` + `partialPrefetching` → the `instant-shell-url-data` insight fires with an **empty Call Stack** (no user frame); removing `use cache` brings the `await params` frame back. `addErrorContext` isn't cache-aware unlike `applyOwnerStack`. Possibly #96028 | Authored for friction log |

Shared assets for READMEs (e.g. screenshots) may live in [`docs/`](./docs/).

## Maintainer: first publish (404 → live repo)

From this folder, with [`gh` CLI](https://cli.github.com/) logged in (`gh auth login`):

```bash
bash scripts/publish-to-github.sh
```

That commits any pending changes, runs `gh repo create reproductions --public … --push` if the repo does not exist yet, otherwise pushes to `origin`.

## Maintainer: later pushes

```bash
cd ~/Documents/Development/reproductions
git add -A
git commit -m "your message"
git push
```

If you still use standalone repos (**[04-04-2026](https://github.com/aurorascharff/04-04-2026)**, **[instant-favicon-repro](https://github.com/aurorascharff/instant-favicon-repro)**), add a README banner pointing here or archive them to avoid drift.
