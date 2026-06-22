import { getCount } from "./data";
import { Demo } from "./demo";

export default async function Home() {
  const count = await getCount();
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

      <p
        style={{
          fontSize: 48,
          fontWeight: 600,
          margin: "16px 0",
          fontFeatureSettings: "'tnum'",
        }}
      >
        count: {count}
      </p>

      <Demo />

      <h2 style={{ marginTop: 32, fontSize: 16 }}>What to do</h2>
      <ol style={{ lineHeight: 1.7 }}>
        <li>
          Click <strong>Go to destination</strong> on its own → instant. The
          destination shows the same count as Home.
        </li>
        <li>
          Click <strong>Fire Server Action</strong>, then <em>immediately</em>{" "}
          click <strong>Go to destination</strong>. The navigation hangs for
          ~1500ms. When it commits, the destination shows the{" "}
          <em>new</em> count — that&apos;s what the router was waiting for.
        </li>
      </ol>

      <p style={{ color: "#666", fontSize: 13, marginTop: 24, lineHeight: 1.6 }}>
        The action sleeps 1.5s, bumps a counter, then calls{" "}
        <code>updateTag(&apos;items&apos;)</code>. Both pages read a cached function
        tagged <code>items</code>. The queueing is the router making sure you
        never land on a stale prefetch you just invalidated.
      </p>
    </>
  );
}
