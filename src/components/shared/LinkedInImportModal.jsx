import React, { useState } from 'react';

export default function LinkedInImportModal({ onImport, onClose }) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'error'
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    if (!url.trim()) return;
    setStatus('loading');
    setMessage('');
    try {
      // LinkedIn blocks CORS — this fetch will always throw in-browser.
      // We handle it gracefully and show a helpful error.
      await fetch(url.trim(), { mode: 'no-cors' });
      // Even if no-cors "succeeds" (opaque response), we can't read the body.
      throw new Error('CORS_BLOCKED');
    } catch {
      setStatus('error');
      setMessage(
        'Import could not be completed. LinkedIn restricts automated access from the browser. ' +
        'Try copying your name, role, and skills from your LinkedIn profile and pasting them manually into the Hero and Skills blocks.'
      );
    }
  };

  return (
    <div
      className="upgrade-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="upgrade-modal" style={{ maxWidth: 480 }}>
        <button className="auth-close" onClick={onClose} aria-label="Close">×</button>
        <p className="eyebrow">LINKEDIN IMPORT</p>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>Import from LinkedIn</h2>
        <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 16 }}>
          Paste your LinkedIn profile URL below. We'll attempt to pull your name, headline, and skills.
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.linkedin.com/in/your-profile"
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #2e2e2e',
              background: '#111',
              color: '#f0f0f0',
              fontSize: 14,
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleImport()}
          />
          <button
            className="button button-lime"
            onClick={handleImport}
            disabled={status === 'loading' || !url.trim()}
            style={{ whiteSpace: 'nowrap' }}
          >
            {status === 'loading' ? 'Importing…' : 'Import →'}
          </button>
        </div>

        {status === 'error' && (
          <div style={{
            background: '#1a0a0a',
            border: '1px solid #4a1f1f',
            borderRadius: 8,
            padding: '12px 14px',
            color: '#f87171',
            fontSize: 13,
            marginBottom: 12,
            lineHeight: 1.5,
          }}>
            ⚠ {message}
          </div>
        )}

        <p style={{ color: '#6b7280', fontSize: 12, marginTop: 8 }}>
          ⚠ Parsing is best-effort. Results may be incomplete or unavailable due to LinkedIn's access restrictions.
        </p>

        <button
          className="button button-outline"
          onClick={onClose}
          style={{ marginTop: 16, width: '100%' }}
        >
          Close
        </button>
      </section>
    </div>
  );
}
