import React, { useEffect, useState } from 'react';
import logoImg from '../assets/logo.png';
import { trackEvent } from '../utils/analytics';

const LINKS = [
  { id: 'product', label: 'Product' },
  { id: 'how', label: 'How it works' },
  { id: 'why', label: 'Why OASIX' }
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (targetId, label = targetId) => {
    trackEvent('nav_click', { target: targetId, label });
    setMobileOpen(false);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a
          href="#hero"
          className="brand-link"
          aria-label="OASIX home"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img src={logoImg} alt="OASIX" className="brand-logo" />
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className="nav-link"
              onClick={() => scrollTo(link.id, link.label)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button type="button" className="nav-cta" onClick={() => scrollTo('access', 'Request access')}>
          Request access
        </button>

        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-nav-panel">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className="mobile-nav-link"
              onClick={() => scrollTo(link.id, link.label)}
            >
              {link.label}
            </button>
          ))}
          <button type="button" className="mobile-nav-link strong" onClick={() => scrollTo('access', 'Request access')}>
            Request access
          </button>
        </div>
      )}
    </header>
  );
};

