import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Header Revalidation Repro',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
