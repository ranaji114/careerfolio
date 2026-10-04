# Requirements Document

## Introduction

This document covers the ten upgrade features planned for Careerfolio — a React + Vite portfolio builder that uses localStorage for persistence and manual state-based routing (no React Router). The features span onboarding, new content block types, dashboard utilities, analytics, and builder tooling. All data storage relies exclusively on the browser's `localStorage` API. The published portfolio output is rendered by `PortfolioRenderer` and must remain unaffected by builder-only features (e.g., dark/light preview mode).

---

## Glossary

- **App**: The top-level React application defined in `src/App.jsx`.
- **Builder**: The portfolio editing workspace rendered by `BuilderPage.jsx`, containing the editor panel, template picker, and live preview.
- **Dashboard**: The authenticated user workspace rendered by `DashboardPage.jsx`, listing all portfolios as cards.
- **Dashboard Card**: A single `<article>` element within the dashboard grid that represents one portfolio.
- **Portfolio**: A portfolio object stored in `localStorage` under the key `cf-portfolios-{userId}`, consisting of `id`, `slug`, `templateId`, `published`, `pages`, and `updatedAt` fields.
- **Block**: A content unit within a portfolio page's `blocks` array. Defined by `BLOCK_TYPES` in `defaultPortfolio.js`.
- **EditorPanel**: The left-side panel in the Builder that lists blocks and renders block-specific field editors (`src/editor/EditorPanel.jsx`).
- **PortfolioRenderer**: The component that renders the published or previewed portfolio output (`src/templates/PortfolioRenderer.jsx`).
- **Preview Toolbar**: The horizontal bar above the live preview canvas inside the Builder (`bv2-live-url-bar` + `bv2-preview-tabs` area in `BuilderPage.jsx`).
- **Persona**: One of four user archetypes — Student, Freelancer, Developer, or Creator — selected during onboarding.
- **Onboarding Quiz**: A one-time modal shown to a newly registered user when creating their very first portfolio.
- **Testimonials Block**: A new block type (`testimonials`) supporting a list of testimonial entries, each with author name, role, and quote text.
- **Contact Form Block**: A new block type (`contact_form`) providing a visitor-facing name/email/message form whose submissions are stored in `localStorage`.
- **Analytics Store**: A `localStorage` key (`cf-analytics`) holding a map of portfolio ID to view-count integer.
- **LinkedIn Import Modal**: A modal dialog in the Builder that accepts a LinkedIn profile URL, attempts a best-effort public-page parse, and pre-fills hero and skills block fields.
- **Completion Score**: A 0–100 integer representing how many defined profile fields in a portfolio are populated.
- **PDF Export**: Triggering the browser's native print dialog with a print-optimised stylesheet applied to the current portfolio renderer output.
- **Blog/Case Study Block**: A new block type (`blog`) supporting a title, body text, and an optional image URL.
- **Preview Dark/Light Mode**: A toggle in the Builder Preview Toolbar that applies a CSS class override to the preview canvas only. It does not affect the published portfolio output.

---

## Requirements

### Requirement 1 — Persona-Based Onboarding Quiz

**User Story:** As a first-time user creating my initial portfolio, I want to answer a short persona quiz so that my portfolio starts pre-filled with a template and blocks suited to my professional type.

#### Acceptance Criteria

1. WHEN a logged-in user creates their very first portfolio (i.e., `cf-portfolios-{userId}` contains zero portfolios prior to creation), THE App SHALL display the Onboarding Quiz modal before navigating the user to the Builder.

2. THE Onboarding Quiz SHALL present exactly four persona options: Student, Freelancer, Developer, and Creator.

3. WHEN a user selects a Persona and confirms the quiz, THE App SHALL create the portfolio pre-filled with a template ID and a default block set that matches the selected Persona, as defined in the persona-to-template mapping table below:

   | Persona   | Default Template ID | Pre-filled Blocks                                      |
   |-----------|---------------------|--------------------------------------------------------|
   | Student   | `canvas`            | Hero, About, Skills, Timeline, Contact                 |
   | Freelancer| `signal`            | Hero, Projects, Skills, Testimonials, Contact Form     |
   | Developer | `obsidian`          | Hero, Projects, Skills, Stats, Contact                 |
   | Creator   | `orbit`             | Hero, About, Blog/Case Study, Testimonials, Contact    |

4. WHEN the Onboarding Quiz is completed, THE App SHALL persist a flag (`cf-onboarding-done-{userId}`) in `localStorage` set to `true` so the quiz is never shown again for that user.

5. IF a logged-in user who already has the `cf-onboarding-done-{userId}` flag set creates an additional portfolio, THEN THE App SHALL skip the Onboarding Quiz and navigate directly to the Builder.

6. WHEN the Onboarding Quiz is visible, THE App SHALL allow the user to dismiss the quiz without selecting a persona, in which case THE App SHALL create an empty portfolio using the existing `emptyPortfolio()` defaults and mark the onboarding flag as done.

---

### Requirement 2 — Testimonials Block

**User Story:** As a portfolio owner, I want to add a Testimonials block to my portfolio so that I can display social proof from clients, colleagues, or collaborators.

