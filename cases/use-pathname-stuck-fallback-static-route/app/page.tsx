import Link from 'next/link';
import { Suspense } from 'react';
import { PathnameDisplay } from './pathname-display';

// Fully static route (no dynamic APIs, no async).
// Inside <Suspense>, a client component calls usePathname().
//
// EXPECTED: after hydration, fallback is replaced by resolved pathname.
// ACTUAL on hard reload: fallback persists forever.
export default function Page() {
  return (
    <main>
      <h1>Static page</h1>
      <Suspense fallback={<p style={{ color: 'red', fontWeight: 'bold' }}>FALLBACK (should disappear after hydration)</p>}>
        <PathnameDisplay />
      </Suspense>
      <nav style={{ marginTop: '2rem' }}>
        <Link href="/dynamic">Go to dynamic route →</Link>
      </nav>
    </main>
  );
}
