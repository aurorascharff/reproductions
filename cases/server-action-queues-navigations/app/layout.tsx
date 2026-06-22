import Link from "next/link";

const linkStyle: React.CSSProperties = {
  display: "block",
  padding: "8px 12px",
  borderRadius: 6,
  color: "#111",
  textDecoration: "none",
  fontSize: 14,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          color: "#111",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <aside
            style={{
              width: 200,
              borderRight: "1px solid #eee",
              padding: "16px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              background: "#fafafa",
            }}
          >
            <Link href="/" prefetch={true} style={linkStyle}>
              Home
            </Link>
            <Link href="/inbox" prefetch={true} style={linkStyle}>
              Inbox
            </Link>
            <Link href="/archive" prefetch={true} style={linkStyle}>
              Archive
            </Link>
          </aside>
          <main style={{ flex: 1, padding: 24 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
