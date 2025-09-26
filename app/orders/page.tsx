'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Calendar, MapPin, CreditCard, ArrowLeft, Eye, Lock } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useUser } from '@/context/UserContext';
import { Order } from '@/types';

export default function OrdersPage() {
  const router = useRouter();
  const { state } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    fetchOrders();
  }, [state.isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Show loading while checking authentication
  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
            <p className="text-gray-600 mb-8">You need to be signed in to view your orders.</p>
            <Link
              href="/login"
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-8 py-3 rounded-lg font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="flex items-center text-gray-600 hover:text-blue-600 mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-8 py-3 rounded-lg font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(order.createdAt!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-2">₦{order.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.category}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.fullName}<br />
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">View Details</span>
                    </button>
                    {order.status === 'DELIVERED' && (
                      <button className="text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors">
                        Reorder
                      </button>
                    )}
                  </div>
                  {order.status === 'PENDING' && (
                    <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
