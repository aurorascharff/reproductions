import { Suspense, type ReactNode } from "react";
import { CartButton } from "../ui/cart";

export const ensureStatic = "shell";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav>
        <span>Store nav (with Suspense)</span>
        <Suspense fallback={<CartButton count={0} />}>
          <CartButton />
        </Suspense>
      </nav>
      <main>{children}</main>
    </>
  );
}
