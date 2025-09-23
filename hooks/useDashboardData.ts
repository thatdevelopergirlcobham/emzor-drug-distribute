'use client';

import { useState, useCallback, useEffect } from 'react';
import { DashboardStats } from '@/types';
import { UserModel, ProductModel, OrderModel, AllocationModel } from '@/lib/mongodb';

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>({
    stats: null,
    loading: false,
    error: null,
  });

  const fetchDashboardStats = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [totalUsers, totalProducts, totalOrders, totalAllocations] = await Promise.all([
        UserModel.countDocuments(),
        ProductModel.countDocuments(),
        OrderModel.countDocuments(),
        AllocationModel.countDocuments(),
      ]);

      const recentOrders = await OrderModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      const recentAllocations = await AllocationModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      const stats: DashboardStats = {
        totalUsers,
        totalProducts,
        totalOrders,
        totalAllocations,
        recentOrders: recentOrders.map((order: any) => ({
          _id: order._id?.toString(),
          id: order.id,
          userId: order.userId,
          items: order.items,
          total: order.total,
          status: order.status,
          shippingAddress: order.shippingAddress,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        })),
        recentAllocations: recentAllocations.map((allocation: any) => ({
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
        })),
      };

      setState(prev => ({
        ...prev,
        stats,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
      }));
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return {
    ...state,
    fetchDashboardStats,
  };
}
