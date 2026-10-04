# Requirements Document

## Introduction

Careerfolio V2 is a full rebuild of the existing single-file MVP into a production-quality portfolio-builder SaaS. The system enables users to create, edit, and publish multi-page portfolio websites through a visual drag-and-drop editor. Each portfolio is a full multi-page site with pages such as Home, Work, About, and Contact. Users select from editorial-quality templates, build pages by composing sections, and publish to a public URL. The architecture is structured around four layers: the marketing shell, the authenticated workspace, the visual editor engine, and the published portfolio renderer.

---

## Glossary

- **App**: The full Careerfolio V2 React application, served by Vite.
- **Router**: The React Router v6 instance managing all URL-based navigation.
- **AuthContext**: The React context providing authenticated user state (`user`, `plan`, `login()`, `logout()`, `signup()`).
- **PortfolioStore**: The React context and persistence layer managing portfolio CRUD operations and localStorage serialisation.
- **EditorContext**: The React context managing active section state, drag-and-drop state, and the undo stack.
- **BuilderPage**: The top-level visual editor page at `/builder/:portfolioId`.
- **EditorCanvas**: The centre panel of the builder displaying editable sections in their page order.
- **PreviewPane**: The right panel of the builder showing a live scaled-down read-only preview.
- **SectionRenderer**: The universal dispatcher component that renders a section based on its `type` and active `templateId`.
- **SectionPalette**: The sidebar panel listing all available section types for addition to a page.
- **PortfolioLayout**: The published multi-page portfolio shell containing a nav bar and nested Routes.
- **PortfolioData**: The master data document for a portfolio, conforming to the defined schema.
- **PageData**: A single page within a portfolio, containing an ordered list of sections.
- **SectionData**: A discriminated union representing one content block on a page (e.g., Hero, Projects, Skills).
- **TemplateDefinition**: A record defining a template's visual skin (colours, fonts, default pages and sections).
- **SectionType**: The string discriminator for a section variant: `hero`, `projects`, `skills`, `about`, `books`, `research`, `stats`, `contact`, or `custom`.
- **Slug**: The URL-safe identifier for a portfolio, matching `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`.
- **ContentEditable**: The inline-editing component (`react-contenteditable`) used for click-to-edit text fields.
- **DragDropEngine**: The component wrapping `@dnd-kit` that manages drag-and-drop reordering of sections.
- **DOMPurify**: The HTML sanitisation library applied to all ContentEditable output before storage.
- **Publisher**: The subsystem (PublishPanel + `publishPortfolio()` function) that validates and publishes a portfolio.
- **ValidationResult**: The object returned by `validatePortfolioForPublish()`: `{ valid: boolean, errors: ValidationError[] }`.
- **Pro**: The paid tier granting access to all templates, removal of platform branding, multiple portfolios, custom-domain requests, and analytics.
- **Free**: The default tier allowing one portfolio and three starter templates.
- **nanoid**: The lightweight unique-ID library used to generate stable section and page identifiers.
- **DnD**: Abbreviation for drag-and-drop, powered by `@dnd-kit/core` and `@dnd-kit/sortable`.

---

## Requirements

### Requirement 1: React Router Multi-Page Application Shell

**User Story:** As a visitor or authenticated user, I want all navigation to happen via URL routing, so that the browser back/forward buttons work and deep links to any page are shareable.

#### Acceptance Criteria

1. THE App SHALL mount a React Router v6 `<BrowserRouter>` as the top-level routing provider wrapping all pages.
2. THE Router SHALL expose the following public marketing routes: `/`, `/templates`, `/features`, `/pricing`, `/resources`, `/help`, `/about`, `/contact`, `/privacy`, and `/terms`.
3. THE Router SHALL expose authenticated workspace routes: `/dashboard` and `/builder/:portfolioId`.
4. THE Router SHALL expose the portfolio viewer route `/:slug/*` that resolves a published portfolio by its slug.
5. WHEN a user navigates to an unrecognised route, THE Router SHALL redirect to `/` without displaying an error page.
6. THE Router SHALL expose authentication routes `/login` and `/signup`.

---

### Requirement 2: Authentication System

**User Story:** As a new visitor, I want to create an account and sign in, so that my portfolios are saved and accessible across sessions.

#### Acceptance Criteria

