# Implementation Plan: Careerfolio V2 Rebuild

## Overview

This plan migrates the existing single-file MVP (`src/main.jsx`) into a full production-quality portfolio-builder SaaS. Tasks are ordered to build a complete foundation first — dependencies, data layer, routing shell — before layering on editor UI, section components, and the published portfolio renderer. Each task produces working, integrated code with no orphaned modules.

---

## Tasks

- [ ] 1. Install dependencies and configure project
  - [ ] 1.1 Install all new npm packages
    - Run `npm install react-router-dom @dnd-kit/core @dnd-kit/sortable react-contenteditable dompurify nanoid framer-motion`
    - Verify all packages resolve in `node_modules` and appear in `package.json`
    - _Requirements: 1.1, 4.1, 5.2, 5.3_

  - [ ] 1.2 Scaffold the full `src/` directory structure
    - Create all empty directories: `src/contexts/`, `src/hooks/`, `src/data/`, `src/utils/`, `src/layouts/`, `src/pages/marketing/`, `src/pages/workspace/`, `src/pages/auth/`, `src/pages/portfolio/`, `src/components/shared/`, `src/components/builder/`, `src/components/sections/`, `src/templates/`
    - Create one placeholder `index.js` in each leaf directory so Vite can resolve imports
    - _Requirements: all (structural foundation)_

- [ ] 2. Implement utility functions and data layer
  - [ ] 2.1 Implement `src/utils/slugify.js`
    - Export `slugify(input)` — lowercase, trim, replace non-`[a-z0-9]` runs with `-`, strip leading/trailing hyphens
    - _Requirements: 9.7, 15.2_

  - [ ]* 2.2 Write property test for `slugify`
    - **Property 11: Slug sanitiser output format** — for any printable string input, `slugify(input)` always returns a string matching `/^[a-z0-9-]*$/`
    - **Validates: Requirements 9.7, 15.2**
    - Use fast-check `fc.string()` arbitrary

  - [ ] 2.3 Implement `src/utils/sanitize.js`
    - Export `sanitize(html)` — thin DOMPurify wrapper; strip `<script>` tags and all event-handler attributes
    - _Requirements: 5.2, 5.3, 15.1_

  - [ ]* 2.4 Write property test for `sanitize`
    - **Property 10: DOMPurify sanitisation removes injected content** — for any HTML string, output never contains `<script>` elements or event-handler attributes
    - **Validates: Requirements 5.3, 15.1**
    - Use fast-check `fc.string()` arbitrary; assert output.includes('<script>') is false

  - [ ] 2.5 Implement `src/utils/portfolioHelpers.js`
    - Export `reorderSections(pageData, fromIndex, toIndex)` following the design pseudocode
    - Export `validatePortfolioForPublish(portfolio)` — checks name, slug pattern, pageOrder, page-data entries, empty sections; returns `{ valid, errors }`
    - Export `createPortfolioId()` — returns `'p-' + Date.now()`
    - _Requirements: 3.7, 4.1, 4.2, 4.5, 9.1, 9.2, 9.3_

  - [ ]* 2.6 Write property test for `reorderSections` — length invariant
    - **Property 1: Section order stability** — result has same length, all original IDs present, moved section at `toIndex`
    - **Validates: Requirements 4.2**
    - Use fast-check to generate random `PageData` and valid index pairs

  - [ ]* 2.7 Write property test for `reorderSections` — identity
    - **Property 2: Section reorder identity** — `reorderSections(data, i, i)` returns sections equal to original
    - **Validates: Requirements 4.5**

  - [ ]* 2.8 Write property test for `validatePortfolioForPublish`
    - **Property 14: validatePortfolioForPublish is complete** — any portfolio violating at least one precondition returns `{ valid: false }` with non-empty errors array
    - **Validates: Requirements 9.3**

  - [ ] 2.9 Implement `src/utils/cssVars.js`
    - Export `applyTemplateCSSVars(templateId, containerElement)` — sets all 9 CSS custom properties; falls back to `canvas` for unknown IDs
    - _Requirements: 7.4, 7.5_

  - [ ]* 2.10 Write property test for `applyTemplateCSSVars`
    - **Property 7: CSS variable completeness** — for any templateId (including unknown), all 9 CSS variables are always set on the container element
    - **Validates: Requirements 7.4, 7.5**
    - Mock `containerElement.style.setProperty`, assert called 9 times for all cases

