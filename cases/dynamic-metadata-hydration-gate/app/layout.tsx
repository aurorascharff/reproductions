import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dynamic metadata hydration gate repro",
  description:
    "A client hydration gate hides the dynamic marker recommended for URL-dependent metadata.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.5,
          margin: "3rem auto",
          maxWidth: 760,
          padding: "0 1rem",
        }}
      >
        {children}
      </body>
    </html>
  );
}
