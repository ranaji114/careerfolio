import React, { useState, useEffect } from 'react';
import PortfolioRenderer from '../templates/PortfolioRenderer';
import RecruiterHUD from '../components/shared/RecruiterHUD';
import { findPortfolioBySlugOrId } from '../utils/publicRouting';
import { BLOCK_TYPES } from '../data/defaultPortfolio';
import ResumeRenderer from '../components/resume/ResumeTemplates';
import { extractPortfolioDataForResume } from '../utils/resumeHelpers';
import { incrementViewCount } from '../utils/analytics';

export default function StandaloneWebsite({ slugOrId, initialPage = 'home' }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showRecruiterHUD, setShowRecruiterHUD] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Look up portfolio
  const portfolio = findPortfolioBySlugOrId(slugOrId);

  // Extract metadata
  const heroBlock = portfolio?.pages?.home?.blocks?.find((b) => b.type === BLOCK_TYPES.HERO);
  const name = heroBlock?.name || 'Personal Portfolio';
  const role = heroBlock?.role || 'Developer & Creator';

  // Track view count — fires once on mount
  useEffect(() => {
    if (portfolio?.id) incrementViewCount(portfolio.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Set page title
  useEffect(() => {
    if (portfolio) {
      document.title = `${name} — ${role}`;
    }
    return () => {
      document.title = 'Careerfolio — Make your work impossible to miss';
    };
  }, [name, role, portfolio]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowRecruiterHUD((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!portfolio) {
    return (
      <div className="standalone-404">
        <div className="standalone-404-card">
          <span className="brand-star">✦</span>
          <h2>Portfolio not found</h2>
          <p>The link "{slugOrId}" doesn't exist or hasn't been saved yet.</p>
          <a href="/" className="button button-lime">
            Go to Careerfolio Home →
          </a>
        </div>
      </div>
    );
  }

  const resumeData = portfolio.resume || extractPortfolioDataForResume(portfolio);

  return (
    <div className="standalone-website-root">
      {/* 100% Genuine Personal Website View */}
      <PortfolioRenderer
        portfolio={portfolio}
        page={currentPage}
        onChangePage={setCurrentPage}
        isPro={portfolio.isPro || false}
        onOpenRecruiterHUD={() => setShowRecruiterHUD(true)}
      />

      {/* Recruiter Quick-Scan HUD Modal */}
      {showRecruiterHUD && (
        <RecruiterHUD
          portfolio={portfolio}
          isPro={portfolio.isPro}
          onOpenResume={() => {
            setShowRecruiterHUD(false);
            setShowResumeModal(true);
          }}
          onClose={() => setShowRecruiterHUD(false)}
        />
      )}

      {/* Standalone Live Resume Viewer Modal */}
      {showResumeModal && (
        <div
          className="upgrade-overlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setShowResumeModal(false)}
        >
          <div className="standalone-resume-modal">
            <div className="standalone-resume-topbar">
              <div className="standalone-resume-title">
                <strong>{name}'s Verified ATS Resume</strong>
                <span>• Generated with Careerfolio</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button
                  className="button button-lime"
                  style={{ padding: '6px 14px', fontSize: 12 }}
                  onClick={() => window.print()}
                >
                  ⬇ Print / Save PDF
                </button>
                <button
                  className="auth-close"
                  onClick={() => setShowResumeModal(false)}
                  aria-label="Close"
                  style={{ position: 'static' }}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="standalone-resume-sheet-wrap">
              <div className="rb-sheet-container" style={{ margin: '0 auto', boxShadow: 'none' }}>
                <ResumeRenderer
                  data={resumeData}
                  templateId={resumeData.templateId || 'ats-classic'}
                  isPro={portfolio.isPro}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
