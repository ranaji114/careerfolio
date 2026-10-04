import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { BLOCK_TYPES, createBlock } from '../../data/defaultPortfolio';
import { templates } from '../../data/templates';

const ROLE_PRESETS = [
  {
    label: 'CS / IT Student (Fresher)',
    defaultRole: 'Computer Science Undergraduate & Full-Stack Developer',
    defaultSkills: 'C++, Java, Python, JavaScript, React, Node.js, SQL, Git, Data Structures, Algorithms, OOP',
    defaultEducation: 'B.Tech in Computer Science & Engineering (2022 - 2026)',
    defaultProjects: '1. Autonomous Task & Workflow Orchestration Engine\n2. Real-time Collaborative Code & Document Editor\n3. High-throughput Campus Placement Portal with Resume Parsing',
    defaultBio: 'Pre-final year engineering student passionate about systems programming, scalable full-stack web applications, and algorithmic problem solving. Winner of inter-college hackathons and active open-source contributor.',
  },
  {
    label: 'Full-Stack Developer (SWE)',
    defaultRole: 'Full-Stack Software Engineer',
    defaultSkills: 'React, TypeScript, Node.js, Express, PostgreSQL, Supabase, Redis, Docker, REST APIs, Tailwind CSS',
    defaultEducation: 'Bachelor of Technology in Computer Science',
    defaultProjects: '1. Cloud-Native Microservices SaaS Platform\n2. Distributed Real-time Analytics & Event Stream Engine\n3. Automated CI/CD Infrastructure & API Gateway',
    defaultBio: 'Software engineer focused on building robust, scalable web products and high-concurrency backend services with modern architectural patterns.',
  },
  {
    label: 'Frontend Specialist (React / Next.js)',
    defaultRole: 'Frontend Engineer & UI Architect',
    defaultSkills: 'React 19, Next.js, TypeScript, Tailwind CSS, Redux Toolkit, Framer Motion, GraphQL, Web Performance',
    defaultEducation: 'Bachelor of Science in Information Technology',
    defaultProjects: '1. Design System & Component Library for Enterprise\n2. High-Performance E-Commerce Web App with 99+ Lighthouse Score\n3. Interactive Financial Dashboard with 60 FPS Charts',
    defaultBio: 'Creative engineer dedicated to crafting fluid, accessible, and delightful digital user interfaces with modern web standards.',
  },
  {
    label: 'AI & Machine Learning Enthusiast',
    defaultRole: 'Machine Learning & Applied AI Engineer',
    defaultSkills: 'Python, PyTorch, TensorFlow, Scikit-Learn, Pandas, NumPy, FastAPI, LangChain, HuggingFace, OpenCV',
    defaultEducation: 'B.Tech in Artificial Intelligence & Data Science',
    defaultProjects: '1. Context-Aware LLM Document Retrieval System\n2. Real-time Computer Vision Edge Inference Pipeline\n3. Predictive Financial Analytics Model with Feature Engineering',
    defaultBio: 'AI researcher and developer passionate about deploying production-ready machine learning pipelines and multimodal neural networks.',
  },
];

