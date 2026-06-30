import Link from 'next/link';
import { PLAYLISTS } from '@/app/lib/playlists';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', margin: 0, display: 'flex' }}>
        <aside
          style={{
            width: 220,
            borderRight: '1px solid #ccc',
            padding: 12,
            height: '100vh',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Link prefetch={true} href="/">
              Home
            </Link>
            <hr style={{ width: '100%', border: 'none', borderTop: '1px solid #eee' }} />
            {/* Unbounded list. Every link is in the viewport, and every
                destination is `prefetch = 'allow-runtime'`, so the router fires
                one runtime prerender per link on load. Add more playlists and
                the storm grows linearly. */}
            {PLAYLISTS.map(pl => (
              <Link key={pl.id} prefetch={true} href={`/playlist/${pl.id}`}>
                {pl.name}
              </Link>
            ))}
          </nav>
        </aside>
        <main style={{ padding: 16, flex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
