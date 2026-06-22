import { cookies } from "next/headers";

// Leaf "shell" component — reads request data. The blocking-prerender error
// throws here, at the `await cookies()` line. The dev overlay's stack trace
// (after source-maps) points at THIS file.
//
// But wrapping THIS component in `<Suspense>` doesn't fix the error: Suspense
// has to be *above* the throw. The fix has to go in the parent that mounts
// `<DynamicBreadcrumb />` — see `app-sidebar.tsx`.
export async function DynamicBreadcrumb() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "system";
  return <nav style={{ fontSize: 12, opacity: 0.7 }}>Theme: {theme}</nav>;
}
