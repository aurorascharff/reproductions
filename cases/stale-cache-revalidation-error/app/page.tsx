import Link from 'next/link';
import type { Route } from 'next';

export default function HomePage() {
  return (
    <main className="page">
      <h1>use cache: remote revalidation escape</h1>
      <p className="muted">
        A remote cached value is served stale, then its background revalidation throws outside the route error boundary.
      </p>
      <p>
        <Link href={'/escaped-revalidation/icyJoseph' as Route}>Open the repro</Link>
      </p>
    </main>
  );
}
