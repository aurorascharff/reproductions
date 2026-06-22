import { Demo } from "./demo";

export default function Home() {
  return (
    <>
      <h1 style={{ marginTop: 0, fontSize: 22 }}>Server Action queues the next navigation</h1>

      <p style={{ lineHeight: 1.6 }}>
        Server Actions and navigations go through the App Router&apos;s same dispatch
        queue. A fire-and-forget Server Action holds the next <code>&lt;Link&gt;</code>{" "}
        click until it returns — even when the action does nothing, the call site
        doesn&apos;t <code>await</code> it, and the destination is unrelated.
      </p>

      <Demo />

      <h2 style={{ marginTop: 32, fontSize: 16 }}>What to do</h2>
      <ol style={{ lineHeight: 1.7 }}>
        <li>
          Click <strong>Go to destination</strong> on its own → it commits in a few ms.
        </li>
        <li>
          Reload, click <strong>Fire Server Action</strong>, then{" "}
          <em>immediately</em> click <strong>Go to destination</strong>. The
          destination&apos;s commit time will jump to ~1500ms — the full duration of
          the action.
        </li>
      </ol>

      <p style={{ color: "#666", fontSize: 13, marginTop: 24, lineHeight: 1.6 }}>
        The action sleeps 1.5s and does nothing else — no <code>revalidateTag</code>,
        no <code>updateTag</code>, no DB write. The delay comes entirely from the
        router waiting to apply the action&apos;s RSC payload before processing the
        next navigation.
      </p>
    </>
  );
}
