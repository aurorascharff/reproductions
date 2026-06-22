import { cacheTag } from "next/cache";
import { readCount } from "./store";

// Cached read tagged 'items'. Same function is used by Home and Destination
// so the server-rendered count is consistent until the tag is invalidated.
export async function getCount() {
  "use cache";
  cacheTag("items");
  return readCount();
}
