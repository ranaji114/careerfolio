import { useState, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import { emptyPortfolio, seedPortfolio } from '../data/defaultPortfolio';

function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const [user, setUser] = useState(() => readLocal('cf-user', null));

  const login = useCallback((account) => {
    setUser(account);
    writeLocal('cf-user', account);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('cf-user');
  }, []);

  const register = useCallback((name, email, password) => {
    const accounts = readLocal('cf-accounts', []);
    const normalized = email.trim().toLowerCase();
    if (accounts.some((a) => a.email === normalized)) {
      return { error: 'An account with this email already exists.' };
    }
    const account = {
      id: `u-${nanoid(8)}`,
      name: name.trim(),
      email: normalized,
      password,
      plan: 'free',
      joinedAt: new Date().toISOString(),
    };
    writeLocal('cf-accounts', [...accounts, account]);
    login(account);
    return { account };
  }, [login]);

  const signin = useCallback((email, password) => {
    const accounts = readLocal('cf-accounts', []);
    const account = accounts.find(
      (a) => a.email === email.trim().toLowerCase() && a.password === password
    );
    if (!account) return { error: 'Email or password does not match.' };
    login(account);
    return { account };
  }, [login]);

  const upgradePlan = useCallback((plan) => {
    setUser((prev) => {
      if (!prev) return prev;
      const accounts = readLocal('cf-accounts', []);
      const updated = accounts.map((a) => (a.id === prev.id ? { ...a, plan } : a));
      writeLocal('cf-accounts', updated);
      const updatedUser = { ...prev, plan };
      writeLocal('cf-user', updatedUser);
      return updatedUser;
    });
  }, []);

  return { user, login, logout, register, signin, upgradePlan };
}

// ─── Portfolios ───────────────────────────────────────────────────────────────

export function usePortfolios(userId) {
  // Use a ref to always have the latest portfolios in callbacks without stale closure
  const storageKey = userId ? `cf-portfolios-${userId}` : null;

  const getInitial = () => {
    if (storageKey) {
      const saved = readLocal(storageKey, null);
      if (saved && saved.length > 0) return saved;
      // First time login — seed with example portfolio
      const initial = [seedPortfolio];
      writeLocal(storageKey, initial);
      return initial;
    }
    // Not logged in — show seed portfolio as demo
    return [seedPortfolio];
  };

  const [portfolios, setPortfoliosState] = useState(getInitial);
  const portfoliosRef = useRef(portfolios);

  const setPortfolios = useCallback((list) => {
    portfoliosRef.current = list;
    setPortfoliosState(list);
    if (storageKey) writeLocal(storageKey, list);
  }, [storageKey]);

  // When userId changes (login/logout), reload from storage
  const [prevUserId, setPrevUserId] = useState(userId);
  if (prevUserId !== userId) {
    setPrevUserId(userId);
    const next = getInitial();
    portfoliosRef.current = next;
    // Direct state update during render (safe in React for derived state)
    setPortfoliosState(next);
  }

  const create = useCallback((userData = {}) => {
    const p = emptyPortfolio(userData);
    setPortfolios([...portfoliosRef.current, p]);
    return p.id;
  }, [setPortfolios]);

  const update = useCallback((id, updater) => {
    setPortfolios(
      portfoliosRef.current.map((p) =>
        p.id === id
          ? { ...updater(p), updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, [setPortfolios]);

  const remove = useCallback((id) => {
    setPortfolios(portfoliosRef.current.filter((p) => p.id !== id));
  }, [setPortfolios]);

  const duplicate = useCallback((id) => {
    const original = portfoliosRef.current.find((p) => p.id === id);
    if (!original) return null;
    const copy = {
      ...JSON.parse(JSON.stringify(original)),
      id: nanoid(10),
      slug: original.slug ? `${original.slug}-copy` : '',
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPortfolios([...portfoliosRef.current, copy]);
    return copy.id;
  }, [setPortfolios]);

  const addCustomPortfolio = useCallback((p) => {
    setPortfolios([...portfoliosRef.current, p]);
    return p.id;
  }, [setPortfolios]);

  return { portfolios, create, update, remove, duplicate, addCustomPortfolio };
}
