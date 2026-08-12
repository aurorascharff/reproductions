import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Dynamic metadata sibling navigation repro</h1>
      <p>Open the first dynamic route, then navigate to its sibling.</p>
      <Link href="/alpha" prefetch={false}>
        Start at /alpha
      </Link>
    </main>
  );
}
