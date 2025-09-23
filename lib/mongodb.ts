import mongoose from 'mongoose';

// MongoDB connection utility
export const connectToDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/emzor-distribution';

    if (mongoose.connections[0].readyState) {
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN', 'SUPERVISOR', 'STUDENT']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  items: [{
    product: {
      id: String,
      name: String,
      category: String,
      price: Number,
      description: String,
      imageUrl: String
    },
    quantity: Number,
    price: Number
  }],
  total: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    postalCode: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Allocation Schema (for Supervisor role)
const allocationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: String, required: true }, // User ID
  assignedBy: { type: String, required: true }, // Supervisor ID
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  priority: {
    type: String,
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Get models function - ensures connection is established before returning models
const getModels = () => {
  // Ensure connection is established
  if (mongoose.connections[0].readyState !== 1) {
    throw new Error('Database connection not established. Call connectToDatabase() first.');
  }

  return {
    UserModel: mongoose.models.User || mongoose.model('User', userSchema),
    ProductModel: mongoose.models.Product || mongoose.model('Product', productSchema),
    OrderModel: mongoose.models.Order || mongoose.model('Order', orderSchema),
    AllocationModel: mongoose.models.Allocation || mongoose.model('Allocation', allocationSchema),
  };
};

// Export models getter function
export const getDatabaseModels = getModels;

// Also export individual models for backward compatibility (will throw error if connection not established)
export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);
export const AllocationModel = mongoose.models.Allocation || mongoose.model('Allocation', allocationSchema);

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  return jwt.sign({ userId, role }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

export const verifyToken = (token: string): { userId: string; role: string } | null => {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    return jwt.verify(token, secret) as { userId: string; role: string };
  } catch {
    return null;
  }
};
