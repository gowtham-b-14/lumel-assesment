import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hierarchical Table",
  description: "Hierarchical table with allocation and variance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
