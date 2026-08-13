import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import './styles.css';

export const metadata: Metadata = {
  title: 'Acme Docs | App Router hash Back reproduction',
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