- [ ] 3. Implement data definitions
  - [ ] 3.1 Implement `src/data/templates.js`
    - Export `TEMPLATES` array — 12 `TemplateDefinition` entries covering all required types
    - Each entry includes: `id`, `name`, `type`, `tone`, `tier` (`'free'`|`'pro'`), `colors` (bg, ink, card, accent, accentContrast, border), `fonts` (heading, body, mono), `defaultPageOrder`, `defaultSections`
    - Free-tier templates: `canvas`, `folio`, `mono`; all others are `'pro'`
    - Export `getTemplate(id)` helper — returns template by id or `canvas` as fallback
    - _Requirements: 7.1, 7.2, 7.6_

  - [ ]* 3.2 Write property test for `TemplateDefinition` completeness
    - **Property 15: TemplateDefinition completeness** — every template in registry has all required `colors` and `fonts` fields with no undefined values
    - **Validates: Requirements 7.2**

  - [ ] 3.3 Implement `src/data/defaultSections.js`
    - Export `createDefaultSection(type)` factory for all 9 section types: `hero`, `projects`, `skills`, `about`, `books`, `research`, `stats`, `contact`, `custom`
    - Each factory call returns a `SectionData` with a unique `id` (via nanoid), correct `type`, and sensible default values for all required fields (no `undefined`)
    - _Requirements: 6.2, 6.3, 16.3_

  - [ ]* 3.4 Write property test for `createDefaultSection`
    - **Property 9: createDefaultSection completeness** — for any valid `SectionType`, returns a `SectionData` with unique `id`, correct `type`, and no `undefined` on required fields
    - **Validates: Requirements 6.3, 16.3**
    - Use fast-check `fc.constantFrom(...sectionTypes)` arbitrary

  - [ ] 3.5 Implement `src/data/samplePortfolios.js`
    - Export `SEED_PORTFOLIO` — the Ankur Rana demo portfolio in the new `PortfolioData` schema (multi-page with Home, Work, About pages; terminal template; all existing projects mapped to `ProjectsSection`)
    - _Requirements: 3.1, 3.2_

