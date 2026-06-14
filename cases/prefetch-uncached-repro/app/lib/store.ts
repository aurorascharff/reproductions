import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Shared file in the OS tmp dir so route handlers and page renders running in
// different worker processes (or instances) see the same store.
const FILE = path.join(os.tmpdir(), "prefetch-uncached-repro-store.json");

function load(): Record<string, string[]> {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}

function save(data: Record<string, string[]>) {
  fs.writeFileSync(FILE, JSON.stringify(data));
}

export function readRecentlyPlayed(user: string): string[] {
  return load()[user] ?? [];
}

export function recordPlay(user: string, track: string) {
  const data = load();
  const prev = data[user] ?? [];
  data[user] = [track, ...prev.filter((t) => t !== track)].slice(0, 6);
  save(data);
}
