import { Suspense } from "react";

export async function generateStaticParams() {
  return [{ slug: "alpha" }];
}

async function SlowContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid green",
        borderRadius: "8px",
        marginTop: "1rem",
      }}
    >
      <h2>Dynamic content for: {slug}</h2>
      <p>This loaded after 2 seconds. Timestamp: {Date.now()}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div
      style={{
        padding: "1rem",
        border: "2px dashed orange",
        borderRadius: "8px",
        marginTop: "1rem",
        background: "#fff3e0",
      }}
    >
      <div
        style={{
          height: "1.5rem",
          width: "60%",
          background: "#ffe0b2",
          borderRadius: "4px",
          marginBottom: "0.5rem",
        }}
      />
      <div
        style={{
          height: "1rem",
          width: "80%",
          background: "#ffe0b2",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}

export default function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div>
      <h1>Item page</h1>
      <p>
        Only &quot;alpha&quot; is in <code>generateStaticParams</code>. For
        non-GSP slugs, <code>partialFallbacks</code> should show this static
        shell with the skeleton below, instead of a full-page loading state.
      </p>

      <Suspense fallback={<Skeleton />}>
        <SlowContent params={params} />
      </Suspense>
    </div>
  );
}
