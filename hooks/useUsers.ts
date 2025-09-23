'use client';

import { useState, useCallback, useEffect } from 'react';
import mongoose from 'mongoose';
import { User } from '@/types';
import { UserModel, hashPassword } from '@/lib/mongodb';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// MongoDB document interface for User
interface MongoUserDocument {
  _id: mongoose.Types.ObjectId;
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
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
      const users = await UserModel.find().sort({ createdAt: -1 }).lean() as unknown as MongoUserDocument[];

      const formattedUsers: User[] = users.map(user => ({
        _id: user._id.toString(),
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role as User['role'],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      setState(prev => ({
        ...prev,
        users: formattedUsers,
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
    role: 'ADMIN' | 'USER';
  }): Promise<User | null> => {
    try {
      const hashedPassword = await hashPassword(userData.password);

      const newUser = await UserModel.create({
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      }) as unknown as MongoUserDocument;

      const formattedUser: User = {
        _id: newUser._id.toString(),
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role as User['role'],
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };

      setState(prev => ({
        ...prev,
        users: [formattedUser, ...prev.users],
      }));

      return formattedUser;
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
    role: 'ADMIN' | 'USER';
  }>): Promise<User | null> => {
    try {
      const updateData = { ...userData, updatedAt: new Date() } as {
        name?: string;
        email?: string;
        password?: string;
        role?: 'ADMIN' | 'USER';
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
      ).lean() as unknown as MongoUserDocument | null;

      if (!updatedUser) {
        throw new Error('User not found');
      }

      const formattedUser: User = {
        _id: updatedUser._id.toString(),
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        password: updatedUser.password,
        role: updatedUser.role as User['role'],
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };

      setState(prev => ({
        ...prev,
        users: prev.users.map(user =>
          user.id === id ? formattedUser : user
        ),
      }));

      return formattedUser;
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
      const result = await UserModel.findOneAndDelete({ id }) as unknown as MongoUserDocument | null;

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

  const getUsersByRole = useCallback((role: 'ADMIN' | 'USER'): User[] => {
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
