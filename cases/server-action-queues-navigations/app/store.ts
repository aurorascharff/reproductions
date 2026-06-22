// Tiny in-memory store. In a real app this would be a database; we just need
// the value to actually change between calls so the cache invalidation has
// something to demonstrate.
let count = 0;

export function readCount() {
  return count;
}

export function bumpCount() {
  count += 1;
  return count;
}
