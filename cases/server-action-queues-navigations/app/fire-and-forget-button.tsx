"use client";

import { slowAction } from "./actions";

export function FireAndForgetButton() {
  return (
    <button
      type="button"
      onClick={() => {
        // Fire-and-forget. We don't await it. We don't wrap it in startTransition.
        // The action still enters the App Router's action queue, and the next
        // navigation will wait for it.
        void slowAction();
      }}
      style={{
        padding: "8px 16px",
        border: "1px solid #999",
        borderRadius: 6,
        background: "white",
        cursor: "pointer",
      }}
    >
      Fire fire-and-forget Server Action (sleeps 1.5s server-side)
    </button>
  );
}
