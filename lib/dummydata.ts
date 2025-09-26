import { User, Product, Order } from '@/types';

// In-memory data storage (client-side only)
const users: User[] = [];
const products: Product[] = [];
const orders: Order[] = [];

// Initialize with some sample data
const initializeData = () => {
  if (users.length === 0) {
    users.push(
      {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@emzor.com',
        password: 'password',
        role: 'ADMIN',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'user-001',
        name: 'Regular User',
        email: 'user@emzor.com',
        password: 'password',
        role: 'USER',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'jane-001',
        name: 'Jane Doe',
        email: 'jane@emzor.com',
        password: 'password',
        role: 'USER',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'mike-001',
        name: 'Mike Johnson',
        email: 'mike@emzor.com',
        password: 'password',
        role: 'USER',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    );
  }

  if (products.length === 0) {
    products.push(
      {
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
      {
        id: 'prod-002',
        name: 'Amoxicillin 250mg',
        category: 'Antibiotics',
        price: 300,
        description: 'Broad-spectrum antibiotic for bacterial infections',
        imageUrl: '/images/amoxicillin.jpg',
        stock: 50,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'prod-003',
        name: 'Vitamin C 1000mg',
        category: 'Vitamins',
        price: 200,
        description: 'Immune system support and antioxidant',
        imageUrl: '/images/vitamin-c.jpg',
        stock: 200,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'prod-004',
        name: 'Ibuprofen 400mg',
        category: 'Analgesics',
        price: 180,
        description: 'Anti-inflammatory pain relief',
        imageUrl: '/images/ibuprofen.jpg',
        stock: 75,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'prod-005',
        name: 'Loratadine 10mg',
        category: 'Antihistamines',
        price: 120,
        description: 'Allergy relief medication',
        imageUrl: '/images/loratadine.jpg',
        stock: 150,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'prod-006',
        name: 'Metformin 500mg',
        category: 'Diabetes',
        price: 250,
        description: 'Diabetes management medication',
        imageUrl: '/images/metformin.jpg',
        stock: 60,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    );
  }
};

// Dummy User Model - In-memory operations
export class UserModel {
  static async findOne(query: { email?: string; id?: string }): Promise<User | null> {
    initializeData();
    const user = users.find(u =>
      (query.email && u.email === query.email) ||
      (query.id && u.id === query.id)
    );
    return user || null;
  }

  static async find(query: { role?: string } = {}): Promise<User[]> {
    initializeData();
    if (query.role) {
      return users.filter(u => u.role === query.role);
    }
    return users;
  }

  static async countDocuments(): Promise<number> {
    initializeData();
    return users.length;
  }

  static async create(userData: Partial<User>): Promise<User> {
    initializeData();
    const newUser: User = {
      id: userData.id || `user-${Date.now()}`,
      name: userData.name!,
      email: userData.email!,
      password: userData.password!, // Store plain text password
      role: userData.role!,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(newUser);
    return newUser;
  }

  static async findByIdAndUpdate(id: string, updateData: Partial<Omit<User, 'id' | 'createdAt' | 'items'>>): Promise<User | null> {
    initializeData();
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updateData, updatedAt: new Date() };
    return users[userIndex];
  }

  static async findOneAndUpdate(query: { id?: string }, updateData: Partial<Omit<User, 'id' | 'createdAt' | 'items'>>, options?: { new: boolean }): Promise<User | null> {
    initializeData();
    const userIndex = users.findIndex(u => u.id === query.id);
    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updateData, updatedAt: new Date() };
    return options?.new ? users[userIndex] : users[userIndex];
  }

  static async findOneAndDelete(query: { email?: string; id?: string }): Promise<User | null> {
    initializeData();
    const userIndex = users.findIndex(u =>
      (query.email && u.email === query.email) ||
      (query.id && u.id === query.id)
    );
    if (userIndex === -1) return null;

    const deletedUser = users.splice(userIndex, 1)[0];
    return deletedUser;
  }
}

// Dummy Product Model - In-memory operations
export class ProductModel {
  static async find(query: { category?: string } = {}): Promise<Product[]> {
    initializeData();
    if (query.category) {
      return products.filter(p => p.category === query.category);
    }
    return products;
  }

  static async findById(id: string): Promise<Product | null> {
    initializeData();
    return products.find(p => p.id === id) || null;
  }

  static async countDocuments(): Promise<number> {
    initializeData();
    return products.length;
  }

  static async create(productData: Partial<Product>): Promise<Product> {
    initializeData();
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

  static async findByIdAndUpdate(id: string, updateData: Partial<Omit<Product, 'id' | 'createdAt' | 'items'>>): Promise<Product | null> {
    initializeData();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;

    products[productIndex] = { ...products[productIndex], ...updateData, updatedAt: new Date() };
    return products[productIndex];
  }

  static async findOneAndUpdate(query: { id?: string }, updateData: Partial<Omit<Product, 'id' | 'createdAt' | 'items'>>, options?: { new: boolean }): Promise<Product | null> {
    initializeData();
    const productIndex = products.findIndex(p => p.id === query.id);
    if (productIndex === -1) return null;

    products[productIndex] = { ...products[productIndex], ...updateData, updatedAt: new Date() };
    return options?.new ? products[productIndex] : products[productIndex];
  }

  static async findOneAndDelete(query: { id?: string }): Promise<Product | null> {
    initializeData();
    const productIndex = products.findIndex(p => p.id === query.id);
    if (productIndex === -1) return null;

    const deletedProduct = products.splice(productIndex, 1)[0];
    return deletedProduct;
  }

  static async findByIdAndRemove(id: string): Promise<Product | null> {
    initializeData();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;

    const deletedProduct = products.splice(productIndex, 1)[0];
    return deletedProduct;
  }
}

// Dummy Order Model - In-memory operations
export class OrderModel {
  static async find(query: { userId?: string } = {}): Promise<Order[]> {
    initializeData();
    if (query.userId) {
      return orders.filter(o => o.userId === query.userId);
    }
    return orders;
  }

  static async findById(id: string): Promise<Order | null> {
    initializeData();
    return orders.find(o => o.id === id) || null;
  }

  static async countDocuments(): Promise<number> {
    initializeData();
    return orders.length;
  }

  static async create(orderData: Partial<Order>): Promise<Order> {
    initializeData();
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

  static async findByIdAndUpdate(id: string, updateData: Partial<Omit<Order, 'id' | 'createdAt' | 'items'>>): Promise<Order | null> {
    initializeData();
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return null;

    orders[orderIndex] = { ...orders[orderIndex], ...updateData, updatedAt: new Date() };
    return orders[orderIndex];
  }

  static async findOneAndUpdate(query: { id?: string }, updateData: Partial<Omit<Order, 'id' | 'createdAt' | 'items'>>, options?: { new: boolean }): Promise<Order | null> {
    initializeData();
    const orderIndex = orders.findIndex(o => o.id === query.id);
    if (orderIndex === -1) return null;

    orders[orderIndex] = { ...orders[orderIndex], ...updateData, updatedAt: new Date() };
    return options?.new ? orders[orderIndex] : orders[orderIndex];
  }
}

// Simple password functions (no hashing)
export const hashPassword = async (password: string): Promise<string> => {
  return password; // Just return plain text password
};

export const comparePassword = async (password: string, storedPassword: string): Promise<boolean> => {
  return password === storedPassword; // Simple string comparison
};

// Simple token functions (no JWT)
export const generateToken = (userId: string, role: string): string => {
  return `${userId}:${role}`; // Simple string format
};

export const verifyToken = (token: string): { userId: string; role: string } | null => {
  try {
    const [userId, role] = token.split(':');
    return { userId, role };
  } catch {
    return null;
  }
};

// Database connection simulation
export const connectToDatabase = async (): Promise<void> => {
  // Initialize data on client side
  initializeData();
};

// Get database models
export const getDatabaseModels = () => {
  return {
    UserModel,
    ProductModel,
    OrderModel
  };
};