- [ ] 4. Implement contexts and hooks
  - [ ] 4.1 Implement `src/contexts/AuthContext.jsx`
    - Provides `user`, `signup(name, email, password)`, `login(email, password)`, `logout()`
    - Persists accounts to `localStorage['careerfolio-accounts']`
    - `signup` validates non-empty fields and rejects duplicates with the required error messages
    - `login` rejects non-matching credentials with the required error message
    - Exposes `user.plan` as `'free'` or `'pro'`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8_

  - [ ] 4.2 Implement `src/hooks/useAuth.js`
    - Thin wrapper: exports `useAuth()` calling `useContext(AuthContext)` with a guard error if used outside provider
    - _Requirements: 2.3_

  - [ ] 4.3 Implement `src/contexts/PortfolioStoreContext.jsx`
    - Provides `createPortfolio(ownerId, templateId?)`, `getPortfolio(id)`, `getAllPortfolios(ownerId)`, `patchPortfolio(id, delta)`, `publishPortfolio(id)`, `deletePortfolio(id)`
    - `createPortfolio` seeds pages from `template.defaultSections` and `defaultPageOrder`; defaults to `canvas`
    - `patchPortfolio` deep-merges delta, sets `updatedAt`, debounces localStorage write at 600 ms
    - `patchPortfolio({})` (empty delta) must not change any content field
    - `publishPortfolio` calls `validatePortfolioForPublish`, sets `published: true`, returns `{slug, url}`; throws `PublishValidationError` on failure; throws `SlugConflictError` on slug collision
    - Reads/writes JSON to localStorage; catches `JSON.parse` errors and returns fallback
    - Atomically keeps `pageOrder` in sync with `pages` on add/remove page operations
    - _Requirements: 3.1–3.9, 9.1–9.6, 11.1, 11.2, 13.1_

  - [ ]* 4.4 Write property test for `patchPortfolio` empty-delta identity
    - **Property 12: Empty-delta patch is identity** — `patchPortfolio(id, {})` leaves all content fields unchanged
    - **Validates: Requirements 3.6**

  - [ ]* 4.5 Write property test for page consistency invariant
    - **Property 5: Page consistency invariant** — after any sequence of add/remove page operations, `pageOrder` contains exactly the keys present in `pages`
    - **Validates: Requirements 3.5, 8.3, 8.4**

  - [ ]* 4.6 Write property test for `PortfolioData` serialisation round-trip
    - **Property 8: PortfolioData serialisation round-trip** — serialise to JSON then deserialise produces an object equal to the original
    - **Validates: Requirements 3.1, 16.2**

  - [ ]* 4.7 Write property test for `publishPortfolio` precondition enforcement
    - **Property 4: Publish precondition enforcement** — `publishPortfolio` sets `published: true` if and only if `validatePortfolioForPublish` returns `{ valid: true }`
    - **Validates: Requirements 9.1, 9.2**

  - [ ] 4.8 Implement `src/hooks/usePortfolioStore.js`
    - Thin wrapper over `PortfolioStoreContext`
    - _Requirements: 3.1_

  - [ ] 4.9 Implement `src/contexts/EditorContext.jsx`
    - Provides `activeSectionId`, `setActiveSection(id)`, `dragState`, `setDragState(state)`, `clearDragState()`, `reorderSections(portfolioId, pageSlug, fromIndex, toIndex)`, `updateField(sectionId, field, value)`, `undo()`
    - Maintains an undo stack (max 50 entries) for field changes
    - `reorderSections` delegates to `PortfolioStoreContext.patchPortfolio`
    - _Requirements: 4.1, 4.3, 4.4, 5.1, 11.3_

  - [ ] 4.10 Implement `src/hooks/useEditor.js`
    - Thin wrapper over `EditorContext`
    - _Requirements: 5.1_

  - [ ] 4.11 Implement `src/hooks/useDebounce.js`
    - Export `useDebounce(value, delay)` hook using `setTimeout`/`clearTimeout`
    - _Requirements: 11.1_

- [ ] 5. Checkpoint — Data layer complete
  - Ensure all utility, data, context, and hook files are importable with no runtime errors. Run a quick sanity check: `import { slugify } from './utils/slugify'` and `import { createDefaultSection } from './data/defaultSections'` resolve correctly.

- [ ] 6. Set up routing shell and layouts
  - [ ] 6.1 Implement `src/layouts/MarketingLayout.jsx`
    - Renders shared `<Header>` and `<SiteFooter>` with an `<Outlet>` in between
    - _Requirements: 1.1, 1.2_

  - [ ] 6.2 Implement `src/layouts/WorkspaceLayout.jsx`
    - Renders workspace topbar with brand + nav actions and an `<Outlet>`
    - Guards against unauthenticated access — redirects to `/login` if no user in `AuthContext`
    - _Requirements: 1.3, 2.5_

  - [ ] 6.3 Implement `src/layouts/PortfolioLayout.jsx`
    - Receives `PortfolioData` and `mode` (`'preview'` | `'published'`)
    - Renders `<PortfolioNav>` from `portfolio.pageOrder`
    - Calls `applyTemplateCSSVars(portfolio.templateId, containerRef.current)` on mount and on template change
    - Provides nested `<Routes>` mapping each page slug to a `<PortfolioPage>` — `home` maps to `'/'`, others to `'/<pageSlug>'`; wildcard redirects to `'/'`
    - _Requirements: 7.4, 8.5, 8.6, 8.7_

  - [ ] 6.4 Rewrite `src/main.jsx` as the app entry point
    - Mount `<BrowserRouter>` wrapping `<AuthContext.Provider>` wrapping `<PortfolioStoreContext.Provider>`
    - Define top-level `<Routes>` matching requirements: marketing routes under `MarketingLayout`, `/login` + `/signup` standalone, `/dashboard` + `/builder/:portfolioId` under `WorkspaceLayout`, `/:slug/*` as portfolio viewer
    - Unrecognised routes redirect to `/`
    - Remove all old single-page state-machine logic from `main.jsx`
    - _Requirements: 1.1–1.6_

