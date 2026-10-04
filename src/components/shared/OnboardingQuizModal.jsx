import React, { useState } from 'react';
import { createBlock } from '../../data/defaultPortfolio';

const PERSONA_DEFAULTS = {
  Student: {
    templateId: 'canvas',
    blockTypes: ['hero', 'about', 'skills', 'timeline', 'contact'],
  },
  Freelancer: {
    templateId: 'signal',
    blockTypes: ['hero', 'projects', 'skills', 'testimonials', 'contact_form'],
  },
  Developer: {
    templateId: 'obsidian',
    blockTypes: ['hero', 'projects', 'skills', 'stats', 'contact'],
  },
  Creator: {
    templateId: 'orbit',
    blockTypes: ['hero', 'about', 'blog', 'testimonials', 'contact'],
  },
};

export function applyPersonaDefaults(persona, portfolio) {
  const config = PERSONA_DEFAULTS[persona];
  if (!config) return portfolio;
  return {
    ...portfolio,
    templateId: config.templateId,
    pages: {
      ...portfolio.pages,
      home: {
        ...portfolio.pages?.home,
        blocks: config.blockTypes.map((type) => createBlock(type)),
      },
    },
  };
}

const PERSONAS = [
  {
    id: 'Student',
    icon: '🎓',
    title: 'Student / Graduate',
    desc: 'Focus on skills, education journey, timeline, and personal about page.',
    templateName: 'Canvas Minimal',
  },
  {
    id: 'Freelancer',
    icon: '💼',
    title: 'Freelancer / Consultant',
    desc: 'Showcase client work, client testimonials, and a direct inquiry contact form.',
    templateName: 'Signal Editorial',
  },
  {
    id: 'Developer',
    icon: '⚡',
    title: 'Software Developer',
    desc: 'Highlight code projects, technical stack, production stats, and direct contact.',
    templateName: 'Obsidian Dark',
  },
  {
    id: 'Creator',
    icon: '✦',
    title: 'Creator / Writer',
    desc: 'Share articles, blog posts, case studies, audience quotes, and socials.',
    templateName: 'Orbit Cyber',
  },
];

export default function OnboardingQuizModal({ onConfirm }) {
  const [selectedPersona, setSelectedPersona] = useState(null);

  return (
    <div
      className="upgrade-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onConfirm(null)}
    >
      <section className="upgrade-modal" style={{ maxWidth: 540 }}>
        <button
          className="auth-close"
          onClick={() => onConfirm(null)}
          aria-label="Close"
        >
          ×
        </button>
        <p className="eyebrow">WELCOME TO CAREERFOLIO</p>
        <h2 style={{ fontSize: 24, marginBottom: 6 }}>What best describes you?</h2>
        <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 20 }}>
          We'll pre-configure your portfolio layout and template tailored to your goal.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {PERSONAS.map((p) => {
            const selected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPersona(p.id)}
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: selected ? '2px solid #a3e635' : '1px solid #2e2e2e',
                  background: selected ? '#182410' : '#141414',
                  color: '#f0f0f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 20 }}>{p.icon}</span>
                  <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: selected ? '#a3e635' : '#6b7280' }}>
                    {p.templateName}
                  </span>
                </div>
                <strong style={{ fontSize: 15, color: selected ? '#a3e635' : '#ffffff' }}>
                  {p.title}
                </strong>
                <span style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.35 }}>
                  {p.desc}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="button button-lime"
            onClick={() => onConfirm(selectedPersona)}
            disabled={!selectedPersona}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            Get started with {selectedPersona || 'selected setup'} →
          </button>
          <button
            type="button"
            onClick={() => onConfirm(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: 13,
              cursor: 'pointer',
              padding: '6px',
              textDecoration: 'underline',
              textAlign: 'center',
            }}
          >
            Skip for now (use default template)
          </button>
        </div>
      </section>
    </div>
  );
}
