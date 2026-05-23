import Link from 'next/link';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { PathnameDisplay } from '../pathname-display';

// Same shape as `/`, but the page also reads `connection()` so the route is
// dynamic. The Suspense streaming machinery is active and the inner content
// arrives — fallback IS replaced after hydration.
async function Dynamic() {
  await connection();
  return <p style={{ color: 'gray' }}>(this route is dynamic via connection())</p>;
}

export default function Page() {
  return (
    <main>
      <h1>Dynamic page</h1>
      <Suspense fallback={<p style={{ color: 'red', fontWeight: 'bold' }}>FALLBACK (should disappear after hydration)</p>}>
        <PathnameDisplay />
      </Suspense>
      <Suspense fallback={null}>
        <Dynamic />
      </Suspense>
      <nav style={{ marginTop: '2rem' }}>
        <Link href="/">← Back to static route</Link>
      </nav>
    </main>
  );
}
