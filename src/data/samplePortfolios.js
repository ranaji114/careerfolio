import { nanoid } from 'nanoid';

/**
 * Seed portfolio for the Ankur Rana demo.
 * Conforms to the PortfolioData schema defined in design.md.
 * Used as the featured example on the marketing / templates pages.
 */
export const SEED_PORTFOLIO = {
  id: 'ankur-rana-featured',
  ownerId: 'seed-user',
  slug: 'ankur-rana',
  templateId: 'terminal',
  name: 'Ankur Rana',
  role: 'AI-assisted developer, programmer, author & independent researcher.',
  published: true,
  customDomain: null,
  pageOrder: ['home', 'work', 'about', 'contact'],
  pages: {
    home: {
      slug: 'home',
      title: 'Home',
      sections: [
        {
          id: 'seed-hero',
          type: 'hero',
          hidden: false,
          headline: 'Ankur Rana',
          subheadline:
            'AI-assisted developer, programmer, author & independent researcher.',
          avatarUrl: '',
          location: 'New Delhi, India',
          tags: ['Developer', 'Author', 'Researcher'],
          ctaLabel: 'Explore My Work',
          ctaTarget: 'work',
          showStats: true,
          stats: [
            { value: '5', label: 'Systems' },
            { value: '7', label: 'Books' },
            { value: '2', label: 'Zenodo papers' },
          ],
        },
        {
          id: 'seed-skills',
          type: 'skills',
          hidden: false,
          heading: 'Toolkit',
          skills: [
            'Rust',
            'TypeScript',
            'React',
            'Next.js',
            'Supabase',
            'Systems design',
            'Technical writing',
            'Research',
          ],
        },
      ],
    },
    work: {
      slug: 'work',
      title: 'Work',
      sections: [
        {
          id: 'seed-projects',
          type: 'projects',
          hidden: false,
          heading: 'Selected Work',
          projects: [
            {
              id: 'p1',
              title: 'Ezra',
              description:
                'A readable scripting language and developer ecosystem, built from lexer to bytecode VM.',
              tag: 'Rust language runtime',
              imageUrl: '',
              liveDemoUrl: '',
              githubUrl: '',
              featured: true,
              caseStudyContent: '',
            },
            {
              id: 'p2',
              title: 'Shri Krishna Coaching Center',
              description:
                'A full-stack education platform and admissions management portal.',
              tag: 'Next.js · Supabase',
              imageUrl: '',
              liveDemoUrl: '',
              githubUrl: '',
              featured: true,
              caseStudyContent: '',
            },
            {
              id: 'p3',
              title: 'Maa Sarswati Digital Library',
              description:
                'A production study-library platform with student admissions and admin tools.',
              tag: 'React · Express',
              imageUrl: '',
              liveDemoUrl: '',
              githubUrl: '',
              featured: true,
              caseStudyContent: '',
            },
            {
              id: 'p4',
              title: 'Vani',
              description:
                'A full-stack publishing platform for writing professionals.',
              tag: 'MERN · Archived',
              imageUrl: '',
              liveDemoUrl: '',
              githubUrl: '',
              featured: false,
              caseStudyContent: '',
            },
            {
              id: 'p5',
              title: 'Al-Farooq',
              description:
                'An institutional website and centralized management system.',
              tag: 'React · TypeScript',
              imageUrl: '',
              liveDemoUrl: '',
              githubUrl: '',
              featured: false,
              caseStudyContent: '',
            },
          ],
        },
      ],
    },
    about: {
      slug: 'about',
      title: 'About',
      sections: [
        {
          id: 'seed-about',
          type: 'about',
          hidden: false,
          heading: 'About',
          body: 'I build software, author books and conduct independent research. My work spans language runtimes, educational systems, publishing tools and ideas about time, intelligence and reality.',
        },
      ],
    },
    contact: {
      slug: 'contact',
      title: 'Contact',
      sections: [
        {
          id: 'seed-contact',
          type: 'contact',
          hidden: false,
          heading: 'Get in touch',
          email: '',
          linkedin: 'https://www.linkedin.com/in/ankur-rana-45b522312/',
          github: 'https://github.com/ranaji114',
          twitter: '',
          website: 'https://ankur-rana.vercel.app',
        },
      ],
    },
  },
  meta: {
    email: '',
    location: 'New Delhi, India',
    linkedin: 'https://www.linkedin.com/in/ankur-rana-45b522312/',
    github: 'https://github.com/ranaji114',
    twitter: '',
    website: 'https://ankur-rana.vercel.app',
    seoTitle: 'Ankur Rana — Developer, Author & Researcher',
    seoDescription:
      'Portfolio of Ankur Rana — AI-assisted developer, programmer, author & independent researcher based in New Delhi, India.',
  },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};
