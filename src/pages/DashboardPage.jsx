import React, { useState } from 'react';
import { getTemplate } from '../data/templates';
import { BLOCK_TYPES } from '../data/defaultPortfolio';
import { getPublicPortfolioUrl } from '../utils/publicRouting';
import { getViewCount } from '../utils/analytics';

function getHeroBlock(portfolio) {
  return portfolio.pages?.home?.blocks?.find((b) => b.type === BLOCK_TYPES.HERO) || null;
}

function getPortfolioName(portfolio) {
  return getHeroBlock(portfolio)?.name || 'Untitled portfolio';
}

function getPortfolioRole(portfolio) {
  return getHeroBlock(portfolio)?.role || '';
}

function getProjectCount(portfolio) {
  const projBlock = portfolio.pages?.home?.blocks?.find((b) => b.type === BLOCK_TYPES.PROJECTS);
  return projBlock?.projects?.length || 0;
}

export function computeCompletionScore(portfolio) {
  const homeBlocks = portfolio.pages?.home?.blocks || [];
  const hero = homeBlocks.find((b) => b.type === BLOCK_TYPES.HERO) || {};
  const projects = homeBlocks.find((b) => b.type === BLOCK_TYPES.PROJECTS) || portfolio.pages?.work?.blocks?.find((b) => b.type === BLOCK_TYPES.PROJECTS);
  const skills = homeBlocks.find((b) => b.type === BLOCK_TYPES.SKILLS);
  const about = portfolio.pages?.about?.blocks?.find((b) => b.type === BLOCK_TYPES.ABOUT) || homeBlocks.find((b) => b.type === BLOCK_TYPES.ABOUT) || {};

  const isPopulated = (val) => (typeof val === 'string' ? val.trim().length > 0 : false);
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const fields = [
    isPopulated(hero.name),
    isPopulated(hero.role),
    isPopulated(hero.tagline),
    isPopulated(hero.email),
    isPopulated(hero.location),
    hasItems(projects?.projects),
    skills?.categories?.some((c) => hasItems(c.items)),
    isPopulated(about.body),
  ];

  const populated = fields.filter(Boolean).length;
  return Math.floor((populated / 8) * 100);
}

