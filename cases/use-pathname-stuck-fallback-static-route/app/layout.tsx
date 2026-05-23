import { Suspense } from 'react';
import { NavLink } from './nav-link';
import { CachedData } from './cached-data';
import { PrefetchToggle } from './prefetch-toggle';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', gap: '2rem', padding: '2rem' }}>
        <aside style={{ minWidth: 320, padding: '1rem', border: '2px solid #ccc', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Sidebar (in layout)</h3>
          <NavLink href="/" label="Home" />
          <NavLink href="/about" label="About" />
          <Suspense fallback={<p>Loading cached data...</p>}>
            <CachedData />
          </Suspense>
          <PrefetchToggle />
        </aside>
        <main style={{ flex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
