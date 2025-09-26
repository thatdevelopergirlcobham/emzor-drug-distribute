'use client';

import { useEffect, useState } from 'react';
import { User } from '@/types';
import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function TestAuthPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check localStorage for user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        setUser(userData);
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test</h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Current Authentication Status</h2>

          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800">✅ Logged In</h3>
                <p className="text-green-600">User: {user.name}</p>
                <p className="text-green-600">Email: {user.email}</p>
                <p className="text-green-600">Role: {user.role}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Available Actions:</h4>
                {user.role === 'ADMIN' ? (
                  <div className="space-y-2">
                    <Link href="/admin/dashboard" className="block bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-medium">
                      Go to Admin Dashboard
                    </Link>
                    <Link href="/admin/products" className="block bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-medium">
                      Manage Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/products" className="block bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-medium">
                      Browse Products
                    </Link>
                    <Link href="/cart" className="block bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-medium">
                      View Cart
                    </Link>
                    <Link href="/orders" className="block bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-medium">
                      View Orders
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800">❌ Not Logged In</h3>
              <p className="text-red-600">Please login to access the application features.</p>
              <div className="mt-4 space-x-4">
                <Link href="/login" className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-medium inline-block">
                  Login
                </Link>
                <Link href="/register" className="bg-green-600 text-white hover:bg-green-700 transition-colors px-4 py-2 rounded-lg font-medium inline-block">
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
