import { getCount } from "./data";
import { Demo } from "./demo";

export default async function Home() {
  const count = await getCount();
  return (
    <>
      <h1 style={{ marginTop: 0, fontSize: 22 }}>Server Action queues the next navigation</h1>

      <p style={{ lineHeight: 1.6 }}>
        Server Action responses and navigation results share the App Router&apos;s
        dispatch queue. When the queue gates the navigation it commits with fresh
        data — but if the navigation gets ahead of the action&apos;s dispatch, the
        router serves the prefetched payload as-is, even when the action just
        invalidated the tag that built it.
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

      <h2 style={{ marginTop: 32, fontSize: 16 }}>What to compare</h2>
      <ol style={{ lineHeight: 1.7 }}>
        <li>
          <strong>Slow path (queue engages):</strong> click <strong>Fire Server
          Action</strong>, wait until the button reads &quot;Working…&quot;, then
          click <strong>Go to destination</strong>. The click sits ~1s, then
          commits with the <em>new</em> count.
        </li>
        <li>
          <strong>Fast path (queue bypassed):</strong> click <strong>Fire +
          navigate (same tick)</strong>. The navigation commits in ~10ms
          showing the <em>old</em> count. The action still runs to completion
          server-side and bumps the counter, but the prefetched payload that
          the router used was built before the invalidation. Go back home,
          fire-and-wait once more, and the destination&apos;s count finally
          updates — only because a later navigation re-fetched it.
        </li>
      </ol>

      <p style={{ color: "#666", fontSize: 13, marginTop: 24, lineHeight: 1.6 }}>
        The action sleeps 1.5s, bumps a file-backed counter, then calls{" "}
        <code>updateTag(&apos;items&apos;)</code>. Both pages read a cached function
        tagged <code>items</code>. The fast-path case is the worrying one:
        nothing visible tells the user their click raced ahead of the action
        and gave them stale data.
      </p>
    </>
  );
}
