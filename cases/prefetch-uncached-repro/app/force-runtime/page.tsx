import { connection } from "next/server";
import { Suspense } from "react";

async function getUncachedData() {
  await connection();
  console.log(
    "[REPRO force-runtime] UNCACHED RAN at",
    new Date().toISOString(),
  );
  return { now: Date.now() };
}

async function UncachedSection() {
  const data = await getUncachedData();
  return (
    <div className="rounded border border-zinc-300 p-4">
      <p className="text-sm">Uncached value: {data.now}</p>
    </div>
  );
}

export const unstable_prefetch = "force-runtime";

export default function ForceRuntimePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-xl font-semibold">force-runtime page</h1>
      <p className="text-sm text-zinc-700">
        With <code>unstable_prefetch = &apos;force-runtime&apos;</code> set on
        this page, viewport prefetch from / SHOULD invoke uncached server code
        (this is the documented behavior).
      </p>
      <Suspense fallback={<p className="text-sm text-zinc-500">loading…</p>}>
        <UncachedSection />
      </Suspense>
    </main>
  );
}
