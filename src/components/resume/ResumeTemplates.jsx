import React from 'react';

// ─── Free Template 1: Harvard ATS Classic (Single Column) ──────────────────────
export function ATSClassicTemplate({ data, t }) {
  const p = data.personal || {};
  return (
    <div className="res-doc res-ats-classic">
      <header className="res-classic-header">
        <h1 className="res-name">{p.name || 'Your Full Name'}</h1>
        <div className="res-contact-line">
          {p.location && <span>{p.location}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {p.email && <span>• {p.email}</span>}
          {p.github && <span>• <a href={p.github} target="_blank" rel="noreferrer">GitHub</a></span>}
          {p.linkedin && <span>• <a href={p.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></span>}
          {p.website && <span>• {p.website}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="res-sec">
          <h2 className="res-sec-title">Professional Summary</h2>
          <p className="res-body-text">{data.summary}</p>
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="res-sec">
          <h2 className="res-sec-title">Technical Skills</h2>
          <p className="res-body-text">
            <strong>Core Competencies:</strong> {data.skills.join(', ')}
          </p>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="res-sec">
          <h2 className="res-sec-title">Professional Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={exp.id || i} className="res-item">
              <div className="res-item-head">
                <strong>{exp.role}</strong>
                <span className="res-meta-date">{exp.period}</span>
              </div>
              <div className="res-item-sub">
                <em>{exp.company}</em>
                <span className="res-meta-loc">{exp.location}</span>
              </div>
              <ul className="res-bullets">
                {(exp.bullets || []).map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.projects && data.projects.length > 0 && (
        <section className="res-sec">
          <h2 className="res-sec-title">Technical Projects</h2>
          {data.projects.map((proj, i) => (
            <div key={proj.id || i} className="res-item">
              <div className="res-item-head">
                <strong>{proj.title}</strong>
                {proj.link && (
                  <span className="res-meta-link">
                    <a href={proj.link} target="_blank" rel="noreferrer">Demo / Code ↗</a>
                  </span>
                )}
              </div>
              {proj.tech && proj.tech.length > 0 && (
                <div className="res-item-tech">
                  <small>Tech: {proj.tech.join(' · ')}</small>
                </div>
              )}
              <ul className="res-bullets">
                {(proj.bullets || []).map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="res-sec">
          <h2 className="res-sec-title">Education</h2>
          {data.education.map((edu, i) => (
            <div key={edu.id || i} className="res-item">
              <div className="res-item-head">
                <strong>{edu.institution}</strong>
                <span className="res-meta-date">{edu.period}</span>
              </div>
              <div className="res-item-sub">
                <span>{edu.degree} in {edu.field}</span>
                {edu.grade && <span className="res-meta-loc">{edu.grade}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="res-sec">
          <h2 className="res-sec-title">Certifications & Honors</h2>
          <ul className="res-bullets">
            {data.certifications.map((c, i) => (
              <li key={c.id || i}>
                <strong>{c.name}</strong> — {c.issuer} ({c.year})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// ─── Free Template 2: Silicon Valley Modern (Split Column) ────────────────────
export function ModernTechTemplate({ data, t }) {
  const p = data.personal || {};
  return (
    <div className="res-doc res-modern-tech">
      <header className="res-modern-header">
        <div className="res-modern-title-group">
          <h1 className="res-modern-name">{p.name || 'Your Full Name'}</h1>
          <p className="res-modern-role" style={{ color: t.accent }}>{p.role || 'Full-Stack Software Engineer'}</p>
        </div>
        <div className="res-modern-contact-grid">
          {p.email && <div>✉ {p.email}</div>}
          {p.phone && <div>☎ {p.phone}</div>}
          {p.location && <div>📍 {p.location}</div>}
          {p.github && <div>⚡ <a href={p.github} target="_blank" rel="noreferrer">GitHub</a></div>}
          {p.linkedin && <div>in <a href={p.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>}
        </div>
      </header>

      <div className="res-split-body">
        {/* Left Column: Summary, Skills, Education */}
        <aside className="res-col-side">
          {data.summary && (
            <div className="res-sec">
              <h3 className="res-side-title" style={{ borderColor: t.accent }}>Profile</h3>
              <p className="res-side-text">{data.summary}</p>
            </div>
          )}

          {data.skills && data.skills.length > 0 && (
            <div className="res-sec">
              <h3 className="res-side-title" style={{ borderColor: t.accent }}>Skills & Tools</h3>
              <div className="res-skill-tags">
                {data.skills.map((s, i) => (
                  <span key={i} className="res-skill-pill" style={{ borderColor: t.accent }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {data.education && data.education.length > 0 && (
            <div className="res-sec">
              <h3 className="res-side-title" style={{ borderColor: t.accent }}>Education</h3>
              {data.education.map((edu, i) => (
                <div key={i} className="res-side-edu">
                  <strong>{edu.degree}</strong>
                  <div>{edu.field}</div>
                  <small>{edu.institution}</small>
                  <small className="res-date-muted">{edu.period}</small>
                </div>
              ))}
            </div>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <div className="res-sec">
              <h3 className="res-side-title" style={{ borderColor: t.accent }}>Credentials</h3>
              {data.certifications.map((c, i) => (
                <div key={i} className="res-side-cert">
                  <strong>{c.name}</strong>
                  <small>{c.issuer} · {c.year}</small>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Right Column: Experience, Projects */}
        <main className="res-col-main">
          {data.experience && data.experience.length > 0 && (
            <section className="res-sec">
              <h3 className="res-main-title" style={{ color: t.accent }}>Experience</h3>
              {data.experience.map((exp, i) => (
                <div key={i} className="res-card-item">
                  <div className="res-card-head">
                    <div>
                      <strong className="res-card-role">{exp.role}</strong>
                      <span className="res-card-company"> @ {exp.company}</span>
                    </div>
                    <span className="res-card-period">{exp.period}</span>
                  </div>
                  <ul className="res-bullets">
                    {(exp.bullets || []).map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section className="res-sec">
              <h3 className="res-main-title" style={{ color: t.accent }}>Featured Systems</h3>
              {data.projects.map((proj, i) => (
                <div key={i} className="res-card-item">
                  <div className="res-card-head">
                    <strong className="res-card-role">{proj.title}</strong>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="res-proj-link" style={{ color: t.accent }}>
                        View live ↗
                      </a>
                    )}
                  </div>
                  {proj.tech && proj.tech.length > 0 && (
                    <div className="res-tech-chips">
                      {proj.tech.map((tc, ti) => (
                        <span key={ti}>{tc}</span>
                      ))}
                    </div>
                  )}
                  <ul className="res-bullets">
                    {(proj.bullets || []).map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Free Template 3: Clean Minimalist ────────────────────────────────────────
export function CleanMinimalTemplate({ data, t }) {
  const p = data.personal || {};
  return (
    <div className="res-doc res-clean-minimal">
      <header className="res-min-head">
        <h1 className="res-min-name">{p.name}</h1>
        <p className="res-min-kicker">{p.role} · {p.location}</p>
        <p className="res-min-contacts">
          {[p.email, p.phone, p.github, p.linkedin, p.website].filter(Boolean).join('  /  ')}
        </p>
      </header>

      {data.summary && (
        <div className="res-min-summary">
          <p>{data.summary}</p>
        </div>
      )}

      {data.skills && data.skills.length > 0 && (
        <div className="res-min-row">
          <div className="res-min-label">SKILLS</div>
          <div className="res-min-content">{data.skills.join('  ·  ')}</div>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="res-min-row">
          <div className="res-min-label">EXPERIENCE</div>
          <div className="res-min-content">
            {data.experience.map((exp, i) => (
              <div key={i} className="res-min-block">
                <div className="res-min-block-top">
                  <strong>{exp.role}, {exp.company}</strong>
                  <span>{exp.period}</span>
                </div>
                <ul className="res-bullets">
                  {(exp.bullets || []).map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.projects && data.projects.length > 0 && (
        <div className="res-min-row">
          <div className="res-min-label">PROJECTS</div>
          <div className="res-min-content">
            {data.projects.map((proj, i) => (
              <div key={i} className="res-min-block">
                <div className="res-min-block-top">
                  <strong>{proj.title}</strong>
                  <span>{proj.tech?.join(', ')}</span>
                </div>
                <ul className="res-bullets">
                  {(proj.bullets || []).map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education && data.education.length > 0 && (
        <div className="res-min-row">
          <div className="res-min-label">EDUCATION</div>
          <div className="res-min-content">
            {data.education.map((edu, i) => (
              <div key={i} className="res-min-block-top">
                <strong>{edu.institution}</strong>
                <span>{edu.degree} · {edu.period}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Free Template 4: Monospace Terminal ──────────────────────────────────────
export function MonoDeveloperTemplate({ data, t }) {
  const p = data.personal || {};
  return (
    <div className="res-doc res-mono-dev">
      <div className="res-mono-topbar">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
        <span className="res-mono-term-title">~/{p.name?.toLowerCase().replace(/\s+/g, '-')}/resume.md</span>
      </div>

      <header className="res-mono-header">
        <div className="res-mono-prompt"># IDENTITY</div>
        <h1 className="res-mono-name">{p.name || 'Anonymous Developer'}</h1>
        <p className="res-mono-subtitle">&gt; {p.role} [{p.location}]</p>
        <div className="res-mono-meta">
          <span>email: {p.email}</span>
          <span>github: {p.github}</span>
          <span>web: {p.website}</span>
        </div>
      </header>

      {data.summary && (
        <section className="res-mono-sec">
          <div className="res-mono-prompt">## 01. SUMMARY</div>
          <p className="res-mono-text">{data.summary}</p>
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="res-mono-sec">
          <div className="res-mono-prompt">## 02. STACK</div>
          <div className="res-mono-skills">
            {data.skills.map((s, i) => (
              <span key={i} className="res-mono-badge">[{s}]</span>
            ))}
          </div>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="res-mono-sec">
          <div className="res-mono-prompt">## 03. EXPERIENCE</div>
          {data.experience.map((exp, i) => (
            <div key={i} className="res-mono-item">
              <div className="res-mono-item-header">
                <strong>* {exp.role}</strong>
                <span>@{exp.company} // {exp.period}</span>
              </div>
              <ul className="res-mono-bullets">
                {(exp.bullets || []).map((b, bi) => (
                  <li key={bi}>-&gt; {b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.projects && data.projects.length > 0 && (
        <section className="res-mono-sec">
          <div className="res-mono-prompt">## 04. SHIPMENTS</div>
          {data.projects.map((proj, i) => (
            <div key={i} className="res-mono-item">
              <div className="res-mono-item-header">
                <strong>git clone {proj.title}</strong>
                <span>{proj.tech?.join(' | ')}</span>
              </div>
              <ul className="res-mono-bullets">
                {(proj.bullets || []).map((b, bi) => (
                  <li key={bi}>-&gt; {b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

// ─── Pro Template 5: Executive Elite Pro (Outstanding Luxury) ──────────────────
export function ExecutiveProTemplate({ data, t }) {
  const p = data.personal || {};
  return (
    <div className="res-doc res-executive-pro">
      <header className="res-exec-banner">
        <div className="res-exec-banner-inner">
          <div className="res-exec-name-box">
            <h1 className="res-exec-name">{p.name || 'Executive Leader'}</h1>
            <p className="res-exec-role">{p.role}</p>
          </div>
          <div className="res-exec-contacts">
            <div><i className="res-ico">✉</i> {p.email}</div>
            <div><i className="res-ico">☎</i> {p.phone}</div>
            <div><i className="res-ico">📍</i> {p.location}</div>
            <div><i className="res-ico">⚡</i> {p.linkedin || p.website}</div>
          </div>
        </div>
      </header>

      <div className="res-exec-body">
        {data.summary && (
          <section className="res-exec-sec">
            <h2 className="res-exec-sec-title"><span>01</span> Executive Profile</h2>
            <p className="res-exec-summary-text">{data.summary}</p>
          </section>
        )}

        {data.skills && data.skills.length > 0 && (
          <section className="res-exec-sec">
            <h2 className="res-exec-sec-title"><span>02</span> Areas of Expertise</h2>
            <div className="res-exec-skills-grid">
              {data.skills.map((s, i) => (
                <div key={i} className="res-exec-skill-chip">
                  <span className="res-exec-bullet">◆</span> {s}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.experience && data.experience.length > 0 && (
          <section className="res-exec-sec">
            <h2 className="res-exec-sec-title"><span>03</span> Leadership & Track Record</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="res-exec-item">
                <div className="res-exec-item-bar">
                  <div>
                    <h3 className="res-exec-item-role">{exp.role}</h3>
                    <span className="res-exec-item-company">{exp.company} · {exp.location}</span>
                  </div>
                  <span className="res-exec-badge">{exp.period}</span>
                </div>
                <ul className="res-exec-bullets">
                  {(exp.bullets || []).map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section className="res-exec-sec">
            <h2 className="res-exec-sec-title"><span>04</span> Flagship Engineering Projects</h2>
            <div className="res-exec-projects-grid">
              {data.projects.map((proj, i) => (
                <div key={i} className="res-exec-proj-card">
                  <div className="res-exec-proj-head">
                    <strong>{proj.title}</strong>
                    {proj.link && <span>↗</span>}
                  </div>
                  <p className="res-exec-proj-tech">{proj.tech?.join(' • ')}</p>
                  <p className="res-exec-proj-desc">{proj.bullets?.[0]}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education && data.education.length > 0 && (
          <section className="res-exec-sec">
            <h2 className="res-exec-sec-title"><span>05</span> Credentials & Academic Background</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="res-exec-edu-row">
                <strong>{edu.degree} in {edu.field}</strong> — {edu.institution} ({edu.period})
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

// ─── Pro Template 6: Nordic Editorial Pro ─────────────────────────────────────
export function NordicEditorialProTemplate({ data, t }) {
  const p = data.personal || {};
  return (
    <div className="res-doc res-nordic-pro">
      <div className="res-nordic-sidebar">
        <div className="res-nordic-mark">✦ CAREERFOLIO</div>
        <h1 className="res-nordic-side-name">{p.name}</h1>
        <p className="res-nordic-side-role">{p.role}</p>

        <div className="res-nordic-side-sec">
          <label>CONTACT</label>
          <p>{p.email}</p>
          <p>{p.phone}</p>
          <p>{p.location}</p>
        </div>

        <div className="res-nordic-side-sec">
          <label>LINKS</label>
          <p>{p.github}</p>
          <p>{p.linkedin}</p>
          <p>{p.website}</p>
        </div>

        {data.skills && data.skills.length > 0 && (
          <div className="res-nordic-side-sec">
            <label>EXPERTISE</label>
            <div className="res-nordic-pills">
              {data.skills.map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {data.education && data.education.length > 0 && (
          <div className="res-nordic-side-sec">
            <label>EDUCATION</label>
            {data.education.map((edu, i) => (
              <div key={i} className="res-nordic-edu">
                <strong>{edu.degree}</strong>
                <small>{edu.institution}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="res-nordic-main">
        {data.summary && (
          <div className="res-nordic-lead">
            <p>{data.summary}</p>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <section className="res-nordic-section">
            <h2 className="res-nordic-heading">Selected Work Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="res-nordic-entry">
                <div className="res-nordic-time">{exp.period}</div>
                <div className="res-nordic-content">
                  <div className="res-nordic-title-row">
                    <h3>{exp.role}</h3>
                    <span className="res-nordic-corp">{exp.company}</span>
                  </div>
                  <ul className="res-bullets">
                    {(exp.bullets || []).map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section className="res-nordic-section">
            <h2 className="res-nordic-heading">Key Production Systems</h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="res-nordic-entry">
                <div className="res-nordic-time">{proj.tech?.slice(0, 2).join(' / ')}</div>
                <div className="res-nordic-content">
                  <div className="res-nordic-title-row">
                    <h3>{proj.title}</h3>
                  </div>
                  <ul className="res-bullets">
                    {(proj.bullets || []).map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

// ─── Pro Template 7: Cyber Hacker CLI Pro ────────────────────────────────────
export function MatrixCLIProTemplate({ data, t }) {
  const p = data.personal || {};
  return (
    <div className="res-doc res-matrix-cli-pro">
      <div className="res-cli-chrome">
        <span className="res-cli-dot red" />
        <span className="res-cli-dot yellow" />
        <span className="res-cli-dot green" />
        <span className="res-cli-session">root@{p.name?.toLowerCase().replace(/\s+/g, '')}:~</span>
      </div>

      <div className="res-cli-inner">
        <div className="res-cli-line">
          <span className="res-cli-prompt">$ whoami --verbose</span>
        </div>
        <div className="res-cli-out">
          <div className="res-cli-hero">
            <h1 className="res-cli-name">&gt;&gt; {p.name}</h1>
            <p className="res-cli-role">ROLE: {p.role} | LOC: {p.location}</p>
            <p className="res-cli-comms">COMMS: {p.email} | GITHUB: {p.github} | WEB: {p.website}</p>
          </div>
        </div>

        {data.summary && (
          <>
            <div className="res-cli-line"><span className="res-cli-prompt">$ cat /etc/bio.txt</span></div>
            <div className="res-cli-out"><p className="res-cli-p">{data.summary}</p></div>
          </>
        )}

        {data.skills && data.skills.length > 0 && (
          <>
            <div className="res-cli-line"><span className="res-cli-prompt">$ bin/env --get-skills</span></div>
            <div className="res-cli-out">
              <div className="res-cli-chips">
                {data.skills.map((s, i) => (
                  <span key={i} className="res-cli-chip">[OK: {s}]</span>
                ))}
              </div>
            </div>
          </>
        )}

        {data.experience && data.experience.length > 0 && (
          <>
            <div className="res-cli-line"><span className="res-cli-prompt">$ systemctl status experience.service</span></div>
            <div className="res-cli-out">
              {data.experience.map((exp, i) => (
                <div key={i} className="res-cli-block">
                  <div className="res-cli-block-head">
                    <span className="res-cli-star">●</span> <strong>{exp.role}</strong> @ {exp.company} [{exp.period}]
                  </div>
                  <ul className="res-cli-bullets">
                    {(exp.bullets || []).map((b, bi) => (
                      <li key={bi}>[+] {b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        {data.projects && data.projects.length > 0 && (
          <>
            <div className="res-cli-line"><span className="res-cli-prompt">$ docker ps --format="built-systems"</span></div>
            <div className="res-cli-out">
              {data.projects.map((proj, i) => (
                <div key={i} className="res-cli-block">
                  <div className="res-cli-block-head">
                    <span className="res-cli-star">▲</span> <strong>{proj.title}</strong> — {proj.tech?.join(' · ')}
                  </div>
                  <ul className="res-cli-bullets">
                    {(proj.bullets || []).map((b, bi) => (
                      <li key={bi}>&gt; {b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Dispatcher ────────────────────────────────────────────────────────
export default function ResumeRenderer({ data, templateId, isPro = false, formatting }) {
  const tid = templateId || data?.templateId || 'ats-classic';
  const fmt = formatting || data?.formatting || {};
  const fontScale = fmt.fontSize === 'compact' ? 0.9 : fmt.fontSize === 'roomy' ? 1.08 : 0.98;
  const spacingScale = fmt.spacing === 'compact' ? 0.85 : fmt.spacing === 'relaxed' ? 1.15 : 0.95;

  const defaultAccents = {
    'modern-tech': '#0284c7',
    'clean-minimal': '#27272a',
    'mono-developer': '#059669',
    'executive-pro': '#d97706',
    'nordic-editorial-pro': '#6366f1',
    'matrix-cli-pro': '#10b981',
    'ats-classic': '#111827',
  };

  const activeAccent = fmt.accentColor || defaultAccents[tid] || '#111827';
  const t = { accent: activeAccent };

  const renderTemplate = () => {
    switch (tid) {
      case 'modern-tech':
        return <ModernTechTemplate data={data} t={t} />;
      case 'clean-minimal':
        return <CleanMinimalTemplate data={data} t={t} />;
      case 'mono-developer':
        return <MonoDeveloperTemplate data={data} t={t} />;
      case 'executive-pro':
        return <ExecutiveProTemplate data={data} t={t} />;
      case 'nordic-editorial-pro':
        return <NordicEditorialProTemplate data={data} t={t} />;
      case 'matrix-cli-pro':
        return <MatrixCLIProTemplate data={data} t={t} />;
      case 'ats-classic':
      default:
        return <ATSClassicTemplate data={data} t={t} />;
    }
  };

  return (
    <div
      className="res-single-page-wrapper"
      style={{
        '--res-font-scale': fontScale,
        '--res-spacing-scale': spacingScale,
        '--res-accent': activeAccent,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {renderTemplate()}
    </div>
  );
}
