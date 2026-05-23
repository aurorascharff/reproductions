import { NavLink } from './nav-link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', gap: '2rem', padding: '2rem' }}>
        <aside style={{ minWidth: 250, padding: '1rem', border: '2px solid #ccc', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Sidebar</h3>
          <NavLink href="/" label="Home" />
          <NavLink href="/about" label="About" />
        </aside>
        <main style={{ flex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
