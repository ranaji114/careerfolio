import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOCK_TYPES } from '../data/defaultPortfolio';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -15, transition: { duration: 0.2 } },
};

export default function SplitSidebarLayout({
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

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState('');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError('Please fill out all fields.');
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
    { id: 'home', label: '01 // Overview' },
    { id: 'work', label: `02 // Systems & Projects (${projects.length})` },
    { id: 'about', label: '03 // Background & Journey' },
    { id: 'contact', label: '04 // Direct Connection' },
  ];

  return (
    <div
      className={`split-layout-root template-${t.id}`}
      data-template={t.id}
      style={{
        background: t.bg,
        color: t.ink,
        fontFamily: t.font === 'mono' ? 'DM Mono, monospace' : t.font === 'serif' ? 'Georgia, serif' : 'Inter, sans-serif',
        minHeight: '100vh',
      }}
    >
      {/* ── Left Sticky Column (Sidebar Profile) ── */}
      <aside className="split-sidebar" style={{ borderColor: t.border, background: t.card }}>
        <div className="split-sidebar-inner">
          <div className="split-avatar-wrap" style={{ borderColor: t.accent }}>
            {(hero.avatar || hero.avatarUrl) ? (
              <img src={hero.avatar || hero.avatarUrl} alt={hero.name} className="split-avatar-img" />
            ) : (
              <div className="split-avatar-placeholder" style={{ background: t.accent, color: t.bg }}>
                {(hero.name || 'P').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="split-status-dot" style={{ background: t.accent }} title="Available for opportunities" />
          </div>

          <h1 className="split-name" style={{ color: t.ink, margin: '14px 0 4px', fontSize: 22 }}>
            {hero.name || 'Student Portfolio'}
          </h1>
          <p className="split-role" style={{ color: t.accent, fontWeight: 700, margin: '0 0 8px', fontSize: 14 }}>
            {hero.role || 'Full-Stack Developer'}
          </p>
          {hero.location && <div className="split-loc" style={{ color: t.muted, fontSize: 13, marginBottom: 12 }}>📍 {hero.location}</div>}

          {hero.tagline && (
            <p className="split-tagline" style={{ color: t.muted, borderLeft: `2px solid ${t.accent}`, paddingLeft: 10, fontSize: 13, lineHeight: 1.5, margin: '0 0 18px' }}>
              "{hero.tagline}"
            </p>
          )}

          {/* Quick Recruiter Scan HUD button */}
          {onOpenRecruiterHUD && (
            <button
              className="split-hud-trigger"
              style={{ background: `${t.accent}15`, color: t.accent, borderColor: `${t.accent}44`, width: '100%', marginBottom: 16 }}
              onClick={onOpenRecruiterHUD}
            >
              ⚡ Recruiter 1-Click Scan <kbd style={{ background: t.bg }}>⌘K</kbd>
            </button>
          )}

          {/* Multi-Page Navigation Tabs */}
          <nav className="split-nav" style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`split-nav-link ${currentPage === item.id ? 'active' : ''}`}
                style={{
                  color: currentPage === item.id ? t.accent : t.muted,
                  borderColor: currentPage === item.id ? `${t.accent}55` : 'transparent',
                  background: currentPage === item.id ? `${t.accent}14` : 'transparent',
                  borderRadius: 8,
                  padding: '10px 14px',
                  textAlign: 'left',
                  border: `1px solid ${currentPage === item.id ? `${t.accent}55` : 'transparent'}`,
                  cursor: 'pointer',
                  fontWeight: currentPage === item.id ? 700 : 500,
                  fontSize: 13,
                  transition: 'all 0.2s',
                }}
                onClick={() => onChangePage?.(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Contact Icons Footer */}
          <div className="split-socials" style={{ marginTop: 'auto', paddingTop: 20, borderTop: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(hero.email || contactBlock.email) && (
              <a href={`mailto:${hero.email || contactBlock.email}`} style={{ color: t.accent, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
                ✉ {hero.email || contactBlock.email}
              </a>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              {(contactBlock.links || [
                { label: 'GitHub ↗', url: 'https://github.com' },
                { label: 'LinkedIn ↗', url: 'https://linkedin.com' },
              ]).map((link, li) => (
                <a key={li} href={link.url} target="_blank" rel="noreferrer" style={{ color: t.muted, textDecoration: 'none', fontSize: 12 }}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Right Content View (Page-Aware Animated Container) ── */}
      <main className="split-content" style={{ flex: 1, padding: '36px 32px 60px' }}>
        <AnimatePresence mode="wait">
          {/* ── Page: HOME ── */}
          {currentPage === 'home' && (
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="split-page-view"
            >
              <section className="split-sec" style={{ marginBottom: 36 }}>
                <div className="split-sec-label" style={{ color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}>01. OVERVIEW</div>
                <h2 className="split-sec-title" style={{ color: t.ink, margin: '6px 0 16px', fontSize: 24 }}>Profile & Engineering Objective</h2>
                <div className="split-bio-card" style={{ background: t.card, borderColor: t.border, padding: 24, borderRadius: 12, border: `1px solid ${t.border}` }}>
                  <p style={{ color: t.ink, lineHeight: 1.8, fontSize: 15, margin: 0 }}>
                    {aboutBlock.body ||
                      hero.tagline ||
                      'Full-stack software engineer passionate about creating resilient, scalable web architectures and human-friendly user experiences.'}
                  </p>
                </div>
              </section>

              <section className="split-sec" style={{ marginBottom: 36 }}>
                <div className="split-sec-label" style={{ color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}>02. FEATURED PRODUCTION BUILDS</div>
                <h2 className="split-sec-title" style={{ color: t.ink, margin: '6px 0 16px', fontSize: 24 }}>Highlight Systems</h2>
                <div className="split-projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {projects.slice(0, 2).map((proj, i) => (
                    <div key={proj.id || i} className="split-proj-card" style={{ background: t.card, borderColor: t.border, padding: 20, borderRadius: 12, border: `1px solid ${t.border}` }}>
                      <div className="split-proj-top" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span className="split-proj-status" style={{ background: `${t.accent}22`, color: t.accent, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                          {proj.status || 'SHIPPED'}
                        </span>
                        <div className="split-proj-links" style={{ display: 'flex', gap: 10 }}>
                          {(proj.liveUrl || proj.demo) && (
                            <a href={proj.liveUrl || proj.demo} target="_blank" rel="noreferrer" style={{ color: t.accent, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                              Live Demo ↗
                            </a>
                          )}
                          {(proj.githubUrl || proj.github) && (
                            <a href={proj.githubUrl || proj.github} target="_blank" rel="noreferrer" style={{ color: t.muted, fontSize: 12, textDecoration: 'none' }}>
                              Code ↗
                            </a>
                          )}
                        </div>
                      </div>
                      <h3 className="split-proj-name" style={{ color: t.ink, fontSize: 17, margin: '0 0 6px' }}>{proj.title}</h3>
                      <p className="split-proj-desc" style={{ color: t.muted, fontSize: 13, lineHeight: 1.5, margin: '0 0 12px' }}>{proj.description}</p>
                      {proj.tech && (
                        <div className="split-proj-tags" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {proj.tech.map((tag, ti) => (
                            <span key={ti} className="split-tag-pill" style={{ background: t.bg, color: t.ink, borderColor: t.border, fontSize: 11, padding: '2px 6px', borderRadius: 4, border: `1px solid ${t.border}` }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="button button-lime"
                  style={{ marginTop: 18, background: t.accent, color: t.bg, border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => onChangePage?.('work')}
                >
                  View All {projects.length} Projects →
                </button>
              </section>

              {skillsBlock.categories && (
                <section className="split-sec">
                  <div className="split-sec-label" style={{ color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}>03. TECHNICAL TOOLKIT</div>
                  <h2 className="split-sec-title" style={{ color: t.ink, margin: '6px 0 16px', fontSize: 24 }}>Core Competencies</h2>
                  <div className="split-skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                    {skillsBlock.categories.map((cat, ci) => (
                      <div key={ci} style={{ background: t.card, border: `1px solid ${t.border}`, padding: 16, borderRadius: 10 }}>
                        <span style={{ color: t.accent, fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 8 }}>{cat.label}</span>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {(cat.items || []).map((it, ii) => (
                            <span key={ii} style={{ background: t.bg, color: t.ink, fontSize: 11, padding: '2px 8px', borderRadius: 4, border: `1px solid ${t.border}` }}>
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {/* ── Page: WORK ── */}
          {currentPage === 'work' && (
            <motion.div
              key="work"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="split-page-view"
            >
              <div style={{ marginBottom: 28 }}>
                <span className="split-sec-label" style={{ color: t.accent, fontSize: 11, fontWeight: 700 }}>02. PROJECT REGISTRY</span>
                <h1 style={{ color: t.ink, fontSize: 28, margin: '6px 0 8px' }}>Production Systems & Case Studies</h1>
                <p style={{ color: t.muted, fontSize: 14, margin: 0 }}>Every shipped application, open-source library, and engineering prototype.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {projects.map((proj, idx) => (
                  <div key={proj.id || idx} style={{ background: t.card, border: `1px solid ${t.border}`, padding: 24, borderRadius: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <span style={{ color: t.accent, fontSize: 12, fontWeight: 700 }}>PROJECT #{String(idx + 1).padStart(2, '0')}</span>
                        <h3 style={{ color: t.ink, margin: '4px 0', fontSize: 20 }}>{proj.title}</h3>
                        {proj.tag && <span style={{ color: t.muted, fontSize: 12 }}>{proj.tag}</span>}
                      </div>
                      {proj.status && (
                        <span style={{ background: `${t.accent}15`, color: t.accent, border: `1px solid ${t.accent}44`, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
                          {proj.status}
                        </span>
                      )}
                    </div>

                    <p style={{ color: t.muted, fontSize: 14, lineHeight: 1.6, margin: '12px 0' }}>{proj.description}</p>

                    {proj.highlights && (
                      <ul style={{ paddingLeft: 18, color: t.muted, fontSize: 13, lineHeight: 1.6, margin: '10px 0 16px' }}>
                        {proj.highlights.map((h, hi) => (
                          <li key={hi}>{h}</li>
                        ))}
                      </ul>
                    )}

                    {proj.tech && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                        {proj.tech.map((tItem, ti) => (
                          <span key={ti} style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.ink, fontSize: 11, padding: '2px 8px', borderRadius: 4 }}>
                            {tItem}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 12, borderTop: `1px solid ${t.border}`, paddingTop: 14 }}>
                      {(proj.liveUrl || proj.demo) && (
                        <a href={proj.liveUrl || proj.demo} target="_blank" rel="noreferrer" style={{ background: t.accent, color: t.bg, padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                          Live Demo ↗
                        </a>
                      )}
                      {(proj.githubUrl || proj.github) && (
                        <a href={proj.githubUrl || proj.github} target="_blank" rel="noreferrer" style={{ background: 'transparent', color: t.ink, border: `1px solid ${t.border}`, padding: '6px 14px', borderRadius: 6, fontSize: 12, textDecoration: 'none' }}>
                          GitHub Source
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Page: ABOUT ── */}
          {currentPage === 'about' && (
            <motion.div
              key="about"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="split-page-view"
            >
              <div style={{ marginBottom: 28 }}>
                <span className="split-sec-label" style={{ color: t.accent, fontSize: 11, fontWeight: 700 }}>03. BACKGROUND</span>
                <h1 style={{ color: t.ink, fontSize: 28, margin: '6px 0 8px' }}>Career Journey & Philosophy</h1>
              </div>

              <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 28, borderRadius: 14, marginBottom: 24 }}>
                <h3 style={{ color: t.accent, fontSize: 16, margin: '0 0 12px' }}>The Narrative</h3>
                <p style={{ color: t.ink, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                  {aboutBlock.body || 'I specialize in building durable digital products. With a solid foundation in computer science and full-stack development, I focus on clean code, systems architecture, and intuitive design.'}
                </p>
                {aboutBlock.highlight && (
                  <blockquote style={{ borderLeft: `3px solid ${t.accent}`, paddingLeft: 14, margin: '18px 0 0', color: t.muted, fontStyle: 'italic' }}>
                    "{aboutBlock.highlight}"
                  </blockquote>
                )}
              </div>

              {timelineBlock.items && timelineBlock.items.length > 0 && (
                <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 28, borderRadius: 14 }}>
                  <h3 style={{ color: t.accent, fontSize: 16, margin: '0 0 18px' }}>Experience & Education</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {timelineBlock.items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 16, borderBottom: idx < timelineBlock.items.length - 1 ? `1px solid ${t.border}` : 'none', paddingBottom: 14 }}>
                        <span style={{ color: t.accent, fontWeight: 700, minWidth: 90, fontSize: 13 }}>{it.year || it.date}</span>
                        <div>
                          <strong style={{ color: t.ink, fontSize: 15, display: 'block' }}>{it.role || it.title}</strong>
                          <span style={{ color: t.muted, fontSize: 13 }}>{it.company || it.institution}</span>
                          {it.description && <p style={{ color: t.muted, fontSize: 13, margin: '6px 0 0', lineHeight: 1.5 }}>{it.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Page: CONTACT ── */}
          {currentPage === 'contact' && (
            <motion.div
              key="contact"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="split-page-view"
            >
              <div style={{ marginBottom: 28 }}>
                <span className="split-sec-label" style={{ color: t.accent, fontSize: 11, fontWeight: 700 }}>04. COMMUNICATION</span>
                <h1 style={{ color: t.ink, fontSize: 28, margin: '6px 0 8px' }}>Get in Touch</h1>
                <p style={{ color: t.muted, fontSize: 14, margin: 0 }}>Send a direct message or connect across professional networks.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 26, borderRadius: 14 }}>
                  <h3 style={{ color: t.ink, fontSize: 18, marginTop: 0 }}>Direct Channels</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '16px 0 24px' }}>
                    {(hero.email || contactBlock.email) && (
                      <div>
                        <span style={{ color: t.muted, fontSize: 11, display: 'block' }}>EMAIL</span>
                        <a href={`mailto:${hero.email || contactBlock.email}`} style={{ color: t.accent, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                          {hero.email || contactBlock.email}
                        </a>
                      </div>
                    )}
                    {hero.location && (
                      <div>
                        <span style={{ color: t.muted, fontSize: 11, display: 'block' }}>LOCATION</span>
                        <span style={{ color: t.ink, fontSize: 14 }}>{hero.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 26, borderRadius: 14 }}>
                  <h3 style={{ color: t.ink, fontSize: 18, marginTop: 0 }}>Send Message</h3>
                  {formSent ? (
                    <div style={{ background: `${t.accent}15`, border: `1px solid ${t.accent}`, padding: 20, borderRadius: 10, textAlign: 'center' }}>
                      <strong style={{ color: t.ink, display: 'block' }}>Message Dispatched ✓</strong>
                      <p style={{ color: t.muted, fontSize: 13, margin: '6px 0 12px' }}>Thank you for reaching out.</p>
                      <button onClick={() => setFormSent(false)} style={{ background: t.accent, color: t.bg, border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                        Send Another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {formError && <div style={{ color: '#ef4444', fontSize: 12 }}>{formError}</div>}
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 6, color: t.ink, fontSize: 13 }}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 6, color: t.ink, fontSize: 13 }}
                        required
                      />
                      <textarea
                        rows={4}
                        placeholder="Message..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 6, color: t.ink, fontSize: 13 }}
                        required
                      />
                      <button type="submit" style={{ background: t.accent, color: t.bg, border: 'none', padding: '10px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>
                        Submit Message →
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
