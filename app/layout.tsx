import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
import { LocalBusinessJsonLd } from "./components/brand/LocalBusinessJsonLd";
import { themeBootstrapScript } from "./components/theme/ThemeToggle";
import { absoluteSiteUrl, business, siteOrigin } from "./data/business";

const homepageTitle = `${business.name} | Electronics Repairs, Devices & Training in Akure`;
const homepageDescription =
  "Electronics repairs for phones, laptops and everyday devices in Akure, plus phones, accessories, repair training and business services.";
const homepageUrl = absoluteSiteUrl("/");
const originMetadata: Metadata = siteOrigin
  ? {
      metadataBase: new URL(siteOrigin),
      alternates: { canonical: "/" },
    }
  : {};

export const metadata: Metadata = {
  ...originMetadata,
  title: homepageTitle,
  description: homepageDescription,
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    type: "website",
    locale: "en_NG",
    siteName: business.name,
    ...(homepageUrl ? { url: homepageUrl } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: homepageTitle,
    description: homepageDescription,
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
        {children}
        <LocalBusinessJsonLd />
      </body>
    </html>
  );
}
