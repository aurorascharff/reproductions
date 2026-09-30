import { connection } from "next/server";
import { Suspense } from "react";
import { UseServerDataOnlyInBrowser } from "./client";

export const unstable_ensureStatic = "navigation";

export default function Page() {
  return (
    <main>
      <h1>Unused request-dependent promise</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <UseServerDataOnlyInBrowser
          serverData={connection().then(() => "Dynamic data")}
        />
      </Suspense>
    </main>
  );
}
