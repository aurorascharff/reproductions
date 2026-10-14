import { CaseLayout } from "../../_components/case-layout";
import { IoTimestamp } from "../../_components/clocks";

export default function Page() {
  return (
    <CaseLayout
      title="io() timestamp, no Suspense"
      summary="io() suspends the static prerender, but there is no local boundary to provide fallback UI."
      facts={["Client Component", "use(io())", "No Suspense", "Boundary error"]}
    >
      <IoTimestamp />
    </CaseLayout>
  );
}
