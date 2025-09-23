'use client';

import { useState, useCallback, useEffect } from 'react';
import { Product, ProductFormData } from '@/types';
import { ProductModel } from '@/lib/mongodb';

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
      const products = await ProductModel.find().sort({ createdAt: -1 }).lean();

      const formattedProducts: Product[] = products.map(product => ({
        _id: product._id?.toString(),
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        stock: product.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }));

      setState(prev => ({
        ...prev,
        products: formattedProducts,
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

      const formattedProduct: Product = {
        _id: newProduct._id?.toString(),
        id: newProduct.id,
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        description: newProduct.description,
        imageUrl: newProduct.imageUrl,
        stock: newProduct.stock,
        createdAt: newProduct.createdAt,
        updatedAt: newProduct.updatedAt,
      };

      setState(prev => ({
        ...prev,
        products: [formattedProduct, ...prev.products],
      }));

      return formattedProduct;
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
      ).lean();

      if (!updatedProduct) {
        throw new Error('Product not found');
      }

      const formattedProduct: Product = {
        _id: updatedProduct._id?.toString(),
        id: updatedProduct.id,
        name: updatedProduct.name,
        category: updatedProduct.category,
        price: updatedProduct.price,
        description: updatedProduct.description,
        imageUrl: updatedProduct.imageUrl,
        stock: updatedProduct.stock,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt,
      };

      setState(prev => ({
        ...prev,
        products: prev.products.map(product =>
          product.id === id ? formattedProduct : product
        ),
      }));

      return formattedProduct;
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
