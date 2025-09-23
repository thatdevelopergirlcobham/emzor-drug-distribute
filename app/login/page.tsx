'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const { login, loading, error: authError } = useAuth();

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      const success = await login(credentials);

      if (success) {
        // Redirect based on user role
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        switch (user.role) {
          case 'ADMIN':
            router.push('/admin/dashboard');
            break;
          case 'SUPERVISOR':
            router.push('/supervisor/dashboard');
            break;
          case 'STUDENT':
            router.push('/student/dashboard');
            break;
          default:
            router.push(redirectTo);
        }
      }
    } catch {
      setLocalError('Login failed. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (localError) setLocalError('');
  };

  const error = localError || authError;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <div className="text-center mb-8">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-2xl inline-block mb-4">
              EMZOR
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-600 mt-2">Access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-gray-400 transition-colors py-3 px-4 rounded-lg font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-blue-700 mb-1">
                  <strong>Admin:</strong>
                </p>
                <p className="text-sm text-blue-700">
                  Email: <code className="bg-blue-100 px-1 rounded">admin@emzor.com</code>
                </p>
                <p className="text-sm text-blue-700">
                  Password: <code className="bg-blue-100 px-1 rounded">password</code>
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 mb-1">
                  <strong>Supervisor:</strong>
                </p>
                <p className="text-sm text-blue-700">
                  Email: <code className="bg-blue-100 px-1 rounded">supervisor@emzor.com</code>
                </p>
                <p className="text-sm text-blue-700">
                  Password: <code className="bg-blue-100 px-1 rounded">password</code>
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 mb-1">
                  <strong>Student:</strong>
                </p>
                <p className="text-sm text-blue-700">
                  Email: <code className="bg-blue-100 px-1 rounded">student@emzor.com</code>
                </p>
                <p className="text-sm text-blue-700">
                  Password: <code className="bg-blue-100 px-1 rounded">password</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
