/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Order, OrderItem, ShippingAddress } from '@/types';
import { OrderModel } from '@/lib/dummydata';

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export function useOrders() {
  const [state, setState] = useState<OrdersState>({
    orders: [],
    loading: false,
    error: null,
  });

  const fetchOrders = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const orders = await OrderModel.find();

      setState(prev => ({
        ...prev,
        orders,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
      }));
    }
  }, []);

  const createOrder = useCallback(async (orderData: {
    userId: string;
    items: OrderItem[];
    total: number;
    shippingAddress: ShippingAddress;
  }): Promise<Order | null> => {
    try {
      const newOrder = await OrderModel.create({
        id: `order-${Date.now()}`,
        ...orderData,
      });

      setState(prev => ({
        ...prev,
        orders: [newOrder, ...prev.orders],
      }));

      return newOrder;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create order',
      }));
      return null;
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: Order['status']): Promise<Order | null> => {
    try {
      const updatedOrder = await OrderModel.findOneAndUpdate(
        { id },
        { status, updatedAt: new Date() },
        { new: true }
      );

      if (!updatedOrder) {
        throw new Error('Order not found');
      }

      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order =>
          order.id === id ? updatedOrder : order
        ),
      }));

      return updatedOrder;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update order',
      }));
      return null;
    }
  }, []);

  const getUserOrders = useCallback((userId: string): Order[] => {
    return state.orders.filter(order => order.userId === userId);
  }, [state.orders]);

  const getOrderById = useCallback((id: string): Order | undefined => {
    return state.orders.find(order => order.id === id);
  }, [state.orders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    ...state,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    getUserOrders,
    getOrderById,
  };
}
