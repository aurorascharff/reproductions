import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense, cache } from "react";
import { readRecentlyPlayed } from "./lib/store";

const getCurrentUser = cache(async () => {
  "use cache: private";
  const store = await cookies();
  return store.get("session")?.value ?? "anon";
});

// Uncached query: no `'use cache'`, no `cacheTag`, no `connection()`. Wrapped
// in React `cache()` only for per-request dedup. Awaits a `'use cache: private'`
// helper for the session cookie.
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
    <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 px-5 py-3 text-xs uppercase tracking-wide text-zinc-500">
        rendered at {renderedAt}
      </div>
      <div className="p-5">
        {tracks.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Nothing played yet. Head to <strong>Track</strong> and play one.
          </p>
        ) : (
          <ul className="space-y-2">
            {tracks.map((t) => (
              <li
                key={t}
                className="flex items-center gap-3 rounded-md bg-zinc-50 px-3 py-2 text-sm"
              >
                <span className="text-zinc-400">♪</span>
                <span className="font-medium">{t}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Opt the segment into runtime prefetching.
export const prefetch = "allow-runtime";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Step 1 of 3 · Home
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Recently Played</h1>
        <p className="text-sm text-zinc-600">
          This route exports{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            prefetch = &apos;allow-runtime&apos;
          </code>{" "}
          so it&apos;s prefetched at runtime with cookies. The grid below is an{" "}
          <strong>uncached</strong> query (no <code>&apos;use cache&apos;</code>,
          no <code>cacheTag</code>) inside{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">&lt;Suspense&gt;</code>.
        </p>
      </header>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-zinc-500">
          Recently Played grid
        </h2>
        <Suspense
          fallback={
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-5 text-sm text-zinc-400">
              loading…
            </div>
          }
        >
          <QuickPlayGrid />
        </Suspense>
      </section>

      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
        <p className="mb-3 font-semibold">How to trigger the bug</p>
        <ol className="ml-5 list-decimal space-y-1">
          <li>
            Click{" "}
            <Link
              href="/track"
              prefetch={true}
              className="font-medium underline"
            >
              Track →
            </Link>{" "}
            in the nav.
          </li>
          <li>
            Play any track. It POSTs <code>/api/play</code> which mutates
            server state.
          </li>
          <li>
            Click <strong>Home</strong> in the nav.
          </li>
          <li>
            <strong>Bug:</strong> the grid still says &ldquo;Nothing played
            yet&rdquo; and the Suspense fallback doesn&apos;t flash — the
            router serves the runtime-prefetched payload from before the play,
            even though the query is uncached. A hard refresh fixes it.
          </li>
        </ol>
      </section>
    </main>
  );
}
