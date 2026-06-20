import { Suspense } from "react";
import { connection } from "next/server";

// A component that reads request-time data, so the route is genuinely dynamic.
// This is what a `<Link prefetch={true}>` would pull into a "full" prefetch —
// the exact thing the link-prefetch-partial warning is about.
async function Dynamic() {
  await connection();
  return <p>Rendered at: {new Date().toISOString()}</p>;
}

export function TargetBody({ label }: { label: string }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>{label}</h1>
      <Suspense fallback={<p>Loading dynamic data…</p>}>
        <Dynamic />
      </Suspense>
    </main>
  );
}
