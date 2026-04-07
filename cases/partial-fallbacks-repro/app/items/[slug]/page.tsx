export async function generateStaticParams() {
  return [{ slug: "alpha" }];
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <div>
      <h1>Item: {slug}</h1>
      <p>Loaded after 2 seconds. Timestamp: {Date.now()}</p>
    </div>
  );
}
