export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 32,
          maxWidth: 640,
          fontFamily: "system-ui, sans-serif",
          color: "#111",
          background: "#fff",
        }}
      >
        {children}
      </body>
    </html>
  );
}
