import { MarkAllReadButton } from "./mark-all-read-button";

export default function Home() {
  return (
    <>
      <h1 style={{ marginTop: 0 }}>Home</h1>

      <p>
        Sidebar links (Home, Inbox, Archive) are prefetched. Click any of them from a
        cold load and they commit instantly.
      </p>

      <p>
        The button below fires a Server Action that sleeps 1.5s server-side. It&apos;s
        called as <code>void markAllRead()</code> — no <code>await</code>, no{" "}
        <code>startTransition</code>, no <code>revalidateTag</code>.
      </p>

      <h2 style={{ marginTop: 32, fontSize: 16 }}>Try it</h2>
      <ol style={{ lineHeight: 1.7 }}>
        <li>
          Reload, then click <strong>Inbox</strong> in the sidebar → instant.
        </li>
        <li>
          Reload, click <strong>Mark all read</strong>, then{" "}
          <em>immediately</em> click <strong>Inbox</strong> → the navigation hangs ~1.5s.
        </li>
      </ol>

      <div style={{ marginTop: 24 }}>
        <MarkAllReadButton />
      </div>
    </>
  );
}
