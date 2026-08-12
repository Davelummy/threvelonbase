import type { Metadata } from "next";
import { TrustMarquee } from "./components/brand/TrustMarquee";
import { ScrollMotion } from "./components/motion/ScrollMotion";
import {
  AcademySection,
  BusinessSection,
  CommerceSection,
  ContactSection,
  HeroSection,
  ProcessSection,
  RepairRequestSection,
  RepairsSection,
  ServicesSection,
  ValuesSection,
} from "./components/sections/HomeSections";
import { FaqSection } from "./components/sections/FaqSection";
import { absoluteSiteUrl, siteOrigin } from "./data/business";
import { homepageDescription, homepageTitle } from "./data/content";

const homepageUrl = absoluteSiteUrl("/");

export const metadata: Metadata = {
  title: { absolute: homepageTitle },
  description: homepageDescription,
  ...(siteOrigin ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    ...(homepageUrl ? { url: homepageUrl } : {}),
  },
  twitter: {
    title: homepageTitle,
    description: homepageDescription,
  },
};

export default function Home() {
  return (
    <>
      <main id="main-content">
        <HeroSection />
        <TrustMarquee />
        <ServicesSection />
        <RepairsSection />
        <ProcessSection />
        <RepairRequestSection />
        <CommerceSection />
        <AcademySection />
        <BusinessSection />
        <ValuesSection />
        <FaqSection />
        <ContactSection />
      </main>
      <ScrollMotion />
    </>
  );
}
