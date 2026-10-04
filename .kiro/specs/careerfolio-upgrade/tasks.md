# Implementation Plan: Careerfolio Upgrade (10 Features)

## Overview

Ten incremental upgrades to the existing React + Vite Careerfolio project. All persistence uses `localStorage` only. Tasks are ordered so each step builds on the previous and nothing is left unintegrated. The design document is the canonical reference for code shapes; tasks reference it throughout.

---

## Tasks

- [ ] 1. Extend `BLOCK_TYPES` and `createBlock` defaults for three new block types
  - [ ] 1.1 Add `TESTIMONIALS`, `CONTACT_FORM`, and `BLOG` to `BLOCK_TYPES` in `src/data/defaultPortfolio.js`
    - Add the three new string constants to the `BLOCK_TYPES` export object
    - Add their default data shapes to the `defaults` map inside `createBlock`: `testimonials` → `{ heading, items: [] }`, `contact_form` → `{ heading, buttonLabel: 'Send message' }`, `blog` → `{ heading, entries: [] }`
    - _Requirements: 2.2, 3.2, 10.2_
  - [ ]* 1.2 Write property test for new block schemas (Property 3)
    - **Property 3: New block schemas satisfy required fields**
    - For each of `testimonials`, `contact_form`, `blog`: call `createBlock(type)` with arbitrary overrides and assert the returned object always contains all required fields with correct types
    - **Validates: Requirements 2.2, 3.2, 10.2**

- [ ] 2. Add `TestimonialsEditor` to `EditorPanel.jsx`
  - [ ] 2.1 Implement `TestimonialsEditor` component and wire it into `getEditor` and `BLOCK_LABELS`/`BLOCK_ICONS` maps
    - Write `TestimonialsEditor({ data, onChange })` using the existing `Input`/`Textarea` primitives and the item-add/remove pattern from `TimelineEditor`
    - Add `[BLOCK_TYPES.TESTIMONIALS]` entries to `BLOCK_LABELS` (`'Testimonials'`), `BLOCK_ICONS` (`'❝'`), and the `getEditor` map
    - _Requirements: 2.1, 2.3, 2.4_
  - [ ]* 2.2 Write property test for testimonials item list CRUD invariant (Property 4)
    - **Property 4: Item list CRUD invariant (testimonials)**
    - For any `items` array of length N, adding one item produces length N+1; removing item at index i produces length N-1 with all original items except index i
    - **Validates: Requirements 2.4**

- [ ] 3. Add `ContactFormEditor` to `EditorPanel.jsx`
  - [ ] 3.1 Implement `ContactFormEditor` component and wire it into `getEditor`, `BLOCK_LABELS`, and `BLOCK_ICONS`
    - Write `ContactFormEditor({ data, onChange })` with fields for `heading` and `buttonLabel`
    - Add `[BLOCK_TYPES.CONTACT_FORM]` entries to `BLOCK_LABELS` (`'Contact Form'`), `BLOCK_ICONS` (`'✉'`), and `getEditor`
    - _Requirements: 3.1, 3.2_

- [ ] 4. Add `BlogEditor` to `EditorPanel.jsx`
  - [ ] 4.1 Implement `BlogEditor` component and wire it into `getEditor`, `BLOCK_LABELS`, and `BLOCK_ICONS`
    - Write `BlogEditor({ data, onChange })` with `heading` field and per-entry fields (`title`, `body` textarea, `imageUrl`) plus add/remove item pattern
    - Add `[BLOCK_TYPES.BLOG]` entries to `BLOCK_LABELS` (`'Blog / Case Study'`), `BLOCK_ICONS` (`'◧'`), and `getEditor`
    - _Requirements: 10.1, 10.3, 10.4_
  - [ ]* 4.2 Write property test for blog entries CRUD invariant (Property 4)
    - **Property 4: Item list CRUD invariant (blog entries)**
    - For any `entries` array of length N, adding one entry produces length N+1; removing entry at index i produces length N-1 with all original entries except index i
    - **Validates: Requirements 10.4**

