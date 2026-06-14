import { cookies } from "next/headers";
import { Suspense, cache } from "react";
import { read } from "./lib/store";

const getUser = cache(async () => {
  "use cache: private";
  const c = await cookies();
  return c.get("session")?.value ?? "anon";
});

// Uncached query — no `'use cache'`, no `cacheTag`, no `connection()`.
const getCount = cache(async () => {
  const user = await getUser();
  await new Promise((r) => setTimeout(r, 600));
  const count = read(user);
  console.log("[repro] getCount ran", { user, count });
  return count;
});

async function Counter() {
  const count = await getCount();
  return <p>count: {count}</p>;
}

export const prefetch = "allow-runtime";

export default function Home() {
  return (
    <main>
      <h1>Home (prefetch = &apos;allow-runtime&apos;)</h1>
      <Suspense fallback={<p>loading…</p>}>
        <Counter />
      </Suspense>
    </main>
  );
}
