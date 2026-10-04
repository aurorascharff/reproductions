import Link from "next/link";

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/with-suspense">/with-suspense</Link> — ensureStatic =
        &apos;shell&apos;, cart inside &lt;Suspense&gt;
      </li>
      <li>
        <Link href="/no-suspense">/no-suspense</Link> — ensureStatic =
        &apos;shell&apos; + instant = false, cart without &lt;Suspense&gt;
      </li>
    </ul>
  );
}