export default function AIPortfolioGeneratorModal({
  isOpen = true,
  isPro,
  onGeneratePortfolio,
  onClose,
  onUpgrade,
  initialUser,
  portfolio,
}) {
  const existingHero = portfolio?.pages?.home?.blocks?.find((b) => b.type === BLOCK_TYPES.HERO);

  const [name, setName] = useState(initialUser?.name || existingHero?.name || '');
  const [email, setEmail] = useState(initialUser?.email || existingHero?.email || '');
  const [location, setLocation] = useState(existingHero?.location || 'New Delhi, India (Open to Remote)');
  const [avatar, setAvatar] = useState(existingHero?.avatar || '');
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);

  const currentPreset = ROLE_PRESETS[selectedPresetIdx];

  const [customRole, setCustomRole] = useState(currentPreset.defaultRole);
  const [skills, setSkills] = useState(currentPreset.defaultSkills);
  const [education, setEducation] = useState(currentPreset.defaultEducation);
  const [projectNotes, setProjectNotes] = useState(currentPreset.defaultProjects);
  const [bioNotes, setBioNotes] = useState(currentPreset.defaultBio);
  const [selectedTemplateId, setSelectedTemplateId] = useState(portfolio?.templateId || 'bento');
  const [generating, setGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (idx) => {
    setSelectedPresetIdx(idx);
    const p = ROLE_PRESETS[idx];
    setCustomRole(p.defaultRole);
    setSkills(p.defaultSkills);
    setEducation(p.defaultEducation);
    setProjectNotes(p.defaultProjects);
    setBioNotes(p.defaultBio);
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    setGenerating(true);

    setTimeout(() => {
      const parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);

      // Extract and synthesize projects
      const lines = projectNotes.split('\n').filter((l) => l.trim().length > 0);
      const generatedProjects = (lines.length > 0 ? lines : ['Full-Stack Web App', 'Real-time Backend API', 'Portfolio System']).map((line, idx) => {
        const cleanTitle = line.replace(/^[0-9]+[.\-)]\s*/, '').trim() || `Flagship System #${idx + 1}`;
        return {
          id: nanoid(6),
          title: cleanTitle,
          tag: idx === 0 ? 'Full-Stack Architecture' : idx === 1 ? 'Core Backend / API' : 'Interactive Frontend',
          status: 'LIVE PRODUCTION',
          description: `Engineered ${cleanTitle} with a focus on performance, modular architecture, and seamless user experience.`,
          highlights: [
            `Built core functional modules using ${parsedSkills[idx % parsedSkills.length] || 'modern tech stack'} with robust error handling.`,
            `Implemented secure data flows, structured schemas, and comprehensive unit/integration test coverage.`,
            `Designed intuitive UI/UX with smooth transitions and sub-100ms response benchmarks.`,
          ],
          tech: parsedSkills.slice(idx * 2, idx * 2 + 4).length > 0 ? parsedSkills.slice(idx * 2, idx * 2 + 4) : ['React', 'Node.js', 'PostgreSQL'],
          liveUrl: 'https://example.com',
          githubUrl: 'https://github.com/username/project',
        };
      });

      // Assemble complete 4-Page Portfolio
      const generatedPortfolio = {
        id: portfolio?.id || nanoid(10),
        slug: (name || 'portfolio').toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'my-portfolio',
        templateId: selectedTemplateId,
        published: true,
        createdAt: portfolio?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pages: {
          home: {
            blocks: [
              createBlock(BLOCK_TYPES.HERO, {
                name: name || 'Your Name',
                role: customRole,
                tagline: bioNotes,
                location: location,
                email: email,
                avatar: avatar,
                ctaLabel: 'Explore Projects',
                ctaLink: '/work',
                secondaryLabel: 'Get in Touch',
                showStats: true,
                stats: [
                  { value: `${generatedProjects.length}+`, label: 'Production Builds' },
                  { value: '100%', label: 'Craft & Precision' },
                  { value: '24/7', label: 'Availability' },
                ],
              }),
              createBlock(BLOCK_TYPES.PROJECTS, {
                heading: 'Selected Work',
                subheading: 'Production-grade software systems and interactive applications.',
                projects: generatedProjects.slice(0, 2),
              }),
              createBlock(BLOCK_TYPES.SKILLS, {
                heading: 'Core Competencies',
                categories: [
                  { label: 'Languages & Core', items: parsedSkills.slice(0, 5) },
                  { label: 'Frameworks & Tools', items: parsedSkills.slice(5, 10) },
                ],
              }),
            ],
          },
          work: {
            blocks: [
              createBlock(BLOCK_TYPES.PROJECTS, {
                heading: 'All Engineering Projects',
                subheading: 'Comprehensive case studies, architecture notes, and source code repositories.',
                projects: generatedProjects,
              }),
            ],
          },
          about: {
            blocks: [
              createBlock(BLOCK_TYPES.ABOUT, {
                heading: `About ${name || 'Me'}`,
                body: `${bioNotes}\n\nI am dedicated to writing clean, maintainable code and solving challenging technical problems. Passionate about learning cutting-edge technologies and collaborating on high-impact projects.`,
                highlight: 'Building software with empathy, speed, and uncompromising quality.',
              }),
              createBlock(BLOCK_TYPES.TIMELINE, {
                heading: 'Education & Career Timeline',
                items: [
                  {
                    year: '2024 - Present',
                    role: customRole,
                    company: 'Independent Builder & Open Source',
                    description: 'Architecting full-stack web platforms, libraries, and student engineering tools.',
                  },
                  {
                    year: '2021 - 2025',
                    role: education || 'Undergraduate Degree in Engineering',
                    company: 'University Engineering Department',
                    description: 'Specialization in Software Engineering, Data Structures, and Cloud Computing.',
                  },
                ],
              }),
            ],
          },
          contact: {
            blocks: [
              createBlock(BLOCK_TYPES.CONTACT, {
                heading: "Let's Build Something Together",
                body: `I am currently available for internships, contract builds, and full-time roles. Feel free to reach out directly via email or message.`,
                email: email,
                links: [
                  { label: 'GitHub', url: 'https://github.com' },
                  { label: 'LinkedIn', url: 'https://linkedin.com' },
                ],
              }),
              createBlock(BLOCK_TYPES.CONTACT_FORM, {
                heading: 'Send a Message',
                buttonLabel: 'Transmit Message',
              }),
            ],
          },
        },
        resume: {
          name: name || 'Your Name',
          role: customRole,
          email: email || '',
          phone: '+91 98765 43210',
          location: location || 'India',
          summary: bioNotes,
          skills: parsedSkills,
          experience: [
            {
              id: nanoid(6),
              company: 'Independent Projects & Open Source',
              role: customRole,
              period: '2024 - Present',
              bullets: [
                `Developed ${generatedProjects[0]?.title || 'production web application'} with modern component architecture.`,
                `Engineered robust RESTful backend APIs with schema validation and automated deployments.`,
              ],
            },
          ],
          education: [
            {
              id: nanoid(6),
              school: 'University Engineering Department',
              degree: education || 'B.Tech in Computer Science',
              year: '2021 - 2025',
              gpa: '8.8 / 10.0',
            },
          ],
          projects: generatedProjects.map((gp) => ({
            id: gp.id,
            title: gp.title,
            tagline: gp.tag,
            bullets: gp.highlights,
            tech: gp.tech,
            link: gp.liveUrl,
            github: gp.githubUrl,
          })),
        },
      };

      onGeneratePortfolio(generatedPortfolio);
      setGenerating(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="upgrade-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ zIndex: 100000 }}
    >
      <div
        className="ai-modal-card"
        style={{
          maxWidth: 780,
          width: '94%',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0f172a',
          color: '#f8fafc',
          borderRadius: 20,
          border: '1px solid #334155',
          padding: 32,
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <span style={{ color: '#38bdf8', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>
              ⚡ 1-CLICK AI PORTFOLIO & ATS RESUME ENGINE
            </span>
            <h2 style={{ color: '#f8fafc', margin: '4px 0 6px', fontSize: 24 }}>
              Generate Full 4-Page Website & Resume
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>
              Specially optimized for students, freshers & developers. Fills all pages with rich, professional content.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        {/* Persona Presets */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ display: 'block', color: '#cbd5e1', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            ✦ Choose Persona / Student Preset
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
            {ROLE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(idx)}
                style={{
                  background: selectedPresetIdx === idx ? '#1e293b' : '#090d16',
                  color: selectedPresetIdx === idx ? '#38bdf8' : '#94a3b8',
                  border: `1px solid ${selectedPresetIdx === idx ? '#38bdf8' : '#1e293b'}`,
                  borderRadius: 8,
                  padding: '8px 10px',
                  fontSize: 12,
                  fontWeight: selectedPresetIdx === idx ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Photo Upload Row */}
          <div style={{ background: '#1e293b', padding: 16, borderRadius: 12, border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            {avatar ? (
              <img
                src={avatar}
                alt="Uploaded profile"
                style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
              />
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0f172a', border: '1px dashed #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                📷
              </div>
            )}
            <div style={{ flex: 1, minWidth: 200 }}>
              <strong style={{ color: '#f8fafc', fontSize: 14, display: 'block' }}>Profile Photo</strong>
              <span style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 8 }}>
                Upload your picture from your computer to feature on the homepage.
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ background: '#38bdf8', color: '#0f172a', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  📁 Choose File from PC
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarFile} />
                </label>
                {avatar && (
                  <button type="button" onClick={() => setAvatar('')} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>
                    ✕ Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ankur Rana"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ankur@careerfolio.me"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Professional Title / Headline</label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Education / University</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 13 }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Skills & Toolkit (Comma Separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Projects / Raw Notes (AI will format each into a complete case study)
            </label>
            <textarea
              rows={3}
              value={projectNotes}
              onChange={(e) => setProjectNotes(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 13, resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Bio & Career Objective
            </label>
            <textarea
              rows={2}
              value={bioNotes}
              onChange={(e) => setBioNotes(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 13, resize: 'vertical' }}
            />
          </div>

          {/* Template Choice */}
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
              Select Visual Design Template
            </label>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
              {templates.slice(0, 8).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(t.id)}
                  style={{
                    background: t.bg,
                    color: t.ink,
                    border: `2px solid ${selectedTemplateId === t.id ? t.accent : '#334155'}`,
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ color: t.accent, marginRight: 6 }}>●</span>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)',
              color: '#0f172a',
              border: 'none',
              padding: '14px',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 800,
              cursor: generating ? 'not-allowed' : 'pointer',
              marginTop: 10,
              boxShadow: '0 10px 25px rgba(56, 189, 248, 0.3)',
            }}
          >
            {generating ? '⚡ Synthesizing 4-Page Portfolio & ATS Resume...' : '⚡ Generate Full Multi-Page Portfolio ✦'}
          </button>
        </div>
      </div>
    </div>
  );
}
