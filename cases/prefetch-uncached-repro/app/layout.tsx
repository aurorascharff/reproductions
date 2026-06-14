import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = { title: "prefetch-uncached-repro" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <nav style={{ display: "flex", gap: "1rem", padding: "1rem", borderBottom: "1px solid #ddd" }}>
          <Link href="/" prefetch={true}>Home</Link>
          <Link href="/mutate" prefetch={true}>Mutate</Link>
        </nav>
        <div style={{ padding: "1rem", fontFamily: "system-ui, sans-serif" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
