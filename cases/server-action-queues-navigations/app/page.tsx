import { Demo } from "./demo";

export default function Home() {
  return (
    <>
      <h1 style={{ marginTop: 0, fontSize: 22 }}>Server Action queues the next navigation</h1>

      <p style={{ lineHeight: 1.6 }}>
        A fire-and-forget Server Action holds the next <code>&lt;Link&gt;</code> click
        when the destination&apos;s prefetched RSC was tagged with something the
        action invalidates. The router can&apos;t commit the stale prefetch — it
        waits for the action&apos;s response, which carries the fresh RSC for the
        invalidated tag.
      </p>

      <Demo />

      <h2 style={{ marginTop: 32, fontSize: 16 }}>What to do</h2>
      <ol style={{ lineHeight: 1.7 }}>
        <li>
          Click <strong>Go to destination</strong> on its own → it commits in a few ms.
          (Destination is cached and prefetched.)
        </li>
        <li>
          Reload, click <strong>Fire Server Action</strong>, then{" "}
          <em>immediately</em> click <strong>Go to destination</strong>. The
          navigation hangs for ~1500ms — the action <code>updateTag(&apos;items&apos;)</code>{" "}
          invalidates the same tag the destination reads, so the prefetched copy
          can&apos;t be used.
        </li>
      </ol>

      <p style={{ color: "#666", fontSize: 13, marginTop: 24, lineHeight: 1.6 }}>
        The action does one DB-shaped thing: sleep 1.5s, then{" "}
        <code>updateTag(&apos;items&apos;)</code>. The destination reads a cached
        function tagged <code>items</code>. The queueing is the router making sure
        you never land on a stale prefetch you just invalidated.
      </p>
    </>
  );
}
