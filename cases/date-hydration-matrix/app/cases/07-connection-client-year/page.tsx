import { connection } from "next/server";
import { CaseLayout } from "../../_components/case-layout";
import { DirectYear } from "../../_components/clocks";

export const instant = false;

export default async function Page() {
  await connection();

  return (
    <CaseLayout
      title="connection() followed by client year"
      summary="The Client Component renders on the server and again in the browser. The equal year hides the unsafe double read."
      facts={[
        "Request render",
        "Client Component",
        "Year",
        "Looks clean by coincidence",
      ]}
    >
      <DirectYear />
    </CaseLayout>
  );
}
