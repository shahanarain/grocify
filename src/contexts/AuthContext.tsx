'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const DEMO_EMAIL = 'demo@grocify.com';
const DEMO_PASSWORD = 'GrocifyDemo2026!';
const DEMO_TOKEN = 'demo-token-grocify-user-123';
const SESSION_KEY = 'grocify-demo-session';

export interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  photoURL: string | null;
  getIdToken: (_forceRefresh?: boolean) => Promise<string>;
  reload: () => Promise<void>;
}

interface AuthContextType {
  user: DemoUser | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: (name?: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const createDemoUser = (name = 'Demo User', email = DEMO_EMAIL): DemoUser => ({
  uid: 'demo-user-1',
  email,
  displayName: name,
  emailVerified: true,
  photoURL: null,
  getIdToken: async () => DEMO_TOKEN,
  reload: async () => {},
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const session = JSON.parse(saved) as { name?: string; email?: string };
        setUser(createDemoUser(session.name, session.email));
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginAsDemo = async (name = 'Demo User', email = DEMO_EMAIL) => {
    const demoUser = createDemoUser(name, email);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email }));
    setUser(demoUser);
  };

  const login = async (email: string, password: string) => {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new Error('Invalid demo username or password. Use the credentials shown on this page.');
    }
    await loginAsDemo();
  };

  const signup = async () => {
    throw new Error('Sign-up is disabled in demo mode. Use the demo credentials on the sign-in page.');
  };

  const loginWithGoogle = async () => {
    throw new Error('Google sign-in is unavailable in demo mode. Use the demo credentials.');
  };

  const logout = async () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
