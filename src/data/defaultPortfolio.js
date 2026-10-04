import { nanoid } from 'nanoid';

// Block types supported in the visual editor
export const BLOCK_TYPES = {
  HERO: 'hero',
  ABOUT: 'about',
  PROJECTS: 'projects',
  SKILLS: 'skills',
  STATS: 'stats',
  BOOKS: 'books',
  RESEARCH: 'research',
  CONTACT: 'contact',
  DIVIDER: 'divider',
  QUOTE: 'quote',
  TIMELINE: 'timeline',
  CUSTOM_TEXT: 'custom_text',
  TESTIMONIALS: 'testimonials',
  CONTACT_FORM: 'contact_form',
  BLOG: 'blog',
};

// Default block configs
export function createBlock(type, overrides = {}) {
  const base = { id: nanoid(8), type, visible: true };
  const defaults = {
    [BLOCK_TYPES.HERO]: {
      name: '',
      role: 'Building things that matter.',
      tagline: '',
      location: '',
      email: '',
      avatar: '',
      ctaLabel: 'View my work',
      ctaLink: '/work',
      secondaryLabel: "Let's talk",
      showStats: true,
      stats: [],
    },
    [BLOCK_TYPES.ABOUT]: {
      heading: 'About me',
      body: "I build software, explore ideas, and turn curiosity into working products.",
      highlight: '',
    },
    [BLOCK_TYPES.PROJECTS]: {
      heading: 'Selected Work',
      subheading: 'Production projects with full case studies.',
      projects: [],
    },
    [BLOCK_TYPES.SKILLS]: {
      heading: 'Toolkit',
      categories: [{ label: 'Languages', items: [] }],
    },
    [BLOCK_TYPES.STATS]: {
      stats: [
        { value: '0', label: 'Projects' },
        { value: '0', label: 'Years' },
      ],
    },
    [BLOCK_TYPES.BOOKS]: {
      heading: 'Books',
      subheading: 'Published titles.',
      books: [],
    },
    [BLOCK_TYPES.RESEARCH]: {
      heading: 'Research',
      papers: [],
    },
    [BLOCK_TYPES.CONTACT]: {
      heading: "Let's connect",
      body: "I'm open to collaboration, interesting projects and thoughtful conversations.",
      email: '',
      links: [],
    },
    [BLOCK_TYPES.QUOTE]: {
      text: '',
      attribution: '',
    },
    [BLOCK_TYPES.DIVIDER]: {},
    [BLOCK_TYPES.TIMELINE]: {
      heading: 'Journey',
      items: [],
    },
    [BLOCK_TYPES.CUSTOM_TEXT]: {
      heading: '',
      body: '',
    },
    [BLOCK_TYPES.TESTIMONIALS]: {
      heading: 'Testimonials',
      items: [],
    },
    [BLOCK_TYPES.CONTACT_FORM]: {
      heading: 'Send me a message',
      buttonLabel: 'Send message',
    },
    [BLOCK_TYPES.BLOG]: {
      heading: 'Blog & Case Studies',
      entries: [],
    },
  };
  return { ...base, ...(defaults[type] || {}), ...overrides };
}

export const emptyPortfolio = (userData = {}) => ({
  id: nanoid(10),
  slug: '',
  templateId: 'obsidian',
  published: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  // Multi-page structure
  pages: {
    home: {
      blocks: [
        createBlock(BLOCK_TYPES.HERO, {
          name: userData.name || '',
          email: userData.email || '',
        }),
        createBlock(BLOCK_TYPES.STATS),
        createBlock(BLOCK_TYPES.PROJECTS, { heading: 'Selected Work' }),
        createBlock(BLOCK_TYPES.SKILLS),
      ],
    },
    work: {
      blocks: [
        createBlock(BLOCK_TYPES.PROJECTS, { heading: 'All Projects', subheading: 'Every production system I have built.' }),
      ],
    },
    about: {
      blocks: [
        createBlock(BLOCK_TYPES.ABOUT),
        createBlock(BLOCK_TYPES.TIMELINE),
      ],
    },
    contact: {
      blocks: [
        createBlock(BLOCK_TYPES.CONTACT, {
          email: userData.email || '',
        }),
      ],
    },
  },
});

