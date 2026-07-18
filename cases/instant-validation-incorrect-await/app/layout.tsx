import { Suspense } from "react";

// The <Suspense> above <body> makes routes eligible for a static shell / instant
// navigation, so the instant-validation ("during a navigation") path runs. That
// is the path where NAR-854 reproduces — the caret lands on the second await.
// Without this boundary the route takes the prerender path instead, where the
// caret correctly points at the uncached fetch.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <html lang="en">
        <body style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
          {children}
        </body>
      </html>
    </Suspense>
  );
}
