import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl">Home page (static)</h1>
      <p>
        The title timer starts when you click. The Navbar keeps the navigation
        response open for three seconds.
      </p>
      <Link href="/dynamic" className="underline text-blue-600">
        Go to /dynamic (dynamic page, uses headers())
      </Link>
    </main>
  );
}
