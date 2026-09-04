import Link from 'next/link';
import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import './styles.css';

export const metadata: Metadata = {
  description: 'Minimal reproduction for nested scroll restoration with Cache Components.',
  title: 'Cache Components nested scroll restoration',
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="site-header">
            <Link href="/" className="brand">
              Nested scroll restoration
            </Link>
            <span>Next.js 16.3.1-canary.26 · Cache Components</span>
          </header>
          <main className="route-viewport">{children}</main>
        </div>
      </body>
    </html>
  );
}
