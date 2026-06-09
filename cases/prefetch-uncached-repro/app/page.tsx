import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen p-12 space-y-4">
      <h1 className="text-2xl font-bold">prefetch={`{true}`} test</h1>
      <Link href="/cached" className="underline" prefetch>/cached (prefetch)</Link>
    </main>
  );
}
