import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WHO'S THE KILLER?",
  description: "A no-host social deduction party game for phones.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#18181b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
