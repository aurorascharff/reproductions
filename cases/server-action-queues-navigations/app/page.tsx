import { getCount } from "./data";
import { Demo } from "./demo";

export default async function Home() {
  const count = await getCount();
  return (
    <>
      <h1 style={{ marginTop: 0, fontSize: 22 }}>Server Action queues the next navigation</h1>

      <p style={{ lineHeight: 1.6 }}>
        A fire-and-forget Server Action holds the next <code>&lt;Link&gt;</code> click.
        Server Action responses and navigation results go through the App Router&apos;s
        same dispatch queue — the next navigation can&apos;t commit until the in-flight
        action&apos;s response (and its RSC re-render of the current route) is applied.
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
          Click <strong>Go to destination</strong> on its own → instant. Destination
          shows the same count as Home.
        </li>
        <li>
          Click <strong>Fire Server Action</strong>, then <em>immediately</em>{" "}
          click <strong>Go to destination</strong>. The click sits while the
          action is in flight, then commits — destination shows the{" "}
          <em>new</em> count, the value the action just wrote.
        </li>
      </ol>

      <p style={{ color: "#666", fontSize: 13, marginTop: 24, lineHeight: 1.6 }}>
        The action sleeps 1.5s, bumps a counter, then calls{" "}
        <code>updateTag(&apos;items&apos;)</code>. Both pages read a cached function
        tagged <code>items</code>. The queueing is the router serializing the
        action&apos;s effects with the next navigation so the user never lands on
        stale content they just invalidated.
      </p>
    </>
  );
}
