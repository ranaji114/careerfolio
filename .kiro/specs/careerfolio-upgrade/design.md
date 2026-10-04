# Design Document — Careerfolio Upgrade

## Overview

This document describes the architecture and implementation plan for the ten upgrade features in Careerfolio. All features are built within the existing React + Vite project without new external dependencies. Persistence is exclusively through the browser's `localStorage` API, using the existing helper functions `readLocal`/`writeLocal` from `usePortfolioStore.js`. No real-time backend, no third-party SDK, and no PDF library are introduced.

---

## Architecture

### Current System Summary

- **App.jsx** — Root component; owns top-level routing state (`mode`), auth, and portfolio CRUD.
- **BuilderPage.jsx** — Full-screen editing workspace; owns preview state (`activePage`, `previewMode`, tabs).
- **DashboardPage.jsx** — Authenticated portfolio list; reads portfolios from props passed from App.
- **EditorPanel.jsx** — Block list + field editors; consumes `BLOCK_TYPES` / `createBlock` from `defaultPortfolio.js`.
- **PortfolioRenderer.jsx** — Renders any page of a portfolio using the selected template's color tokens.
- **defaultPortfolio.js** — Defines `BLOCK_TYPES` constant, `createBlock` factory, and `emptyPortfolio`.
- **usePortfolioStore.js** — `useAuth` and `usePortfolios` hooks; all localStorage I/O goes through here.
- **templates.js** — Array of template definitions (id, name, accent, bg, ink, card, muted, border, font).

### Key localStorage Keys

| Key | Shape | Owner |
|-----|-------|-------|
| `cf-user` | User object | `useAuth` |
| `cf-accounts` | User[] | `useAuth` |
| `cf-portfolios-{userId}` | Portfolio[] | `usePortfolios` |
| `cf-onboarding-done-{userId}` | `true` | App.jsx (new) |
| `cf-analytics` | `{ [portfolioId]: number }` | StandaloneWebsite (new) |
| `cf-contact-submissions` | Submission[] | PortfolioRenderer (new) |

---

## Feature Designs

### Feature 1 — Persona-Based Onboarding Quiz

**Components involved:** `App.jsx`, new `OnboardingQuizModal.jsx`

**New file:** `src/components/shared/OnboardingQuizModal.jsx`

**Logic in App.jsx:**

```jsx
// In App.jsx handleCreatePortfolio callback:
const handleCreatePortfolio = useCallback(() => {
  if (!user) { setShowAuth(true); return; }

  const onboardingDone = readLocal(`cf-onboarding-done-${user.id}`, false);
  const isFirstPortfolio = portfolios.length === 0;

  if (!onboardingDone && isFirstPortfolio) {
    setShowOnboardingQuiz(true); // new state
  } else {
    const id = create();
    setActivePortfolioId(id);
    setBuilderInitialTab('editor');
    setMode('builder');
  }
}, [user, create, portfolios]);
```

**Persona-to-template mapping (pure function, co-located in OnboardingQuizModal.jsx):**

```js
const PERSONA_DEFAULTS = {
  Student: {
    templateId: 'canvas',
    blockTypes: ['hero', 'about', 'skills', 'timeline', 'contact'],
  },
  Freelancer: {
    templateId: 'signal',
    blockTypes: ['hero', 'projects', 'skills', 'testimonials', 'contact_form'],
  },
  Developer: {
    templateId: 'obsidian',
    blockTypes: ['hero', 'projects', 'skills', 'stats', 'contact'],
  },
  Creator: {
    templateId: 'orbit',
    blockTypes: ['hero', 'about', 'blog', 'testimonials', 'contact'],
  },
};

export function applyPersonaDefaults(persona, emptyPortfolio) {
  const config = PERSONA_DEFAULTS[persona];
  if (!config) return emptyPortfolio;
  return {
    ...emptyPortfolio,
    templateId: config.templateId,
    pages: {
      ...emptyPortfolio.pages,
      home: {
        blocks: config.blockTypes.map((type) => createBlock(type)),
      },
    },
  };
}
```

**OnboardingQuizModal props:**

```tsx
interface OnboardingQuizModalProps {
  onConfirm: (persona: string | null) => void; // null = dismissed
}
```

On confirm or dismiss, `App.jsx`:
1. Calls `create()` to allocate a new portfolio ID.
2. If persona is non-null: calls `update(id, p => applyPersonaDefaults(persona, p))`.
3. Writes `cf-onboarding-done-{user.id}` = `true` to localStorage.
4. Navigates to Builder.

