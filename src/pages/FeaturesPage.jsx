import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CORE_FEATURES = [
  {
    id: 'ai-synthesis',
    icon: '⚡',
    badge: 'AI POWERED',
    badgeColor: '#7AF844',
    title: '1-Click AI Portfolio Synthesis Engine',
    subtitle: 'From messy raw notes to a polished 4-page engineering presence in under 60 seconds.',
    description: `Writing self-bios and project breakdowns in fluent, recruiter-ready English is hard — especially for college students, freshers, and non-native speakers. Our specialized career AI analyses your raw tech stack, coursework, or past projects and instantly writes compelling engineering case studies, measurable impact bullet points, and crisp objective statements.`,
    highlights: [
      'Tailored persona presets: College Fresher, Full-Stack Dev, Frontend Specialist, AI/ML Researcher',
      'Automatic generation of 4 full pages (Home, Work case studies, About story, Contact)',
      'Editable at any point directly from the live visual studio',
      'Instant synchronization with your matching 1-page ATS resume',
    ],
    mockPreview: {
      type: 'ai-demo',
      input: 'Made a library management app in React and Node with MongoDB. Students can borrow books and admins get alerts.',
      output: '⚡ Synthesized: Architectural Case Study — Real-time Distributed Asset Tracking System with JWT role-based access control and automated Redis eviction queues.',
    },
  },
  {
    id: 'ats-resume',
    icon: '📄',
    badge: 'CAREER ESSENTIAL',
    badgeColor: '#44F868',
    title: 'Verified 1-Page ATS Resume Studio',
    subtitle: 'Strict single-page A4 canvas with guaranteed ATS parser compliance.',
    description: `Recruiters reject 75% of resumes before a human ever reads them due to broken formatting, multi-page overflow, and incompatible graphic columns. Careerfolio's resume engine strictly enforces single-page A4 bounds with semantic headers, machine-readable typography, and live PDF export.`,
    highlights: [
      'Strict A4 single-page boundary enforcement — zero awkward page overflows',
      'Live synchronized data from your portfolio projects, work history, and skill badges',
      'Tested against Taleo, Workday, Lever, and Greenhouse ATS parsing algorithms',
      '1-Click instant vector PDF download ready for job applications',
    ],
    mockPreview: {
      type: 'resume-card',
      stats: '100% Single Page · 0 Spills · High Parsing Score',
    },
  },
  {
    id: 'photo-upload',
    icon: '📸',
    badge: 'DIRECT UPLOAD',
    badgeColor: '#D4F844',
    title: 'Direct Computer Photo & Avatar Engine',
    subtitle: 'Upload high-resolution headshots straight from your computer with zero third-party uploaders.',
    description: `No need to host your images on Imgur or external cloud storage. Simply click to select a photo directly from your PC or laptop. Careerfolio automatically frames, crops, and optimizes your headshot with responsive border accents across every template layout.`,
    highlights: [
      'Local-first Base64 image caching directly in your browser',
      'Automatic circular, rounded, and bento-style portrait framing',
      'Integrated in Hero Editor and 1-Click AI Generator modal',
      'Works seamlessly on desktop, tablet, and mobile browsers',
    ],
    mockPreview: {
      type: 'photo-demo',
      label: 'Instant Local PC Framing',
    },
  },
  {
    id: 'recruiter-hud',
    icon: '⌘K',
    badge: 'EXCLUSIVE INNOVATION',
    badgeColor: '#7AF844',
    title: 'Recruiter Quick-Scan HUD (⌘K)',
    subtitle: 'The 15-second tl;dr interface designed specifically for fast-paced hiring managers.',
    description: `Hiring managers spend an average of 6 seconds skimming portfolios. Careerfolio includes an interactive floating HUD overlay that recruiters can trigger with keyboard shortcut ⌘K or a single tap. It displays a fast summary of your core strengths, top 3 shipped repositories, and direct contact buttons.`,
    highlights: [
      'Instant ⌘K keyboard shortcut and mobile floating action pill',
      'Synthesized overview of primary tech stack and years of focus',
      'Direct 1-click email, phone call, and ATS resume view triggers',
      'Proven to increase recruiter engagement and response rates',
    ],
    mockPreview: {
      type: 'hud-demo',
      keys: 'Press ⌘K or Ctrl+K anywhere to test',
    },
  },
  {
    id: 'multipage-routing',
    icon: '🌐',
    badge: 'MODERN ARCHITECTURE',
    badgeColor: '#44F868',
    title: 'True Multi-Page Isolated Architecture',
    subtitle: 'Not a boring endless one-page scroll. Independent pages with Framer Motion transitions.',
    description: `Most portfolio builders cram everything into a single clunky vertical scroll. Careerfolio gives you true multi-page isolation (` + '`/`' + `, ` + '`/work`' + `, ` + '`/about`' + `, ` + '`/contact`' + `) with smooth client-side transitions and dedicated views for your in-depth case studies.`,
    highlights: [
      '4 distinct, isolated page routes with full SEO and shareable permalinks',
      'Working interactive contact form that saves messages directly in local storage',
      'Framer Motion spring physics and micro-animations on every interaction',
      'Standalone website mode with 1-click publishing to your unique public URL',
    ],
    mockPreview: {
      type: 'routing-demo',
      pages: ['Home', 'Work', 'About', 'Contact'],
    },
  },
  {
    id: 'github-sync',
    icon: '🐙',
    badge: 'DEVELOPER SYNC',
    badgeColor: '#D4F844',
    title: '1-Click GitHub & LinkedIn Sync',
    subtitle: 'Effortlessly import your public repositories, star counts, and tech badges.',
    description: `Never waste time copy-pasting repository links manually. Enter your GitHub username to instantly pull your top pinned repositories, language breakdowns, star metrics, and README highlights directly into your portfolio case studies.`,
    highlights: [
      'Fetches live repository stats, commit timelines, and topic tags',
      'Generates automated architectural badges (React, Node, Go, Rust, Python, etc.)',
      'LinkedIn experience sync ready for fast profile imports',
      'Fully editable after import to customize descriptions and screenshots',
    ],
    mockPreview: {
      type: 'sync-demo',
      badge: 'Public API Integration',
    },
  },
];

