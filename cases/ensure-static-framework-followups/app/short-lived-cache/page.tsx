import { cacheLife } from "next/cache";
import { Suspense } from "react";

export const unstable_ensureStatic = "navigation";

export default function Page() {
  return (
    <main>
      <h1>Short-lived cache guidance</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <CachedContent />
      </Suspense>
    </main>
  );
}

async function CachedContent() {
  await shortLivedCache();
  return <p>Non-prerenderable cached data</p>;
}

async function shortLivedCache() {
  "use cache";
  cacheLife({ expire: 299 });
  await new Promise((resolve) => setTimeout(resolve));
  return Date.now();
}
