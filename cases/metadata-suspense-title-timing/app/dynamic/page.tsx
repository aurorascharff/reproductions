import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dynamic Page Static Title",
  description: "Description on a dynamic page",
};

export default function DynamicPage() {
  return (
    <main>
      <h1>Dynamic Page</h1>
      <p>This page and its metadata are static.</p>
      <Link href="/">Back home</Link>
    </main>
  );
}
