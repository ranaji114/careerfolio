import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOCK_TYPES } from '../data/defaultPortfolio';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function MagazineLayout({
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
  const contactBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.CONTACT) || {};
  const testimonialsBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.TESTIMONIALS) || {};

  const projects = projectsBlock.projects || [];
  const allSkills = (skillsBlock.categories || []).flatMap((c) => c.items || []);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState('');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError('All fields are required.');
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
    { id: 'home', label: 'Cover' },
    { id: 'work', label: `Works (${projects.length})` },
    { id: 'about', label: 'Editorial' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div
      className={`mag-layout-root template-${t.id}`}
      data-template={t.id}
      style={{
        background: t.bg,
        color: t.ink,
        fontFamily: t.font === 'serif' ? 'Georgia, serif' : t.font === 'mono' ? 'DM Mono, monospace' : 'Inter, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Top Editorial Header ── */}
      <header className="mag-header" style={{ borderColor: t.border, background: `${t.bg}ee`, backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="mag-header-inner" style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '16px 20px' }}>
          <div className="mag-issue-badge" style={{ color: t.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>
            VOL. {new Date().getFullYear()} // PORTFOLIO EDITION
          </div>
          <div className="mag-brand-title" onClick={() => onChangePage?.('home')} style={{ cursor: 'pointer', fontSize: 18, fontWeight: 800 }}>
            <span style={{ color: t.accent }}>●</span> {hero.name || 'PORTFOLIO'}
          </div>

          <div className="mag-nav-links" style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangePage?.(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: currentPage === item.id ? t.accent : t.muted,
                  fontWeight: currentPage === item.id ? 800 : 600,
                  fontSize: 13,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: currentPage === item.id ? `2px solid ${t.accent}` : '2px solid transparent',
                  paddingBottom: 2,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mag-header-actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {onOpenRecruiterHUD && (
              <button
                className="mag-hud-pill"
                style={{ background: t.card, color: t.accent, borderColor: t.border, padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                onClick={onOpenRecruiterHUD}
              >
                ⚡ Recruiter Scan (⌘K)
              </button>
            )}
            <button
              type="button"
              onClick={() => onChangePage?.('contact')}
              className="mag-book-btn"
              style={{ background: t.accent, color: t.bg, border: 'none', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              Hire Me ↗
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Dynamic Animated Content ── */}
      <main style={{ flex: 1, padding: '32px 20px 60px', maxWidth: 1180, width: '100%', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {/* ════════════════ PAGE: HOME (COVER) ════════════════ */}
          {currentPage === 'home' && (
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Giant Statement Hero */}
              <section className="mag-hero" style={{ borderColor: t.border, paddingBottom: 36, borderBottom: `1px solid ${t.border}`, marginBottom: 36 }}>
                <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div className="mag-kicker" style={{ color: t.accent, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>
                      {hero.role || 'Digital Architect & Creative Engineer'}
                    </div>
                    <h1 className="mag-big-headline" style={{ color: t.ink, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.15, margin: '0 0 16px', fontWeight: 800 }}>
                      {hero.tagline || 'Designing bold digital experiences that convert and leave a mark.'}
                    </h1>
                    <p style={{ color: t.muted, fontSize: 16, lineHeight: 1.7, maxWidth: 650, margin: '0 0 24px' }}>
                      {aboutBlock.body || 'Specializing in high-performance web systems, low-latency architecture, and intuitive digital experiences.'}
                    </p>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        className="button button-lime"
                        style={{ background: t.accent, color: t.bg, border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => onChangePage?.('work')}
                      >
                        Explore Case Studies ({projects.length}) ↗
                      </button>
                      <button
                        className="button button-outline"
                        style={{ color: t.ink, border: `1px solid ${t.border}`, background: 'transparent', padding: '10px 18px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => onChangePage?.('contact')}
                      >
                        Initiate Connection
                      </button>
                    </div>
                  </div>

                  {(hero.avatar || hero.avatarUrl) && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      style={{
                        width: 170,
                        height: 170,
                        borderRadius: 16,
                        overflow: 'hidden',
                        border: `3px solid ${t.accent}`,
                        flexShrink: 0,
                        boxShadow: `0 16px 36px rgba(0,0,0,0.3)`,
                      }}
                    >
                      <img src={hero.avatar || hero.avatarUrl} alt={hero.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                  )}
                </div>

                <div className="mag-hero-meta-row" style={{ borderColor: t.border, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginTop: 32, paddingTop: 20, borderTop: `1px solid ${t.border}` }}>
                  <div className="mag-meta-col">
                    <span className="mag-meta-label" style={{ color: t.muted, fontSize: 11, display: 'block' }}>BASED IN</span>
                    <strong style={{ color: t.ink, fontSize: 14 }}>{hero.location || 'Remote Worldwide'}</strong>
                  </div>
                  <div className="mag-meta-col">
                    <span className="mag-meta-label" style={{ color: t.muted, fontSize: 11, display: 'block' }}>DIRECT EMAIL</span>
                    <strong style={{ color: t.accent }}>
                      <a href={`mailto:${hero.email || contactBlock.email || 'hello@domain.com'}`} style={{ color: t.accent, textDecoration: 'none', fontSize: 14 }}>
                        {hero.email || contactBlock.email || 'Available on request'}
                      </a>
                    </strong>
                  </div>
                  <div className="mag-meta-col">
                    <span className="mag-meta-label" style={{ color: t.muted, fontSize: 11, display: 'block' }}>AVAILABILITY</span>
                    <strong style={{ color: t.accent, fontSize: 14 }}>Ready for new projects ●</strong>
                  </div>
                </div>
              </section>

              {/* Ticker Strip */}
              {allSkills.length > 0 && (
                <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: '14px 20px', borderRadius: 8, marginBottom: 36, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ color: t.accent, fontWeight: 700, fontSize: 12 }}>CORE SKILLS:</span>
                    {allSkills.map((s, idx) => (
                      <span key={idx} style={{ color: t.ink, fontSize: 13 }}>
                        <span style={{ color: t.accent }}>★</span> {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Featured Works */}
              <section style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                  <h2 style={{ color: t.ink, fontSize: 24, margin: 0, fontWeight: 800 }}>Featured Case Studies</h2>
                  <button onClick={() => onChangePage?.('work')} style={{ background: 'none', border: 'none', color: t.accent, fontWeight: 700, cursor: 'pointer' }}>
                    View all projects ({projects.length}) →
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                  {projects.slice(0, 3).map((proj, i) => (
                    <div key={proj.id || i} style={{ background: t.card, border: `1px solid ${t.border}`, padding: 24, borderRadius: 12 }}>
                      <span style={{ color: t.accent, fontSize: 11, fontWeight: 700 }}>CASE #{String(i + 1).padStart(2, '0')}</span>
                      <h3 style={{ color: t.ink, margin: '6px 0 10px', fontSize: 18 }}>{proj.title}</h3>
                      <p style={{ color: t.muted, fontSize: 14, lineHeight: 1.6, margin: '0 0 14px' }}>{proj.description}</p>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {(proj.liveUrl || proj.demo) && (
                          <a href={proj.liveUrl || proj.demo} target="_blank" rel="noreferrer" style={{ color: t.accent, fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>
                            Visit Live ↗
                          </a>
                        )}
                        {(proj.githubUrl || proj.github) && (
                          <a href={proj.githubUrl || proj.github} target="_blank" rel="noreferrer" style={{ color: t.muted, fontSize: 12, textDecoration: 'none' }}>
                            Source
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ════════════════ PAGE: WORK (ALL WORKS) ════════════════ */}
          {currentPage === 'work' && (
            <motion.div
              key="work"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div style={{ marginBottom: 32, borderBottom: `1px solid ${t.border}`, paddingBottom: 20 }}>
                <span style={{ color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>02 / ARCHIVE</span>
                <h1 style={{ color: t.ink, fontSize: 32, margin: '6px 0 10px', fontWeight: 800 }}>Complete Case Studies & Works</h1>
                <p style={{ color: t.muted, fontSize: 15, margin: 0 }}>All software engineering artifacts, production web builds, and tools.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
                {projects.map((proj, idx) => (
                  <div key={proj.id || idx} style={{ background: t.card, border: `1px solid ${t.border}`, padding: 26, borderRadius: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ color: t.accent, fontSize: 11, fontWeight: 700 }}>PROJECT #{String(idx + 1).padStart(2, '0')}</span>
                        {proj.status && (
                          <span style={{ background: `${t.accent}15`, color: t.accent, border: `1px solid ${t.accent}44`, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                            {proj.status}
                          </span>
                        )}
                      </div>
                      <h3 style={{ color: t.ink, fontSize: 20, margin: '0 0 10px' }}>{proj.title}</h3>
                      <p style={{ color: t.muted, fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>{proj.description}</p>

                      {proj.highlights && (
                        <ul style={{ paddingLeft: 18, color: t.muted, fontSize: 13, lineHeight: 1.6, margin: '0 0 16px' }}>
                          {proj.highlights.map((h, hi) => (
                            <li key={hi}>{h}</li>
                          ))}
                        </ul>
                      )}

                      {proj.tech && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                          {proj.tech.map((tag, ti) => (
                            <span key={ti} style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.ink, fontSize: 11, padding: '3px 8px', borderRadius: 4 }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 12, borderTop: `1px solid ${t.border}`, paddingTop: 14 }}>
                      {(proj.liveUrl || proj.demo) && (
                        <a href={proj.liveUrl || proj.demo} target="_blank" rel="noreferrer" style={{ background: t.accent, color: t.bg, padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                          Live Case ↗
                        </a>
                      )}
                      {(proj.githubUrl || proj.github) && (
                        <a href={proj.githubUrl || proj.github} target="_blank" rel="noreferrer" style={{ background: 'transparent', color: t.ink, border: `1px solid ${t.border}`, padding: '6px 14px', borderRadius: 6, fontSize: 12, textDecoration: 'none' }}>
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ════════════════ PAGE: ABOUT (EDITORIAL) ════════════════ */}
          {currentPage === 'about' && (
            <motion.div
              key="about"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div style={{ marginBottom: 32, borderBottom: `1px solid ${t.border}`, paddingBottom: 20 }}>
                <span style={{ color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>03 / EDITORIAL</span>
                <h1 style={{ color: t.ink, fontSize: 32, margin: '6px 0 10px', fontWeight: 800 }}>Profile & Engineering Story</h1>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 30, borderRadius: 12 }}>
                  <h3 style={{ color: t.accent, fontSize: 16, margin: '0 0 14px' }}>The Narrative</h3>
                  <p style={{ color: t.ink, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                    {aboutBlock.body || 'I specialize in engineering high-leverage digital products. From low-latency backend architectures to intuitive web interfaces, every line of code is measured by clarity, reliability, and business impact.'}
                  </p>
                  {aboutBlock.highlight && (
                    <blockquote style={{ borderLeft: `3px solid ${t.accent}`, paddingLeft: 14, margin: '20px 0 0', color: t.muted, fontStyle: 'italic' }}>
                      "{aboutBlock.highlight}"
                    </blockquote>
                  )}
                </div>

                {timelineBlock.items && timelineBlock.items.length > 0 && (
                  <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 30, borderRadius: 12 }}>
                    <h3 style={{ color: t.accent, fontSize: 16, margin: '0 0 16px' }}>Career Milestones</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {timelineBlock.items.map((it, idx) => (
                        <div key={idx} style={{ borderBottom: idx < timelineBlock.items.length - 1 ? `1px solid ${t.border}` : 'none', paddingBottom: 12 }}>
                          <span style={{ color: t.accent, fontWeight: 700, fontSize: 12 }}>{it.year || it.date}</span>
                          <strong style={{ color: t.ink, display: 'block', fontSize: 15, margin: '2px 0' }}>{it.role || it.title}</strong>
                          <span style={{ color: t.muted, fontSize: 13 }}>{it.company || it.institution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ════════════════ PAGE: CONTACT ════════════════ */}
          {currentPage === 'contact' && (
            <motion.div
              key="contact"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}
            >
              <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 32, borderRadius: 12 }}>
                <span style={{ color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>04 / GET IN TOUCH</span>
                <h1 style={{ color: t.ink, fontSize: 28, margin: '6px 0 14px', fontWeight: 800 }}>Let's Collaborate</h1>
                <p style={{ color: t.muted, fontSize: 15, lineHeight: 1.7, margin: '0 0 24px' }}>
                  {contactBlock.body || 'Available for contract engineering, high-impact consulting, or full-time opportunities.'}
                </p>

                {(hero.email || contactBlock.email) && (
                  <div style={{ marginBottom: 20 }}>
                    <span style={{ color: t.muted, fontSize: 11, display: 'block', marginBottom: 4 }}>DIRECT EMAIL</span>
                    <a href={`mailto:${hero.email || contactBlock.email}`} style={{ color: t.accent, fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>
                      {hero.email || contactBlock.email}
                    </a>
                  </div>
                )}

                {hero.location && (
                  <div>
                    <span style={{ color: t.muted, fontSize: 11, display: 'block', marginBottom: 4 }}>LOCATION</span>
                    <strong style={{ color: t.ink, fontSize: 14 }}>{hero.location}</strong>
                  </div>
                )}
              </div>

              <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 32, borderRadius: 12 }}>
                <h3 style={{ color: t.ink, fontSize: 20, margin: '0 0 16px', fontWeight: 700 }}>Transmit a Note</h3>
                {formSent ? (
                  <div style={{ background: `${t.accent}15`, border: `1px solid ${t.accent}`, padding: 24, borderRadius: 8, textAlign: 'center' }}>
                    <strong style={{ color: t.ink, fontSize: 16, display: 'block' }}>Message Dispatched ✓</strong>
                    <p style={{ color: t.muted, fontSize: 13, margin: '8px 0 14px' }}>Thank you for reaching out.</p>
                    <button onClick={() => setFormSent(false)} style={{ background: t.accent, color: t.bg, border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {formError && <div style={{ color: '#ef4444', fontSize: 13 }}>{formError}</div>}
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 6, color: t.ink, fontSize: 14 }}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 6, color: t.ink, fontSize: 14 }}
                      required
                    />
                    <textarea
                      rows={4}
                      placeholder="Your message or project scope..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 6, color: t.ink, fontSize: 14 }}
                      required
                    />
                    <button type="submit" style={{ background: t.accent, color: t.bg, border: 'none', padding: '12px', borderRadius: 6, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                      Send Message →
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: '24px 20px', background: t.card, marginTop: 'auto' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ color: t.muted, fontSize: 13 }}>
            © {new Date().getFullYear()} {hero.name} {isPro ? '· Magazine Edition' : '· Powered by Careerfolio'}
          </span>
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
