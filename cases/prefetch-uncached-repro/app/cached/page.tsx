async function getCachedData() {
  "use cache";
  console.log("[REPRO cached] CACHED RAN at", new Date().toISOString());
  return { at: new Date().toISOString() };
}

async function CachedSection() {
  const data = await getCachedData();
  return (
    <div className="rounded border border-zinc-300 p-4">
      <p className="text-sm">Cached value: {data.at}</p>
    </div>
  );
}

export default async function CachedPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-xl font-semibold">Cached page</h1>
      <p className="text-sm text-zinc-700">
        This page has a <code>&apos;use cache&apos;</code> function. Under
        Partial Prefetching: default <code>&lt;Link&gt;</code> loads only the
        App Shell (this CACHED RAN should NOT fire); a{" "}
        <code>&lt;Link prefetch&gt;</code> additionally prefetches the cached
        page content (this CACHED RAN SHOULD fire).
      </p>
      <CachedSection />
    </main>
  );
}
