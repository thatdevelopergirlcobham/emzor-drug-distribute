'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, ShoppingBag, CreditCard, Package } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useUser } from '@/context/UserContext';

export default function AccountPage() {
  const { state } = useUser();
  const [activeTab, setActiveTab] = useState('profile');

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your account</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Access your account to view your order history, manage your profile, and more.
            </p>
            <div className="space-x-4">
              <Link
                href="/login"
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-8 py-3 rounded-lg font-semibold"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors px-8 py-3 rounded-lg font-semibold"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    // { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{state.currentUser?.name}</h2>
                <p className="text-gray-600">{state.currentUser?.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <p className="text-gray-900">{state.currentUser?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <p className="text-gray-900">{state.currentUser?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Customer
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member Since
                      </label>
                      <p className="text-gray-900">Recently joined</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Order History</h3>
                    <span className="text-sm text-gray-600">{state.orders.length} orders</span>
                  </div>

                  {state.orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                      <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
                      <Link
                        href="/products"
                        className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-6 py-3 rounded-lg font-semibold"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {state.orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                ₦{order.total.toLocaleString()}
                              </p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.status === 'CONFIRMED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'SHIPPED'
                                  ? 'bg-purple-100 text-purple-800'
                                  : order.status === 'DELIVERED'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.items.length} item(s) • {order.shippingAddress.city}, {order.shippingAddress.state}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* {activeTab === 'addresses' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Delivery Addresses</h3>
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h4>
                    <p className="text-gray-600">Save your delivery addresses for faster checkout.</p>
                    <Link
                      href="/account/addresses"
                      className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-6 py-3 rounded-lg font-semibold"
                    >
                      Add New Address
                    </Link>
                  </div>
                </div>
              )} */}

              {activeTab === 'payment' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Methods</h3>
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h4>
                    <p className="text-gray-600">Save your payment methods for faster checkout.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
