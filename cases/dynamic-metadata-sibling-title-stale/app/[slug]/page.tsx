import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

function getItem(slug: string) {
  return { slug, title: slug === "alpha" ? "Alpha" : "Beta" };
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getItem(slug);
  return { title: item.title };
}

export default function ItemPage({ params }: PageProps<"/[slug]">) {
  return (
    <Suspense fallback={<p>Loading page…</p>}>
      <Item params={params} />
    </Suspense>
  );
}

async function Item({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const otherSlug = slug === "alpha" ? "beta" : "alpha";

  return (
    <main>
      <h1>{slug}</h1>
      <p>
        Expected title: {slug === "alpha" ? "Alpha" : "Beta"} · Dynamic
        metadata repro
      </p>
      <Link href={`/${otherSlug}`} prefetch={false}>
        Navigate to /{otherSlug}
      </Link>
    </main>
  );
}