---

### Feature 2 — Testimonials Block

**New constants in `defaultPortfolio.js`:**

```js
export const BLOCK_TYPES = {
  // ...existing...
  TESTIMONIALS: 'testimonials',
};
```

**New `createBlock` default:**

```js
[BLOCK_TYPES.TESTIMONIALS]: {
  heading: 'Testimonials',
  items: [], // { author, role, quote }[]
},
```

**New `TestimonialsEditor` component inside `EditorPanel.jsx`:**

```jsx
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
```

**New `TestimonialsBlock` renderer in `PortfolioRenderer.jsx`:**

```jsx
function TestimonialsBlock({ data, t, editMode, onEdit }) {
  const items = data.items || [];
  return (
    <section className={`pf-block pf-testimonials${editMode ? ' pf-block--editable' : ''}`}
             onClick={editMode ? onEdit : undefined}>
      <div className="pf-section-label" style={{ color: t.accent }}>
        <span className="pf-label-line" style={{ background: t.accent }} />
        {data.heading || 'Testimonials'}
      </div>
      <div className="pf-testimonials-grid">
        {items.map((item, i) => (
          <blockquote key={i} className="pf-testimonial-card"
                      style={{ background: t.card, borderColor: t.border }}>
            <p className="pf-testimonial-quote" style={{ color: t.ink }}>
              ❝ {item.quote}
            </p>
            <footer>
              <strong style={{ color: t.ink }}>{item.author}</strong>
              {item.role && <span style={{ color: t.muted }}>{item.role}</span>}
            </footer>
          </blockquote>
        ))}
        {items.length === 0 && editMode && (
          <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>
            + Click to add testimonials
          </div>
        )}
      </div>
    </section>
  );
}
```

---

### Feature 3 — Contact Form Block

**New constants in `defaultPortfolio.js`:**

```js
CONTACT_FORM: 'contact_form',
```

**Default block data:**

```js
[BLOCK_TYPES.CONTACT_FORM]: {
  heading: 'Send me a message',
  buttonLabel: 'Send message',
},
```

**`ContactFormBlock` in `PortfolioRenderer.jsx`** — uses local React state for form fields. Submission writes to `cf-contact-submissions` in localStorage. No `usePortfolioStore` dependency needed since this is visitor-side interaction.

```jsx
function ContactFormBlock({ data, t, editMode, onEdit }) {
  const [form, setForm] = React.useState({ name: '', email: '', message: '' });
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  if (editMode) {
    return (
      <section className="pf-block pf-contact-form pf-block--editable" onClick={onEdit}>
        <div className="pf-section-label" style={{ color: t.accent }}>
          <span className="pf-label-line" style={{ background: t.accent }} />
          {data.heading || 'Contact Form'}
        </div>
        <p style={{ color: t.muted, fontSize: 13 }}>
          [Live contact form — click to edit heading]
        </p>
      </section>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const missing = ['name', 'email', 'message'].find((f) => !form[f].trim());
    if (missing) { setError(`Please fill in your ${missing}.`); return; }
    const submissions = JSON.parse(localStorage.getItem('cf-contact-submissions') || '[]');
    submissions.push({
      portfolioId: data.portfolioId, // injected by PortfolioRenderer
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('cf-contact-submissions', JSON.stringify(submissions));
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
          {error && <p className="pf-cf-error" style={{ color: '#ef4444' }}>{error}</p>}
          <input
            className="pf-cf-input"
            style={{ borderColor: t.border, background: t.card, color: t.ink }}
            type="text" placeholder="Your name" value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className="pf-cf-input"
            style={{ borderColor: t.border, background: t.card, color: t.ink }}
            type="email" placeholder="Your email" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <textarea
            className="pf-cf-textarea"
            style={{ borderColor: t.border, background: t.card, color: t.ink }}
            placeholder="Your message" rows={5} value={form.message}
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
```

The `portfolioId` is injected into each block's data by `PortfolioRenderer` when iterating blocks:

```jsx
const enrichedBlock = block.type === BLOCK_TYPES.CONTACT_FORM
  ? { ...block, portfolioId: portfolio.id }
  : block;
```

---

### Feature 4 — Portfolio Analytics (View Counts)

**Analytics store helper (can be inlined or placed in `src/utils/analytics.js`):**

