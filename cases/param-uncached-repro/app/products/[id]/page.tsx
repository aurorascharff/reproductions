import { notFound } from "next/navigation";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
};

const products: Record<string, Product> = {
  "1": {
    id: 1,
    title: "Example product",
    price: 9.99,
    description: "Static placeholder data for /products/[id].",
  },
  "2": {
    id: 2,
    title: "Another product",
    price: 19.5,
    description: "Add more entries to the map as needed.",
  },
};

function getProduct(id: string): Product | null {
  return products[id] ?? null;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-lg space-y-4 p-8 font-sans">
      <a href="/" className="text-sm text-zinc-500 underline">
        ← Home
      </a>
      <h1 className="text-2xl font-semibold">{product.title}</h1>
      <p className="text-lg font-medium">${product.price.toFixed(2)}</p>
      <p className="text-zinc-600">{product.description}</p>
    </main>
  );
}
