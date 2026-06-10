import { cookies } from "next/headers";
import { connection } from "next/server";
import { Suspense } from "react";
import { cache } from "react";

const getCurrentUser = cache(async () => {
  "use cache: private";
  const store = await cookies();
  return store.get("session")?.value ?? "anon";
});

// Wrapped in cache() like the music player does.
const getUncachedData = cache(async () => {
  await connection();
  const user = await getCurrentUser();
  console.log(
    "[REPRO allow-runtime] UNCACHED RAN at",
    new Date().toISOString(),
    "for user:",
    user,
  );
  return { now: Date.now(), user };
});

async function UncachedSection() {
  const data = await getUncachedData();
  return (
    <div className="rounded border border-zinc-300 p-4">
      <p className="text-sm">Uncached value: {data.now}</p>
      <p className="text-sm">User: {data.user}</p>
    </div>
  );
}

export const prefetch = "allow-runtime";

export default function AllowRuntimePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-xl font-semibold">allow-runtime page</h1>
      <p className="text-sm text-zinc-700">
        This page exports <code>prefetch = &apos;allow-runtime&apos;</code> so
        runtime-cached content (`use cache: private`) gets prefetched.
      </p>
      <p className="text-sm text-zinc-700">
        The uncached section uses <code>await connection()</code> AND{" "}
        <code>await getCurrentUser()</code> (which is{" "}
        <code>&apos;use cache: private&apos;</code>) — mirroring a real app
        where an uncached query awaits a private-cached helper. Per the docs,{" "}
        <code>connection()</code>
        means &quot;always run per request,&quot; so prefetch should NOT invoke
        it.
      </p>
      <Suspense
        fallback={<p className="text-sm text-zinc-500">loading uncached…</p>}
      >
        <UncachedSection />
      </Suspense>
    </main>
  );
}
