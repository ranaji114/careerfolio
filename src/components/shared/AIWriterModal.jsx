import React, { useState } from 'react';

// Specialized AI prompt templates for Indian students, developers, and creators
const ROLE_PRESETS = [
  'Full-Stack Developer',
  'Frontend Engineer (React)',
  'Backend Engineer (Node/Python)',
  'CS / IT Student',
  'AI / ML Enthusiast',
  'Data Analyst',
  'UI/UX Designer',
  'Technical Writer & Author',
];

const PRESET_BIOS = {
  'Full-Stack Developer': [
    {
      role: 'Full-Stack Software Engineer',
      tagline: 'Building scalable web systems, secure APIs, and responsive UIs with modern stacks.',
      bio: 'Versatile Full-Stack Engineer experienced in architecting web applications using React, Node.js, and cloud databases. Passionate about clean code, RESTful API design, and production-ready deployments.',
    },
    {
      role: 'Product Engineer & Web Architect',
      tagline: 'Crafting end-to-end digital experiences from database schema to smooth frontend interactions.',
      bio: 'Driven developer with hands-on experience building full-stack platforms with Next.js, Express, and PostgreSQL. Focused on high-performance web applications and seamless UX.',
    },
    {
      role: 'Software Developer (React · Node · SQL)',
      tagline: 'Turning complex business requirements into fast, reliable web software.',
      bio: 'Results-oriented software developer specializing in modern JavaScript/TypeScript ecosystems. Proven track record in state management, database optimization, and cloud hosting.',
    },
  ],
  'CS / IT Student': [
    {
      role: 'Computer Science Undergraduate & Developer',
      tagline: 'Building production systems, compiler runtimes, and full-stack web portals.',
      bio: 'Passionate CS student with strong foundations in algorithms, data structures, and web development. Active open-source builder with production projects across React, Node.js, and SQL.',
    },
    {
      role: 'Software Engineering Student & Tech Creator',
      tagline: 'Eager to solve real-world problems through clean code and modern developer tooling.',
      bio: 'Dedicated developer building full-stack applications and open-source systems. Quick learner with experience in modern web frameworks, cloud database integration, and Git workflows.',
    },
    {
      role: 'Aspiring Software Development Engineer',
      tagline: 'Focused on core CS fundamentals, backend APIs, and modern frontend frameworks.',
      bio: 'Motivated tech student with hands-on project experience in web development, database management, and technical documentation. Seeking SDE internship opportunities.',
    },
  ],
  'Frontend Engineer (React)': [
    {
      role: 'Frontend Engineer (React & TypeScript)',
      tagline: 'Crafting pixel-perfect, accessible, and high-performance web interfaces.',
      bio: 'Specialized Frontend Engineer with expertise in React 19, Next.js, and modern CSS/Tailwind. Passionate about micro-interactions, responsive design systems, and frontend performance.',
    },
    {
      role: 'UI/UX & React Developer',
      tagline: 'Bridging the gap between creative design and robust frontend architecture.',
      bio: 'Frontend developer focused on building intuitive single-page applications and multi-page portfolios. Experienced in state management, modern component design, and API integration.',
    },
  ],
  'Backend Engineer (Node/Python)': [
    {
      role: 'Backend & Systems Engineer',
      tagline: 'Architecting high-throughput APIs, secure auth systems, and database layers.',
      bio: 'Backend specialist with expertise in Node.js, Express, and relational databases. Experienced in authentication security, database indexing, rate limiting, and microservice architecture.',
    },
  ],
};

