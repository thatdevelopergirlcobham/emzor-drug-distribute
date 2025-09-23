/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback, useEffect } from 'react';
import mongoose from 'mongoose';
import { Order, OrderItem, ShippingAddress } from '@/types';
import { OrderModel } from '@/lib/mongodb';

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

// MongoDB document interface for Order
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

export function useOrders() {
  const [state, setState] = useState<OrdersState>({
    orders: [],
    loading: false,
    error: null,
  });

  const fetchOrders = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const orders = await OrderModel.find().sort({ createdAt: -1 }).lean() as unknown as MongoOrderDocument[];

      const formattedOrders: Order[] = orders.map(order => ({
        _id: order._id.toString(),
        id: order.id,
        userId: order.userId,
        items: order.items as OrderItem[],
        total: order.total,
        status: order.status as Order['status'],
        shippingAddress: order.shippingAddress as ShippingAddress,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }));

      setState(prev => ({
        ...prev,
        orders: formattedOrders,
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
      }) as MongoOrderDocument;

      const formattedOrder: Order = {
        _id: newOrder._id.toString(),
        id: newOrder.id,
        userId: newOrder.userId,
        items: newOrder.items as OrderItem[],
        total: newOrder.total,
        status: newOrder.status as Order['status'],
        shippingAddress: newOrder.shippingAddress as ShippingAddress,
        createdAt: newOrder.createdAt,
        updatedAt: newOrder.updatedAt,
      };

      setState(prev => ({
        ...prev,
        orders: [formattedOrder, ...prev.orders],
      }));

      return formattedOrder;
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
      ).lean() as unknown as MongoOrderDocument | null;

      if (!updatedOrder) {
        throw new Error('Order not found');
      }

      const formattedOrder: Order = {
        _id: updatedOrder._id.toString(),
        id: updatedOrder.id,
        userId: updatedOrder.userId,
        items: updatedOrder.items as OrderItem[],
        total: updatedOrder.total,
        status: updatedOrder.status as Order['status'],
        shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
        createdAt: updatedOrder.createdAt,
        updatedAt: updatedOrder.updatedAt,
      };

      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order =>
          order.id === id ? formattedOrder : order
        ),
      }));

      return formattedOrder;
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
