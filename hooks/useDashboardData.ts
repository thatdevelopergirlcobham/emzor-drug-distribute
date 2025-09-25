/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback } from 'react';
import { DashboardStats, Order, OrderItem, ShippingAddress } from '@/types';
import { UserModel, ProductModel, OrderModel } from '@/lib/dummydata';

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
      const [totalUsers, totalProducts, totalOrders] = await Promise.all([
        UserModel.countDocuments(),
        ProductModel.countDocuments(),
        OrderModel.countDocuments(),
      ]);

      const recentOrders = (await OrderModel.find()).slice(0, 5);

      const stats: DashboardStats = {
        totalUsers,
        totalProducts,
        totalOrders,
        totalAllocations: 0,
        recentAllocations: [],
        recentOrders: recentOrders
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

  return {
    ...state,
    fetchDashboardStats,
  };
}
