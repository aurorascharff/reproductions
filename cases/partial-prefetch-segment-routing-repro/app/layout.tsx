import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./styles.css";

export const metadata: Metadata = {
  title: "Partial Prefetch Segment Routing Repro",
  description: "Minimal reproduction for deployed Partial Prefetching segment routing.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/activity">Activity</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
