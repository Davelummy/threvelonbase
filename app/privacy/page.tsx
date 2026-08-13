import type { Metadata } from "next";
import { absoluteSiteUrl, business, siteOrigin } from "../data/business";

const privacyUpdated = "12 August 2026";

const title = "Privacy";
const description =
  "How the Threvelonbase website handles enquiries, theme preference and third-party tools. This site does not store repair form submissions.";
const pageUrl = absoluteSiteUrl("/privacy");

export const metadata: Metadata = {
  title,
  description,
  ...(siteOrigin ? { alternates: { canonical: "/privacy" } } : {}),
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

export default function PrivacyPage() {
  return (
    <main id="main-content" className="info-page">
      <div className="shell info-shell">
        <p className="eyebrow"><span /> Privacy</p>
        <h1>How this website handles your information.</h1>
        <p className="info-lead">
          Last updated {privacyUpdated}. This notice describes the public Threvelonbase
          website only. It does not invent a customer account, payment system or
          stored repair database, because those do not exist here.
        </p>

        <div className="info-body">
          <h2>Who we are</h2>
          <p>
            Threvelonbase is an electronics repair workshop at {business.address.shop},{" "}
            {business.address.complex}, {business.address.street}, {business.address.locality},{" "}
            {business.address.region}, {business.address.country}. Contact{" "}
            <a href={business.phones[0].href}>{business.phones[0].display}</a>,{" "}
            <a href={business.phones[1].href}>{business.phones[1].display}</a>, or{" "}
            <a href={`mailto:${business.email}`}>{business.email}</a>. WhatsApp uses
            the same primary number.
          </p>

          <h2>What this website does</h2>
          <p>
            The site publishes workshop information and a repair request form. The
            form prepares a message on your device and opens WhatsApp so you can
            review it before sending.
          </p>

          <h2>What this website does not do</h2>
          <ul>
            <li>It does not create a customer account.</li>
            <li>It does not store repair form submissions in a website database.</li>
            <li>It does not collect online payment.</li>
            <li>It does not set first-party advertising cookies.</li>
            <li>The site code does not include an analytics or advertising tag.</li>
          </ul>

          <h2>Information you choose to send</h2>
          <p>
            If you send the WhatsApp draft, call, email or visit, you share what
            you choose through that channel. The workshop uses that information to
            respond and, if you agree, to carry out the work. This website does
            not receive the form contents unless you send the draft from your
            device.
          </p>

          <h2>Information stored on your device</h2>
          <p>
            If you use the theme control, the site stores <code>tb-theme</code> in
            your browser&apos;s local storage so light or dark mode can persist.
            That value stays on your device and is not sent to the workshop. You
            can clear it with the browser. A dragged WhatsApp button only stays
            moved until you reload the page.
          </p>

          <h2>Hosting</h2>
          <p>
            The website is hosted on Netlify. Like most hosts, it may process
            ordinary request logs such as IP address, browser type and the pages
            requested in order to serve and protect the site. There is no
            customer database on this website.
          </p>

          <h2>Third-party services</h2>
          <p>
            Some links and embeds are provided by other companies. They have
            their own privacy notices:
          </p>
          <ul>
            <li>WhatsApp, when you continue an enquiry from this site.</li>
            <li>Google Maps, when the workshop map embed loads.</li>
            <li>Instagram, if you open the shop profile link.</li>
          </ul>
          <p>
            We do not control cookies or logs those services may set when you use
            them.
          </p>

          <h2>Questions</h2>
          <p>
            If you have a question about this notice, use the contact details
            above or the WhatsApp path on the website.
          </p>
        </div>
      </div>
    </main>
  );
}
