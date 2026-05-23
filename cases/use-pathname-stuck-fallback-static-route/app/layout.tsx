import Link from 'next/link';
import { Suspense } from 'react';
import { PathnameDisplay } from './pathname-display';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', gap: '2rem', padding: '2rem' }}>
        <aside style={{ minWidth: 200, padding: '1rem', border: '2px solid #ccc', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Sidebar (in layout)</h3>
          <Suspense
            fallback={
              <p style={{ color: 'red', fontWeight: 'bold', margin: 0 }}>❌ FALLBACK</p>
            }
          >
            <PathnameDisplay />
          </Suspense>
          <nav style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
          </nav>
        </aside>
        <main style={{ flex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
