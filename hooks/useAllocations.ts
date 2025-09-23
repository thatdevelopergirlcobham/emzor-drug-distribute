'use client';

import { useState, useCallback, useEffect } from 'react';
import { Allocation } from '@/types';
import { AllocationModel } from '@/lib/mongodb';

interface AllocationsState {
  allocations: Allocation[];
  loading: boolean;
  error: string | null;
}

export function useAllocations() {
  const [state, setState] = useState<AllocationsState>({
    allocations: [],
    loading: false,
    error: null,
  });

  const fetchAllocations = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const allocations = await AllocationModel.find().sort({ createdAt: -1 }).lean();

      const formattedAllocations: Allocation[] = allocations.map((allocation: any) => ({
        _id: allocation._id?.toString(),
        id: allocation.id,
        title: allocation.title,
        description: allocation.description,
        assignedTo: allocation.assignedTo,
        assignedBy: allocation.assignedBy,
        status: allocation.status,
        priority: allocation.priority,
        dueDate: allocation.dueDate,
        createdAt: allocation.createdAt,
        updatedAt: allocation.updatedAt,
      }));

      setState(prev => ({
        ...prev,
        allocations: formattedAllocations,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch allocations',
      }));
    }
  }, []);

  const createAllocation = useCallback(async (allocationData: {
    title: string;
    description: string;
    assignedTo: string;
    assignedBy: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: Date;
  }): Promise<Allocation | null> => {
    try {
      const newAllocation = await AllocationModel.create({
        id: `alloc-${Date.now()}`,
        ...allocationData,
      });

      const formattedAllocation: Allocation = {
        _id: newAllocation._id?.toString(),
        id: newAllocation.id,
        title: newAllocation.title,
        description: newAllocation.description,
        assignedTo: newAllocation.assignedTo,
        assignedBy: newAllocation.assignedBy,
        status: newAllocation.status,
        priority: newAllocation.priority,
        dueDate: newAllocation.dueDate,
        createdAt: newAllocation.createdAt,
        updatedAt: newAllocation.updatedAt,
      };

      setState(prev => ({
        ...prev,
        allocations: [formattedAllocation, ...prev.allocations],
      }));

      return formattedAllocation;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create allocation',
      }));
      return null;
    }
  }, []);

  const updateAllocation = useCallback(async (id: string, allocationData: Partial<{
    title: string;
    description: string;
    status: Allocation['status'];
    priority: Allocation['priority'];
    dueDate: Date;
  }>): Promise<Allocation | null> => {
    try {
      const updateData: any = { ...allocationData, updatedAt: new Date() };

      const updatedAllocation = await AllocationModel.findOneAndUpdate(
        { id },
        updateData,
        { new: true }
      ).lean();

      if (!updatedAllocation) {
        throw new Error('Allocation not found');
      }

      const formattedAllocation: Allocation = {
        _id: updatedAllocation._id?.toString(),
        id: updatedAllocation.id,
        title: updatedAllocation.title,
        description: updatedAllocation.description,
        assignedTo: updatedAllocation.assignedTo,
        assignedBy: updatedAllocation.assignedBy,
        status: updatedAllocation.status,
        priority: updatedAllocation.priority,
        dueDate: updatedAllocation.dueDate,
        createdAt: updatedAllocation.createdAt,
        updatedAt: updatedAllocation.updatedAt,
      };

      setState(prev => ({
        ...prev,
        allocations: prev.allocations.map(allocation =>
          allocation.id === id ? formattedAllocation : allocation
        ),
      }));

      return formattedAllocation;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update allocation',
      }));
      return null;
    }
  }, []);

  const updateAllocationStatus = useCallback(async (id: string, status: Allocation['status']): Promise<Allocation | null> => {
    return updateAllocation(id, { status });
  }, [updateAllocation]);

  const deleteAllocation = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await AllocationModel.findOneAndDelete({ id });

      if (!result) {
        throw new Error('Allocation not found');
      }

      setState(prev => ({
        ...prev,
        allocations: prev.allocations.filter(allocation => allocation.id !== id),
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete allocation',
      }));
      return false;
    }
  }, []);

  const getAllocationById = useCallback((id: string): Allocation | undefined => {
    return state.allocations.find(allocation => allocation.id === id);
  }, [state.allocations]);

  const getAllocationsByUser = useCallback((userId: string): Allocation[] => {
    return state.allocations.filter(allocation => allocation.assignedTo === userId);
  }, [state.allocations]);

  const getAllocationsBySupervisor = useCallback((supervisorId: string): Allocation[] => {
    return state.allocations.filter(allocation => allocation.assignedBy === supervisorId);
  }, [state.allocations]);

  const getAllocationsByStatus = useCallback((status: Allocation['status']): Allocation[] => {
    return state.allocations.filter(allocation => allocation.status === status);
  }, [state.allocations]);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  return {
    ...state,
    fetchAllocations,
    createAllocation,
    updateAllocation,
    updateAllocationStatus,
    deleteAllocation,
    getAllocationById,
    getAllocationsByUser,
    getAllocationsBySupervisor,
    getAllocationsByStatus,
  };
}
