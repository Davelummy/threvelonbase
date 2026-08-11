import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Threvelonbase | Electronics Repairs, Devices & Training in Akure",
  description:
    "Professional repairs for phones, laptops and everyday electronics, plus new and used phones, accessories, repair training and business services in Akure.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
