/**
 * Converts a string into a URL-safe slug.
 *
 * Steps:
 *  1. Convert to lowercase
 *  2. Trim leading/trailing whitespace
 *  3. Replace every run of characters outside [a-z0-9] with a single hyphen
 *  4. Strip any leading or trailing hyphens from the result
 *
 * Output always matches /^[a-z0-9-]*$/ for any printable input.
 *
 * @param {string} input
 * @returns {string}
 *
 * @example
 * slugify('Ankur Rana')           // 'ankur-rana'
 * slugify('  My Cool Portfolio!! ') // 'my-cool-portfolio'
 * slugify('')                     // ''
 * slugify('hello-world')          // 'hello-world'
 */
export function slugify(input) {
  if (typeof input !== 'string') return '';

  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
