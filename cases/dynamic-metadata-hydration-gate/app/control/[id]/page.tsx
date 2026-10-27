import { connection } from "next/server";
import { Suspense } from "react";
import HydrationGate from "../../HydrationGate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return { title: `Song ${(await params).id}` };
}

async function DynamicMetadataMarker() {
  await connection();
  return null;
}

export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <DynamicMetadataMarker />
      </Suspense>
      <HydrationGate>
        <main>
          <h1>Local song content</h1>
          <p>The dynamic marker is outside the client hydration gate.</p>
        </main>
      </HydrationGate>
    </>
  );
}
