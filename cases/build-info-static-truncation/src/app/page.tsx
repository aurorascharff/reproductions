import { getProducts } from "@/lib/data";
import Link from "next/link";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="mt-2 text-zinc-400">
          Products 1–3 are fully static (○). Products 4–6 have dynamic reviews
          and are partially prerendered (◐).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            <div className="mb-4 text-4xl">{product.image}</div>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold text-zinc-100 group-hover:text-white">
                {product.name}
              </h2>
              <span className="shrink-0 text-sm font-medium text-emerald-400">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">{product.category}</p>
            <div className="mt-3 flex items-center gap-2">
              {product.hasReviews ? (
                <span className="rounded-full bg-amber-900/40 px-2 py-0.5 text-[11px] font-medium text-amber-400">
                  has reviews (PPR)
                </span>
              ) : (
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                  no reviews (static)
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
