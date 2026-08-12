import { AtSign, Clock3, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { business } from "../../data/business";
import { navItems, rootedSectionHref } from "../../data/content";
import { NewTabHint, withNewTabLabel } from "../a11y/NewTabHint";
import { Wordmark } from "../brand/Wordmark";

const addressLine = [
  business.address.shop,
  business.address.complex,
  business.address.street,
  business.address.locality,
  business.address.region,
].join(", ");

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="shell footer-shell">
        <div className="footer-top">
          <div className="footer-brand">
            <Link className="footer-wordmark" href="/#top" aria-label="Threvelonbase home">
              <Wordmark reversed compact />
            </Link>
            <p className="footer-tagline">{business.tagline}</p>
            <p className="footer-blurb">
              Electronics repairs, devices and practical technical training from Shop 12A,
              Cash Hold Shopping Complex, Akure.
            </p>
            <div className="footer-hours">
              <Clock3 aria-hidden="true" size={16} />
              <div>
                <strong>Workshop hours</strong>
                <span>
                  {business.hours.days} · {business.hours.display}
                </span>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <strong className="footer-heading">Explore</strong>
            <nav className="footer-links" aria-label="Footer navigation">
              {navItems.map(([label, href]) => (
                <Link href={rootedSectionHref(href)} key={href}>
                  {label}
                </Link>
              ))}
              <Link href="/#repair-request">Start a repair</Link>
            </nav>
          </div>

          <div className="footer-col">
            <strong className="footer-heading">Contact</strong>
            <div className="footer-links footer-contact">
              {business.phones.map((phone) => (
                <a href={phone.href} key={phone.href}>
                  <Phone aria-hidden="true" size={15} />
                  <span>{phone.display}</span>
                </a>
              ))}
              <a href={`mailto:${business.email}`}>
                <Mail aria-hidden="true" size={15} />
                <span>{business.email}</span>
              </a>
              <a
                href={business.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label={withNewTabLabel("Threvelonbase on Instagram")}
              >
                <AtSign aria-hidden="true" size={15} />
                <span>@threvelonbase</span>
                <NewTabHint />
              </a>
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={withNewTabLabel("Open workshop location in Maps")}
              >
                <MapPin aria-hidden="true" size={15} />
                <span>{addressLine}</span>
                <NewTabHint />
              </a>
            </div>
          </div>

          <div className="footer-map-col">
            <div className="footer-map-head">
              <strong className="footer-heading">Find the workshop</strong>
              <a
                className="footer-map-open"
                href={business.mapsUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={withNewTabLabel("Open workshop location in Maps")}
              >
                Open in Maps
                <NewTabHint />
              </a>
            </div>
            <div className="footer-map">
              <iframe
                title="Map of Threvelonbase workshop in Akure"
                src={business.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                className="footer-map-pin"
                href={business.mapsUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={withNewTabLabel("Open workshop location in Maps")}
              >
                <MapPin aria-hidden="true" size={14} />
                Shop 12A · Arakale Road
                <NewTabHint />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <span>© {new Date().getFullYear()} Threvelonbase</span>
            <p className="footer-privacy">
              Enquiries open as WhatsApp drafts on your device. This website does not keep a customer account or store repair form submissions.{" "}
              <Link href="/privacy">Privacy</Link>
            </p>
          </div>
          <span className="footer-values">
            Performance · Precision · Professionalism · Godliness
          </span>
        </div>
      </div>
    </footer>
  );
}