```js
const ANALYTICS_KEY = 'cf-analytics';

export function incrementViewCount(portfolioId) {
  try {
    const store = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}');
    store[portfolioId] = (store[portfolioId] || 0) + 1;
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(store));
  } catch {}
}

export function getViewCount(portfolioId) {
  try {
    const store = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}');
    return store[portfolioId] || 0;
  } catch {
    return 0;
  }
}
```

**`StandaloneWebsite.jsx`** — call `incrementViewCount(portfolioId)` in a `useEffect` with an empty dependency array (fires once on mount):

```jsx
useEffect(() => {
  if (portfolio?.id) incrementViewCount(portfolio.id);
}, []); // eslint-disable-line react-hooks/exhaustive-deps
```

**`DashboardPage.jsx`** — import `getViewCount` and display in each card:

```jsx
import { getViewCount } from '../utils/analytics';

// Inside dashboard card render:
<span className="dashboard-view-count">
  {getViewCount(portfolio.id)} view{getViewCount(portfolio.id) !== 1 ? 's' : ''}
</span>
```

---

### Feature 5 — Copy Link Button on Dashboard Cards

**In `DashboardPage.jsx`**, add a `copiedId` state and a `handleCopyLink` function:

```jsx
const [copiedId, setCopiedId] = React.useState(null);

const handleCopyLink = async (portfolio) => {
  const url = getPublicPortfolioUrl(portfolio);
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
  } else {
    // Fallback for browsers without clipboard API
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
  setCopiedId(portfolio.id);
  setTimeout(() => setCopiedId((prev) => prev === portfolio.id ? null : prev), 2000);
};
```

**In each dashboard card's card-actions area:**

```jsx
<button
  className="card-copy-link-btn"
  onClick={() => handleCopyLink(portfolio)}
>
  {copiedId === portfolio.id ? 'Copied! ✓' : 'Copy link'}
</button>
```

---

### Feature 6 — Profile Completion Percentage Bar

**Pure helper function in `DashboardPage.jsx` (or extracted to `src/utils/completionScore.js`):**

```js
export function computeCompletionScore(portfolio) {
  const homeBlocks = portfolio.pages?.home?.blocks || [];
  const hero = homeBlocks.find((b) => b.type === 'hero') || {};
  const projects = homeBlocks.find((b) => b.type === 'projects');
  const skills = homeBlocks.find((b) => b.type === 'skills');
  const about = portfolio.pages?.about?.blocks?.find((b) => b.type === 'about') || {};

  const isPopulated = (val) => (typeof val === 'string' ? val.trim().length > 0 : false);
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const fields = [
    isPopulated(hero.name),
    isPopulated(hero.role),
    isPopulated(hero.tagline),
    isPopulated(hero.email),
    isPopulated(hero.location),
    hasItems(projects?.projects),
    hasItems(skills?.categories),
    isPopulated(about.body),
  ];

  const populated = fields.filter(Boolean).length;
  return Math.floor((populated / 8) * 100);
}
```

**In each dashboard card:**

```jsx
const score = computeCompletionScore(portfolio);

<div className="dashboard-completion-bar">
  <div className="dashboard-completion-track"
       style={{ borderColor: t.border }}>
    <div className="dashboard-completion-fill"
         style={{ width: `${score}%`, background: t.accent }} />
  </div>
  <span className="dashboard-completion-label" style={{ color: t.muted }}>
    {score >= 100 ? 'Profile complete ✓' : `${score}% complete`}
  </span>
</div>
```

---

### Feature 7 — LinkedIn Import Modal

**New file:** `src/components/shared/LinkedInImportModal.jsx`

**Props:**

```tsx
interface LinkedInImportModalProps {
  onImport: (data: { name?: string; role?: string; skills?: string[] }) => void;
  onClose: () => void;
}
```

**Fetch strategy:** Direct `fetch()` of the LinkedIn URL. LinkedIn blocks CORS by default, so the fetch will fail in-browser. The modal handles this gracefully:

```jsx
const handleImport = async () => {
  if (!url.trim()) return;
  setStatus('loading');
  try {
    const res = await fetch(url.trim(), { mode: 'no-cors' });
    // no-cors = opaque response — we can't read the body
    // Best-effort: try to extract from response text if available
    throw new Error('CORS_BLOCKED');
  } catch (err) {
    setStatus('error');
    setMessage(
      'Import could not be completed. LinkedIn restricts automated access. ' +
      'Try copying your name, role, and skills manually from your profile.'
    );
  }
};
```

This approach satisfies the requirement: attempt the fetch, handle failure gracefully, show error message, leave existing data unchanged. No fake "success" path is simulated.

