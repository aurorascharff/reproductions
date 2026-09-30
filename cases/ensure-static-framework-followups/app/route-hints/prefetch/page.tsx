import { Suspense } from "react";
import { CookieContent } from "../cookie-content";

export const unstable_ensureStatic = "prefetch";

export default function Page() {
  return (
    <main>
      <h1>ensureStatic = prefetch</h1>
      <p id="shell-content">Static page shell</p>
      <Suspense fallback={<p id="cookie-fallback">Loading cookie…</p>}>
        <CookieContent />
      </Suspense>
    </main>
  );
}
