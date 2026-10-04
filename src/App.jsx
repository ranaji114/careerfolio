import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, usePortfolios } from './hooks/usePortfolioStore';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import BuilderPage from './pages/BuilderPage';
import PortfolioRenderer from './templates/PortfolioRenderer';
import { templates } from './data/templates';
import StandaloneWebsite from './pages/StandaloneWebsite';
import OnboardingQuizModal, { applyPersonaDefaults } from './components/shared/OnboardingQuizModal';
import TemplatesPage from './pages/TemplatesPage';
import FeaturesPage from './pages/FeaturesPage';
import LegalHubPage from './pages/LegalHubPage';
import AIPortfolioGeneratorModal from './components/shared/AIPortfolioGeneratorModal';
import RecruiterHUD from './components/shared/RecruiterHUD';
import { getInitialRoute, getPublicPortfolioUrl } from './utils/publicRouting';

// ─── Shared Header ────────────────────────────────────────────────────────────

function AppHeader({
  mode,
  user,
  onNavigate,
  onCreatePortfolio,
  onShowAuth,
  onLogout,
  onShowUpgrade,
  onOpenResume,
}) {
  return (
    <header className={mode === 'home' ? 'topbar topbar-home' : 'topbar'}>
      <button className="brand" onClick={() => onNavigate('home')}>
        <span className="brand-star">✦</span> careerfolio
      </button>

      <nav className="site-nav">
        <button
          className={mode === 'home' ? 'active' : ''}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        <button
          className={mode === 'templates' ? 'active' : ''}
          onClick={() => onNavigate('templates')}
        >
          Templates <span className="nav-tag-count">18+</span>
        </button>
        <button
          className={mode === 'features' ? 'active' : ''}
          onClick={() => onNavigate('features')}
        >
          Features
        </button>
        <button
          onClick={onOpenResume}
          className="nav-resume-pill"
          title="Open verified ATS single-page resume"
        >
          📄 Live ATS Resume ✦
        </button>
        <button
          className={mode === 'pricing' ? 'active' : ''}
          onClick={() => onNavigate('pricing')}
        >
          Pricing
        </button>
      </nav>

      <div className="top-actions">
        {user?.plan === 'free' && (
          <button className="pro-pill" onClick={onShowUpgrade}>
            Go Pro ✦
          </button>
        )}

        <button
          className="text-button"
          onClick={user ? () => onNavigate('dashboard') : onShowAuth}
        >
          {user ? 'My Workspace' : 'Sign in'}
        </button>

        {user && (
          <button className="text-button logout-button" onClick={onLogout}>
            Log out
          </button>
        )}

        <button className="button button-lime" onClick={onCreatePortfolio}>
          {user ? 'New Portfolio' : 'Start Free'} <span>→</span>
        </button>
      </div>
    </header>
  );
}

// ─── Shared Footer ────────────────────────────────────────────────────────────

