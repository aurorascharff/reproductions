import Link from 'next/link';
import { OfflineBanner } from './offline-banner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', padding: 20 }}>
        <OfflineBanner />
        <nav style={{ display: 'flex', gap: 16, marginBottom: 20, borderBottom: '1px solid #333', paddingBottom: 12 }}>
          <Link href="/">Home</Link>
          <Link href="/async/123">Async page (works)</Link>
          <Link href="/then/123">Then page (breaks)</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
