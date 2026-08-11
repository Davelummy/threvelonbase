import { TrustMarquee } from "./components/brand/TrustMarquee";
import { AnnouncementBar, SiteHeader } from "./components/layout/SiteHeader";
import { Footer } from "./components/layout/Footer";
import { ScrollMotion } from "./components/motion/ScrollMotion";
import {
  AcademySection,
  BusinessSection,
  CommerceSection,
  ContactSection,
  FloatingWhatsApp,
  HeroSection,
  ProcessSection,
  RepairRequestSection,
  RepairsSection,
  ServicesSection,
  ValuesSection,
} from "./components/sections/HomeSections";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
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
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ScrollMotion />
    </>
  );
}
