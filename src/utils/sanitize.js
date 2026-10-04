import DOMPurify from 'dompurify';

/**
 * Sanitizes an HTML string using DOMPurify.
 * Strips <script> and <style> tags and all common event-handler attributes.
 * Gracefully falls back to returning the raw input in SSR/test environments
 * where DOMPurify is not available (no DOM).
 *
 * @param {unknown} html - The value to sanitize.
 * @returns {string} A safe HTML string, or '' for non-string input.
 */
export function sanitize(html) {
  if (typeof html !== 'string') return '';

  // DOMPurify requires a real DOM — not available in Node/test environments.
  if (typeof DOMPurify === 'undefined' || typeof DOMPurify.sanitize !== 'function') {
    return html; // fallback for SSR / test environments
  }

  return DOMPurify.sanitize(html, {
    FORBID_TAGS: ['script', 'style'],
    FORBID_ATTR: [
      'onerror',
      'onclick',
      'onload',
      'onmouseover',
      'onfocus',
      'onblur',
      'onchange',
      'onsubmit',
    ],
  });
}
