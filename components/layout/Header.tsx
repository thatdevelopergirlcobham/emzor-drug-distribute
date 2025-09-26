'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, LogOut, X } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { User } from '@/types';

export default function Header() {
  const router = useRouter();
  const { state: userState, logout: userLogout } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        setUser(null);
      }
    }
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cartItemCount = user ? userState.cart.reduce((total, item) => total + item.quantity, 0) : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleUserLogout = () => {
    userLogout();
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    setIsMobileMenuOpen(false); // Close mobile menu on logout
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-bold text-xl">
                EMZOR
              </div>
              <span className="text-gray-600 font-medium hidden sm:block">Pharmaceutical</span>
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
            
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-48 xl:w-64"
                />
              </div>
            </form>

            {/* Mobile Search Button */}
            <button
              onClick={() => router.push('/products')}
              className="lg:hidden text-gray-600 hover:text-primary transition-colors p-2"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart - Only show for logged in users */}
            {user && (
              <Link href="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Desktop User/Admin Authentication */}
            <div className="hidden md:flex items-center space-x-4">
              {user?.role === 'ADMIN' ? (
                <>
                  <span className="text-sm text-gray-600 hidden lg:block">Welcome, {user.name}</span>
                  <Link
                    href="/admin/dashboard"
                    className="bg-primary text-primary-foreground px-3 lg:px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                  >
                    <span className="hidden lg:inline">Admin Dashboard</span>
                    <span className="lg:hidden">Admin</span>
                  </Link>
                  <button
                    onClick={handleUserLogout}
                    className="text-gray-600 hover:text-red-600 transition-colors p-2"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : user ? (
                <>
                  <span className="text-sm text-gray-600 hidden lg:block">Hi, {user.name}</span>
                  <Link
                    href="/orders"
                    className="text-gray-600 hover:text-primary transition-colors font-medium text-sm"
                  >
                    <span className="hidden lg:inline">My Orders</span>
                    <span className="lg:hidden">Orders</span>
                  </Link>
                  <button
                    onClick={handleUserLogout}
                    className="text-gray-600 hover:text-red-600 transition-colors p-2"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-600 hover:text-primary transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden border-t border-gray-200 transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 pt-2 pb-3 space-y-1">
          {/* Navigation Links */}
          <Link 
            href="/" 
            className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
            onClick={closeMobileMenu}
          >
            Products
          </Link>

          {/* Mobile Search */}
          <div className="px-3 py-2">
            <form onSubmit={handleSearch}>
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

          {/* Mobile User Authentication */}
          <div className="border-t border-gray-200 pt-2 mt-2">
            {user?.role === 'ADMIN' ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-600 font-medium">
                  Welcome, {user.name}
                </div>
                <Link
                  href="/admin/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  Admin Dashboard
                </Link>
                {user && (
                  <Link
                    href="/cart"
                    className="flex items-center px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {cartItemCount > 0 && (
                      <span className="ml-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                <button
                  onClick={handleUserLogout}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : user ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-600 font-medium">
                  Hi, {user.name}
                </div>
                <Link
                  href="/orders"
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  My Orders
                </Link>
                {user && (
                  <Link
                    href="/cart"
                    className="flex items-center px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {cartItemCount > 0 && (
                      <span className="ml-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                <button
                  onClick={handleUserLogout}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block mx-3 my-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
