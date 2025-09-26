'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { User, CartItem, Order, ShippingAddress, PaymentDetails } from '@/types';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  cart: CartItem[];
  orders: Order[];
  loading: boolean;
  error: string | null;
}

type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ORDER'; payload: Order };

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  cart: [],
  orders: [],
  loading: false,
  error: null,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGIN_SUCCESS':
      return { ...state, currentUser: action.payload, isAuthenticated: true, loading: false };
    case 'LOGOUT':
      return { ...state, currentUser: null, isAuthenticated: false, orders: [] };
    case 'ADD_TO_CART':
      const existingItemIndex = state.cart.findIndex(item => item.product.id === action.payload.product.id);
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + action.payload.quantity,
        };
        return { ...state, cart: updatedCart };
      } else {
        // Add new item
        return { ...state, cart: [...state.cart, action.payload] };
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    default:
      return state;
  }
}

interface UserContextType {
  state: UserState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { name: string; email: string; password: string; role: string }) => Promise<boolean>;
  logout: () => void;
  addToCart: (product: CartItem['product'], quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  getCartTotal: () => number;
  placeOrder: (orderDetails: {
    shippingAddress: ShippingAddress;
    paymentDetails: PaymentDetails;
  }) => Promise<Order>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
        localStorage.setItem('user', JSON.stringify(data.user)); // Sync with useAuth
        return true;
      }

      dispatch({ type: 'SET_ERROR', payload: data.message || 'Invalid email or password' });
      return false;
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Login failed. Please try again.' });
      return false;
    }
  }, []);

  const register = useCallback(async (userData: { name: string; email: string; password: string; role: string }): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
        localStorage.setItem('user', JSON.stringify(data.user)); // Sync with useAuth
        return true;
      }

      dispatch({ type: 'SET_ERROR', payload: data.message || 'Registration failed. Please try again.' });
      return false;
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Registration failed. Please try again.' });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
  }, []);

  const addToCart = useCallback((product: CartItem['product'], quantity: number) => {
    const cartItem: CartItem = {
      product,
      quantity,
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  }, []);

  const getCartTotal = useCallback((): number => {
    return state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [state.cart]);

  const placeOrder = useCallback(async (orderDetails: {
    shippingAddress: ShippingAddress;
    paymentDetails: PaymentDetails;
  }): Promise<Order> => {
    if (!state.currentUser) {
      throw new Error('User must be logged in to place order');
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const orderItems = state.cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const total = getCartTotal();

      const order: Omit<Order, 'id'> = {
        userId: state.currentUser.id,
        items: orderItems,
        total,
        status: 'PENDING',
        shippingAddress: orderDetails.shippingAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const createdOrder: Order = await response.json();
      dispatch({ type: 'ADD_ORDER', payload: createdOrder });
      dispatch({ type: 'CLEAR_CART' });

      return createdOrder;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.cart, state.currentUser, getCartTotal]);

  // Check for existing session and cart on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch {
        localStorage.removeItem('user');
      }
    }
    
    // Load cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const cartItems: CartItem[] = JSON.parse(storedCart);
        cartItems.forEach(item => {
          dispatch({ type: 'ADD_TO_CART', payload: item });
        });
      } catch {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Listen for localStorage changes
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            const userData: User = JSON.parse(e.newValue);
            dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
          } catch {
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also listen for programmatic localStorage changes
  React.useEffect(() => {
    const checkStorage = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser && !state.isAuthenticated) {
        try {
          const userData: User = JSON.parse(storedUser);
          dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
        } catch {
          localStorage.removeItem('user');
        }
      } else if (!storedUser && state.isAuthenticated) {
        dispatch({ type: 'LOGOUT' });
      }
    };

    const interval = setInterval(checkStorage, 1000);
    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  // Initialize with some sample orders for demo purposes
  React.useEffect(() => {
    if (state.orders.length === 0 && state.isAuthenticated) {
      // Add some sample orders for demo
      const sampleOrders: Order[] = [
        {
          id: 'order-001',
          userId: 'user-001',
          items: [
            {
              product: {
                id: 'prod-001',
                name: 'Paracetamol 500mg',
                category: 'Analgesics',
                price: 150,
                description: 'Effective pain relief and fever reducer',
                imageUrl: '/images/paracetamol.jpg',
                stock: 100,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01')
              },
              quantity: 2,
              price: 150
            }
          ],
          total: 300,
          status: 'DELIVERED',
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Main St',
            city: 'Lagos',
            state: 'Lagos',
            postalCode: '100001',
            phone: '+234123456789'
          },
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-16')
        }
      ];

      sampleOrders.forEach(order => {
        dispatch({ type: 'ADD_ORDER', payload: order });
      });
    }
  }, [state.isAuthenticated, state.orders.length]);

  const value: UserContextType = {
    state,
    login,
    register,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    placeOrder,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
