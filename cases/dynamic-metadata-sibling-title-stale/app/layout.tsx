import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Dynamic metadata repro",
    template: "%s · Dynamic metadata repro",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", padding: 32 }}>{children}</body>
    </html>
  );
}
