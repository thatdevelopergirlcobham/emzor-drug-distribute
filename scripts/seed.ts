import { UserModel, ProductModel } from '../lib/dummydata';
import { User, Product } from '@/types';

const seedData = async () => {
  try {
    console.log('Starting database seeding...');

    // Check if data already exists (this will always be true after clearAllData)
    const existingUsers = await UserModel.countDocuments();
    const existingProducts = await ProductModel.countDocuments();

    console.log(`Found ${existingUsers} users and ${existingProducts} products after initialization`);

    // Add additional users if needed
    if (existingUsers < 4) { // We start with 3 users (admin, supervisor, student)
      // Create additional test users
      const testUser: Partial<User> = {
        id: 'test-user-001',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role: 'USER',
      };
      await UserModel.create(testUser);
      console.log('Test user created');
    }

    // Add additional products if needed
    if (existingProducts < 10) { // We start with 6 products
      // Create additional sample products
      const additionalProducts: Partial<Product>[] = [
        {
          id: 'prod-007',
          name: 'Aspirin 100mg',
          category: 'Analgesics',
          price: 80,
          description: 'Common pain reliever and anti-inflammatory',
          imageUrl: '/images/aspirin.jpg',
          stock: 120,
        },
        {
          id: 'prod-008',
          name: 'Cetirizine 10mg',
          category: 'Antihistamines',
          price: 95,
          description: 'Allergy relief medication',
          imageUrl: '/images/cetirizine.jpg',
          stock: 90,
        },
        {
          id: 'prod-009',
          name: 'Omeprazole 20mg',
          category: 'Digestive',
          price: 250,
          description: 'Proton pump inhibitor for acid reflux',
          imageUrl: '/images/omeprazole.jpg',
          stock: 60,
        },
        {
          id: 'prod-010',
          name: 'Calcium Carbonate 500mg',
          category: 'Supplements',
          price: 110,
          description: 'Calcium supplement for bone health',
          imageUrl: '/images/calcium.jpg',
          stock: 180,
        }
      ];

      for (const product of additionalProducts) {
        await ProductModel.create(product);
      }
      console.log('Additional sample products created');
    }

    console.log('Database seeded successfully with dummy data');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
