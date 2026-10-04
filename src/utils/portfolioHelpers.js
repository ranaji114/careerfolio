/**
 * Portfolio helper utilities.
 * Pure functions — no side effects, no external dependencies.
 */

// ---------------------------------------------------------------------------
// ID generation
// ---------------------------------------------------------------------------

/**
 * Generates a new portfolio ID using the current timestamp.
 * @returns {string} e.g. 'p-1750000000000'
 */
export function createPortfolioId() {
  return 'p-' + Date.now();
}

// ---------------------------------------------------------------------------
// Section reordering
// ---------------------------------------------------------------------------

/**
 * Moves a section from `fromIndex` to `toIndex` within a page's sections array.
 *
 * Follows the design pseudocode exactly:
 *   1. Copy the sections array.
 *   2. Remove the element at `fromIndex`.
 *   3. Adjust `toIndex` downward by 1 if it came after `fromIndex` (because
 *      the removal shifted everything left).
 *   4. Insert at the adjusted position.
 *   5. Return a new pageData object — the original is never mutated.
 *
 * If `fromIndex === toIndex`, the original `pageData` object is returned
 * unchanged (identity / fast-path).
 *
 * Preconditions (caller's responsibility):
 *   - Both indices are in bounds [0, sections.length).
 *
 * @param {import('./types').PageData} pageData
 * @param {number} fromIndex
 * @param {number} toIndex
 * @returns {import('./types').PageData}
 */
export function reorderSections(pageData, fromIndex, toIndex) {
  if (fromIndex === toIndex) return pageData;

  const sections = [...pageData.sections];

  // Remove the dragged section.
  const [movedSection] = sections.splice(fromIndex, 1);

  // Adjust target index: if the target was to the right of the source, the
  // removal shifted everything left by one, so we compensate.
  const adjustedTarget = toIndex > fromIndex ? toIndex - 1 : toIndex;

  // Insert at the adjusted position.
  sections.splice(adjustedTarget, 0, movedSection);

  return { ...pageData, sections };
}

// ---------------------------------------------------------------------------
// Publish validation
// ---------------------------------------------------------------------------

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validates a portfolio for publishing.
 * Checks all preconditions defined in the design document and returns a
 * structured result so callers can display field-level errors.
 *
 * @param {import('./types').PortfolioData} portfolio
 * @returns {{ valid: boolean, errors: Array<{ field: string, message: string }> }}
 */
export function validatePortfolioForPublish(portfolio) {
  const errors = [];

  // 1. Name must not be empty.
  if (!portfolio.name || portfolio.name.trim() === '') {
    errors.push({ field: 'name', message: 'Portfolio name is required' });
  }

  // 2. Slug must match the required pattern.
  if (!portfolio.slug || !SLUG_PATTERN.test(portfolio.slug)) {
    errors.push({ field: 'slug', message: 'Slug must be lowercase with hyphens only' });
  }

  // 3. At least one page in pageOrder.
  if (!Array.isArray(portfolio.pageOrder) || portfolio.pageOrder.length === 0) {
    errors.push({ field: 'pages', message: 'Portfolio must have at least one page' });
  } else {
    // 4. Every slug in pageOrder must have a matching entry in pages.
    for (const slug of portfolio.pageOrder) {
      if (!portfolio.pages || !portfolio.pages[slug]) {
        errors.push({
          field: 'pages',
          message: `Page "${slug}" is listed in order but has no content`,
        });
      }
    }

    // 5. Every page with content must have at least one section.
    for (const slug of portfolio.pageOrder) {
      const page = portfolio.pages && portfolio.pages[slug];
      if (page && Array.isArray(page.sections) && page.sections.length === 0) {
        errors.push({
          field: `pages.${slug}`,
          message: `Page "${page.title}" has no sections`,
        });
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

// ---------------------------------------------------------------------------
// Typed error factories
// ---------------------------------------------------------------------------

/**
 * Creates a slug-conflict error with a machine-readable `.code` property.
 * @param {string} slug - The conflicting slug.
 * @returns {Error & { code: string }}
 */
export function createSlugConflictError(slug) {
  const err = new Error('SLUG_CONFLICT:' + slug);
  err.code = 'SLUG_CONFLICT';
  return err;
}

/**
 * Creates a publish-validation error carrying the validation error list.
 * @param {Array<{ field: string, message: string }>} errors
 * @returns {Error & { code: string, errors: Array<{ field: string, message: string }> }}
 */
export function createPublishValidationError(errors) {
  const err = new Error('PUBLISH_VALIDATION_FAILED');
  err.code = 'PUBLISH_VALIDATION_FAILED';
  err.errors = errors;
  return err;
}
