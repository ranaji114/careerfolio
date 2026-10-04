import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOCK_TYPES } from '../data/defaultPortfolio';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 15 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.98, y: -10, transition: { duration: 0.2 } },
};

export default function CreatorShowcaseLayout({
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
    { id: 'home', label: 'Home' },
    { id: 'work', label: `Projects (${projects.length})` },
    { id: 'about', label: 'Story' },
    { id: 'contact', label: 'Connect' },
  ];

  return (
    <div
      className={`creator-layout-root template-${t.id}`}
      data-template={t.id}
      style={{
        background: t.bg,
        color: t.ink,
        fontFamily: t.font === 'mono' ? 'DM Mono, monospace' : 'Inter, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Background Radial Glow */}
      <div
        className="creator-glow-sphere"
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 900,
          height: 400,
          background: `radial-gradient(circle at 50% 0%, ${t.accent}20, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Floating Island Navbar ── */}
      <div className="creator-nav-wrapper" style={{ position: 'sticky', top: 16, zIndex: 50, padding: '0 20px', maxWidth: 840, margin: '0 auto', width: '100%' }}>
        <nav
          className="creator-floating-island"
          style={{
            background: `${t.card}dd`,
            borderColor: t.border,
            backdropFilter: 'blur(16px)',
            border: `1px solid ${t.border}`,
            borderRadius: 30,
            padding: '8px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          }}
        >
          <div className="creator-island-brand" onClick={() => onChangePage?.('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="creator-brand-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: t.accent }} />
            <span style={{ fontWeight: 700, color: t.ink, fontSize: 14 }}>{hero.name || 'Creator'}</span>
          </div>

          <div className="creator-island-links" style={{ display: 'flex', gap: 6 }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangePage?.(item.id)}
                style={{
                  background: currentPage === item.id ? `${t.accent}22` : 'transparent',
                  border: `1px solid ${currentPage === item.id ? `${t.accent}44` : 'transparent'}`,
                  borderRadius: 20,
                  padding: '4px 12px',
                  cursor: 'pointer',
                  color: currentPage === item.id ? t.accent : t.muted,
                  fontWeight: currentPage === item.id ? 700 : 500,
                  fontSize: 12,
                  transition: 'all 0.2s',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="creator-island-actions" style={{ display: 'flex', gap: 8 }}>
            {onOpenRecruiterHUD && (
              <button
                className="creator-scan-btn"
                style={{ background: t.accent, color: t.bg, border: 'none', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                onClick={onOpenRecruiterHUD}
              >
                Scan ⌘K
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* ── Main Dynamic Animated Page Container ── */}
      <main style={{ flex: 1, padding: '40px 20px 60px', maxWidth: 960, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {/* ════════════════ PAGE: HOME ════════════════ */}
          {currentPage === 'home' && (
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: 'flex', flexDirection: 'column', gap: 36 }}
            >
              {/* Hero Banner with Avatar */}
              <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto', padding: '20px 0' }}>
                {(hero.avatar || hero.avatarUrl) && (
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={hero.avatar || hero.avatarUrl}
                    alt={hero.name}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `3px solid ${t.accent}`,
                      boxShadow: `0 12px 30px ${t.accent}33`,
                      margin: '0 auto 16px',
                    }}
                  />
                )}
                <span style={{ display: 'inline-block', background: `${t.accent}18`, color: t.accent, border: `1px solid ${t.accent}44`, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                  ⚡ AVAILABLE FOR CONTRACTS & COLLABORATIONS
                </span>
                <h1 style={{ color: t.ink, fontSize: 'clamp(28px, 5vw, 44px)', margin: '0 0 12px', fontWeight: 800, lineHeight: 1.15 }}>
                  {hero.name || 'Your Name'}
                </h1>
                <p style={{ color: t.accent, fontSize: 18, fontWeight: 600, margin: '0 0 12px' }}>
                  {hero.role || 'Full-Stack Software Engineer & Digital Builder'}
                </p>
                {hero.tagline && (
                  <p style={{ color: t.muted, fontSize: 16, lineHeight: 1.6, margin: '0 0 24px' }}>
                    "{hero.tagline}"
                  </p>
                )}

                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onChangePage?.('work')}
                    style={{ background: t.accent, color: t.bg, border: 'none', padding: '12px 24px', borderRadius: 30, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                  >
                    View Flagship Work ({projects.length}) ↗
                  </button>
                  <button
                    onClick={() => onChangePage?.('contact')}
                    style={{ background: 'transparent', color: t.ink, border: `1px solid ${t.border}`, padding: '12px 22px', borderRadius: 30, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Get in Touch
                  </button>
                </div>
              </div>

              {/* Bio & Craft Card */}
              <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 32, borderRadius: 20 }}>
                <span style={{ color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>CREATIVE PHILOSOPHY</span>
                <h3 style={{ color: t.ink, fontSize: 20, margin: '6px 0 14px' }}>Building Systems with Substance</h3>
                <p style={{ color: t.muted, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                  {aboutBlock.body || 'I combine engineering rigor with design empathy to build software products that feel effortless and deliver real value.'}
                </p>
              </div>

              {/* Selected Projects Showcase */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                  <h2 style={{ color: t.ink, fontSize: 22, margin: 0, fontWeight: 800 }}>Featured Projects</h2>
                  <button onClick={() => onChangePage?.('work')} style={{ background: 'none', border: 'none', color: t.accent, fontWeight: 700, cursor: 'pointer' }}>
                    See all ({projects.length}) →
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                  {projects.slice(0, 3).map((p, i) => (
                    <motion.div
                      key={p.id || i}
                      whileHover={{ y: -4, borderColor: t.accent }}
                      style={{ background: t.card, border: `1px solid ${t.border}`, padding: 22, borderRadius: 16, transition: 'all 0.2s' }}
                    >
                      <span style={{ color: t.accent, fontSize: 11, fontWeight: 700 }}>{p.tag || `SYSTEM #${i + 1}`}</span>
                      <h3 style={{ color: t.ink, fontSize: 18, margin: '4px 0 8px' }}>{p.title}</h3>
                      <p style={{ color: t.muted, fontSize: 13, lineHeight: 1.5, margin: '0 0 14px' }}>{p.description}</p>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {(p.demo || p.liveUrl) && (
                          <a href={p.demo || p.liveUrl} target="_blank" rel="noreferrer" style={{ color: t.accent, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                            Demo ↗
                          </a>
                        )}
                        {(p.github || p.githubUrl) && (
                          <a href={p.github || p.githubUrl} target="_blank" rel="noreferrer" style={{ color: t.muted, fontSize: 12, textDecoration: 'none' }}>
                            Code
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════ PAGE: WORK ════════════════ */}
          {currentPage === 'work' && (
            <motion.div
              key="work"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <h1 style={{ color: t.ink, fontSize: 32, margin: '0 0 8px', fontWeight: 800 }}>Project Portfolio</h1>
                <p style={{ color: t.muted, fontSize: 15, margin: 0 }}>Full inventory of shipped web applications and developer tools.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                {projects.map((proj, idx) => (
                  <div key={proj.id || idx} style={{ background: t.card, border: `1px solid ${t.border}`, padding: 26, borderRadius: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ color: t.accent, fontSize: 11, fontWeight: 700 }}>PROJECT #{String(idx + 1).padStart(2, '0')}</span>
                        {proj.status && <span style={{ background: `${t.accent}15`, color: t.accent, border: `1px solid ${t.accent}44`, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>{proj.status}</span>}
                      </div>
                      <h3 style={{ color: t.ink, fontSize: 20, margin: '0 0 10px' }}>{proj.title}</h3>
                      <p style={{ color: t.muted, fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>{proj.description}</p>
                      {proj.tech && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                          {proj.tech.map((tc, ti) => (
                            <span key={ti} style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.ink, fontSize: 11, padding: '3px 8px', borderRadius: 6 }}>
                              {tc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 12, borderTop: `1px solid ${t.border}`, paddingTop: 14 }}>
                      {(proj.demo || proj.liveUrl) && (
                        <a href={proj.demo || proj.liveUrl} target="_blank" rel="noreferrer" style={{ background: t.accent, color: t.bg, padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                          Live Demo ↗
                        </a>
                      )}
                      {(proj.github || proj.githubUrl) && (
                        <a href={proj.github || proj.githubUrl} target="_blank" rel="noreferrer" style={{ background: 'transparent', color: t.ink, border: `1px solid ${t.border}`, padding: '6px 14px', borderRadius: 20, fontSize: 12, textDecoration: 'none' }}>
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ════════════════ PAGE: ABOUT ════════════════ */}
          {currentPage === 'about' && (
            <motion.div
              key="about"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
            >
              <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 32, borderRadius: 20 }}>
                <span style={{ color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}>THE STORY</span>
                <h1 style={{ color: t.ink, fontSize: 28, margin: '6px 0 16px', fontWeight: 800 }}>About & Experience</h1>
                <p style={{ color: t.muted, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                  {aboutBlock.body || 'I am a creator and engineer dedicated to crafting software products with care, precision, and purpose.'}
                </p>
              </div>

              {timelineBlock.items && timelineBlock.items.length > 0 && (
                <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 32, borderRadius: 20 }}>
                  <h3 style={{ color: t.accent, fontSize: 16, margin: '0 0 18px' }}>Milestone Timeline</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {timelineBlock.items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 18, borderBottom: idx < timelineBlock.items.length - 1 ? `1px solid ${t.border}` : 'none', paddingBottom: 14 }}>
                        <span style={{ color: t.accent, fontWeight: 700, minWidth: 80, fontSize: 13 }}>{it.year || it.date}</span>
                        <div>
                          <strong style={{ color: t.ink, fontSize: 15, display: 'block' }}>{it.role || it.title}</strong>
                          <span style={{ color: t.muted, fontSize: 13 }}>{it.company || it.institution}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 32, borderRadius: 20 }}>
                <span style={{ color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}>CONNECT</span>
                <h1 style={{ color: t.ink, fontSize: 28, margin: '6px 0 14px', fontWeight: 800 }}>Start a Project</h1>
                <p style={{ color: t.muted, fontSize: 15, lineHeight: 1.7, margin: '0 0 24px' }}>
                  {contactBlock.body || 'Let us discuss how we can work together on your next product, feature, or platform.'}
                </p>

                {(hero.email || contactBlock.email) && (
                  <div style={{ marginBottom: 18 }}>
                    <span style={{ color: t.muted, fontSize: 11, display: 'block', marginBottom: 4 }}>EMAIL</span>
                    <a href={`mailto:${hero.email || contactBlock.email}`} style={{ color: t.accent, fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>
                      {hero.email || contactBlock.email}
                    </a>
                  </div>
                )}
                {hero.location && (
                  <div>
                    <span style={{ color: t.muted, fontSize: 11, display: 'block', marginBottom: 4 }}>LOCATION</span>
                    <span style={{ color: t.ink, fontSize: 14 }}>{hero.location}</span>
                  </div>
                )}
              </div>

              <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 32, borderRadius: 20 }}>
                <h3 style={{ color: t.ink, fontSize: 20, margin: '0 0 16px', fontWeight: 700 }}>Send Note</h3>
                {formSent ? (
                  <div style={{ background: `${t.accent}15`, border: `1px solid ${t.accent}`, padding: 24, borderRadius: 12, textAlign: 'center' }}>
                    <strong style={{ color: t.ink, fontSize: 16, display: 'block' }}>Dispatched ✓</strong>
                    <p style={{ color: t.muted, fontSize: 13, margin: '6px 0 12px' }}>Thank you for reaching out.</p>
                    <button onClick={() => setFormSent(false)} style={{ background: t.accent, color: t.bg, border: 'none', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
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
                      style={{ padding: '10px 14px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.ink, fontSize: 13 }}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ padding: '10px 14px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.ink, fontSize: 13 }}
                      required
                    />
                    <textarea
                      rows={4}
                      placeholder="Your Message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ padding: '10px 14px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.ink, fontSize: 13 }}
                      required
                    />
                    <button type="submit" style={{ background: t.accent, color: t.bg, border: 'none', padding: '12px', borderRadius: 20, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
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
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: '24px 20px', background: t.card, marginTop: 'auto', textAlign: 'center' }}>
        <span style={{ color: t.muted, fontSize: 13 }}>
          © {new Date().getFullYear()} {hero.name} {isPro ? '· Creator Showcase' : '· Powered by Careerfolio'}
        </span>
      </footer>
    </div>
  );
}