#### Acceptance Criteria

1. THE EditorPanel SHALL expose `testimonials` as a selectable block type in the block-picker, alongside existing block types.

2. THE Testimonials Block data schema SHALL contain: `heading` (string), and `items` (array), where each item contains `author` (string), `role` (string), and `quote` (string).

3. WHEN a user edits a Testimonials Block in the EditorPanel, THE EditorPanel SHALL provide input fields for `heading`, and for each item: `author`, `role`, and `quote`.

4. WHEN a user edits a Testimonials Block in the EditorPanel, THE EditorPanel SHALL allow the user to add a new testimonial item and to remove any existing testimonial item.

5. WHEN the PortfolioRenderer renders a page containing a Testimonials Block, THE PortfolioRenderer SHALL display each testimonial item's `quote`, `author`, and `role` using the active template's color tokens (`ink`, `muted`, `accent`, `card`, `border`).

---

### Requirement 3 — Contact Form Block

**User Story:** As a portfolio owner, I want a contact form embedded in my portfolio so that visitors can send me a message directly from the page without leaving the site.

#### Acceptance Criteria

1. THE EditorPanel SHALL expose `contact_form` as a selectable block type in the block-picker.

2. THE Contact Form Block data schema SHALL contain: `heading` (string) and `buttonLabel` (string, default `"Send message"`).

3. WHEN the PortfolioRenderer renders a page containing a Contact Form Block, THE PortfolioRenderer SHALL display a form with three fields: name (text), email (email), and message (textarea).

4. WHEN a visitor submits the contact form with all three fields populated, THE PortfolioRenderer SHALL append a submission object containing `{ portfolioId, name, email, message, submittedAt }` to the `cf-contact-submissions` array in `localStorage`.

5. IF a visitor submits the contact form with any required field empty, THEN THE PortfolioRenderer SHALL display an inline validation message identifying the missing field and SHALL NOT write to `localStorage`.

6. WHEN a contact form submission is successfully stored, THE PortfolioRenderer SHALL display a confirmation message to the visitor and SHALL reset all three form fields to empty.

---

### Requirement 4 — Portfolio Analytics (View Counts)

**User Story:** As a portfolio owner, I want to see how many times each of my portfolios has been viewed so that I can track engagement.

#### Acceptance Criteria

1. WHEN the StandaloneWebsite component mounts for a given portfolio slug or ID, THE App SHALL increment the view count for that portfolio in the Analytics Store (`cf-analytics` in `localStorage`).

2. THE Analytics Store SHALL be a JSON object keyed by portfolio ID with integer values representing cumulative view counts.

3. THE Dashboard SHALL display the current view count for each portfolio on its Dashboard Card.

4. WHEN a portfolio has zero recorded views, THE Dashboard Card SHALL display `0 views`.

5. THE view count increment SHALL occur once per StandaloneWebsite mount, regardless of how many pages within that portfolio the visitor navigates to.

---

### Requirement 5 — Copy Link Button on Dashboard Cards

**User Story:** As a portfolio owner on my dashboard, I want a "Copy link" button on each portfolio card so that I can quickly share my portfolio URL without opening the builder.

#### Acceptance Criteria

1. THE Dashboard Card SHALL contain a "Copy link" button within its card-actions area.

2. WHEN a user clicks the "Copy link" button, THE Dashboard SHALL write the portfolio's public URL (as returned by `getPublicPortfolioUrl`) to the system clipboard using `navigator.clipboard.writeText`.

3. WHEN the clipboard write succeeds, THE Dashboard Card SHALL display a transient "Copied!" label replacing the button text for 2 seconds, then revert to "Copy link".

4. IF `navigator.clipboard` is not available in the current browser context, THEN THE Dashboard SHALL fall back to selecting the URL text via a temporary `<input>` element and `document.execCommand('copy')`.

---

### Requirement 6 — Profile Completion Percentage Bar

**User Story:** As a portfolio owner, I want to see a profile completion indicator on each dashboard card so that I know how complete my portfolio is and what I still need to fill in.

#### Acceptance Criteria

1. THE Dashboard Card SHALL display a horizontal progress bar showing the Completion Score as a percentage (0–100%) for each portfolio.

2. THE Completion Score SHALL be calculated by the Dashboard as the percentage of populated fields from the following set: Hero `name`, Hero `role`, Hero `tagline`, Hero `email`, Hero `location`, at least one Project in the home Projects block, at least one Skill category in the Skills block, and the About `body` field (8 fields total).

3. WHEN a field from the scoring set is non-empty (string with at least one non-whitespace character) or a list with at least one item, THE Dashboard SHALL count that field as complete.

4. THE Dashboard Card SHALL display the completion percentage as a numeric label alongside the progress bar (e.g., "75% complete").

5. WHEN the Completion Score reaches 100%, THE Dashboard Card SHALL display a "Profile complete ✓" label instead of the percentage numeric.

---

### Requirement 7 — LinkedIn Import Modal

**User Story:** As a portfolio owner building my portfolio, I want to paste my LinkedIn profile URL and have Careerfolio pre-fill my hero and skills blocks so that I save time entering my professional information manually.

