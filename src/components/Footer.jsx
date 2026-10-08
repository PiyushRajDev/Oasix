import React from 'react';
import logoImg from '../assets/logo.png';
import { trackEvent } from '../utils/analytics';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  const backToTop = (event) => {
    event.preventDefault();
    trackEvent('footer_scroll_top');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a href="#hero" onClick={backToTop} aria-label="OASIX home">
          <img src={logoImg} alt="OASIX" className="footer-logo" />
        </a>
        <p>Your social media, on autopilot.</p>
        <span>© {CURRENT_YEAR} OASIX.</span>
      </div>
    </footer>
  );
};
