import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>NAR-854 — Instant Validation points to the wrong await</h1>
      <p>
        Open <code>/products</code> and look at the dev overlay (Insights tab).
        The route does two sequential uncached fetches; the insight &quot;Next.js
        encountered uncached data during a navigation&quot; puts its code-frame
        caret on the <strong>second</strong> fetch, not the first (the actual
        first blocking cause).
      </p>
      <p>
        <Link href="/products">Go to /products →</Link>
      </p>
    </div>
  );
}
