'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, LogOut } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useUser } from '@/context/UserContext';

export default function Header() {
  const router = useRouter();
  const { state: adminState, logout: adminLogout } = useAdmin();
  const { state: userState, logout: userLogout } = useUser();
  const [searchTerm, setSearchTerm] = useState('');

  const cartItemCount = userState.isAuthenticated ? (userState.cart || []).reduce((total, item) => total + item.quantity, 0) : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleUserLogout = () => {
    userLogout();
    adminLogout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-bold text-xl">
                EMZOR
              </div>
              <span className="text-gray-600 font-medium">Pharmaceutical</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/#categories" className="text-gray-700 hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/#about" className="text-gray-700 hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-64"
                />
              </div>
            </form>

            {/* Mobile Search Button */}
            <button
              onClick={() => router.push('/products')}
              className="sm:hidden text-gray-600 hover:text-primary transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart */}
            {userState.isAuthenticated ? (
              <Link href="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            ) : (
              <button
                onClick={() => router.push('/login?redirect=/cart')}
                className="relative text-gray-600 hover:text-primary transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            )}

            {/* User/Admin Authentication */}
            {adminState.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleUserLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : userState.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/account"
                  className="text-gray-600 hover:text-primary transition-colors font-medium"
                >
                  My Account
                </Link>
                <button
                  onClick={handleUserLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <span className="text-gray-400">|</span>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden text-gray-600 hover:text-primary transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu (hidden by default) */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-4 pt-2 pb-3 space-y-1">
          <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors">
            Products
          </Link>
          <Link href="/#categories" className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="/#about" className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/#contact" className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors">
            Contact
          </Link>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
