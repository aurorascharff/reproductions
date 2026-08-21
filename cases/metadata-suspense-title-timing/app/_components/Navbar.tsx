import { headers } from "next/headers";

// Matches the reported app: a shared navbar reads the session from request
// headers and remains behind its own Suspense boundary.
export default async function Navbar() {
  const delayMs = 3000;
  await headers();
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return (
    <nav data-testid="navbar">
      <span>Navbar (loaded after {delayMs}ms)</span>
    </nav>
  );
}
