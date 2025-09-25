'use client';

import { useState, useCallback, useEffect } from 'react';
import { User } from '@/types';
import { UserModel, hashPassword } from '@/lib/mongodb';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export function useUsers() {
  const [state, setState] = useState<UsersState>({
    users: [],
    loading: false,
    error: null,
  });

  const fetchUsers = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const users = await UserModel.find();

      setState(prev => ({
        ...prev,
        users,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      }));
    }
  }, []);

  const createUser = useCallback(async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'USER' | 'SUPERVISOR' | 'STUDENT';
  }): Promise<User | null> => {
    try {
      const hashedPassword = await hashPassword(userData.password);

      const newUser = await UserModel.create({
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });

      setState(prev => ({
        ...prev,
        users: [newUser, ...prev.users],
      }));

      return newUser;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create user',
      }));
      return null;
    }
  }, []);

  const updateUser = useCallback(async (id: string, userData: Partial<{
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'USER' | 'SUPERVISOR' | 'STUDENT';
  }>): Promise<User | null> => {
    try {
      const updateData = { ...userData, updatedAt: new Date() } as {
        name?: string;
        email?: string;
        password?: string;
        role?: 'ADMIN' | 'USER' | 'SUPERVISOR' | 'STUDENT';
        updatedAt: Date;
      };

      // If password is being updated, hash it
      if (userData.password) {
        updateData.password = await hashPassword(userData.password);
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { id },
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      setState(prev => ({
        ...prev,
        users: prev.users.map(user =>
          user.id === id ? updatedUser : user
        ),
      }));

      return updatedUser;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update user',
      }));
      return null;
    }
  }, []);

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await UserModel.findOneAndDelete({ id });

      if (!result) {
        throw new Error('User not found');
      }

      setState(prev => ({
        ...prev,
        users: prev.users.filter(user => user.id !== id),
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete user',
      }));
      return false;
    }
  }, []);

  const getUserById = useCallback((id: string): User | undefined => {
    return state.users.find(user => user.id === id);
  }, [state.users]);

  const getUsersByRole = useCallback((role: 'ADMIN' | 'USER' | 'SUPERVISOR' | 'STUDENT'): User[] => {
    return state.users.filter(user => user.role === role);
  }, [state.users]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    ...state,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getUsersByRole,
  };
}
