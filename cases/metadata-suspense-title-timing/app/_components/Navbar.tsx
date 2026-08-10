// Async Server Component with an artificial delay to force a Suspense hole.
export default async function Navbar() {
  const delayMs = 3000;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return (
    <nav data-testid="navbar" className="p-4 border-b">
      <span>Navbar (loaded after {delayMs}ms)</span>
    </nav>
  );
}
