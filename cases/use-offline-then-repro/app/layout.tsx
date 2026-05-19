import { OfflineBanner } from './offline-banner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', padding: 20 }}>
        <OfflineBanner />
        {children}
      </body>
    </html>
  );
}
