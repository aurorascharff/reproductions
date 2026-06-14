import { cookies } from "next/headers";
import { bumpCount } from "../_store";

export async function POST() {
  const store = await cookies();
  const user = store.get("session")?.value ?? "anon";
  const count = bumpCount(user);
  console.log("[REPRO] bumped", user, "to", count);
  return Response.json({ user, count });
}
