'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Package, Eye, Edit, Filter, Search } from 'lucide-react';
import { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term (order ID or customer name)
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus as any } : order
        ));
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      alert('Failed to update order status');
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

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'PENDING').length}
              </p>
            </div>
            <Package className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Shipped</p>
              <p className="text-2xl font-bold text-purple-600">
                {orders.filter(o => o.status === 'SHIPPED').length}
              </p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'DELIVERED').length}
              </p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600">
              {filteredOrders.length} of {orders.length} orders
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {error ? (
        <div className="text-center py-16">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter
              ? 'Try adjusting your search or filter criteria.'
              : 'No orders have been placed yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
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
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${getStatusColor(order.status)}`}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <p className="text-lg font-bold text-gray-900 mt-2">₦{order.total.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Items ({order.items.length})</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{item.product.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer & Shipping */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Customer & Shipping</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                          {order.shippingAddress.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 mt-6">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">View Details</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors">
                  <Edit className="h-4 w-4" />
                  <span className="text-sm font-medium">Edit Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
