"use client";
import Link from "next/link";
import { useState } from "react";

const TRACKS = ["Pixel Perfect", "Luna Park", "Ship It", "Hot Module Reload"];

export default function TrackPage() {
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-xl font-semibold">Track</h1>
      <p className="text-sm text-zinc-700">
        Click any track to POST <code>/api/play</code>. That mutates server
        state but does not call <code>revalidateTag</code> / <code>revalidatePath</code>.
      </p>
      <ul className="space-y-2">
        {TRACKS.map((t) => (
          <li key={t}>
            <button
              className="rounded border bg-zinc-100 px-3 py-1 text-sm"
              onClick={async () => {
                await fetch("/api/play", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ track: t }),
                });
                setPlaying(t);
              }}
            >
              ▶ {t}
            </button>
          </li>
        ))}
      </ul>
      {playing && (
        <p className="text-sm text-emerald-700">recorded play: {playing}</p>
      )}
      <p className="text-sm">
        <Link href="/" prefetch={true} className="underline">
          ← Home
        </Link>
      </p>
    </main>
  );
}
