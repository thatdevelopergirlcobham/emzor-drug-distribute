export interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'STUDENT';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  _id?: string;
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number; // Price at time of order
}

export interface Order {
  _id?: string;
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: ShippingAddress;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'STUDENT';
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  stock?: number;
}

// Allocation interface for Supervisor role
export interface Allocation {
  _id?: string;
  id: string;
  title: string;
  description: string;
  assignedTo: string; // User ID
  assignedBy: string; // Supervisor ID
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Dashboard statistics
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalAllocations: number;
  recentOrders: Order[];
  recentAllocations: Allocation[];
}

// User registration data
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'STUDENT';
}