- [ ] 5. Checkpoint — verify block editor round-trip
  - Add any one of the three new block types in the builder, fill in fields, confirm the preview area re-renders without errors, then remove the test block.

- [ ] 6. Add `TestimonialsBlock` renderer to `PortfolioRenderer.jsx`
  - [ ] 6.1 Implement `TestimonialsBlock` component and register it in `renderBlock`
    - Write `TestimonialsBlock({ data, t, editMode, onEdit })` rendering each item as a `<blockquote>` styled with `t.card`, `t.border`, `t.ink`, `t.muted`, `t.accent`
    - Add `case BLOCK_TYPES.TESTIMONIALS` to the `renderBlock` switch
    - _Requirements: 2.5_
  - [ ]* 6.2 Write property test for testimonials renderer (Property 5)
    - **Property 5: Testimonials block renders all items using template tokens**
    - For any non-empty `items` array, assert output contains each item's `quote`, `author`, and `role`; colors use `t.ink` and `t.muted`
    - **Validates: Requirements 2.5**

- [ ] 7. Add `ContactFormBlock` renderer to `PortfolioRenderer.jsx`
  - [ ] 7.1 Implement `ContactFormBlock` component and register it in `renderBlock`
    - Write `ContactFormBlock({ data, t, editMode, onEdit })` with local state for form fields, inline validation, localStorage submission write to `cf-contact-submissions`, confirmation message on success, and edit-mode placeholder (no live form in edit mode)
    - Inject `portfolioId` from `portfolio.id` into the block data inside the `blocks.map` loop in `PortfolioRenderer` (add enrichment step before calling `renderBlock`)
    - Add `case BLOCK_TYPES.CONTACT_FORM` to `renderBlock`
    - _Requirements: 3.3, 3.4, 3.5, 3.6_
  - [ ]* 7.2 Write property test for contact form missing-field rejection (Property 6)
    - **Property 6: Contact form rejects any submission with a missing field**
    - For any form state where at least one of `{name, email, message}` is empty or whitespace-only, `handleSubmit` must NOT write to `cf-contact-submissions` and must set a non-empty error message
    - **Validates: Requirements 3.5**
  - [ ]* 7.3 Write property test for contact form submission round-trip (Property 7)
    - **Property 7: Contact form submission round-trip**
    - For any valid `{name, email, message}` triple (all non-empty), after `handleSubmit` with `portfolioId = P`, `cf-contact-submissions` must contain a matching entry
    - **Validates: Requirements 3.4**

- [ ] 8. Add `BlogBlock` renderer to `PortfolioRenderer.jsx`
  - [ ] 8.1 Implement `BlogBlock` component and register it in `renderBlock`
    - Write `BlogBlock({ data, t, editMode, onEdit })` rendering each entry as an `<article>` with conditional `<img>` (only when `imageUrl` is non-empty) and an `onError` handler that hides the image on load failure
    - Add `case BLOCK_TYPES.BLOG` to `renderBlock`
    - _Requirements: 10.5, 10.6_
  - [ ]* 8.2 Write property test for blog image conditional rendering (Property 12)
    - **Property 12: Blog entry image is rendered if and only if imageUrl is non-empty**
    - For any blog entry: `<img>` is present iff `imageUrl` is a non-empty string; absent, null, or empty string produces no `<img>` for that entry
    - **Validates: Requirements 10.5, 10.6**

- [ ] 9. Create `src/utils/analytics.js` and wire it into `StandaloneWebsite.jsx`
  - [ ] 9.1 Write `analytics.js` with `incrementViewCount` and `getViewCount` helpers
    - Both functions read/write the `cf-analytics` JSON object in `localStorage`, wrapped in `try/catch`
    - _Requirements: 4.2_
  - [ ]* 9.2 Write property test for view count increment (Property 8)
    - **Property 8: View count increments exactly once per mount**
    - For any portfolio ID and initial count N, calling `incrementViewCount(id)` once produces `getViewCount(id) === N + 1`; after M calls total, count equals M (starting from 0)
    - **Validates: Requirements 4.1, 4.5**
  - [ ] 9.3 Call `incrementViewCount(portfolio.id)` in `StandaloneWebsite.jsx` on mount
    - Add a `useEffect(() => { if (portfolio?.id) incrementViewCount(portfolio.id); }, [])` (empty deps — fires once per mount)
    - Import `incrementViewCount` from `../utils/analytics`
    - _Requirements: 4.1, 4.5_

