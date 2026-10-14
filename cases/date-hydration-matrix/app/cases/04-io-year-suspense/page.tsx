import { Suspense } from "react";
import { CaseLayout } from "../../_components/case-layout";
import { IoYear } from "../../_components/clocks";

export default function Page() {
  return (
    <CaseLayout
      title="io() year with Suspense"
      summary="The static prerender stops before the date read. The browser renders the year after the boundary resolves."
      facts={["Client Component", "use(io())", "Suspense", "Clean"]}
    >
      <Suspense fallback={<span className="value">Loading…</span>}>
        <IoYear />
      </Suspense>
    </CaseLayout>
  );
}
