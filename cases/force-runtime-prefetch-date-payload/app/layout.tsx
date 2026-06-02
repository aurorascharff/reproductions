import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'force-runtime prefetch date payload repro',
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}
