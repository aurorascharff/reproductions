"use server";

// A Server Action that sleeps 1.5s. Nothing else: no DB write, no
// revalidateTag, no updateTag, no cookies. The point of the repro is that
// the action's *existence* in the App Router's dispatch queue is enough to
// gate the next <Link> click, regardless of what it does.
export async function slowAction() {
  await new Promise((r) => setTimeout(r, 1500));
}
