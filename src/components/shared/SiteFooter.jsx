import React from 'react';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="site-footer rich-footer">
      <div>
        <Link className="brand" to="/"><span className="brand-star">✦</span> careerfolio</Link>
        <p>Your work, in its best light.</p>
      </div>
      <div className="footer-links">
        <div>
          <b>Product</b>
          <Link to="/templates">Templates</Link>
          <Link to="/features">Features</Link>
          <Link to="/pricing">Pricing</Link>
        </div>
        <div>
          <b>Learn</b>
          <Link to="/resources">Resources</Link>
          <Link to="/help">Help centre</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <b>Company</b>
          <Link to="/about">Our story</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
      <span>© 2026 Careerfolio</span>
    </footer>
  );
}
