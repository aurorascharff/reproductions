import { connection } from "next/server";
import { Suspense } from "react";
import { ClientIO } from "./client-io";

export const unstable_ensureStatic = "navigation";

export default function Page() {
  return (
    <main>
      <h1>Duplicate error for an allowed client hole</h1>
      <Suspense fallback={<p>Loading client data…</p>}>
        <ClientIO />
      </Suspense>
      <Suspense fallback={<p>Loading server data…</p>}>
        <ServerHole />
      </Suspense>
    </main>
  );
}

async function ServerHole() {
  await connection();
  return <p>Server dynamic data</p>;
}
