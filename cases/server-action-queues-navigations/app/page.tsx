import Link from "next/link";
import { FireAndForgetButton } from "./fire-and-forget-button";

// Home page.
//
// Two prefetched links that point at cached pages — clicking either of them
// from a cold state commits in a few ms.
//
// One button that fires a fire-and-forget Server Action with a 1.5s server
// sleep.
//
// The repro: click the button, then immediately click one of the links. The
// navigation will sit there for ~1.5s before committing, even though the
// destination is fully prefetched.
export default function Home() {
  return (
    <main style={{ display: "flex", flexDirection: "column", gap: 12, padding: 24 }}>
      <h1>Server Action queues subsequent navigations</h1>

      <p>
        Both target pages are cached with <code>&apos;use cache&apos;</code> and prefetched
        via <code>&lt;Link prefetch={"{true}"}&gt;</code>. Clicking either from a fresh page
        load commits in a couple of milliseconds.
      </p>

      <p>
        The button below fires a Server Action with a 1.5-second server-side sleep.
        It&apos;s called as <code>void slowAction()</code> — no <code>await</code>, no{" "}
        <code>startTransition</code>. There&apos;s nothing the client is waiting for.
      </p>

      <ol>
        <li>
          Click <strong>Target A</strong> from a fresh load → instant.
        </li>
        <li>
          Reload, click the <strong>Fire</strong> button, then <em>immediately</em> click
          <strong> Target B</strong> → the navigation waits ~1.5s before committing.
        </li>
      </ol>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <Link
          href="/target-a"
          prefetch={true}
          style={{ padding: "8px 16px", border: "1px solid #999", borderRadius: 6 }}
        >
          → Target A
        </Link>
        <Link
          href="/target-b"
          prefetch={true}
          style={{ padding: "8px 16px", border: "1px solid #999", borderRadius: 6 }}
        >
          → Target B
        </Link>
      </div>

      <div style={{ marginTop: 12 }}>
        <FireAndForgetButton />
      </div>
    </main>
  );
}
