'use client';

import { useState, useEffect } from 'react';
import {  User } from '@/types';
import { useUser } from '@/context/UserContext';
import Header from '@/components/layout/Header';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const router = useRouter();
  const { state } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        setUser(userData);
      } catch {
        // Invalid user data, clear it
        localStorage.removeItem('user');
        router.push('/login?redirect=/orders');
      }
    } else {
      router.push('/login?redirect=/orders');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-16">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        {state.orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">You have ot placed any orders yet. Start shopping to see your orders here.</p>
            <Link href="/products" className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-6 py-3 rounded-lg font-semibold">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {state.orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                    <p className="text-sm text-gray-500">Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date'}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium`}>
                    {order.status}
                  </div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <p className="font-semibold">Total: ₦{order.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
