import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { templates } from '../data/templates';

const CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: '✦', desc: 'Browse all 18+ handcrafted layouts' },
  { id: 'student', label: 'Students & Freshers', icon: '🎓', desc: 'Coursework, projects, and objective-driven layouts' },
  { id: 'developer', label: 'Software Engineers', icon: '⚡', desc: 'Code-first, CLI terminals, and system architecture grids' },
  { id: 'designer', label: 'Designers & UI/UX', icon: '🎨', desc: 'Visual case studies, bento decks, and asymmetric galleries' },
  { id: 'minimal', label: 'Swiss & Minimalist', icon: '📐', desc: 'Clean typography, catalog indexes, and quiet editorial styles' },
  { id: 'pro', label: 'Pro Bespoke ✦', icon: '✨', desc: 'Animated neon cyberpunk, quantum nebula, and luxury layouts' },
];

export default function TemplatesPage({
  user,
  onUseTemplate,
  onPreviewTemplate,
  onOpenAI,
  onRequireAuth,
  onUpgrade,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewModalTemplate, setPreviewModalTemplate] = useState(null);

  // Filter logic
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tone.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'pro') return t.premium;
    if (selectedCategory === 'student') {
      return (
        t.type.toLowerCase().includes('student') ||
        t.id === 'canvas' ||
        t.id === 'folio' ||
        t.id === 'signal' ||
        t.layoutType === 'split'
      );
    }
    if (selectedCategory === 'developer') {
      return (
        t.type.toLowerCase().includes('dev') ||
        t.type.toLowerCase().includes('system') ||
        t.layoutType === 'terminal' ||
        t.layoutType === 'bento' ||
        t.id === 'obsidian' ||
        t.id === 'noir' ||
        t.id === 'cyberpunk' ||
        t.id === 'nordic'
      );
    }
    if (selectedCategory === 'designer') {
      return (
        t.type.toLowerCase().includes('design') ||
        t.type.toLowerCase().includes('visual') ||
        t.type.toLowerCase().includes('creator') ||
        t.id === 'lavender' ||
        t.id === 'grid' ||
        t.id === 'orbit' ||
        t.id === 'frame'
      );
    }
    if (selectedCategory === 'minimal') {
      return (
        t.type.toLowerCase().includes('minimal') ||
        t.type.toLowerCase().includes('writer') ||
        t.type.toLowerCase().includes('consult') ||
        t.id === 'mono' ||
        t.id === 'paper' ||
        t.id === 'copper' ||
        t.id === 'swissluxe' ||
        t.layoutType === 'minimal'
      );
    }
    return true;
  });

  const handleAction = (template) => {
    if (!user) {
      onRequireAuth('Please sign in or create a free account to use this template.');
      return;
    }
    if (template.premium && user.plan === 'free') {
      onUpgrade();
      return;
    }
    onUseTemplate(template);
  };

  return (
    <main className="templates-page-root">
      {/* ── Top Header & Hero ── */}
      <section className="tmpl-hero">
        <div className="tmpl-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="tmpl-kicker">✦ THE ARCHITECTURAL GALLERY</span>
            <h1>Every template is a complete, distinct engineering website.</h1>
            <p className="tmpl-hero-desc">
              Not just color tweaks. Each layout has custom multi-page navigation, bespoke typography,
              micro-interactions, and instant synchronization with your verified 1-page ATS resume.
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="tmpl-search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search templates by name, style (e.g. Bento, Terminal, Minimal, Student)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="tmpl-search-clear" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Category Filter Strip ── */}
      <section className="tmpl-filters-wrap">
        <div className="tmpl-filters-scroll">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`tmpl-filter-pill ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="tmpl-cat-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Template Grid ── */}
      <section className="tmpl-grid-section">
        <div className="tmpl-grid-header">
          <div>
            <h2>
              {CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Templates'}
              <span className="tmpl-count-badge">{filteredTemplates.length} layouts</span>
            </h2>
            <p className="tmpl-grid-sub">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.desc}
            </p>
          </div>

          <div className="tmpl-header-actions">
            <button
              className="button button-dark"
              onClick={() => {
                if (!user) {
                  onRequireAuth('Sign in to synthesize your portfolio with AI.');
                  return;
                }
                onOpenAI();
              }}
            >
              ⚡ Synthesize with AI
            </button>
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="tmpl-empty-state">
            <div className="tmpl-empty-icon">🔍</div>
            <h3>No templates match "{searchQuery}"</h3>
            <p>Try searching for different keywords or clear your active filters.</p>
            <button
              className="button button-outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            className="tmpl-cards-grid"
            layout
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {filteredTemplates.map((template) => (
              <motion.article
                key={template.id}
                className={`tmpl-card ${template.premium ? 'tmpl-card-pro' : ''}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                {/* Visual Preview Header */}
                <div
                  className="tmpl-card-preview"
                  style={{
                    background: template.bg,
                    color: template.ink,
                    borderColor: template.border || 'rgba(255,255,255,0.08)',
                  }}
                  onClick={() => setPreviewModalTemplate(template)}
                >
                  <div className="tmpl-preview-topbar">
                    <div className="tmpl-mac-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="tmpl-preview-arch">
                      {template.layoutType.toUpperCase()} · 4 PAGES
                    </span>
                    {template.premium ? (
                      <span className="tmpl-badge-pro">PRO ✦</span>
                    ) : (
                      <span className="tmpl-badge-free">FREE</span>
                    )}
                  </div>

                  {/* Mock Wireframe Inside Preview */}
                  <div className="tmpl-wireframe-body">
                    <div className="tmpl-wire-hero">
                      <div
                        className="tmpl-wire-avatar"
                        style={{ background: template.accent }}
                      />
                      <div className="tmpl-wire-lines">
                        <div
                          className="tmpl-wire-title"
                          style={{ color: template.ink }}
                        >
                          {template.name}
                        </div>
                        <div
                          className="tmpl-wire-desc"
                          style={{ color: template.muted || template.ink }}
                        >
                          {template.tone}
                        </div>
                      </div>
                    </div>

                    <div className="tmpl-wire-pills">
                      {['Home', 'Work', 'About', 'Contact'].map((p) => (
                        <span
                          key={p}
                          style={{
                            borderColor: template.accent + '44',
                            color: template.ink,
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Accent Glow Circle */}
                  <div
                    className="tmpl-preview-glow"
                    style={{ background: template.accent }}
                  />
                </div>

                {/* Card Meta & Actions */}
                <div className="tmpl-card-info">
                  <div className="tmpl-card-meta-top">
                    <div>
                      <span className="tmpl-card-type">{template.type}</span>
                      <h3 className="tmpl-card-title">{template.name}</h3>
                    </div>
                    {/* Color Swatch */}
                    <div className="tmpl-swatch-row" title="Template Color Palette">
                      <span style={{ background: template.bg }} />
                      <span style={{ background: template.card }} />
                      <span style={{ background: template.accent }} />
                    </div>
                  </div>

                  <p className="tmpl-card-tone">{template.tone}</p>

                  <div className="tmpl-card-footer">
                    <button
                      className="tmpl-btn-preview"
                      onClick={() => onPreviewTemplate(template)}
                    >
                      👁 Live Preview
                    </button>
                    <button
                      className={`button ${template.premium ? 'button-lime' : 'button-dark'} tmpl-btn-use`}
                      onClick={() => handleAction(template)}
                    >
                      {template.premium ? 'Use Pro Layout ✦' : 'Use Template →'}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </section>

      {/* ── Quick Preview Modal ── */}
      <AnimatePresence>
        {previewModalTemplate && (
          <div
            className="tmpl-modal-overlay"
            onClick={() => setPreviewModalTemplate(null)}
          >
            <motion.div
              className="tmpl-modal-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="tmpl-modal-close"
                onClick={() => setPreviewModalTemplate(null)}
              >
                ✕
              </button>
              <div
                className="tmpl-modal-banner"
                style={{
                  background: previewModalTemplate.bg,
                  color: previewModalTemplate.ink,
                }}
              >
                <span className="tmpl-badge-pro" style={{ background: previewModalTemplate.accent, color: '#000' }}>
                  {previewModalTemplate.premium ? 'PRO ARCHITECTURE' : 'FREE ARCHITECTURE'}
                </span>
                <h2>{previewModalTemplate.name}</h2>
                <p>{previewModalTemplate.tone}</p>
              </div>

              <div className="tmpl-modal-details">
                <div className="tmpl-detail-row">
                  <div>
                    <strong>Category / Audience:</strong>
                    <span>{previewModalTemplate.type}</span>
                  </div>
                  <div>
                    <strong>Layout Structure:</strong>
                    <span>{previewModalTemplate.layoutType.toUpperCase()} Engine (Home, Work, About, Contact)</span>
                  </div>
                  <div>
                    <strong>Font Pair:</strong>
                    <span>{previewModalTemplate.font.toUpperCase()} Modern Pro</span>
                  </div>
                </div>

                <div className="tmpl-modal-actions">
                  <button
                    className="button button-outline"
                    onClick={() => {
                      const t = previewModalTemplate;
                      setPreviewModalTemplate(null);
                      onPreviewTemplate(t);
                    }}
                  >
                    Launch Interactive Demo
                  </button>
                  <button
                    className="button button-lime"
                    onClick={() => {
                      const t = previewModalTemplate;
                      setPreviewModalTemplate(null);
                      handleAction(t);
                    }}
                  >
                    Select This Template →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