- [ ] 7. Implement shared UI components
  - [ ] 7.1 Implement `src/components/shared/Header.jsx`
    - Marketing variant: brand + site nav links + CTA buttons
    - Workspace variant: brand + dashboard link + logout + new portfolio button
    - Uses React Router `<Link>` / `useNavigate` instead of state callbacks
    - _Requirements: 1.2, 1.3_

  - [ ] 7.2 Implement `src/components/shared/SiteFooter.jsx`
    - Extracts existing footer markup; uses React Router `<Link>` for all navigation
    - _Requirements: 1.2_

  - [ ] 7.3 Implement `src/components/shared/UpgradeModal.jsx`
    - Extracts existing upgrade modal; on "Choose Pro" click updates `user.plan` to `'pro'` via `AuthContext`
    - _Requirements: 14.2, 14.3_

  - [ ] 7.4 Implement `src/components/shared/Button.jsx` and `src/components/shared/Icon.jsx`
    - Generic reusable button with `variant` prop (`'dark'` | `'lime'` | `'outline'` | `'text'`)
    - Icon wrapper component
    - _Requirements: (shared UI)_

- [ ] 8. Implement marketing pages
  - [ ] 8.1 Implement `src/pages/marketing/HomePage.jsx`
    - Extract `<Home>` component from `main.jsx` into this file; replace all state callbacks with React Router `<Link>` / `useNavigate`
    - _Requirements: 1.2_

  - [ ] 8.2 Implement remaining marketing pages
    - Create `TemplatesPage.jsx`, `FeaturesPage.jsx`, `PricingPage.jsx`, `ResourcesPage.jsx`, `HelpPage.jsx`, `AboutPage.jsx`, `ContactPage.jsx`, `PrivacyPage.jsx`, `TermsPage.jsx`
    - Extract content from existing `<MarketingPage>` switch in `main.jsx`
    - _Requirements: 1.2_

  - [ ] 8.3 Implement `src/pages/auth/LoginPage.jsx` and `src/pages/auth/SignupPage.jsx`
    - Extract `<AuthScreen>` into two separate page components
    - On successful auth, navigate to `/dashboard`
    - Display field-level errors from `AuthContext`
    - _Requirements: 2.1–2.8_

- [ ] 9. Implement Dashboard page
  - [ ] 9.1 Implement `src/pages/workspace/DashboardPage.jsx`
    - Shows published portfolio count, total project count, templates unlocked
    - Pro analytics strip (views, link shares, contact clicks) — shown only when `user.plan === 'pro'`
    - "Create a new portfolio" button calls `createPortfolio(user.id)` then navigates to `/builder/:id`
    - Portfolio cards navigate to `/builder/:id` on click
    - Free-tier gate: if user already has ≥1 portfolio and plan is `free`, show `UpgradeModal`
    - _Requirements: 12.1–12.5, 14.1_

