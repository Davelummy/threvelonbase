"use client";

import { Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { business } from "../../data/business";
import { navItems } from "../../data/content";
import { Wordmark } from "../brand/Wordmark";
import { ThemeToggle } from "../theme/ThemeToggle";

export function AnnouncementBar() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="announcement">
        <div className="shell announcement-inner">
          <span><i /> Repair workshop open Monday-Saturday, 8:00 AM-6:00 PM</span>
          <a href={business.phones[0].href}><Phone aria-hidden="true" size={14} /> {business.phones[0].display}</a>
        </div>
      </div>
    </>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileNav, setIsMobileNav] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 820px)");
    const updateMobileNav = () => setIsMobileNav(mediaQuery.matches);

    updateMobileNav();
    mediaQuery.addEventListener("change", updateMobileNav);
    return () => mediaQuery.removeEventListener("change", updateMobileNav);
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen && isMobileNav) {
      navRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileNav, menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="wordmark-link" href="#top" aria-label="Threvelonbase home">
          <Wordmark compact />
        </a>

        <nav
          ref={navRef}
          id="primary-navigation"
          className={menuOpen ? "nav-open" : ""}
          aria-label="Primary navigation"
          aria-hidden={isMobileNav ? !menuOpen : undefined}
        >
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={closeMenu}>{label}</a>
          ))}
          <a className="nav-cta" href="#repair-request" onClick={closeMenu}>Start a repair</a>
          <ThemeToggle className="theme-toggle-nav" />
        </nav>

        <div className="header-actions">
          <ThemeToggle className="theme-toggle-bar" />
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
      </div>
    </header>
  );
}
