import { Suspense } from "react";

async function getUncachedData() {
  // No 'use cache' — this is dynamic/runtime data.
  console.log("[REPRO] UNCACHED RAN at", new Date().toISOString());
  return { at: new Date().toISOString() };
}

async function UncachedSection() {
  const data = await getUncachedData();
  return (
    <div className="rounded border border-zinc-300 p-4">
      <p className="text-sm">Uncached value: {data.at}</p>
    </div>
  );
}

export default function UncachedPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-xl font-semibold">Uncached page</h1>
      <p className="text-sm text-zinc-700">
        This page contains no <code>&apos;use cache&apos;</code> directives.
        Under PPR (Next 16 default with <code>cacheComponents</code>), prefetch
        should only fetch the static shell and not execute this server code.
      </p>
      <Suspense fallback={<p className="text-sm text-zinc-500">loading…</p>}>
        <UncachedSection />
      </Suspense>
    </main>
  );
}