// Seed portfolio based on Ankur Rana's actual portfolio
export const seedPortfolio = {
  id: 'ankur-rana-featured',
  slug: 'ankur-rana',
  templateId: 'obsidian',
  published: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  pages: {
    home: {
      blocks: [
        createBlock(BLOCK_TYPES.HERO, {
          name: 'Ankur Rana',
          role: 'AI-assisted developer, programmer, author & independent researcher.',
          tagline: 'Software, ideas, and the curiosity to understand how things work.',
          location: 'New Delhi, India',
          email: 'ankur.rana@careerfolio.me',
          ctaLabel: 'Explore my work',
          ctaLink: '/work',
          secondaryLabel: 'Books Vault',
          showStats: true,
          stats: [
            { value: '5', label: 'Systems built' },
            { value: '7', label: 'Published books' },
            { value: '2', label: 'Zenodo papers' },
          ],
        }),
        createBlock(BLOCK_TYPES.PROJECTS, {
          heading: 'Work & Systems',
          subheading: 'Five production systems across compilers, education, study platforms, and the web.',
          projects: [
            {
              id: nanoid(6),
              title: 'Ezra',
              status: 'LIVE',
              description: 'A readable scripting language and developer ecosystem built with Rust. Features its own lexer, parser, AST, compiler, bytecode VM, CLI, and standard library.',
              tag: 'Rust language runtime',
              highlights: ['Complete language pipeline: lexer → parser → AST → bytecode → VM', 'Custom CLI tooling for running, formatting, and linting', 'VS Code extension with syntax highlighting and LSP support'],
              tech: ['Rust', 'TypeScript', 'Next.js', 'Vercel'],
              github: 'https://github.com/ranaji114/Ezra-programming-lang',
              demo: 'https://ezra-programming-lang.vercel.app/',
            },
            {
              id: nanoid(6),
              title: 'Shri Krishna Coaching Center',
              status: 'LIVE',
              description: 'A full-stack education platform and admissions management portal for Classes 6–12.',
              tag: 'Next.js · Supabase',
              highlights: ['Full-stack Next.js App Router with Supabase cloud database', 'Multi-step digital admission form', 'Secure double-field admin portal with SHA-256 encryption'],
              tech: ['Next.js', 'React 19', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vercel'],
              github: 'https://github.com/ranaji114/Shri-Krishna-coaching-center',
              demo: 'https://shri-krishna-coaching-center.vercel.app/',
            },
            {
              id: nanoid(6),
              title: 'Maa Sarswati Digital Library',
              status: 'LIVE',
              description: 'A production study-library platform with student admissions and admin tools backed by Express 5, Supabase PostgreSQL, and Cloudinary.',
              tag: 'React · Express · Supabase',
              highlights: ['Full-stack production: Vercel + Render + Supabase', 'Digital student admission with Multer photo & Aadhaar upload', 'Secure JWT admin dashboard with rate-limited brute-force protection'],
              tech: ['React 19', 'Vite 7', 'Express 5', 'Node.js', 'Supabase', 'Tailwind CSS'],
              github: 'https://github.com/ranaji114/Ma-Sarswati-Digital-Library',
              demo: 'https://ma-sarswati-digital-library-fronten.vercel.app/',
            },
            {
              id: nanoid(6),
              title: 'Vani',
              status: 'ARCHIVED',
              description: 'A Medium-like publishing platform for writing professionals with rich text editor and complete publish/draft workflow.',
              tag: 'MERN · Archived',
              highlights: ['Full authentication with author profiles', 'Rich text editor for long-form writing', 'Complete publish/draft/edit workflow'],
              tech: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
              github: 'https://github.com/ranaji114/Vani-is-for-the-writing-professionals',
              demo: '',
            },
            {
              id: nanoid(6),
              title: 'Al-Farooq',
              status: 'ARCHIVED',
              description: 'A modern educational institution platform with 11-page public portal and dedicated admin management system.',
              tag: 'React · TypeScript · Radix UI',
              highlights: ['Dual-layer: 11-page public site + admin dashboard', 'Centralized admin with Admissions, Gallery, Notices, Staff managers', 'Reusable UI component system with Radix UI'],
              tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Radix UI'],
              github: 'https://github.com/ranaji114/alfarooq',
              demo: '',
            },
          ],
        }),
        createBlock(BLOCK_TYPES.SKILLS, {
          heading: 'Toolkit',
          categories: [
            { label: 'Languages', items: ['Rust', 'TypeScript', 'JavaScript', 'SQL'] },
            { label: 'Frontend', items: ['React', 'Next.js', 'Vite', 'Tailwind CSS'] },
            { label: 'Backend', items: ['Node.js', 'Express', 'Supabase', 'PostgreSQL'] },
            { label: 'Other', items: ['Systems design', 'Technical writing', 'Research'] },
          ],
        }),
      ],
    },
    work: {
      blocks: [
        createBlock(BLOCK_TYPES.PROJECTS, {
          heading: 'All Projects',
          subheading: 'Every production system — with full case studies, architecture notes and engineering highlights.',
          projects: [],
        }),
      ],
    },
    about: {
      blocks: [
        createBlock(BLOCK_TYPES.ABOUT, {
          heading: 'About me',
          body: 'I build software, author books and conduct independent research. My work spans language runtimes, educational systems, publishing tools and ideas about time, intelligence and reality.',
          highlight: 'AI as a development partner, not a replacement for thinking.',
        }),
        createBlock(BLOCK_TYPES.RESEARCH, {
          heading: 'Independent Research',
          papers: [
            {
              id: nanoid(6),
              title: 'A Unified Connectivity Hypothesis for the Origin of Quantum Entanglement',
              venue: 'Zenodo Open Access',
              type: 'Conceptual Physics Hypothesis',
              url: 'https://zenodo.org/records/16827645',
            },
            {
              id: nanoid(6),
              title: 'Temporal Layers: Exploring the Divergence Between Human Perception and Physical Time',
              venue: 'Zenodo Open Access',
              type: 'Interdisciplinary Conceptual Research',
              url: 'https://zenodo.org/records/17274810',
            },
          ],
        }),
        createBlock(BLOCK_TYPES.BOOKS, {
          heading: 'Published Books',
          subheading: '7 published titles spanning reality, time, attention, relationships, and language.',
          books: [
            {
              id: nanoid(6),
              title: 'The Unknowable Reality',
              subtitle: 'The Evolution of Intelligence, Knowledge, and the Limits of Understanding',
              genre: 'Science and Philosophy',
              pages: '169 pages',
              url: 'https://amzn.in/d/06YNVlNC',
            },
            {
              id: nanoid(6),
              title: 'The Architecture of Existence',
              subtitle: 'Systems, Mind, and Foundations of Reality',
              genre: 'Philosophy & Metaphysics',
              pages: 'Kindle Edition',
              url: 'https://amazon.com/author/ankurrana',
            },
            {
              id: nanoid(6),
              title: 'Time & Consciousness',
              subtitle: 'The Divergence Between Human Perception and Physical Flow',
              genre: 'Cognitive Philosophy',
              pages: 'Published Title',
              url: 'https://amazon.com/author/ankurrana',
            },
            {
              id: nanoid(6),
              title: 'Learn Awadhi Heritage',
              subtitle: 'Linguistic Roots, Grammar, and Cultural Continuity',
              genre: 'Linguistics & Heritage',
              pages: 'Cultural Documentation',
              url: 'https://amazon.com/author/ankurrana',
            },
          ],
        }),
      ],
    },
    contact: {
      blocks: [
        createBlock(BLOCK_TYPES.CONTACT, {
          heading: "Let's build something meaningful.",
          body: "I'm interested in building software, exploring language runtimes, researching ideas, and having thoughtful conversations about how things work.",
          email: 'ranaankur68@gmail.com',
          links: [
            { label: 'GitHub', url: 'https://github.com/ranaji114' },
            { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ankur-rana-45b522312/' },
            { label: 'WhatsApp (+91 6389647711)', url: 'https://wa.me/916389647711' },
            { label: 'Official Site', url: 'https://ankur-rana.vercel.app' },
          ],
        }),
      ],
    },
  },
};
