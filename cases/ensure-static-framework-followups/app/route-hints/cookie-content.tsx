import { cookies } from "next/headers";

export async function CookieContent() {
  const value = (await cookies()).get("route-hint")?.value ?? "missing";
  return <p id="cookie-content">Cookie value: {value}</p>;
}
