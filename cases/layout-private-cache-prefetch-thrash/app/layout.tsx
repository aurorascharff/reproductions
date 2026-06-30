import Link from 'next/link';
import { Suspense } from 'react';
import { getUser } from '@/app/lib/user';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', margin: 0 }}>
        <header style={{ borderBottom: '1px solid #ccc', padding: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link prefetch={true} href="/">Home</Link>
            <Link prefetch={true} href="/a">A</Link>
            <Link prefetch={true} href="/b">B</Link>
            <Link prefetch={true} href="/c">C</Link>
          </nav>
          <Suspense fallback={<span style={{ marginLeft: 'auto', opacity: 0.5 }}>loading…</span>}>
            <Greeting />
          </Suspense>
        </header>
        <main style={{ padding: 16 }}>{children}</main>
      </body>
    </html>
  );
}

async function Greeting() {
  const user = await getUser();
  return <span style={{ marginLeft: 'auto' }}>hi, {user.handle}</span>;
}
