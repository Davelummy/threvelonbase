"use client";

import { Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { business } from "../../data/business";
import { navItems } from "../../data/content";
import { Wordmark } from "../brand/Wordmark";

export function AnnouncementBar() {
  return (
    <div className="announcement">
      <div className="shell announcement-inner">
        <span><i /> Repair workshop open Monday-Saturday, 8:00 AM-6:00 PM</span>
        <a href={business.phones[0].href}><Phone size={14} /> {business.phones[0].display}</a>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="wordmark-link" href="#top" aria-label="Threvelonbase home">
          <Wordmark />
        </a>

        <nav
          id="primary-navigation"
          className={menuOpen ? "nav-open" : ""}
          aria-label="Primary navigation"
        >
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={closeMenu}>{label}</a>
          ))}
          <a className="nav-cta" href="#repair-request" onClick={closeMenu}>Start a repair</a>
        </nav>

        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
