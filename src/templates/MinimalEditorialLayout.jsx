import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOCK_TYPES } from '../data/defaultPortfolio';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function MinimalEditorialLayout({
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
    { id: 'home', label: '[01. Overview]' },
    { id: 'work', label: `[02. Works (${projects.length})]` },
    { id: 'about', label: '[03. Bio & Timeline]' },
    { id: 'contact', label: '[04. Connect]' },
  ];

  return (
    <div
      className={`minimal-layout-root template-${t.id}`}
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
      <div className="minimal-container" style={{ maxWidth: 960, margin: '0 auto', width: '100%', padding: '32px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* ── Top Meta Rule Bar ── */}
        <header className="minimal-header" style={{ borderColor: t.border, paddingBottom: 20, marginBottom: 28, borderBottom: `1px solid ${t.border}` }}>
          <div className="minimal-top-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="minimal-index-tag" style={{ color: t.muted, fontSize: 11, fontWeight: 700 }}>
                INDEX / {new Date().getFullYear()}
              </span>
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
                    fontWeight: currentPage === item.id ? 800 : 500,
                    fontSize: 12,
                    textDecoration: currentPage === item.id ? 'underline' : 'none',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {onOpenRecruiterHUD && (
              <button
                className="minimal-hud-btn"
                style={{ color: t.accent, borderColor: t.border, background: t.card, padding: '4px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                onClick={onOpenRecruiterHUD}
              >
                Scan Profile (⌘K)
              </button>
            )}
          </div>
        </header>

        {/* ── Animated Page View ── */}
        <main style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            {/* ── Page: HOME ── */}
            {currentPage === 'home' && (
              <motion.div
                key="home"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div style={{ display: 'flex', gap: 28, alignItems: 'center', marginBottom: 32 }}>
                  {(hero.avatar || hero.avatarUrl) && (
                    <img
                      src={hero.avatar || hero.avatarUrl}
                      alt={hero.name}
                      style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${t.accent}` }}
                    />
                  )}
                  <div>
                    <h1 className="minimal-author-name" style={{ color: t.ink, fontSize: 32, margin: '0 0 6px', fontWeight: 700 }}>
                      {hero.name || 'Author & Technologist'}
                    </h1>
                    <p className="minimal-author-title" style={{ color: t.accent, fontSize: 16, margin: 0, fontWeight: 600 }}>
                      {hero.role || 'Independent Software Consultant & Writer'}
                    </p>
                    {hero.location && <span style={{ color: t.muted, fontSize: 13, marginTop: 4, display: 'block' }}>📍 {hero.location}</span>}
                  </div>
                </div>

                {hero.tagline && (
                  <p style={{ color: t.ink, fontSize: 18, fontStyle: 'italic', lineHeight: 1.6, borderLeft: `2px solid ${t.accent}`, paddingLeft: 16, margin: '0 0 28px' }}>
                    "{hero.tagline}"
                  </p>
                )}

                <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 24, borderRadius: 8, marginBottom: 32 }}>
                  <h3 style={{ color: t.accent, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>Objective & Discipline</h3>
                  <p style={{ color: t.ink, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                    {aboutBlock.body || 'I build thoughtful digital products with a focus on code clarity, structural ergonomics, and human delight.'}
                  </p>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                    <h3 style={{ color: t.ink, fontSize: 18, margin: 0 }}>Selected Publications & Builds</h3>
                    <button onClick={() => onChangePage?.('work')} style={{ background: 'none', border: 'none', color: t.accent, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                      View all ({projects.length}) →
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {projects.slice(0, 3).map((p, i) => (
                      <div key={p.id || i} style={{ borderBottom: `1px solid ${t.border}`, paddingBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: t.ink, fontSize: 15 }}>{p.title}</strong>
                          <span style={{ color: t.muted, fontSize: 13, marginLeft: 10 }}>{p.tag || p.description?.slice(0, 60)}</span>
                        </div>
                        {(p.demo || p.liveUrl) && (
                          <a href={p.demo || p.liveUrl} target="_blank" rel="noreferrer" style={{ color: t.accent, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                            View ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {skillsBlock.categories && (
                  <div>
                    <h3 style={{ color: t.ink, fontSize: 16, marginBottom: 12 }}>Core Tech Stack</h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {skillsBlock.categories.flatMap((c) => c.items || []).map((s, idx) => (
                        <span key={idx} style={{ background: t.card, border: `1px solid ${t.border}`, color: t.ink, padding: '3px 8px', borderRadius: 4, fontSize: 12 }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
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
              >
                <div style={{ marginBottom: 24 }}>
                  <h1 style={{ color: t.ink, fontSize: 26, margin: '0 0 6px' }}>Project Catalog</h1>
                  <p style={{ color: t.muted, fontSize: 14, margin: 0 }}>Full index of open-source libraries, production systems, and design case studies.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {projects.map((proj, idx) => (
                    <div key={proj.id || idx} style={{ background: t.card, border: `1px solid ${t.border}`, padding: 22, borderRadius: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <h3 style={{ color: t.ink, margin: 0, fontSize: 18 }}>{proj.title}</h3>
                        {proj.status && <span style={{ color: t.accent, fontSize: 11, fontWeight: 700 }}>[{proj.status}]</span>}
                      </div>
                      <p style={{ color: t.muted, fontSize: 14, lineHeight: 1.6, margin: '0 0 14px' }}>{proj.description}</p>
                      <div style={{ display: 'flex', gap: 14 }}>
                        {(proj.demo || proj.liveUrl) && (
                          <a href={proj.demo || proj.liveUrl} target="_blank" rel="noreferrer" style={{ color: t.accent, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                            Visit Live Demo ↗
                          </a>
                        )}
                        {(proj.github || proj.githubUrl) && (
                          <a href={proj.github || proj.githubUrl} target="_blank" rel="noreferrer" style={{ color: t.muted, fontSize: 12, textDecoration: 'none' }}>
                            Source Code ↗
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
              >
                <h1 style={{ color: t.ink, fontSize: 26, margin: '0 0 16px' }}>Biography & Trajectory</h1>
                <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 26, borderRadius: 8, marginBottom: 24 }}>
                  <p style={{ color: t.ink, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                    {aboutBlock.body || 'I build software, explore foundational systems concepts, and turn technical curiosity into reliable software products.'}
                  </p>
                </div>

                {timelineBlock.items && timelineBlock.items.length > 0 && (
                  <div>
                    <h3 style={{ color: t.ink, fontSize: 18, marginBottom: 16 }}>Chronology</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {timelineBlock.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: 16, borderBottom: `1px solid ${t.border}`, paddingBottom: 12 }}>
                          <span style={{ color: t.accent, minWidth: 80, fontSize: 13, fontWeight: 700 }}>{it.year || it.date}</span>
                          <div>
                            <strong style={{ color: t.ink, fontSize: 14 }}>{it.role || it.title}</strong>
                            <span style={{ color: t.muted, fontSize: 13, marginLeft: 8 }}>{it.company || it.institution}</span>
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
              >
                <h1 style={{ color: t.ink, fontSize: 26, margin: '0 0 16px' }}>Direct Correspondence</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                  <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 24, borderRadius: 8 }}>
                    <h3 style={{ color: t.ink, fontSize: 16, margin: '0 0 12px' }}>Coordinates</h3>
                    {(hero.email || contactBlock.email) && (
                      <div style={{ marginBottom: 14 }}>
                        <span style={{ color: t.muted, fontSize: 11, display: 'block' }}>EMAIL</span>
                        <a href={`mailto:${hero.email || contactBlock.email}`} style={{ color: t.accent, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                          {hero.email || contactBlock.email}
                        </a>
                      </div>
                    )}
                    {hero.location && (
                      <div>
                        <span style={{ color: t.muted, fontSize: 11, display: 'block' }}>LOCATION</span>
                        <span style={{ color: t.ink, fontSize: 13 }}>{hero.location}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: 24, borderRadius: 8 }}>
                    <h3 style={{ color: t.ink, fontSize: 16, margin: '0 0 12px' }}>Send Note</h3>
                    {formSent ? (
                      <div style={{ color: t.accent, fontSize: 14 }}>Message successfully transmitted. Thank you.</div>
                    ) : (
                      <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {formError && <div style={{ color: '#ef4444', fontSize: 12 }}>{formError}</div>}
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          style={{ padding: '8px 12px', background: t.bg, border: `1px solid ${t.border}`, color: t.ink, fontSize: 13, borderRadius: 4 }}
                          required
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          style={{ padding: '8px 12px', background: t.bg, border: `1px solid ${t.border}`, color: t.ink, fontSize: 13, borderRadius: 4 }}
                          required
                        />
                        <textarea
                          rows={3}
                          placeholder="Message..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          style={{ padding: '8px 12px', background: t.bg, border: `1px solid ${t.border}`, color: t.ink, fontSize: 13, borderRadius: 4 }}
                          required
                        />
                        <button type="submit" style={{ background: t.accent, color: t.bg, border: 'none', padding: '8px 14px', borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}>
                          Transmit →
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer style={{ borderTop: `1px solid ${t.border}`, paddingTop: 20, marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: t.muted, fontSize: 12 }}>
          <span>© {new Date().getFullYear()} {hero.name}</span>
          <div style={{ display: 'flex', gap: 14 }}>
            {navItems.map((item) => (
              <button key={item.id} onClick={() => onChangePage?.(item.id)} style={{ background: 'none', border: 'none', color: t.muted, fontSize: 11, cursor: 'pointer' }}>
                {item.label}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
