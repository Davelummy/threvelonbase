"use client";

import { FormEvent, useState } from "react";
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
  Menu,
  MessageCircle,
  MonitorSmartphone,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Wrench,
  X,
  Zap,
} from "lucide-react";

const WHATSAPP_NUMBER = "2348037722368";
const PHONE_NUMBER = "+2348037722368";

const navItems = [
  ["Services", "#services"],
  ["Repairs", "#repairs"],
  ["Academy", "#academy"],
  ["Business solutions", "#business"],
  ["About", "#about"],
];

const repairTypes = [
  "Screen and touch repairs",
  "Charging ports and batteries",
  "Liquid damage recovery",
  "Board-level and microsoldering",
  "Software, flashing and formatting",
  "Speakers, cameras and buttons",
  "Network and signal issues",
  "General diagnostics",
];

const serviceCards = [
  {
    number: "01",
    title: "Electronics repairs",
    copy: "Phones, laptops, power banks, MP3 players, Bluetooth devices, speakers and other everyday electronics.",
    icon: Wrench,
    href: "#repairs",
  },
  {
    number: "02",
    title: "New & used phones",
    copy: "Ask about currently available devices and get direct guidance before you buy.",
    icon: Smartphone,
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Threvelonbase, I want to check the new and used phones currently available.")}`,
  },
  {
    number: "03",
    title: "Accessories",
    copy: "Phone and laptop accessories, charging essentials, audio devices and everyday add-ons.",
    icon: Headphones,
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Threvelonbase, I want to ask about an accessory.")}`,
  },
  {
    number: "04",
    title: "Training & apprenticeship",
    copy: "Hands-on repair training, mentorship and professional discipline for aspiring technicians.",
    icon: BookOpen,
    href: "#academy",
  },
  {
    number: "05",
    title: "Business services",
    copy: "Repair-site setup, institutional training and practical consultancy for organisations and entrepreneurs.",
    icon: BriefcaseBusiness,
    href: "#business",
  },
];

