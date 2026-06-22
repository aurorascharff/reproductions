import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// File-backed counter so the value persists across worker processes and
// across requests in dev/prod. Lets us actually prove that the destination
// renders the post-action value after the queued navigation commits.
const STATE_DIR = join(tmpdir(), "server-action-queues-navigations");
const STATE_FILE = join(STATE_DIR, "count.txt");

function ensureDir() {
  try {
    mkdirSync(STATE_DIR, { recursive: true });
  } catch {}
}

export function readCount(): number {
  ensureDir();
  try {
    return parseInt(readFileSync(STATE_FILE, "utf8"), 10) || 0;
  } catch {
    return 0;
  }
}

export function bumpCount(): number {
  ensureDir();
  const next = readCount() + 1;
  writeFileSync(STATE_FILE, String(next));
  return next;
}
