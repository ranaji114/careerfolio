import { nanoid } from 'nanoid';

export const SECTION_TYPES = [
  'hero',
  'projects',
  'skills',
  'about',
  'books',
  'research',
  'stats',
  'contact',
  'custom',
];

/**
 * Factory function that returns a fully-populated default SectionData object
 * for the given section type. Every field has a sensible default — no undefined
 * values — so the section is immediately serialisable and renderable.
 *
 * @param {string} type - One of the SECTION_TYPES values
 * @returns {object} A complete SectionData object with a fresh nanoid
 */
export function createDefaultSection(type) {
  switch (type) {
    case 'hero':
      return {
        id: nanoid(),
        type: 'hero',
        hidden: false,
        headline: 'Your name here',
        subheadline: 'Your professional headline goes here.',
        avatarUrl: '',
        location: 'Available worldwide',
        tags: ['Professional', 'Available for work'],
        ctaLabel: 'View my work',
        ctaTarget: 'work',
        showStats: false,
        stats: [{ value: '0', label: 'Projects' }],
      };

    case 'projects':
      return {
        id: nanoid(),
        type: 'projects',
        hidden: false,
        heading: 'Selected Work',
        projects: [
          {
            id: nanoid(),
            title: 'Your first project',
            description: 'Add a description of what you built and why it matters.',
            tag: 'Project',
            imageUrl: '',
            liveDemoUrl: '',
            githubUrl: '',
            featured: true,
            caseStudyContent: '',
          },
        ],
      };

    case 'skills':
      return {
        id: nanoid(),
        type: 'skills',
        hidden: false,
        heading: 'Toolkit',
        skills: ['Add your skills here'],
      };

    case 'about':
      return {
        id: nanoid(),
        type: 'about',
        hidden: false,
        heading: 'About',
        body: 'Write a short introduction about yourself and your work.',
      };

    case 'books':
      return {
        id: nanoid(),
        type: 'books',
        hidden: false,
        heading: 'Books',
        books: [
          {
            id: nanoid(),
            title: 'Your book title',
            subtitle: '',
            coverUrl: '',
            description: 'A brief description of what this book is about.',
            purchaseUrl: '',
            year: '',
          },
        ],
      };

    case 'research':
      return {
        id: nanoid(),
        type: 'research',
        hidden: false,
        heading: 'Research',
        papers: [
          {
            id: nanoid(),
            title: 'Paper title',
            abstract: 'A brief abstract of your research.',
            publishedAt: '',
            doiUrl: '',
            pdfUrl: '',
            tags: [],
          },
        ],
      };

    case 'stats':
      return {
        id: nanoid(),
        type: 'stats',
        hidden: false,
        heading: '',
        stats: [
          { value: '0', label: 'Projects' },
          { value: '0', label: 'Years' },
        ],
      };

    case 'contact':
      return {
        id: nanoid(),
        type: 'contact',
        hidden: false,
        heading: 'Get in touch',
        email: '',
        linkedin: '',
        github: '',
        twitter: '',
        website: '',
      };

    case 'custom':
      return {
        id: nanoid(),
        type: 'custom',
        hidden: false,
        heading: 'Custom Section',
        body: 'Add your content here.',
      };

    default:
      throw new Error(`createDefaultSection: unknown section type "${type}"`);
  }
}
