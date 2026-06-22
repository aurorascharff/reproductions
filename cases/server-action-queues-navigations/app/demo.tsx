"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { bumpItems } from "./actions";

export function Demo() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [lastMs, setLastMs] = useState<number | null>(null);

  function fireAction() {
    setPending(true);
    const start = performance.now();
    void bumpItems().finally(() => {
      setLastMs(Math.round(performance.now() - start));
      setPending(false);
    });
  }

  // Fires the action and navigates synchronously in the same tick.
  // Demonstrates the race: navigation commits the stale prefetched payload
  // because it gets ahead of the action dispatch in the router queue.
  function fireAndNavigate() {
    fireAction();
    router.push("/destination");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginTop: 24,
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#fafafa",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={fireAction}
          disabled={pending}
          style={{
            padding: "10px 16px",
            border: "1px solid #111",
            borderRadius: 6,
            background: pending ? "#eee" : "#111",
            color: pending ? "#666" : "#fff",
            cursor: pending ? "wait" : "pointer",
            fontSize: 14,
          }}
        >
          {pending ? "Working…" : "Fire Server Action"}
        </button>

        <Link
          href="/destination"
          prefetch={true}
          style={{
            padding: "10px 16px",
            border: "1px solid #111",
            borderRadius: 6,
            background: "#fff",
            color: "#111",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          Go to destination →
        </Link>

        <span style={{ marginLeft: "auto", fontSize: 12, color: "#666" }}>
          {pending
            ? "action in flight — click the link now"
            : lastMs !== null
              ? `action took ${lastMs}ms`
              : ""}
        </span>
      </div>

      <div
        style={{
          borderTop: "1px dashed #ccc",
          paddingTop: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          type="button"
          onClick={fireAndNavigate}
          style={{
            padding: "10px 16px",
            border: "1px solid #b91c1c",
            borderRadius: 6,
            background: "#fff",
            color: "#b91c1c",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Fire + navigate (same tick)
        </button>
        <span style={{ fontSize: 12, color: "#666" }}>
          fires the action and pushes to destination in the same React tick
        </span>
      </div>
    </div>
  );
}
