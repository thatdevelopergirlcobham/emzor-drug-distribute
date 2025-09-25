'use client';

import { useState, useCallback, useEffect } from 'react';
import { Product, ProductFormData } from '@/types';
import { ProductModel } from '@/lib/dummydata';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function useProducts() {
  const [state, setState] = useState<ProductsState>({
    products: [],
    loading: false,
    error: null,
  });

  const fetchProducts = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const products = await ProductModel.find();

      setState(prev => ({
        ...prev,
        products,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
      }));
    }
  }, []);

  const createProduct = useCallback(async (productData: ProductFormData): Promise<Product | null> => {
    try {
      const newProduct = await ProductModel.create({
        id: `prod-${Date.now()}`,
        ...productData,
      });

      setState(prev => ({
        ...prev,
        products: [newProduct, ...prev.products],
      }));

      return newProduct;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create product',
      }));
      return null;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, productData: Partial<ProductFormData>): Promise<Product | null> => {
    try {
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { id },
        { ...productData, updatedAt: new Date() },
        { new: true }
      );

      if (!updatedProduct) {
        throw new Error('Product not found');
      }

      setState(prev => ({
        ...prev,
        products: prev.products.map(product =>
          product.id === id ? updatedProduct : product
        ),
      }));

      return updatedProduct;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update product',
      }));
      return null;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await ProductModel.findOneAndDelete({ id });

      if (!result) {
        throw new Error('Product not found');
      }

      setState(prev => ({
        ...prev,
        products: prev.products.filter(product => product.id !== id),
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete product',
      }));
      return false;
    }
  }, []);

  const getProductById = useCallback((id: string): Product | undefined => {
    return state.products.find(product => product.id === id);
  }, [state.products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    ...state,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  };
}