- [ ] 10. Implement section components
  - [ ] 10.1 Implement `src/components/sections/SectionRenderer.jsx`
    - Dispatches on `section.type` to the correct section component
    - Passes `mode`, `isActive`, and `onFieldChange` down
    - In `'editor'` mode wraps section with click-to-edit overlay and drag handle; in `'preview'`/`'published'` renders static HTML
    - Calls `resolveEditableFields(section.type, templateId)` to determine which fields are editable
    - _Requirements: 5.1, 5.2, 5.5, 5.6_

  - [ ]* 10.2 Write property test for `resolveEditableFields`
    - **Property 13: resolveEditableFields never returns null** — for any `(sectionType, templateId)` pair, returns a non-null array
    - **Validates: Requirements 5.6**

  - [ ] 10.3 Implement `src/components/sections/HeroSection.jsx`
    - Fields: `headline`, `subheadline`, `avatarUrl`, `location`, `tags`, `ctaLabel`, `ctaTarget`, `showStats`, `stats`
    - Editor mode: `headline` and `subheadline` use `<ContentEditable>` with `sanitize()` in `onChange`; empty string stored as `''` not `null`
    - _Requirements: 5.2, 5.3, 5.4, 6.1_

  - [ ] 10.4 Implement `src/components/sections/ProjectsSection.jsx`
    - Fields: `heading`, project list with `title`, `description`, `tag`, `imageUrl`, `liveDemoUrl`, `githubUrl`, `featured`
    - Editor mode: text fields use `<ContentEditable>` with sanitisation
    - _Requirements: 5.2, 5.3, 5.4_

  - [ ] 10.5 Implement `src/components/sections/SkillsSection.jsx`
    - Fields: `heading`, `skills` tag list
    - Editor mode: inline add/remove skill tags
    - _Requirements: 5.2, 5.3_

  - [ ] 10.6 Implement `src/components/sections/AboutSection.jsx`
    - Fields: `heading`, `body` (rich text)
    - Editor mode: `<ContentEditable>` on body with sanitisation
    - _Requirements: 5.2, 5.3, 5.4_

  - [ ] 10.7 Implement `src/components/sections/BooksSection.jsx`
    - Fields: `heading`, books array (`id`, `title`, `subtitle`, `coverUrl`, `description`, `purchaseUrl`, `year`)
    - Serialisation: all fields preserved on round-trip (no undefined)
    - _Requirements: 5.2, 16.4_

  - [ ] 10.8 Implement `src/components/sections/ResearchSection.jsx`
    - Fields: `heading`, papers array (`id`, `title`, `abstract`, `publishedAt`, `doiUrl`, `pdfUrl`, `tags`)
    - Serialisation: all fields preserved on round-trip (no undefined)
    - _Requirements: 5.2, 16.5_

  - [ ] 10.9 Implement `src/components/sections/StatsSection.jsx`
    - Fields: `heading`, stats array (`value`, `label`)
    - _Requirements: 5.2_

  - [ ] 10.10 Implement `src/components/sections/ContactSection.jsx`
    - Fields: `heading`, `email`, `linkedin`, `github`, `twitter`, `website`
    - Editor mode: inline editable fields
    - _Requirements: 5.2, 5.4_

  - [ ] 10.11 Implement `src/components/sections/CustomSection.jsx`
    - Fields: `heading`, `body` (free HTML)
    - Editor mode: `<ContentEditable>` on body with full sanitisation
    - _Requirements: 5.2, 5.3_

- [ ] 11. Implement visual editor (DnD + click-to-edit)
  - [ ] 11.1 Implement `src/components/builder/DragDropEngine.jsx`
    - Wraps `@dnd-kit/core` `<DndContext>` and `@dnd-kit/sortable` `<SortableContext>`
    - `onDragEnd`: if valid `targetIndex` → calls `EditorContext.reorderSections`; if invalid (drop outside zone) → calls `EditorContext.clearDragState()`, section reverts with CSS animation
    - Renders drag ghost via `DragOverlay`
    - _Requirements: 4.1, 4.3, 4.4, 13.4_

  - [ ] 11.2 Implement `src/components/builder/EditorCanvas.jsx`
    - Renders sections for `activePage` via `<SectionRenderer mode="editor">`
    - Wraps with `<DragDropEngine>` providing drag handles per section
    - Shows `+` add-section affordance between sections (calls `onAddSection`)
    - Highlights hovered section with `[Edit]` affordance
    - When page has >20 sections, applies windowing (placeholder comment for `react-virtual` integration)
    - _Requirements: 4.4, 5.1, 6.4, 6.6_

  - [ ]* 11.3 Write property test for inline edit non-destructiveness
    - **Property 6: Inline edit non-destructiveness** — any ContentEditable onChange event (including empty string) results in a stored field value that is a string, never null or undefined
    - **Validates: Requirements 5.4**

  - [ ] 11.4 Implement `src/components/builder/PreviewPane.jsx`
    - Renders `<PortfolioLayout mode="preview">` scaled via `transform: scale()` in a `will-change: transform` wrapper
    - Page-tab strip to switch preview page
    - "Open full preview" button navigates to `/:slug/preview` in new tab
    - Reactively re-renders on `PortfolioData` change
    - _Requirements: 10.1–10.5_

