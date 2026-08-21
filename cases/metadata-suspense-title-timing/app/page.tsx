import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home page (static)</h1>
      <p>
        The title trace starts when you click. The Navbar keeps the navigation
        response open for three seconds.
      </p>
      <Link href="/dynamic">Go to /dynamic (static page and metadata)</Link>
    </main>
  );
}
