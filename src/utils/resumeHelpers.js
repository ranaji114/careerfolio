// Resume data management, 2-way sync helpers, and ATS Score analyzer
import { nanoid } from 'nanoid';
import { BLOCK_TYPES } from '../data/defaultPortfolio';

export function extractPortfolioDataForResume(portfolio) {
  const homeBlocks = portfolio?.pages?.home?.blocks || [];
  const workBlocks = portfolio?.pages?.work?.blocks || [];
  const aboutBlocks = portfolio?.pages?.about?.blocks || [];
  const contactBlocks = portfolio?.pages?.contact?.blocks || [];

  const allBlocks = [...homeBlocks, ...workBlocks, ...aboutBlocks, ...contactBlocks];

  // Hero info
  const hero = allBlocks.find((b) => b.type === BLOCK_TYPES.HERO) || {};
  const contact = allBlocks.find((b) => b.type === BLOCK_TYPES.CONTACT) || {};
  const about = allBlocks.find((b) => b.type === BLOCK_TYPES.ABOUT) || {};
  const projectsBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.PROJECTS) || {};
  const skillsBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.SKILLS) || {};
  const timelineBlock = allBlocks.find((b) => b.type === BLOCK_TYPES.TIMELINE) || {};

  // Extract skills flat list
  const skillList = [];
  if (skillsBlock?.categories) {
    skillsBlock.categories.forEach((cat) => {
      if (Array.isArray(cat.items)) {
        skillList.push(...cat.items);
      }
    });
  }

  // Extract projects
  const projects = (projectsBlock?.projects || []).map((p) => ({
    id: p.id || nanoid(6),
    title: p.title || 'Untitled Project',
    tagline: p.tag || p.description || '',
    bullets: p.highlights && p.highlights.length > 0 
      ? p.highlights 
      : [p.description || 'Developed production software with modern architecture.'],
    tech: Array.isArray(p.tech) ? p.tech : [],
    link: p.demo || p.github || '',
    github: p.github || '',
  }));

  // Extract experience from timeline if present, or provide sensible defaults
  const timelineItems = timelineBlock?.items || [];
  const experience = timelineItems.length > 0
    ? timelineItems.map((item) => ({
        id: item.id || nanoid(6),
        company: item.organization || item.place || 'Tech Organization',
        role: item.title || item.role || 'Software Engineer',
        period: item.year || item.period || '2023 - Present',
        location: item.location || 'Remote',
        bullets: item.description 
          ? [item.description] 
          : ['Engineered key full-stack systems and delivered scalable services.'],
      }))
    : [
        {
          id: nanoid(6),
          company: 'Independent Systems & Open Source',
          role: hero.role?.split(',')[0] || 'Software Engineer / Architect',
          period: '2023 - Present',
          location: hero.location || 'Remote',
          bullets: [
            'Architected distributed web applications and optimized database queries, reducing response times by 35%.',
            'Designed reusable component libraries and RESTful/GraphQL APIs deployed to serverless environments.',
            'Collaborated with clients and stakeholders to translate complex technical requirements into production software.',
          ],
        },
      ];

  const education = [
    {
      id: nanoid(6),
      institution: 'State University of Technology',
      degree: 'Bachelor of Technology (B.Tech)',
      field: 'Computer Science & Engineering',
      period: '2020 - 2024',
      grade: 'First Class with Distinction',
      location: hero.location || 'India',
    },
  ];

  return {
    templateId: 'ats-classic',
    personal: {
      name: hero.name || 'Your Full Name',
      role: hero.role || 'Senior Full-Stack Engineer',
      email: hero.email || contact.email || 'developer@example.com',
      phone: '+91 98765 43210',
      location: hero.location || 'New Delhi, India',
      website: `careerfolio.me/${portfolio.slug || 'portfolio'}`,
      github: contact.links?.find((l) => l.label?.toLowerCase().includes('github'))?.url || 'github.com/developer',
      linkedin: contact.links?.find((l) => l.label?.toLowerCase().includes('linkedin'))?.url || 'linkedin.com/in/developer',
    },
    summary: about.body || 'Results-driven developer with deep expertise in systems programming, web architectures, and high-performance user interfaces. Proven track record building end-to-end applications from inception to cloud production.',
    skills: skillList.length > 0 ? skillList : ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Rust', 'PostgreSQL', 'Docker', 'Git'],
    experience,
    projects: projects.slice(0, 4),
    education,
    certifications: [
      { id: nanoid(6), name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2025' },
    ],
    settings: {
      fontSize: 'normal', // 'compact' | 'normal' | 'spacious'
      margins: 'normal',
      showPhoto: false,
      showCertifications: true,
      showProjects: true,
      customAccent: '#0284c7',
    },
  };
}

export function ensureResumeData(portfolio) {
  if (!portfolio) return null;
  if (!portfolio.resume) {
    return {
      ...portfolio,
      resume: extractPortfolioDataForResume(portfolio),
    };
  }
  return portfolio;
}

// ─── ATS Score Calculator ───────────────────────────────────────────────────
// Computes an algorithmic ATS Readiness Score (0 - 100) with diagnostic tips
export function computeATSScore(resumeData) {
  if (!resumeData) return { score: 0, criteria: [] };

  const p = resumeData.personal || {};
  const exp = resumeData.experience || [];
  const projs = resumeData.projects || [];
  const skills = resumeData.skills || [];
  const summary = resumeData.summary || '';

  const criteria = [
    {
      name: 'Contact details completeness',
      weight: 15,
      passed: Boolean(p.name && p.email && p.location && (p.github || p.linkedin)),
      hint: 'Include full name, reachable email, location, and GitHub/LinkedIn link.',
    },
    {
      name: 'Professional summary quality',
      weight: 15,
      passed: summary.length >= 80,
      hint: 'Write a strong 2-3 sentence summary showcasing your specialization and years of experience.',
    },
    {
      name: 'Skills density & keywords',
      weight: 20,
      passed: skills.length >= 6,
      hint: 'List at least 6-8 core technical skills relevant to your domain.',
    },
    {
      name: 'Experience & Action verbs',
      weight: 25,
      passed: exp.length > 0 && exp.some((e) => (e.bullets || []).some((b) => /architect|engineer|develop|implement|design|built|led|optimized|launched/i.test(b))),
      hint: 'Start experience bullet points with strong action verbs (e.g. Architected, Engineered, Optimized).',
    },
    {
      name: 'Quantified metrics & impact',
      weight: 15,
      passed: [...exp, ...projs].some((item) => (item.bullets || []).some((b) => /\d+%|\d+x|\$\d+|\d+k|\b\d+\b/i.test(b))),
      hint: 'Include quantified business metrics (e.g. "improved latency by 35%", "scaled to 10k users").',
    },
    {
      name: 'Featured Projects with Tech Stack',
      weight: 10,
      passed: projs.length >= 2,
      hint: 'Showcase at least 2 distinct production projects with specific technologies named.',
    },
  ];

  const earned = criteria.filter((c) => c.passed).reduce((acc, c) => acc + c.weight, 0);

  let grade = 'Needs Polish';
  let badgeColor = '#ef4444';
  if (earned >= 90) {
    grade = 'Top 1% ATS Ready';
    badgeColor = '#10b981';
  } else if (earned >= 75) {
    grade = 'Strong Recruiter Match';
    badgeColor = '#059669';
  } else if (earned >= 50) {
    grade = 'Good Baseline';
    badgeColor = '#f59e0b';
  }

  return {
    score: earned,
    grade,
    badgeColor,
    criteria,
  };
}
