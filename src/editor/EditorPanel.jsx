import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { BLOCK_TYPES, createBlock } from '../data/defaultPortfolio';

const BLOCK_LABELS = {
  [BLOCK_TYPES.HERO]: 'Hero / Header',
  [BLOCK_TYPES.ABOUT]: 'About Me',
  [BLOCK_TYPES.PROJECTS]: 'Projects',
  [BLOCK_TYPES.SKILLS]: 'Skills / Toolkit',
  [BLOCK_TYPES.STATS]: 'Stats',
  [BLOCK_TYPES.BOOKS]: 'Books',
  [BLOCK_TYPES.RESEARCH]: 'Research',
  [BLOCK_TYPES.CONTACT]: 'Contact',
  [BLOCK_TYPES.QUOTE]: 'Quote',
  [BLOCK_TYPES.TIMELINE]: 'Timeline',
  [BLOCK_TYPES.CUSTOM_TEXT]: 'Custom Text',
  [BLOCK_TYPES.DIVIDER]: 'Divider',
  [BLOCK_TYPES.TESTIMONIALS]: 'Testimonials',
  [BLOCK_TYPES.CONTACT_FORM]: 'Contact Form',
  [BLOCK_TYPES.BLOG]: 'Blog / Case Study',
};

const BLOCK_ICONS = {
  [BLOCK_TYPES.HERO]: '⌂',
  [BLOCK_TYPES.ABOUT]: '◉',
  [BLOCK_TYPES.PROJECTS]: '◈',
  [BLOCK_TYPES.SKILLS]: '◆',
  [BLOCK_TYPES.STATS]: '▦',
  [BLOCK_TYPES.BOOKS]: '◧',
  [BLOCK_TYPES.RESEARCH]: '◬',
  [BLOCK_TYPES.CONTACT]: '◎',
  [BLOCK_TYPES.QUOTE]: '❝',
  [BLOCK_TYPES.TIMELINE]: '◐',
  [BLOCK_TYPES.CUSTOM_TEXT]: '◻',
  [BLOCK_TYPES.DIVIDER]: '—',
  [BLOCK_TYPES.TESTIMONIALS]: '❝',
  [BLOCK_TYPES.CONTACT_FORM]: '✉',
  [BLOCK_TYPES.BLOG]: '◧',
};

function Input({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="ep-field">
      <span>{label}</span>
      <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="ep-field">
      <span>{label}</span>
      <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} />
    </label>
  );
}

// ─── Block-specific editors ───────────────────────────────────────────────────

function HeroEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="ep-editor-fields">
      {/* Profile Photo Upload directly from computer */}
      <div className="ep-field">
        <span>Profile Photo / Avatar</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
          {data.avatar ? (
            <div style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: '2px solid #a3e635', flexShrink: 0 }}>
              <img src={data.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#1c1f19', border: '1px dashed #4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 20, flexShrink: 0 }}>
              📷
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#23281e',
                color: '#a3e635',
                border: '1px solid #365314',
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                width: 'fit-content',
              }}
            >
              📁 Choose Photo from Computer
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (uploadEvent) => {
                      upd('avatar', uploadEvent.target.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>

            {data.avatar && (
              <button
                type="button"
                onClick={() => upd('avatar', '')}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 11, textAlign: 'left', cursor: 'pointer', padding: 0 }}
              >
                ✕ Remove Photo
              </button>
            )}
          </div>
        </div>
      </div>

      <Input label="Your name" value={data.name} onChange={(v) => upd('name', v)} placeholder="e.g. Ankur Rana" />
      <Input label="Role / Headline" value={data.role} onChange={(v) => upd('role', v)} placeholder="Developer · Author · Researcher" />
      <Textarea label="Tagline" value={data.tagline} onChange={(v) => upd('tagline', v)} placeholder="Building software, exploring ideas..." rows={2} />
      <Input label="Location" value={data.location} onChange={(v) => upd('location', v)} placeholder="New Delhi, India" />
      <Input label="Email" type="email" value={data.email} onChange={(v) => upd('email', v)} placeholder="you@example.com" />
      <Input label="Primary CTA label" value={data.ctaLabel} onChange={(v) => upd('ctaLabel', v)} placeholder="View my work" />
      <Input label="Secondary CTA label" value={data.secondaryLabel} onChange={(v) => upd('secondaryLabel', v)} placeholder="Let's talk" />
      <div className="ep-field ep-toggle-row">
        <span>Show stats bar</span>
        <button
          className={`ep-toggle${data.showStats ? ' on' : ''}`}
          onClick={() => upd('showStats', !data.showStats)}
        >
          <i />
        </button>
      </div>
      {data.showStats && (
        <div className="ep-subgroup">
          <p className="ep-subgroup-label">Stats</p>
          {(data.stats || []).map((s, i) => (
            <div key={i} className="ep-row">
              <input value={s.value} onChange={(e) => {
                const next = [...data.stats];
                next[i] = { ...next[i], value: e.target.value };
                upd('stats', next);
              }} placeholder="5" />
              <input value={s.label} onChange={(e) => {
                const next = [...data.stats];
                next[i] = { ...next[i], label: e.target.value };
                upd('stats', next);
              }} placeholder="Projects" />
              <button className="ep-remove-btn" onClick={() => upd('stats', data.stats.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
          <button className="ep-add-btn" onClick={() => upd('stats', [...(data.stats || []), { value: '0', label: '' }])}>
            + Add stat
          </button>
        </div>
      )}
    </div>
  );
}

function AboutEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="ep-editor-fields">
      <Input label="Heading" value={data.heading} onChange={(v) => upd('heading', v)} />
      <Textarea label="Body" value={data.body} onChange={(v) => upd('body', v)} rows={6} />
      <Textarea label="Highlight quote (optional)" value={data.highlight} onChange={(v) => upd('highlight', v)} rows={2} />
    </div>
  );
}

function ProjectsEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  const projects = data.projects || [];

  const updateProject = (i, key, val) => {
    const next = projects.map((p, j) => j === i ? { ...p, [key]: val } : p);
    upd('projects', next);
  };

  const addProject = () => {
    upd('projects', [...projects, {
      id: nanoid(6), title: '', status: 'LIVE', description: '', tag: '', highlights: [], tech: [], github: '', demo: '',
    }]);
  };

  const removeProject = (i) => upd('projects', projects.filter((_, j) => j !== i));

  return (
    <div className="ep-editor-fields">
      <Input label="Section heading" value={data.heading} onChange={(v) => upd('heading', v)} />
      <Input label="Subheading" value={data.subheading} onChange={(v) => upd('subheading', v)} />
      {projects.map((proj, i) => (
        <div key={proj.id || i} className="ep-item-block">
          <div className="ep-item-header">
            <strong>{proj.title || `Project ${i + 1}`}</strong>
            <button className="ep-remove-btn" onClick={() => removeProject(i)}>Remove</button>
          </div>
          <Input label="Title" value={proj.title} onChange={(v) => updateProject(i, 'title', v)} />
          <div className="ep-field">
            <span>Status</span>
            <select value={proj.status || 'LIVE'} onChange={(e) => updateProject(i, 'status', e.target.value)}>
              <option value="LIVE">LIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
            </select>
          </div>
          <Textarea label="Description" value={proj.description} onChange={(v) => updateProject(i, 'description', v)} rows={3} />
          <Input label="Tech tag (e.g. 'React · Supabase')" value={proj.tag} onChange={(v) => updateProject(i, 'tag', v)} />
          <div className="ep-field">
            <span>Technologies (comma-separated)</span>
            <input
              value={(proj.tech || []).join(', ')}
              onChange={(e) => updateProject(i, 'tech', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="React, TypeScript, Supabase"
            />
          </div>
          <Input label="GitHub URL" value={proj.github} onChange={(v) => updateProject(i, 'github', v)} type="url" />
          <Input label="Live demo URL" value={proj.demo} onChange={(v) => updateProject(i, 'demo', v)} type="url" />
          <div className="ep-field">
            <span>Key highlights (one per line)</span>
            <textarea
              rows={3}
              value={(proj.highlights || []).join('\n')}
              onChange={(e) => updateProject(i, 'highlights', e.target.value.split('\n').filter(Boolean))}
              placeholder="Complete pipeline from lexer to VM"
            />
          </div>
        </div>
      ))}
      <button className="ep-add-btn" onClick={addProject}>+ Add project</button>
    </div>
  );
}

function SkillsEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  const cats = data.categories || [];

  const updateCat = (i, key, val) => {
    const next = cats.map((c, j) => j === i ? { ...c, [key]: val } : c);
    upd('categories', next);
  };

  return (
    <div className="ep-editor-fields">
      <Input label="Heading" value={data.heading} onChange={(v) => upd('heading', v)} />
      {cats.map((cat, i) => (
        <div key={i} className="ep-item-block">
          <div className="ep-item-header">
            <strong>{cat.label || `Category ${i + 1}`}</strong>
            <button className="ep-remove-btn" onClick={() => upd('categories', cats.filter((_, j) => j !== i))}>Remove</button>
          </div>
          <Input label="Category label" value={cat.label} onChange={(v) => updateCat(i, 'label', v)} />
          <div className="ep-field">
            <span>Skills (comma-separated)</span>
            <input
              value={(cat.items || []).join(', ')}
              onChange={(e) => updateCat(i, 'items', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="React, TypeScript, Node.js"
            />
          </div>
        </div>
      ))}
      <button className="ep-add-btn" onClick={() => upd('categories', [...cats, { label: '', items: [] }])}>
        + Add category
      </button>
    </div>
  );
}

function StatsEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  const stats = data.stats || [];
  return (
    <div className="ep-editor-fields">
      {stats.map((s, i) => (
        <div key={i} className="ep-row">
          <input value={s.value} placeholder="5" onChange={(e) => {
            const next = [...stats]; next[i] = { ...next[i], value: e.target.value }; upd('stats', next);
          }} />
          <input value={s.label} placeholder="Projects" onChange={(e) => {
            const next = [...stats]; next[i] = { ...next[i], label: e.target.value }; upd('stats', next);
          }} />
          <button className="ep-remove-btn" onClick={() => upd('stats', stats.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <button className="ep-add-btn" onClick={() => upd('stats', [...stats, { value: '0', label: '' }])}>+ Add stat</button>
    </div>
  );
}

function BooksEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  const books = data.books || [];
  const updateBook = (i, key, val) => {
    upd('books', books.map((b, j) => j === i ? { ...b, [key]: val } : b));
  };
  return (
    <div className="ep-editor-fields">
      <Input label="Heading" value={data.heading} onChange={(v) => upd('heading', v)} />
      <Input label="Subheading" value={data.subheading} onChange={(v) => upd('subheading', v)} />
      {books.map((book, i) => (
        <div key={book.id || i} className="ep-item-block">
          <div className="ep-item-header">
            <strong>{book.title || `Book ${i + 1}`}</strong>
            <button className="ep-remove-btn" onClick={() => upd('books', books.filter((_, j) => j !== i))}>Remove</button>
          </div>
          <Input label="Title" value={book.title} onChange={(v) => updateBook(i, 'title', v)} />
          <Input label="Subtitle" value={book.subtitle} onChange={(v) => updateBook(i, 'subtitle', v)} />
          <Input label="Genre" value={book.genre} onChange={(v) => updateBook(i, 'genre', v)} />
          <Input label="Pages" value={book.pages} onChange={(v) => updateBook(i, 'pages', v)} />
          <Input label="URL (Amazon / Gumroad)" value={book.url} onChange={(v) => updateBook(i, 'url', v)} type="url" />
        </div>
      ))}
      <button className="ep-add-btn" onClick={() => upd('books', [...books, { id: nanoid(6), title: '', subtitle: '', genre: '', pages: '', url: '' }])}>
        + Add book
      </button>
    </div>
  );
}

function ResearchEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  const papers = data.papers || [];
  const updatePaper = (i, key, val) => {
    upd('papers', papers.map((p, j) => j === i ? { ...p, [key]: val } : p));
  };
  return (
    <div className="ep-editor-fields">
      <Input label="Heading" value={data.heading} onChange={(v) => upd('heading', v)} />
      {papers.map((paper, i) => (
        <div key={paper.id || i} className="ep-item-block">
          <div className="ep-item-header">
            <strong>{paper.title ? paper.title.slice(0, 40) + '…' : `Paper ${i + 1}`}</strong>
            <button className="ep-remove-btn" onClick={() => upd('papers', papers.filter((_, j) => j !== i))}>Remove</button>
          </div>
          <Textarea label="Title" value={paper.title} onChange={(v) => updatePaper(i, 'title', v)} rows={2} />
          <Input label="Venue" value={paper.venue} onChange={(v) => updatePaper(i, 'venue', v)} placeholder="Zenodo Open Access" />
          <Input label="Type" value={paper.type} onChange={(v) => updatePaper(i, 'type', v)} placeholder="Conceptual Research" />
          <Input label="URL" value={paper.url} onChange={(v) => updatePaper(i, 'url', v)} type="url" />
        </div>
      ))}
      <button className="ep-add-btn" onClick={() => upd('papers', [...papers, { id: nanoid(6), title: '', venue: '', type: '', url: '' }])}>
        + Add paper
      </button>
    </div>
  );
}

function ContactEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  const links = data.links || [];
  return (
    <div className="ep-editor-fields">
      <Input label="Heading" value={data.heading} onChange={(v) => upd('heading', v)} />
      <Textarea label="Body" value={data.body} onChange={(v) => upd('body', v)} rows={3} />
      <Input label="Email" type="email" value={data.email} onChange={(v) => upd('email', v)} />
      <div className="ep-subgroup">
        <p className="ep-subgroup-label">Social links</p>
        {links.map((link, i) => (
          <div key={i} className="ep-row">
            <input value={link.label} placeholder="GitHub" onChange={(e) => {
              const next = [...links]; next[i] = { ...next[i], label: e.target.value }; upd('links', next);
            }} />
            <input value={link.url} placeholder="https://..." onChange={(e) => {
              const next = [...links]; next[i] = { ...next[i], url: e.target.value }; upd('links', next);
            }} />
            <button className="ep-remove-btn" onClick={() => upd('links', links.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
        <button className="ep-add-btn" onClick={() => upd('links', [...links, { label: '', url: '' }])}>+ Add link</button>
      </div>
    </div>
  );
}

function QuoteEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="ep-editor-fields">
      <Textarea label="Quote text" value={data.text} onChange={(v) => upd('text', v)} rows={3} />
      <Input label="Attribution" value={data.attribution} onChange={(v) => upd('attribution', v)} placeholder="Your name" />
    </div>
  );
}

function TimelineEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  const items = data.items || [];
  return (
    <div className="ep-editor-fields">
      <Input label="Heading" value={data.heading} onChange={(v) => upd('heading', v)} />
      {items.map((item, i) => (
        <div key={i} className="ep-item-block">
          <div className="ep-item-header">
            <strong>{item.title || `Item ${i + 1}`}</strong>
            <button className="ep-remove-btn" onClick={() => upd('items', items.filter((_, j) => j !== i))}>Remove</button>
          </div>
          <Input label="Year / Date" value={item.year} onChange={(v) => {
            const next = [...items]; next[i] = { ...next[i], year: v }; upd('items', next);
          }} placeholder="2024" />
          <Input label="Title" value={item.title} onChange={(v) => {
            const next = [...items]; next[i] = { ...next[i], title: v }; upd('items', next);
          }} />
          <Textarea label="Description" value={item.description} onChange={(v) => {
            const next = [...items]; next[i] = { ...next[i], description: v }; upd('items', next);
          }} rows={2} />
        </div>
      ))}
      <button className="ep-add-btn" onClick={() => upd('items', [...items, { year: '', title: '', description: '' }])}>+ Add item</button>
    </div>
  );
}

function CustomTextEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="ep-editor-fields">
      <Input label="Heading (optional)" value={data.heading} onChange={(v) => upd('heading', v)} />
      <Textarea label="Body" value={data.body} onChange={(v) => upd('body', v)} rows={6} />
    </div>
  );
}

function TestimonialsEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  const items = data.items || [];
  const updateItem = (i, key, val) =>
    upd('items', items.map((it, j) => j === i ? { ...it, [key]: val } : it));

  return (
    <div className="ep-editor-fields">
      <Input label="Heading" value={data.heading} onChange={(v) => upd('heading', v)} />
      {items.map((item, i) => (
        <div key={i} className="ep-item-block">
          <div className="ep-item-header">
            <strong>{item.author || `Testimonial ${i + 1}`}</strong>
            <button className="ep-remove-btn"
              onClick={() => upd('items', items.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
          <Input label="Author name" value={item.author} onChange={(v) => updateItem(i, 'author', v)} />
          <Input label="Role / Company" value={item.role} onChange={(v) => updateItem(i, 'role', v)} />
          <Textarea label="Quote" value={item.quote} onChange={(v) => updateItem(i, 'quote', v)} rows={3} />
        </div>
      ))}
      <button className="ep-add-btn"
        onClick={() => upd('items', [...items, { author: '', role: '', quote: '' }])}>
        + Add testimonial
      </button>
    </div>
  );
}

function ContactFormEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="ep-editor-fields">
      <Input label="Heading" value={data.heading} onChange={(v) => upd('heading', v)} />
      <Input label="Button label" value={data.buttonLabel} onChange={(v) => upd('buttonLabel', v)} placeholder="Send message" />
    </div>
  );
}

function BlogEditor({ data, onChange }) {
  const upd = (key, val) => onChange({ ...data, [key]: val });
  const entries = data.entries || [];
  const updateEntry = (i, key, val) =>
    upd('entries', entries.map((e, j) => j === i ? { ...e, [key]: val } : e));

  return (
    <div className="ep-editor-fields">
      <Input label="Heading" value={data.heading} onChange={(v) => upd('heading', v)} />
      {entries.map((entry, i) => (
        <div key={i} className="ep-item-block">
          <div className="ep-item-header">
            <strong>{entry.title || `Entry ${i + 1}`}</strong>
            <button className="ep-remove-btn"
              onClick={() => upd('entries', entries.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
          <Input label="Title" value={entry.title} onChange={(v) => updateEntry(i, 'title', v)} />
          <Textarea label="Body" value={entry.body} onChange={(v) => updateEntry(i, 'body', v)} rows={6} />
          <Input label="Image URL (optional)" value={entry.imageUrl}
                 onChange={(v) => updateEntry(i, 'imageUrl', v)} type="url" />
        </div>
      ))}
      <button className="ep-add-btn"
        onClick={() => upd('entries', [...entries, { title: '', body: '', imageUrl: '' }])}>
        + Add entry
      </button>
    </div>
  );
}

function getEditor(type) {
  const map = {
    [BLOCK_TYPES.HERO]: HeroEditor,
    [BLOCK_TYPES.ABOUT]: AboutEditor,
    [BLOCK_TYPES.PROJECTS]: ProjectsEditor,
    [BLOCK_TYPES.SKILLS]: SkillsEditor,
    [BLOCK_TYPES.STATS]: StatsEditor,
    [BLOCK_TYPES.BOOKS]: BooksEditor,
    [BLOCK_TYPES.RESEARCH]: ResearchEditor,
    [BLOCK_TYPES.CONTACT]: ContactEditor,
    [BLOCK_TYPES.QUOTE]: QuoteEditor,
    [BLOCK_TYPES.TIMELINE]: TimelineEditor,
    [BLOCK_TYPES.CUSTOM_TEXT]: CustomTextEditor,
    [BLOCK_TYPES.TESTIMONIALS]: TestimonialsEditor,
    [BLOCK_TYPES.CONTACT_FORM]: ContactFormEditor,
    [BLOCK_TYPES.BLOG]: BlogEditor,
  };
  return map[type] || null;
}

// ─── Main Editor Panel ────────────────────────────────────────────────────────

export default function EditorPanel({
  portfolio,
  activePage,
  onChangePage,
  onUpdateBlock,
  onAddBlock,
  onRemoveBlock,
  onReorderBlocks,
  activeBlockId,
  onSelectBlock,
}) {
  const [addingBlock, setAddingBlock] = useState(false);

  const pageBlocks = portfolio.pages?.[activePage]?.blocks || [];
  const activeBlock = activeBlockId ? pageBlocks.find((b) => b.id === activeBlockId) : null;

  const PAGES = ['home', 'work', 'about', 'contact'];

  const handleBlockChange = (updatedData) => {
    if (!activeBlock) return;
    onUpdateBlock(activeBlock.id, () => updatedData);
  };

  const EditorComponent = activeBlock ? getEditor(activeBlock.type) : null;

  return (
    <div className="ep-root">
      {/* Page tabs */}
      <div className="ep-pages">
        {PAGES.map((pg) => (
          <button
            key={pg}
            className={`ep-page-tab${activePage === pg ? ' active' : ''}`}
            onClick={() => onChangePage(pg)}
          >
            {pg.charAt(0).toUpperCase() + pg.slice(1)}
          </button>
        ))}
      </div>

      {/* Blocks sidebar */}
      <div className="ep-blocks-panel">
        <div className="ep-panel-header">
          <span>Blocks</span>
          <button className="ep-icon-btn" onClick={() => setAddingBlock(!addingBlock)} title="Add block">+</button>
        </div>

        {/* Add block picker */}
        {addingBlock && (
          <div className="ep-add-picker">
            <p className="ep-picker-label">Choose a block to add</p>
            <div className="ep-picker-grid">
              {Object.values(BLOCK_TYPES).map((type) => (
                <button
                  key={type}
                  className="ep-picker-item"
                  onClick={() => {
                    onAddBlock(activePage, type);
                    setAddingBlock(false);
                  }}
                >
                  <span className="ep-picker-icon">{BLOCK_ICONS[type]}</span>
                  <span>{BLOCK_LABELS[type]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Block list */}
        <div className="ep-block-list">
          {pageBlocks.map((block, idx) => (
            <div
              key={block.id}
              className={`ep-block-item${activeBlockId === block.id ? ' active' : ''}`}
              onClick={() => onSelectBlock(block.id === activeBlockId ? null : block.id)}
            >
              <span className="ep-block-icon">{BLOCK_ICONS[block.type]}</span>
              <div className="ep-block-item-info">
                <strong>{BLOCK_LABELS[block.type]}</strong>
                <span className="ep-block-type-tag">{block.type}</span>
              </div>
              <div className="ep-block-item-actions">
                {idx > 0 && (
                  <button
                    className="ep-icon-btn"
                    title="Move up"
                    onClick={(e) => {
                      e.stopPropagation();
                      const next = [...pageBlocks];
                      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                      onReorderBlocks(activePage, next);
                    }}
                  >↑</button>
                )}
                {idx < pageBlocks.length - 1 && (
                  <button
                    className="ep-icon-btn"
                    title="Move down"
                    onClick={(e) => {
                      e.stopPropagation();
                      const next = [...pageBlocks];
                      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                      onReorderBlocks(activePage, next);
                    }}
                  >↓</button>
                )}
                <button
                  className="ep-icon-btn ep-remove"
                  title="Remove block"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBlock(activePage, block.id);
                    if (activeBlockId === block.id) onSelectBlock(null);
                  }}
                >×</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Block editor */}
      {activeBlock && EditorComponent && (
        <div className="ep-field-panel">
          <div className="ep-field-header">
            <span className="ep-field-icon">{BLOCK_ICONS[activeBlock.type]}</span>
            <strong>Edit {BLOCK_LABELS[activeBlock.type]}</strong>
            <button className="ep-icon-btn" onClick={() => onSelectBlock(null)} style={{ marginLeft: 'auto' }}>×</button>
          </div>
          <div className="ep-field-scroll">
            <EditorComponent data={activeBlock} onChange={handleBlockChange} />
          </div>
        </div>
      )}

      {!activeBlock && !addingBlock && (
        <div className="ep-empty-state">
          <p>← Click a block to edit it</p>
          <p>or click <strong>+</strong> to add one</p>
        </div>
      )}
    </div>
  );
}
