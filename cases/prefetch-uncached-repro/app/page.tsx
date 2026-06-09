import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-xl font-semibold">Prefetch uncached repro</h1>
      <p className="text-sm text-zinc-700">
        With <code>cacheComponents: true</code> and PPR as the default prefetch
        strategy, prefetching <strong>should NOT</strong> invoke uncached server
        code. Hover the link below and watch the dev server terminal.
      </p>
      <p className="text-sm text-zinc-700">
        Expected: terminal stays silent on hover. Observed: see{" "}
        <code>UNCACHED RAN</code> appear on hover (= bug).
      </p>
      <Link href="/uncached" className="underline" prefetch>
        /uncached (default prefetch=true)
      </Link>
      <Link href="/uncached" className="underline">
        /uncached (no explicit prefetch prop)
      </Link>
    </main>
  );
}
