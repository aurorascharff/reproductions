import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: 20 }}>
        <nav
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 20,
            borderBottom: "1px solid #333",
            paddingBottom: 12,
          }}
        >
          <Link href="/">Home</Link>
          <Link href="/uncached/1">Uncached /1</Link>
          <Link href="/uncached/2">Uncached /2</Link>
          <Link href="/cached-default/1">Cached /1</Link>
          <Link href="/cached-default/2">Cached /2</Link>
          <Link href="/cached-private/1">Private /1</Link>
          <Link href="/cached-private/2">Private /2</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
