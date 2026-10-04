import React, { useState } from 'react';
import { nanoid } from 'nanoid';

export default function GithubImportModal({ isOpen, onClose, onImportProjects }) {
  const [username, setUsername] = useState('ranaji114');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [repos, setRepos] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  if (!isOpen) return null;

  const handleFetch = async (e) => {
    e?.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username.trim())}/repos?sort=updated&per_page=15`);
      if (!res.ok) {
        throw new Error(`GitHub user "${username}" not found or rate limited.`);
      }
      const data = await res.json();
      const mapped = data.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description || 'Open source software system built on GitHub.',
        stars: r.stargazers_count,
        language: r.language || 'Code',
        topics: r.topics || [],
        githubUrl: r.html_url,
        homepage: r.homepage || '',
      }));
      setRepos(mapped);
      // pre-select first 4
      setSelectedIds(new Set(mapped.slice(0, 4).map((r) => r.id)));
    } catch (err) {
      setError(err.message || 'Failed to fetch repositories.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirmImport = () => {
    const selected = repos.filter((r) => selectedIds.has(r.id));
    if (selected.length === 0) return;

    const formattedProjects = selected.map((r) => ({
      id: nanoid(6),
      title: r.name.replace(/[-_]/g, ' '),
      tag: `${r.language} · GitHub (${r.stars} ★)`,
      status: 'LIVE',
      description: r.description,
      highlights: [
        `Open-source repository on GitHub with ${r.stars} stars.`,
        `Built primary architecture with ${r.language}.`,
      ],
      tech: [r.language, ...(r.topics.slice(0, 3))].filter(Boolean),
      github: r.githubUrl,
      demo: r.homepage || '',
    }));

    onImportProjects(formattedProjects);
    onClose();
  };

  return (
    <div className="upgrade-overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gh-modal">
        <button className="auth-close" onClick={onClose} aria-label="Close">×</button>
        <div className="gh-modal-head">
          <span className="brand-star">⚡</span>
          <p className="eyebrow">DEVELOPER SUPERPOWER</p>
          <h2>1-Click GitHub Repository Importer</h2>
          <p className="upgrade-sub">
            Fetch your real public GitHub repositories, stars, and languages to automatically generate portfolio & resume cards.
          </p>
        </div>

        <form onSubmit={handleFetch} className="gh-search-form">
          <div className="gh-input-group">
            <span className="gh-input-prefix">github.com/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. ranaji114 or torvalds"
            />
          </div>
          <button type="submit" className="button button-lime" disabled={loading}>
            {loading ? 'Fetching Repos...' : 'Fetch Repositories ↗'}
          </button>
        </form>

        {error && <div className="gh-error">{error}</div>}

        {repos.length > 0 && (
          <div className="gh-results">
            <div className="gh-results-bar">
              <span>Select repositories to import ({selectedIds.size} selected)</span>
              <button
                type="button"
                className="text-link"
                onClick={() => setSelectedIds(new Set(repos.map((r) => r.id)))}
              >
                Select all
              </button>
            </div>

            <div className="gh-repo-grid">
              {repos.map((repo) => {
                const isChecked = selectedIds.has(repo.id);
                return (
                  <div
                    key={repo.id}
                    className={`gh-repo-card${isChecked ? ' selected' : ''}`}
                    onClick={() => toggleSelect(repo.id)}
                  >
                    <div className="gh-repo-top">
                      <strong>{repo.name}</strong>
                      <span className="gh-star-badge">★ {repo.stars}</span>
                    </div>
                    <p className="gh-repo-desc">{repo.description}</p>
                    <div className="gh-repo-footer">
                      <span className="gh-lang-pill">{repo.language}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        aria-label="select repo"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="gh-modal-foot">
              <button className="button button-outline" onClick={onClose}>
                Cancel
              </button>
              <button
                className="button button-lime"
                onClick={handleConfirmImport}
                disabled={selectedIds.size === 0}
              >
                Import {selectedIds.size} Projects to Portfolio & Resume ✦
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
