import Link from 'next/link';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { PathnameDisplay } from '../pathname-display';

// `await connection()` makes the route dynamic.
async function ForceDynamic() {
  await connection();
  return null;
}

export default function Page() {
  return (
    <main>
      <h1>Dynamic route (works)</h1>
      <p>
        Same shape as the static route, but with <code>await connection()</code> in a sibling component to opt the route
        out of static prerendering.
      </p>
      <p>
        <strong>After hard reload:</strong> green resolved pathname appears, as expected.
      </p>

      <div style={{ marginTop: '2rem', padding: '1rem', border: '2px solid #ccc', borderRadius: '8px' }}>
        <Suspense
          fallback={<p style={{ color: 'red', fontWeight: 'bold', margin: 0 }}>❌ FALLBACK (should disappear after hydration)</p>}
        >
          <PathnameDisplay />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <ForceDynamic />
      </Suspense>

      <nav style={{ marginTop: '2rem' }}>
        <Link href="/">← Back to static route (broken)</Link>
      </nav>
    </main>
  );
}
