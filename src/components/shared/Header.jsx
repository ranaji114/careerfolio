import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export default function Header({ variant = 'marketing' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (variant === 'workspace') {
    return (
      <header className="topbar">
        <Link className="brand" to="/"><span className="brand-star">✦</span> careerfolio</Link>
        <div className="top-actions">
          {user?.plan === 'free' && (
            <Link className="pro-pill" to="/pricing">Go Pro ✦</Link>
          )}
          <Link className="text-button" to="/dashboard">Dashboard</Link>
          <button className="text-button logout-button" onClick={() => { logout(); navigate('/'); }}>Log out</button>
          <Link className="button button-dark" to="/dashboard">New portfolio <span>+</span></Link>
        </div>
      </header>
    );
  }

  // Marketing variant
  return (
    <header className="topbar topbar-home">
      <Link className="brand" to="/"><span className="brand-star">✦</span> careerfolio</Link>
      <nav className="site-nav">
        <Link to="/templates">Templates</Link>
        <Link to="/features">Features</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/resources">Resources</Link>
      </nav>
      <div className="top-actions">
        {user?.plan === 'free' && (
          <Link className="pro-pill" to="/pricing">Go Pro ✦</Link>
        )}
        {user ? (
          <Link className="text-button" to="/dashboard">My workspace</Link>
        ) : (
          <Link className="text-button" to="/login">Sign in</Link>
        )}
        <Link className="button button-dark" to={user ? '/dashboard' : '/signup'}>
          {user ? 'New portfolio' : 'Create free'} <span>→</span>
        </Link>
      </div>
    </header>
  );
}
