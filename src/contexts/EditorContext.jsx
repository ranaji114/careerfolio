import React, { createContext, useContext, useState, useCallback } from 'react';

export const EditorContext = createContext(null);

const MAX_UNDO_STACK = 50;

export function EditorProvider({ children, portfolioId, portfolio, patchPortfolio }) {
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [dragState, setDragState] = useState({ dragging: null, ghost: null, dropTarget: null });
  const [undoStack, setUndoStack] = useState([]);

  function setActiveSection(id) {
    setActiveSectionId(id);
  }

  function clearDragState() {
    setDragState({ dragging: null, ghost: null, dropTarget: null });
  }

  // reorderSections: delegates to PortfolioStoreContext via patchPortfolio
  function reorderSections(pageSlug, fromIndex, toIndex) {
    if (!portfolio || fromIndex === toIndex) return;
    const page = portfolio.pages[pageSlug];
    if (!page) return;

    const sections = [...page.sections];
    const [moved] = sections.splice(fromIndex, 1);
    const adjustedTarget = toIndex > fromIndex ? toIndex - 1 : toIndex;
    sections.splice(adjustedTarget, 0, moved);

    patchPortfolio(portfolioId, {
      pages: {
        ...portfolio.pages,
        [pageSlug]: { ...page, sections },
      },
    });
  }

  // updateField: updates a field on the active section (or any section by id)
  function updateField(sectionId, pageSlug, field, value) {
    if (!portfolio) return;
    const page = portfolio.pages[pageSlug];
    if (!page) return;

    // Save to undo stack before mutation
    setUndoStack(prev => {
      const snapshot = { sectionId, pageSlug, field, value: getSectionField(page.sections, sectionId, field) };
      return [...prev.slice(-(MAX_UNDO_STACK - 1)), snapshot];
    });

    const sections = page.sections.map(s => {
      if (s.id !== sectionId) return s;
      return { ...s, [field]: value };
    });

    patchPortfolio(portfolioId, {
      pages: {
        ...portfolio.pages,
        [pageSlug]: { ...page, sections },
      },
    });
  }

  function getSectionField(sections, sectionId, field) {
    const section = sections.find(s => s.id === sectionId);
    return section ? section[field] : undefined;
  }

  function undo() {
    if (undoStack.length === 0 || !portfolio) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    const page = portfolio.pages[last.pageSlug];
    if (!page) return;

    const sections = page.sections.map(s => {
      if (s.id !== last.sectionId) return s;
      return { ...s, [last.field]: last.value };
    });

    patchPortfolio(portfolioId, {
      pages: {
        ...portfolio.pages,
        [last.pageSlug]: { ...page, sections },
      },
    });
  }

  return (
    <EditorContext.Provider value={{
      activeSectionId,
      setActiveSection,
      dragState,
      setDragState,
      clearDragState,
      reorderSections,
      updateField,
      undo,
    }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within an EditorProvider');
  return ctx;
}
