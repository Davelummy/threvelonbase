import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
import { LocalBusinessJsonLd } from "./components/brand/LocalBusinessJsonLd";
import { themeBootstrapScript } from "./components/theme/ThemeToggle";
import { business, siteOrigin } from "./data/business";

const homepageTitle = `${business.name} | Electronics Repairs, Devices & Training in Akure`;
const homepageDescription =
  "Electronics repairs for phones, laptops and everyday devices in Akure, plus phones, accessories, repair training and business services.";
const homepageUrl = siteOrigin ? new URL("/", siteOrigin).toString() : undefined;
const originMetadata: Metadata = siteOrigin
  ? {
      metadataBase: new URL(siteOrigin),
      alternates: { canonical: "/" },
    }
  : {};

// The existing preview contract is useful outside production. Never expose
// its development marker in a production build or production request.
const previewMetadata =
  process.env.NODE_ENV === "production"
    ? {}
    : { other: { "codex-preview": "development" } };

export const metadata: Metadata = {
  ...originMetadata,
  ...previewMetadata,
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
    card: "summary",
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
