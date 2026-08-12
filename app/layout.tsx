import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
import { LocalBusinessJsonLd } from "./components/brand/LocalBusinessJsonLd";
import { Footer } from "./components/layout/Footer";
import { SiteHeader } from "./components/layout/SiteHeader";
import { FloatingWhatsApp } from "./components/sections/HomeSections";
import { themeBootstrapScript } from "./components/theme/ThemeToggle";
import { business, siteOrigin } from "./data/business";
import { homepageDescription, homepageTitle } from "./data/content";

const originMetadata: Metadata = siteOrigin
  ? {
      metadataBase: new URL(siteOrigin),
    }
  : {};

export const metadata: Metadata = {
  ...originMetadata,
  title: {
    default: homepageTitle,
    template: `%s | ${business.name}`,
  },
  description: homepageDescription,
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: business.name,
  },
  twitter: {
    card: "summary_large_image",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        <SiteHeader />
        {children}
        <Footer />
        <FloatingWhatsApp />
        <LocalBusinessJsonLd />
      </body>
    </html>
  );
}