1. WHEN a user submits the sign-up form with a full name, email, and password of at least six characters, THE AuthContext SHALL create a new account object and persist it to localStorage under the key `careerfolio-accounts`.
2. WHEN a user submits the sign-up form with an email that already exists in `careerfolio-accounts`, THE AuthContext SHALL reject the submission and return the error message "An account with this email already exists."
3. WHEN a user submits the sign-in form with a matching email and password, THE AuthContext SHALL authenticate the session and expose the user object via context.
4. WHEN a user submits the sign-in form with an email or password that does not match any stored account, THE AuthContext SHALL reject the submission and return the error message "That email or password does not match an account."
5. WHEN an unauthenticated user navigates to `/dashboard` or `/builder/:portfolioId`, THE Router SHALL redirect to `/login`.
6. WHEN a user clicks "Log out", THE AuthContext SHALL clear the current session and redirect to `/`.
7. THE AuthContext SHALL expose `user.plan` as either `'free'` or `'pro'` on the authenticated user object.
8. IF the sign-up form is submitted with any required field empty, THEN THE AuthContext SHALL reject the submission and display "Please complete all required fields."

---

### Requirement 3: Portfolio Data Model and Store

**User Story:** As a developer, I want a well-defined data model and persistence layer for portfolios, so that all editor and viewer components work from a single source of truth.

#### Acceptance Criteria

1. THE PortfolioStore SHALL store and retrieve `PortfolioData` objects from localStorage under a consistent key.
2. WHEN `createPortfolio(ownerId, templateId)` is called, THE PortfolioStore SHALL return a complete `PortfolioData` with a unique `id`, the given `ownerId`, `published: false`, `pages` seeded from `template.defaultSections`, and `pageOrder` matching `template.defaultPageOrder`.
3. WHEN `createPortfolio` is called without a `templateId`, THE PortfolioStore SHALL default to the `canvas` template.
4. WHEN `patchPortfolio(portfolioId, delta)` is called, THE PortfolioStore SHALL deep-merge `delta` into the existing `PortfolioData`, set `updatedAt` to the current ISO 8601 timestamp, and persist to localStorage (debounced at 600 ms).
5. THE PortfolioStore SHALL guarantee that `portfolio.pageOrder` always contains exactly the set of keys present in `portfolio.pages` — adding a page inserts into both structures atomically, and removing a page removes from both.
6. WHEN `patchPortfolio` is called with an empty delta `{}`, THE PortfolioStore SHALL not change any content field on the portfolio.
7. THE `PortfolioData.slug` field SHALL match the pattern `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` before any portfolio can be published.
8. THE PortfolioStore SHALL provide `getPortfolio(portfolioId)` returning the current `PortfolioData` or `null` if not found.
9. THE PortfolioStore SHALL provide `getAllPortfolios(ownerId)` returning all portfolios belonging to the given owner.

---

### Requirement 4: Section Reordering

**User Story:** As a portfolio builder, I want to drag sections up and down within a page, so that I can arrange my content in the most compelling order.

#### Acceptance Criteria

1. WHEN a user drags a section from `fromIndex` to `toIndex` (where `fromIndex !== toIndex`) and drops it on a valid drop zone, THE EditorContext SHALL call `reorderSections(portfolioId, pageSlug, fromIndex, toIndex)`.
2. WHEN `reorderSections` is called with valid indices, THE PortfolioStore SHALL return an updated `PortfolioData` where the sections array has the same length as before, all original section IDs are present, and the moved section appears at `toIndex`.
3. WHEN a user drops a section outside any valid drop zone, THE DragDropEngine SHALL call `clearDragState()` without committing any change, and the section SHALL return to its original position.
4. WHILE a drag is in progress, THE EditorCanvas SHALL render a ghost element at the dragged section's current cursor position and highlight the nearest valid drop zone.
5. WHEN `reorderSections` is called where `fromIndex === toIndex`, THE PortfolioStore SHALL return the `PortfolioData` unchanged (identity operation).

---

### Requirement 5: Visual Editor — Click-to-Edit

**User Story:** As a portfolio builder, I want to click on any text in the editor canvas and edit it inline, so that I can update my content without switching to a separate form.

#### Acceptance Criteria

