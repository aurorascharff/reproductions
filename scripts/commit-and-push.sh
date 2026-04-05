#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

git add -A
git status -sb
git commit -m "Monorepo: cases (3 Next apps), docs, scripts" || {
  echo "Nothing to commit or commit failed; continuing to push if ahead of remote"
}
git push -u origin main

echo "Done. Open https://github.com/aurorascharff/reproductions"
