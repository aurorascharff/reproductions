"use server";

// Simulates a write that takes 1.5s server-side. The point of the repro:
// even when we fire-and-forget this from the client — no await, no
// startTransition, no revalidation — the next <Link> navigation is queued
// behind it.
//
// In a real app this is: mark notifications read, delete a draft, record a
// play, anything the user shouldn't have to wait for before navigating.
export async function markAllRead() {
  await new Promise((r) => setTimeout(r, 1500));
}
