// This page opts itself out so the build advances past it. The point is what
// happens next: the build then fails on the synthetic `/_not-found` route,
// which has no user file — even though the real cause is the root layout's
// `cookies()` call.
export const instant = false;

export default function Page() {
  return (
    <main>
      <h1>Home</h1>
      <p>This page opts out. The build still fails on /_not-found.</p>
    </main>
  );
}