export default function FeaturesPage({
  user,
  onCreatePortfolio,
  onRequireAuth,
  onUpgrade,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <main className="features-page-root">
      {/* ── Hero Section ── */}
      <section className="feat-hero">
        <div className="feat-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="feat-kicker">✦ PLATFORM CAPABILITIES</span>
            <h1>Engineered for talent that wants to make an impression.</h1>
            <p className="feat-hero-desc">
              Careerfolio is not just another website template. It is an end-to-end career leverage platform
              combining bespoke multi-page websites, verified 1-page ATS resumes, and AI synthesis.
            </p>
          </motion.div>

          <div className="feat-hero-actions">
            <button
              className="button button-lime"
              onClick={() => {
                if (!user) {
                  onRequireAuth('Create a free account to start building your portfolio & resume.');
                  return;
                }
                onCreatePortfolio();
              }}
            >
              Start Building for Free <span>→</span>
            </button>
            <button
              className="button button-outline"
              onClick={() => onNavigate('templates')}
            >
              Browse 18+ Templates <span>↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Feature Deep Dive Sections ── */}
      <section className="feat-list-section">
        <div className="feat-list-container">
          {CORE_FEATURES.map((feat, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.article
                key={feat.id}
                id={feat.id}
                className={`feat-item-card ${isEven ? 'layout-left' : 'layout-right'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
              >
                {/* Text Content Column */}
                <div className="feat-item-content">
                  <div className="feat-item-header">
                    <span
                      className="feat-item-badge"
                      style={{
                        borderColor: feat.badgeColor + '66',
                        color: feat.badgeColor,
                        background: feat.badgeColor + '15',
                      }}
                    >
                      {feat.badge}
                    </span>
                    <span className="feat-item-num">0{index + 1}</span>
                  </div>

                  <h2 className="feat-item-title">{feat.title}</h2>
                  <p className="feat-item-sub">{feat.subtitle}</p>
                  <p className="feat-item-desc">{feat.description}</p>

                  <ul className="feat-item-highlights">
                    {feat.highlights.map((h, i) => (
                      <li key={i}>
                        <span className="feat-check" style={{ color: feat.badgeColor }}>✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="feat-item-cta">
                    <button
                      className="button button-dark"
                      onClick={() => {
                        if (!user) {
                          onRequireAuth('Sign in or register to test this feature.');
                          return;
                        }
                        onCreatePortfolio();
                      }}
                    >
                      Try {feat.title.split(' ')[0]} Now →
                    </button>
                  </div>
                </div>

                {/* Visual Graphic / Interactive Mockup Column */}
                <div className="feat-item-visual">
                  <div
                    className="feat-visual-box"
                    style={{ borderColor: feat.badgeColor + '33' }}
                  >
                    <div className="feat-box-topbar">
                      <div className="feat-box-dots">
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="feat-box-id">{feat.id}.engine</span>
                    </div>

                    <div className="feat-box-body">
                      {feat.mockPreview.type === 'ai-demo' && (
                        <div className="feat-ai-preview">
                          <div className="feat-ai-input-box">
                            <span className="feat-label">USER RAW INPUT:</span>
                            <p>"{feat.mockPreview.input}"</p>
                          </div>
                          <div className="feat-ai-arrow">↓ AI Synthesis (300ms)</div>
                          <div className="feat-ai-output-box">
                            <span className="feat-label" style={{ color: '#38bdf8' }}>STRUCTURED RESULT:</span>
                            <p>{feat.mockPreview.output}</p>
                          </div>
                        </div>
                      )}

                      {feat.mockPreview.type === 'resume-card' && (
                        <div className="feat-resume-preview">
                          <div className="feat-res-sheet">
                            <div className="feat-res-header-bar" />
                            <div className="feat-res-line short" />
                            <div className="feat-res-grid">
                              <div className="feat-res-col" />
                              <div className="feat-res-col wide" />
                            </div>
                            <div className="feat-res-line" />
                            <div className="feat-res-badge-strip">
                              <span style={{ background: '#46f6a5', color: '#000' }}>ATS OPTIMIZED</span>
                              <span>STRICT 1-PAGE A4</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {feat.mockPreview.type === 'photo-demo' && (
                        <div className="feat-photo-preview">
                          <div className="feat-avatar-circle">
                            <span style={{ fontSize: 36 }}>📸</span>
                          </div>
                          <div className="feat-photo-status">
                            <span className="feat-dot-live" />
                            <span>PC Local FileReader (Base64) Cached</span>
                          </div>
                        </div>
                      )}

                      {feat.mockPreview.type === 'hud-demo' && (
                        <div className="feat-hud-preview">
                          <div className="feat-hud-window">
                            <div className="feat-hud-bar">
                              <span>⚡ RECRUITER QUICK-SCAN HUD</span>
                              <kbd>ESC</kbd>
                            </div>
                            <div className="feat-hud-rows">
                              <div className="feat-hud-item">
                                <strong>Top Shipped Systems:</strong>
                                <span>High-Throughput WebSocket Cluster (10k req/s)</span>
                              </div>
                              <div className="feat-hud-item">
                                <strong>Core Tech Stack:</strong>
                                <span>React 19 · Node.js · TypeScript · PostgreSQL</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {feat.mockPreview.type === 'routing-demo' && (
                        <div className="feat-routing-preview">
                          <div className="feat-route-tabs">
                            {feat.mockPreview.pages.map((p, i) => (
                              <div key={p} className={`feat-route-tab ${i === 0 ? 'active' : ''}`}>
                                <span>/{p.toLowerCase()}</span>
                              </div>
                            ))}
                          </div>
                          <div className="feat-route-screen">
                            <span className="feat-route-anim">✦ Framer Motion Transitions Active</span>
                          </div>
                        </div>
                      )}

                      {feat.mockPreview.type === 'sync-demo' && (
                        <div className="feat-sync-preview">
                          <div className="feat-sync-badge">
                            <span>🐙 github.com/user/project</span>
                            <strong>★ 142 Stars · TypeScript</strong>
                          </div>
                          <div className="feat-sync-pill">
                            <span>✓ Auto-imported case study</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ── Bottom Call To Action ── */}
      <section className="feat-cta-strip">
        <motion.div
          className="feat-cta-inner"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="feat-kicker">GET STARTED TODAY</span>
          <h2>Build your complete portfolio and ATS resume in minutes.</h2>
          <p>Join thousands of students, developers, and creators leveraging Careerfolio.</p>
          <div className="feat-cta-buttons">
            <button
              className="button button-lime"
              onClick={() => {
                if (!user) {
                  onRequireAuth('Create a free account to get started.');
                  return;
                }
                onCreatePortfolio();
              }}
            >
              Create Free Account & Portfolio <span>→</span>
            </button>
            <button
              className="button button-outline"
              onClick={() => onNavigate('pricing')}
            >
              View Membership Pricing
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
