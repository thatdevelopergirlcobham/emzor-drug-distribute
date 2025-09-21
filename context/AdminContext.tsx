'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, User, AuthUser, LoginCredentials, ProductFormData } from '@/types';

interface AdminState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
}

interface AdminContextType {
  state: AdminState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  addProduct: (productData: ProductFormData) => Promise<Product>;
  updateProduct: (id: string, productData: ProductFormData) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  isAdmin: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>({
    currentUser: null,
    isAuthenticated: false,
  });

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3001/users');
      const users: User[] = await response.json();

      const user = users.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (user && user.role === 'ADMIN') {
        const authUser: AuthUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };

        setState({
          currentUser: authUser,
          isAuthenticated: true,
        });

        // Store in localStorage for persistence
        localStorage.setItem('adminUser', JSON.stringify(authUser));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setState({
      currentUser: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('adminUser');
  }, []);

  const addProduct = useCallback(async (productData: ProductFormData): Promise<Product> => {
    const response = await fetch('http://localhost:3001/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to add product');
    }

    return response.json();
  }, []);

  const updateProduct = useCallback(async (id: string, productData: ProductFormData): Promise<Product> => {
    const response = await fetch(`http://localhost:3001/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return response.json();
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    const response = await fetch(`http://localhost:3001/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  }, []);

  // Check for existing session on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const user: AuthUser = JSON.parse(storedUser);
        setState({
          currentUser: user,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const value: AdminContextType = {
    state,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    isAdmin: state.isAuthenticated && state.currentUser?.role === 'ADMIN',
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
