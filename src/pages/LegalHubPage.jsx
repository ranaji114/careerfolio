import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LegalHubPage({ initialTab = 'privacy', onBack, onNavigate }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <main className="legal-page-root">
      <div className="legal-container">
        {/* Top Back Navigation Bar */}
        <div className="legal-top-nav">
          <button className="legal-back-btn" onClick={onBack}>
            ← Back
          </button>
          <div className="legal-tab-switch">
            <button
              className={activeTab === 'privacy' ? 'active' : ''}
              onClick={() => setActiveTab('privacy')}
            >
              🔒 Privacy Policy
            </button>
            <button
              className={activeTab === 'terms' ? 'active' : ''}
              onClick={() => setActiveTab('terms')}
            >
              📄 Terms of Service
            </button>
            <button
              className={activeTab === 'security' ? 'active' : ''}
              onClick={() => setActiveTab('security')}
            >
              🛡️ Security & Sovereignty
            </button>
          </div>
        </div>

        {/* Header */}
        <header className="legal-header">
          <span className="legal-kicker">CAREERFOLIO LEGAL & TRUST CENTER</span>
          <h1>
            {activeTab === 'privacy' && 'Privacy Policy & Data Sovereignty'}
            {activeTab === 'terms' && 'Terms of Service & License Agreement'}
            {activeTab === 'security' && 'Security Architecture & Compliance'}
          </h1>
          <p className="legal-meta">
            Last Updated: October 2026 · Operating under Local-First Privacy Standards & India DPDP / GDPR
          </p>
        </header>

        {/* ── Content: Privacy Policy ── */}
        {activeTab === 'privacy' && (
          <motion.div
            className="legal-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="legal-highlight-box">
              <h3>✦ Executive Summary: Your Data Belongs Exclusively to You</h3>
              <p>
                Careerfolio operates on a strict <strong>Local-First Architecture</strong>. All your portfolio drafts,
                resume entries, uploaded headshots, and contact messages are stored primarily inside your own browser's
                secure <code>localStorage</code> database. We do not sell your personal information, train public models
                on your private project data, or inject third-party advertising tracking pixels.
              </p>
            </div>

            <section>
              <h2>1. Information We Collect and Process</h2>
              <p>
                We only collect the absolute minimum information required to provide our resume and portfolio builder services:
              </p>
              <ul>
                <li><strong>Authentication Data:</strong> Your name, email address, and locally hashed password token when you create an account.</li>
                <li><strong>Portfolio & Resume Content:</strong> Text, project descriptions, skills, metrics, and computer headshots you provide to build your public presentation.</li>
                <li><strong>Local View Counters:</strong> Anonymous visit analytics counted directly on the client side to give you insights into your link traffic.</li>
              </ul>
            </section>

            <section>
              <h2>2. How Your Uploaded Photos & Media Are Handled</h2>
              <p>
                When you upload a profile photo from your computer, it is converted into an encoded Base64 string directly within your browser session via the HTML5 <code>FileReader</code> API. Your image never travels to unverified third-party ad networks.
              </p>
            </section>

            <section>
              <h2>3. AI Synthesis & Data Confidentiality</h2>
              <p>
                When you utilize our 1-Click AI Portfolio Synthesis or Section Rewriter tools, your raw input is processed solely to format engineering case studies. We do not use your proprietary project details or resume history to train publicly accessible machine learning models.
              </p>
            </section>

            <section>
              <h2>4. Your Rights Under Global Data Regulations (GDPR / India DPDP)</h2>
              <p>
                You retain complete sovereignty over your data at all times. You have the right to:
              </p>
              <ul>
                <li><strong>Export:</strong> Download all your portfolio and resume data as JSON or PDF at any time.</li>
                <li><strong>Modify:</strong> Edit, replace, or update any project case study, photo, or bio in real time.</li>
                <li><strong>Delete:</strong> Erase your account and purge all local storage records with a single click.</li>
              </ul>
            </section>

            <section>
              <h2>5. Contact & Privacy Inquiries</h2>
              <p>
                If you have questions regarding our privacy practices or wish to submit a data request, please contact our privacy team at <a href="mailto:privacy@careerfolio.app">privacy@careerfolio.app</a>.
              </p>
            </section>
          </motion.div>
        )}

        {/* ── Content: Terms of Service ── */}
        {activeTab === 'terms' && (
          <motion.div
            className="legal-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="legal-highlight-box">
              <h3>✦ Terms Overview: Transparent & Fair Terms</h3>
              <p>
                By using Careerfolio, you agree to these Terms of Service. We believe in honest pricing, full ownership
                of your intellectual property, and reliable platform uptime.
              </p>
            </div>

            <section>
              <h2>1. Content Ownership & Intellectual Property</h2>
              <p>
                <strong>You retain 100% ownership</strong> of all text, code snippets, project case studies, headshots, and resume entries that you create or upload to Careerfolio. We claim zero ownership rights over your creative or technical work.
              </p>
            </section>

            <section>
              <h2>2. Acceptable Use Policy</h2>
              <p>
                You agree not to use Careerfolio to host malicious software, conduct phishing campaigns, impersonate other individuals, or publish unlawful, defamatory, or infringing content. We reserve the right to suspend any public portfolio link violating these standards.
              </p>
            </section>

            <section>
              <h2>3. Membership Tiers & One-Time Payment Terms</h2>
              <p>
                Careerfolio offers free and upgraded lifetime tiers (Student Plus ₹99, Ultimate Pro ₹199). Upgrades are one-time payments with zero recurring monthly surprise fees.
              </p>
              <ul>
                <li><strong>Free Explorer (₹0):</strong> 1 live portfolio, 6 classic templates, 4 resume templates.</li>
                <li><strong>Student & Creator Plus (₹99):</strong> Up to 3 live portfolios, 10 templates, 8 resume formats, AI section writer, zero watermark.</li>
                <li><strong>Ultimate Pro All-Access (₹199):</strong> Unlimited portfolios & resumes, all 18+ bespoke pro templates, full 1-click AI 4-page generator, Recruiter HUD (⌘K).</li>
              </ul>
            </section>

            <section>
              <h2>4. Service Availability & Local Backups</h2>
              <p>
                While we strive for 99.9% uptime for public portfolio rendering links, we strongly encourage users to regularly export PDF backups of their verified resumes and portfolios.
              </p>
            </section>
          </motion.div>
        )}

        {/* ── Content: Security Architecture ── */}
        {activeTab === 'security' && (
          <motion.div
            className="legal-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="legal-highlight-box">
              <h3>✦ Security Architecture: Client-Side Sandboxing</h3>
              <p>
                Careerfolio is architected with modern defense-in-depth principles, zero third-party telemetry scraping,
                and end-to-end encrypted transport protocols.
              </p>
            </div>

            <section>
              <h2>1. Local Storage Sandboxing</h2>
              <p>
                User data is sandboxed inside domain-isolated <code>localStorage</code> partitions. No unauthorized cross-origin script or external plugin can access your drafts or contact inquiries.
              </p>
            </section>

            <section>
              <h2>2. Zero Third-Party Advertising Trackers</h2>
              <p>
                We do not include Google Analytics, Facebook Pixels, or invasive behavioral tracking scripts on your generated portfolio websites. Your recruiters and visitors experience blazing-fast load times and complete privacy.
              </p>
            </section>

            <section>
              <h2>3. Encrypted Transport (HTTPS/TLS 1.3)</h2>
              <p>
                All communications and assets transmitted across Careerfolio are protected using modern TLS 1.3 encryption with strict HTTP Strict Transport Security (HSTS) headers.
              </p>
            </section>

            <section>
              <h2>4. Responsible Disclosure Program</h2>
              <p>
                If you discover any security vulnerability in our platform, please disclose it responsibly by contacting our security team at <a href="mailto:security@careerfolio.app">security@careerfolio.app</a>.
              </p>
            </section>
          </motion.div>
        )}
      </div>
    </main>
  );
}
