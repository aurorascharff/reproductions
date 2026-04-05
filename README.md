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
