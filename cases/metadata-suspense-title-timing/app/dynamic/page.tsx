// Same page content but opts into dynamic rendering by reading headers().
// Static metadata is still declared on this page.
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Dynamic Page Static Title",
  description: "Description on a dynamic page",
};

export default async function DynamicPage() {
  const h = await headers();
  return (
    <main className="p-8">
      <h1>Dynamic Page</h1>
      <p>User-Agent: {h.get("user-agent")}</p>
    </main>
  );
}
