import { navItems } from "../../data/content";
import { business } from "../../data/business";
import { Wordmark } from "../brand/Wordmark";

export function Footer() {
  return (
    <footer>
      <div className="shell footer-main">
        <div>
          <a className="footer-wordmark" href="#top" aria-label="Threvelonbase home">
            <Wordmark reversed />
          </a>
        </div>
        <div>
          <strong>Explore</strong>
          {navItems.slice(0, 4).map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </div>
        <div>
          <strong>Contact</strong>
          {business.phones.map((phone) => <a href={phone.href} key={phone.href}>{phone.display}</a>)}
          <a href={`mailto:${business.email}`}>{business.email}</a>
          <a href={business.instagram} target="_blank" rel="noreferrer">@Threvelonbase</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Threvelonbase</span>
        <span>Performance · Precision · Professionalism · Godliness</span>
      </div>
    </footer>
  );
}
