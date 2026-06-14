import { cookies } from "next/headers";
import { recordPlay } from "../store";

// POST /api/play   body: { track: string }
// Mutates server state but does NOT revalidate any tag — mirrors next-beats'
// /api/play, which only revalidates `tracks` / `track-${id}` / `discover:*`
// and forgets to invalidate the recently-played list.
export async function POST(req: Request) {
  const store = await cookies();
  const user = store.get("session")?.value ?? "anon";
  const { track } = await req.json();
  recordPlay(user, track);
  console.log("[repro] recorded play", { user, track });
  return new Response(null, { status: 204 });
}
