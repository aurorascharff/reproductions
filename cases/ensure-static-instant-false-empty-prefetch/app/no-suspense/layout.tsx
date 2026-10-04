import type { ReactNode } from "react";
import { CartButton } from "../ui/cart";

export const ensureStatic = "shell";
// Without this, `next build` fails with blocking-prerender-dynamic.
export const instant = false;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav>
        <span>Store nav (no Suspense)</span>
        <CartButton />
      </nav>
      <main>{children}</main>
    </>
  );
}
