import { Suspense } from "react";
import { getData } from "../../data";

export default function CachedDefaultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <h2>use cache (default)</h2>
      <p style={{ color: "#888" }}>
        <code>&apos;use cache&apos;</code> on the component. Blocks first time,
        no skeleton.
      </p>
      <Suspense fallback={<p>⏳ Loading (default cache)...</p>}>
        {params.then(({ id }) => (
          <CachedContent id={id} />
        ))}
      </Suspense>
    </div>
  );
}

async function CachedContent({ id }: { id: string }) {
  "use cache";
  const data = await getData(id);
  return (
    <div
      style={{
        padding: 16,
        border: "1px solid #444",
        borderRadius: 8,
        marginTop: 12,
      }}
    >
      <p>
        ID: <strong>{data.id}</strong>
      </p>
      <p style={{ color: "#888", fontSize: 12 }}>Timestamp: {data.timestamp}</p>
    </div>
  );
}
