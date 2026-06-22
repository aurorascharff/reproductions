import Link from "next/link";
import { getCount } from "../data";

export default async function Destination() {
  const count = await getCount();
  return (
    <>
      <h1 style={{ marginTop: 0 }}>Destination</h1>
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
      <p style={{ color: "#666", fontSize: 13, lineHeight: 1.6 }}>
        This page reads a cached function tagged <code>items</code>. The action
        on Home invalidates that tag, so by the time you land here the count is
        the post-action value — that&apos;s what the router was waiting on
        before committing the navigation.
      </p>
      <p style={{ marginTop: 24 }}>
        <Link href="/" prefetch={true} style={{ color: "#111" }}>
          ← back home
        </Link>
      </p>
    </>
  );
}
