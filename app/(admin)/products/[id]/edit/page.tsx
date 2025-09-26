'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Product, ProductFormData } from '@/types';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: 0,
    description: '',
    imageUrl: '',
    stock: 0,
  });

  const categories = [
    'Analgesics',
    'Antibiotics',
    'Vitamins',
    'Anti-inflammatory',
    'Digestive',
    'Cardiovascular',
    'Respiratory',
    'Dermatology',
    'Supplements',
    'First Aid',
  ];

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const productData = data.data;
        setProduct(productData);
        setFormData({
          name: productData.name,
          category: productData.category,
          price: productData.price,
          description: productData.description,
          imageUrl: productData.imageUrl,
          stock: productData.stock || 0,
        });
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Basic validation
    if (!formData.name.trim()) {
      setError('Product name is required');
      setSaving(false);
      return;
    }

    if (!formData.category) {
      setError('Category is required');
      setSaving(false);
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      setSaving(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      setSaving(false);
      return;
    }

    if (!formData.imageUrl.trim()) {
      setError('Image URL is required');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update product');
      }
    } catch (err) {
      setError('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete product');
      }
    } catch (err) {
      setError('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/products"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Products
          </Link>
        </div>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/products"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Products
          </Link>
        </div>
        <div className="text-center py-16">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/admin/products"
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-6 py-2 rounded-lg"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/products"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product information</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 transition-colors px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>{deleting ? 'Deleting...' : 'Delete Product'}</span>
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL *
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter a valid URL for the product image
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
              required
            />
          </div>

          {/* Preview */}
          {formData.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview
              </label>
              <div className="border border-gray-300 rounded-lg p-4">
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/products"
              className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 transition-colors px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
