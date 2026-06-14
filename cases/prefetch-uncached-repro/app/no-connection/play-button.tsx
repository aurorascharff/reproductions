"use client";
export function PlayButton() {
  return (
    <button
      className="rounded border bg-zinc-100 px-3 py-1 text-sm"
      onClick={async () => {
        await fetch("/no-connection/play", { method: "POST" });
        // Simulate user clicking the Home nav link (real app pattern).
        // We DON'T call router.refresh — relying on cache invalidation.
      }}
    >
      Record a play
    </button>
  );
}
