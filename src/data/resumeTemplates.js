// Resume template definitions for Careerfolio
export const RESUME_TEMPLATES = [
  // ─── Free Templates (4) ───────────────────────────────────────────────────
  {
    id: 'ats-classic',
    name: 'Harvard ATS Classic',
    badge: 'FREE',
    type: 'Classic ATS',
    tagline: 'Single column, ultra-safe for all corporate ATS algorithms',
    premium: false,
    font: 'serif',
    accent: '#111827',
    layout: 'single-column',
    styleClass: 'rt-classic',
  },
  {
    id: 'modern-tech',
    name: 'Silicon Valley Modern',
    badge: 'FREE',
    type: 'Modern Dev',
    tagline: 'Two-column layout optimized for software engineers & tech leads',
    premium: false,
    font: 'sans',
    accent: '#0284c7',
    layout: 'split',
    styleClass: 'rt-modern-tech',
  },
  {
    id: 'clean-minimal',
    name: 'Clean Minimalist',
    badge: 'FREE',
    type: 'Minimal',
    tagline: 'Quiet typography, generous whitespace, high readability',
    premium: false,
    font: 'sans',
    accent: '#27272a',
    layout: 'single-column',
    styleClass: 'rt-minimal',
  },
  {
    id: 'mono-developer',
    name: 'Monospace Terminal',
    badge: 'FREE',
    type: 'Developer',
    tagline: 'Clean developer-centric monospace headers with structured grid',
    premium: false,
    font: 'mono',
    accent: '#059669',
    layout: 'single-column',
    styleClass: 'rt-mono',
  },

  // ─── Pro Templates (3 Outstanding) ────────────────────────────────────────
  {
    id: 'executive-pro',
    name: 'Executive Elite Pro',
    badge: 'PRO ✦',
    type: 'Executive',
    tagline: 'Bold luxury header with gold accents, metrics callouts & dual-tone typography',
    premium: true,
    font: 'sans',
    accent: '#d97706',
    layout: 'executive-banner',
    styleClass: 'rt-executive-pro',
  },
  {
    id: 'nordic-editorial-pro',
    name: 'Nordic Editorial Pro',
    badge: 'PRO ✦',
    type: 'Design & Tech',
    tagline: 'Swiss-inspired typography, asymmetric metadata & high-contrast badges',
    premium: true,
    font: 'sans',
    accent: '#6366f1',
    layout: 'split-editorial',
    styleClass: 'rt-nordic-pro',
  },
  {
    id: 'matrix-cli-pro',
    name: 'Cyber Hacker CLI Pro',
    badge: 'PRO ✦',
    type: 'Hacker / CLI',
    tagline: 'True terminal hacker resume with bash prompts, prompt badges & green/amber phosphor styling',
    premium: true,
    font: 'mono',
    accent: '#10b981',
    layout: 'cli-terminal',
    styleClass: 'rt-matrix-cli-pro',
  },
];

export const freeResumeTemplateIds = new Set(
  RESUME_TEMPLATES.map((t) => t.id)
);

export function getResumeTemplate(id) {
  return RESUME_TEMPLATES.find((t) => t.id === id) || RESUME_TEMPLATES[0];
}
