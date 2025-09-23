/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback } from 'react';
import mongoose from 'mongoose';
import { DashboardStats, Order, OrderItem, ShippingAddress } from '@/types';
import { UserModel, ProductModel, OrderModel } from '@/lib/mongodb';

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

// MongoDB document interface for Order (dashboard context)
interface MongoOrderDocument {
  _id: mongoose.Types.ObjectId;
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: string;
  shippingAddress: any;
  createdAt: Date;
  updatedAt: Date;
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

      const recentOrders = await OrderModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean() as unknown as MongoOrderDocument[];

      const stats: DashboardStats = {
        totalUsers,
        totalProducts,
        totalOrders,
        totalAllocations: 0,
        recentAllocations: [],
        recentOrders: recentOrders.map((order) => ({
          _id: order._id.toString(),
          id: order.id,
          userId: order.userId,
          items: order.items as OrderItem[],
          total: order.total,
          status: order.status as Order['status'],
          shippingAddress: order.shippingAddress as ShippingAddress,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }))
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
