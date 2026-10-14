import { Suspense } from "react";
import { CaseLayout } from "../../_components/case-layout";
import { IoTimestamp } from "../../_components/clocks";

export default function Page() {
  return (
    <CaseLayout
      title="io() timestamp with Suspense"
      summary="Millisecond precision confirms that the static use(io()) pattern does not hydrate against a server timestamp."
      facts={["Client Component", "use(io())", "Suspense", "Clean"]}
    >
      <Suspense fallback={<span className="value">Loading…</span>}>
        <IoTimestamp />
      </Suspense>
    </CaseLayout>
  );
}
