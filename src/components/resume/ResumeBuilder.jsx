import React, { useState, useMemo } from 'react';
import { RESUME_TEMPLATES, freeResumeTemplateIds } from '../../data/resumeTemplates';
import ResumeRenderer from './ResumeTemplates';
import { computeATSScore, extractPortfolioDataForResume } from '../../utils/resumeHelpers';

export default function ResumeBuilder({
  portfolio,
  isPro,
  onUpdatePortfolio,
  onUpgrade,
  onBack,
}) {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'templates' | 'formatting' | 'ats'
  const [activeSection, setActiveSection] = useState('personal'); // 'personal' | 'summary' | 'skills' | 'experience' | 'projects' | 'education'
  const [exporting, setExporting] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1);

  // Resume data guaranteed
  const resumeData = useMemo(() => {
    return portfolio?.resume || extractPortfolioDataForResume(portfolio);
  }, [portfolio]);

  const atsAnalysis = useMemo(() => {
    return computeATSScore(resumeData);
  }, [resumeData]);

  // Update resume data
  const handleUpdateResume = (updater) => {
    onUpdatePortfolio((prev) => {
      const currentResume = prev.resume || extractPortfolioDataForResume(prev);
      const updatedResume = typeof updater === 'function' ? updater(currentResume) : { ...currentResume, ...updater };
      return {
        ...prev,
        resume: updatedResume,
      };
    });
  };

  // Sync fresh from portfolio
  const handleSyncFromPortfolio = () => {
    if (window.confirm('Pull all projects, skills, headline, and bio fresh from your live portfolio? (Custom resume edits will be refreshed)')) {
      const fresh = extractPortfolioDataForResume(portfolio);
      handleUpdateResume(fresh);
    }
  };

  // 1-Click Print / PDF
  const handlePrintPDF = () => {
    setExporting(true);
    setTimeout(() => {
      window.print();
      setExporting(false);
    }, 250);
  };

  const currentTemplate = RESUME_TEMPLATES.find((t) => t.id === (resumeData.templateId || 'ats-classic')) || RESUME_TEMPLATES[0];

  return (
    <div className="rb-root">
      {/* ─── Top Control Bar ─── */}
      <header className="rb-topbar">
        <div className="rb-brand-group">
          <button className="rb-back-btn" onClick={onBack}>
            ← Back
          </button>
          <div className="rb-title-wrap">
            <span className="rb-tag">LIVE ATS RESUME STUDIO</span>
            <h2 className="rb-title">{resumeData.personal?.name || 'Resume'} · <em>{currentTemplate.name}</em></h2>
          </div>
        </div>

        {/* ATS Score Indicator */}
        <div className="rb-ats-pill" onClick={() => setActiveTab('ats')}>
          <div className="rb-ats-ring" style={{ borderColor: atsAnalysis.badgeColor }}>
            <span>{atsAnalysis.score}</span>
          </div>
          <div className="rb-ats-label">
            <span className="rb-ats-text">ATS Score</span>
            <strong style={{ color: atsAnalysis.badgeColor }}>{atsAnalysis.grade}</strong>
          </div>
        </div>

        <div className="rb-top-actions">
          <button
            className="rb-btn-preview-fullscreen"
            onClick={() => setShowFullscreenPreview(true)}
            title="Preview full 1-page resume sheet"
            style={{
              background: '#131b26',
              color: '#38bdf8',
              border: '1px solid #1e3a5f',
              padding: '6px 14px',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            👁 Preview 1-Page
          </button>
          <button className="rb-btn-sync" onClick={handleSyncFromPortfolio} title="Reload projects & skills from portfolio">
            ↻ Sync Portfolio
          </button>
          <button className="button button-lime rb-btn-export" onClick={handlePrintPDF} disabled={exporting}>
            {exporting ? 'Preparing...' : '⬇ Export PDF / Print'}
          </button>
        </div>
      </header>

      {/* ─── Main Two-Pane Workspace ─── */}
      <div className="rb-workspace">
        {/* Left Control Panel */}
        <aside className="rb-panel">
          {/* Sub Navigation */}
          <div className="rb-tabs">
            <button
              className={`rb-tab${activeTab === 'editor' ? ' active' : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              Content
            </button>
            <button
              className={`rb-tab${activeTab === 'formatting' ? ' active' : ''}`}
              onClick={() => setActiveTab('formatting')}
            >
              ⚙ Formatting
            </button>
            <button
              className={`rb-tab${activeTab === 'templates' ? ' active' : ''}`}
              onClick={() => setActiveTab('templates')}
            >
              Templates ({RESUME_TEMPLATES.length})
            </button>
            <button
              className={`rb-tab${activeTab === 'ats' ? ' active' : ''}`}
              onClick={() => setActiveTab('ats')}
            >
              ATS Audit ({atsAnalysis.score}%)
            </button>
          </div>

          {/* ── Tab: Formatting Controls ── */}
          {activeTab === 'formatting' && (
            <div className="rb-editor-scroll" style={{ padding: '20px 24px' }}>
              <div className="rb-sec-intro" style={{ marginBottom: 20 }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>Single-Page Design & Formatting</h3>
                <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
                  Adjust typography sizing, margins, and accent tones to fit your content into 1 page.
                </p>
              </div>

              {/* 1-Page Guarantee Badge */}
              <div
                style={{
                  background: '#0c1a14',
                  border: '1px solid #10b98155',
                  borderRadius: 8,
                  padding: '12px 14px',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>🔒</span>
                <div>
                  <strong style={{ color: '#10b981', fontSize: 13, display: 'block' }}>
                    1-Page Strict Lock Active
                  </strong>
                  <span style={{ color: '#6ee7b7', fontSize: 12 }}>
                    Exact 297mm A4 portrait bounds. Guaranteed single-page print without spillover.
                  </span>
                </div>
              </div>

              {/* Font Size Scaling */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 8 }}>
                  FONT SIZE / PACKING DENSITY
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { id: 'compact', label: 'Compact', sub: '9.5pt (High density)' },
                    { id: 'normal', label: 'Balanced', sub: '10.5pt (Standard)' },
                    { id: 'roomy', label: 'Roomy', sub: '11.5pt (Light content)' },
                  ].map((fs) => {
                    const isSel = (resumeData.formatting?.fontSize || 'compact') === fs.id;
                    return (
                      <button
                        key={fs.id}
                        type="button"
                        onClick={() =>
                          handleUpdateResume((prev) => ({
                            ...prev,
                            formatting: { ...(prev.formatting || {}), fontSize: fs.id },
                          }))
                        }
                        style={{
                          background: isSel ? '#1e293b' : '#0f172a',
                          border: isSel ? '2px solid #38bdf8' : '1px solid #334155',
                          borderRadius: 6,
                          padding: '10px 8px',
                          color: '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        <strong style={{ display: 'block', fontSize: 13 }}>{fs.label}</strong>
                        <small style={{ fontSize: 10.5, color: '#94a3b8' }}>{fs.sub}</small>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Margins & Section Spacing */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 8 }}>
                  MARGINS & VERTICAL SPACING
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { id: 'compact', label: 'Tight', sub: 'Minimal padding' },
                    { id: 'normal', label: 'Balanced', sub: 'Standard margins' },
                    { id: 'relaxed', label: 'Relaxed', sub: 'Spacious breathing' },
                  ].map((sp) => {
                    const isSel = (resumeData.formatting?.spacing || 'compact') === sp.id;
                    return (
                      <button
                        key={sp.id}
                        type="button"
                        onClick={() =>
                          handleUpdateResume((prev) => ({
                            ...prev,
                            formatting: { ...(prev.formatting || {}), spacing: sp.id },
                          }))
                        }
                        style={{
                          background: isSel ? '#1e293b' : '#0f172a',
                          border: isSel ? '2px solid #38bdf8' : '1px solid #334155',
                          borderRadius: 6,
                          padding: '10px 8px',
                          color: '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        <strong style={{ display: 'block', fontSize: 13 }}>{sp.label}</strong>
                        <small style={{ fontSize: 10.5, color: '#94a3b8' }}>{sp.sub}</small>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent Color Palette */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 8 }}>
                  ACCENT COLOR THEME
                </label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  {[
                    { label: 'Onyx Corporate', color: '#111827' },
                    { label: 'Sapphire Tech', color: '#0284c7' },
                    { label: 'Emerald Mint', color: '#059669' },
                    { label: 'Electric Indigo', color: '#6366f1' },
                    { label: 'Amber Bronze', color: '#d97706' },
                    { label: 'Crimson Wine', color: '#dc2626' },
                    { label: 'Neon Cyber', color: '#10b981' },
                  ].map((pal) => {
                    const isSel = resumeData.formatting?.accentColor === pal.color;
                    return (
                      <button
                        key={pal.color}
                        type="button"
                        onClick={() =>
                          handleUpdateResume((prev) => ({
                            ...prev,
                            formatting: { ...(prev.formatting || {}), accentColor: pal.color },
                          }))
                        }
                        title={pal.label}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: pal.color,
                          border: isSel ? '3px solid #ffffff' : '2px solid #334155',
                          boxShadow: isSel ? '0 0 0 2px #38bdf8' : 'none',
                          cursor: 'pointer',
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                className="button button-lime"
                style={{ width: '100%', padding: '10px 0', fontSize: 13 }}
                onClick={() => setShowFullscreenPreview(true)}
              >
                👁 Preview Formatted 1-Page Resume
              </button>
            </div>
          )}

          {/* ── Tab: Templates ── */}
          {activeTab === 'templates' && (
            <div className="rb-templates-list">
              <div className="rb-sec-intro">
                <h3>Choose a Resume Architecture</h3>
                <p>Pick from ATS-compliant single column layouts or executive split formats.</p>
              </div>

              <div className="rb-tmpl-grid">
                {RESUME_TEMPLATES.map((tmpl) => {
                  const isLocked = tmpl.premium && !isPro;
                  const isSelected = resumeData.templateId === tmpl.id;

                  return (
                    <div
                      key={tmpl.id}
                      className={`rb-tmpl-card${isSelected ? ' selected' : ''}${isLocked ? ' locked' : ''}`}
                      onClick={() => {
                        if (isLocked) {
                          onUpgrade?.();
                          return;
                        }
                        handleUpdateResume({ templateId: tmpl.id });
                      }}
                    >
                      <div className="rb-tmpl-badge-row">
                        <span className={`rb-badge ${tmpl.premium ? 'rb-badge-pro' : 'rb-badge-free'}`}>
                          {tmpl.badge}
                        </span>
                        <span className="rb-tmpl-type">{tmpl.type}</span>
                      </div>
                      <h4>{tmpl.name}</h4>
                      <p>{tmpl.tagline}</p>
                      {isLocked && <div className="rb-lock-overlay"><span>🔒 Unlock with Pro ✦</span></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Tab: ATS Diagnostics ── */}
          {activeTab === 'ats' && (
            <div className="rb-ats-view">
              <div className="rb-ats-score-hero" style={{ borderColor: atsAnalysis.badgeColor }}>
                <div className="rb-ats-huge" style={{ color: atsAnalysis.badgeColor }}>
                  {atsAnalysis.score}<span>/100</span>
                </div>
                <h3>{atsAnalysis.grade}</h3>
                <p>Calculated based on real enterprise ATS scanning patterns (Workday, Greenhouse, Lever).</p>
              </div>

              <div className="rb-ats-checklist">
                <h4>ATS Optimization Checklist</h4>
                {atsAnalysis.criteria.map((c, i) => (
                  <div key={i} className={`rb-check-item ${c.passed ? 'passed' : 'failed'}`}>
                    <div className="rb-check-icon">{c.passed ? '✓' : '✕'}</div>
                    <div className="rb-check-content">
                      <div className="rb-check-title">
                        <strong>{c.name}</strong>
                        <span>+{c.weight} pts</span>
                      </div>
                      <p>{c.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: Content Editor ── */}
          {activeTab === 'editor' && (
            <div className="rb-editor-scroll">
              {/* Section Accordion Selectors */}
              <div className="rb-section-pills">
                {[
                  { id: 'personal', label: 'Identity' },
                  { id: 'summary', label: 'Summary' },
                  { id: 'skills', label: 'Skills' },
                  { id: 'experience', label: 'Experience' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'education', label: 'Education' },
                ].map((s) => (
                  <button
                    key={s.id}
                    className={`rb-sec-pill${activeSection === s.id ? ' active' : ''}`}
                    onClick={() => setActiveSection(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* 1. Personal Identity */}
              {activeSection === 'personal' && (
                <div className="rb-fields-group">
                  <h3>Contact & Identity</h3>
                  <label className="ep-field">
                    <span>Full Name</span>
                    <input
                      value={resumeData.personal?.name || ''}
                      onChange={(e) => handleUpdateResume((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, name: e.target.value },
                      }))}
                      placeholder="Ankur Rana"
                    />
                  </label>

                  <label className="ep-field">
                    <span>Target Role / Headline</span>
                    <input
                      value={resumeData.personal?.role || ''}
                      onChange={(e) => handleUpdateResume((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, role: e.target.value },
                      }))}
                      placeholder="Senior Full-Stack Engineer / Systems Architect"
                    />
                  </label>

                  <div className="ep-row">
                    <label className="ep-field">
                      <span>Email</span>
                      <input
                        value={resumeData.personal?.email || ''}
                        onChange={(e) => handleUpdateResume((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, email: e.target.value },
                        }))}
                        placeholder="you@domain.com"
                      />
                    </label>
                    <label className="ep-field">
                      <span>Phone</span>
                      <input
                        value={resumeData.personal?.phone || ''}
                        onChange={(e) => handleUpdateResume((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, phone: e.target.value },
                        }))}
                        placeholder="+91 98765 43210"
                      />
                    </label>
                  </div>

                  <div className="ep-row">
                    <label className="ep-field">
                      <span>Location</span>
                      <input
                        value={resumeData.personal?.location || ''}
                        onChange={(e) => handleUpdateResume((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, location: e.target.value },
                        }))}
                        placeholder="New Delhi, India"
                      />
                    </label>
                    <label className="ep-field">
                      <span>Portfolio / Website Link</span>
                      <input
                        value={resumeData.personal?.website || ''}
                        onChange={(e) => handleUpdateResume((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, website: e.target.value },
                        }))}
                        placeholder="careerfolio.me/yourname"
                      />
                    </label>
                  </div>

                  <div className="ep-row">
                    <label className="ep-field">
                      <span>GitHub URL</span>
                      <input
                        value={resumeData.personal?.github || ''}
                        onChange={(e) => handleUpdateResume((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, github: e.target.value },
                        }))}
                        placeholder="https://github.com/..."
                      />
                    </label>
                    <label className="ep-field">
                      <span>LinkedIn URL</span>
                      <input
                        value={resumeData.personal?.linkedin || ''}
                        onChange={(e) => handleUpdateResume((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, linkedin: e.target.value },
                        }))}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* 2. Professional Summary */}
              {activeSection === 'summary' && (
                <div className="rb-fields-group">
                  <h3>Professional Summary</h3>
                  <p className="ep-help-text">
                    A concise 2-4 sentence executive overview. Mention your key specializations and quantifiable achievements.
                  </p>
                  <label className="ep-field">
                    <span>Summary Text</span>
                    <textarea
                      rows={6}
                      value={resumeData.summary || ''}
                      onChange={(e) => handleUpdateResume({ summary: e.target.value })}
                      placeholder="Software engineer with 4+ years of expertise in..."
                    />
                  </label>
                </div>
              )}

              {/* 3. Skills */}
              {activeSection === 'skills' && (
                <div className="rb-fields-group">
                  <h3>Skills & Technologies</h3>
                  <p className="ep-help-text">Enter key skills separated by commas or add individual tags.</p>
                  <label className="ep-field">
                    <span>Skills List (Comma separated)</span>
                    <input
                      value={resumeData.skills?.join(', ') || ''}
                      onChange={(e) => {
                        const splitted = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        handleUpdateResume({ skills: splitted });
                      }}
                      placeholder="React, TypeScript, Node.js, Rust, Docker, PostgreSQL"
                    />
                  </label>
                  <div className="rb-skills-pillbox">
                    {(resumeData.skills || []).map((sk, i) => (
                      <span key={i} className="rb-mini-chip">
                        {sk}
                        <button
                          onClick={() => {
                            const next = resumeData.skills.filter((_, idx) => idx !== i);
                            handleUpdateResume({ skills: next });
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Experience */}
              {activeSection === 'experience' && (
                <div className="rb-fields-group">
                  <div className="rb-field-head">
                    <h3>Work Experience</h3>
                    <button
                      className="ep-add-btn"
                      onClick={() => {
                        const newExp = {
                          company: 'New Company',
                          role: 'Software Engineer',
                          period: '2024 - Present',
                          location: 'Remote',
                          bullets: ['Engineered scalable microservices handling 10k+ requests.'],
                        };
                        handleUpdateResume({ experience: [...(resumeData.experience || []), newExp] });
                      }}
                    >
                      + Add Position
                    </button>
                  </div>

                  {(resumeData.experience || []).map((exp, i) => (
                    <div key={i} className="rb-card-editor">
                      <div className="rb-card-topbar">
                        <strong>Position #{i + 1}: {exp.role || 'Role'}</strong>
                        <button
                          className="ep-remove-btn"
                          onClick={() => {
                            const next = resumeData.experience.filter((_, idx) => idx !== i);
                            handleUpdateResume({ experience: next });
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      <div className="ep-row">
                        <label className="ep-field">
                          <span>Role / Title</span>
                          <input
                            value={exp.role || ''}
                            onChange={(e) => {
                              const next = [...resumeData.experience];
                              next[i] = { ...next[i], role: e.target.value };
                              handleUpdateResume({ experience: next });
                            }}
                          />
                        </label>
                        <label className="ep-field">
                          <span>Company</span>
                          <input
                            value={exp.company || ''}
                            onChange={(e) => {
                              const next = [...resumeData.experience];
                              next[i] = { ...next[i], company: e.target.value };
                              handleUpdateResume({ experience: next });
                            }}
                          />
                        </label>
                      </div>

                      <div className="ep-row">
                        <label className="ep-field">
                          <span>Period (e.g. 2022 - Present)</span>
                          <input
                            value={exp.period || ''}
                            onChange={(e) => {
                              const next = [...resumeData.experience];
                              next[i] = { ...next[i], period: e.target.value };
                              handleUpdateResume({ experience: next });
                            }}
                          />
                        </label>
                        <label className="ep-field">
                          <span>Location</span>
                          <input
                            value={exp.location || ''}
                            onChange={(e) => {
                              const next = [...resumeData.experience];
                              next[i] = { ...next[i], location: e.target.value };
                              handleUpdateResume({ experience: next });
                            }}
                          />
                        </label>
                      </div>

                      <label className="ep-field">
                        <span>Bullet Points (one per line)</span>
                        <textarea
                          rows={4}
                          value={(exp.bullets || []).join('\n')}
                          onChange={(e) => {
                            const bullets = e.target.value.split('\n');
                            const next = [...resumeData.experience];
                            next[i] = { ...next[i], bullets };
                            handleUpdateResume({ experience: next });
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. Projects */}
              {activeSection === 'projects' && (
                <div className="rb-fields-group">
                  <div className="rb-field-head">
                    <h3>Featured Projects</h3>
                    <button
                      className="ep-add-btn"
                      onClick={() => {
                        const newProj = {
                          title: 'New Flagship System',
                          tech: ['React', 'Node.js', 'PostgreSQL'],
                          link: 'https://...',
                          bullets: ['Built full-stack distributed system with 99.9% uptime.'],
                        };
                        handleUpdateResume({ projects: [...(resumeData.projects || []), newProj] });
                      }}
                    >
                      + Add Project
                    </button>
                  </div>

                  {(resumeData.projects || []).map((proj, i) => (
                    <div key={i} className="rb-card-editor">
                      <div className="rb-card-topbar">
                        <strong>Project #{i + 1}: {proj.title}</strong>
                        <button
                          className="ep-remove-btn"
                          onClick={() => {
                            const next = resumeData.projects.filter((_, idx) => idx !== i);
                            handleUpdateResume({ projects: next });
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      <div className="ep-row">
                        <label className="ep-field">
                          <span>Project Title</span>
                          <input
                            value={proj.title || ''}
                            onChange={(e) => {
                              const next = [...resumeData.projects];
                              next[i] = { ...next[i], title: e.target.value };
                              handleUpdateResume({ projects: next });
                            }}
                          />
                        </label>
                        <label className="ep-field">
                          <span>Live Demo / GitHub Link</span>
                          <input
                            value={proj.link || ''}
                            onChange={(e) => {
                              const next = [...resumeData.projects];
                              next[i] = { ...next[i], link: e.target.value };
                              handleUpdateResume({ projects: next });
                            }}
                          />
                        </label>
                      </div>

                      <label className="ep-field">
                        <span>Technologies (comma separated)</span>
                        <input
                          value={(proj.tech || []).join(', ')}
                          onChange={(e) => {
                            const tech = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                            const next = [...resumeData.projects];
                            next[i] = { ...next[i], tech };
                            handleUpdateResume({ projects: next });
                          }}
                        />
                      </label>

                      <label className="ep-field">
                        <span>Highlight Bullets (one per line)</span>
                        <textarea
                          rows={3}
                          value={(proj.bullets || []).join('\n')}
                          onChange={(e) => {
                            const bullets = e.target.value.split('\n');
                            const next = [...resumeData.projects];
                            next[i] = { ...next[i], bullets };
                            handleUpdateResume({ projects: next });
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* 6. Education */}
              {activeSection === 'education' && (
                <div className="rb-fields-group">
                  <div className="rb-field-head">
                    <h3>Education & Degrees</h3>
                    <button
                      className="ep-add-btn"
                      onClick={() => {
                        const newEdu = {
                          institution: 'University / College',
                          degree: 'B.Tech / B.S.',
                          field: 'Computer Science',
                          period: '2020 - 2024',
                          grade: '',
                        };
                        handleUpdateResume({ education: [...(resumeData.education || []), newEdu] });
                      }}
                    >
                      + Add Degree
                    </button>
                  </div>

                  {(resumeData.education || []).map((edu, i) => (
                    <div key={i} className="rb-card-editor">
                      <div className="rb-card-topbar">
                        <strong>Degree #{i + 1}</strong>
                        <button
                          className="ep-remove-btn"
                          onClick={() => {
                            const next = resumeData.education.filter((_, idx) => idx !== i);
                            handleUpdateResume({ education: next });
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      <label className="ep-field">
                        <span>Institution</span>
                        <input
                          value={edu.institution || ''}
                          onChange={(e) => {
                            const next = [...resumeData.education];
                            next[i] = { ...next[i], institution: e.target.value };
                            handleUpdateResume({ education: next });
                          }}
                        />
                      </label>

                      <div className="ep-row">
                        <label className="ep-field">
                          <span>Degree & Field</span>
                          <input
                            value={edu.degree || ''}
                            onChange={(e) => {
                              const next = [...resumeData.education];
                              next[i] = { ...next[i], degree: e.target.value };
                              handleUpdateResume({ education: next });
                            }}
                          />
                        </label>
                        <label className="ep-field">
                          <span>Dates / Year</span>
                          <input
                            value={edu.period || ''}
                            onChange={(e) => {
                              const next = [...resumeData.education];
                              next[i] = { ...next[i], period: e.target.value };
                              handleUpdateResume({ education: next });
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Right Live Resume Sheet Preview */}
        <main className="rb-preview-viewport">
          <div className="rb-preview-toolbar">
            <span className="rb-preview-hint">
              📄 Live A4 Document Preview · High-definition ATS rendering
            </span>
            <div className="rb-preview-actions">
              <span className="rb-scale-note">Auto-scales to page</span>
            </div>
          </div>

          <div className="rb-sheet-container careerfolio-print-target" id="careerfolio-resume-sheet">
            <ResumeRenderer
              data={resumeData}
              templateId={resumeData.templateId}
              isPro={isPro}
              formatting={resumeData.formatting}
            />
          </div>
        </main>
      </div>

      {/* ─── Fullscreen 1-Page Resume Preview Modal ─── */}
      {showFullscreenPreview && (
        <div
          className="rb-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 10, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: '12px 24px',
              borderBottom: '1px solid #1e293b',
              background: '#0a0f16',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18 }}>📄</span>
              <div>
                <strong style={{ color: '#f8fafc', fontSize: 14, display: 'block' }}>
                  Full-Screen 1-Page Preview · {currentTemplate.name}
                </strong>
                <span style={{ color: '#94a3b8', fontSize: 11 }}>
                  Strict A4 (210mm × 297mm) bounds. Guaranteed single-page print without spillover.
                </span>
              </div>
            </div>

            {/* Zoom & Action Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#131b26', padding: '4px 8px', borderRadius: 6, border: '1px solid #1e293b' }}>
                <span style={{ color: '#94a3b8', fontSize: 11 }}>Zoom:</span>
                {[
                  { label: '80%', val: 0.8 },
                  { label: '100%', val: 1.0 },
                  { label: '115%', val: 1.15 },
                ].map((z) => (
                  <button
                    key={z.label}
                    type="button"
                    onClick={() => setPreviewZoom(z.val)}
                    style={{
                      background: previewZoom === z.val ? '#38bdf8' : 'transparent',
                      color: previewZoom === z.val ? '#0a0f16' : '#94a3b8',
                      border: 'none',
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {z.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="button button-lime"
                style={{ padding: '6px 14px', fontSize: 12 }}
                onClick={() => {
                  setShowFullscreenPreview(false);
                  setTimeout(() => {
                    window.print();
                  }, 200);
                }}
              >
                ⬇ Print / Export PDF
              </button>

              <button
                type="button"
                onClick={() => setShowFullscreenPreview(false)}
                style={{
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  padding: '6px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Modal Body / Scrollable Canvas */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '40px 20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                transform: `scale(${previewZoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <ResumeRenderer
                data={resumeData}
                templateId={resumeData.templateId}
                isPro={isPro}
                formatting={resumeData.formatting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
