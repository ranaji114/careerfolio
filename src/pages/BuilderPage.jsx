import React, { useState, useCallback, useEffect } from 'react';
import EditorPanel from '../editor/EditorPanel';
import PortfolioRenderer from '../templates/PortfolioRenderer';
import { templates, freeTemplateIds, getTemplate } from '../data/templates';
import { createBlock, BLOCK_TYPES } from '../data/defaultPortfolio';
import ResumeBuilder from '../components/resume/ResumeBuilder';
import GithubImportModal from '../components/shared/GithubImportModal';
import LinkedInImportModal from '../components/shared/LinkedInImportModal';
import AIWriterModal from '../components/shared/AIWriterModal';
import AIPortfolioGeneratorModal from '../components/shared/AIPortfolioGeneratorModal';
import RecruiterHUD from '../components/shared/RecruiterHUD';
import { getPublicPortfolioUrl } from '../utils/publicRouting';
import { nanoid } from 'nanoid';

const PAGES = ['home', 'work', 'about', 'contact'];

export default function BuilderPage({
  portfolio,
  isPro,
  onUpdate,
  onPublish,
  onBack,
  onUpgrade,
  onPreview,
  initialTab = 'editor',
}) {
  const [activePage, setActivePage] = useState('home');
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [tab, setTab] = useState(initialTab); // 'editor' | 'template' | 'resume'
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAIFullModal, setShowAIFullModal] = useState(false);
  const [showRecruiterHUD, setShowRecruiterHUD] = useState(false);
  const [previewTheme, setPreviewTheme] = useState('light'); // 'light' | 'dark' — NOT persisted
  const [pdfMode, setPdfMode] = useState(false);

  const t = getTemplate(portfolio.templateId);

  // Global shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowRecruiterHUD((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync page between editor and preview
  const handlePageChange = useCallback((pg) => {
    setActivePage(pg);
    setActiveBlockId(null);
  }, []);

  // ── Block operations ──
  const handleUpdateBlock = useCallback((blockId, updater) => {
    onUpdate((p) => {
      const page = activePage;
      const pageData = p.pages[page];
      if (!pageData) return p;
      return {
        ...p,
        pages: {
          ...p.pages,
          [page]: {
            ...pageData,
            blocks: pageData.blocks.map((b) =>
              b.id === blockId ? { ...b, ...updater(b) } : b
            ),
          },
        },
      };
    });
  }, [onUpdate, activePage]);

  const handleAddBlock = useCallback((page, blockType) => {
    onUpdate((p) => {
      const block = createBlock(blockType);
      const pageData = p.pages[page] || { blocks: [] };
      return {
        ...p,
        pages: {
          ...p.pages,
          [page]: {
            ...pageData,
            blocks: [...pageData.blocks, block],
          },
        },
      };
    });
  }, [onUpdate]);

  const handleRemoveBlock = useCallback((page, blockId) => {
    onUpdate((p) => {
      const pageData = p.pages[page];
      if (!pageData) return p;
      return {
        ...p,
        pages: {
          ...p.pages,
          [page]: {
            ...pageData,
            blocks: pageData.blocks.filter((b) => b.id !== blockId),
          },
        },
      };
    });
    if (activeBlockId === blockId) setActiveBlockId(null);
  }, [onUpdate, activeBlockId]);

  const handleReorderBlocks = useCallback((page, newBlocks) => {
    onUpdate((p) => ({
      ...p,
      pages: {
        ...p.pages,
        [page]: { ...(p.pages[page] || {}), blocks: newBlocks },
      },
    }));
  }, [onUpdate]);

  const handleTemplateSelect = useCallback((templateId) => {
    const locked = !isPro && !freeTemplateIds.has(templateId);
    if (locked) { onUpgrade?.(); return; }
    onUpdate((p) => ({ ...p, templateId }));
  }, [isPro, onUpgrade, onUpdate]);

  // When a block is clicked in the preview
  const handleEditBlockFromPreview = useCallback((blockId) => {
    setActiveBlockId(blockId);
    setTab('editor');
  }, []);

  // Handle GitHub projects import into portfolio & resume
  const handleImportGithubProjects = useCallback((importedProjects) => {
    onUpdate((p) => {
      const homePage = p.pages?.home || { blocks: [] };
      let updatedHomeBlocks = [...homePage.blocks];

      const projBlockIndex = updatedHomeBlocks.findIndex((b) => b.type === BLOCK_TYPES.PROJECTS);
      if (projBlockIndex >= 0) {
        const existing = updatedHomeBlocks[projBlockIndex].projects || [];
        updatedHomeBlocks[projBlockIndex] = {
          ...updatedHomeBlocks[projBlockIndex],
          projects: [...importedProjects, ...existing],
        };
      } else {
        updatedHomeBlocks.push(createBlock(BLOCK_TYPES.PROJECTS, {
          heading: 'GitHub & Open Source',
          projects: importedProjects,
        }));
      }

      // Also append to resume if present
      let updatedResume = p.resume ? { ...p.resume } : null;
      if (updatedResume) {
        const existingResumeProjs = updatedResume.projects || [];
        const mappedResumeProjs = importedProjects.map((ip) => ({
          id: ip.id,
          title: ip.title,
          tagline: ip.tag,
          bullets: ip.highlights || [ip.description],
          tech: ip.tech || [],
          link: ip.demo || ip.github,
          github: ip.github,
        }));
        updatedResume.projects = [...mappedResumeProjs, ...existingResumeProjs];
      }

      return {
        ...p,
        pages: {
          ...p.pages,
          home: {
            ...homePage,
            blocks: updatedHomeBlocks,
          },
        },
        resume: updatedResume,
      };
    });
  }, [onUpdate]);

  // Handle LinkedIn data import into Hero + Skills blocks
  const handleLinkedInImport = useCallback((extracted) => {
    onUpdate((p) => {
      const homeBlocks = p.pages?.home?.blocks || [];
      const updatedBlocks = homeBlocks.map((b) => {
        if (b.type === BLOCK_TYPES.HERO) {
          return {
            ...b,
            name: extracted.name || b.name,
            role: extracted.role || b.role,
          };
        }
        if (b.type === BLOCK_TYPES.SKILLS && extracted.skills?.length) {
          return {
            ...b,
            categories: [
              ...(b.categories || []),
              { label: 'LinkedIn Skills', items: extracted.skills },
            ],
          };
        }
        return b;
      });
      return {
        ...p,
        pages: { ...p.pages, home: { ...p.pages.home, blocks: updatedBlocks } },
      };
    });
  }, [onUpdate]);

  // Handle AI generated Bio apply to Hero & About
  const handleApplyAIHero = useCallback((bioObj) => {
    onUpdate((p) => {
      const homeBlocks = p.pages?.home?.blocks || [];
      const updated = homeBlocks.map((b) => {
        if (b.type === BLOCK_TYPES.HERO) {
          return { ...b, role: bioObj.role, tagline: bioObj.tagline };
        }
        if (b.type === BLOCK_TYPES.ABOUT) {
          return { ...b, body: bioObj.bio };
        }
        return b;
      });
      return { ...p, pages: { ...p.pages, home: { ...p.pages.home, blocks: updated } } };
    });
  }, [onUpdate]);

  // Handle AI generated Project case study apply to Projects block
  const handleApplyAIProject = useCallback((projObj) => {
    onUpdate((p) => {
      const homeBlocks = p.pages?.home?.blocks || [];
      const projBlockIdx = homeBlocks.findIndex((b) => b.type === BLOCK_TYPES.PROJECTS);
      let nextBlocks = [...homeBlocks];
      if (projBlockIdx >= 0) {
        const existing = nextBlocks[projBlockIdx].projects || [];
        nextBlocks[projBlockIdx] = {
          ...nextBlocks[projBlockIdx],
          projects: [{ id: nanoid(6), ...projObj, status: 'LIVE' }, ...existing],
        };
      } else {
        nextBlocks.push(createBlock(BLOCK_TYPES.PROJECTS, {
          heading: 'Selected Work',
          projects: [{ id: nanoid(6), ...projObj, status: 'LIVE' }],
        }));
      }
      return { ...p, pages: { ...p.pages, home: { ...p.pages.home, blocks: nextBlocks } } };
    });
  }, [onUpdate]);

  // If user selected Live Resume Studio, show the ResumeBuilder full workspace
  if (tab === 'resume') {
    return (
      <ResumeBuilder
        portfolio={portfolio}
        isPro={isPro}
        onUpdatePortfolio={onUpdate}
        onUpgrade={onUpgrade}
        onBack={() => setTab('editor')}
      />
    );
  }

  return (
    <div className="builder-v2">
      {/* ── Top bar ── */}
      <header className="bv2-topbar">
        <div className="bv2-topbar-left">
          <button className="bv2-back" onClick={onBack}>← Dashboard</button>
          <button
            className="bv2-ai-btn"
            onClick={() => setShowAIFullModal(true)}
            title="Auto-Generate 4-Page Portfolio & ATS Resume with AI (Pro)"
            style={{ background: 'linear-gradient(135deg, #1e291e 0%, #173819 100%)', color: '#a3e635', border: '1px solid #4ade80', fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
          >
            ⚡ Full AI Builder {isPro ? '✦' : '🔒'}
          </button>
          <button
            className="bv2-ai-btn"
            onClick={() => setShowAIModal(true)}
            title="Open AI Section & Content Writer"
            style={{ background: '#1e291e', color: '#94a3b8', border: '1px solid #334155', fontSize: 11, fontWeight: 600, padding: '6px 10px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
          >
            ✦ Section Writer
          </button>
          <button
            className="bv2-gh-import-btn"
            onClick={() => setShowGithubModal(true)}
            title="Import public GitHub projects into your portfolio"
          >
            ⚡ GitHub Import
          </button>
          <button
            className="bv2-li-import-btn"
            onClick={() => setShowLinkedInModal(true)}
            title="Import name, role & skills from LinkedIn"
          >
            🔗 LinkedIn Import
          </button>
        </div>

        <div className="bv2-topbar-center">
          <button
            className={`bv2-tab${tab === 'editor' ? ' active' : ''}`}
            onClick={() => setTab('editor')}
          >
            ✎ Portfolio Blocks
          </button>
          <button
            className={`bv2-tab${tab === 'template' ? ' active' : ''}`}
            onClick={() => setTab('template')}
          >
            ◈ Templates ({templates.length})
          </button>
          <button
            className="bv2-tab bv2-tab-resume-highlight"
            onClick={() => setTab('resume')}
            title="Switch to Live ATS Resume Builder"
          >
            📄 Live ATS Resume Studio ✦
          </button>
        </div>

        <div className="bv2-topbar-actions">
          <button
            className="bv2-hud-trigger-btn"
            onClick={() => setShowRecruiterHUD(true)}
            title="Open Recruiter Quick-Scan (⌘K)"
          >
            ⚡ Recruiter HUD
          </button>

          <div className="bv2-preview-toggle">
            <button
              className={previewMode === 'desktop' ? 'active' : ''}
              onClick={() => setPreviewMode('desktop')}
              title="Desktop preview"
            >
              ⬜
            </button>
            <button
              className={previewMode === 'mobile' ? 'active' : ''}
              onClick={() => setPreviewMode('mobile')}
              title="Mobile preview"
            >
              ▯
            </button>
          </div>

          <a
            href={getPublicPortfolioUrl(portfolio)}
            target="_blank"
            rel="noopener noreferrer"
            className="bv2-live-site-btn"
            title="Open real personal website in a new tab"
          >
            🌐 Open Live Site ↗
          </a>

          <span className={`bv2-pub-badge${portfolio.published ? ' live' : ''}`}>
            {portfolio.published ? '● Live' : '○ Draft'}
          </span>
          <button className="button button-lime bv2-publish-btn" onClick={onPublish}>
            {portfolio.published ? 'Unpublish' : 'Publish ✦'}
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="bv2-body">
        {/* Left panel — editor or template picker */}
        <div className="bv2-left">
          {tab === 'editor' && (
            <EditorPanel
              portfolio={portfolio}
              activePage={activePage}
              onChangePage={handlePageChange}
              onUpdateBlock={handleUpdateBlock}
              onAddBlock={handleAddBlock}
              onRemoveBlock={handleRemoveBlock}
              onReorderBlocks={handleReorderBlocks}
              activeBlockId={activeBlockId}
              onSelectBlock={setActiveBlockId}
            />
          )}

          {tab === 'template' && (
            <div className="bv2-template-panel">
              <div className="bv2-panel-header">
                <div>
                  <strong>Choose your template ({templates.length})</strong>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#686b62' }}>
                    Includes custom Bento Matrix Pro & Hacker CLI Pro layouts.
                  </p>
                </div>
              </div>
              <div className="bv2-template-grid">
                {templates.map((tmpl) => {
                  const locked = !isPro && !freeTemplateIds.has(tmpl.id);
                  const selected = portfolio.templateId === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      className={`bv2-tmpl-tile${selected ? ' selected' : ''}${locked ? ' locked' : ''}`}
                      onClick={() => handleTemplateSelect(tmpl.id)}
                      title={locked ? 'Pro template — upgrade to unlock' : tmpl.name}
                    >
                      <div
                        className="bv2-tmpl-preview"
                        style={{ background: tmpl.bg, color: tmpl.ink }}
                      >
                        <span style={{
                          fontFamily: tmpl.font === 'mono' ? 'DM Mono, monospace' : 'inherit',
                          color: tmpl.accent,
                        }}>
                          {tmpl.type}
                        </span>
                        <strong style={{ color: tmpl.ink }}>{tmpl.name}</strong>
                        <i style={{ background: tmpl.accent }} />
                      </div>
                      <div className="bv2-tmpl-info">
                        <span>{tmpl.name}</span>
                        <small>{tmpl.tone}</small>
                        {selected && <em className="tmpl-selected">Selected ✓</em>}
                        {locked && !selected && <em className="pro-lock">Pro ✦</em>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right — Live preview */}
        <div className={`bv2-preview-area${previewMode === 'mobile' ? ' mobile' : ''}`}>
          {/* Live website URL address bar */}
          <div className="bv2-live-url-bar">
            <div className="bv2-url-capsule">
              <span className="bv2-url-lock">🔒</span>
              <span className="bv2-url-text">{getPublicPortfolioUrl(portfolio)}</span>
              <button
                type="button"
                className="bv2-url-copy-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(getPublicPortfolioUrl(portfolio));
                  alert('Copied your live website URL: ' + getPublicPortfolioUrl(portfolio));
                }}
              >
                Copy
              </button>
            </div>
            <a
              href={getPublicPortfolioUrl(portfolio)}
              target="_blank"
              rel="noopener noreferrer"
              className="bv2-url-open-link"
              title="Open full website in a new browser tab"
            >
              Open in New Tab ↗
            </a>
          </div>

          {/* Page navigation tabs above preview */}
          <div className="bv2-preview-tabs">
            {PAGES.map((pg) => (
              <button
                key={pg}
                className={`bv2-preview-tab${activePage === pg ? ' active' : ''}`}
                style={activePage === pg ? { color: t.accent, borderBottomColor: t.accent } : {}}
                onClick={() => handlePageChange(pg)}
              >
                {pg.charAt(0).toUpperCase() + pg.slice(1)}
              </button>
            ))}
            <div className="bv2-theme-toggle">
              <button
                className={previewTheme === 'light' ? 'active' : ''}
                onClick={() => setPreviewTheme('light')}
                title="Light preview"
              >☀ Light</button>
              <button
                className={previewTheme === 'dark' ? 'active' : ''}
                onClick={() => setPreviewTheme('dark')}
                title="Dark preview"
              >☾ Dark</button>
            </div>
            <button
              className="bv2-export-pdf-btn"
              title="Export current page as PDF"
              onClick={() => {
                setPdfMode(true);
                requestAnimationFrame(() => {
                  window.print();
                  setPdfMode(false);
                });
              }}
            >
              ⬇ Export PDF
            </button>
          </div>

          <div className={`bv2-preview-frame${previewMode === 'mobile' ? ' mobile-frame' : ''}`}>
            <div
              className={`bv2-preview-scroll${pdfMode ? ' pdf-export-mode' : ''}`}
              data-preview-theme={previewTheme}
            >
              <PortfolioRenderer
                portfolio={portfolio}
                page={activePage}
                editMode={tab === 'editor'}
                onEditBlock={handleEditBlockFromPreview}
                onChangePage={handlePageChange}
                isPro={isPro}
                onOpenRecruiterHUD={() => setShowRecruiterHUD(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showGithubModal && (
        <GithubImportModal
          isOpen={showGithubModal}
          onClose={() => setShowGithubModal(false)}
          onImportProjects={handleImportGithubProjects}
        />
      )}

      {showLinkedInModal && (
        <LinkedInImportModal
          onImport={(extracted) => {
            handleLinkedInImport(extracted);
            setShowLinkedInModal(false);
          }}
          onClose={() => setShowLinkedInModal(false)}
        />
      )}

      {showRecruiterHUD && (
        <RecruiterHUD
          portfolio={portfolio}
          isPro={isPro}
          onOpenResume={() => setTab('resume')}
          onClose={() => setShowRecruiterHUD(false)}
        />
      )}

      {showAIModal && (
        <AIWriterModal
          isPro={isPro}
          onApplyToHero={handleApplyAIHero}
          onApplyToProject={handleApplyAIProject}
          onClose={() => setShowAIModal(false)}
          onUpgrade={() => {
            setShowAIModal(false);
            onUpgrade?.();
          }}
        />
      )}

      {showAIFullModal && (
        <AIPortfolioGeneratorModal
          portfolio={portfolio}
          onGeneratePortfolio={(newPortfolio) => {
            onUpdate(() => newPortfolio);
            setShowAIFullModal(false);
          }}
          onClose={() => setShowAIFullModal(false)}
        />
      )}
    </div>
  );
}
