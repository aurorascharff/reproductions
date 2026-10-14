import { CaseLayout } from "../../_components/case-layout";
import { DirectTimestamp } from "../../_components/clocks";

export const instant = false;

export default function Page() {
  return (
    <CaseLayout
      title="Direct timestamp with instant = false"
      summary="A development request can reach hydration and mismatch, but the production build fails because browser rendering was requested outside Suspense."
      facts={[
        "Client Component",
        "Date.now()",
        "No Suspense",
        "instant = false",
        "Build fails",
        "Dev hydration error",
      ]}
    >
      <DirectTimestamp />
    </CaseLayout>
  );
}
