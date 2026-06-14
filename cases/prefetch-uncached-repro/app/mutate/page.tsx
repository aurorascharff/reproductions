"use client";
import { useState } from "react";

export default function Mutate() {
  const [last, setLast] = useState<number | null>(null);
  return (
    <main>
      <h1>Mutate</h1>
      <button
        onClick={async () => {
          const res = await fetch("/api/play", { method: "POST" });
          const { count } = await res.json();
          setLast(count);
        }}
      >
        bump count
      </button>
      {last !== null && <p>server now at: {last}</p>}
    </main>
  );
}
