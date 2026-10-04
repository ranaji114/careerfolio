import { seedPortfolio } from '../data/defaultPortfolio';

/**
 * Searches localStorage across all accounts and seeds to find a portfolio by slug or id.
 */
export function findPortfolioBySlugOrId(slugOrId) {
  if (!slugOrId) return null;
  const target = String(slugOrId).trim().toLowerCase();

  // 1. Search current user & all accounts portfolios in localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('cf-portfolios') || key === 'cf-user-portfolios')) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const match = list.find((p) => {
              const pId = String(p.id || '').toLowerCase();
              const pSlug = String(p.slug || '').toLowerCase();
              return pId === target || pSlug === target;
            });
            if (match) return match;
          }
        }
      }
    }
  } catch (e) {
    console.warn('Error reading localStorage for portfolio:', e);
  }

  // 2. Check seed portfolio (e.g. ankur-rana or ankur-rana-featured)
  const seedSlug = String(seedPortfolio.slug || '').toLowerCase();
  const seedId = String(seedPortfolio.id || '').toLowerCase();
  if (target === seedSlug || target === seedId || target === 'demo' || target === 'featured') {
    return seedPortfolio;
  }

  return null;
}

/**
 * Constructs the canonical public live URL for a portfolio.
 */
export function getPublicPortfolioUrl(portfolio) {
  if (!portfolio) return window.location.origin;
  const slug = portfolio.slug || portfolio.id;
  return `${window.location.origin}/p/${slug}`;
}

/**
 * Determines current route from URL (supports both standard path /p/:slug and hash #/p/:slug)
 */
export function getInitialRoute() {
  const path = window.location.pathname;
  const hash = window.location.hash;
  const search = new URLSearchParams(window.location.search);

  // Check /p/:slug or /p/:slug/:page
  const pathMatch = path.match(/^\/p\/([^\/]+)(?:\/([^\/]+))?/);
  if (pathMatch) {
    return {
      type: 'public-portfolio',
      slugOrId: pathMatch[1],
      page: pathMatch[2] || 'home',
    };
  }

  // Check hash #/p/:slug
  const hashMatch = hash.match(/^#\/p\/([^\/]+)(?:\/([^\/]+))?/);
  if (hashMatch) {
    return {
      type: 'public-portfolio',
      slugOrId: hashMatch[1],
      page: hashMatch[2] || 'home',
    };
  }

  // Check query param ?p=:slug
  if (search.get('p')) {
    return {
      type: 'public-portfolio',
      slugOrId: search.get('p'),
      page: search.get('page') || 'home',
    };
  }

  return { type: 'app' };
}
