import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-xl font-semibold">Prefetch uncached repro</h1>
      <p className="text-sm text-zinc-700">
        With <code>cacheComponents: true</code> and PPR as the default prefetch
        strategy, prefetching <strong>should NOT</strong> invoke uncached server
        code. Links are auto-prefetched when in viewport — watch the dev server
        log.
      </p>
      <p className="text-sm text-zinc-700">
        Expected: no <code>UNCACHED RAN</code> for /uncached. With{" "}
        <code>force-runtime</code>, it does run during prefetch.
      </p>

      <div className="flex flex-col gap-2 border-l-2 border-zinc-300 pl-3">
        <p className="text-xs uppercase text-zinc-500">Default prefetch (no prop)</p>
        <Link href="/uncached" className="underline">
          /uncached (no prefetch prop)
        </Link>
      </div>

      <div className="flex flex-col gap-2 border-l-2 border-blue-400 pl-3">
        <p className="text-xs uppercase text-blue-600">Explicit prefetch=true</p>
        <Link href="/uncached" className="underline" prefetch>
          /uncached (prefetch={"{true}"})
        </Link>
      </div>

      <div className="flex flex-col gap-2 border-l-2 border-orange-400 pl-3">
        <p className="text-xs uppercase text-orange-600">force-runtime opt-in</p>
        <Link href="/force-runtime" className="underline" prefetch>
          /force-runtime (page exports unstable_prefetch = &apos;force-runtime&apos;)
        </Link>
      </div>
    </main>
  );
}
