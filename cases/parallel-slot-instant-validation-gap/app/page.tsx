import Link from "next/link";

export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 32 }}>
      <h1>parallel-slot-instant-validation-gap</h1>
      <p>
        <Link href="/dashboard">Go to /dashboard</Link>
      </p>
      <p style={{ color: "#666" }}>
        Expected: dev overlay + build error reporting that{" "}
        <code>@modal/page.tsx</code> was an expected segment that didn't
        render. Actual: silent success — the framework treats{" "}
        <code>@modal/default.tsx</code> returning <code>null</code> as a
        legitimate empty slot, even when the slot's <code>page.tsx</code>{" "}
        declared <code>unstable_instant = true</code>.
      </p>
    </main>
  );
}
