import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Product, Order } from '@/types';

const dataPath = path.join(process.cwd(), 'data');
const usersPath = path.join(dataPath, 'users.json');
const productsPath = path.join(dataPath, 'products.json');
const ordersPath = path.join(dataPath, 'orders.json');

async function readData<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []; // Return empty array if file doesn't exist
    }
    throw error;
  }
}

async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Dummy User Model
export class UserModel {
  static async findOne(query: { email?: string; id?: string }): Promise<User | null> {
    const users = await readData<User>(usersPath);
    const user = users.find(u =>
      (query.email && u.email === query.email) ||
      (query.id && u.id === query.id)
    );
    return user || null;
  }

  static async find(query: { role?: string } = {}): Promise<User[]> {
    const users = await readData<User>(usersPath);
    if (query.role) {
      return users.filter(u => u.role === query.role);
    }
    return users;
  }

  static async countDocuments(): Promise<number> {
    const users = await readData<User>(usersPath);
    return users.length;
  }

  static async create(userData: Partial<User>): Promise<User> {
    const users = await readData<User>(usersPath);
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
    await writeData(usersPath, users);
    return newUser;
  }

  static async findByIdAndUpdate(id: string, updateData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> {
    const users = await readData<User>(usersPath);
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updateData, updatedAt: new Date() };
    await writeData(usersPath, users);
    return users[userIndex];
  }

  static async findOneAndDelete(query: { email?: string; id?: string }): Promise<User | null> {
    const users = await readData<User>(usersPath);
    const userIndex = users.findIndex(u =>
      (query.email && u.email === query.email) ||
      (query.id && u.id === query.id)
    );
    if (userIndex === -1) return null;

    const deletedUser = users.splice(userIndex, 1)[0];
    await writeData(usersPath, users);
    return deletedUser;
  }
}

// Dummy Product Model
export class ProductModel {
  static async find(query: { category?: string } = {}): Promise<Product[]> {
    const products = await readData<Product>(productsPath);
    if (query.category) {
      return products.filter(p => p.category === query.category);
    }
    return products;
  }

  static async findById(id: string): Promise<Product | null> {
    const products = await readData<Product>(productsPath);
    return products.find(p => p.id === id) || null;
  }

  static async countDocuments(): Promise<number> {
    const products = await readData<Product>(productsPath);
    return products.length;
  }

  static async create(productData: Partial<Product>): Promise<Product> {
    const products = await readData<Product>(productsPath);
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
    await writeData(productsPath, products);
    return newProduct;
  }

  static async findByIdAndUpdate(id: string, updateData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product | null> {
    const products = await readData<Product>(productsPath);
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;

    products[productIndex] = { ...products[productIndex], ...updateData, updatedAt: new Date() };
    await writeData(productsPath, products);
    return products[productIndex];
  }

  static async findByIdAndRemove(id: string): Promise<Product | null> {
    const products = await readData<Product>(productsPath);
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;

    const deletedProduct = products.splice(productIndex, 1)[0];
    await writeData(productsPath, products);
    return deletedProduct;
  }
}

// Dummy Order Model
export class OrderModel {
  static async find(query: { userId?: string } = {}): Promise<Order[]> {
    const orders = await readData<Order>(ordersPath);
    if (query.userId) {
      return orders.filter(o => o.userId === query.userId);
    }
    return orders;
  }

  static async findById(id: string): Promise<Order | null> {
    const orders = await readData<Order>(ordersPath);
    return orders.find(o => o.id === id) || null;
  }

  static async countDocuments(): Promise<number> {
    const orders = await readData<Order>(ordersPath);
    return orders.length;
  }

  static async create(orderData: Partial<Order>): Promise<Order> {
    const orders = await readData<Order>(ordersPath);
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
    await writeData(ordersPath, orders);
    return newOrder;
  }

  static async findByIdAndUpdate(id: string, updateData: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'items'>>): Promise<Order | null> {
    const orders = await readData<Order>(ordersPath);
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return null;

    orders[orderIndex] = { ...orders[orderIndex], ...updateData, updatedAt: new Date() };
    await writeData(ordersPath, orders);
    return orders[orderIndex];
  }
}

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

// Database connection simulation
export const connectToDatabase = async (): Promise<void> => {
  // Ensure data directory exists
  try {
    await fs.mkdir(dataPath, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
};

// Get database models
export const getDatabaseModels = () => {
  return {
    UserModel,
    ProductModel,
    OrderModel
  };
};
