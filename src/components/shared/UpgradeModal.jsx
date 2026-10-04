import React from 'react';
import { useAuth } from '../../hooks/useAuth.js';

export default function UpgradeModal({ onClose }) {
  const { user, upgradeToPro } = useAuth();

  function handleChoose(plan) {
    if (plan === 'pro') {
      upgradeToPro();
    }
    onClose();
  }

  return (
    <div className="upgrade-overlay" role="dialog" aria-modal="true" aria-label="Choose a Careerfolio plan">
      <section className="upgrade-modal">
        <button className="auth-close" onClick={onClose}>×</button>
        <p className="eyebrow">CAREERFOLIO PLANS</p>
        <h2>Turn your portfolio into a professional presence.</h2>
        <p className="upgrade-sub">Start free. Upgrade when your work needs more reach, more control and a stronger brand.</p>
        <div className="plan-grid">
          <article className="plan-card">
            <p>Free</p>
            <strong>₹0</strong>
            <span>For building your first portfolio.</span>
            <ul>
              <li>1 portfolio</li>
              <li>3 core templates</li>
              <li>Careerfolio subdomain</li>
              <li>Basic project blocks</li>
            </ul>
            <button className="button button-outline" onClick={() => handleChoose('free')}>
              {user?.plan === 'free' ? 'Current plan' : 'Switch to Free'}
            </button>
          </article>
          <article className="plan-card featured">
            <span className="plan-badge">MOST POPULAR</span>
            <p>Careerfolio Pro</p>
            <strong>₹199 <small>one-time</small></strong>
            <span>For people ready to be remembered.</span>
            <ul>
              <li>All 12 launch templates</li>
              <li>Remove Careerfolio branding</li>
              <li>Custom-domain setup request</li>
              <li>Portfolio analytics panel</li>
              <li>Multiple portfolios</li>
              <li>Priority support</li>
            </ul>
            <button className="button button-lime" onClick={() => handleChoose('pro')}>
              {user?.plan === 'pro' ? 'You are Pro ✦' : 'Choose Pro →'}
            </button>
          </article>
        </div>
        <p className="payment-note">Checkout is in preview mode. A live launch needs Razorpay or Stripe merchant credentials and a secure server-side order API.</p>
      </section>
    </div>
  );
}
