import { connectToDatabase, UserModel, ProductModel, hashPassword } from '@/lib/mongodb';
import { User, Product } from '@/types';

const seedData = async () => {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    // Check if data already exists
    const existingUsers = await UserModel.countDocuments();
    const existingProducts = await ProductModel.countDocuments();

    if (existingUsers > 0) {
      console.log('Users already exist, skipping seed');
    } else {
      // Create initial admin user
      const adminPassword = await hashPassword('password');
      const adminUser: Partial<User> = {
        id: 'admin-001',
        name: 'System Administrator',
        email: 'admin@emzor.com',
        password: adminPassword,
        role: 'ADMIN',
      };
      await UserModel.create(adminUser);
      console.log('Admin user created');

      // Create initial supervisor user
      const supervisorPassword = await hashPassword('password');
      const supervisorUser: Partial<User> = {
        id: 'supervisor-001',
        name: 'John Supervisor',
        email: 'supervisor@emzor.com',
        password: supervisorPassword,
        role: 'SUPERVISOR',
      };
      await UserModel.create(supervisorUser);
      console.log('Supervisor user created');

      // Create initial student user
      const studentPassword = await hashPassword('password');
      const studentUser: Partial<User> = {
        id: 'student-001',
        name: 'Jane Student',
        email: 'student@emzor.com',
        password: studentPassword,
        role: 'STUDENT',
      };
      await UserModel.create(studentUser);
      console.log('Student user created');
    }

    if (existingProducts > 0) {
      console.log('Products already exist, skipping seed');
    } else {
      // Create sample products
      const products: Partial<Product>[] = [
        {
          id: 'prod-001',
          name: 'Paracetamol 500mg',
          category: 'Analgesics',
          price: 150,
          description: 'Effective pain relief and fever reducer',
          imageUrl: '/images/paracetamol.jpg',
          stock: 100,
        },
        {
          id: 'prod-002',
          name: 'Amoxicillin 250mg',
          category: 'Antibiotics',
          price: 200,
          description: 'Broad-spectrum antibiotic for bacterial infections',
          imageUrl: '/images/amoxicillin.jpg',
          stock: 50,
        },
        {
          id: 'prod-003',
          name: 'Vitamin C 1000mg',
          category: 'Vitamins',
          price: 300,
          description: 'Immune system booster with antioxidant properties',
          imageUrl: '/images/vitamin-c.jpg',
          stock: 200,
        },
        {
          id: 'prod-004',
          name: 'Ibuprofen 400mg',
          category: 'Anti-inflammatory',
          price: 180,
          description: 'Reduces inflammation, pain, and fever',
          imageUrl: '/images/ibuprofen.jpg',
          stock: 75,
        },
        {
          id: 'prod-005',
          name: 'Multivitamin Complex',
          category: 'Vitamins',
          price: 450,
          description: 'Complete daily vitamin and mineral supplement',
          imageUrl: '/images/multivitamin.jpg',
          stock: 150,
        },
        {
          id: 'prod-006',
          name: 'Antacid Tablets',
          category: 'Digestive',
          price: 120,
          description: 'Fast relief from heartburn and indigestion',
          imageUrl: '/images/antacid.jpg',
          stock: 80,
        },
      ];

      await ProductModel.insertMany(products);
      console.log('Sample products created');
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