export default function AIWriterModal({ isPro, onApplyToHero, onApplyToProject, onClose, onUpgrade }) {
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'project'
  const [selectedRole, setSelectedRole] = useState('CS / IT Student');
  const [userNotes, setUserNotes] = useState('');
  const [generatedBios, setGeneratedBios] = useState(PRESET_BIOS['CS / IT Student']);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [generatedProject, setGeneratedProject] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  if (!isPro) {
    return (
      <div className="upgrade-overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <section className="upgrade-modal" style={{ maxWidth: 480 }}>
          <button className="auth-close" onClick={onClose} aria-label="Close">×</button>
          <span className="plan-badge">PRO EXCLUSIVE ✦</span>
          <h2 style={{ fontSize: 24, margin: '12px 0 8px' }}>Unlock Pro AI Resume & Bio Assistant</h2>
          <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
            Generate professional English bios, metric-backed project bullet points, and ATS resume objectives tailored to your experience.
          </p>
          <div style={{ background: '#141414', border: '1px solid #282828', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#a3e635', fontWeight: 600 }}>✦ Designed for Indian Students & Developers</p>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#9ca3af' }}>
              Struggling to write project descriptions in English? Let Pro AI format your achievements into high-impact ATS bullet points in 1-click.
            </p>
          </div>
          <button className="button button-lime" style={{ width: '100%', justifyContent: 'center' }} onClick={onUpgrade}>
            Upgrade to Pro to Access AI Assistant →
          </button>
        </section>
      </div>
    );
  }

  const handleGenerateBio = () => {
    const baseList = PRESET_BIOS[selectedRole] || PRESET_BIOS['Full-Stack Developer'];
    if (userNotes.trim()) {
      const custom = baseList.map((item) => ({
        ...item,
        bio: `${item.bio} Specializing in: ${userNotes.trim()}.`,
      }));
      setGeneratedBios(custom);
    } else {
      setGeneratedBios(baseList);
    }
  };

  const handleGenerateProject = () => {
    const title = projectTitle.trim() || 'Production Web System';
    const notes = projectNotes.trim() || 'Built with React, Node.js, and database';

    setGeneratedProject({
      title,
      tag: 'React · Node.js · Database',
      description: `A full-stack production platform (${title}) featuring responsive user interface, RESTful backend APIs, and cloud database persistence. (${notes})`,
      highlights: [
        `Architected a responsive multi-page web application using modern frontend & backend components`,
        `Built secure admin authentication and RESTful API endpoints with data validation`,
        `Integrated cloud database persistence and optimized query performance for real-time usage`,
      ],
      tech: ['React', 'Node.js', 'Express', 'SQL', 'Vite', 'Tailwind CSS'],
    });
  };

  return (
    <div className="upgrade-overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <section className="upgrade-modal" style={{ maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="auth-close" onClick={onClose} aria-label="Close">×</button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ background: '#a3e63522', color: '#a3e635', border: '1px solid #a3e63544', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>
            PRO AI ASSISTANT ✦
          </span>
          <span style={{ color: '#9ca3af', fontSize: 12 }}>Student & Developer Content Studio</span>
        </div>

        <h2 style={{ fontSize: 24, margin: '4px 0 12px' }}>AI Portfolio & Resume Content Writer</h2>
        <p style={{ color: '#9ca3af', fontSize: 13.5, marginBottom: 16 }}>
          Select a role or describe your project. We'll generate high-impact English descriptions and ATS bullet points.
        </p>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #2a2a2a', paddingBottom: 12, marginBottom: 16 }}>
          <button
            className={`bv2-tab${activeTab === 'hero' ? ' active' : ''}`}
            onClick={() => setActiveTab('hero')}
            style={{ fontSize: 13 }}
          >
            👤 Hero Bio & Headline Generator
          </button>
          <button
            className={`bv2-tab${activeTab === 'project' ? ' active' : ''}`}
            onClick={() => setActiveTab('project')}
            style={{ fontSize: 13 }}
          >
            ◈ Project Case Study Refiner
          </button>
        </div>

        {/* TAB 1: Hero & Bio */}
        {activeTab === 'hero' && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>Select Your Target Role / Domain:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ROLE_PRESETS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setSelectedRole(r); setGeneratedBios(PRESET_BIOS[r] || PRESET_BIOS['Full-Stack Developer']); }}
                    style={{
                      fontSize: 12,
                      padding: '5px 10px',
                      borderRadius: 6,
                      border: selectedRole === r ? '1px solid #a3e635' : '1px solid #2a2a2a',
                      background: selectedRole === r ? '#182410' : '#141414',
                      color: selectedRole === r ? '#a3e635' : '#d1d5db',
                      cursor: 'pointer',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Add Your Specific Background / Skills (Optional Hindi/English notes):</label>
              <input
                type="text"
                placeholder="e.g. DU CS student, built Ezra compiler, Next.js, Supabase, Zenodo research"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: '#111', border: '1px solid #2a2a2a', borderRadius: 6, color: '#fff', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>

            <button className="button button-lime" onClick={handleGenerateBio} style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
              ⚡ Generate Tailored Options →
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {generatedBios.map((bio, idx) => (
                <div key={idx} style={{ background: '#121410', border: '1px solid #25331c', borderRadius: 10, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <strong style={{ color: '#a3e635', fontSize: 14 }}>{bio.role}</strong>
                    <button
                      className="button button-outline"
                      style={{ padding: '3px 8px', fontSize: 11, borderColor: '#a3e635', color: '#a3e635' }}
                      onClick={() => {
                        onApplyToHero?.(bio);
                        onClose();
                      }}
                    >
                      ✓ Apply to Portfolio Hero
                    </button>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: 12.5, color: '#d1d5db', fontStyle: 'italic' }}>"{bio.tagline}"</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#9ca3af', lineHeight: 1.4 }}>{bio.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Project Refiner */}
        {activeTab === 'project' && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Project Title:</label>
              <input
                type="text"
                placeholder="e.g. Ezra Scripting Language / Coaching Center Portal"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: '#111', border: '1px solid #2a2a2a', borderRadius: 6, color: '#fff', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>What did you build? (Paste simple notes in Hindi or English):</label>
              <textarea
                rows={3}
                placeholder="e.g. ek library admission system banaya nodejs express se student photo upload bhi kar sakte hain aur admin verification dashboard hai"
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: '#111', border: '1px solid #2a2a2a', borderRadius: 6, color: '#fff', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>

            <button className="button button-lime" onClick={handleGenerateProject} style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
              ⚡ Refine into ATS Engineering Project Case Study →
            </button>

            {generatedProject && (
              <div style={{ background: '#121410', border: '1px solid #25331c', borderRadius: 10, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ margin: 0, color: '#ffffff', fontSize: 16 }}>{generatedProject.title}</h3>
                  <button
                    className="button button-lime"
                    style={{ padding: '4px 10px', fontSize: 11 }}
                    onClick={() => {
                      onApplyToProject?.(generatedProject);
                      onClose();
                    }}
                  >
                    ✓ Apply to Portfolio Projects
                  </button>
                </div>
                <p style={{ color: '#a3e635', fontSize: 12, margin: '0 0 8px', fontFamily: 'DM Mono, monospace' }}>{generatedProject.tag}</p>
                <p style={{ color: '#cbd5e1', fontSize: 13, margin: '0 0 10px', lineHeight: 1.4 }}>{generatedProject.description}</p>

                <div style={{ background: '#090a07', borderRadius: 6, padding: 10, marginBottom: 10 }}>
                  <strong style={{ color: '#a3e635', fontSize: 11, display: 'block', marginBottom: 6 }}>ATS RESUME HIGHLIGHT BULLETS:</strong>
                  <ul style={{ margin: 0, paddingLeft: 16, color: '#9ca3af', fontSize: 12, lineHeight: 1.5 }}>
                    {generatedProject.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          className="button button-outline"
          onClick={onClose}
          style={{ marginTop: 20, width: '100%' }}
        >
          Close AI Assistant
        </button>
      </section>
    </div>
  );
}