1. WHEN a user clicks a section in the `EditorCanvas`, THE EditorContext SHALL set that section as active and render `ContentEditable` fields for all editable text in the section.
2. WHEN a `ContentEditable` field value changes, THE SectionRenderer SHALL call `onFieldChange(field, sanitizedValue)` where `sanitizedValue` is the raw HTML passed through DOMPurify.
3. THE DOMPurify sanitiser SHALL strip any `<script>` tags and event-handler attributes from ContentEditable output before the value is stored in `SectionData`.
4. WHEN a `ContentEditable` field receives an empty string, THE SectionRenderer SHALL store an empty string (not `null` or `undefined`) in the corresponding `SectionData` field.
5. WHEN the user is not in editor mode, THE SectionRenderer SHALL render all section fields as static HTML without ContentEditable wrappers.
6. THE `resolveEditableFields(sectionType, templateId)` function SHALL return all base fields for a given section type, merged with any template-specific overrides, and SHALL never return `null`.

---

### Requirement 6: Section Management (Add, Remove, Reorder)

**User Story:** As a portfolio builder, I want to add, remove, and reorder sections on any page, so that I can customise the structure of my portfolio.

#### Acceptance Criteria

1. THE SectionPalette SHALL display all nine section types (`hero`, `projects`, `skills`, `about`, `books`, `research`, `stats`, `contact`, `custom`) with icons and labels.
2. WHEN a user selects a section type from the SectionPalette, THE PortfolioStore SHALL insert a new section created by `createDefaultSection(type)` at the end of the current page's sections array.
3. WHEN `createDefaultSection(type)` is called for any valid `SectionType`, THE PortfolioStore SHALL return a `SectionData` object with a unique `id` (generated by nanoid), the correct `type`, and no `undefined` values on any required field.
4. WHEN a singleton section type (e.g., `hero`) is already present on the active page, THE SectionPalette SHALL visually indicate "already added" and prevent a second instance from being inserted.
5. WHEN a user removes a section, THE PortfolioStore SHALL remove the section from the page's sections array and the section SHALL no longer appear in the EditorCanvas.
6. WHERE the active page has more than 20 sections, THE EditorCanvas SHALL use a windowing approach (via `react-virtual` or equivalent) to keep rendered DOM nodes bounded.

---

### Requirement 7: Template System

**User Story:** As a portfolio builder, I want to switch between editorial-quality templates, so that I can find a visual presentation that matches my professional identity.

#### Acceptance Criteria

1. THE App SHALL provide at least 12 `TemplateDefinition` entries in the template registry, covering types: Developer, Designer, Student, Freelancer, Creator, Consultant, Photographer, Writer, and Minimal.
2. THE TemplateDefinition SHALL specify `colors` (bg, ink, card, accent, accentContrast, border) and `fonts` (heading, body, mono) for each template.
3. WHEN the user switches `templateId` on a `PortfolioData`, THE PortfolioStore SHALL update only `templateId` without mutating any section `id`, `type`, or content fields.
4. WHEN `applyTemplateCSSVars(templateId, containerElement)` is called, THE App SHALL set all nine CSS custom properties (`--p-bg`, `--p-ink`, `--p-card`, `--p-accent`, `--p-accent-contrast`, `--p-border`, `--font-heading`, `--font-body`, `--font-mono`) on the container element.
5. WHEN `applyTemplateCSSVars` is called with an unknown `templateId`, THE App SHALL fall back to the `canvas` template and set all nine CSS variables from that template's definition.
6. THE Free tier SHALL grant access to the three free-tier templates (`canvas`, `folio`, `mono`). THE Pro tier SHALL grant access to all 12 templates.
7. WHEN a Free-tier user attempts to select a Pro-only template, THE TemplatePickerPanel SHALL display the upgrade prompt instead of applying the template.

---

### Requirement 8: Multi-Page Portfolio Structure

**User Story:** As a portfolio builder, I want my portfolio to have multiple pages (Home, Work, About, Contact, etc.), so that I can organise my content clearly and give each topic its own dedicated space.

#### Acceptance Criteria

