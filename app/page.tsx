import { AnnouncementBar, SiteHeader } from "./components/layout/SiteHeader";
import { Footer } from "./components/layout/Footer";
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
    </>
  );
}
