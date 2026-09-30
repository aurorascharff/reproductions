import { Suspense } from "react";
import { CookieContent } from "../cookie-content";

export const unstable_ensureStatic = false;

export default function Page() {
  return (
    <main>
      <h1>ensureStatic = false</h1>
      <p id="shell-content">Static page shell</p>
      <Suspense fallback={<p id="cookie-fallback">Loading cookie…</p>}>
        <CookieContent />
      </Suspense>
    </main>
  );
}