- [ ] 10. Add view count display and copy-link button to `DashboardPage.jsx`
  - [ ] 10.1 Import `getViewCount` and display view count on each dashboard card
    - Import `getViewCount` from `../utils/analytics`
    - Render `{getViewCount(portfolio.id)} view{getViewCount(portfolio.id) !== 1 ? 's' : ''}` inside the card-bottom area, styled with `t.muted`
    - _Requirements: 4.3, 4.4_
  - [ ] 10.2 Add `copiedId` state and `handleCopyLink` function; render "Copy link" button in card-actions
    - Add `const [copiedId, setCopiedId] = React.useState(null)` at the top of `DashboardPage`
    - Write `handleCopyLink(portfolio)` using `navigator.clipboard?.writeText` with `execCommand('copy')` fallback via a temporary `<input>`
    - Add `<button className="card-copy-link-btn" onClick={() => handleCopyLink(portfolio)}>` with label toggling between `'Copy link'` and `'Copied! ✓'` based on `copiedId === portfolio.id`
    - Use `setTimeout(..., 2000)` to reset `copiedId`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 11. Add profile completion percentage bar to `DashboardPage.jsx`
  - [ ] 11.1 Implement `computeCompletionScore` pure function and render the progress bar in each dashboard card
    - Write `computeCompletionScore(portfolio)` using the 8-field scoring set: Hero `name`, `role`, `tagline`, `email`, `location`; at least one Project item; at least one Skill category; About `body`
    - Render `<div className="dashboard-completion-bar">` containing the track + fill div (width = `${score}%`) and a label showing `'Profile complete ✓'` at 100% or `'${score}% complete'` otherwise
    - Style track/fill with template color tokens (`t.accent`, `t.border`)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [ ]* 11.2 Write property test for completion score bounds and monotonicity (Property 9)
    - **Property 9: Completion score is bounded and monotone**
    - For any portfolio, `computeCompletionScore` returns an integer in `[0, 100]`; populating one additional field from the scoring set never decreases the score
    - **Validates: Requirements 6.2, 6.3**

- [ ] 12. Checkpoint — verify dashboard enhancements
  - Open the dashboard, confirm view counts show `0 views` for new portfolios, confirm the completion bar renders with a percentage, confirm "Copy link" copies the correct URL.

- [ ] 13. Add dark/light mode toggle and PDF export to `BuilderPage.jsx`
  - [ ] 13.1 Add `previewTheme` state and theme toggle buttons to the Preview Toolbar
    - Add `const [previewTheme, setPreviewTheme] = useState('light')` (not persisted)
    - Add `data-preview-theme={previewTheme}` to the `.bv2-preview-scroll` wrapper div
    - Add two toggle buttons (`☀ Light` / `☾ Dark`) inside the `bv2-preview-tabs` area with `className="bv2-theme-toggle"`
    - _Requirements: 8.1, 8.2, 8.3, 8.6_
  - [ ]* 13.2 Write property test for preview theme localStorage isolation (Property 11)
    - **Property 11: Preview theme is never written to localStorage**
    - For any sequence of light/dark toggle actions in `BuilderPage`, no key matching `/preview.theme/i` should appear in localStorage after any toggle
    - **Validates: Requirements 8.6**
  - [ ] 13.3 Add `pdfMode` state and "Export PDF" button wired to `window.print()`
    - Add `const [pdfMode, setPdfMode] = useState(false)`
    - Spread `pdfMode ? ' pdf-export-mode' : ''` into the `.bv2-preview-scroll` className
    - Add `<button className="bv2-export-pdf-btn">Export PDF</button>` in the toolbar; on click: `setPdfMode(true)`, then `requestAnimationFrame(() => { window.print(); setPdfMode(false); })`
    - _Requirements: 9.1, 9.2, 9.4_

