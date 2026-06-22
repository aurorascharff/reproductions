"use client";

import { useState } from "react";
import { markAllRead } from "./actions";

export function MarkAllReadButton() {
  const [pending, setPending] = useState(false);
  const [lastMs, setLastMs] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          // Fire-and-forget. No await on the call site, no startTransition.
          // We track pending ourselves only so the button reflects the
          // round-trip — the action is otherwise free of any client coupling.
          setPending(true);
          const start = performance.now();
          void markAllRead()
            .finally(() => {
              setLastMs(Math.round(performance.now() - start));
              setPending(false);
            });
        }}
        style={{
          padding: "8px 16px",
          border: "1px solid #111",
          borderRadius: 6,
          background: pending ? "#eee" : "#111",
          color: pending ? "#666" : "#fff",
          cursor: pending ? "wait" : "pointer",
          fontSize: 14,
        }}
      >
        {pending ? "Working…" : "Mark all read"}
      </button>
      <span style={{ fontSize: 13, color: "#666" }}>
        {pending
          ? "Server Action in flight — click Inbox now"
          : lastMs !== null
            ? `Last call: ${lastMs}ms`
            : ""}
      </span>
    </div>
  );
}