- [ ] 12. Implement builder sidebar panels
  - [ ] 12.1 Implement `src/components/builder/SectionPalette.jsx`
    - Lists all 9 section types with icons and labels
    - Greys out singleton types already present on current page
    - `onAddSection(type)` calls `createDefaultSection(type)` and appends to `portfolio.pages[activePage].sections` via `patchPortfolio`
    - _Requirements: 6.1, 6.2, 6.4_

  - [ ] 12.2 Implement `src/components/builder/TemplatePickerPanel.jsx`
    - Renders template grid with `tier` badges
    - Free users see "Pro ✦" lock on non-free templates; clicking shows `<UpgradeModal>`
    - Selecting a free template calls `patchPortfolio(id, { templateId })` without mutating any section data
    - _Requirements: 7.3, 7.6, 7.7, 14.1_

  - [ ] 12.3 Implement `src/components/builder/SectionSettingsPanel.jsx`
    - Shows settings for the currently active section
    - Toggle `section.hidden`, rename section heading
    - _Requirements: 5.1_

  - [ ] 12.4 Implement `src/components/builder/PublishPanel.jsx`
    - Slug input field with live `slugify()` preview
    - "Publish" button calls `publishPortfolio(portfolioId)`
    - On `PublishValidationError`: shows field-level errors
    - On `SlugConflictError`: highlights slug field with "This URL is already taken — try a different one."
    - On success: displays share link `careerfolio.site/:slug`
    - _Requirements: 9.1–9.7, 13.3_

  - [ ] 12.5 Implement `src/components/builder/BuilderSidebar.jsx`
    - Tabbed sidebar containing `SectionPalette`, `SectionSettingsPanel`, `TemplatePickerPanel`, `PublishPanel`
    - _Requirements: (builder layout)_

- [ ] 13. Implement BuilderPage
  - [ ] 13.1 Implement `src/pages/workspace/BuilderPage.jsx`
    - Reads `portfolioId` from `useParams()`
    - Fetches `PortfolioData` from `PortfolioStore` on mount; redirects to `/dashboard` if portfolio not found
    - Provides `<EditorContext.Provider>` wrapping the three-panel grid: `BuilderSidebar` | `EditorCanvas` | `PreviewPane`
    - Manages `activePage` state (default: first page in `pageOrder`)
    - Registers `Cmd/Ctrl+Z` keyboard shortcut to call `EditorContext.undo()`
    - Debounced auto-save: on every `PortfolioData` change, queues `patchPortfolio` at 600 ms
    - _Requirements: 5.1, 11.1–11.3_

- [ ] 14. Checkpoint — Builder complete
  - Ensure the builder loads for a portfolio ID, renders section list, DnD reorder works, template switch updates preview, publish panel validates correctly. All tests pass.

- [ ] 15. Implement published portfolio renderer
  - [ ] 15.1 Implement `src/pages/portfolio/PortfolioViewerPage.jsx`
    - Reads `:slug` from `useParams()`
    - Calls `getAllPortfolios` to find a published portfolio with matching slug
    - If not found: renders "Portfolio not found" message with link to `/`
    - Passes `PortfolioData` to `<PortfolioLayout mode="published">`
    - _Requirements: 8.1, 13.5_

  - [ ] 15.2 Implement `src/pages/portfolio/PortfolioPage.jsx`
    - Receives `portfolio` and `pageSlug` props
    - Renders all sections in `portfolio.pages[pageSlug].sections` via `<SectionRenderer mode="published">`
    - _Requirements: 8.6_

  - [ ] 15.3 Wire `PortfolioLayout.jsx` nested routes for the portfolio viewer
    - Confirm `/:slug/` → home page, `/:slug/work` → work page, `/:slug/*` → redirect to `/:slug/`
    - _Requirements: 8.5, 8.6, 8.7_

