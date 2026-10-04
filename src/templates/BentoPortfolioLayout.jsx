import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOCK_TYPES } from '../data/defaultPortfolio';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const cardHover = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
};

export default function BentoPortfolioLayout({
  portfolio,
  page = 'home',
  t,
  editMode,
  onEditBlock,
  onChangePage,
  isPro,
  onOpenRecruiterHUD,
}) {
  const currentPage = page || 'home';
  const homeBlocks = portfolio?.pages?.home?.blocks || [];
  const workBlocks = portfolio?.pages?.work?.blocks || [];
  const aboutBlocks = portfolio?.pages?.about?.blocks || [];
  const contactBlocks = portfolio?.pages?.contact?.blocks || [];
  const allBlocks = [...homeBlocks, ...workBlocks, ...aboutBlocks, ...contactBlocks];

  const hero = allBlocks.find((b) => b.type === BLOCK_TYPES.HERO) || {};
  const projectsBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.PROJECTS) || {};
  const skillsBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.SKILLS) || {};
  const aboutBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.ABOUT) || {};
  const timelineBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.TIMELINE) || {};
  const booksBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.BOOKS) || {};
  const researchBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.RESEARCH) || {};
  const contactBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.CONTACT) || {};
  const testimonialsBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.TESTIMONIALS) || {};

  const projects = projectsBlock.projects || [];
  const stats = hero.stats && hero.stats.length > 0 ? hero.stats : [
    { value: `${projects.length || 4}+`, label: 'Production Builds' },
    { value: '100%', label: 'Craft & Precision' },
    { value: '4+ yrs', label: 'Experience' },
  ];

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState('');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError('Please fill in all fields.');
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem('cf-contact-submissions') || '[]');
      existing.push({
        id: Date.now(),
        portfolioId: portfolio.id,
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('cf-contact-submissions', JSON.stringify(existing));
    } catch {}
    setFormSent(true);
    setFormError('');
    setFormData({ name: '', email: '', message: '' });
  };

  const navItems = [
    { id: 'home', label: 'Overview', icon: '✦' },
    { id: 'work', label: `Projects (${projects.length})`, icon: '⚡' },
    { id: 'about', label: 'Bio & Journey', icon: '📖' },
    { id: 'contact', label: 'Get in Touch', icon: '✉' },
  ];

  return (
    <div className={`bento-wrapper template-${t.id}`} data-template={t.id} style={{ background: t.bg, color: t.ink, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Top Sleek Navigation Bar ── */}
      <header className="bento-nav" style={{ borderColor: t.border, background: `${t.bg}ea`, backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="bento-nav-brand" onClick={() => onChangePage?.('home')} style={{ cursor: 'pointer' }}>
          <span className="bento-logo-dot" style={{ background: t.accent }} />
          <strong>{hero.name || 'Portfolio'}</strong>
          <span style={{ fontSize: 11, color: t.muted, fontWeight: 500, marginLeft: 6 }}>/ {currentPage.toUpperCase()}</span>
        </div>

        <nav className="bento-nav-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangePage?.(item.id)}
              className={currentPage === item.id ? 'active' : ''}
              style={{
                color: currentPage === item.id ? t.accent : t.muted,
                background: currentPage === item.id ? `${t.accent}15` : 'transparent',
                border: `1px solid ${currentPage === item.id ? `${t.accent}44` : 'transparent'}`,
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: currentPage === item.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="bento-nav-cta">
          {onOpenRecruiterHUD && (
            <button
              className="bento-btn-hud"
              style={{ borderColor: t.accent, color: t.accent, background: `${t.accent}10` }}
              onClick={onOpenRecruiterHUD}
            >
              ⚡ Recruiter Scan <span>⌘K</span>
            </button>
          )}
          <button
            onClick={() => onChangePage?.('contact')}
            style={{
              background: t.accent,
              color: t.bg,
              border: 'none',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Hire Me ↗
          </button>
        </div>
      </header>

      {/* ── Main Dynamic Animated Page Container ── */}
      <main style={{ flex: 1, padding: '28px 20px 60px', maxWidth: 1180, width: '100%', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {/* ════════════════ PAGE: HOME (OVERVIEW) ════════════════ */}
          {currentPage === 'home' && (
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bento-grid-container"
            >
              {/* Card 1: Hero Lead Card (Col span 8) */}
              <motion.div
                className="bento-card bento-hero-card"
                style={{ background: t.card, borderColor: t.border }}
                {...cardHover}
              >
                <div className="bento-card-glow" style={{ background: `radial-gradient(circle at 10% 10%, ${t.accent}20, transparent 70%)` }} />
                <div className="bento-hero-header">
                  {(hero.avatar || hero.avatarUrl) ? (
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={hero.avatar || hero.avatarUrl}
                      alt={hero.name}
                      style={{
                        width: 68,
                        height: 68,
                        borderRadius: 16,
                        objectFit: 'cover',
                        border: `2px solid ${t.accent}`,
                        boxShadow: `0 8px 24px ${t.accent}33`,
                      }}
                    />
                  ) : (
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: `${t.accent}22`, border: `2px solid ${t.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: t.accent }}>
                      {(hero.name || 'P').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span className="bento-status-pill" style={{ borderColor: `${t.accent}44`, color: t.accent }}>
                      <span className="bento-pulse-dot" style={{ background: t.accent }} />
                      Available for high-impact opportunities & roles
                    </span>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 2 }}>
                      {hero.location && <span className="bento-loc-tag" style={{ color: t.muted }}>📍 {hero.location}</span>}
                      {(hero.email || contactBlock.email) && (
                        <a
                          href={`mailto:${hero.email || contactBlock.email}`}
                          className="bento-loc-tag"
                          style={{ color: t.accent, textDecoration: 'none', fontWeight: 600 }}
                        >
                          ✉ {hero.email || contactBlock.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <h1 className="bento-headline" style={{ color: t.ink, marginTop: 16 }}>
                  {hero.name || 'Your Name'}
                </h1>
                <p className="bento-role-sub" style={{ color: t.accent, fontWeight: 600, fontSize: 18 }}>
                  {hero.role || 'Full-Stack Software Engineer & Systems Architect'}
                </p>
                {hero.tagline && (
                  <p className="bento-tagline" style={{ color: t.muted, fontSize: 15, lineHeight: 1.6, marginTop: 8 }}>
                    "{hero.tagline}"
                  </p>
                )}

                <div className="bento-hero-actions" style={{ marginTop: 24 }}>
                  <button
                    className="button button-lime"
                    style={{ background: t.accent, color: t.bg, borderColor: t.accent }}
                    onClick={() => onChangePage?.('work')}
                  >
                    Explore Production Systems ({projects.length}) ↗
                  </button>
                  <button
                    className="button button-outline"
                    style={{ color: t.ink, borderColor: t.border }}
                    onClick={() => onChangePage?.('contact')}
                  >
                    Start a Conversation
                  </button>
                </div>
              </motion.div>

              {/* Card 2: Metrics / Verified Numbers (Col span 4) */}
              <motion.div
                className="bento-card bento-stats-card"
                style={{ background: t.card, borderColor: t.border }}
                {...cardHover}
              >
                <span className="eyebrow" style={{ color: t.accent }}>VERIFIED METRICS</span>
                <div className="bento-stats-stack" style={{ marginTop: 12 }}>
                  {stats.map((s, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="bento-stat-box"
                      style={{ borderColor: t.border, background: `${t.bg}80` }}
                    >
                      <strong style={{ color: t.accent, fontSize: 24 }}>{s.value}</strong>
                      <span style={{ color: t.muted, fontSize: 12 }}>{s.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Card 3: Featured Production Systems (Col span 12) */}
              <motion.div
                className="bento-card bento-projects-card"
                style={{ background: t.card, borderColor: t.border }}
                {...cardHover}
              >
                <div className="bento-card-top-bar">
                  <div>
                    <span className="eyebrow" style={{ color: t.accent }}>FEATURED PRODUCTION BUILDS</span>
                    <h2 style={{ color: t.ink, margin: '4px 0 0', fontSize: 20 }}>High-Impact Engineering Highlights</h2>
                  </div>
                  <button
                    className="text-link"
                    style={{ color: t.accent, fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none' }}
                    onClick={() => onChangePage?.('work')}
                  >
                    View all projects ({projects.length}) →
                  </button>
                </div>

                <div className="bento-projects-subgrid" style={{ marginTop: 16 }}>
                  {projects.slice(0, 4).map((p, idx) => (
                    <motion.div
                      key={p.id || idx}
                      whileHover={{ y: -3, borderColor: t.accent }}
                      className="bento-proj-tile"
                      style={{ background: `${t.bg}aa`, borderColor: t.border, transition: 'all 0.2s' }}
                    >
                      <div className="bento-proj-tile-top">
                        <div>
                          <h3 style={{ color: t.ink, fontSize: 16, margin: 0 }}>{p.title}</h3>
                          <span className="bento-proj-tag" style={{ color: t.accent, fontSize: 12 }}>{p.tag}</span>
                        </div>
                        {p.status && (
                          <span className="bento-status-badge" style={{ borderColor: `${t.accent}44`, color: t.accent, background: `${t.accent}15` }}>
                            {p.status}
                          </span>
                        )}
                      </div>

                      <p className="bento-proj-desc" style={{ color: t.muted, fontSize: 13, lineHeight: 1.5, margin: '10px 0' }}>
                        {p.description}
                      </p>

                      {p.tech && p.tech.length > 0 && (
                        <div className="bento-tech-pills" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                          {p.tech.map((tc, ti) => (
                            <span key={ti} style={{ borderColor: t.border, color: t.ink, background: `${t.card}`, fontSize: 11, padding: '2px 8px', borderRadius: 4, border: `1px solid ${t.border}` }}>
                              {tc}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="bento-proj-footer" style={{ display: 'flex', gap: 14 }}>
                        {(p.demo || p.liveUrl) && (
                          <a href={p.demo || p.liveUrl} target="_blank" rel="noreferrer" style={{ color: t.accent, fontWeight: 600, fontSize: 12, textDecoration: 'none' }}>
                            Live Demo ↗
                          </a>
                        )}
                        {(p.github || p.githubUrl) && (
                          <a href={p.github || p.githubUrl} target="_blank" rel="noreferrer" style={{ color: t.muted, fontSize: 12, textDecoration: 'none' }}>
                            Source Code ↗
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Card 4: Technical Stack Matrix (Col span 6) */}
              <motion.div
                className="bento-card bento-skills-card"
                style={{ background: t.card, borderColor: t.border }}
                {...cardHover}
              >
                <span className="eyebrow" style={{ color: t.accent }}>CORE COMPETENCIES</span>
                <h3 style={{ color: t.ink, marginTop: 4, fontSize: 17 }}>Languages, Frameworks & Infra</h3>
                <div className="bento-skills-list" style={{ marginTop: 14 }}>
                  {(skillsBlock.categories || [
                    { label: 'Languages & Core', items: ['TypeScript', 'JavaScript', 'Python', 'Rust', 'SQL'] },
                    { label: 'Frontend & UI', items: ['React 19', 'Next.js', 'TailwindCSS', 'Framer Motion'] },
                    { label: 'Backend & Cloud', items: ['Node.js', 'PostgreSQL', 'Supabase', 'Docker', 'AWS'] },
                  ]).map((cat, ci) => (
                    <div key={ci} className="bento-cat-row" style={{ marginBottom: 10 }}>
                      <span className="bento-cat-name" style={{ color: t.muted, fontSize: 12, width: 120 }}>{cat.label}</span>
                      <div className="bento-cat-items" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {(cat.items || []).map((it, ii) => (
                          <span key={ii} className="bento-skill-pill" style={{ borderColor: t.border, color: t.ink, background: t.bg, fontSize: 11, padding: '3px 8px', borderRadius: 4 }}>
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Card 5: Bio & Philosophy (Col span 6) */}
              <motion.div
                className="bento-card bento-research-card"
                style={{ background: t.card, borderColor: t.border }}
                {...cardHover}
              >
                <span className="eyebrow" style={{ color: t.accent }}>ENGINEERING MINDSET</span>
                <h3 style={{ color: t.ink, marginTop: 4, fontSize: 17 }}>Craftsmanship & Purpose</h3>
                <p style={{ color: t.muted, fontSize: 14, lineHeight: 1.7, margin: '10px 0 16px' }}>
                  {aboutBlock.body || 'I build reliable digital systems designed to solve real user problems with zero bloat and uncompromising quality.'}
                </p>
                <button
                  onClick={() => onChangePage?.('about')}
                  style={{ background: `${t.accent}15`, color: t.accent, border: `1px solid ${t.accent}44`, padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Read Full Bio & Journey →
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ════════════════ PAGE: WORK (ALL PROJECTS) ════════════════ */}
          {currentPage === 'work' && (
            <motion.div
              key="work"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
            >
              <div style={{ background: t.card, padding: '28px', borderRadius: 16, border: `1px solid ${t.border}` }}>
                <span className="eyebrow" style={{ color: t.accent }}>PROJECT ARCHIVE</span>
                <h1 style={{ color: t.ink, margin: '6px 0 10px', fontSize: 28 }}>
                  Production Systems & Engineering Shipments
                </h1>
                <p style={{ color: t.muted, fontSize: 15, margin: 0, maxWidth: 650 }}>
                  A comprehensive record of full-stack web applications, tools, and technical architectures built with modern engineering standards.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                {projects.map((proj, idx) => (
                  <motion.div
                    key={proj.id || idx}
                    whileHover={{ y: -4, borderColor: t.accent }}
                    style={{
                      background: t.card,
                      border: `1px solid ${t.border}`,
                      borderRadius: 14,
                      padding: 22,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <span style={{ fontSize: 11, color: t.accent, fontWeight: 700, textTransform: 'uppercase' }}>
                            {proj.tag || `PROJECT #${String(idx + 1).padStart(2, '0')}`}
                          </span>
                          <h3 style={{ color: t.ink, margin: '4px 0 0', fontSize: 19 }}>{proj.title}</h3>
                        </div>
                        {proj.status && (
                          <span style={{ background: `${t.accent}20`, color: t.accent, border: `1px solid ${t.accent}44`, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                            {proj.status}
                          </span>
                        )}
                      </div>

                      <p style={{ color: t.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                        {proj.description}
                      </p>

                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul style={{ paddingLeft: 18, margin: '0 0 16px', color: t.muted, fontSize: 13, lineHeight: 1.5 }}>
                          {proj.highlights.map((h, hi) => (
                            <li key={hi} style={{ marginBottom: 4 }}>{h}</li>
                          ))}
                        </ul>
                      )}

                      {proj.tech && proj.tech.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                          {proj.tech.map((tech, ti) => (
                            <span key={ti} style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.ink, fontSize: 11, padding: '2px 8px', borderRadius: 4 }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 12, borderTop: `1px solid ${t.border}`, paddingTop: 14, marginTop: 'auto' }}>
                      {(proj.demo || proj.liveUrl) && (
                        <a
                          href={proj.demo || proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: t.accent,
                            color: t.bg,
                            textDecoration: 'none',
                            padding: '6px 14px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          Live Demo ↗
                        </a>
                      )}
                      {(proj.github || proj.githubUrl) && (
                        <a
                          href={proj.github || proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: 'transparent',
                            color: t.ink,
                            border: `1px solid ${t.border}`,
                            textDecoration: 'none',
                            padding: '6px 14px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          GitHub Source
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ════════════════ PAGE: ABOUT (BIO & JOURNEY) ════════════════ */}
          {currentPage === 'about' && (
            <motion.div
              key="about"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
            >
              {/* Profile Bio Header */}
              <div style={{ background: t.card, padding: '32px', borderRadius: 16, border: `1px solid ${t.border}`, display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
                {(hero.avatar || hero.avatarUrl) && (
                  <img
                    src={hero.avatar || hero.avatarUrl}
                    alt={hero.name}
                    style={{ width: 110, height: 110, borderRadius: 20, objectFit: 'cover', border: `3px solid ${t.accent}`, boxShadow: `0 10px 30px ${t.accent}25` }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 260 }}>
                  <span className="eyebrow" style={{ color: t.accent }}>BIOGRAPHY & BACKGROUND</span>
                  <h1 style={{ color: t.ink, margin: '4px 0 8px', fontSize: 28 }}>{hero.name}</h1>
                  <p style={{ color: t.accent, fontWeight: 600, fontSize: 16, margin: 0 }}>{hero.role}</p>
                  {hero.location && <p style={{ color: t.muted, fontSize: 13, marginTop: 4 }}>📍 {hero.location}</p>}
                </div>
              </div>

              {/* Story & Philosophy */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                <div style={{ background: t.card, padding: 26, borderRadius: 14, border: `1px solid ${t.border}` }}>
                  <span className="eyebrow" style={{ color: t.accent }}>ABOUT ME</span>
                  <h3 style={{ color: t.ink, marginTop: 6, fontSize: 18 }}>The Journey & Mission</h3>
                  <p style={{ color: t.muted, fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
                    {aboutBlock.body || 'I am a passionate software developer committed to engineering clean, reliable, and user-centric web applications. My focus spans modern front-end craft, scalable backend APIs, and systems thinking.'}
                  </p>
                  {aboutBlock.highlight && (
                    <blockquote style={{ borderLeft: `3px solid ${t.accent}`, paddingLeft: 14, margin: '18px 0 0', color: t.ink, fontStyle: 'italic' }}>
                      "{aboutBlock.highlight}"
                    </blockquote>
                  )}
                </div>

                <div style={{ background: t.card, padding: 26, borderRadius: 14, border: `1px solid ${t.border}` }}>
                  <span className="eyebrow" style={{ color: t.accent }}>CORE PRINCIPLES</span>
                  <h3 style={{ color: t.ink, marginTop: 6, fontSize: 18 }}>How I Build</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
                    <div style={{ borderLeft: `2px solid ${t.accent}`, paddingLeft: 12 }}>
                      <strong style={{ color: t.ink, display: 'block', fontSize: 14 }}>1. Clarity over cleverness</strong>
                      <span style={{ color: t.muted, fontSize: 13 }}>Readable, maintainable codebases always beat brittle, overly-abstracted code.</span>
                    </div>
                    <div style={{ borderLeft: `2px solid ${t.accent}`, paddingLeft: 12 }}>
                      <strong style={{ color: t.ink, display: 'block', fontSize: 14 }}>2. Performance & accessibility</strong>
                      <span style={{ color: t.muted, fontSize: 13 }}>Fast load times, responsive fluid layouts, and zero barrier to entry for every visitor.</span>
                    </div>
                    <div style={{ borderLeft: `2px solid ${t.accent}`, paddingLeft: 12 }}>
                      <strong style={{ color: t.ink, display: 'block', fontSize: 14 }}>3. Relentless execution</strong>
                      <span style={{ color: t.muted, fontSize: 13 }}>Shipping real, verified software to production rather than staying in perpetual planning.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline / Journey (if present) */}
              {timelineBlock.items && timelineBlock.items.length > 0 && (
                <div style={{ background: t.card, padding: 28, borderRadius: 16, border: `1px solid ${t.border}` }}>
                  <span className="eyebrow" style={{ color: t.accent }}>EXPERIENCE & TIMELINE</span>
                  <h3 style={{ color: t.ink, marginTop: 4, marginBottom: 20, fontSize: 20 }}>Career Milestones</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {timelineBlock.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 18, borderBottom: idx < timelineBlock.items.length - 1 ? `1px solid ${t.border}` : 'none', paddingBottom: 16 }}>
                        <div style={{ minWidth: 100, color: t.accent, fontWeight: 700, fontSize: 13 }}>
                          {item.year || item.date}
                        </div>
                        <div>
                          <strong style={{ color: t.ink, fontSize: 16, display: 'block' }}>{item.role || item.title}</strong>
                          <span style={{ color: t.muted, fontSize: 13 }}>{item.company || item.institution}</span>
                          {item.description && (
                            <p style={{ color: t.muted, fontSize: 14, margin: '8px 0 0', lineHeight: 1.6 }}>{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {testimonialsBlock.items && testimonialsBlock.items.length > 0 && (
                <div style={{ background: t.card, padding: 28, borderRadius: 16, border: `1px solid ${t.border}` }}>
                  <span className="eyebrow" style={{ color: t.accent }}>RECOMMENDATIONS</span>
                  <h3 style={{ color: t.ink, marginTop: 4, marginBottom: 16, fontSize: 20 }}>What Collaborators Say</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {testimonialsBlock.items.map((q, qi) => (
                      <div key={qi} style={{ background: t.bg, padding: 18, borderRadius: 10, border: `1px solid ${t.border}` }}>
                        <p style={{ color: t.ink, fontStyle: 'italic', fontSize: 14, lineHeight: 1.6, margin: '0 0 12px' }}>"{q.quote}"</p>
                        <strong style={{ color: t.accent, fontSize: 13, display: 'block' }}>{q.author}</strong>
                        <span style={{ color: t.muted, fontSize: 11 }}>{q.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ════════════════ PAGE: CONTACT (GET IN TOUCH) ════════════════ */}
          {currentPage === 'contact' && (
            <motion.div
              key="contact"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}
            >
              {/* Left Column: Direct Info */}
              <div style={{ background: t.card, padding: 32, borderRadius: 16, border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="eyebrow" style={{ color: t.accent }}>LET'S CONNECT</span>
                  <h1 style={{ color: t.ink, margin: '6px 0 12px', fontSize: 28 }}>
                    Initiate a Conversation
                  </h1>
                  <p style={{ color: t.muted, fontSize: 15, lineHeight: 1.7, margin: '0 0 24px' }}>
                    {contactBlock.body || "I'm always open to discussing new engineering projects, contract builds, high-growth startups, or innovative concepts."}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                    {(hero.email || contactBlock.email) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${t.accent}15`, border: `1px solid ${t.accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.accent }}>
                          ✉
                        </div>
                        <div>
                          <span style={{ color: t.muted, fontSize: 11, display: 'block' }}>DIRECT EMAIL</span>
                          <a href={`mailto:${hero.email || contactBlock.email}`} style={{ color: t.ink, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                            {hero.email || contactBlock.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {hero.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${t.accent}15`, border: `1px solid ${t.accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.accent }}>
                          📍
                        </div>
                        <div>
                          <span style={{ color: t.muted, fontSize: 11, display: 'block' }}>LOCATION & TIMEZONE</span>
                          <span style={{ color: t.ink, fontWeight: 600, fontSize: 14 }}>{hero.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social links */}
                <div>
                  <span style={{ color: t.muted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 10 }}>
                    Official Channels
                  </span>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {(contactBlock.links || [
                      { label: 'GitHub', url: 'https://github.com' },
                      { label: 'LinkedIn', url: 'https://linkedin.com' },
                    ]).map((link, li) => (
                      <a
                        key={li}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: t.bg,
                          color: t.accent,
                          border: `1px solid ${t.border}`,
                          padding: '8px 14px',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Working Interactive Form */}
              <div style={{ background: t.card, padding: 32, borderRadius: 16, border: `1px solid ${t.border}` }}>
                <span className="eyebrow" style={{ color: t.accent }}>MESSAGE INBOX</span>
                <h3 style={{ color: t.ink, margin: '6px 0 16px', fontSize: 20 }}>Send a Direct Message</h3>

                {formSent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ background: `${t.accent}15`, border: `1px solid ${t.accent}`, padding: 24, borderRadius: 12, textAlign: 'center' }}
                  >
                    <div style={{ fontSize: 32, color: t.accent, marginBottom: 8 }}>✓</div>
                    <strong style={{ color: t.ink, fontSize: 18, display: 'block' }}>Message Received!</strong>
                    <p style={{ color: t.muted, fontSize: 14, margin: '8px 0 16px' }}>
                      Thank you for reaching out. I typically reply within 24 business hours.
                    </p>
                    <button
                      onClick={() => setFormSent(false)}
                      style={{ background: t.accent, color: t.bg, border: 'none', padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Send Another Note
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {formError && (
                      <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: 6, fontSize: 13 }}>
                        {formError}
                      </div>
                    )}
                    <div>
                      <label style={{ display: 'block', color: t.muted, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sarah Jenkins"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: t.bg, border: `1px solid ${t.border}`, color: t.ink, fontSize: 14, outline: 'none' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: t.muted, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. sarah@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: t.bg, border: `1px solid ${t.border}`, color: t.ink, fontSize: 14, outline: 'none' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: t.muted, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Project Scope or Note</label>
                      <textarea
                        rows={4}
                        placeholder="Tell me about your project, timeline, or open role..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: t.bg, border: `1px solid ${t.border}`, color: t.ink, fontSize: 14, outline: 'none', resize: 'vertical' }}
                        required
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      style={{
                        background: t.accent,
                        color: t.bg,
                        border: 'none',
                        padding: '12px',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: 'pointer',
                        marginTop: 6,
                      }}
                    >
                      Transmit Message →
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <footer className="bento-footer" style={{ borderColor: t.border, background: t.card, marginTop: 'auto', padding: '24px 20px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, width: '100%' }}>
          <p style={{ color: t.muted, fontSize: 13, margin: 0 }}>
            © {new Date().getFullYear()} {hero.name} {isPro ? '· All Rights Reserved' : '· Powered by Careerfolio'}
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onChangePage?.(item.id)}
                style={{ background: 'none', border: 'none', color: currentPage === item.id ? t.accent : t.muted, fontSize: 12, cursor: 'pointer' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
