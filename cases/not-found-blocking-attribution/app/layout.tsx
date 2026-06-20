import { cookies } from "next/headers";

// The root layout reads `cookies()` outside of <Suspense>.
// This is the ACTUAL blocking cause — but the build error will blame
// the synthetic `/_not-found` route, which renders through this layout
// and has no user file of its own.
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "light";

  return (
    <html lang="en" data-theme={theme}>
      <body>{children}</body>
    </html>
  );
}
