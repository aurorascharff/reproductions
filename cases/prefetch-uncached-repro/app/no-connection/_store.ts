import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), ".repro-store.json");

function load(): Record<string, number> {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}

function save(data: Record<string, number>) {
  fs.writeFileSync(FILE, JSON.stringify(data));
}

export function readCount(user: string): number {
  return load()[user] ?? 0;
}

export function bumpCount(user: string): number {
  const data = load();
  const next = (data[user] ?? 0) + 1;
  data[user] = next;
  save(data);
  return next;
}