**When import succeeds** (future-proofed, if a user pastes a plain-text version or if a public CORS proxy is ever used), `BuilderPage.jsx` handles the merge in `handleLinkedInImport`:

```jsx
const handleLinkedInImport = useCallback((extracted) => {
  onUpdate((p) => {
    const homeBlocks = p.pages?.home?.blocks || [];
    let updatedBlocks = homeBlocks.map((b) => {
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
```

**Disclaimer text in modal:**

> "Parsing is best-effort. Results may be incomplete or unavailable due to LinkedIn's access restrictions."

**"LinkedIn Import" button added to the Preview Toolbar in `BuilderPage.jsx`** alongside the existing GitHub Import button.

---

### Feature 8 — Dark/Light Mode Toggle in Builder Preview

**State added to `BuilderPage.jsx`:**

```jsx
const [previewTheme, setPreviewTheme] = useState('light'); // 'light' | 'dark' — NOT persisted
```

**Preview canvas wrapper:**

```jsx
<div
  className={`bv2-preview-scroll`}
  data-preview-theme={previewTheme}
>
  <PortfolioRenderer ... />
</div>
```

**CSS in `styles.css`:**

```css
[data-preview-theme="dark"] {
  background: #0a0a0a !important;
  color: #f5f5f5 !important;
}

[data-preview-theme="light"] {
  background: #ffffff !important;
  color: #111111 !important;
}
```

**Toggle in Preview Toolbar:**

```jsx
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
```

`StandaloneWebsite.jsx` has no reference to this state — it renders `PortfolioRenderer` directly without any `data-preview-theme` wrapper.

---

### Feature 9 — Export Portfolio as PDF

**State added to `BuilderPage.jsx`:**

```jsx
const [pdfMode, setPdfMode] = useState(false);
```

**Export PDF button in Preview Toolbar:**

```jsx
<button
  className="bv2-export-pdf-btn"
  onClick={() => {
    setPdfMode(true);
    // Allow React to apply the class before print dialog opens
    requestAnimationFrame(() => {
      window.print();
      setPdfMode(false);
    });
  }}
>
  Export PDF
</button>
```

**Preview canvas wrapper:**

```jsx
<div
  className={`bv2-preview-scroll${pdfMode ? ' pdf-export-mode' : ''}`}
  data-preview-theme={previewTheme}
>
```

**`@media print` CSS in `styles.css`:**

```css
@media print {
  .bv2-topbar,
  .bv2-left,
  .bv2-live-url-bar,
  .bv2-preview-tabs,
  .bv2-theme-toggle,
  .bv2-export-pdf-btn,
  .bv2-preview-toggle,
  .pf-floating-hud-btn,
  .pf-nav {
    display: none !important;
  }

  .bv2-body,
  .bv2-preview-area,
  .bv2-preview-frame,
  .bv2-preview-scroll {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  body {
    background: white;
  }
}
```

`window.print()` is synchronous in most browsers — the dialog blocks JS execution. Using `requestAnimationFrame` ensures the `pdfMode` class is applied before print is called. After `window.print()` returns, `setPdfMode(false)` removes the class.

---

### Feature 10 — Blog/Case Study Block

**New constant in `defaultPortfolio.js`:**

```js
BLOG: 'blog',
```

**Default block data:**

```js
[BLOCK_TYPES.BLOG]: {
  heading: 'Blog & Case Studies',
  entries: [], // { title, body, imageUrl }[]
},
```

**`BlogEditor` in `EditorPanel.jsx`:**

```jsx
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
```

**`BlogBlock` in `PortfolioRenderer.jsx`:**

```jsx
function BlogBlock({ data, t, editMode, onEdit }) {
  const entries = data.entries || [];
  return (
    <section className={`pf-block pf-blog${editMode ? ' pf-block--editable' : ''}`}
             onClick={editMode ? onEdit : undefined}>
      <div className="pf-section-label" style={{ color: t.accent }}>
        <span className="pf-label-line" style={{ background: t.accent }} />
        {data.heading || 'Blog & Case Studies'}
      </div>
      <div className="pf-blog-list">
        {entries.map((entry, i) => (
          <article key={i} className="pf-blog-entry"
                   style={{ borderColor: t.border }}>
            {entry.imageUrl && (
              <img
                src={entry.imageUrl}
                alt={entry.title || 'Blog image'}
                className="pf-blog-image"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <h3 style={{ color: t.ink }}>{entry.title}</h3>
            <p style={{ color: t.muted }}>{entry.body}</p>
          </article>
        ))}
        {entries.length === 0 && editMode && (
          <div className="pf-empty-block" style={{ color: t.muted, borderColor: t.border }}>
            + Click to add a blog entry
          </div>
        )}
      </div>
    </section>
  );
}
```

