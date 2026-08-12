import type { Metadata } from "next";
import { FaqJsonLd, FaqSection } from "../components/sections/FaqSection";
import { absoluteSiteUrl, siteOrigin } from "../data/business";

const title = "Frequently asked questions";
const description =
  "Answers about Threvelonbase repairs, workshop hours, WhatsApp enquiries, phones, training and what this website does with your details.";
const pageUrl = absoluteSiteUrl("/faq");

export const metadata: Metadata = {
  title,
  description,
  ...(siteOrigin ? { alternates: { canonical: "/faq" } } : {}),
  openGraph: {
    title: `${title} | Threvelonbase`,
    description,
    ...(pageUrl ? { url: pageUrl } : {}),
  },
  twitter: {
    title: `${title} | Threvelonbase`,
    description,
  },
};

export default function FaqPage() {
  return (
    <main id="main-content">
      <FaqSection heading="h1" animate={false} />
      <FaqJsonLd />
    </main>
  );
}
