import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-4 p-8 font-sans">
      <h1 className="text-xl font-semibold">Products</h1>
      <ul className="list-inside list-disc space-y-2 text-zinc-700">
        <li>
          <Link href="/products/1" className="underline">
            Product 1
          </Link>
        </li>
        <li>
          <Link href="/products/2" className="underline">
            Product 2
          </Link>
        </li>
      </ul>
    </main>
  );
}
