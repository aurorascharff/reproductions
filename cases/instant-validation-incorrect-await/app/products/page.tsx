// Repro for NAR-854: with two sequential blocking awaits, the
// instant-validation code-frame caret points at the SECOND await instead of the
// first (the first blocking cause). Both are uncached fetches, so the caret is
// unambiguously on the wrong line.

const API = "https://api.vercel.app/products";

export default async function ProductsPage() {
  // First blocking await — this is the actual first cause.
  const featured = await fetch(API, { cache: "no-store" });

  // Second blocking await — the caret WRONGLY lands here, not on the first.
  const deals = await fetch(`${API}?deals=1`, { cache: "no-store" });

  return (
    <div>
      <h1>Products</h1>
      <p>
        {featured.status} / {deals.status}
      </p>
    </div>
  );
}
