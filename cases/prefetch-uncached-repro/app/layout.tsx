import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "prefetch-uncached-repro",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <nav className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 px-6 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center gap-6 text-sm">
            <span className="font-semibold tracking-tight">
              prefetch-uncached-repro
            </span>
            <div className="flex gap-3">
              <Link
                href="/"
                prefetch={true}
                className="rounded-md px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100"
              >
                1. Home
              </Link>
              <Link
                href="/track"
                prefetch={true}
                className="rounded-md px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100"
              >
                2. Track
              </Link>
            </div>
          </div>
        </nav>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
