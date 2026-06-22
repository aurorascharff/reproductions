"use server";

import { updateTag } from "next/cache";

// Server Action that takes 1.5s server-side, then invalidates the 'items'
// tag — the same tag the destination's cached read uses. The destination is
// prefetched, but its prefetched RSC was tagged 'items'. As soon as this
// action returns, the router must apply its RSC re-render of the current
// route (which is also tagged 'items'). Until that happens, the destination
// can't safely commit either, because its prefetched RSC is stale.
//
// The queueing the user feels comes from this dependency: the router serial
// izes the action's RSC update with the next navigation's commit so the user
// never sees the stale version they just invalidated.
export async function bumpItems() {
  await new Promise((r) => setTimeout(r, 1500));
  updateTag("items");
}
