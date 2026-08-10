import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "./_components/Navbar";
import TitleWatcher from "./_components/TitleWatcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "Static Title Repro",
  description: "Static description",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <TitleWatcher />
        {/* Suspense boundary wraps only the Navbar (matches user's repro). */}
        <Suspense fallback={<div data-testid="nav-fallback">Loading nav…</div>}>
          <Navbar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