- [ ] 14. Add dark/light and print CSS to `src/styles.css`
  - [ ] 14.1 Add `[data-preview-theme]` scoped CSS rules and `@media print` block
    - Add `[data-preview-theme="dark"] { background: #0a0a0a !important; color: #f5f5f5 !important; }` and the corresponding light rule
    - Add `@media print { ... }` hiding `.bv2-topbar`, `.bv2-left`, `.bv2-live-url-bar`, `.bv2-preview-tabs`, `.bv2-theme-toggle`, `.bv2-export-pdf-btn`, `.bv2-preview-toggle`, `.pf-floating-hud-btn`, `.pf-nav` and making `.bv2-body`, `.bv2-preview-area`, `.bv2-preview-frame`, `.bv2-preview-scroll` full-width block layout
    - Add styles for `.dashboard-completion-bar`, `.dashboard-completion-track`, `.dashboard-completion-fill`, `.dashboard-view-count`, `.card-copy-link-btn`, `.bv2-theme-toggle`, `.pf-testimonials-grid`, `.pf-testimonial-card`, `.pf-cf-form`, `.pf-cf-input`, `.pf-cf-textarea`, `.pf-cf-submit`, `.pf-cf-error`, `.pf-cf-success`, `.pf-blog-list`, `.pf-blog-entry`, `.pf-blog-image`
    - _Requirements: 8.4, 8.5, 9.3_

- [ ] 15. Create `src/components/shared/LinkedInImportModal.jsx`
  - [ ] 15.1 Implement `LinkedInImportModal` component with URL input, import attempt, CORS error handling, and disclaimer
    - Props: `{ onImport, onClose }`
    - Internal state: `url`, `status` (`'idle' | 'loading' | 'error'`), `message`
    - On "Import" click: set status to `'loading'`, attempt `fetch(url, { mode: 'no-cors' })`, always land in the `catch` and set status to `'error'` with the message: `"Import could not be completed. LinkedIn restricts automated access. Try copying your name, role, and skills manually from your profile."`
    - Display disclaimer: `"Parsing is best-effort. Results may be incomplete or unavailable due to LinkedIn's access restrictions."`
    - Modal stays open after result until user explicitly clicks "Close"
    - _Requirements: 7.2, 7.3, 7.5, 7.6, 7.7_

- [ ] 16. Wire `LinkedInImportModal` into `BuilderPage.jsx`
  - [ ] 16.1 Add LinkedIn Import button to the topbar, open/close state, and `handleLinkedInImport` callback
    - Add `const [showLinkedInModal, setShowLinkedInModal] = useState(false)`
    - Add `<button className="bv2-li-import-btn" onClick={() => setShowLinkedInModal(true)}>LinkedIn Import</button>` in the `bv2-topbar-left` area alongside the existing GitHub Import button
    - Write `handleLinkedInImport(extracted)` that calls `onUpdate` to merge `extracted.name`/`extracted.role` into the Hero block and append a `'LinkedIn Skills'` category to the Skills block (without overwriting existing categories)
    - Render `<LinkedInImportModal>` conditionally when `showLinkedInModal` is true, pass `onImport={handleLinkedInImport}` and `onClose={() => setShowLinkedInModal(false)}`
    - _Requirements: 7.1, 7.4_
  - [ ]* 16.2 Write property test for LinkedIn import skill merge (Property 10)
    - **Property 10: LinkedIn import preserves existing skill categories**
    - For any Skills block with K existing categories and any extracted skills list, `handleLinkedInImport` results in ≥ K categories; if skills is non-empty, exactly K+1 categories with the last labeled `"LinkedIn Skills"`
    - **Validates: Requirements 7.4**