function SiteFooter({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="cf-footer-v2">
      {/* Top Newsletter Strip */}
      <div className="cf-footer-top-strip">
        <div className="cf-footer-newsletter-wrap">
          <div className="cf-footer-newsletter-text">
            <span className="cf-footer-kicker">✦ STAY IN THE LOOP</span>
            <h3>Get notified on new templates & ATS resume tools.</h3>
            <p>No spam. Only high-craft portfolio design updates & engineering release notes.</p>
          </div>
          <form className="cf-footer-newsletter-form" onSubmit={handleSubscribe}>
            {subscribed ? (
              <div className="cf-footer-subscribed-msg">
                ✓ You're on the list! Thank you for subscribing.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="button button-lime">
                  Subscribe →
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main Grid */}
      <div className="cf-footer-grid">
        {/* Brand Column */}
        <div className="cf-footer-brand-col">
          <button className="brand" onClick={() => onNavigate('home')}>
            <span className="brand-star">✦</span> careerfolio
          </button>
          <p className="cf-footer-bio">
            The multi-page architectural portfolio & ATS resume platform designed for students,
            software engineers, designers, and creators.
          </p>
          <div className="cf-footer-social-row">
            <a href="https://github.com/ranaji114" target="_blank" rel="noopener noreferrer" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/ankur-rana-45b522312/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://ankur-rana.vercel.app" target="_blank" rel="noopener noreferrer" title="Creator Profile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </a>
          </div>
        </div>

        {/* Links Columns */}
        <div className="cf-footer-nav-col">
          <h4>Templates</h4>
          <ul>
            <li><button onClick={() => onNavigate('templates')}>Bento Matrix Pro</button></li>
            <li><button onClick={() => onNavigate('templates')}>Hacker CLI Terminal</button></li>
            <li><button onClick={() => onNavigate('templates')}>Obsidian Dark</button></li>
            <li><button onClick={() => onNavigate('templates')}>Swiss Luxury Haute</button></li>
            <li><button onClick={() => onNavigate('templates')}>Nordic Emerald Studio</button></li>
            <li><button onClick={() => onNavigate('templates')} style={{ color: '#38bdf8', fontWeight: 700 }}>Browse All 18+ Layouts →</button></li>
          </ul>
        </div>

        <div className="cf-footer-nav-col">
          <h4>Features</h4>
          <ul>
            <li><button onClick={() => onNavigate('features')}>1-Click AI Synthesis</button></li>
            <li><button onClick={() => onNavigate('features')}>Verified ATS Resume Studio</button></li>
            <li><button onClick={() => onNavigate('features')}>Recruiter Quick-Scan (⌘K)</button></li>
            <li><button onClick={() => onNavigate('features')}>Direct Computer Photo Upload</button></li>
            <li><button onClick={() => onNavigate('features')}>GitHub 1-Click Sync</button></li>
            <li><button onClick={() => onNavigate('features')}>True Multi-Page Routing</button></li>
          </ul>
        </div>

        <div className="cf-footer-nav-col">
          <h4>Pricing & Access</h4>
          <ul>
            <li><button onClick={() => onNavigate('pricing')}>Free Explorer (₹0)</button></li>
            <li><button onClick={() => onNavigate('pricing')}>Student Plus (₹99)</button></li>
            <li><button onClick={() => onNavigate('pricing')}>Ultimate Pro (₹199)</button></li>
            <li><button onClick={() => onNavigate('pricing')}>One-Time Lifetime Access</button></li>
          </ul>
        </div>

        <div className="cf-footer-nav-col">
          <h4>Trust & Legal</h4>
          <ul>
            <li><button onClick={() => onNavigate('privacy')}>Privacy Policy</button></li>
            <li><button onClick={() => onNavigate('terms')}>Terms of Service</button></li>
            <li><button onClick={() => onNavigate('security')}>Security & Sovereignty</button></li>
            <li><a href="https://github.com/ranaji114" target="_blank" rel="noopener noreferrer">Source Code ↗</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="cf-footer-bottom-bar">
        <div className="cf-footer-bottom-container">
          <div className="cf-footer-copy">
            <span>© 2026 Careerfolio. Built with React 19 & Vite.</span>
          </div>
          <div className="cf-footer-version-badge">
            <span className="cf-v-dot" />
            <span>v2.5.0 · Production Ready</span>
          </div>
          <div className="cf-footer-legal-links">
            <button onClick={() => onNavigate('privacy')}>Privacy</button>
            <button onClick={() => onNavigate('terms')}>Terms</button>
            <button onClick={() => onNavigate('security')}>Security</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Upgrade Modal ────────────────────────────────────────────────────────────

function UpgradeModal({ user, onClose, onChoose, onRequireAuth }) {
  const handleSelectTier = (planKey) => {
    if (!user) {
      onClose();
      onRequireAuth('Please sign in or create an account to activate your chosen plan.');
      return;
    }
    onChoose(planKey);
  };

  return (
    <div
      className="upgrade-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="upgrade-modal">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className="eyebrow" style={{ color: '#7AF844' }}>CAREERFOLIO MEMBERSHIP TIERS</p>
        <h2>Power your career with the right engineering presence.</h2>
        <p className="upgrade-sub">
          Simple, honest pricing. Upgrade once with a single one-time payment. No recurring monthly subscriptions.
        </p>

        <div className="plan-grid">
          {/* Tier 1: Free */}
          <article className="plan-card">
            <p style={{ color: '#94a3b8' }}>Free Explorer</p>
            <strong>₹0 <small>forever free</small></strong>
            <span>Essential tools to get your initial presence online.</span>
            <ul>
              <li>1 Live Multi-Page Portfolio</li>
              <li>6 Classic Portfolio Templates</li>
              <li>4 Basic ATS Resume Templates</li>
              <li>Live Resume Builder & PDF Export</li>
              <li>Direct Computer Photo Upload</li>
              <li>Careerfolio Watermark</li>
            </ul>
            <button
              className="button button-outline"
              style={{ width: '100%', borderColor: '#334155', color: '#f8fafc' }}
              onClick={() => handleSelectTier('free')}
            >
              {user?.plan === 'free' ? 'Current Plan ✓' : 'Start Free'}
            </button>
          </article>

          {/* Tier 2: Extended / Student Plus */}
          <article className="plan-card" style={{ background: '#081c0e', borderColor: '#44F86844' }}>
            <span className="plan-badge" style={{ background: '#44F868', color: '#091203' }}>
              POPULAR FOR STUDENTS 🎓
            </span>
            <p style={{ color: '#44F868' }}>Student & Creator Plus</p>
            <strong>₹99 <small>one-time / lifetime</small></strong>
            <span>More portfolios & full watermark removal.</span>
            <ul>
              <li><strong>Up to 3 Live Portfolios</strong></li>
              <li><strong>10 Portfolio Design Templates</strong></li>
              <li><strong>8 ATS Resume Formats</strong></li>
              <li>⚡ <strong>AI Bio & Section Writer</strong></li>
              <li><strong>Remove All Watermarks</strong></li>
              <li>GitHub & LinkedIn 1-Click Importer</li>
            </ul>
            <button
              className="button button-lime"
              style={{ width: '100%', background: '#44F868', color: '#091203', border: 'none', fontWeight: 800 }}
              onClick={() => handleSelectTier('starter')}
            >
              {user?.plan === 'starter' ? 'Current Plan ✓' : 'Choose Student Plus →'}
            </button>
          </article>

          {/* Tier 3: Ultimate Pro */}
          <article className="plan-card featured" style={{ background: '#0a1a09', borderColor: '#7AF844', boxShadow: '0 16px 40px rgba(122, 248, 68, 0.2)' }}>
            <span className="plan-badge" style={{ background: '#D4F844', color: '#0c1404' }}>MAX POWER & ALL ACCESS ⚡</span>
            <p style={{ color: '#7AF844' }}>Ultimate Pro All-Access</p>
            <strong>₹199 <small style={{ color: '#D4F844' }}>one-time / lifetime</small></strong>
            <span>Everything unlocked forever for maximum career leverage.</span>
            <ul>
              <li><strong>Unlimited Live Portfolios & Resumes</strong></li>
              <li><strong>All 18+ Animated Bespoke Pro Templates</strong></li>
              <li>⚡ <strong>Full 1-Click AI 4-Page Generator</strong></li>
              <li>⚡ <strong>Recruiter Quick-Scan HUD (⌘K)</strong></li>
              <li><strong>1-Click Instant Multi-Publishing</strong></li>
              <li>Remove All Careerfolio Branding</li>
              <li>Priority PDF & Custom Domain Readiness</li>
            </ul>
            <button
              className="button button-lime"
              style={{ width: '100%', background: '#7AF844', color: '#091203', fontWeight: 900 }}
              onClick={() => handleSelectTier('pro')}
            >
              {user?.plan === 'pro' ? 'You are Pro ✦' : 'Unlock Everything (Pro) →'}
            </button>
          </article>
        </div>

        <p className="payment-note">
          1-Click Instant Activation · Secure Local Verification · No Recurring Subscriptions
        </p>
      </section>
    </div>
  );
}

// ─── Home Page Component ──────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function HomePage({
  user,
  onCreatePortfolio,
  onRequireAuth,
  onUpgrade,
  onViewFeatured,
  onNavigate,
}) {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Do I need web development or coding skills to use Careerfolio?',
      a: 'Zero coding required! You can either use our 1-Click AI Generator (which synthesizes a full 4-page website from your raw notes) or customize your layout visually with direct computer photo upload.',
    },
    {
      q: 'Can college students and freshers with no formal job experience use this?',
      a: 'Yes, absolutely! We built dedicated student & fresher presets that format your coursework, semester projects, hackathon prototypes, and technical skills into professional engineering case studies and a verified 1-page ATS-compliant resume.',
    },
    {
      q: 'How does the Live ATS Resume Studio work?',
      a: 'Your resume automatically stays in sync with the projects, skills, and bio from your portfolio. It enforces single-page A4 bounds with zero duplicate pages and exports a clean vector PDF formatted specifically for Taleo, Workday, Lever, and Greenhouse.',
    },
    {
      q: 'What is the Recruiter Quick-Scan HUD (⌘K)?',
      a: 'Hiring managers spend an average of 6 seconds reviewing profiles. The HUD provides an instant 15-second overlay summary of your top shipped systems, core tech stack, and direct email/phone contact triggers accessible via keyboard shortcut ⌘K.',
    },
    {
      q: 'Where is my data stored? Is it safe?',
      a: 'Careerfolio operates on a private, local-first architecture. Your uploaded headshots, project notes, and portfolio drafts are saved directly in your browser without requiring external third-party ad tracking.',
    },
  ];

  return (
    <main className="home">
      {/* ── Section 1: Hero ── */}
      <motion.section
        className="hero"
        style={{ background: '#7AF844', position: 'relative', overflow: 'hidden' }}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div className="hero-copy" variants={staggerContainer}>
          <motion.p className="eyebrow" variants={fadeInUp}>
            <span /> FOR STUDENTS, DEVELOPERS & CREATORS
          </motion.p>
          <motion.h1 variants={fadeInUp}>
            Make your work<br />
            <em>impossible to miss.</em>
          </motion.h1>
          <motion.p className="hero-sub" variants={fadeInUp}>
            The AI-assisted multi-page architectural portfolio and verified 1-page ATS resume platform.
            Turn your projects, skills, and ambition into an unforgettable digital presence in seconds.
          </motion.p>
          <motion.div className="hero-buttons" variants={fadeInUp}>
            <motion.button
              className="button button-lime"
              onClick={() => {
                if (!user) {
                  onRequireAuth('Create a free account to start your portfolio.');
                  return;
                }
                onCreatePortfolio();
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Free Portfolio & Resume <span>→</span>
            </motion.button>
            <motion.button
              className="text-link"
              onClick={onViewFeatured}
              whileHover={{ x: 4 }}
            >
              See Live Demo (Ankur Rana) <span>↗</span>
            </motion.button>
          </motion.div>
          <motion.p className="hero-note" variants={fadeInUp}>
            <span>✦</span> 100% Free to start. Direct PC photo upload. No credit card required.
          </motion.p>
        </motion.div>

        <motion.div
          className="hero-art"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="sun-disc" />
          <motion.div
            className="hero-card card-a"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05, rotate: -2 }}
          >
            <div className="hero-card-user-header">
              <div className="hero-avatar-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Creator Avatar"
                  className="hero-avatar-img"
                />
                <span className="hero-avatar-live-dot" />
              </div>
              <div>
                <span className="tag">MULTI-PAGE WEB ENGINE</span>
                <div className="hero-user-name">Ankur Rana</div>
              </div>
            </div>
            <strong>Home · Work<br />About · Contact</strong>
            <div className="card-a-bottom-row">
              <span className="hero-role-pill">⚡ Software Engineer</span>
              <div className="mini-orbit">✦</div>
            </div>
          </motion.div>
          <motion.div
            className="hero-card card-b"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <span>VERIFIED ATS RESUME</span>
            <div className="scribble">📄</div>
            <b>1-Click<br />A4 PDF Export</b>
          </motion.div>
          <motion.div
            className="hero-card card-c"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <span>RECRUITER HUD</span>
            <div className="mini-bars"><i /><i /><i /></div>
            <small>⌘K Ready</small>
          </motion.div>
          <motion.div
            className="star star-one"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >✦</motion.div>
          <motion.div
            className="star star-two"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          >✦</motion.div>
        </motion.div>
      </motion.section>

      {/* ── Section 2: Audience Banner ── */}
      <motion.section
        className="trust-row"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <p>ENGINEERED FOR ASPIRING TALENT & EXPERIENCED BUILDERS</p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {['College Students', 'Freshers & Graduates', 'Software Engineers', 'UI/UX Designers', 'Freelancers', 'Researchers'].map((l) => (
            <motion.span
              key={l}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              whileHover={{ scale: 1.08, color: '#7af844' }}
            >
              {l}
            </motion.span>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Section 3: 3 Core Pillars ── */}
      <section className="home-features" style={{ padding: '80px 6vw 40px', background: '#080a0f' }}>
        <motion.div
          className="section-intro"
          style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow" style={{ color: '#7af844' }}>WHY CAREERFOLIO</p>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(28px, 4vw, 42px)', margin: '8px 0 12px' }}>
            The complete toolkit to land technical roles.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>
            Everything you need from initial draft to recruiter outreach in a unified ecosystem.
          </p>
        </motion.div>

        <motion.div
          className="features-grid"
          style={{ background: 'transparent', gap: 24, maxWidth: 1160, margin: '0 auto' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          <motion.div
            className="feature-card"
            style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 14, padding: 32 }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            whileHover={{ y: -6, borderColor: '#7af844', boxShadow: '0 12px 30px rgba(122, 248, 68, 0.12)' }}
          >
            <span className="feature-icon" style={{ color: '#7af844' }}>⚡</span>
            <h3 style={{ color: '#ffffff' }}>1-Click AI Portfolio Synthesis</h3>
            <p style={{ color: '#94a3b8' }}>
              Turn raw coursework, bullet points, or coding repositories into fluent 4-page case studies with measurable impact metrics and recruiter-ready English.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 14, padding: 32 }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            whileHover={{ y: -6, borderColor: '#38bdf8', boxShadow: '0 12px 30px rgba(56, 189, 248, 0.12)' }}
          >
            <span className="feature-icon" style={{ color: '#38bdf8' }}>📄</span>
            <h3 style={{ color: '#ffffff' }}>Strict 1-Page ATS Resume Studio</h3>
            <p style={{ color: '#94a3b8' }}>
              Single-page bounded canvas that auto-syncs with your portfolio projects. Export clean vector A4 PDFs tested against Taleo and Workday parsing algorithms.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 14, padding: 32 }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            whileHover={{ y: -6, borderColor: '#a855f7', boxShadow: '0 12px 30px rgba(168, 85, 247, 0.12)' }}
          >
            <span className="feature-icon" style={{ color: '#a855f7' }}>⌘K</span>
            <h3 style={{ color: '#ffffff' }}>Recruiter Quick-Scan HUD</h3>
            <p style={{ color: '#94a3b8' }}>
              A 15-second tl;dr overlay designed for busy recruiters. Summarizes your top shipped systems, core stack, and direct contact buttons instantly.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 4: Templates Teaser (Links to Dedicated Page) ── */}
      <section style={{ padding: '80px 6vw', background: '#0b0f19', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <motion.div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, gap: 20, flexWrap: 'wrap' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="eyebrow" style={{ color: '#7af844' }}>ARCHITECTURAL TEMPLATE SUITE</p>
              <h2 style={{ color: '#ffffff', fontSize: 'clamp(28px, 4vw, 42px)', margin: '6px 0 10px' }}>
                18+ Handcrafted Layouts. Zero Cookie-Cutter Sites.
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 15, margin: 0 }}>
                Every template is a complete, distinct engineering website with bespoke navigation, typography, and micro-interactions.
              </p>
            </div>
            <motion.button
              className="button button-lime"
              onClick={() => onNavigate('templates')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Explore All 18+ Layouts →
            </motion.button>
          </motion.div>

          {/* 3 Teaser Cards */}
          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {[
              { id: 'bento', name: 'Bento Matrix Pro', type: 'Developer & Creator', tone: 'Apple / Linear inspired modular bento grid', bg: '#090d16', ink: '#f1f5f9', accent: '#7af844', pro: true },
              { id: 'terminal', name: 'Hacker CLI Pro', type: 'Systems & Backend', tone: 'Interactive terminal emulator with phosphor CRT glow', bg: '#050a06', ink: '#33ff77', accent: '#00ff66', pro: true },
              { id: 'obsidian', name: 'Obsidian Dark', type: 'Developer', tone: 'Refined dark editorial aesthetic with clean monospace tags', bg: '#0a0f0d', ink: '#e8f5ee', accent: '#46f6a5', pro: false },
            ].map((tmpl) => (
              <motion.div
                key={tmpl.id}
                onClick={() => onNavigate('templates')}
                style={{
                  background: tmpl.bg,
                  color: tmpl.ink,
                  border: '1px solid #1e293b',
                  borderRadius: 14,
                  padding: 24,
                  height: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{ y: -6, borderColor: tmpl.accent, boxShadow: `0 14px 30px ${tmpl.accent}22` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'DM Mono', fontSize: 10, letterSpacing: '0.08em', color: tmpl.accent }}>
                    {tmpl.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: tmpl.pro ? tmpl.accent : '#334155', color: tmpl.pro ? '#000' : '#fff' }}>
                    {tmpl.pro ? 'PRO ✦' : 'FREE'}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: 20, margin: '0 0 6px', fontWeight: 800 }}>{tmpl.name}</h3>
                  <p style={{ fontSize: 12.5, opacity: 0.8, margin: 0, lineHeight: 1.4 }}>{tmpl.tone}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: tmpl.accent, fontWeight: 700 }}>4 Independent Pages</span>
                  <span style={{ fontSize: 13, color: tmpl.accent }}>View Demo →</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 5: Features Teaser (Links to Dedicated Page) ── */}
      <section style={{ padding: '80px 6vw', background: '#080a0f' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: '#a3e635' }}>DEEP-DIVE CAPABILITIES</p>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(28px, 4vw, 42px)', margin: '6px 0 14px', maxWidth: 780 }}>
            Explore the engineering behind your next career breakthrough.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 640, margin: '0 0 32px' }}>
            From local PC photo framing and GitHub repository syncing to 15-second recruiter overlays and ATS optimization.
          </p>
          <button
            className="button button-outline"
            style={{ borderColor: '#38bdf8', color: '#38bdf8', padding: '12px 24px', fontSize: 14 }}
            onClick={() => onNavigate('features')}
          >
            Explore Full Feature Breakdown (8 Core Systems) →
          </button>
        </div>
      </section>

      {/* ── Section 6: High-Contrast 3-Tier Pricing ── */}
      <section id="home-pricing" style={{ padding: '90px 6vw', background: '#090d16', borderTop: '1px solid #1e293b' }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 48px' }}>
          <p className="eyebrow" style={{ color: '#38bdf8' }}>TRANSPARENT & HONEST PRICING</p>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(28px, 4vw, 42px)', margin: '6px 0 12px' }}>
            Choose the engine that powers your career.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 15, margin: 0, lineHeight: 1.6 }}>
            Start 100% free. Upgrade anytime with a single one-time payment. No recurring monthly subscriptions.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1160, margin: '0 auto' }}>
          {/* Tier 1: Free Starter */}
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: 16,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'inline-block', background: '#1e293b', color: '#94a3b8', fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 12, marginBottom: 12 }}>
                FREE EXPLORER
              </div>
              <h3 style={{ color: '#ffffff', fontSize: 22, margin: '0 0 6px', fontWeight: 800 }}>Free Tier</h3>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 16px' }}>Essential toolkit to get your initial presence online.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
                <strong style={{ color: '#ffffff', fontSize: 44, fontWeight: 800 }}>₹0</strong>
                <span style={{ color: '#64748b', fontSize: 13 }}>forever free</span>
              </div>
              <ul style={{ listStyle: 'none', padding: '18px 0', margin: 0, borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#e2e8f0' }}>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> 1 Live Multi-Page Portfolio</li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> 6 Classic Portfolio Templates</li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> 4 Standard ATS Resume Formats</li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> Live Visual Block & Text Editor</li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> Direct Computer Photo Upload</li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> 1-Click ATS PDF Export</li>
                <li style={{ display: 'flex', gap: 8, color: '#64748b' }}><span>✕</span> Careerfolio Watermark in Footer</li>
                <li style={{ display: 'flex', gap: 8, color: '#64748b' }}><span>✕</span> 1-Click AI 4-Page Generator</li>
              </ul>
            </div>
            <button
              className="button button-outline"
              style={{ width: '100%', marginTop: 24, padding: '12px', borderRadius: 8, borderColor: '#334155', color: '#f8fafc', background: 'transparent', fontWeight: 700 }}
              onClick={() => {
                if (!user) {
                  onRequireAuth('Create a free account to get started.');
                  return;
                }
                onCreatePortfolio();
              }}
            >
              Start Free Now →
            </button>
          </div>

          {/* Tier 2: Student & Creator Plus */}
          <div
            style={{
              background: '#081c0e',
              border: '1px solid #44F86844',
              borderRadius: 16,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div>
              <div style={{ display: 'inline-block', background: '#44F868', color: '#091203', fontSize: 10.5, fontWeight: 800, padding: '3px 10px', borderRadius: 12, marginBottom: 12 }}>
                POPULAR FOR STUDENTS 🎓
              </div>
              <h3 style={{ color: '#ffffff', fontSize: 22, margin: '0 0 6px', fontWeight: 800 }}>Student & Creator Plus</h3>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 16px' }}>More portfolios, zero watermark & section AI writer.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
                <strong style={{ color: '#44F868', fontSize: 44, fontWeight: 800 }}>₹99</strong>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>one-time / lifetime</span>
              </div>
              <ul style={{ listStyle: 'none', padding: '18px 0', margin: 0, borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#ffffff' }}>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#44F868', fontWeight: 800 }}>✓</span> <strong>Up to 3 Live Portfolios</strong></li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#44F868', fontWeight: 800 }}>✓</span> <strong>10 Portfolio Design Templates</strong></li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#44F868', fontWeight: 800 }}>✓</span> <strong>8 ATS Resume Formats & PDF</strong></li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#44F868', fontWeight: 800 }}>✓</span> ⚡ <strong>AI Bio & Section Writer</strong></li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#44F868', fontWeight: 800 }}>✓</span> <strong>Remove All Watermarks</strong></li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#44F868', fontWeight: 800 }}>✓</span> GitHub & LinkedIn 1-Click Importer</li>
                <li style={{ display: 'flex', gap: 8, color: '#64748b' }}><span>✕</span> Full 1-Click 4-Page AI Builder</li>
              </ul>
            </div>
            <button
              className="button button-lime"
              style={{ width: '100%', marginTop: 24, padding: '12px', borderRadius: 8, background: '#44F868', color: '#091203', border: 'none', fontWeight: 800 }}
              onClick={() => {
                if (!user) {
                  onRequireAuth('Please sign in or create an account to get Student Plus.');
                  return;
                }
                onUpgrade();
              }}
            >
              Get Student Plus ↗
            </button>
          </div>

          {/* Tier 3: Ultimate Pro All-Access */}
          <div
            style={{
              background: '#0a1a09',
              border: '2px solid #7AF844',
              borderRadius: 16,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 16px 40px rgba(122, 248, 68, 0.2)',
              position: 'relative',
            }}
          >
            <div>
              <div style={{ display: 'inline-block', background: '#D4F844', color: '#0c1404', fontSize: 10.5, fontWeight: 900, padding: '4px 10px', borderRadius: 12, marginBottom: 12 }}>
                MAX POWER · LIFETIME ALL ACCESS ⚡
              </div>
              <h3 style={{ color: '#ffffff', fontSize: 22, margin: '0 0 6px', fontWeight: 800 }}>Ultimate Pro All-Access</h3>
              <p style={{ color: '#cbd5e1', fontSize: 13, margin: '0 0 16px' }}>Unlimited portfolios, all Pro templates & full AI engine.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
                <strong style={{ color: '#7AF844', fontSize: 44, fontWeight: 900 }}>₹199</strong>
                <span style={{ color: '#D4F844', fontSize: 13 }}>one-time / lifetime</span>
              </div>
              <ul style={{ listStyle: 'none', padding: '18px 0', margin: 0, borderTop: '1px solid #142a12', borderBottom: '1px solid #142a12', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#ffffff' }}>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> <strong>Unlimited Live Portfolios & Resumes</strong></li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> <strong>All 18+ Animated Bespoke Pro Templates</strong></li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> ⚡ <strong>Full 1-Click AI 4-Page Generator</strong></li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> ⚡ <strong>Recruiter Quick-Scan HUD (⌘K)</strong></li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> <strong>1-Click Instant Multi-Publishing</strong></li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> Remove All Branding & Watermarks</li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: '#7AF844', fontWeight: 800 }}>✓</span> Priority PDF & Custom Domain Readiness</li>
              </ul>
            </div>
            <button
              className="button button-lime"
              style={{ width: '100%', marginTop: 24, padding: '14px', borderRadius: 8, background: '#7AF844', color: '#0c1404', border: 'none', fontWeight: 900, fontSize: 14 }}
              onClick={() => {
                if (!user) {
                  onRequireAuth('Please sign in or create an account to unlock Pro Access.');
                  return;
                }
                onUpgrade();
              }}
            >
              Unlock Everything (Pro) ✦ →
            </button>
          </div>
        </div>
      </section>

      {/* ── Section 7: FAQ Accordion ── */}
      <section style={{ padding: '70px 6vw', background: '#080a0f' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}>
          <p className="eyebrow" style={{ color: '#7AF844' }}>FREQUENTLY ASKED QUESTIONS</p>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(26px, 3.5vw, 38px)', margin: '6px 0 10px' }}>
            Everything you should know.
          </h2>
        </div>

        <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '18px 22px',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 15.5,
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <span>{faq.q}</span>
                <span style={{ color: '#38bdf8', fontSize: 20, transform: openFaq === idx ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
                  +
                </span>
              </button>
              {openFaq === idx && (
                <div style={{ padding: '0 22px 20px', color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 8: Final Call to Action ── */}
      <motion.section
        className="home-cta"
        style={{ background: '#090d16', borderTop: '1px solid #1e293b', padding: '90px 6vw' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="eyebrow" style={{ color: '#a3e635' }}>READY WHEN YOU ARE</p>
        <h2 style={{ color: '#ffffff', fontSize: 'clamp(32px, 4.5vw, 52px)', margin: '10px 0 24px' }}>
          Your next opportunity<br />should not need imagination.
        </h2>
        <motion.button
          className="button button-lime"
          onClick={() => {
            if (!user) {
              onRequireAuth('Create a free account to get started.');
              return;
            }
            onCreatePortfolio();
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Create your portfolio & resume for free <span>→</span>
        </motion.button>
      </motion.section>

      <SiteFooter onNavigate={onNavigate} />
    </main>
  );
}

// ─── Main Root Component ──────────────────────────────────────────────────────

export default function App() {
  const { user, logout, register, signin, upgradePlan } = useAuth();
  const { portfolios, create, update, remove, duplicate, addCustomPortfolio } = usePortfolios(user?.id);

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const [mode, setMode] = useState('home'); // 'home' | 'templates' | 'features' | 'pricing' | 'legal' | 'privacy' | 'terms' | 'security' | 'dashboard' | 'builder' | 'preview'
  const [activePortfolioId, setActivePortfolioId] = useState(null);
  const [builderInitialTab, setBuilderInitialTab] = useState('editor');
  const [showAuth, setShowAuth] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showOnboardingQuiz, setShowOnboardingQuiz] = useState(false);
  const [showAIGeneratorModal, setShowAIGeneratorModal] = useState(false);
  const [showPreviewRecruiterHUD, setShowPreviewRecruiterHUD] = useState(false);
  const [previewPage, setPreviewPage] = useState('home');
  const [authNotice, setAuthNotice] = useState('');

  const isPro = user?.plan === 'pro';
  const activePortfolio = portfolios.find((p) => p.id === activePortfolioId) ?? null;

  // Listen to popstate and hashchange
  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Standalone personal website mode (opened in new tab)
  if (currentRoute.type === 'public-portfolio') {
    return (
      <StandaloneWebsite
        slugOrId={currentRoute.slugOrId}
        initialPage={currentRoute.page}
      />
    );
  }

  // ── Auth Handler ──
  const handleAuth = useCallback(({ isSignup, name, email, password }) => {
    const result = isSignup
      ? register(name, email, password)
      : signin(email, password);
    if (result.error) {
      return result.error;
    }
    setShowAuth(false);
    setAuthNotice('');
    setMode('dashboard');
    return null;
  }, [register, signin]);

  const triggerAuthGuard = useCallback((message) => {
    setAuthNotice(message || 'Please sign in or create an account to proceed.');
    setShowAuth(true);
  }, []);

  // ── Navigation ──
  const handleNavigate = useCallback((targetMode) => {
    if (targetMode === 'pricing') {
      setMode('home');
      setTimeout(() => {
        document.getElementById('home-pricing')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    setMode(targetMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCreatePortfolio = useCallback((initialTemplateId) => {
    if (!user) {
      triggerAuthGuard('Please sign in or create a free account to build your portfolio.');
      return;
    }
    const userCreatedCount = portfolios.filter((p) => p.id !== 'ankur-rana-featured').length;

    // Free plan limit
    if (!isPro && userCreatedCount >= 1 && user.plan === 'free') {
      setShowUpgrade(true);
      return;
    }

    let onboardingDone = false;
    try {
      onboardingDone = JSON.parse(localStorage.getItem(`cf-onboarding-done-${user.id}`)) ?? false;
    } catch {}

    if (!onboardingDone && userCreatedCount === 0 && !initialTemplateId) {
      setShowOnboardingQuiz(true);
    } else {
      const id = create({
        name: user.name,
        email: user.email,
        template: initialTemplateId || 'bento',
      });
      setActivePortfolioId(id);
      setBuilderInitialTab('editor');
      setMode('builder');
    }
  }, [user, isPro, create, portfolios, triggerAuthGuard]);

  const handleUseTemplate = useCallback((template) => {
    if (!user) {
      triggerAuthGuard(`Sign in to create your portfolio using the ${template.name} layout.`);
      return;
    }
    handleCreatePortfolio(template.id);
  }, [user, triggerAuthGuard, handleCreatePortfolio]);

  const handlePreviewTemplate = useCallback((template) => {
    // Show sample portfolio rendered with this template
    const sample = portfolios.find((p) => p.id === 'ankur-rana-featured') || portfolios[0];
    if (sample) {
      setActivePortfolioId(sample.id);
      // Temporarily override template for preview
      update(sample.id, (p) => ({ ...p, template: template.id }));
      setPreviewPage('home');
      setMode('preview');
    }
  }, [portfolios, update]);

  const handleAIGeneratedPortfolio = useCallback((generatedPortfolio) => {
    if (!user) {
      triggerAuthGuard('Please sign in to generate and save your AI portfolio.');
      return;
    }
    const userCreatedCount = portfolios.filter((p) => p.id !== 'ankur-rana-featured').length;
    if (!isPro && userCreatedCount >= 1 && user.plan === 'free') {
      setShowUpgrade(true);
      return;
    }
    const id = addCustomPortfolio(generatedPortfolio);
    setShowAIGeneratorModal(false);
    setActivePortfolioId(id);
    setBuilderInitialTab('editor');
    setMode('builder');
  }, [user, isPro, portfolios, addCustomPortfolio, triggerAuthGuard]);

  const handleOnboardingConfirm = useCallback((persona) => {
    if (!user) return;
    const id = create({ name: user.name, email: user.email });
    if (persona) {
      update(id, (p) => applyPersonaDefaults(persona, p));
    }
    try {
      localStorage.setItem(`cf-onboarding-done-${user.id}`, JSON.stringify(true));
    } catch {}
    setShowOnboardingQuiz(false);
    setActivePortfolioId(id);
    setBuilderInitialTab('editor');
    setMode('builder');
  }, [user, create, update]);

  const handleEdit = useCallback((id) => {
    setActivePortfolioId(id);
    setBuilderInitialTab('editor');
    setMode('builder');
  }, []);

  const handleOpenResume = useCallback((id) => {
    if (!user) {
      triggerAuthGuard('Please sign in to open and customize your verified 1-page ATS resume.');
      return;
    }
    const targetId = id || (portfolios[0] && portfolios[0].id) || 'ankur-rana-featured';
    setActivePortfolioId(targetId);
    setBuilderInitialTab('resume');
    setMode('builder');
  }, [user, portfolios, triggerAuthGuard]);

  const handlePreview = useCallback((id) => {
    setActivePortfolioId(id);
    setPreviewPage('home');
    setMode('preview');
  }, []);

  const handleBuilderUpdate = useCallback((updater) => {
    if (!activePortfolioId) return;
    update(activePortfolioId, updater);
  }, [update, activePortfolioId]);

  const handlePublish = useCallback(() => {
    if (!activePortfolioId) return;
    update(activePortfolioId, (p) => ({ ...p, published: !p.published }));
  }, [update, activePortfolioId]);

  const handleUpgradeChoose = useCallback((plan) => {
    if (!user) {
      setShowUpgrade(false);
      triggerAuthGuard('Please sign in to upgrade your plan.');
      return;
    }
    upgradePlan(plan);
    setShowUpgrade(false);
  }, [user, upgradePlan, triggerAuthGuard]);

  const handleLogout = useCallback(() => {
    logout();
    setMode('home');
    setActivePortfolioId(null);
  }, [logout]);

  return (
    <>
      {/* ── Modals ── */}
      {showAuth && (
        <AuthPage
          onAuthenticated={(data) => {
            const err = handleAuth(data);
            return err;
          }}
          onCancel={() => {
            setShowAuth(false);
            setAuthNotice('');
          }}
        />
      )}

      {showUpgrade && (
        <UpgradeModal
          user={user}
          onClose={() => setShowUpgrade(false)}
          onChoose={handleUpgradeChoose}
          onRequireAuth={triggerAuthGuard}
        />
      )}

      {showOnboardingQuiz && (
        <OnboardingQuizModal onConfirm={handleOnboardingConfirm} />
      )}

      {showAIGeneratorModal && (
        <AIPortfolioGeneratorModal
          user={user}
          onGeneratePortfolio={handleAIGeneratedPortfolio}
          onClose={() => setShowAIGeneratorModal(false)}
        />
      )}

      {/* ── Fullscreen Builder View ── */}
      {mode === 'builder' && activePortfolio && (
        <BuilderPage
          portfolio={activePortfolio}
          isPro={isPro}
          initialTab={builderInitialTab}
          onUpdate={handleBuilderUpdate}
          onPublish={handlePublish}
          onBack={() => setMode(user ? 'dashboard' : 'home')}
          onUpgrade={() => setShowUpgrade(true)}
          onPreview={() => handlePreview(activePortfolioId)}
        />
      )}

      {/* ── Dedicated Legal Hub Pages (Privacy, Terms, Security) ── */}
      {(mode === 'privacy' || mode === 'terms' || mode === 'security' || mode === 'legal') && (
        <>
          <AppHeader
            mode={mode}
            user={user}
            onNavigate={handleNavigate}
            onCreatePortfolio={() => handleCreatePortfolio()}
            onShowAuth={() => triggerAuthGuard()}
            onLogout={handleLogout}
            onShowUpgrade={() => setShowUpgrade(true)}
            onOpenResume={() => handleOpenResume()}
          />
          <LegalHubPage
            initialTab={mode === 'terms' ? 'terms' : mode === 'security' ? 'security' : 'privacy'}
            onBack={() => setMode('home')}
            onNavigate={handleNavigate}
          />
          <SiteFooter onNavigate={handleNavigate} />
        </>
      )}

      {/* ── Dedicated Templates Page ── */}
      {mode === 'templates' && (
        <>
          <AppHeader
            mode={mode}
            user={user}
            onNavigate={handleNavigate}
            onCreatePortfolio={() => handleCreatePortfolio()}
            onShowAuth={() => triggerAuthGuard()}
            onLogout={handleLogout}
            onShowUpgrade={() => setShowUpgrade(true)}
            onOpenResume={() => handleOpenResume()}
          />
          <TemplatesPage
            user={user}
            onUseTemplate={handleUseTemplate}
            onPreviewTemplate={handlePreviewTemplate}
            onOpenAI={() => setShowAIGeneratorModal(true)}
            onRequireAuth={triggerAuthGuard}
            onUpgrade={() => setShowUpgrade(true)}
          />
          <SiteFooter onNavigate={handleNavigate} />
        </>
      )}

      {/* ── Dedicated Features Page ── */}
      {mode === 'features' && (
        <>
          <AppHeader
            mode={mode}
            user={user}
            onNavigate={handleNavigate}
            onCreatePortfolio={() => handleCreatePortfolio()}
            onShowAuth={() => triggerAuthGuard()}
            onLogout={handleLogout}
            onShowUpgrade={() => setShowUpgrade(true)}
            onOpenResume={() => handleOpenResume()}
          />
          <FeaturesPage
            user={user}
            onCreatePortfolio={() => handleCreatePortfolio()}
            onRequireAuth={triggerAuthGuard}
            onUpgrade={() => setShowUpgrade(true)}
            onNavigate={handleNavigate}
          />
          <SiteFooter onNavigate={handleNavigate} />
        </>
      )}

      {/* ── Home Page ── */}
      {mode === 'home' && (
        <>
          <AppHeader
            mode={mode}
            user={user}
            onNavigate={handleNavigate}
            onCreatePortfolio={() => handleCreatePortfolio()}
            onShowAuth={() => triggerAuthGuard()}
            onLogout={handleLogout}
            onShowUpgrade={() => setShowUpgrade(true)}
            onOpenResume={() => handleOpenResume()}
          />
          <HomePage
            user={user}
            onCreatePortfolio={() => handleCreatePortfolio()}
            onRequireAuth={triggerAuthGuard}
            onUpgrade={() => setShowUpgrade(true)}
            onViewFeatured={() => {
              setActivePortfolioId('ankur-rana-featured');
              setPreviewPage('home');
              setMode('preview');
            }}
            onNavigate={handleNavigate}
          />
        </>
      )}

      {/* ── Dashboard Page (Logged In Users) ── */}
      {mode === 'dashboard' && user && (
        <>
          <AppHeader
            mode={mode}
            user={user}
            onNavigate={handleNavigate}
            onCreatePortfolio={() => handleCreatePortfolio()}
            onShowAuth={() => triggerAuthGuard()}
            onLogout={handleLogout}
            onShowUpgrade={() => setShowUpgrade(true)}
            onOpenResume={() => handleOpenResume()}
          />
          <DashboardPage
            portfolios={portfolios}
            user={user}
            onCreate={() => handleCreatePortfolio()}
            onOpenAIGenerator={() => setShowAIGeneratorModal(true)}
            onEdit={handleEdit}
            onOpenResume={handleOpenResume}
            onPreview={handlePreview}
            onRemove={remove}
            onDuplicate={duplicate}
            onUpgrade={() => setShowUpgrade(true)}
            onNavigate={handleNavigate}
          />
        </>
      )}

      {/* Fallback if mode is dashboard but no user */}
      {mode === 'dashboard' && !user && (() => { setMode('home'); return null; })()}

      {/* ── Live Preview Mode ── */}
      {mode === 'preview' && activePortfolio && (
        <div className="public-page">
          <div className="public-toolbar">
            <button onClick={() => setMode(user ? 'dashboard' : 'home')}>← Back</button>
            <div className="preview-page-tabs">
              {['home', 'work', 'about', 'contact'].map((pg) => (
                <button
                  key={pg}
                  className={previewPage === pg ? 'active' : ''}
                  onClick={() => setPreviewPage(pg)}
                >
                  {pg.charAt(0).toUpperCase() + pg.slice(1)}
                </button>
              ))}
            </div>
            <div className="public-toolbar-right">
              <a
                href={getPublicPortfolioUrl(activePortfolio)}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-lime"
                style={{ padding: '7px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                title="Open real personal website in a new tab"
              >
                🌐 Open in New Tab ↗
              </a>
              <button
                className="button button-outline"
                style={{ padding: '7px 12px', fontSize: 12, borderColor: '#4ade80', color: '#4ade80' }}
                onClick={() => handleOpenResume(activePortfolio.id)}
              >
                📄 View ATS Resume ↗
              </button>
              <span className={`pub-status${activePortfolio.published ? ' live' : ''}`}>
                {activePortfolio.published ? '● Live' : '○ Draft'}
              </span>
              {user && (
                <button
                  className="button button-dark"
                  style={{ padding: '8px 14px', fontSize: 12 }}
                  onClick={() => handleEdit(activePortfolio.id)}
                >
                  Edit portfolio
                </button>
              )}
            </div>
          </div>
          <div className="public-portfolio-wrap">
            <PortfolioRenderer
              portfolio={activePortfolio}
              page={previewPage}
              isPro={isPro}
              onOpenRecruiterHUD={() => setShowPreviewRecruiterHUD(true)}
            />
          </div>

          {showPreviewRecruiterHUD && (
            <RecruiterHUD
              portfolio={activePortfolio}
              isPro={isPro}
              onOpenResume={() => handleOpenResume(activePortfolio.id)}
              onClose={() => setShowPreviewRecruiterHUD(false)}
            />
          )}
        </div>
      )}
    </>
  );
}
