/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Product, Order } from '@/types';

// In-memory data storage
let users: User[] = [];
let products: Product[] = [];
let orders: Order[] = [];

// Initialize with sample data
const initializeDummyData = () => {
  if (users.length === 0) {
    // Create initial admin user
    const adminPassword = 'password'; // Will be hashed when needed
    const adminUser: User = {
      id: 'admin-001',
      name: 'System Administrator',
      email: 'admin@emzor.com',
      password: adminPassword,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(adminUser);

    // Create initial supervisor user
    const supervisorUser: User = {
      id: 'supervisor-001',
      name: 'John Supervisor',
      email: 'supervisor@emzor.com',
      password: 'password',
      role: 'SUPERVISOR',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(supervisorUser);

    // Create initial student user
    const studentUser: User = {
      id: 'student-001',
      name: 'Jane Student',
      email: 'student@emzor.com',
      password: 'password',
      role: 'STUDENT',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(studentUser);
  }

  if (products.length === 0) {
    // Create sample products
    const sampleProducts: Product[] = [
      {
        id: 'prod-001',
        name: 'Paracetamol 500mg',
        category: 'Analgesics',
        price: 150,
        description: 'Effective pain relief and fever reducer',
        imageUrl: '/images/paractamol.jpg',
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-002',
        name: 'Amoxicillin 250mg',
        category: 'Antibiotics',
        price: 200,
        description: 'Broad-spectrum antibiotic for bacterial infections',
        imageUrl: '/images/amoxil.webp',
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-003',
        name: 'Vitamin C 1000mg',
        category: 'Vitamins',
        price: 300,
        description: 'Immune system booster with antioxidant properties',
        imageUrl: '/images/vitamin.jpg',
        stock: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-004',
        name: 'Ibuprofen 400mg',
        category: 'Anti-inflammatory',
        price: 180,
        description: 'Reduces inflammation, pain, and fever',
        imageUrl: '/images/ibuprofen.jpg',
        stock: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-005',
        name: 'Multivitamin Complex',
        category: 'Vitamins',
        price: 450,
        description: 'Complete daily vitamin and mineral supplement',
        imageUrl: '/images/multivitamins.jpg',
        stock: 150,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-006',
        name: 'Antacid Tablets',
        category: 'Digestive',
        price: 120,
        description: 'Fast relief from heartburn and indigestion',
        imageUrl: '/images/digestive.jpg',
        stock: 80,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    products.push(...sampleProducts);
  }
};

// Initialize data on first import
initializeDummyData();

// Dummy User Model
export class UserModel {
  static async findOne(query: { email?: string; id?: string }): Promise<User | null> {
    const user = users.find(u =>
      (query.email && u.email === query.email) ||
      (query.id && u.id === query.id)
    );
    return user || null;
  }

  static async find(query: { role?: string } = {}): Promise<User[]> {
    if (query.role) {
      return users.filter(u => u.role === query.role);
    }
    return users;
  }

  static async countDocuments(): Promise<number> {
    return users.length;
  }

  static async create(userData: Partial<User>): Promise<User> {
    const hashedPassword = await hashPassword(userData.password!);
    const newUser: User = {
      id: userData.id || `user-${Date.now()}`,
      name: userData.name!,
      email: userData.email!,
      password: hashedPassword,
      role: userData.role!,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(newUser);
    return newUser;
  }

  static async findByIdAndUpdate(id: string, updateData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updateData, updatedAt: new Date() };
    return users[userIndex];
  }

  static async findOneAndUpdate(query: any, updateData: any, options: any = {}): Promise<User | null> {
    const user = users.find(u =>
      (query.email && u.email === query.email) ||
      (query.id && u.id === query.id)
    );
    if (!user) return null;

    const updatedUser = { ...user, ...updateData, updatedAt: new Date() };
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex] = updatedUser;

    return options.new ? updatedUser : user;
  }

  static async findOneAndDelete(query: any): Promise<User | null> {
    const userIndex = users.findIndex(u =>
      (query.email && u.email === query.email) ||
      (query.id && u.id === query.id)
    );
    if (userIndex === -1) return null;

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    return deletedUser;
  }
}

// Dummy Product Model
export class ProductModel {
  static async find(query: { category?: string } = {}): Promise<Product[]> {
    if (query.category) {
      return products.filter(p => p.category === query.category);
    }
    return products;
  }

  static async findById(id: string): Promise<Product | null> {
    return products.find(p => p.id === id) || null;
  }

  static async countDocuments(): Promise<number> {
    return products.length;
  }

  static async create(productData: Partial<Product>): Promise<Product> {
    const newProduct: Product = {
      id: productData.id || `prod-${Date.now()}`,
      name: productData.name!,
      category: productData.category!,
      price: productData.price!,
      description: productData.description!,
      imageUrl: productData.imageUrl!,
      stock: productData.stock || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    products.push(newProduct);
    return newProduct;
  }

  static async findByIdAndUpdate(id: string, updateData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product | null> {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;

    products[productIndex] = { ...products[productIndex], ...updateData, updatedAt: new Date() };
    return products[productIndex];
  }

  static async findOneAndUpdate(query: any, updateData: any, options: any = {}): Promise<Product | null> {
    const product = products.find(p => p.id === query.id);
    if (!product) return null;

    const updatedProduct = { ...product, ...updateData, updatedAt: new Date() };
    const productIndex = products.findIndex(p => p.id === query.id);
    products[productIndex] = updatedProduct;

    return options.new ? updatedProduct : product;
  }

  static async findOneAndDelete(query: any): Promise<Product | null> {
    const productIndex = products.findIndex(p => p.id === query.id);
    if (productIndex === -1) return null;

    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);
    return deletedProduct;
  }

  static async insertMany(productsData: Partial<Product>[]): Promise<Product[]> {
    const newProducts = productsData.map(data => ({
      id: data.id || `prod-${Date.now()}-${Math.random()}`,
      name: data.name!,
      category: data.category!,
      price: data.price!,
      description: data.description!,
      imageUrl: data.imageUrl!,
      stock: data.stock || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    products.push(...newProducts);
    return newProducts;
  }
}

// Dummy Order Model
export class OrderModel {
  static async find(query: { userId?: string } = {}): Promise<Order[]> {
    if (query.userId) {
      return orders.filter(o => o.userId === query.userId);
    }
    return orders;
  }

  static async findById(id: string): Promise<Order | null> {
    return orders.find(o => o.id === id) || null;
  }

  static async countDocuments(): Promise<number> {
    return orders.length;
  }

  static async create(orderData: Partial<Order>): Promise<Order> {
    const newOrder: Order = {
      id: orderData.id || `order-${Date.now()}`,
      userId: orderData.userId!,
      items: orderData.items!,
      total: orderData.total!,
      status: orderData.status || 'PENDING',
      shippingAddress: orderData.shippingAddress!,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    orders.push(newOrder);
    return newOrder;
  }

  static async findByIdAndUpdate(id: string, updateData: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'items'>>): Promise<Order | null> {
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return null;

    orders[orderIndex] = { ...orders[orderIndex], ...updateData, updatedAt: new Date() };
    return orders[orderIndex];
  }

  static async findOneAndUpdate(query: any, updateData: any, options: any = {}): Promise<Order | null> {
    const order = orders.find(o => o.id === query.id);
    if (!order) return null;

    const updatedOrder = { ...order, ...updateData, updatedAt: new Date() };
    const orderIndex = orders.findIndex(o => o.id === order.id);
    orders[orderIndex] = updatedOrder;

    return options.new ? updatedOrder : order;
  }

  static async findOneAndDelete(query: any): Promise<Order | null> {
    const orderIndex = orders.findIndex(o => o.id === query.id);
    if (orderIndex === -1) return null;

    const deletedOrder = orders[orderIndex];
    orders.splice(orderIndex, 1);
    return deletedOrder;
  }
}

// Export models
export const getDatabaseModels = () => ({
  UserModel,
  ProductModel,
  OrderModel,
});

// Connection function (no-op for dummy data)
export const connectToDatabase = async (): Promise<void> => {
  // No connection needed for dummy data
  console.log('Using dummy data - no database connection required');
};

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

// Helper functions for data management
export const getAllUsers = (): User[] => users;
export const getAllProducts = (): Product[] => products;
export const getAllOrders = (): Order[] => orders;

export const clearAllData = (): void => {
  users = [];
  products = [];
  orders = [];
  initializeDummyData();
};
