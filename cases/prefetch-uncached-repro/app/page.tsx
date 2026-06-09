import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen p-12 space-y-4">
      <h1 className="text-2xl font-bold">PPF prefetch tests</h1>
      <ul className="space-y-2">
        <li><Link href="/cached" className="underline">A. /cached (default — no prefetch prop)</Link></li>
        <li><Link href="/cached" className="underline" prefetch={true}>B. /cached (prefetch={`{true}`})</Link></li>
        <li><Link href="/uncached" className="underline">C. /uncached (default)</Link></li>
        <li><Link href="/uncached" className="underline" prefetch={true}>D. /uncached (prefetch={`{true}`})</Link></li>
        <li><Link href="/force-runtime" className="underline">E. /force-runtime (route opts into runtime)</Link></li>
      </ul>
    </main>
  );
}
