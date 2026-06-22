import Link from "next/link";

// Home page. Every link below is a `<Link prefetch={true}>` pointing at a route
// that has NOT adopted Partial Prefetching. Navigating to any of them fires the
// `link-prefetch-partial` warning. Each target tries a different per-route
// "opt-out" to see which (if any) silences the warning.
//
// Expected result (matches the gating in
// packages/next/src/server/app-render/create-flight-router-state-from-loader-tree.ts):
//   /target-plain        → warns (no opt-out)
//   /target-instant-false→ warns  ← the surprising one this repro is about
//   /target-allow-runtime→ warns  ← documented "for request data" but doesn't silence
//   /target-partial      → SILENT (prefetch = 'partial' is the only per-route fix)
export default function Home() {
  return (
    <main
      style={{ display: "flex", flexDirection: "column", gap: 12, padding: 24 }}
    >
      <h1>link-prefetch-partial: which per-route opt-out silences it?</h1>
      <p>
        Click each link (navigate — the warning fires on navigation, not hover).
        Watch the dev overlay / console.
      </p>

      <Link href="/target-plain" prefetch={true}>
        → /target-plain (no opt-out — expected to WARN)
      </Link>

      <Link href="/target-instant-false" prefetch={true}>
        → /target-instant-false (export const instant = false — STILL WARNS)
      </Link>

      <Link href="/target-allow-runtime" prefetch={true}>
        → /target-allow-runtime (prefetch = &apos;allow-runtime&apos; — STILL
        WARNS)
      </Link>

      <Link href="/target-partial" prefetch={true}>
        → /target-partial (prefetch = &apos;partial&apos; — SILENT, the only
        fix)
      </Link>
    </main>
  );
}
