import { Suspense } from "react";
import { connection } from "next/server";
import { CaseLayout } from "../../_components/case-layout";
import { IoTimestamp } from "../../_components/clocks";

async function RequestTimestamp() {
  await connection();
  return <IoTimestamp />;
}

export default function Page() {
  return (
    <CaseLayout
      title="connection() inside Suspense"
      summary="The route keeps an instant fallback shell, but the request-rendered Client Component still recomputes its timestamp during hydration."
      facts={[
        "instant default",
        "connection()",
        "Client use(io())",
        "Suspense",
        "Hydration error",
      ]}
    >
      <Suspense fallback={<span className="value">Loading…</span>}>
        <RequestTimestamp />
      </Suspense>
    </CaseLayout>
  );
}
