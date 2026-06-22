"use server";

import { updateTag } from "next/cache";
import { bumpCount } from "./store";

// Sleeps 1.5s, increments the shared count, then invalidates 'items' — the
// same tag the cached read on Home and Destination uses. The next render of
// either page will pick up the new count.
export async function bumpItems() {
  await new Promise((r) => setTimeout(r, 1500));
  bumpCount();
  updateTag("items");
}
