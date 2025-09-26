'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { useProducts } from '@/hooks/useProducts';
import { useUser } from '@/context/UserContext';
import Header from '@/components/layout/Header';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getProductById } = useProducts();
  const { addToCart } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchedProduct = getProductById(params.id);
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    } else {
      // Handle product not found, maybe redirect or show a message
    }
  }, [params.id, getProductById]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Optionally, show a notification or redirect to cart
      router.push('/cart');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-16">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.back()} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to products</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-96 bg-white rounded-lg shadow-sm overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-600 mt-2">{product.category}</p>
            <p className="text-2xl font-bold text-blue-600 mt-4">₦{product.price.toLocaleString()}</p>
            <p className="text-gray-700 mt-4">{product.description}</p>
            
            <div className="mt-6 flex items-center space-x-4">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
              />
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 transition-colors py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
