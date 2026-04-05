import { Suspense } from "react";

export const unstable_instant = {
  prefetch: "static",
  samples: [{ params: { id: "1" } }, { params: { id: "2" } }],
};

async function Item({ id }: { id: string }) {
  return <div>Item {id}</div>;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {params.then(({ id }) => (
        <Item id={id} />
      ))}
    </Suspense>
  );
}
