import { getTemplate } from '../data/templates.js';

/**
 * Applies all 9 CSS custom properties for the given template onto a container
 * element. Falls back to the `canvas` template for unknown/missing IDs.
 *
 * CSS custom properties set:
 *   Colors:  --p-bg, --p-ink, --p-card, --p-accent, --p-accent-contrast, --p-border
 *   Fonts:   --font-heading, --font-body, --font-mono
 *
 * This function is a side-effect-only utility — it mutates the element's
 * inline style via `setProperty` and returns nothing.
 *
 * @param {string} templateId - The template identifier (e.g. 'noir', 'canvas').
 * @param {HTMLElement | null | undefined} containerElement - The DOM element to
 *   apply the variables to. If null or undefined the function returns early.
 * @returns {void}
 */
export function applyTemplateCSSVars(templateId, containerElement) {
  if (containerElement == null) return;

  // getTemplate always returns a valid template (falls back to 'canvas').
  const template = getTemplate(templateId);

  const { colors, fonts } = template;

  // Colors
  containerElement.style.setProperty('--p-bg', colors.bg);
  containerElement.style.setProperty('--p-ink', colors.ink);
  containerElement.style.setProperty('--p-card', colors.card);
  containerElement.style.setProperty('--p-accent', colors.accent);
  containerElement.style.setProperty('--p-accent-contrast', colors.accentContrast);
  containerElement.style.setProperty('--p-border', colors.border);

  // Fonts
  containerElement.style.setProperty('--font-heading', fonts.heading);
  containerElement.style.setProperty('--font-body', fonts.body);
  containerElement.style.setProperty('--font-mono', fonts.mono);
}
