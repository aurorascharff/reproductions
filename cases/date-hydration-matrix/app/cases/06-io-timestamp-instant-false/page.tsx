import { Suspense } from "react";
import { CaseLayout } from "../../_components/case-layout";
import { IoTimestamp } from "../../_components/clocks";

export const instant = false;

export default function Page() {
  return (
    <CaseLayout
      title="io() timestamp with instant = false"
      summary="The opt-out changes validation policy, not io() or prerendering. This behaves like the previous static case."
      facts={[
        "Client Component",
        "use(io())",
        "Suspense",
        "instant = false",
        "Clean",
      ]}
    >
      <Suspense fallback={<span className="value">Loading…</span>}>
        <IoTimestamp />
      </Suspense>
    </CaseLayout>
  );
}
