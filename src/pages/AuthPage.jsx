import React, { useState } from 'react';

export default function AuthPage({ onAuthenticated, onCancel, defaultSignup = true }) {
  const [isSignup, setIsSignup] = useState(defaultSignup);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password || (isSignup && !name.trim())) {
      return setError('Please complete all required fields.');
    }
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    // onAuthenticated returns error string or null
    const err = onAuthenticated({ isSignup, name, email, password });
    setLoading(false);
    if (err) setError(err);
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <main className="auth-page">
      <div className="auth-art">
        <button className="brand" onClick={onCancel}>
          <span className="brand-star">✦</span> careerfolio
        </button>
        <div>
          <p className="eyebrow">YOUR WORK DESERVES A HOME</p>
          <h1>Let your next<br />opportunity find you.</h1>
          <p>Build a multi-page portfolio that turns your best work into a clear, memorable story — with a visual editor and premium templates.</p>
        </div>
        <span className="auth-star">✦</span>
      </div>

      <section className="auth-card">
        <button className="auth-close" onClick={onCancel} aria-label="Close">×</button>
        <p className="eyebrow">{isSignup ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}</p>
        <h2>{isSignup ? 'Start building for free.' : 'Pick up where you left off.'}</h2>
        <p className="auth-sub">
          {isSignup
            ? 'No card required. Your first portfolio is free.'
            : 'Sign in to manage your portfolios and plan.'}
        </p>

        <form onSubmit={submit} noValidate>
          {isSignup && (
            <label>
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ankur Rana"
                autoComplete="name"
                disabled={loading}
              />
            </label>
          )}
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              disabled={loading}
            />
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="button button-dark auth-submit" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : isSignup ? 'Create my account' : 'Sign in'} {!loading && <span>→</span>}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? 'Already have an account?' : 'New to Careerfolio?'}{' '}
          <button type="button" onClick={switchMode}>
            {isSignup ? 'Sign in' : 'Create an account'}
          </button>
        </p>
        <p className="auth-local-note">
          Preview mode stores accounts in this browser only.
        </p>
      </section>
    </main>
  );
}
