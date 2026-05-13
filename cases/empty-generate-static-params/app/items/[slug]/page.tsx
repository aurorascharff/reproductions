// Reproduces:
//   EmptyGenerateStaticParamsError: When using Cache Components, all
//   `generateStaticParams` functions must return at least one result.
//
// `cacheComponents: true` is set in next.config.ts. Returning [] from
// generateStaticParams below trips the build-time validation, and any request
// to /items/<anything> in dev returns 500 with a blank screen in the browser.
export async function generateStaticParams(): Promise<
  Array<{ slug: string }>
> {
  return [];
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <main style={{ fontFamily: 'system-ui', padding: 24 }}>Item: {slug}</main>;
}
