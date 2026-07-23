import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>`use cache` empties the instant-shell-url-data error stack</h1>
      <p>
        Both routes below read <code>params</code> outside{" "}
        <code>&lt;Suspense&gt;</code>, so both trigger the same insight:{" "}
        <em>
          &quot;Next.js encountered URL data … <code>params</code> or{" "}
          <code>searchParams</code> accessed outside of{" "}
          <code>&lt;Suspense&gt;</code>&quot;
        </em>
        . The <strong>only</strong> difference between them is{" "}
        <code>&apos;use cache&apos;</code> at the top of the page.
      </p>
      <ul>
        <li>
          <Link href="/with-cache/1">/with-cache/1</Link> — has{" "}
          <code>&apos;use cache&apos;</code>. Open the dev overlay → the Insight
          Call Stack has <strong>no user frame</strong> (only ignore-listed
          react-server-dom revive frames).
        </li>
        <li>
          <Link href="/no-cache/1">/no-cache/1</Link> — no{" "}
          <code>&apos;use cache&apos;</code>. Same insight, but the Call Stack
          points at the exact <code>await params</code> line in{" "}
          <code>page.tsx</code>.
        </li>
      </ul>
      <p>
        Same error, same route shape — the presence of{" "}
        <code>&apos;use cache&apos;</code> is what erases the stack.
      </p>
    </div>
  );
}