1. THE PortfolioData SHALL support a `pages` record mapping `PageSlug` keys to `PageData` objects, and a `pageOrder` array controlling navigation order.
2. THE PortfolioData SHALL enforce that `pageOrder` contains at least one entry when the portfolio is published.
3. WHEN a page is added to a portfolio, THE PortfolioStore SHALL insert the new `PageData` into `portfolio.pages` and append the slug to `portfolio.pageOrder` atomically.
4. WHEN a page is removed from a portfolio, THE PortfolioStore SHALL delete the `PageData` from `portfolio.pages` and remove its slug from `portfolio.pageOrder` atomically.
5. THE `PortfolioLayout` SHALL render a `<PortfolioNav>` listing the pages defined in `portfolio.pageOrder`.
6. THE `PortfolioLayout` SHALL provide a nested `<Routes>` so that each page resolves at `/:slug/<pageSlug>` (with `home` mapping to `/:slug/`).
7. WHEN a visitor navigates to `/:slug/<pageSlug>` and no matching page exists, THE PortfolioLayout SHALL redirect to `/:slug/` (the home page) without showing an error.

---

### Requirement 9: Portfolio Publishing

**User Story:** As a portfolio builder, I want to validate and publish my portfolio with one click, so that it becomes publicly accessible at my personal URL.

#### Acceptance Criteria