- [ ] 16. Implement template CSS
  - [ ] 16.1 Create `src/templates/noir/noir.css`
    - Section-specific style overrides for the `noir` template (dark editorial; lime accent)
    - Lazy import triggered when `templateId === 'noir'`
    - _Requirements: 7.1, 7.2_

  - [ ] 16.2 Create `src/templates/terminal/terminal.css`
    - Section-specific style overrides for the `terminal` template (code-forward; green accent)
    - _Requirements: 7.1, 7.2_

  - [ ] 16.3 Create CSS files for remaining 10 templates
    - One CSS file per template in its own folder: `lavender`, `signal`, `canvas`, `copper`, `grid`, `orbit`, `folio`, `frame`, `paper`, `mono`
    - _Requirements: 7.1, 7.2_

  - [ ] 16.4 Wire lazy template CSS imports in `SectionRenderer.jsx`
    - Use dynamic `import()` to load `templates/<id>/<id>.css` when the template is first rendered
    - _Requirements: 7.4_

- [ ] 17. Wire everything together and final integration
  - [ ] 17.1 Connect `SEED_PORTFOLIO` to the app
    - Ensure the Ankur Rana demo is available at `/ankur-rana` when the portfolio is in the store
    - Verify `PortfolioViewerPage` resolves it correctly
    - _Requirements: 3.1, 8.6_

  - [ ] 17.2 Connect upgrade modal across the app
    - Free-tier template lock in `TemplatePickerPanel` opens `UpgradeModal`
    - Free-tier second portfolio creation in `DashboardPage` opens `UpgradeModal`
    - "Choose Pro" in modal updates `user.plan` to `'pro'` in localStorage
    - _Requirements: 14.1–14.5_

  - [ ] 17.3 Add error boundary and toast notification system
    - Wrap the app in a top-level React `ErrorBoundary` component
    - Add a simple toast notification component for localStorage parse errors and other resilience events
    - _Requirements: 13.1, 13.2_

  - [ ]* 17.4 Write integration test for template switch property
    - **Property 3: Template isolation** — switching `templateId` via `patchPortfolio` never mutates any section `id`, `type`, or content field
    - **Validates: Requirements 7.3**

- [ ] 18. Final checkpoint — Full integration
  - Ensure all routes resolve correctly, auth flow works end-to-end, builder creates and publishes a portfolio, and the published URL renders the multi-page site. All property and unit tests pass.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP build
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests use **fast-check** as specified in the design document
- The existing `styles.css` global token system is preserved; templates add scoped overrides via separate CSS files
- The migration strategy preserves all existing visual content and design language from the MVP

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.3", "2.5", "2.9"] },
    { "id": 2, "tasks": ["2.2", "2.4", "2.6", "2.7", "2.8", "2.10", "3.1", "3.3", "3.5"] },
    { "id": 3, "tasks": ["3.2", "3.4", "4.1", "4.3", "4.9", "4.11"] },
    { "id": 4, "tasks": ["4.2", "4.4", "4.5", "4.6", "4.7", "4.8", "4.10"] },
    { "id": 5, "tasks": ["6.1", "6.2", "6.3", "6.4"] },
    { "id": 6, "tasks": ["7.1", "7.2", "7.3", "7.4"] },
    { "id": 7, "tasks": ["8.1", "8.2", "8.3", "9.1"] },
    { "id": 8, "tasks": ["10.1"] },
    { "id": 9, "tasks": ["10.2", "10.3", "10.4", "10.5", "10.6", "10.7", "10.8", "10.9", "10.10", "10.11"] },
    { "id": 10, "tasks": ["11.1", "11.2", "11.4"] },
    { "id": 11, "tasks": ["11.3", "12.1", "12.2", "12.3", "12.4"] },
    { "id": 12, "tasks": ["12.5", "13.1"] },
    { "id": 13, "tasks": ["15.1", "15.2", "16.1", "16.2", "16.3"] },
    { "id": 14, "tasks": ["15.3", "16.4"] },
    { "id": 15, "tasks": ["17.1", "17.2", "17.3"] },
    { "id": 16, "tasks": ["17.4"] }
  ]
}
```