export default function DashboardPage({
  portfolios,
  user,
  onCreate,
  onOpenAIGenerator,
  onEdit,
  onOpenResume,
  onPreview,
  onRemove,
  onDuplicate,
  onUpgrade,
  onNavigate,
}) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyLink = (portfolio) => {
    const url = getPublicPortfolioUrl(portfolio);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopiedId(portfolio.id);
    setTimeout(() => setCopiedId((prev) => (prev === portfolio.id ? null : prev)), 2000);
  };

  const isPro = user.plan === 'pro';
  const publishedCount = portfolios.filter((p) => p.published).length;
  const totalProjects = portfolios.reduce((sum, p) => sum + getProjectCount(p), 0);
  const firstName = user.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <main className="dashboard-wrap">
      {/* Hero strip */}
      <section className="dashboard-hero">
        <p className="eyebrow">YOUR CREATIVE HQ · {isPro ? 'PRO MEMBER ✦' : 'FREE PLAN'}</p>
        <h1>
          {greeting}, {firstName} <span>✦</span>
        </h1>
        <p>Keep building a body of work you're proud to share — portfolios & ATS resumes in 1-click sync.</p>
        <div className="dashboard-hero-actions">
          <button className="button button-dark" onClick={onCreate}>
            New portfolio <span>+</span>
          </button>
          <button
            className="button"
            style={{ background: '#172e20', color: '#46f6a5', border: '1px solid #2d553b', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={onOpenAIGenerator}
          >
            ⚡ Build Full with AI ✦
          </button>
          {portfolios.length > 0 && (
            <button
              className="button button-lime"
              onClick={() => onOpenResume?.(portfolios[0].id)}
            >
              📄 Live Resume Studio <span>↗</span>
            </button>
          )}
          {!isPro && (
            <button className="button button-outline" onClick={onUpgrade}>
              Unlock Pro ✦
            </button>
          )}
        </div>
      </section>

      {/* Stat strip */}
      <section className="stat-strip">
        <div>
          <span>Live portfolios</span>
          <strong>{publishedCount}</strong>
        </div>
        <div>
          <span>Total projects</span>
          <strong>{totalProjects}</strong>
        </div>
        <div>
          <span>{isPro ? 'Your plan' : 'Templates unlocked'}</span>
          <strong>{isPro ? 'Pro ✦' : '6 / 12'}</strong>
        </div>
      </section>

      {/* Portfolio list */}
      <section className="portfolio-list">
        <div className="list-head">
          <h2>Your portfolios</h2>
          <button className="button button-dark" onClick={onCreate}>+ New</button>
        </div>

        {portfolios.length === 0 ? (
          <div className="empty-state">
            <div>◈</div>
            <h3>No portfolios yet</h3>
            <p>Create your first multi-page portfolio and start building your presence.</p>
            <button className="button button-lime" onClick={onCreate}>Get started →</button>
          </div>
        ) : (
          <div className="dashboard-grid">
            {portfolios.map((portfolio) => {
              const t = getTemplate(portfolio.templateId);
              const name = getPortfolioName(portfolio);
              const role = getPortfolioRole(portfolio);
              const projCount = getProjectCount(portfolio);
              const isSeed = portfolio.id === 'ankur-rana-featured';
              const score = computeCompletionScore(portfolio);
              const views = getViewCount(portfolio.id);

              return (
                <article key={portfolio.id} className="dashboard-card">
                  {/* Visual cover */}
                  <div
                    className="dashboard-cover"
                    style={{ background: t.bg, cursor: 'pointer' }}
                    onClick={() => onEdit(portfolio.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onEdit(portfolio.id)}
                    aria-label={`Edit ${name}`}
                  >
                    <span style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: 9,
                      color: t.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}>
                      {t.name} · {t.type}
                    </span>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
                      <p style={{
                        margin: 0,
                        fontFamily: t.font === 'mono' ? 'DM Mono, monospace' : 'DM Sans, sans-serif',
                        fontSize: 22, fontWeight: 700, letterSpacing: '-0.05em',
                        color: t.ink, lineHeight: 1,
                      }}>
                        {name}
                      </p>
                      {role && (
                        <p style={{ margin: 0, fontSize: 11, color: t.muted, lineHeight: 1.3 }}>
                          {role.length > 65 ? role.slice(0, 65) + '…' : role}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <i style={{ width: 20, height: 20, borderRadius: '50%', background: t.accent, display: 'block', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: portfolio.published ? t.accent : t.muted }}>
                          {portfolio.published ? '● LIVE' : '○ DRAFT'}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: t.muted }}>
                        {projCount} project{projCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Card bottom */}
                  <div className="dashboard-card-bottom">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3>{name}</h3>
                        <a
                          href={getPublicPortfolioUrl(portfolio)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#0284c7', textDecoration: 'underline', fontSize: 13 }}
                          title="Open real standalone website in a new tab"
                        >
                          {getPublicPortfolioUrl(portfolio).replace(/^https?:\/\//, '')} ↗
                        </a>
                      </div>
                      <span className="dashboard-view-count" style={{ fontSize: 12, color: '#686b62', fontFamily: 'DM Mono, monospace' }}>
                        👁 {views} view{views !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Completion bar */}
                    <div className="dashboard-completion-bar" style={{ marginTop: 12, marginBottom: 12 }}>
                      <div className="dashboard-completion-track" style={{ height: 6, background: '#e2e4d8', borderRadius: 3, overflow: 'hidden' }}>
                        <div className="dashboard-completion-fill" style={{ width: `${score}%`, height: '100%', background: t.accent, transition: 'width 0.3s' }} />
                      </div>
                      <span className="dashboard-completion-label" style={{ fontSize: 11, color: '#686b62', marginTop: 4, display: 'block' }}>
                        {score >= 100 ? 'Profile complete ✓' : `${score}% complete`}
                      </span>
                    </div>

                    <div className="card-actions">
                      <button onClick={() => onEdit(portfolio.id)}>Edit</button>
                      <button
                        className="card-copy-link-btn"
                        onClick={() => handleCopyLink(portfolio)}
                        style={{ color: copiedId === portfolio.id ? '#16a34a' : '#4b5563', fontWeight: 600 }}
                      >
                        {copiedId === portfolio.id ? 'Copied! ✓' : 'Copy link'}
                      </button>
                      <button onClick={() => onOpenResume?.(portfolio.id)} style={{ color: '#0284c7', fontWeight: 600 }}>📄 Resume</button>
                      <a
                        href={getPublicPortfolioUrl(portfolio)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}
                        title="Open real personal website in a new tab"
                      >
                        🌐 Live Site ↗
                      </a>
                      <button onClick={() => onPreview(portfolio.id)}>Preview</button>
                      <button onClick={() => {
                        const newId = onDuplicate(portfolio.id);
                        if (newId) onEdit(newId);
                      }}>Duplicate</button>
                      {!isSeed && (
                        <button
                          style={{ color: '#bd4a3b' }}
                          onClick={() => {
                            if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
                              onRemove(portfolio.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Dashboard footer */}
      <footer className="dashboard-footer">
        <div className="dashboard-footer-inner">
          <div>
            <span className="brand" style={{ fontSize: 16 }}>
              <span className="brand-star">✦</span> careerfolio
            </span>
            <p>Your work, in its best light.</p>
          </div>
          <div className="dashboard-footer-links">
            <button onClick={() => onNavigate?.('home')}>Home</button>
            <button onClick={() => onNavigate?.('help')}>Help</button>
            <button onClick={() => onNavigate?.('privacy')}>Privacy</button>
            <button onClick={() => onNavigate?.('terms')}>Terms</button>
          </div>
          <span>© 2026 Careerfolio</span>
        </div>
      </footer>
    </main>
  );
}
