import { CaseLayout } from "../../_components/case-layout";
import { IoTimestamp } from "../../_components/clocks";

export const instant = false;

export default function Page() {
  return (
    <CaseLayout
      title="Unbounded io() with instant = false"
      summary="The opt-out can reach a request render in development, but it does not make an unbounded Client Component bailout buildable."
      facts={[
        "Client Component",
        "use(io())",
        "No Suspense",
        "instant = false",
        "Build fails",
        "Dev hydration error",
      ]}
    >
      <IoTimestamp />
    </CaseLayout>
  );
}
