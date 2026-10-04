import { cookies } from "next/headers";

// Reads a request cookie, so it cannot be part of a static App Shell.
// The delay makes it obvious when a navigation waits for the cart.
export async function CartButton({ count }: { count?: number }) {
  if (count !== undefined) return <button>Cart ({count})</button>;
  const value = Number((await cookies()).get("cart-count")?.value ?? 0);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <button>Cart ({value})</button>;
}
