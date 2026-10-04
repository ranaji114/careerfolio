import React from 'react';

export default function PrivacyPolicyPage({ onBack }) {
  return (
    <div className="policy-page-root" style={{ minHeight: '100vh', background: '#0a0f0d', color: '#e8f5ee', padding: '60px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Top Back Nav */}
        <button
          onClick={onBack}
          style={{
            background: '#111a16',
            color: '#46f6a5',
            border: '1px solid #1e2e26',
            padding: '8px 16px',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            marginBottom: 32,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          ← Back to Careerfolio
        </button>

        <header style={{ borderBottom: '1px solid #1e2e26', paddingBottom: 24, marginBottom: 36 }}>
          <span style={{ color: '#46f6a5', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            LEGAL & COMPLIANCE
          </span>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 900, margin: '8px 0 12px', color: '#ffffff' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#6b8f7a', fontSize: 14, margin: 0 }}>
            Effective Date: October 2026 · Built on Local Storage-First Architecture
          </p>
        </header>

        <div style={{ lineHeight: 1.8, fontSize: 15, color: '#c2d6cb', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <section style={{ background: '#111a16', border: '1px solid #1e2e26', borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: '#46f6a5', fontSize: 18, margin: '0 0 12px' }}>
              ✦ Summary: We Respect Your Absolute Data Sovereignty
            </h2>
            <p style={{ margin: 0 }}>
              Careerfolio is engineered on a <strong>Local-First philosophy</strong>. Your portfolios, resume drafts, uploaded images, and project details are stored primarily in your browser's secure <code>localStorage</code>. We do not sell your personal information, train public models on your private data, or inject third-party ad tracking scripts.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#ffffff', fontSize: 20, marginBottom: 12 }}>1. Information We Collect</h2>
            <p>We collect minimal information necessary to deliver our developer portfolio and resume builder services:</p>
            <ul style={{ paddingLeft: 20, margin: '10px 0' }}>
              <li><strong>Account Credentials:</strong> If you register an account, we store your name, email address, and hashed authentication token.</li>
              <li><strong>Portfolio Content:</strong> The text, headline, project case studies, GitHub links, and profile photos you provide to showcase your work.</li>
              <li><strong>Local Analytics:</strong> Aggregate page view counters stored locally to show you how many times your portfolio was visited.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#ffffff', fontSize: 20, marginBottom: 12 }}>2. How We Use Your Data</h2>
            <p>Your data is used solely to:</p>
            <ul style={{ paddingLeft: 20, margin: '10px 0' }}>
              <li>Render your personalized, high-performance web portfolio across desktop and mobile devices.</li>
              <li>Format and generate ATS-compliant single-page PDF resumes.</li>
              <li>Enable Pro features such as AI-assisted bio writing and specialized layouts if you choose to activate them.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#ffffff', fontSize: 20, marginBottom: 12 }}>3. Third-Party Integrations & AI Processing</h2>
            <p>
              When you use our Pro AI Assistant or import public information from GitHub/LinkedIn:
            </p>
            <ul style={{ paddingLeft: 20, margin: '10px 0' }}>
              <li><strong>Public Imports:</strong> We only fetch publicly accessible repository titles, descriptions, and languages with zero access to your private repositories or passwords.</li>
              <li><strong>AI Writing Assistance:</strong> Prompts sent for objective writing are processed ephemerally without persisting your personal identifiers in third-party marketing databases.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#ffffff', fontSize: 20, marginBottom: 12 }}>4. Data Ownership & Deletion Rights</h2>
            <p>
              You own 100% of your portfolio data. You can edit, export, or permanently delete any portfolio or resume at any time directly from your Dashboard. Clearing your browser local data removes all client-side cached entries immediately.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#ffffff', fontSize: 20, marginBottom: 12 }}>5. Compliance (Indian DPDPA & Global Standards)</h2>
            <p>
              Careerfolio complies with the Information Technology Act 2000 and the Digital Personal Data Protection Act (DPDPA 2023) of India. We uphold privacy-by-design principles and never monetize your career data.
            </p>
          </section>

          <section style={{ borderTop: '1px solid #1e2e26', paddingTop: 24, marginTop: 12 }}>
            <h2 style={{ color: '#ffffff', fontSize: 18, marginBottom: 8 }}>Contact Data Privacy Team</h2>
            <p style={{ margin: '0 0 16px' }}>
              Have questions regarding data protection or your portfolio privacy? Reach out directly:
            </p>
            <a
              href="mailto:privacy@careerfolio.me"
              style={{ color: '#46f6a5', fontWeight: 700, textDecoration: 'none' }}
            >
              ✉ privacy@careerfolio.me
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