---

## Data Models

### Updated `BLOCK_TYPES` constant

```js
export const BLOCK_TYPES = {
  HERO:          'hero',
  ABOUT:         'about',
  PROJECTS:      'projects',
  SKILLS:        'skills',
  STATS:         'stats',
  BOOKS:         'books',
  RESEARCH:      'research',
  CONTACT:       'contact',
  DIVIDER:       'divider',
  QUOTE:         'quote',
  TIMELINE:      'timeline',
  CUSTOM_TEXT:   'custom_text',
  TESTIMONIALS:  'testimonials',   // new
  CONTACT_FORM:  'contact_form',   // new
  BLOG:          'blog',           // new
};
```

### Contact Form Submission Schema

```ts
interface ContactSubmission {
  portfolioId: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string; // ISO 8601
}
```

### Analytics Store Schema

```ts
type AnalyticsStore = { [portfolioId: string]: number };
```

---

## Components and Interfaces

### `OnboardingQuizModal`

```tsx
// src/components/shared/OnboardingQuizModal.jsx
props: {
  onConfirm: (persona: 'Student' | 'Freelancer' | 'Developer' | 'Creator' | null) => void;
}
```

Internal state: `selectedPersona: string | null`

Renders four option buttons. "Get started" button calls `onConfirm(selectedPersona)`. "Skip" or close button calls `onConfirm(null)`.

### `LinkedInImportModal`

```tsx
// src/components/shared/LinkedInImportModal.jsx
props: {
  onImport: (extracted: { name?: string; role?: string; skills?: string[] }) => void;
  onClose: () => void;
}
```

Internal state: `url: string`, `status: 'idle' | 'loading' | 'success' | 'error'`, `message: string`

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| LinkedIn fetch fails (CORS / network) | Modal shows error message; no portfolio data is mutated |
| Contact form submitted with empty fields | Inline error message shown; `cf-contact-submissions` not written |
| `navigator.clipboard` unavailable | Falls back to `execCommand('copy')` via temporary `<input>` |
| `localStorage.setItem` throws (storage quota) | All writes are wrapped in `try/catch`; operation silently fails |
| Blog image URL is invalid / 404 | `onError` handler hides the `<img>` element |
| `window.print` call | No error handling needed; browser manages the dialog lifecycle |

---

## Testing Strategy

### Approach

Each feature is tested at two levels:

**Unit / Example tests** — Verify specific behaviors with concrete inputs. Used for UI rendering assertions (button presence, form fields), state transitions (copy link → "Copied!" label), and single-path behaviors.

**Property-based tests** — Verify universal invariants across many generated inputs. Used for pure functions (`applyPersonaDefaults`, `computeCompletionScore`, `incrementViewCount`, `createBlock`, form validation, data merge logic, and block renderers).

### Key Test Areas by Feature

| Feature | Test type | What is tested |
|---------|-----------|----------------|
| Onboarding quiz | Property | `applyPersonaDefaults` — persona → template+blocks mapping |
| Onboarding flag | Property | Flag written for any userId after completion |
| New block schemas | Property | `createBlock` output shape for testimonials/contact_form/blog |
| CRUD on items/entries | Property | Add increases count; remove decreases count |
| Testimonials renderer | Property | All items rendered with correct tokens |
| Contact form validation | Property | Any missing field → no localStorage write |
| Contact form round-trip | Property | Valid submit → localStorage contains matching entry |
| View count increment | Property | Count increments exactly once per call; total = call count |
| Completion score | Property | Score in [0,100]; monotone with field population |
| LinkedIn import merge | Property | Existing categories preserved; new category appended |
| Preview theme localStorage | Property | No localStorage key written for any toggle sequence |
| Blog image conditional | Property | `<img>` rendered iff `imageUrl` is non-empty |
| Copy link button | Example | Button present; clipboard API called |
| Dark/light toggle | Example | `data-preview-theme` attribute scoped to canvas only |
| PDF export | Example | `window.print()` called; class applied and removed |

### Unit Testing Balance

