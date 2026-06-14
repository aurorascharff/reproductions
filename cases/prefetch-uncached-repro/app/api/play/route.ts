import { cookies } from "next/headers";
import { bump } from "../../lib/store";

export async function POST() {
  const store = await cookies();
  const user = store.get("session")?.value ?? "anon";
  return Response.json({ count: bump(user) });
}
