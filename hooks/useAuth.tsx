'use client';

import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { AuthUser, RegisterData, LoginCredentials } from '@/types';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
  });

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const authUser: AuthUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        };

        setState(prev => ({
          ...prev,
          user: authUser,
          loading: false,
        }));

        // Store in localStorage for persistence across page refreshes
        localStorage.setItem('user', JSON.stringify(authUser));

        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.message || 'Login failed',
        }));
        return false;
      }
    } catch {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Network error. Please try again.',
      }));
      return false;
    }
  }, []);

  const register = useCallback(async (userData: RegisterData): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const authUser: AuthUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        };

        setState(prev => ({
          ...prev,
          user: authUser,
          loading: false,
        }));

        // Store in localStorage for persistence across page refreshes
        localStorage.setItem('user', JSON.stringify(authUser));

        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.message || 'Registration failed',
        }));
        return false;
      }
    } catch {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Network error. Please try again.',
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (_error) {
      console.error('Logout error:', _error);
    } finally {
      setState(prev => ({
        ...prev,
        user: null,
      }));
      localStorage.removeItem('user');
    }
  }, []);

  const hasRole = useCallback((roles: string[]): boolean => {
    return state.user ? roles.includes(state.user.role) : false;
  }, [state.user]);

  // Check for existing session on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: AuthUser = JSON.parse(storedUser);
        setState(prev => ({
          ...prev,
          user,
        }));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    isAuthenticated: !!state.user,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