#### Acceptance Criteria

1. THE Builder Preview Toolbar SHALL contain a "LinkedIn Import" button that opens the LinkedIn Import Modal.

2. THE LinkedIn Import Modal SHALL contain a single text input for a LinkedIn profile URL and an "Import" action button.

3. WHEN a user clicks "Import" with a non-empty URL, THE LinkedIn Import Modal SHALL perform a best-effort fetch of the public LinkedIn profile page and attempt to extract: full name, headline/role, and skills.

4. WHEN extracted data is available, THE Builder SHALL update the Hero block's `name` and `role` fields and, if skills are found, SHALL merge the extracted skills as a new category named "LinkedIn Skills" into the Skills block on the home page, without overwriting existing categories.

5. IF the fetch or parse fails for any reason (network error, CORS restriction, parse failure), THEN THE LinkedIn Import Modal SHALL display an error message stating that the import could not be completed and SHALL leave all existing block data unchanged.

6. WHEN the import completes (success or failure), THE LinkedIn Import Modal SHALL remain open with the result message visible until the user explicitly closes the modal.

7. THE LinkedIn Import Modal SHALL display a disclaimer stating that parsing is best-effort and results may be incomplete due to LinkedIn's access restrictions.

---

### Requirement 8 — Dark/Light Mode Toggle in Builder Preview

**User Story:** As a portfolio owner editing my portfolio, I want to toggle between dark and light preview modes in the builder so that I can see how my portfolio looks in both color schemes without affecting the published output.

#### Acceptance Criteria

1. THE Preview Toolbar inside the Builder SHALL contain a dark/light mode toggle control with two states: Light and Dark.

2. WHEN the toggle is set to Dark, THE Builder SHALL apply a `data-preview-theme="dark"` attribute to the preview canvas wrapper element, and SHALL NOT apply any theme attribute to any element outside the preview canvas.

3. WHEN the toggle is set to Light, THE Builder SHALL apply a `data-preview-theme="light"` attribute to the preview canvas wrapper element.

4. WHILE `data-preview-theme="dark"` is active on the preview canvas, THE PortfolioRenderer SHALL render the preview content with a dark background color (`#0a0a0a`) and light text color (`#f5f5f5`) applied via CSS scoped to `[data-preview-theme="dark"]`.

5. WHILE `data-preview-theme="light"` is active on the preview canvas, THE PortfolioRenderer SHALL render the preview content with a light background color (`#ffffff`) and dark text color (`#111111`) applied via CSS scoped to `[data-preview-theme="light"]`.

6. THE preview theme toggle state SHALL NOT be persisted to `localStorage` and SHALL reset to Light each time the Builder is opened.

7. THE published portfolio output rendered by `StandaloneWebsite` SHALL be unaffected by the preview theme toggle; THE `StandaloneWebsite` component SHALL NOT read or apply any preview theme attribute.

---

### Requirement 9 — Export Portfolio as PDF

**User Story:** As a portfolio owner, I want to export my portfolio as a PDF so that I can share a static offline copy with employers or clients.

#### Acceptance Criteria

1. THE Builder Preview Toolbar SHALL contain an "Export PDF" button.

2. WHEN a user clicks "Export PDF", THE Builder SHALL apply a CSS class `pdf-export-mode` to the preview canvas wrapper and invoke `window.print()`.

3. WHILE the `pdf-export-mode` class is present, THE App's print stylesheet SHALL hide all Builder chrome (topbar, editor panel, toolbar buttons, page navigation tabs) and SHALL render only the active portfolio page content at full width.

4. WHEN the browser print dialog is dismissed (whether the user prints or cancels), THE Builder SHALL remove the `pdf-export-mode` class from the preview canvas wrapper.

5. THE exported PDF output SHALL reflect the currently active preview page (as set by the preview page-tab selection) and the currently selected template's visual styling.

---

### Requirement 10 — Blog/Case Study Block

**User Story:** As a portfolio owner, I want to add a Blog or Case Study block to my portfolio so that I can publish long-form writing or detailed project write-ups alongside my work.

#### Acceptance Criteria

1. THE EditorPanel SHALL expose `blog` as a selectable block type in the block-picker, alongside existing block types.

2. THE Blog/Case Study Block data schema SHALL contain: `heading` (string), `entries` (array), where each entry contains `title` (string), `body` (string, supports plain text), and `imageUrl` (string, optional).

3. WHEN a user edits a Blog/Case Study Block in the EditorPanel, THE EditorPanel SHALL provide input fields for `heading`, and for each entry: `title`, `body` (textarea), and `imageUrl`.

4. WHEN a user edits a Blog/Case Study Block in the EditorPanel, THE EditorPanel SHALL allow the user to add a new entry and to remove any existing entry.

5. WHEN the PortfolioRenderer renders a page containing a Blog/Case Study Block, THE PortfolioRenderer SHALL display each entry's `title` and `body`, and WHERE an entry's `imageUrl` is a non-empty string, THE PortfolioRenderer SHALL render the image above the entry body using the provided URL.

6. WHERE an entry's `imageUrl` is empty or absent, THE PortfolioRenderer SHALL render the entry without an image placeholder.
