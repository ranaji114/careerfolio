import React from 'react';

export default function TermsOfServicePage({ onBack }) {
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
            LEGAL & USAGE TERMS
          </span>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 900, margin: '8px 0 12px', color: '#ffffff' }}>
            Terms of Service
          </h1>
          <p style={{ color: '#6b8f7a', fontSize: 14, margin: 0 }}>
            Last Updated: October 2026 · Standard User Agreement
          </p>
        </header>

        <div style={{ lineHeight: 1.8, fontSize: 15, color: '#c2d6cb', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <section style={{ background: '#111a16', border: '1px solid #1e2e26', borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: '#46f6a5', fontSize: 18, margin: '0 0 12px' }}>
              ✦ Welcome to Careerfolio
            </h2>
            <p style={{ margin: 0 }}>
              By accessing or using Careerfolio, you agree to these Terms of Service. Careerfolio provides developer portfolio creation tools, custom layout themes, and single-page ATS resume generation software.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#ffffff', fontSize: 20, marginBottom: 12 }}>1. Free Tier & Pro Tier Licensing</h2>
            <p>
              <strong>Free Tier:</strong> Careerfolio provides free portfolio hosting and core templates without charge. You may create, publish, and share your personal portfolio freely.
            </p>
            <p>
              <strong>Pro Lifetime Access (₹199):</strong> Grants lifetime access to all Pro features including Bento Matrix Pro, Hacker CLI Pro, AI Content Writer, and advanced single-page resume formatting. Pro purchases are one-time payments with zero recurring subscription charges.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#ffffff', fontSize: 20, marginBottom: 12 }}>2. User Content & Intellectual Property</h2>
            <p>
              You retain <strong>100% intellectual property rights and full copyright</strong> to all projects, code samples, text descriptions, images, and work history you upload or publish through Careerfolio. Careerfolio claims no ownership over your work.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#ffffff', fontSize: 20, marginBottom: 12 }}>3. Acceptable Use Policy</h2>
            <p>You agree not to use Careerfolio to:</p>
            <ul style={{ paddingLeft: 20, margin: '10px 0' }}>
              <li>Publish unlawful, abusive, defamatory, or fraudulent content.</li>
              <li>Impersonate another person, developer, or organization.</li>
              <li>Host malicious scripts, malware, or phishing links.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#ffffff', fontSize: 20, marginBottom: 12 }}>4. Service Availability & Disclaimers</h2>
            <p>
              Careerfolio is provided "as is" with high availability targets. While we strive for 99.9% uptime, we are not liable for temporary network outages, third-party browser caching discrepancies, or data loss caused by manual local storage clearing.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#ffffff', fontSize: 20, marginBottom: 12 }}>5. Governing Law & Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any legal dispute shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
            </p>
          </section>

          <section style={{ borderTop: '1px solid #1e2e26', paddingTop: 24, marginTop: 12 }}>
            <h2 style={{ color: '#ffffff', fontSize: 18, marginBottom: 8 }}>Questions or Inquiries?</h2>
            <p style={{ margin: '0 0 16px' }}>
              For support, business inquiries, or licensing questions:
            </p>
            <a
              href="mailto:support@careerfolio.me"
              style={{ color: '#46f6a5', fontWeight: 700, textDecoration: 'none' }}
            >
              ✉ support@careerfolio.me
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
