import { BrowserOnly } from "./browser-only";

export const unstable_ensureStatic = "navigation";

export default function Page() {
  return (
    <main>
      <h1>Blocking use(browser()) with instant = false</h1>
      <p>
        Browser-only content does not require a resume render. The parent layout
        opts out of instant navigation, so this should build successfully.
      </p>
      <BrowserOnly />
    </main>
  );
}
