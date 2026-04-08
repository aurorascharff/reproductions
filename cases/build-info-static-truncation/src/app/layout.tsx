import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Product Catalog – Build Info Test",
  description:
    "Tests the distinction between fully static (○) and PPR (◐) routes in generateStaticParams build output.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <a href="/" className="text-lg font-semibold tracking-tight">
              Product Catalog
            </a>
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
              Build Info Test
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
