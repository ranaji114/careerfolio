import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { getTemplate } from '../data/templates.js';
import { createDefaultSection, SECTION_TYPES } from '../data/defaultSections.js';
import { SEED_PORTFOLIO } from '../data/samplePortfolios.js';
import {
  createPortfolioId,
  validatePortfolioForPublish,
  createPublishValidationError,
  createSlugConflictError,
} from '../utils/portfolioHelpers.js';

const STORAGE_KEY = 'careerfolio-portfolios';

function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function writeLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota exceeded etc. */ }
}

// Deep merge two objects (non-recursive for arrays — arrays are replaced not merged)
function deepMerge(base, delta) {
  if (delta === null || typeof delta !== 'object' || Array.isArray(delta)) return delta;
  const result = { ...base };
  for (const key of Object.keys(delta)) {
    if (
      delta[key] !== null &&
      typeof delta[key] === 'object' &&
      !Array.isArray(delta[key]) &&
      typeof result[key] === 'object' &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], delta[key]);
    } else {
      result[key] = delta[key];
    }
  }
  return result;
}

export const PortfolioStoreContext = createContext(null);

export function PortfolioStoreProvider({ children }) {
  const [portfolios, setPortfolios] = useState(() => {
    const stored = readLocal(STORAGE_KEY, []);
    // Ensure seed portfolio is always present
    const hasSeed = stored.some(p => p.id === SEED_PORTFOLIO.id);
    return hasSeed ? stored : [SEED_PORTFOLIO, ...stored];
  });

  const saveTimer = useRef(null);

  const scheduleLocalSave = useCallback((updated) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      writeLocal(STORAGE_KEY, updated);
    }, 600);
  }, []);

  function updatePortfolios(updater) {
    setPortfolios(prev => {
      const next = updater(prev);
      scheduleLocalSave(next);
      return next;
    });
  }

  // --- CRUD ---

  function createPortfolio(ownerId, templateId = 'canvas') {
    const template = getTemplate(templateId);
    const id = createPortfolioId();

    // Build pages from template defaults
    const pages = {};
    for (const pageSlug of template.defaultPageOrder) {
      const sectionTypes = template.defaultSections[pageSlug] ?? [];
      pages[pageSlug] = {
        slug: pageSlug,
        title: pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1),
        sections: sectionTypes.map(type => createDefaultSection(type)),
      };
    }

    const portfolio = {
      id,
      ownerId,
      slug: '',
      templateId: template.id,
      name: '',
      role: 'Aspiring professional creating meaningful work.',
      published: false,
      customDomain: null,
      pageOrder: [...template.defaultPageOrder],
      pages,
      meta: {
        email: '',
        location: '',
        linkedin: '',
        github: '',
        twitter: '',
        website: '',
        seoTitle: '',
        seoDescription: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updatePortfolios(prev => [...prev, portfolio]);
    return portfolio;
  }

  function getPortfolio(id) {
    return portfolios.find(p => p.id === id) ?? null;
  }

  function getAllPortfolios(ownerId) {
    return portfolios.filter(p => p.ownerId === ownerId);
  }

  function patchPortfolio(id, delta) {
    let updated = null;
    updatePortfolios(prev => prev.map(p => {
      if (p.id !== id) return p;
      // If delta is empty object, return unchanged
      if (Object.keys(delta).length === 0) {
        updated = p;
        return p;
      }
      updated = deepMerge(p, { ...delta, updatedAt: new Date().toISOString() });
      return updated;
    }));
    return updated;
  }

  function addPage(portfolioId, pageSlug, title) {
    updatePortfolios(prev => prev.map(p => {
      if (p.id !== portfolioId) return p;
      if (p.pages[pageSlug]) return p; // already exists
      const newPage = { slug: pageSlug, title, sections: [] };
      return {
        ...p,
        pages: { ...p.pages, [pageSlug]: newPage },
        pageOrder: [...p.pageOrder, pageSlug],
        updatedAt: new Date().toISOString(),
      };
    }));
  }

  function removePage(portfolioId, pageSlug) {
    updatePortfolios(prev => prev.map(p => {
      if (p.id !== portfolioId) return p;
      const { [pageSlug]: _, ...remainingPages } = p.pages;
      return {
        ...p,
        pages: remainingPages,
        pageOrder: p.pageOrder.filter(s => s !== pageSlug),
        updatedAt: new Date().toISOString(),
      };
    }));
  }

  function publishPortfolio(id) {
    const portfolio = portfolios.find(p => p.id === id);
    if (!portfolio) throw new Error('Portfolio not found: ' + id);

    const validation = validatePortfolioForPublish(portfolio);
    if (!validation.valid) {
      throw createPublishValidationError(validation.errors);
    }

    // Check slug collision
    const slugTaken = portfolios.some(p => p.id !== id && p.published && p.slug === portfolio.slug);
    if (slugTaken) throw createSlugConflictError(portfolio.slug);

    let publishedSlug = '';
    updatePortfolios(prev => prev.map(p => {
      if (p.id !== id) return p;
      publishedSlug = p.slug;
      return { ...p, published: true, updatedAt: new Date().toISOString() };
    }));

    return { slug: publishedSlug, url: `/${publishedSlug}` };
  }

  function deletePortfolio(id) {
    updatePortfolios(prev => prev.filter(p => p.id !== id));
  }

  return (
    <PortfolioStoreContext.Provider value={{
      portfolios,
      createPortfolio,
      getPortfolio,
      getAllPortfolios,
      patchPortfolio,
      addPage,
      removePage,
      publishPortfolio,
      deletePortfolio,
    }}>
      {children}
    </PortfolioStoreContext.Provider>
  );
}

export function usePortfolioStore() {
  const ctx = useContext(PortfolioStoreContext);
  if (!ctx) throw new Error('usePortfolioStore must be used within a PortfolioStoreProvider');
  return ctx;
}
