import { connection } from "next/server";
import { Suspense } from "react";

async function RequestTimeContent() {
  await connection();
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return <p data-testid="dynamic-content">Request-time content finished.</p>;
}

export default function ActivityPage() {
  return (
    <>
      <p className="eyebrow">Destination route</p>
      <h1 data-testid="activity-shell">Activity shell</h1>
      <p>This heading belongs to the reusable App Shell.</p>
      <Suspense fallback={<p data-testid="dynamic-fallback">Loading request-time content…</p>}>
        <RequestTimeContent />
      </Suspense>
    </>
  );
}
