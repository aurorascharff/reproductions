import Link from 'next/link';
import { PLAYLISTS } from '@/app/lib/playlists';

// Flip the prefetch storm off to feel the difference: `EAGER=0 pnpm build && pnpm start`.
const eager = process.env.EAGER !== '0';

const sectionLabel: React.CSSProperties = {
  display: 'block',
  padding: '10px 0 4px',
  fontSize: 12,
  fontWeight: 600,
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', margin: 0, display: 'flex' }}>
        <aside
          style={{
            width: 260,
            borderRight: '1px solid #ccc',
            padding: 12,
            height: '100vh',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link prefetch={eager} href="/">
              Home
            </Link>

            {/* allow-runtime: each link fires a runtime prerender on load. */}
            <span style={sectionLabel}>Playlists — allow-runtime</span>
            {PLAYLISTS.map(pl => (
              <Link key={pl.id} prefetch={eager} href={`/playlist/${pl.id}`}>
                {pl.name}
              </Link>
            ))}

            {/* control: no allow-runtime → default App Shell prefetch, no fan-out. */}
            <span style={sectionLabel}>Albums — no allow-runtime</span>
            {PLAYLISTS.map(pl => (
              <Link key={pl.id} prefetch={true} href={`/album/${pl.id}`}>
                {pl.name}
              </Link>
            ))}
          </nav>
        </aside>
        <main style={{ padding: 24, flex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
