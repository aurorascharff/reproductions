import { Suspense } from "react";
import { connection } from "next/server";
import { CaseLayout } from "../../_components/case-layout";
import { IoTimestamp } from "../../_components/clocks";

export const instant = false;

export default async function Page() {
  await connection();

  return (
    <CaseLayout
      title="connection() followed by client use(io())"
      summary="On a real request, io() resolves immediately on both server and browser. It cannot undo the request render introduced by connection()."
      facts={[
        "Request render",
        "Client Component",
        "use(io())",
        "Suspense",
        "Hydration error",
      ]}
    >
      <Suspense fallback={<span className="value">Loading…</span>}>
        <IoTimestamp />
      </Suspense>
    </CaseLayout>
  );
}
