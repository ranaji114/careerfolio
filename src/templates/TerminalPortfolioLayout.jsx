import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BLOCK_TYPES } from '../data/defaultPortfolio';

export default function TerminalPortfolioLayout({
  portfolio,
  page = 'home',
  t,
  editMode,
  onEditBlock,
  onChangePage,
  isPro,
  onOpenRecruiterHUD,
}) {
  const currentPage = page || 'home';
  const homeBlocks = portfolio?.pages?.home?.blocks || [];
  const workBlocks = portfolio?.pages?.work?.blocks || [];
  const aboutBlocks = portfolio?.pages?.about?.blocks || [];
  const contactBlocks = portfolio?.pages?.contact?.blocks || [];
  const allBlocks = [...homeBlocks, ...workBlocks, ...aboutBlocks, ...contactBlocks];

  const hero = allBlocks.find((b) => b.type === BLOCK_TYPES.HERO) || {};
  const projectsBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.PROJECTS) || {};
  const skillsBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.SKILLS) || {};
  const aboutBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.ABOUT) || {};
  const contactBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.CONTACT) || {};

  const name = hero.name || 'Developer';
  const role = hero.role || 'Full-Stack Software Engineer';
  const projects = projectsBlock.projects || [];

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'sys', text: `System initialized. Connected to ${name.toLowerCase().replace(/\s+/g, '')}.terminal [v2.4.0]` },
    { type: 'sys', text: `Type 'help' or click navigation tabs above to query system records.` },
  ]);

  const executeCmd = (command) => {
    const clean = command.trim().toLowerCase();
    if (!clean) return;

    const newHistory = [...history, { type: 'cmd', text: `$ ${command}` }];

    switch (clean) {
      case 'help':
        newHistory.push({
          type: 'out',
          text: `AVAILABLE COMMANDS:
  about       - Read biography and architectural philosophy
  projects    - List all production software builds & live demos
  skills      - Query core tech stack and system competencies
  contact     - Display communication channels and email
  recruiter   - Launch Recruiter Quick-Scan HUD (⌘K)
  clear       - Reset terminal buffer`,
        });
        break;

      case 'about':
        onChangePage?.('about');
        newHistory.push({
          type: 'out',
          text: `[BIOGRAPHY]
Name: ${name}
Role: ${role}
Location: ${hero.location || 'Remote Worldwide'}
Bio: ${aboutBlock.body || hero.tagline || 'Building software and exploring how deep systems operate.'}`,
        });
        break;

      case 'projects':
      case 'work':
        onChangePage?.('work');
        newHistory.push({
          type: 'out',
          text: `[PRODUCTION SHIPMENTS (${projects.length})]
${projects.map((p, i) => `[${i + 1}] ${p.title} (${p.status || 'SHIPPED'})
    Tech: ${p.tech?.join(', ') || 'N/A'}
    Desc: ${p.description}
    Demo: ${p.demo || p.liveUrl || 'N/A'}
    GitHub: ${p.github || p.githubUrl || 'N/A'}`).join('\n\n')}`,
        });
        break;

      case 'skills':
        const allSkills = [];
        (skillsBlock.categories || []).forEach((c) => {
          if (c.items) allSkills.push(`${c.label}: ${c.items.join(', ')}`);
        });
        newHistory.push({
          type: 'out',
          text: `[ENGINEERING TOOLKIT]
${allSkills.join('\n') || 'Languages: Rust, TypeScript, Python, SQL\nFrontend: React, Next.js, Tailwind\nBackend: Node.js, Express, Supabase, Postgres'}`,
        });
        break;

      case 'contact':
        onChangePage?.('contact');
        newHistory.push({
          type: 'out',
          text: `[COMMUNICATION CHANNELS]
Email: ${hero.email || contactBlock.email || 'developer@example.com'}
Links: ${(contactBlock.links || []).map((l) => `${l.label} -> ${l.url}`).join(' | ')}`,
        });
        break;

      case 'recruiter':
        onOpenRecruiterHUD?.();
        newHistory.push({ type: 'sys', text: `Launching Recruiter HUD interface...` });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newHistory.push({
          type: 'err',
          text: `bash: command not found: ${clean}. Type 'help' for valid options.`,
        });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const navItems = [
    { id: 'home', label: 'root@overview:~$' },
    { id: 'work', label: `cat projects.json (${projects.length})` },
    { id: 'about', label: 'cat bio.txt' },
    { id: 'contact', label: './connect.sh' },
  ];

  return (
    <div
      className={`terminal-layout-root template-${t.id}`}
      data-template={t.id}
      style={{
        background: '#0d1117',
        color: '#58a6ff',
        fontFamily: 'DM Mono, monospace',
        minHeight: '100vh',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="terminal-window"
        style={{
          background: '#090d13',
          border: '1px solid #30363d',
          borderRadius: 12,
          maxWidth: 960,
          margin: '0 auto',
          width: '100%',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Terminal Header */}
        <div
          className="terminal-header"
          style={{
            background: '#161b22',
            borderBottom: '1px solid #30363d',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ color: '#8b949e', fontSize: 13, marginLeft: 8 }}>
              {name.toLowerCase().replace(/\s+/g, '')}@system-v2: ~
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onChangePage?.(item.id);
                  executeCmd(item.id === 'home' ? 'about' : item.id);
                }}
                style={{
                  background: currentPage === item.id ? '#238636' : '#21262d',
                  color: currentPage === item.id ? '#ffffff' : '#c9d1d9',
                  border: '1px solid #30363d',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {item.label}
              </button>
            ))}
            {onOpenRecruiterHUD && (
              <button
                onClick={onOpenRecruiterHUD}
                style={{
                  background: '#1f6feb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                }}
              >
                ⚡ Recruiter HUD (⌘K)
              </button>
            )}
          </div>
        </div>

        {/* Profile identity strip */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #21262d', background: '#0d1117', display: 'flex', gap: 18, alignItems: 'center' }}>
          {(hero.avatar || hero.avatarUrl) && (
            <img
              src={hero.avatar || hero.avatarUrl}
              alt={hero.name}
              style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', border: '1px solid #30363d' }}
            />
          )}
          <div>
            <div style={{ color: '#7ee787', fontWeight: 700, fontSize: 16 }}>{name}</div>
            <div style={{ color: '#8b949e', fontSize: 13 }}>{role} {hero.location && `• 📍 ${hero.location}`}</div>
            {(hero.email || contactBlock.email) && (
              <a href={`mailto:${hero.email || contactBlock.email}`} style={{ color: '#58a6ff', fontSize: 12, textDecoration: 'none' }}>
                ✉ {hero.email || contactBlock.email}
              </a>
            )}
          </div>
        </div>

        {/* Terminal Body */}
        <div
          className="terminal-body"
          style={{
            padding: '20px 24px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {history.map((h, i) => (
            <div key={i}>
              {h.type === 'cmd' && <div style={{ color: '#79c0ff', fontWeight: 700 }}>{h.text}</div>}
              {h.type === 'sys' && <div style={{ color: '#8b949e' }}>{h.text}</div>}
              {h.type === 'err' && <div style={{ color: '#ff7b72' }}>{h.text}</div>}
              {h.type === 'out' && (
                <pre style={{ color: '#c9d1d9', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', background: '#161b22', padding: 14, borderRadius: 8, border: '1px solid #21262d' }}>
                  {h.text}
                </pre>
              )}
            </div>
          ))}

          {/* Prompt line */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeCmd(inputVal);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', paddingTop: 16 }}
          >
            <span style={{ color: '#7ee787', fontWeight: 700 }}>$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type 'help', 'projects', 'about', or 'contact'..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#f0f6fc',
                fontFamily: 'inherit',
                fontSize: 14,
                outline: 'none',
              }}
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
}
