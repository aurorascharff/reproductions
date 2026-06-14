import { cookies } from "next/headers";
import { Suspense } from "react";
import { cache } from "react";
import { Crossfade } from "./crossfade";
import { readCount } from "./_store";
import { PlayButton } from "./play-button";

const getCurrentUser = cache(async () => {
  "use cache: private";
  const store = await cookies();
  return store.get("session")?.value ?? "anon";
});

// Mirrors next-beats `getRecentlyPlayed`: cache()-wrapped, awaits a
// `use cache: private` helper, then reads server state. NO `connection()`,
// NO `'use cache'` of its own.
const getRecentlyPlayed = cache(async () => {
  const user = await getCurrentUser();
  // Slow read so the fallback is observable
  await new Promise((r) => setTimeout(r, 1500));
  const count = readCount(user);
  console.log(
    "[REPRO no-connection] RECENTLY-PLAYED RAN at",
    new Date().toISOString(),
    "user:",
    user,
    "count:",
    count,
  );
  return { now: Date.now(), user, count };
});

async function RecentlyPlayed() {
  const data = await getRecentlyPlayed();
  return (
    <div className="rounded border border-zinc-300 p-4 space-y-1">
      <p className="text-sm">Render time: {data.now}</p>
      <p className="text-sm">User: {data.user}</p>
      <p className="text-sm">Play count: {data.count}</p>
    </div>
  );
}

export const prefetch = "allow-runtime";

export default function NoConnectionPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-xl font-semibold">no-connection page</h1>
      <p className="text-sm text-zinc-700">
        Mirrors a real-app pattern: <code>cache()</code>-wrapped query that
        awaits a <code>&apos;use cache: private&apos;</code> helper and reads
        mutable server state. No <code>connection()</code>, no{" "}
        <code>&apos;use cache&apos;</code>.
      </p>
      <ol className="ml-4 list-decimal text-sm text-zinc-700 space-y-1">
        <li>Note the Play count below.</li>
        <li>Click &ldquo;Record a play&rdquo;.</li>
        <li>Click Home, then come back here.</li>
        <li>
          Bug: Play count is stale (router cache serves prefetched payload).
        </li>
      </ol>
      <PlayButton />
      <Suspense fallback={<p className="text-sm text-zinc-500">loading…</p>}>
        <Crossfade>
          <RecentlyPlayed />
        </Crossfade>
      </Suspense>
    </main>
  );
}
