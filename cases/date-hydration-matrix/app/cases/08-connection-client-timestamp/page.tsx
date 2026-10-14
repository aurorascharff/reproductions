import { connection } from "next/server";
import { CaseLayout } from "../../_components/case-layout";
import { DirectTimestamp } from "../../_components/clocks";

export const instant = false;

export default async function Page() {
  await connection();

  return (
    <CaseLayout
      title="connection() followed by client timestamp"
      summary="The server and browser evaluate Date.now() separately. Their millisecond values differ during hydration."
      facts={[
        "Request render",
        "Client Component",
        "Date.now()",
        "Hydration error",
      ]}
    >
      <DirectTimestamp />
    </CaseLayout>
  );
}
