import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, getProducts } from "@/lib/data";
import { Reviews } from "./reviews";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        ← Back to products
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-6xl">
          {product.image}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-2xl font-semibold text-emerald-400">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-2 max-w-lg text-zinc-400">{product.description}</p>
        </div>
      </div>

      {product.hasReviews && (
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews productId={id} />
        </Suspense>
      )}
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="h-6 w-32 animate-pulse rounded bg-zinc-800" />
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg bg-zinc-800/50"
          />
        ))}
      </div>
    </div>
  );
}
