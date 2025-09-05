"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, User, Auth } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();

  useEffect(() => {
    setAuth(firebaseAuth);
  }, []);

  useEffect(() => {
    if (!auth) return;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);
  
  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) return;
    setLoading(true);
    try {
      // For demo purposes, we'll just pretend to sign in
      // In a real app, you would use signInWithEmailAndPassword(auth, email, password)
      if (email && password) {
         // This is a mock implementation
        const mockUser = {
          uid: 'mock-user-id-' + Math.random().toString(36).substr(2, 9),
          email: email,
          displayName: email.split('@')[0],
        } as User;
        setUser(mockUser);
        router.push('/');
      } else {
        throw new Error("Email and password are required.");
      }
    } catch (error) {
       console.error("Error signing in with email: ", error);
       throw error;
    } finally {
        setLoading(false);
    }
  };
  
  const signOut = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      router.push('/login');
    } catch (error)
    {
      console.error("Error signing out: ", error);
    } finally {
        setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
