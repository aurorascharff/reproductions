import { Suspense } from "react";
import { io } from "next/cache";
import { CaseLayout } from "../../_components/case-layout";

async function ServerTimestamp() {
  await io();
  return <time className="value">{Date.now()}</time>;
}

export default function Page() {
  return (
    <CaseLayout
      title="Server Component with await io()"
      summary="The timestamp is produced by a Server Component, so the browser does not execute the date read again during hydration."
      facts={["Server Component", "await io()", "Suspense", "Clean"]}
    >
      <Suspense fallback={<span className="value">Loading…</span>}>
        <ServerTimestamp />
      </Suspense>
    </CaseLayout>
  );
}
