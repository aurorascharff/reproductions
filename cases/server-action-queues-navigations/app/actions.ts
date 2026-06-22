"use server";

// A fire-and-forget Server Action that just sleeps. No DB, no revalidation —
// the only side effect is the round-trip itself.
//
// The point of the repro is: even when we don't await the action on the
// client, even when it has no effect on cached data, a `<Link>` click that
// happens while this is in flight is queued behind it. The next navigation
// won't commit until the action's response (and its RSC payload) is applied.
export async function slowAction() {
  await new Promise((r) => setTimeout(r, 1500));
}
