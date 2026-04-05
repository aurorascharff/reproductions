#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> git status"
git add -A
git status -sb

echo "==> commit (if needed)"
git diff --cached --quiet && git diff --quiet || \
  git commit -m "Monorepo: cases for cookies, 04-04-2026, instant-favicon-repro"

echo "==> create repo + push"
if gh repo view aurorascharff/reproductions >/dev/null 2>&1; then
  echo "Repo exists; pushing to origin"
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/aurorascharff/reproductions.git"
  git branch -M main
  git push -u origin main
else
  gh repo create reproductions --public --source=. --remote=origin --push
fi

echo "Done: https://github.com/aurorascharff/reproductions"
