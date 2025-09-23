import mongoose from 'mongoose';
import jwt  from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// MongoDB connection utility
export const connectToDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://user_db_user:r279PhhU0dKXoOsI@fuzzy-based-expert-syst.2cx2z6f.mongodb.net/emzor-drugs?retryWrites=true&w=majority';

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
    enum: ['ADMIN', 'USER']
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
   
  };
};

// Export models getter function
export const getDatabaseModels = getModels;

// Also export individual models for backward compatibility (will throw error if connection not established)
export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  
  return jwt.sign({ userId, role }, secret);
};

export const verifyToken = (token: string): { userId: string; role: string } | null => {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    return jwt.verify(token, secret) as { userId: string; role: string };
  } catch {
    return null;
  }
};
