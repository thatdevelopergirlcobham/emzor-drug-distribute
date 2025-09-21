'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminDashboardRedirect() {
  const router = useRouter();
  const { state } = useAdmin();

  useEffect(() => {
    if (state.isAuthenticated) {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  }, [state.isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
