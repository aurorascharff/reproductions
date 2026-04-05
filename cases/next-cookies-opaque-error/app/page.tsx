/**
 * Intentional repro: `cookies()` is async — calling `.get()` on the Promise crashes at runtime.
 * `npm run build` exits 0 (with @ts-ignore). `npm start` + visit `/` → opaque TypeError / digest.
 */
import { cookies } from "next/headers";

export default function Page() {
  const cookieStore = cookies();
  // @ts-ignore
  const theme = cookieStore.get("theme");
  // @ts-ignore
  const user = cookieStore.get("user");

  return (
    <main>
      <p>Theme: {theme?.value ?? "(none)"}</p>
      <p>User: {user?.value ?? "(none)"}</p>
    </main>
  );
}
