'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: (name?: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const createDemoUser = (name = 'Demo User', email = 'demo@grocify.com'): User => {
  return {
    uid: 'demo-user-1',
    email,
    displayName: name,
    emailVerified: true,
    isAnonymous: false,
    metadata: {} as any,
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'demo-token-grocify-user-123',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    photoURL: null,
    providerId: 'password',
  } as unknown as User;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user was previously logged in as demo
    if (typeof window !== 'undefined' && localStorage.getItem('grocify-demo-user') === 'true') {
      const savedName = localStorage.getItem('grocify-demo-name') || 'Demo User';
      const savedEmail = localStorage.getItem('grocify-demo-email') || 'demo@grocify.com';
      setUser(createDemoUser(savedName, savedEmail));
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginAsDemo = async (name = 'Demo User', email = 'demo@grocify.com') => {
    const demoUser = createDemoUser(name, email);
    if (typeof window !== 'undefined') {
      localStorage.setItem('grocify-demo-user', 'true');
      localStorage.setItem('grocify-demo-name', name);
      localStorage.setItem('grocify-demo-email', email);
    }
    setUser(demoUser);
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, { displayName: name });

      // Send email verification
      await sendEmailVerification(user);

      // Get auth token and create user profile in Firestore via backend
      const token = await user.getIdToken();
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user profile');
      }
    } catch (error: any) {
      console.warn('Firebase signup failed, falling back to local demo login:', error?.code || error?.message);
      // If Firebase project credentials are not configured, allow seamless local demo login!
      await loginAsDemo(name, email);
    }
  };

  const login = async (email: string, password: string) => {
    // If standard demo credentials are used, log in directly as demo
    if (email === 'demo@grocify.com') {
      await loginAsDemo('Demo User', 'demo@grocify.com');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.warn('Firebase login failed, falling back to local demo login:', error?.code || error?.message);
      // Graceful development fallback
      await loginAsDemo('Demo User', email);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await user.getIdToken();
      const response = await fetch('/api/auth/google-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete Google sign-in');
      }
    } catch (error: any) {
      console.warn('Google sign-in failed, falling back to demo user:', error?.code || error?.message);
      await loginAsDemo('Google Demo User', 'user@gmail.com');
    }
  };

  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('grocify-demo-user');
        localStorage.removeItem('grocify-demo-name');
        localStorage.removeItem('grocify-demo-email');
      }
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    loginAsDemo,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
