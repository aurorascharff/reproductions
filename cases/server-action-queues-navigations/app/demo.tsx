"use client";

import Link from "next/link";
import { useState } from "react";
import { bumpItems } from "./actions";

export function Demo() {
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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 24,
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#fafafa",
      }}
    >
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
          ? "action invalidates 'items' — click the link now"
          : lastMs !== null
            ? `action took ${lastMs}ms`
            : ""}
      </span>
    </div>
  );
}
