// Portfolio view count analytics — stored in localStorage
const ANALYTICS_KEY = 'cf-analytics';

/**
 * Increment the view count for a portfolio by 1.
 * Creates the entry if it doesn't exist yet.
 */
export function incrementViewCount(portfolioId) {
  try {
    const store = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}');
    store[portfolioId] = (store[portfolioId] || 0) + 1;
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(store));
  } catch {}
}

/**
 * Get the current view count for a portfolio.
 * Returns 0 if no views have been recorded.
 */
export function getViewCount(portfolioId) {
  try {
    const store = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}');
    return store[portfolioId] || 0;
  } catch {
    return 0;
  }
}
