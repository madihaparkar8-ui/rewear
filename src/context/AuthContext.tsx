import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string; location?: string; avatar?: string; bio?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  authHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('rewear_auth_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const authHeaders = (): Record<string, string> => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Initial check with session token
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('rewear_auth_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to authenticate session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('rewear_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const signup = async (payload: { name: string; email: string; password: string; location?: string; avatar?: string; bio?: string }) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    localStorage.setItem('rewear_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('Error logging out:', err);
      }
    }
    localStorage.removeItem('rewear_auth_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!token) throw new Error('Not authenticated');
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    setUser(data.user);
  };

  const isAdmin = Boolean(
    user && (user.role === 'admin' || user.email.toLowerCase() === 'madihaparkar8@gmail.com')
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        signup,
        logout,
        updateProfile,
        authHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
