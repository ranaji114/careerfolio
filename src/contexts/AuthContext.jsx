import React, { createContext, useContext, useState, useEffect } from 'react';

function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readLocal('careerfolio-session', null));

  // Persist session whenever user changes
  useEffect(() => {
    if (user) localStorage.setItem('careerfolio-session', JSON.stringify(user));
    else localStorage.removeItem('careerfolio-session');
  }, [user]);

  function signup(name, email, password) {
    if (!name?.trim() || !email?.trim() || !password) {
      return { success: false, error: 'Please complete all required fields.' };
    }
    const accounts = readLocal('careerfolio-accounts', []);
    const normalized = email.trim().toLowerCase();
    if (accounts.some(a => a.email === normalized)) {
      return { success: false, error: 'An account with this email already exists. Sign in instead.' };
    }
    const account = {
      id: 'u-' + Date.now(),
      name: name.trim(),
      email: normalized,
      password,
      plan: 'free',
      joinedAt: new Date().toISOString(),
    };
    localStorage.setItem('careerfolio-accounts', JSON.stringify([...accounts, account]));
    setUser(account);
    return { success: true, error: null };
  }

  function login(email, password) {
    if (!email?.trim() || !password) {
      return { success: false, error: 'Please complete all required fields.' };
    }
    const accounts = readLocal('careerfolio-accounts', []);
    const normalized = email.trim().toLowerCase();
    const account = accounts.find(a => a.email === normalized && a.password === password);
    if (!account) {
      return { success: false, error: 'That email or password does not match an account.' };
    }
    setUser(account);
    return { success: true, error: null };
  }

  function logout() {
    setUser(null);
  }

  function upgradeToPro() {
    if (!user) return;
    const updatedUser = { ...user, plan: 'pro' };
    // Update in accounts list too
    const accounts = readLocal('careerfolio-accounts', []);
    const updatedAccounts = accounts.map(a => a.id === user.id ? updatedUser : a);
    localStorage.setItem('careerfolio-accounts', JSON.stringify(updatedAccounts));
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, upgradeToPro }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
