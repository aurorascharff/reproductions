import { CaseLayout } from "../../_components/case-layout";
import { DirectYear } from "../../_components/clocks";

export default function Page() {
  return (
    <CaseLayout
      title="Direct year, no Suspense"
      summary="The value is stable most of the year, but Next.js validates the new Date() call rather than guessing whether its output will change."
      facts={["Client Component", "No io()", "No Suspense", "Prerender error"]}
    >
      <DirectYear />
    </CaseLayout>
  );
}
