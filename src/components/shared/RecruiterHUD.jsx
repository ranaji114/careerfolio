import React, { useState, useEffect } from 'react';
import { BLOCK_TYPES } from '../../data/defaultPortfolio';

export default function RecruiterHUD({ portfolio, isPro, onOpenResume, onClose }) {
  const [cliInput, setCliInput] = useState('');
  const [cliLogs, setCliLogs] = useState([
    'Type "help" to see available developer commands.',
  ]);

  const homeBlocks = portfolio?.pages?.home?.blocks || [];
  const hero = homeBlocks.find((b) => b.type === BLOCK_TYPES.HERO) || {};
  const projectsBlock = homeBlocks.find((b) => b.type === BLOCK_TYPES.PROJECTS) || {};
  const skillsBlock = homeBlocks.find((b) => b.type === BLOCK_TYPES.SKILLS) || {};
  const contactBlock = portfolio?.pages?.contact?.blocks?.find((b) => b.type === BLOCK_TYPES.CONTACT) || {};

  const name = hero.name || 'Candidate';
  const role = hero.role || 'Full-Stack Developer';
  const location = hero.location || 'Global Remote';
  const topProjects = (projectsBlock.projects || []).slice(0, 3);

  // Extract skills
  const skills = [];
  (skillsBlock.categories || []).forEach((c) => {
    if (Array.isArray(c.items)) skills.push(...c.items);
  });

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = cliInput.trim().toLowerCase();
    if (!cmd) return;

    let res = '';
    switch (cmd) {
      case 'help':
        res = 'Available commands: whoami, skills, projects, contact, resume, clear';
        break;
      case 'whoami':
        res = `${name} — ${role} based in ${location}`;
        break;
      case 'skills':
        res = `Stack: ${skills.join(', ') || 'Rust, React, TypeScript, Node.js, SQL'}`;
        break;
      case 'projects':
        res = `Top systems: ${topProjects.map((p) => p.title).join(' | ')}`;
        break;
      case 'contact':
        res = `Email: ${hero.email || contactBlock.email || 'developer@example.com'}`;
        break;
      case 'resume':
        res = 'Opening live ATS resume view...';
        onOpenResume?.();
        break;
      case 'clear':
        setCliLogs([]);
        setCliInput('');
        return;
      default:
        res = `Command not recognized: "${cmd}". Type "help" for list.`;
    }

    setCliLogs((prev) => [...prev, `$ ${cliInput}`, res]);
    setCliInput('');
  };

  return (
    <div className="upgrade-overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="hud-modal">
        <button className="auth-close" onClick={onClose} aria-label="Close">×</button>

        <div className="hud-header">
          <div className="hud-status-badge">
            <span className="hud-pulse" />
            <span>AVAILABLE FOR OPPORTUNITIES · Q1/Q2</span>
          </div>
          <h2>Recruiter & Client Quick-Scan HUD</h2>
          <p className="hud-sub">A 15-second high-density view tailored for hiring managers & founders.</p>
        </div>

        <div className="hud-grid">
          {/* Left: Summary, Skills & Contact */}
          <div className="hud-candidate-col">
            <div className="hud-card">
              <span className="eyebrow" style={{ color: '#a3e635' }}>CANDIDATE SNAPSHOT</span>
              <h3>{name}</h3>
              <p className="hud-role-text">{role}</p>
              <div className="hud-meta-row">
                <span>📍 {location}</span>
                <span>✦ Careerfolio Verified</span>
              </div>

              <div className="hud-actions-row">
                <button
                  className="button button-lime hud-action-btn"
                  onClick={() => {
                    onClose();
                    onOpenResume?.();
                  }}
                >
                  📄 View ATS Resume →
                </button>
                {hero.email && (
                  <a href={`mailto:${hero.email}`} className="button button-outline hud-action-btn">
                    ✉ Email Candidate
                  </a>
                )}
              </div>
            </div>

            <div className="hud-card">
              <span className="eyebrow">PRIMARY COMPETENCIES</span>
              <div className="hud-skills-wrap">
                {(skills.length > 0 ? skills.slice(0, 10) : ['TypeScript', 'React', 'Rust', 'Node.js', 'PostgreSQL', 'Tailwind', 'Cloud Architectures']).map((s, i) => (
                  <span key={i} className="hud-skill-tag">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Flagship Projects + Mini Terminal */}
          <div className="hud-projects-col">
            <div className="hud-card">
              <span className="eyebrow">KEY DELIVERED SYSTEMS</span>
              <div className="hud-proj-list">
                {topProjects.map((p, i) => (
                  <div key={i} className="hud-proj-item">
                    <div className="hud-proj-top">
                      <strong>{p.title}</strong>
                      <div className="hud-proj-links">
                        {p.demo && <a href={p.demo} target="_blank" rel="noreferrer">Live Demo ↗</a>}
                        {p.github && <a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
                      </div>
                    </div>
                    <p className="hud-proj-desc">{p.description}</p>
                    <div className="hud-tech-row">
                      {(p.tech || []).map((t, idx) => (
                        <span key={idx}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Terminal for Developers */}
            <div className="hud-terminal">
              <div className="hud-term-top">
                <span className="hud-term-dot red" />
                <span className="hud-term-dot yellow" />
                <span className="hud-term-dot green" />
                <span className="hud-term-title">terminal://recruiter-prompt</span>
              </div>
              <div className="hud-term-body">
                {cliLogs.map((log, idx) => (
                  <div key={idx} className="hud-term-line">{log}</div>
                ))}
                <form onSubmit={handleCommand} className="hud-term-input-row">
                  <span className="hud-term-prompt">&gt;</span>
                  <input
                    type="text"
                    value={cliInput}
                    onChange={(e) => setCliInput(e.target.value)}
                    placeholder="type 'skills', 'projects', 'resume'..."
                    autoFocus
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
