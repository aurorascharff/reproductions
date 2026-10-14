import { Suspense } from "react";
import { CaseLayout } from "../../_components/case-layout";
import { DirectTimestamp } from "../../_components/clocks";

export default function Page() {
  return (
    <CaseLayout
      title="Direct timestamp with Suspense"
      summary="Next.js interrupts the unstable read during prerendering, and the surrounding boundary supplies the static fallback."
      facts={["Client Component", "No io()", "Suspense", "Clean"]}
    >
      <Suspense fallback={<span className="value">Loading…</span>}>
        <DirectTimestamp />
      </Suspense>
    </CaseLayout>
  );
}
