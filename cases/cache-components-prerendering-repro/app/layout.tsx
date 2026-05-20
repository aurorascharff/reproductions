import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', padding: 20 }}>
        <nav style={{ display: 'flex', gap: 16, marginBottom: 20, borderBottom: '1px solid #333', paddingBottom: 12 }}>
          <Link href="/">Home</Link>
          <Link href="/uncached/1">Uncached</Link>
          <Link href="/cached/1">Cached</Link>
          <Link href="/cached-fn/1">Cached fn</Link>
          <Link href="/cached-private/1">Cached private</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
