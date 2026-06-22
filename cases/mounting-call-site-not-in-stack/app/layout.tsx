import { AppSideBar } from "./_components/app-sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ display: "flex", margin: 0 }}>
        <AppSideBar />
        <main style={{ flex: 1, padding: 24 }}>{children}</main>
      </body>
    </html>
  );
}
