import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen space-y-4 p-12">
      <h1 className="text-2xl font-bold">prefetch + uncached repro</h1>
      <p className="text-sm text-zinc-700">
        With <code>partialPrefetching: true</code> +{" "}
        <code>cacheComponents</code>, each link below is prefetched on viewport.
        Watch the server log for <code>UNCACHED RAN</code> entries.
      </p>
      <ul className="space-y-2">
        <li>
          <Link href="/uncached" className="underline" prefetch={true}>
            A. /uncached (page has no <code>prefetch</code> export)
          </Link>
        </li>
        <li>
          <Link href="/allow-runtime" className="underline" prefetch={true}>
            B. /allow-runtime (page exports{" "}
            <code>prefetch = &apos;allow-runtime&apos;</code>)
          </Link>
        </li>
      </ul>
      <p className="text-sm text-zinc-700">
        Both pages have an uncached section using{" "}
        <code>await connection()</code> inside a Suspense boundary. Per the
        docs, <code>connection()</code> means &quot;always run per
        request&quot;, so neither prefetch should invoke the uncached function.
        They should only run on actual navigation.
      </p>
    </main>
  );
}
