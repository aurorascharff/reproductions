import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Dynamic metadata marker hidden by a hydration gate</h1>
      <p>
        Both routes use URL-dependent server metadata and the same client
        hydration gate. Compare where the dynamic marker renders.
      </p>
      <ul>
        <li>
          <Link href="/song/sample">Reproduction: marker inside the gate</Link>
        </li>
        <li>
          <Link href="/control/sample">Control: marker outside the gate</Link>
        </li>
      </ul>
    </main>
  );
}