- Property tests cover the wide input space for pure functions and data transformations.
- Example-based tests handle UI interaction paths (button click, modal open/close), one-time behaviors, and side-effect verification (clipboard, print, localStorage key presence).
- Integration tests are not required for this feature set — all external interactions (LinkedIn fetch failure, clipboard fallback) are handled with graceful degradation in unit/example tests using mocks.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Persona pre-fill matches mapping table

*For any* persona value in `{Student, Freelancer, Developer, Creator}`, the portfolio produced by `applyPersonaDefaults(persona, emptyPortfolio())` SHALL have `templateId` and home-page block types that exactly match the persona-to-template mapping table, with no extra or missing block types.

**Validates: Requirements 1.3**

---

### Property 2: Onboarding flag written for any userId

*For any* user ID string, after onboarding is completed (persona selected or quiz dismissed), `readLocal('cf-onboarding-done-{userId}', false)` SHALL return `true`.

**Validates: Requirements 1.4**

---

### Property 3: New block schemas satisfy required fields

*For any* call to `createBlock(type)` where `type` is one of `testimonials`, `contact_form`, or `blog`, the returned block object SHALL contain all required fields for that type (`testimonials` → `heading` string + `items` array; `contact_form` → `heading` string + `buttonLabel` string defaulting to `"Send message"`; `blog` → `heading` string + `entries` array where each entry has `title`, `body`, `imageUrl` fields).

**Validates: Requirements 2.2, 3.2, 10.2**

---

### Property 4: Item list CRUD invariant (testimonials and blog entries)

*For any* block data object with an `items` (or `entries`) array of length N, adding one item SHALL produce an array of length N+1, and removing the item at index i (where 0 ≤ i < N) SHALL produce an array of length N-1 containing all original items except index i.

**Validates: Requirements 2.4, 10.4**

---

### Property 5: Testimonials block renders all items using template tokens

*For any* testimonials block with a non-empty `items` array, the `TestimonialsBlock` renderer SHALL produce output containing each item's `quote`, `author`, and `role` text, with text colored using the template's `ink` and `muted` tokens.

**Validates: Requirements 2.5**

---

### Property 6: Contact form rejects any submission with a missing field

*For any* form state where at least one of `{name, email, message}` is an empty string or whitespace-only string, `handleSubmit` SHALL NOT append to `cf-contact-submissions` and SHALL set a non-empty error message.

**Validates: Requirements 3.5**

---

### Property 7: Contact form submission round-trip

*For any* valid triple `{name, email, message}` (all non-empty), after `handleSubmit` is called with `portfolioId = P`, the `cf-contact-submissions` array in localStorage SHALL contain an entry where `portfolioId === P`, `name`, `email`, and `message` match the submitted values.

**Validates: Requirements 3.4**

---

### Property 8: View count increments exactly once per mount

*For any* portfolio ID and any initial view count N (including N = 0), calling `incrementViewCount(id)` exactly once SHALL result in `getViewCount(id) === N + 1`. After M total calls to `incrementViewCount(id)`, `getViewCount(id)` SHALL equal M (starting from 0).

**Validates: Requirements 4.1, 4.5**

---

### Property 9: Completion score is bounded and monotone

*For any* portfolio object, `computeCompletionScore(portfolio)` SHALL return an integer in `[0, 100]`. Furthermore, if portfolio B is derived from portfolio A by populating one additional field from the scoring set, then `computeCompletionScore(B) >= computeCompletionScore(A)`.

**Validates: Requirements 6.2, 6.3**

---

### Property 10: LinkedIn import preserves existing skill categories

*For any* portfolio with an existing Skills block containing K categories, and any extracted skills list (possibly empty), calling `handleLinkedInImport({ skills })` SHALL result in a Skills block with at least K categories; if `skills` is non-empty, the result SHALL contain exactly K+1 categories with the last one having label `"LinkedIn Skills"`.

**Validates: Requirements 7.4**

---

### Property 11: Preview theme is never written to localStorage

*For any* sequence of light/dark toggle actions in `BuilderPage`, the key space of `localStorage` SHALL contain no key matching `/preview.theme/i` after any toggle action.

**Validates: Requirements 8.6**

---

### Property 12: Blog entry image is rendered if and only if imageUrl is non-empty

*For any* blog entry object, the `BlogBlock` renderer SHALL render an `<img>` element if and only if `entry.imageUrl` is a non-empty string. If `imageUrl` is absent, `null`, or an empty string, no `<img>` element SHALL appear for that entry.

**Validates: Requirements 10.5, 10.6**
