import Link from 'next/link';
import { Suspense } from 'react';
import { PathnameDisplay } from './pathname-display';

// Fully static route. No dynamic APIs.
export default function Page() {
  return (
    <main>
      <h1>Static route (broken)</h1>
      <p>
        This page is fully static. Below is a <code>&lt;Suspense&gt;</code> boundary wrapping a Client Component that
        calls <code>usePathname()</code>.
      </p>
      <p>
        <strong>Expected after hard reload:</strong> green text with the resolved pathname.
        <br />
        <strong>Actual:</strong> red fallback stays forever — Suspense never resolves on the client.
      </p>

      <div style={{ marginTop: '2rem', padding: '1rem', border: '2px solid #ccc', borderRadius: '8px' }}>
        <Suspense
          fallback={<p style={{ color: 'red', fontWeight: 'bold', margin: 0 }}>❌ FALLBACK (should disappear after hydration)</p>}
        >
          <PathnameDisplay />
        </Suspense>
      </div>

      <nav style={{ marginTop: '2rem' }}>
        <Link href="/dynamic">Go to dynamic route (works) →</Link>
      </nav>
    </main>
  );
}
