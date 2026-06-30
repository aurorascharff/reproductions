import Link from 'next/link';
import { PLAYLISTS } from '@/app/lib/playlists';

// Flip the prefetch storm off to feel the difference: `EAGER=0 pnpm build && pnpm start`
// (build-time — Next constant-folds this, so it must be set for the build, not just
// `start`). Same click, but no per-link runtime prefetch competing for the pool. See README.
const eager = process.env.EAGER !== '0';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', margin: 0, display: 'flex' }}>
        <aside
          style={{
            width: 240,
            borderRight: '1px solid #ccc',
            padding: 12,
            height: '100vh',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <strong style={{ display: 'block', padding: '4px 0', fontSize: 13, color: '#666' }}>
            Your Library {eager ? '(eager prefetch)' : '(prefetch off)'}
          </strong>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link prefetch={eager} href="/">
              Home
            </Link>
            <hr style={{ width: '100%', border: 'none', borderTop: '1px solid #eee' }} />
            {/* Unbounded list. Every link is in the viewport, and every
                destination is `prefetch = 'allow-runtime'`, so the router fires
                one runtime prerender per link on load. 20 links → 20 renders
                queue for the pool before the user clicks anything. */}
            {PLAYLISTS.map(pl => (
              <Link key={pl.id} prefetch={eager} href={`/playlist/${pl.id}`}>
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
