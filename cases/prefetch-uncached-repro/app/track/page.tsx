"use client";
import Link from "next/link";
import { useState } from "react";

const TRACKS = ["Pixel Perfect", "Luna Park", "Ship It", "Hot Module Reload"];

export default function TrackPage() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Step 2 of 3 · Track
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Play a track</h1>
        <p className="text-sm text-zinc-600">
          Clicking a track POSTs to{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            /api/play
          </code>
          , which mutates the per-user recently-played list on the server.
        </p>
      </header>

      <section className="mb-8 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-zinc-500">Tracks</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {TRACKS.map((t) => {
            const isPlaying = playing === t;
            return (
              <li key={t}>
                <button
                  disabled={pending}
                  className={`flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition ${
                    isPlaying
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                      : "border-zinc-200 bg-white hover:bg-zinc-50"
                  } disabled:opacity-50`}
                  onClick={async () => {
                    setPending(true);
                    await fetch("/api/play", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ track: t }),
                    });
                    setPlaying(t);
                    setPending(false);
                  }}
                >
                  <span
                    className={
                      isPlaying ? "text-emerald-600" : "text-zinc-400"
                    }
                  >
                    {isPlaying ? "●" : "▶"}
                  </span>
                  <span className="font-medium">{t}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {playing && (
          <p className="mt-4 text-sm text-emerald-700">
            Recorded play: <strong>{playing}</strong>
          </p>
        )}
      </section>

      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
        <p className="mb-2 font-semibold">Next step</p>
        <p>
          Click{" "}
          <Link
            href="/"
            prefetch={true}
            className="font-medium underline"
          >
            ← Home
          </Link>{" "}
          and check whether the grid updated.
        </p>
      </section>
    </main>
  );
}
