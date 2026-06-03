import Link from 'next/link';
import type { Route } from 'next';

export default function HomePage() {
  return (
    <main className="page">
      <h1>stale cache revalidation error</h1>
      <p className="muted">A cached value becomes stale, revalidates, and an async failure escapes the route boundary.</p>
      <p>
        <Link href={'/escaped-revalidation/icyJoseph' as Route}>Open the repro</Link>
      </p>
      <p>
        <Link href={'/error-current-time/icyJoseph' as Route}>Open the error.tsx current time repro</Link>
      </p>
    </main>
  );
}
