import { Suspense } from "react";

// The <Suspense> above <body> gives routes a static shell, so the Partial
// Prefetching / instant-navigation validation runs — the path that emits the
// `instant-shell-url-data` insight this repro is about.
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
