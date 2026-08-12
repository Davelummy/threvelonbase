import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Clock3,
  Cpu,
  Headphones,
  Laptop,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { business } from "../../data/business";
import type { EnquiryCategory } from "../../data/content";
import { repairTypes, serviceCards } from "../../data/content";
import { enquiryWhatsappHref, whatsappHref } from "../../../lib/whatsapp";
import { NewTabHint, withNewTabLabel } from "../a11y/NewTabHint";
import { WhatsAppIcon } from "../brand/WhatsAppIcon";
import { RepairForm } from "../forms/RepairForm";

const iconMap = {
  wrench: Wrench,
  smartphone: Smartphone,
  headphones: Headphones,
  book: BookOpen,
  briefcase: BriefcaseBusiness,
} as const;

function enquiryLink(href: string) {
  if (!href.startsWith("whatsapp:")) return href;
  const category = href.replace("whatsapp:", "") as Exclude<EnquiryCategory, "repair">;
  return enquiryWhatsappHref(category);
}

export function HeroSection() {
  return (
    <section className="hero" id="top">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow gs-hidden" data-gs="hero"><span /> {business.tagline}</p>
          <h1 className="gs-hidden" data-gs="hero">Expert repairs for phones, laptops & everyday electronics</h1>
          <p className="hero-lead gs-hidden" data-gs="hero">Professional hardware and software repairs, quality phones and accessories, and practical technical training in Akure.</p>
          <div className="hero-actions gs-hidden" data-gs="hero">
            <a className="button button-primary" href="#repair-request">Start a repair <ArrowRight aria-hidden="true" size={18} /></a>
            <a className="hero-secondary-link" href="#services">Explore our services</a>
          </div>
          <div className="trust-row gs-hidden" data-gs="hero">
            <div><span className="trust-icon"><ShieldCheck aria-hidden="true" /></span><p><strong>Since {business.established}</strong><small>Hands-on repair experience</small></p></div>
            <div><span className="trust-icon"><MapPin aria-hidden="true" /></span><p><strong>{business.address.shop}, Akure</strong><small>{business.address.complex}</small></p></div>
          </div>
        </div>
        <div className="hero-visual gs-hidden" data-gs="hero">
          <div className="diagnostic-line" aria-hidden="true" />
          <Image
            className="hero-photo"
            src="/images/threvelonbase-repair-hero.webp"
            alt="An electronics technician carrying out a precision smartphone repair"
            width={1200}
            height={900}
            sizes="(max-width: 820px) 100vw, (max-width: 1200px) 55vw, 640px"
            preload
          />
          <div className="visual-chip"><Cpu aria-hidden="true" size={18} /> Precision diagnostics</div>
          <div className="hero-note"><Sparkles aria-hidden="true" size={18} /><span>Hardware + software expertise</span></div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section className="service-intro section" id="services">
      <div className="shell">
        <div className="section-heading split-heading gs-hidden" data-gs="fade-up">
          <div><p className="eyebrow"><span /> What we do</p><h2>One trusted place for devices, skills and support.</h2></div>
          <p>Repairs come first. Every other service builds on the same focus: practical expertise, clear guidance and professional care.</p>
        </div>
        <div className="services-grid gs-hidden" data-gs="stagger">
          {serviceCards.map((service, index) => {
            const Icon = iconMap[service.icon];
            const external = service.href.startsWith("whatsapp:");
            const featured = index === 0;
            return (
              <a
                className={`service-card ${featured ? "service-card-featured" : "service-card-compact"}`}
                href={enquiryLink(service.href)}
                key={service.number}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                aria-label={external ? withNewTabLabel(`${service.action}: ${service.title}`) : undefined}
              >
                {featured ? (
                  <span className="service-featured-media" aria-hidden="true">
                    <Image
                      src="/images/threvelonbase-repair-featured.webp"
                      alt=""
                      width={720}
                      height={540}
                      sizes="(max-width: 820px) 100vw, 40vw"
                    />
                  </span>
                ) : null}
                <span className="service-card-body">
                  <span className="service-icon"><Icon aria-hidden="true" size={featured ? 22 : 18} /></span>
                  <h3>{service.title}</h3>
                  <p>{service.copy}</p>
                  <span className="card-link">
                    {service.action} <ChevronRight aria-hidden="true" size={17} />
                    {external ? <NewTabHint /> : null}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function RepairsSection() {
  return (
    <section className="repairs section" id="repairs">
      <div className="shell repair-grid">
        <div className="repair-copy gs-hidden" data-gs="fade-left">
          <p className="eyebrow light"><span /> Repair expertise</p>
          <h2>From a five-minute fix to complex board work.</h2>
          <p>Every job starts with diagnosis. The cost and estimated repair time depend on the fault, the required part and the work involved.</p>
          <div className="repair-device-list">
            <span><Smartphone aria-hidden="true" /> Phones & tablets</span><span><Laptop aria-hidden="true" /> Laptops</span><span><Headphones aria-hidden="true" /> Audio devices</span><span><BatteryCharging aria-hidden="true" /> Power banks</span>
          </div>
          <a className="text-link" href="#repair-request">Tell us what is wrong <ArrowRight aria-hidden="true" size={17} /></a>
        </div>
        <div className="repair-list gs-hidden" data-gs="fade-right">
          {repairTypes.map((repair, index) => <div key={repair}><span>{String(index + 1).padStart(2, "0")}</span><p>{repair}</p><Check aria-hidden="true" size={18} /></div>)}
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="process section">
      <div className="shell">
        <div className="section-heading centered-heading gs-hidden" data-gs="fade-up">
          <p className="eyebrow"><span /> How it works</p>
          <h2>A clearer way to start your repair.</h2>
          <p className="section-lead">
            The website collects a short repair brief, then opens WhatsApp so you can review the message and continue with the workshop.
          </p>
        </div>
        <div className="process-grid gs-hidden" data-gs="stagger">
          <article><span>01</span><MessageCircle aria-hidden="true" /><h3>Describe the fault</h3><p>Share the device and problem through our short request form on this page.</p></article>
          <article><span>02</span><Cpu aria-hidden="true" /><h3>Continue on WhatsApp</h3><p>Your details are placed in a WhatsApp draft you can edit before sending. Photos or videos can be attached after WhatsApp opens.</p></article>
          <article><span>03</span><BadgeCheck aria-hidden="true" /><h3>Approve before work starts</h3><p>The workshop diagnoses the device and explains the required work. Work begins only after you agree the price, deposit and expected timing.</p></article>
        </div>
      </div>
    </section>
  );
}

export function RepairRequestSection() {
  return (
    <section className="request-section section" id="repair-request">
      <div className="shell request-grid">
        <div className="request-copy gs-hidden" data-gs="fade-left">
          <p className="eyebrow light"><span /> Repair request</p><h2>Tell us about your device.</h2>
          <p>Complete the essentials and continue on WhatsApp. A technician will review your message and guide you on the next step.</p>
          <ul>
            <li><Check aria-hidden="true" /> No online payment is collected on this website</li>
            <li><Check aria-hidden="true" /> Form details open as a WhatsApp draft you control before sending</li>
            <li><Check aria-hidden="true" /> You approve the price before work begins</li>
            <li><Check aria-hidden="true" /> Repair timing is confirmed after diagnosis</li>
          </ul>
          <p className="request-privacy">
            This page does not store repair form submissions in a website account or database. Continuing hands your reviewed message to WhatsApp on your device.
          </p>
        </div>
        <div className="gs-hidden" data-gs="fade-right">
          <RepairForm />
        </div>
      </div>
    </section>
  );
}

export function CommerceSection() {
  return (
    <section className="commerce section" id="devices">
      <div className="shell commerce-grid gs-hidden" data-gs="stagger">
        <article className="commerce-feature devices-card">
          <div className="commerce-icon"><MonitorSmartphone aria-hidden="true" /></div>
          <p className="eyebrow"><span /> Devices</p>
          <h2>Looking for a new or used phone?</h2>
          <p>Ask what is currently available and speak directly with the team before making a purchase decision. Choose the path that matches what you want so the workshop knows whether to discuss a new or used device.</p>
          <div className="commerce-actions">
            <a
              className="button button-dark"
              target="_blank"
              rel="noreferrer"
              href={enquiryWhatsappHref("phones")}
              aria-label={withNewTabLabel("Ask about a new phone on WhatsApp")}
            >
              Ask about a new phone <ArrowRight aria-hidden="true" size={18} />
              <NewTabHint />
            </a>
            <a
              className="button button-secondary"
              target="_blank"
              rel="noreferrer"
              href={enquiryWhatsappHref("usedPhones")}
              aria-label={withNewTabLabel("Ask about a used phone on WhatsApp")}
            >
              Ask about a used phone <ArrowRight aria-hidden="true" size={18} />
              <NewTabHint />
            </a>
          </div>
        </article>
        <article className="commerce-feature accessories-card">
          <div className="commerce-icon"><ShoppingBag aria-hidden="true" /></div>
          <p className="eyebrow"><span /> Accessories</p>
          <h2>Everyday essentials for your devices.</h2>
          <p>Ask about chargers, cables, batteries, cases, screen protection, audio accessories and laptop add-ons.</p>
          <a
            className="button button-secondary"
            target="_blank"
            rel="noreferrer"
            href={enquiryWhatsappHref("accessories")}
            aria-label={withNewTabLabel("Ask about an accessory on WhatsApp")}
          >
            Ask about an accessory <ArrowRight aria-hidden="true" size={18} />
            <NewTabHint />
          </a>
        </article>
      </div>
    </section>
  );
}

export function AcademySection() {
  return (
    <section className="academy section" id="academy">
      <div className="shell academy-grid">
        <div className="academy-art gs-hidden" data-gs="scale">
          <Image
            className="academy-photo"
            src="/images/threvelonbase-academy-hands-on.webp"
            alt="A mentor guiding a trainee through hands-on smartphone board repair at the workshop bench"
            width={900}
            height={1200}
            sizes="(max-width: 820px) 100vw, 45vw"
            loading="lazy"
          />
          <span className="academy-kicker">PRACTICAL LEARNING</span>
          <div className="academy-stat">
            <strong>Hands-on</strong>
            <span>repair training & mentorship</span>
          </div>
        </div>
        <div className="academy-copy gs-hidden" data-gs="fade-right">
          <p className="eyebrow light"><span /> Threvelonbase Academy</p><h2>Learn the repair skill—and the discipline behind it.</h2>
          <p>The training programme combines supervised mobile-phone repair practice with customer service, business ethics, punctuality and professional conduct.</p>
          <div className="academy-points"><span><Check aria-hidden="true" /> Hardware and software diagnosis</span><span><Check aria-hidden="true" /> Android and iOS troubleshooting</span><span><Check aria-hidden="true" /> Real workshop experience</span><span><Check aria-hidden="true" /> Mentorship and business ethics</span></div>
          <a
            className="button button-primary"
            target="_blank"
            rel="noreferrer"
            href={enquiryWhatsappHref("training")}
            aria-label={withNewTabLabel("Ask about training or apprenticeship on WhatsApp")}
          >
            Ask about the academy <ArrowRight aria-hidden="true" size={18} />
            <NewTabHint />
          </a>
        </div>
      </div>
    </section>
  );
}

export function BusinessSection() {
  return (
    <section className="business section" id="business">
      <div className="shell">
        <div className="section-heading split-heading gs-hidden" data-gs="fade-up">
          <div>
            <p className="eyebrow"><span /> Business & institutional</p>
            <h2>Practical support beyond the workshop.</h2>
          </div>
          <p>Project-based services for entrepreneurs, organisations and training programmes, shown according to their current stage. Choose the enquiry that matches your project so the team receives the right context.</p>
        </div>
        <div className="business-grid gs-hidden" data-gs="stagger">
          <article>
            <span className="status active">Active</span>
            <Wrench aria-hidden="true" />
            <h3>Repair-business setup</h3>
            <p>Project-based setup and guidance for entrepreneurs building a repair operation.</p>
            <a
              className="text-link business-enquiry"
              target="_blank"
              rel="noreferrer"
              href={enquiryWhatsappHref("repairBusinessSetup")}
              aria-label={withNewTabLabel("Discuss repair-business setup on WhatsApp")}
            >
              Discuss repair-business setup <ArrowRight aria-hidden="true" size={16} />
              <NewTabHint />
            </a>
          </article>
          <article>
            <span className="status active">Active & developing</span>
            <BookOpen aria-hidden="true" />
            <h3>Institutional training</h3>
            <p>On-site skills training and mentorship for organised programmes and groups.</p>
            <a
              className="text-link business-enquiry"
              target="_blank"
              rel="noreferrer"
              href={enquiryWhatsappHref("institutionalTraining")}
              aria-label={withNewTabLabel("Discuss institutional training on WhatsApp")}
            >
              Discuss institutional training <ArrowRight aria-hidden="true" size={16} />
              <NewTabHint />
            </a>
          </article>
          <article>
            <span className="status emerging">Emerging</span>
            <BriefcaseBusiness aria-hidden="true" />
            <h3>Business consultancy</h3>
            <p>Practical guidance currently provided informally and being structured as a formal service.</p>
            <a
              className="text-link business-enquiry"
              target="_blank"
              rel="noreferrer"
              href={enquiryWhatsappHref("consultancy")}
              aria-label={withNewTabLabel("Discuss business consultancy on WhatsApp")}
            >
              Discuss business consultancy <ArrowRight aria-hidden="true" size={16} />
              <NewTabHint />
            </a>
          </article>
          <article>
            <span className="status planned">Planned</span>
            <Zap aria-hidden="true" />
            <h3>Equipment importation</h3>
            <p>A future line focused on improving access to repair tools and equipment. Not open for booking yet.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export function ValuesSection() {
  const values = ["Performance", "Precision", "Professionalism", "Godliness"];
  return (
    <section className="values section" id="about">
      <div className="shell values-grid">
        <div className="values-copy gs-hidden" data-gs="fade-left">
          <p className="eyebrow light"><span /> How we work</p>
          <h2>Technical care shaped by clear values.</h2>
          <p>Threvelonbase began in Akure in 2020 and continues to grow around practical problem-solving, training and long-term customer trust.</p>
        </div>
        <div className="value-list gs-hidden" data-gs="stagger">
          {values.map((value, index) => (
            <div key={value}><span>0{index + 1}</span><strong>{value}</strong></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section className="contact section">
      <div className="shell contact-grid">
        <div className="gs-hidden" data-gs="fade-up">
          <p className="eyebrow"><span /> Visit or contact us</p>
          <h2>Bring the device. Let&apos;s find the fault.</h2>
          <p className="contact-lead">For the fastest response, send a WhatsApp message or call during business hours.</p>
        </div>
        <div className="contact-details gs-hidden" data-gs="stagger">
          <a
            href={business.mapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={withNewTabLabel("Open workshop location in Maps")}
          >
            <MapPin aria-hidden="true" />
            <address>
              <strong>Workshop</strong>
              {business.address.shop}, {business.address.complex},
              <br />
              {business.address.street}, {business.address.locality}, {business.address.region}
            </address>
            <NewTabHint />
          </a>
          <a href={business.phones[0].href}><Phone aria-hidden="true" /><span><strong>Call us</strong>{business.phones[0].display}</span></a>
          <a href={business.phones[1].href}><Phone aria-hidden="true" /><span><strong>Alternative line</strong>{business.phones[1].display}</span></a>
          <div><Clock3 aria-hidden="true" /><span><strong>Business hours</strong><time dateTime="Mo-Sa 08:00-18:00">{business.hours.days}<br />{business.hours.display}</time></span></div>
        </div>
        <a
          className="contact-whatsapp gs-hidden"
          data-gs="fade-up"
          target="_blank"
          rel="noreferrer"
          href={whatsappHref("Hello Threvelonbase, I would like to make an enquiry about a repair, phone, accessory, training, or business service.")}
          aria-label={withNewTabLabel("Chat on WhatsApp")}
        >
          <WhatsAppIcon size={27} />
          <span><strong>Chat on WhatsApp</strong>Usually the fastest way to reach us</span>
          <ArrowRight aria-hidden="true" />
          <NewTabHint />
        </a>
      </div>
    </section>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      className="floating-whatsapp"
      target="_blank"
      rel="noreferrer"
      aria-label={withNewTabLabel("Chat with Threvelonbase on WhatsApp")}
      href={whatsappHref("Hello Threvelonbase, I would like to make an enquiry.")}
    >
      <span className="floating-whatsapp-glass" aria-hidden="true" />
      <WhatsAppIcon size={28} className="floating-whatsapp-icon" />
      <NewTabHint />
    </a>
  );
}