1. WHEN `publishPortfolio(portfolioId)` is called, THE Publisher SHALL first call `validatePortfolioForPublish(portfolio)` and only set `published: true` if the result is `{ valid: true }`.
2. IF `validatePortfolioForPublish` returns `{ valid: false }`, THEN THE Publisher SHALL throw a `PublishValidationError` and leave `portfolio.published` as `false`.
3. WHEN `validatePortfolioForPublish` is called, THE Publisher SHALL return an error for each of the following violations: empty `portfolio.name`, `portfolio.slug` not matching `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, `portfolio.pageOrder` being empty, any slug in `pageOrder` missing its corresponding `PageData`, and any page having an empty `sections` array.
4. WHEN a portfolio is published with a slug already held by another published portfolio, THE Publisher SHALL throw a `SlugConflictError` and leave `portfolio.published` as `false`.
5. WHEN `publishPortfolio` succeeds, THE Publisher SHALL return `{ slug, url }` where `url` is the canonical public portfolio URL.
6. WHEN a portfolio is published, THE App SHALL display the share link to the user in the PublishPanel.
7. THE `slugify(input)` function SHALL return a string matching `/^[a-z0-9-]*$/` for any printable string input.

---

### Requirement 10: Live Preview Pane

**User Story:** As a portfolio builder, I want to see a live preview of my portfolio as I edit it, so that I can immediately judge how my changes will look to visitors.

#### Acceptance Criteria

1. THE PreviewPane SHALL render a scaled-down read-only representation of the active portfolio page using CSS `transform: scale()`.
2. WHEN any `PortfolioData` field changes, THE PreviewPane SHALL re-render to reflect the change without requiring a manual refresh.
3. THE PreviewPane SHALL display a page-tab strip allowing the user to preview pages other than the one currently being edited.
4. THE PreviewPane SHALL provide an "Open full preview" button that opens the portfolio's preview URL in a new browser tab.
5. WHILE the PreviewPane is visible, THE App SHALL render it in a separate CSS stacking context (via `will-change: transform`) to avoid layout thrashing in the main editor panel.

---

### Requirement 11: Auto-Save

**User Story:** As a portfolio builder, I want my edits to be saved automatically, so that I never lose work due to forgetting to save.

#### Acceptance Criteria

1. WHEN a `PortfolioData` field changes in the editor, THE BuilderPage SHALL queue a `patchPortfolio` call debounced at 600 ms.
2. WHEN the debounce timer fires, THE PortfolioStore SHALL persist the updated `PortfolioData` to localStorage.
3. THE BuilderPage SHALL support `Cmd/Ctrl+Z` to invoke `EditorContext.undo()`, reverting the most recent field change.

---

### Requirement 12: Dashboard

**User Story:** As an authenticated user, I want a dashboard showing all my portfolios and key stats, so that I can manage my work and understand its reach.

#### Acceptance Criteria

1. THE DashboardPage SHALL display the count of published portfolios, the total project count across all portfolios, and the number of templates unlocked for the user's plan.
2. WHEN a Pro user views the Dashboard, THE DashboardPage SHALL display an analytics strip showing portfolio view count, link share count, and contact click count.
3. THE DashboardPage SHALL provide a "Create a new portfolio" action that calls `createPortfolio` and navigates to `/builder/:portfolioId`.
4. WHEN a user clicks a portfolio card in the Dashboard, THE DashboardPage SHALL navigate to `/builder/:portfolioId` for that portfolio.
5. WHEN a Free-tier user has already created one portfolio and attempts to create another, THE App SHALL display the upgrade prompt.

---

### Requirement 13: Error Handling and Resilience

**User Story:** As a user, I want the application to handle unexpected errors gracefully, so that I never lose data and always understand what went wrong.

#### Acceptance Criteria

1. WHEN `JSON.parse` throws while reading a portfolio blob from localStorage, THE PortfolioStore SHALL catch the error, return the provided fallback value, and notify the user with a toast message that their data could not be loaded.
2. WHEN a saved portfolio references an unknown `templateId`, THE App SHALL fall back to the `canvas` template, log a console warning, and leave all section content unchanged.
3. WHEN a slug collision is detected at publish time, THE PublishPanel SHALL highlight the slug input field with the message "This URL is already taken — try a different one."
4. WHEN a section is dropped outside any valid drop zone, THE DragDropEngine SHALL revert the section to its original position with a CSS revert animation and make no state changes.
5. WHEN a visitor navigates to `/:slug` where no published portfolio matches that slug, THE App SHALL display a "Portfolio not found" message with a link back to `/`.

---

### Requirement 14: Plan and Upgrade Flow

**User Story:** As a Free-tier user, I want to understand what Pro unlocks and be able to upgrade, so that I can access advanced templates and features when my portfolio needs them.

#### Acceptance Criteria

1. THE App SHALL display a "Go Pro" prompt when a Free-tier user attempts to access a Pro-only feature (e.g., a Pro template, creating a second portfolio).
2. THE UpgradeModal SHALL show the Free plan (₹0) and the Pro plan (₹199 one-time) with their respective feature lists.
3. WHEN a user selects "Choose Pro" in the UpgradeModal, THE App SHALL update `user.plan` to `'pro'` in localStorage and close the modal.
4. THE App SHALL never allow the browser to directly write to any server-side subscription or payment record — plan elevation is only triggered by a verified payment event.
5. WHEN a Pro user views the TemplatePickerPanel, THE App SHALL display all 12 templates without any "Pro lock" badge.

---

### Requirement 15: Security

**User Story:** As a user, I want my portfolio content and account to be protected from injection attacks and unauthorised access, so that my data remains safe and my visitors are not exposed to malicious content.

#### Acceptance Criteria

1. WHEN content from a ContentEditable field is stored in `SectionData`, THE App SHALL sanitise it using DOMPurify, removing all `<script>` tags and event-handler attributes.
2. THE `slugify()` function SHALL only pass characters matching `[a-z0-9-]` through to the output, preventing path traversal and URL injection.
3. THE App SHALL validate custom domain strings against a strict hostname regex before storage and SHALL NOT interpolate domain values directly into `<script>` or `<link>` tags.
4. THE App SHALL scope all localStorage data to the current origin, introducing no cross-origin access vectors through the routing model.

---

### Requirement 16: Section Data Serialisation

**User Story:** As a developer, I want all section data to be fully serialisable and deserialisable, so that portfolios persist correctly across browser sessions and future Supabase migration.

#### Acceptance Criteria

1. THE PortfolioStore SHALL serialise `PortfolioData` to JSON before writing to localStorage and deserialise JSON back to `PortfolioData` on read.
2. FOR ALL valid `PortfolioData` objects, serialising then deserialising SHALL produce an object equal to the original (round-trip property).
3. THE `createDefaultSection(type)` factory SHALL produce a `SectionData` with no `undefined` values on any required field, ensuring every section is immediately serialisable.
4. WHEN a `BooksSection` is stored and retrieved, THE PortfolioStore SHALL preserve all `BookItem` fields: `id`, `title`, `subtitle`, `coverUrl`, `description`, `purchaseUrl`, and `year`.
5. WHEN a `ResearchSection` is stored and retrieved, THE PortfolioStore SHALL preserve all `ResearchPaper` fields: `id`, `title`, `abstract`, `publishedAt`, `doiUrl`, `pdfUrl`, and `tags`.
