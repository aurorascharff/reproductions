import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense, cache } from "react";
import { readRecentlyPlayed } from "./lib/store";

const getCurrentUser = cache(async () => {
  "use cache: private";
  const store = await cookies();
  return store.get("session")?.value ?? "anon";
});

// Mirrors next-beats `getRecentlyPlayed`: React `cache()` for per-request
// dedup, awaits a `'use cache: private'` helper, then hits mutable state.
// Has no cache tag of its own and no `connection()`.
const getRecentlyPlayed = cache(async () => {
  const user = await getCurrentUser();
  await new Promise((r) => setTimeout(r, 800));
  const tracks = readRecentlyPlayed(user);
  console.log("[repro] getRecentlyPlayed ran", { user, tracks });
  return { user, tracks, renderedAt: new Date().toISOString() };
});

async function QuickPlayGrid() {
  const { tracks, renderedAt } = await getRecentlyPlayed();
  return (
    <div className="rounded border border-zinc-300 p-4 text-sm">
      <div className="mb-2 text-xs text-zinc-500">rendered at {renderedAt}</div>
      {tracks.length === 0 ? (
        <p>Nothing played yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {tracks.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Same opt-in as next-beats home: the segment is runtime-prefetched.
export const prefetch = "allow-runtime";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-xl font-semibold">Recently Played</h1>
      <Suspense fallback={<p className="text-sm text-zinc-500">loading…</p>}>
        <QuickPlayGrid />
      </Suspense>
    </main>
  );
}
