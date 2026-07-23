// Identical to /with-cache/[id] — generic static params, `params` awaited at the
// top — but WITHOUT `use cache`. The same insight fires, but now React's component
// stack is intact, so the Call Stack points at the `await params` line below —
// the actionable frame that is MISSING in the cached variant.

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <h1>no-cache — product {id}</h1>;
}