- [ ] 17. Create `src/components/shared/OnboardingQuizModal.jsx`
  - [ ] 17.1 Implement `OnboardingQuizModal` with four persona options, confirm, and skip/dismiss
    - Props: `{ onConfirm }` — `onConfirm` receives a persona string or `null` (for dismiss)
    - Internal state: `selectedPersona: string | null`
    - Render four option buttons for `Student`, `Freelancer`, `Developer`, `Creator`
    - Include `applyPersonaDefaults(persona, emptyPortfolio)` pure function (co-located) using the persona-to-template mapping table from the design doc
    - Export `applyPersonaDefaults` for use in `App.jsx`
    - "Get started" button calls `onConfirm(selectedPersona)` — disabled if no persona selected
    - "Skip for now" link calls `onConfirm(null)`
    - _Requirements: 1.2, 1.3, 1.6_
  - [ ]* 17.2 Write property test for persona pre-fill mapping (Property 1)
    - **Property 1: Persona pre-fill matches mapping table**
    - For each persona in `{Student, Freelancer, Developer, Creator}`, `applyPersonaDefaults(persona, emptyPortfolio())` must produce exactly the `templateId` and home-page block types defined in the mapping table — no extra or missing block types
    - **Validates: Requirements 1.3**

- [ ] 18. Wire `OnboardingQuizModal` into `App.jsx`
  - [ ] 18.1 Add onboarding quiz check to `handleCreatePortfolio` and integrate the modal into the render tree
    - Add `const [showOnboardingQuiz, setShowOnboardingQuiz] = useState(false)` at the top of `App`
    - In `handleCreatePortfolio`: check `readLocal('cf-onboarding-done-${user.id}', false)` and `portfolios.length === 0`; if both true, set `showOnboardingQuiz(true)` instead of immediately calling `create()`
    - Write `handleOnboardingConfirm(persona)`: call `create()`, apply `applyPersonaDefaults` via `update(id, ...)` when persona is non-null, write `cf-onboarding-done-${user.id}` to localStorage, set `showOnboardingQuiz(false)`, navigate to builder
    - Render `<OnboardingQuizModal onConfirm={handleOnboardingConfirm} />` when `showOnboardingQuiz` is true
    - _Requirements: 1.1, 1.4, 1.5_
  - [ ]* 18.2 Write property test for onboarding flag persistence (Property 2)
    - **Property 2: Onboarding flag written for any userId**
    - For any user ID string, after `handleOnboardingConfirm` is called (with any persona or null), `readLocal('cf-onboarding-done-{userId}', false)` must return `true`
    - **Validates: Requirements 1.4**

- [ ] 19. Final checkpoint — end-to-end smoke test
  - Ensure all tests pass, ask the user if questions arise.
  - Verify: new user sees quiz on first portfolio creation; persona pre-fills correct template + blocks; quiz does not reappear on second portfolio creation; testimonials/contact-form/blog blocks add, edit, and render correctly; view counter increments on StandaloneWebsite mount; dashboard shows view count, completion bar, and copy-link; LinkedIn import shows CORS error gracefully; dark/light preview toggle scopes to canvas only; Export PDF triggers print dialog.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each `*` sub-task corresponds to a numbered Correctness Property from the design document
- Tasks 1–8 (data layer + renderers) are fully independent of tasks 13–14 (builder toolbar) and 17–18 (onboarding) and can proceed in parallel
- Task 9.3 depends on task 9.1 (`analytics.js`) being complete
- Tasks 10.1 and 11.1 depend on task 9.1
- Task 16.1 depends on task 15.1 (`LinkedInImportModal.jsx`)
- Task 18.1 depends on task 17.1 (`OnboardingQuizModal.jsx`)
- Each task touches at most 2–3 files
- The `readLocal`/`writeLocal` pattern from `usePortfolioStore.js` is the approved way to access localStorage; for analytics and contact submissions, inline `localStorage` calls are acceptable as they are outside the portfolio store scope

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1", "3.1", "4.1", "9.1"] },
    { "id": 2, "tasks": ["2.2", "4.2", "6.1", "7.1", "8.1", "9.2", "9.3", "15.1", "17.1"] },
    { "id": 3, "tasks": ["6.2", "7.2", "7.3", "8.2", "10.1", "10.2", "11.1", "13.1", "13.3", "16.1", "18.1"] },
    { "id": 4, "tasks": ["11.2", "13.2", "14.1", "15.1", "16.2", "17.2", "18.2"] }
  ]
}
```
