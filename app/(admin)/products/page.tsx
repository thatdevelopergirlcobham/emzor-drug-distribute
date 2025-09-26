'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, Filter, Package } from 'lucide-react';
import { Product } from '@/types';
import { useProducts } from '@/hooks/useProducts';

export default function AdminProductsPage() {
  const { products, loading, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Get unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    if (stock < 10) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
        </div>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600">
              {filteredProducts.length} of {products.length} products
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first product.'}
          </p>
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-6 py-3 rounded-lg font-semibold"
          >
            Add New Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock || 0);
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Product Image */}
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {product.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-blue-600">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      Stock: {product.stock || 0}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700 transition-colors py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-600 text-white hover:bg-red-700 transition-colors py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => (p.stock || 0) > 10).length}
            </div>
            <div className="text-sm text-gray-600">In Stock</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length}
            </div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => (p.stock || 0) === 0).length}
            </div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </div>
        </div>
      </div>
    </div>
  );
}
