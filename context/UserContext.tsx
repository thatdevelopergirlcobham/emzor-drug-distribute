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
      return { ...state, currentUser: null, isAuthenticated: false, cart: [], orders: [] };
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
  register: (userData: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  addToCart: (product: any, quantity: number) => void;
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
      const response = await fetch('http://localhost:3001/users');
      const users: User[] = await response.json();

      const user = users.find(
        u => u.email === email && u.password === password && u.role === 'CUSTOMER'
      );

      if (user) {
        const userWithoutPassword = { ...user };
        delete (userWithoutPassword as any).password;

        dispatch({ type: 'LOGIN_SUCCESS', payload: userWithoutPassword });
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }

      dispatch({ type: 'SET_ERROR', payload: 'Invalid email or password' });
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Login failed. Please try again.' });
      return false;
    }
  }, []);

  const register = useCallback(async (userData: { name: string; email: string; password: string }): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await fetch('http://localhost:3001/users');
      const users: User[] = await response.json();

      const existingUser = users.find(u => u.email === userData.email);

      if (existingUser) {
        dispatch({ type: 'SET_ERROR', payload: 'User with this email already exists' });
        return false;
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'CUSTOMER',
      };

      const createResponse = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (createResponse.ok) {
        const userWithoutPassword = { ...newUser };
        delete (userWithoutPassword as any).password;

        dispatch({ type: 'LOGIN_SUCCESS', payload: userWithoutPassword });
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }

      dispatch({ type: 'SET_ERROR', payload: 'Registration failed. Please try again.' });
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Registration failed. Please try again.' });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
  }, []);

  const addToCart = useCallback((product: any, quantity: number) => {
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch('http://localhost:3001/orders', {
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

  // Check for existing session on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

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
