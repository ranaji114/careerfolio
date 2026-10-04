import React from 'react';
import { getTemplate } from '../data/templates';
import { BLOCK_TYPES } from '../data/defaultPortfolio';
import BentoPortfolioLayout from './BentoPortfolioLayout';
import TerminalPortfolioLayout from './TerminalPortfolioLayout';
import SplitSidebarLayout from './SplitSidebarLayout';
import MagazineLayout from './MagazineLayout';
import MinimalEditorialLayout from './MinimalEditorialLayout';
import CreatorShowcaseLayout from './CreatorShowcaseLayout';

// ─── Block Renderers ──────────────────────────────────────────────────────────

function HeroBlock({ data, t, editMode, onEdit }) {
  return (
    <section
      className={`pf-block pf-hero${editMode ? ' pf-block--editable' : ''}`}
      onClick={editMode ? onEdit : undefined}
    >
      <div className="pf-hero-inner">
        {data.avatar && (
          <div className="pf-avatar" style={{ borderColor: t.accent }}>
            <img src={data.avatar} alt={data.name || 'Avatar'} />
          </div>
        )}
        <div className="pf-hero-meta">
          <div className="pf-kicker" style={{ color: t.muted, display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 4 }}>
            {data.location && <span>📍 {data.location}</span>}
            {data.email && (
              <a href={`mailto:${data.email}`} style={{ color: t.accent, textDecoration: 'none', fontWeight: 600 }}>
                ✉ {data.email}
              </a>
            )}
          </div>
          <h1 className="pf-name" style={{ color: t.ink }}>{data.name || 'Your Name'}</h1>
          <p className="pf-role" style={{ color: t.ink }}>{data.role || 'Your headline.'}</p>
          {data.tagline && (
            <p className="pf-tagline" style={{ color: t.muted }}>{data.tagline}</p>
          )}
          <div className="pf-hero-ctas">
            <span className="pf-btn-primary" style={{ background: t.accent, color: t.bg }}>
              {data.ctaLabel || 'View work'} ↗
            </span>
            {(data.email || data.secondaryLabel) && (
              <a
                href={data.email ? `mailto:${data.email}` : '#contact'}
                className="pf-btn-ghost"
                style={{ color: t.ink, borderColor: t.border, textDecoration: 'none' }}
              >
                {data.secondaryLabel || (data.email ? `Email: ${data.email}` : "Let's talk")}
              </a>
            )}
          </div>
        </div>
      </div>
      {data.showStats && data.stats?.length > 0 && (
        <div className="pf-hero-stats" style={{ borderColor: t.border }}>
          {data.stats.map((s, i) => (
            <div className="pf-stat" key={i} style={{ borderColor: t.border }}>
              <strong style={{ color: t.accent }}>{s.value}</strong>
              <span style={{ color: t.muted }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AboutBlock({ data, t, editMode, onEdit }) {
  return (
    <section
      className={`pf-block pf-about${editMode ? ' pf-block--editable' : ''}`}
      onClick={editMode ? onEdit : undefined}
    >
      <div className="pf-section-label" style={{ color: t.accent }}>
        <span className="pf-label-line" style={{ background: t.accent }} />
        {data.heading || 'About'}
      </div>
      <div className="pf-about-body">
        <p className="pf-about-text" style={{ color: t.ink }}>{data.body}</p>
        {data.highlight && (
          <blockquote className="pf-highlight" style={{ borderColor: t.accent, color: t.muted }}>
            {data.highlight}
          </blockquote>
        )}
      </div>
    </section>
  );
}

function ProjectsBlock({ data, t, editMode, onEdit }) {
  const projects = data.projects || [];
  return (
    <section
      className={`pf-block pf-projects${editMode ? ' pf-block--editable' : ''}`}
      onClick={editMode ? onEdit : undefined}
    >
      <div className="pf-section-header">
        <div className="pf-section-label" style={{ color: t.accent }}>
          <span className="pf-label-line" style={{ background: t.accent }} />
          {data.heading || 'Selected Work'}
        </div>
        {data.subheading && (
          <p className="pf-section-sub" style={{ color: t.muted }}>{data.subheading}</p>
        )}
      </div>
      <div className="pf-project-list">
        {projects.length === 0 && (
          <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>
            {editMode ? '+ Click to add your first project' : 'No projects yet.'}
          </div>
        )}
        {projects.map((proj, idx) => (
          <article
            key={proj.id || idx}
            className="pf-project-card"
            style={{ background: t.card, borderColor: t.border }}
            onClick={editMode ? (e) => e.stopPropagation() : undefined}
          >
            <div className="pf-project-header">
              <div>
                <div className="pf-project-number" style={{ color: t.muted }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h3 className="pf-project-title" style={{ color: t.ink }}>{proj.title}</h3>
                {proj.tag && (
                  <p className="pf-project-tag" style={{ color: t.accent }}>{proj.tag}</p>
                )}
              </div>
              {proj.status && (
                <span
                  className={`pf-status pf-status--${(proj.status || '').toLowerCase().replace(/\s+/g, '-')}`}
                  style={
                    proj.status === 'LIVE'
                      ? { background: `${t.accent}22`, color: t.accent, borderColor: `${t.accent}44` }
                      : { color: t.muted, borderColor: t.border }
                  }
                >
                  {proj.status}
                </span>
              )}
            </div>
            <p className="pf-project-desc" style={{ color: t.muted }}>{proj.description}</p>
            {proj.highlights?.length > 0 && (
              <ul className="pf-project-highlights">
                {proj.highlights.map((h, i) => (
                  <li key={i} style={{ borderColor: `${t.accent}33`, color: t.muted }}>
                    <span style={{ color: t.accent }}>✦</span> {h}
                  </li>
                ))}
              </ul>
            )}
            {proj.tech?.length > 0 && (
              <div className="pf-tech-stack">
                {proj.tech.map((tech) => (
                  <span key={tech} className="pf-tech-tag" style={{ color: t.ink, background: `${t.accent}15`, borderColor: `${t.accent}30` }}>
                    {tech}
                  </span>
                ))}
              </div>
            )}
            {(proj.github || proj.demo) && (
              <div className="pf-project-links">
                {proj.github && (
                  <a href={proj.github} className="pf-link" style={{ color: t.accent }} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    GitHub ↗
                  </a>
                )}
                {proj.demo && (
                  <a href={proj.demo} className="pf-link" style={{ color: t.accent }} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    Live Demo ↗
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function SkillsBlock({ data, t, editMode, onEdit }) {
  return (
    <section
      className={`pf-block pf-skills${editMode ? ' pf-block--editable' : ''}`}
      onClick={editMode ? onEdit : undefined}
    >
      <div className="pf-section-label" style={{ color: t.accent }}>
        <span className="pf-label-line" style={{ background: t.accent }} />
        {data.heading || 'Toolkit'}
      </div>
      <div className="pf-skills-grid">
        {(data.categories || []).map((cat, ci) => (
          <div className="pf-skill-cat" key={ci}>
            <p className="pf-skill-cat-label" style={{ color: t.muted }}>{cat.label}</p>
            <div className="pf-skill-pills">
              {(cat.items || []).map((skill) => (
                <span key={skill} className="pf-skill-pill" style={{ color: t.ink, borderColor: t.border, background: `${t.accent}10` }}>
                  {skill}
                </span>
              ))}
              {cat.items?.length === 0 && (
                <span className="pf-skill-pill" style={{ color: t.muted, borderColor: t.border, opacity: .5 }}>No skills yet</span>
              )}
            </div>
          </div>
        ))}
        {(!data.categories || data.categories.length === 0) && (
          <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>+ Add skill categories</div>
        )}
      </div>
    </section>
  );
}

function StatsBlock({ data, t, editMode, onEdit }) {
  const stats = data.stats || [];
  if (stats.length === 0) return null;
  return (
    <section
      className={`pf-block pf-stats-block${editMode ? ' pf-block--editable' : ''}`}
      style={{ borderColor: t.border }}
      onClick={editMode ? onEdit : undefined}
    >
      {stats.map((s, i) => (
        <div key={i} className="pf-stat-item" style={{ borderColor: t.border }}>
          <strong style={{ color: t.accent }}>{s.value}</strong>
          <span style={{ color: t.muted }}>{s.label}</span>
        </div>
      ))}
    </section>
  );
}

function BooksBlock({ data, t, editMode, onEdit }) {
  const books = data.books || [];
  return (
    <section
      className={`pf-block pf-books${editMode ? ' pf-block--editable' : ''}`}
      onClick={editMode ? onEdit : undefined}
    >
      <div className="pf-section-header">
        <div className="pf-section-label" style={{ color: t.accent }}>
          <span className="pf-label-line" style={{ background: t.accent }} />
          {data.heading || 'Books'}
        </div>
        {data.subheading && <p className="pf-section-sub" style={{ color: t.muted }}>{data.subheading}</p>}
      </div>
      <div className="pf-books-grid">
        {books.map((book) => (
          <article key={book.id} className="pf-book-card" style={{ background: t.card, borderColor: t.border }}>
            <div className="pf-book-cover" style={{ background: `${t.accent}20`, borderColor: `${t.accent}30` }}>
              <span style={{ color: t.accent }}>📖</span>
            </div>
            <div className="pf-book-info">
              {book.genre && <p className="pf-book-genre" style={{ color: t.accent }}>{book.genre}</p>}
              <h3 style={{ color: t.ink }}>{book.title}</h3>
              {book.subtitle && <p style={{ color: t.muted }}>{book.subtitle}</p>}
              {book.pages && <p className="pf-book-meta" style={{ color: t.muted }}>{book.pages}</p>}
              {book.url && (
                <a href={book.url} className="pf-link" style={{ color: t.accent }} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  View on Amazon ↗
                </a>
              )}
            </div>
          </article>
        ))}
        {books.length === 0 && (
          <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>
            {editMode ? '+ Click to add books' : 'No books yet.'}
          </div>
        )}
      </div>
    </section>
  );
}

function ResearchBlock({ data, t, editMode, onEdit }) {
  const papers = data.papers || [];
  return (
    <section
      className={`pf-block pf-research${editMode ? ' pf-block--editable' : ''}`}
      onClick={editMode ? onEdit : undefined}
    >
      <div className="pf-section-label" style={{ color: t.accent }}>
        <span className="pf-label-line" style={{ background: t.accent }} />
        {data.heading || 'Research'}
      </div>
      <div className="pf-research-list">
        {papers.map((paper) => (
          <article key={paper.id} className="pf-paper" style={{ borderColor: t.border }} onClick={(e) => e.stopPropagation()}>
            <div className="pf-paper-meta">
              <span className="pf-paper-venue" style={{ color: t.accent }}>{paper.venue}</span>
              {paper.type && <span className="pf-paper-type" style={{ color: t.muted }}>{paper.type}</span>}
            </div>
            <h3 style={{ color: t.ink }}>{paper.title}</h3>
            {paper.url && (
              <a href={paper.url} className="pf-link" style={{ color: t.accent }} target="_blank" rel="noopener noreferrer">
                Read on Zenodo ↗
              </a>
            )}
          </article>
        ))}
        {papers.length === 0 && (
          <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>
            {editMode ? '+ Click to add research papers' : 'No papers yet.'}
          </div>
        )}
      </div>
    </section>
  );
}

function ContactBlock({ data, t, editMode, onEdit }) {
  return (
    <section
      className={`pf-block pf-contact${editMode ? ' pf-block--editable' : ''}`}
      onClick={editMode ? onEdit : undefined}
    >
      <div className="pf-section-label" style={{ color: t.accent }}>
        <span className="pf-label-line" style={{ background: t.accent }} />
        Contact
      </div>
      <div className="pf-contact-inner">
        <h2 className="pf-contact-heading" style={{ color: t.ink }}>{data.heading || "Let's connect"}</h2>
        {data.body && <p className="pf-contact-body" style={{ color: t.muted }}>{data.body}</p>}
        {data.email && (
          <a
            href={`mailto:${data.email}`}
            className="pf-contact-email"
            style={{ color: t.accent }}
            onClick={(e) => e.stopPropagation()}
          >
            {data.email} ↗
          </a>
        )}
        {data.links?.length > 0 && (
          <div className="pf-contact-links">
            {data.links.map((link, i) => (
              link.url && (
                <a
                  key={i}
                  href={link.url}
                  className="pf-btn-ghost"
                  style={{ color: t.ink, borderColor: t.border }}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {link.label} ↗
                </a>
              )
            ))}
          </div>
        )}
        {!data.email && !data.links?.length && (
          <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>
            {editMode ? '+ Add email and social links' : 'No contact info yet.'}
          </div>
        )}
      </div>
    </section>
  );
}

function QuoteBlock({ data, t, editMode, onEdit }) {
  return (
    <section
      className={`pf-block pf-quote${editMode ? ' pf-block--editable' : ''}`}
      onClick={editMode ? onEdit : undefined}
    >
      <blockquote style={{ borderColor: t.accent }}>
        <p style={{ color: t.ink }}>{data.text || (editMode ? 'Click to add a quote.' : '')}</p>
        {data.attribution && <cite style={{ color: t.muted }}>— {data.attribution}</cite>}
      </blockquote>
    </section>
  );
}

function TimelineBlock({ data, t, editMode, onEdit }) {
  const items = data.items || [];
  return (
    <section
      className={`pf-block pf-timeline${editMode ? ' pf-block--editable' : ''}`}
      onClick={editMode ? onEdit : undefined}
    >
      <div className="pf-section-label" style={{ color: t.accent }}>
        <span className="pf-label-line" style={{ background: t.accent }} />
        {data.heading || 'Journey'}
      </div>
      <div className="pf-timeline-list">
        {items.map((item, i) => (
          <div key={i} className="pf-timeline-item" style={{ borderColor: t.border }}>
            {item.year && <span className="pf-tl-year" style={{ color: t.accent }}>{item.year}</span>}
            <div>
              {item.title && <h3 style={{ color: t.ink }}>{item.title}</h3>}
              {item.description && <p style={{ color: t.muted }}>{item.description}</p>}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>
            {editMode ? '+ Click to add timeline items' : 'No timeline items yet.'}
          </div>
        )}
      </div>
    </section>
  );
}

function CustomTextBlock({ data, t, editMode, onEdit }) {
  return (
    <section
      className={`pf-block pf-custom-text${editMode ? ' pf-block--editable' : ''}`}
      onClick={editMode ? onEdit : undefined}
    >
      {data.heading && <h2 style={{ color: t.ink }}>{data.heading}</h2>}
      {data.body ? (
        <p style={{ color: t.muted }}>{data.body}</p>
      ) : editMode ? (
        <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>+ Click to add text</div>
      ) : null}
    </section>
  );
}

function DividerBlock({ t }) {
  return <div className="pf-block pf-divider" style={{ borderColor: t.border }} />;
}

// ─── New Block Renderers ──────────────────────────────────────────────────────

function TestimonialsBlock({ data, t, editMode, onEdit }) {
  const items = data.items || [];
  return (
    <section
      className={`pf-block pf-testimonials${editMode ? ' pf-block--editable' : ''}`}
      onClick={editMode ? onEdit : undefined}
    >
      <div className="pf-section-label" style={{ color: t.accent }}>
        <span className="pf-label-line" style={{ background: t.accent }} />
        {data.heading || 'Testimonials'}
      </div>
      <div className="pf-testimonials-grid">
        {items.map((item, i) => (
          <blockquote
            key={i}
            className="pf-testimonial-card"
            style={{ background: t.card, borderColor: t.border }}
          >
            <p className="pf-testimonial-quote" style={{ color: t.ink }}>❝ {item.quote}</p>
            <footer className="pf-testimonial-footer">
              <strong style={{ color: t.ink }}>{item.author}</strong>
              {item.role && <span style={{ color: t.muted }}> · {item.role}</span>}
            </footer>
          </blockquote>
        ))}
        {items.length === 0 && editMode && (
          <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>
            + Click to add testimonials
          </div>
        )}
        {items.length === 0 && !editMode && (
          <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>
            No testimonials yet.
          </div>
        )}
      </div>
    </section>
  );
}

function ContactFormBlock({ data, t, editMode, onEdit }) {
  const [form, setForm] = React.useState({ name: '', email: '', message: '' });
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  if (editMode) {
    return (
      <section
        className="pf-block pf-contact-form pf-block--editable"
        onClick={onEdit}
      >
        <div className="pf-section-label" style={{ color: t.accent }}>
          <span className="pf-label-line" style={{ background: t.accent }} />
          {data.heading || 'Contact Form'}
        </div>
        <p style={{ color: t.muted, fontSize: 13, marginTop: 8 }}>
          [Live contact form — visitors can send you messages here]
        </p>
      </section>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const missing = ['name', 'email', 'message'].find((f) => !form[f].trim());
    if (missing) {
      setError(`Please fill in your ${missing}.`);
      return;
    }
    try {
      const submissions = JSON.parse(localStorage.getItem('cf-contact-submissions') || '[]');
      submissions.push({
        portfolioId: data.portfolioId || '',
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('cf-contact-submissions', JSON.stringify(submissions));
    } catch {}
    setSuccess(true);
    setForm({ name: '', email: '', message: '' });
    setError('');
  };

  return (
    <section className="pf-block pf-contact-form">
      <div className="pf-section-label" style={{ color: t.accent }}>
        <span className="pf-label-line" style={{ background: t.accent }} />
        {data.heading || 'Send me a message'}
      </div>
      {success ? (
        <p className="pf-cf-success" style={{ color: t.accent }}>
          ✓ Message sent! I'll get back to you soon.
        </p>
      ) : (
        <form className="pf-cf-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="pf-cf-error">{error}</p>}
          <input
            className="pf-cf-input"
            style={{ borderColor: t.border, background: t.card, color: t.ink }}
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className="pf-cf-input"
            style={{ borderColor: t.border, background: t.card, color: t.ink }}
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <textarea
            className="pf-cf-textarea"
            style={{ borderColor: t.border, background: t.card, color: t.ink }}
            placeholder="Your message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
          <button
            type="submit"
            className="pf-cf-submit"
            style={{ background: t.accent, color: t.bg }}
          >
            {data.buttonLabel || 'Send message'}
          </button>
        </form>
      )}
    </section>
  );
}

function BlogBlock({ data, t, editMode, onEdit }) {
  const entries = data.entries || [];
  return (
    <section
      className={`pf-block pf-blog${editMode ? ' pf-block--editable' : ''}`}
      onClick={editMode ? onEdit : undefined}
    >
      <div className="pf-section-label" style={{ color: t.accent }}>
        <span className="pf-label-line" style={{ background: t.accent }} />
        {data.heading || 'Blog & Case Studies'}
      </div>
      <div className="pf-blog-list">
        {entries.map((entry, i) => (
          <article
            key={i}
            className="pf-blog-entry"
            style={{ borderColor: t.border }}
            onClick={editMode ? (e) => e.stopPropagation() : undefined}
          >
            {entry.imageUrl && (
              <img
                src={entry.imageUrl}
                alt={entry.title || 'Blog image'}
                className="pf-blog-image"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            {entry.title && <h3 style={{ color: t.ink }}>{entry.title}</h3>}
            {entry.body && <p style={{ color: t.muted }}>{entry.body}</p>}
          </article>
        ))}
        {entries.length === 0 && editMode && (
          <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>
            + Click to add a blog entry
          </div>
        )}
        {entries.length === 0 && !editMode && (
          <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>
            No entries yet.
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Block Router ─────────────────────────────────────────────────────────────

function renderBlock(block, t, opts) {
  const { editMode, onEditBlock, portfolioId } = opts;
  // Each block's onEdit calls the parent with this block's id
  const onEdit = editMode ? () => onEditBlock?.(block.id) : undefined;

  // Inject portfolioId into contact_form blocks so submissions can be keyed
  const enrichedBlock = block.type === BLOCK_TYPES.CONTACT_FORM
    ? { ...block, portfolioId }
    : block;

  const base = { data: enrichedBlock, t, editMode, onEdit };

  switch (block.type) {
    case BLOCK_TYPES.HERO:         return <HeroBlock {...base} />;
    case BLOCK_TYPES.ABOUT:        return <AboutBlock {...base} />;
    case BLOCK_TYPES.PROJECTS:     return <ProjectsBlock {...base} />;
    case BLOCK_TYPES.SKILLS:       return <SkillsBlock {...base} />;
    case BLOCK_TYPES.STATS:        return <StatsBlock {...base} />;
    case BLOCK_TYPES.BOOKS:        return <BooksBlock {...base} />;
    case BLOCK_TYPES.RESEARCH:     return <ResearchBlock {...base} />;
    case BLOCK_TYPES.CONTACT:      return <ContactBlock {...base} />;
    case BLOCK_TYPES.QUOTE:        return <QuoteBlock {...base} />;
    case BLOCK_TYPES.TIMELINE:     return <TimelineBlock {...base} />;
    case BLOCK_TYPES.CUSTOM_TEXT:  return <CustomTextBlock {...base} />;
    case BLOCK_TYPES.DIVIDER:      return <DividerBlock t={t} />;
    case BLOCK_TYPES.TESTIMONIALS: return <TestimonialsBlock {...base} />;
    case BLOCK_TYPES.CONTACT_FORM: return <ContactFormBlock {...base} />;
    case BLOCK_TYPES.BLOG:         return <BlogBlock {...base} />;
    default:                       return null;
  }
}

// ─── Portfolio Nav (used within renderer) ────────────────────────────────────

function PortfolioNav({ portfolio, currentPage, t, onChangePage }) {
  const heroBlock = portfolio.pages?.home?.blocks?.find((b) => b.type === BLOCK_TYPES.HERO);
  const name = heroBlock?.name || 'Portfolio';
  const pages = ['home', 'work', 'about', 'contact'];

  return (
    <nav className="pf-nav" style={{ background: t.bg, borderColor: t.border }}>
      <span className="pf-nav-brand" style={{ color: t.accent, cursor: 'pointer' }} onClick={() => onChangePage?.('home')}>
        ✦ {name}
      </span>
      <div className="pf-nav-links">
        {pages.map((pg) => (
          <button
            key={pg}
            className={`pf-nav-link ${currentPage === pg ? 'active' : ''}`}
            style={{
              color: currentPage === pg ? t.accent : t.muted,
              background: currentPage === pg ? `${t.accent}18` : 'none',
              border: `1px solid ${currentPage === pg ? `${t.accent}44` : 'transparent'}`,
              borderRadius: 6,
              padding: '4px 12px',
              fontWeight: currentPage === pg ? 700 : 500,
              cursor: 'pointer',
            }}
            onClick={() => onChangePage?.(pg)}
          >
            {pg.charAt(0).toUpperCase() + pg.slice(1)}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Portfolio Footer ─────────────────────────────────────────────────────────

function PortfolioFooter({ portfolio, t, isPro }) {
  const heroBlock = portfolio.pages?.home?.blocks?.find((b) => b.type === BLOCK_TYPES.HERO);
  const name = heroBlock?.name || 'Portfolio';
  const contactBlock = portfolio.pages?.contact?.blocks?.find((b) => b.type === BLOCK_TYPES.CONTACT);
  const links = contactBlock?.links || [];

  return (
    <footer className="pf-footer" style={{ background: t.card, borderColor: t.border }}>
      <div className="pf-footer-inner">
        <div className="pf-footer-brand">
          <span style={{ color: t.accent, fontWeight: 700, fontSize: 17 }}>✦ {name}</span>
          {heroBlock?.role && <p style={{ color: t.muted, fontSize: 13, marginTop: 6 }}>{heroBlock.role}</p>}
        </div>
        {links.length > 0 && (
          <div className="pf-footer-links-list">
            {links.map((link, i) => (
              link.url && (
                <a key={i} href={link.url} style={{ color: t.muted }} target="_blank" rel="noopener noreferrer" className="pf-footer-link">
                  {link.label} ↗
                </a>
              )
            ))}
          </div>
        )}
        <span className="pf-footer-credit" style={{ color: t.muted }}>
          {isPro ? `© 2026 ${name}` : <>© 2026 {name} · Made with <span style={{ color: t.accent }}>Careerfolio ✦</span></>}
        </span>
      </div>
    </footer>
  );
}

// ─── Main Portfolio Renderer ──────────────────────────────────────────────────

export default function PortfolioRenderer({
  portfolio,
  page = 'home',
  editMode = false,
  onEditBlock,
  onChangePage,
  compact = false,
  isPro = false,
  onOpenRecruiterHUD,
}) {
  const t = getTemplate(portfolio.templateId);

  // Dispatch to custom Layout Architectures if selected
  if (!compact && t.layoutType === 'bento') {
    return (
      <BentoPortfolioLayout
        portfolio={portfolio}
        page={page}
        t={t}
        editMode={editMode}
        onEditBlock={onEditBlock}
        onChangePage={onChangePage}
        isPro={isPro}
        onOpenRecruiterHUD={onOpenRecruiterHUD}
      />
    );
  }

  if (!compact && t.layoutType === 'terminal') {
    return (
      <TerminalPortfolioLayout
        portfolio={portfolio}
        page={page}
        t={t}
        editMode={editMode}
        onEditBlock={onEditBlock}
        onChangePage={onChangePage}
        isPro={isPro}
        onOpenRecruiterHUD={onOpenRecruiterHUD}
      />
    );
  }

  if (!compact && t.layoutType === 'split') {
    return (
      <SplitSidebarLayout
        portfolio={portfolio}
        page={page}
        t={t}
        editMode={editMode}
        onEditBlock={onEditBlock}
        onChangePage={onChangePage}
        isPro={isPro}
        onOpenRecruiterHUD={onOpenRecruiterHUD}
      />
    );
  }

  if (!compact && t.layoutType === 'magazine') {
    return (
      <MagazineLayout
        portfolio={portfolio}
        page={page}
        t={t}
        editMode={editMode}
        onEditBlock={onEditBlock}
        onChangePage={onChangePage}
        isPro={isPro}
        onOpenRecruiterHUD={onOpenRecruiterHUD}
      />
    );
  }

  if (!compact && t.layoutType === 'minimal') {
    return (
      <MinimalEditorialLayout
        portfolio={portfolio}
        page={page}
        t={t}
        editMode={editMode}
        onEditBlock={onEditBlock}
        onChangePage={onChangePage}
        isPro={isPro}
        onOpenRecruiterHUD={onOpenRecruiterHUD}
      />
    );
  }

  if (!compact && t.layoutType === 'creator') {
    return (
      <CreatorShowcaseLayout
        portfolio={portfolio}
        page={page}
        t={t}
        editMode={editMode}
        onEditBlock={onEditBlock}
        onChangePage={onChangePage}
        isPro={isPro}
        onOpenRecruiterHUD={onOpenRecruiterHUD}
      />
    );
  }

  const pageData = portfolio.pages?.[page];
  const blocks = pageData?.blocks || [];

  return (
    <div
      className={`pf-root pf-theme-${t.font || 'sans'}${compact ? ' pf-compact' : ''}`}
      style={{
        '--pf-bg': t.bg,
        '--pf-ink': t.ink,
        '--pf-accent': t.accent,
        '--pf-card': t.card,
        '--pf-muted': t.muted,
        '--pf-border': t.border,
        background: t.bg,
        color: t.ink,
      }}
    >
      {!compact && (
        <PortfolioNav
          portfolio={portfolio}
          currentPage={page}
          t={t}
          onChangePage={onChangePage}
        />
      )}

      {/* Floating Recruiter HUD Trigger */}
      {!compact && onOpenRecruiterHUD && (
        <button
          className="pf-floating-hud-btn"
          style={{ background: t.card, color: t.ink, borderColor: t.border }}
          onClick={onOpenRecruiterHUD}
          title="Open Recruiter Quick-Scan (⌘K)"
        >
          <span className="pf-hud-pulse" style={{ background: t.accent }} />
          <span>⚡ Recruiter Quick-Scan</span>
          <kbd style={{ background: t.bg, borderColor: t.border }}>⌘K</kbd>
        </button>
      )}

      <main className="pf-main">
        {blocks.length === 0 && (
          <div className="pf-page-empty" style={{ color: t.muted }}>
            {editMode ? '← Add blocks from the panel on the left.' : 'This page has no content yet.'}
          </div>
        )}
        {blocks
          .filter((b) => b.visible !== false)
          .map((block) => (
            <div
              key={block.id}
              className={editMode ? 'pf-block-wrapper pf-block-wrapper--edit' : 'pf-block-wrapper'}
            >
              {renderBlock(block, t, { editMode, onEditBlock, portfolioId: portfolio.id })}
            </div>
          ))}
      </main>

      {!compact && (
        <PortfolioFooter portfolio={portfolio} t={t} isPro={isPro} />
      )}
    </div>
  );
}
