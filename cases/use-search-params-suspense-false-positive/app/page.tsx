import { Suspense } from "react";
import { SearchValue } from "./search-value";

export default function Page() {
  return (
    <main>
      <h1>useSearchParams inside Suspense</h1>
      <Suspense fallback={<p>Loading query…</p>}>
        <SearchValue />
      </Suspense>
    </main>
  );
}
