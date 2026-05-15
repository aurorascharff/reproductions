import Link from "next/link";

export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 32 }}>
      <h1>instant-silence-warning-doesnt-work</h1>
      <p>
        <Link href="/trigger">Go to /trigger</Link>
      </p>
    </main>
  );
}
