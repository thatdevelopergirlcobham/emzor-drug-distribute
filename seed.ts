import fs from 'fs/promises';
import path from 'path';
import { User, Product, Order } from './types';

const dataPath = path.join(process.cwd(), 'data');
const usersPath = path.join(dataPath, 'users.json');
const productsPath = path.join(dataPath, 'products.json');
const ordersPath = path.join(dataPath, 'orders.json');

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');

    // Seed users
    const demoUsers: Omit<User, 'createdAt' | 'updatedAt'>[] = [
      {
        id: 'admin-001',
        name: 'System Administrator',
        email: 'admin@emzor.com',
        password: 'password',
        role: 'ADMIN',
      },
      {
        id: 'supervisor-001',
        name: 'John Supervisor',
        email: 'supervisor@emzor.com',
        password: 'password',
        role: 'SUPERVISOR',
      },
      {
        id: 'student-001',
        name: 'Jane Student',
        email: 'student@emzor.com',
        password: 'password',
        role: 'STUDENT',
      },
    ];
    await fs.writeFile(usersPath, JSON.stringify(demoUsers, null, 2));
    console.log(`✅ Seeded ${demoUsers.length} users`);

    // Seed products
    const demoProducts: Omit<Product, 'createdAt' | 'updatedAt'>[] = [
      {
        id: 'prod-001',
        name: 'Paracetamol 500mg',
        category: 'Analgesics',
        price: 150,
        description: 'Effective pain relief and fever reducer',
        imageUrl: '/images/paractamol.jpg',
        stock: 100,
      },
      {
        id: 'prod-002',
        name: 'Amoxicillin 250mg',
        category: 'Antibiotics',
        price: 200,
        description: 'Broad-spectrum antibiotic for bacterial infections',
        imageUrl: '/images/amoxil.webp',
        stock: 50,
      },
      {
        id: 'prod-003',
        name: 'Vitamin C 1000mg',
        category: 'Vitamins',
        price: 300,
        description: 'Immune system booster with antioxidant properties',
        imageUrl: '/images/vitamin.jpg',
        stock: 200,
      },
    ];
    await fs.writeFile(productsPath, JSON.stringify(demoProducts, null, 2));
    console.log(`✅ Seeded ${demoProducts.length} products`);

    // Seed orders
    const demoOrders: Omit<Order, 'createdAt' | 'updatedAt'>[] = [];
    await fs.writeFile(ordersPath, JSON.stringify(demoOrders, null, 2));
    console.log(`✅ Seeded ${demoOrders.length} orders`);

    console.log('🎉 Data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