function whatsappHref(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    device: "Phone",
    issue: "Screen or touch issue",
    details: "",
  });

  function submitRepair(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      "Hello Threvelonbase, I would like to request a repair.",
      "",
      `Name: ${form.name}`,
      `Phone number: ${form.phone}`,
      `Device: ${form.device}`,
      `Issue: ${form.issue}`,
      `More details: ${form.details || "Not provided"}`,
    ].join("\n");

    window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
  }

  return (
    <main>
      <div className="announcement">
        <div className="shell announcement-inner">
          <span><i /> Repair workshop open Monday-Saturday, 8:00 AM-6:00 PM</span>
          <a href={`tel:${PHONE_NUMBER}`}><Phone size={14} /> +234 803 772 2368</a>
        </div>
      </div>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="wordmark" href="#top" aria-label="Threvelonbase home">
            <span>THREVELONBASE</span><b aria-hidden="true" />
          </a>

          <nav className={menuOpen ? "nav-open" : ""} aria-label="Primary navigation">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <a className="nav-cta" href="#repair-request" onClick={() => setMenuOpen(false)}>
              Start a repair
            </a>
          </nav>

          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="shell hero-grid">
          <div className="hero-copy reveal">
            <p className="eyebrow"><span /> Technology Evolution and Revolution</p>
            <h1>Expert repairs for phones, laptops & everyday electronics</h1>
            <p className="hero-lead">
              Professional hardware and software repairs, quality phones and accessories,
              and practical technical training in Akure.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#repair-request">Start a repair <ArrowRight size={18} /></a>
              <a className="button button-secondary" href="#services">Explore our services</a>
            </div>
            <div className="trust-row">
              <div><span className="trust-icon"><ShieldCheck /></span><p><strong>Since 2020</strong><small>Hands-on repair experience</small></p></div>
              <div><span className="trust-icon"><MapPin /></span><p><strong>Shop 12A, Akure</strong><small>Cash Hold Shopping Complex</small></p></div>
            </div>
          </div>

          <div className="hero-visual reveal-delay">
            <div className="diagnostic-line" aria-hidden="true" />
            <Image
              src="/images/threvelonbase-repair-hero.png"
              alt="An electronics technician carrying out a precision smartphone repair"
              width={1448}
              height={1086}
              priority
            />
            <div className="visual-chip"><Cpu size={18} /> Precision diagnostics</div>
            <div className="hero-note"><Sparkles size={18} /><span>Hardware + software expertise</span></div>
          </div>
        </div>
      </section>

      <section className="service-intro section" id="services">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><p className="eyebrow"><span /> What we do</p><h2>One trusted place for devices, skills and support.</h2></div>
            <p>Repairs come first. Every other service builds on the same focus: practical expertise, clear guidance and professional care.</p>
          </div>
          <div className="services-grid">
            {serviceCards.map((service) => {
              const Icon = service.icon;
              const external = service.href.startsWith("http");
              return (
                <a className="service-card" href={service.href} key={service.number} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                  <span className="service-number">{service.number}</span>
                  <span className="service-icon"><Icon /></span>
                  <h3>{service.title}</h3>
                  <p>{service.copy}</p>
                  <span className="card-link">Learn more <ChevronRight size={17} /></span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="repairs section" id="repairs">
        <div className="shell repair-grid">
          <div className="repair-copy">
            <p className="eyebrow light"><span /> Repair expertise</p>
            <h2>From a five-minute fix to complex board work.</h2>
            <p>Every job starts with diagnosis. The cost and estimated repair time depend on the fault, the required part and the work involved.</p>
            <div className="repair-device-list">
              <span><Smartphone /> Phones & tablets</span>
              <span><Laptop /> Laptops</span>
              <span><Headphones /> Audio devices</span>
              <span><BatteryCharging /> Power banks</span>
            </div>
            <a className="text-link" href="#repair-request">Tell us what is wrong <ArrowRight size={17} /></a>
          </div>
          <div className="repair-list">
            {repairTypes.map((repair, index) => (
              <div key={repair}><span>{String(index + 1).padStart(2, "0")}</span><p>{repair}</p><Check size={18} /></div>
            ))}
          </div>
        </div>
      </section>

      <section className="process section">
        <div className="shell">
          <div className="section-heading centered-heading">
            <p className="eyebrow"><span /> How it works</p>
            <h2>A clearer way to start your repair.</h2>
          </div>
          <div className="process-grid">
            <article><span>01</span><MessageCircle /><h3>Describe the fault</h3><p>Share the device and problem through our short request form.</p></article>
            <article><span>02</span><Cpu /><h3>Get a diagnosis</h3><p>The workshop checks the device and explains the required work.</p></article>
            <article><span>03</span><BadgeCheck /><h3>Approve the repair</h3><p>Work begins after the price, deposit and expected timing are agreed.</p></article>
          </div>
        </div>
      </section>

      <section className="request-section section" id="repair-request">
        <div className="shell request-grid">
          <div className="request-copy">
            <p className="eyebrow light"><span /> Repair request</p>
            <h2>Tell us about your device.</h2>
            <p>Complete the essentials and continue on WhatsApp. A technician will review your message and guide you on the next step.</p>
            <ul>
              <li><Check /> No online payment is required here</li>
              <li><Check /> You approve the price before work begins</li>
              <li><Check /> Repair timing is confirmed after diagnosis</li>
            </ul>
          </div>
          <form className="repair-form" onSubmit={submitRepair}>
            <div className="field-row">
              <label>Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label>
              <label>Phone number<input required inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 0803 000 0000" /></label>
            </div>
            <div className="field-row">
              <label>Device type
                <select value={form.device} onChange={(e) => setForm({ ...form, device: e.target.value })}>
                  <option>Phone</option><option>Laptop</option><option>Tablet</option><option>Power bank</option><option>Bluetooth device</option><option>Speaker</option><option>MP3 player</option><option>Other electronic device</option>
                </select>
              </label>
              <label>Main issue
                <select value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })}>
                  <option>Screen or touch issue</option><option>Charging or battery issue</option><option>Liquid damage</option><option>Software issue</option><option>Audio or speaker issue</option><option>Network or signal issue</option><option>Device not powering on</option><option>Not sure - I need a diagnosis</option>
                </select>
              </label>
            </div>
            <label>What happened? <span>Optional</span>
              <textarea rows={4} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="Describe the fault, device model and anything already tried." />
            </label>
            <button className="button button-primary form-submit" type="submit">Continue on WhatsApp <MessageCircle size={18} /></button>
            <p className="form-note">Nothing is submitted until you review and send the message in WhatsApp.</p>
          </form>
        </div>
      </section>

      <section className="commerce section">
        <div className="shell commerce-grid">
          <article className="commerce-feature devices-card">
            <div className="commerce-icon"><MonitorSmartphone /></div>
            <p className="eyebrow"><span /> Devices</p>
            <h2>Looking for a new or used phone?</h2>
            <p>Ask what is currently available and speak directly with the team before making a purchase decision.</p>
            <a className="button button-dark" target="_blank" rel="noreferrer" href={whatsappHref("Hello Threvelonbase, I want to check the new and used phones currently available.")}>Check available phones <ArrowRight size={18} /></a>
          </article>
          <article className="commerce-feature accessories-card">
            <div className="commerce-icon"><ShoppingBag /></div>
            <p className="eyebrow"><span /> Accessories</p>
            <h2>Everyday essentials for your devices.</h2>
            <p>Ask about chargers, cables, batteries, cases, screen protection, audio accessories and laptop add-ons.</p>
            <a className="button button-secondary" target="_blank" rel="noreferrer" href={whatsappHref("Hello Threvelonbase, I want to ask about an accessory.")}>Ask about an accessory <ArrowRight size={18} /></a>
          </article>
        </div>
      </section>

      <section className="academy section" id="academy">
        <div className="shell academy-grid">
          <div className="academy-art">
            <span className="academy-kicker">PRACTICAL LEARNING</span>
            <div className="academy-symbol"><BookOpen /></div>
            <div className="academy-stat"><strong>Hands-on</strong><span>repair training & mentorship</span></div>
          </div>
          <div className="academy-copy">
            <p className="eyebrow light"><span /> Threvelonbase Academy</p>
            <h2>Learn the repair skill—and the discipline behind it.</h2>
            <p>The training programme combines supervised mobile-phone repair practice with customer service, business ethics, punctuality and professional conduct.</p>
            <div className="academy-points">
              <span><Check /> Hardware and software diagnosis</span>
              <span><Check /> Android and iOS troubleshooting</span>
              <span><Check /> Real workshop experience</span>
              <span><Check /> Mentorship and business ethics</span>
            </div>
            <a className="button button-primary" target="_blank" rel="noreferrer" href={whatsappHref("Hello Threvelonbase, I would like information about the repair training and apprenticeship programme.")}>Ask about the academy <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      <section className="business section" id="business">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><p className="eyebrow"><span /> Business & institutional</p><h2>Practical support beyond the workshop.</h2></div>
            <p>Project-based services for entrepreneurs, organisations and training programmes, shown according to their current stage.</p>
          </div>
          <div className="business-grid">
            <article><span className="status active">Active</span><Wrench /><h3>Repair-business setup</h3><p>Project-based setup and guidance for entrepreneurs building a repair operation.</p></article>
            <article><span className="status active">Active & developing</span><BookOpen /><h3>Institutional training</h3><p>On-site skills training and mentorship for organised programmes and groups.</p></article>
            <article><span className="status emerging">Emerging</span><BriefcaseBusiness /><h3>Business consultancy</h3><p>Practical guidance currently provided informally and being structured as a formal service.</p></article>
            <article><span className="status planned">Planned</span><Zap /><h3>Equipment importation</h3><p>A future line focused on improving access to repair tools and equipment.</p></article>
          </div>
          <div className="business-cta"><p>Planning a repair business or institutional training programme?</p><a target="_blank" rel="noreferrer" href={whatsappHref("Hello Threvelonbase, I would like to discuss a business or institutional service.")}>Discuss your project <ArrowRight size={17} /></a></div>
        </div>
      </section>

      <section className="values section" id="about">
        <div className="shell values-grid">
          <div className="values-copy"><p className="eyebrow light"><span /> How we work</p><h2>Technical care shaped by clear values.</h2><p>Threvelonbase began in Akure in 2020 and continues to grow around practical problem-solving, training and long-term customer trust.</p></div>
          <div className="value-list">
            {["Performance", "Precision", "Professionalism", "Godliness"].map((value, index) => <div key={value}><span>0{index + 1}</span><strong>{value}</strong></div>)}
          </div>
        </div>
      </section>

      <section className="contact section">
        <div className="shell contact-grid">
          <div>
            <p className="eyebrow"><span /> Visit or contact us</p>
            <h2>Bring the device. Let&apos;s find the fault.</h2>
            <p className="contact-lead">For the fastest response, send a WhatsApp message or call during business hours.</p>
          </div>
          <div className="contact-details">
            <a href="https://maps.google.com/?q=Shop+12A+Cash+Hold+Shopping+Complex+Arakale+Road+Akure" target="_blank" rel="noreferrer"><MapPin /><span><strong>Workshop</strong>Shop 12A, Cash Hold Shopping Complex,<br />Arakale Road, Akure, Ondo State</span></a>
            <a href={`tel:${PHONE_NUMBER}`}><Phone /><span><strong>Call us</strong>+234 803 772 2368<br />+234 903 608 8295</span></a>
            <div><Clock3 /><span><strong>Business hours</strong>Monday-Saturday<br />8:00 AM-6:00 PM</span></div>
          </div>
          <a className="contact-whatsapp" target="_blank" rel="noreferrer" href={whatsappHref("Hello Threvelonbase, I would like to make an enquiry.")}><MessageCircle /><span><strong>Chat on WhatsApp</strong>Usually the fastest way to reach us</span><ArrowRight /></a>
        </div>
      </section>

      <footer>
        <div className="shell footer-main">
          <div><a className="wordmark footer-wordmark" href="#top"><span>THREVELONBASE</span><b /></a><p>Technology Evolution and Revolution.</p></div>
          <div><strong>Explore</strong>{navItems.slice(0, 4).map(([label, href]) => <a href={href} key={href}>{label}</a>)}</div>
          <div><strong>Contact</strong><a href={`tel:${PHONE_NUMBER}`}>+234 803 772 2368</a><a href="mailto:threvelonbase@gmail.com">threvelonbase@gmail.com</a><a href="https://instagram.com/threvelonbase" target="_blank" rel="noreferrer">@Threvelonbase</a></div>
        </div>
        <div className="shell footer-bottom"><span>© {new Date().getFullYear()} Threvelonbase</span><span>Performance · Precision · Professionalism · Godliness</span></div>
      </footer>

      <a className="floating-whatsapp" target="_blank" rel="noreferrer" aria-label="Chat with Threvelonbase on WhatsApp" href={whatsappHref("Hello Threvelonbase, I would like to make an enquiry.")}><MessageCircle /></a>
    </main>
  );
}
