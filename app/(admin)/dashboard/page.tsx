'use client';

import Link from 'next/link';
import { Plus, Package, Users, ShoppingCart, DollarSign } from 'lucide-react';
import ProductDataTable from '@/components/admin/ProductDataTable';
import { useProducts } from '@/hooks/useProducts';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function AdminDashboard() {
  const { products } = useProducts();
  const { stats } = useDashboardData();

  const statsData = stats ? {
    totalProducts: stats.totalProducts,
    totalUsers: stats.totalUsers,
    totalOrders: stats.totalOrders,
    totalValue: products.reduce((sum, product) => sum + product.price, 0),
    categories: new Set(products.map(product => product.category)).size,
    lowStock: products.filter(product => (product.stock || 0) < 10).length,
  } : {
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalValue: 0,
    categories: 0,
    lowStock: 0,
  };

  const statCards = [
    {
      title: 'Total Products',
      value: statsData.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      description: 'Products in inventory',
    },
    {
      title: 'Total Users',
      value: statsData.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      description: 'Registered users',
    },
    {
      title: 'Total Orders',
      value: statsData.totalOrders,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      description: 'Orders placed',
    },
    {
      title: 'Inventory Value',
      value: `₦${statsData.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-orange-500',
      description: 'Total inventory value',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your products and monitor your inventory</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.description}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Products Management */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600 mt-1">View, edit, and manage your product inventory</p>
        </div>
        <div className="p-6">
          <ProductDataTable />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/products/new"
              className="block p-3 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded-lg font-medium"
            >
              Add New Product
            </Link>
            <Link
              href="/admin/products"
              className="block p-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg font-medium"
            >
              Manage Products
            </Link>
            <Link
              href="/admin/users"
              className="block p-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg font-medium"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/orders"
              className="block p-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg font-medium"
            >
              View Orders
            </Link>
            <Link
              href="/admin/allocations"
              className="block p-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg font-medium"
            >
              Manage Allocations
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-800 font-medium">MongoDB</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-800 font-medium">API Status</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-800 font-medium">Total Categories</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{statsData.categories}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}