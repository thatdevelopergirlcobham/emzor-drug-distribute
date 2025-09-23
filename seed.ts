import { connectToDatabase, getDatabaseModels, hashPassword } from './lib/mongodb';
import { User, Product, Allocation, Order } from './types';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    await connectToDatabase();
    const { UserModel, ProductModel, AllocationModel, OrderModel } = getDatabaseModels();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await UserModel.deleteMany({});
    await ProductModel.deleteMany({});
    await AllocationModel.deleteMany({});
    await OrderModel.deleteMany({});

    // Seed demo users
    console.log('👥 Creating demo users...');
    const hashedPassword = await hashPassword('password');

    const demoUsers: User[] = [
      {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@emzor.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
      {
        id: 'supervisor-001',
        name: 'Supervisor User',
        email: 'supervisor@emzor.com',
        password: hashedPassword,
        role: 'SUPERVISOR',
      },
      {
        id: 'student-001',
        name: 'Student User',
        email: 'student@emzor.com',
        password: hashedPassword,
        role: 'STUDENT',
      },
      {
        id: 'student-002',
        name: 'John Doe',
        email: 'john@emzor.com',
        password: hashedPassword,
        role: 'STUDENT',
      },
      {
        id: 'student-003',
        name: 'Jane Smith',
        email: 'jane@emzor.com',
        password: hashedPassword,
        role: 'STUDENT',
      },
    ];

    await UserModel.insertMany(demoUsers);
    console.log(`✅ Created ${demoUsers.length} demo users`);

    // Seed demo products
    console.log('📦 Creating demo products...');
    const demoProducts: Product[] = [
      {
        id: 'prod-001',
        name: 'Paracetamol 500mg',
        category: 'Analgesics',
        price: 2500,
        description: 'Effective pain relief and fever reducer',
        imageUrl: 'https://via.placeholder.com/300x300?text=Paracetamol',
        stock: 100,
      },
      {
        id: 'prod-002',
        name: 'Amoxicillin 250mg',
        category: 'Antibiotics',
        price: 4500,
        description: 'Broad-spectrum antibiotic for bacterial infections',
        imageUrl: 'https://via.placeholder.com/300x300?text=Amoxicillin',
        stock: 75,
      },
      {
        id: 'prod-003',
        name: 'Vitamin C 1000mg',
        category: 'Vitamins',
        price: 3200,
        description: 'Immune system booster and antioxidant',
        imageUrl: 'https://via.placeholder.com/300x300?text=Vitamin+C',
        stock: 150,
      },
      {
        id: 'prod-004',
        name: 'Ibuprofen 400mg',
        category: 'Analgesics',
        price: 2800,
        description: 'Anti-inflammatory and pain relief medication',
        imageUrl: 'https://via.placeholder.com/300x300?text=Ibuprofen',
        stock: 90,
      },
      {
        id: 'prod-005',
        name: 'Omeprazole 20mg',
        category: 'Gastrointestinal',
        price: 5200,
        description: 'Proton pump inhibitor for acid reflux',
        imageUrl: 'https://via.placeholder.com/300x300?text=Omeprazole',
        stock: 60,
      },
      {
        id: 'prod-006',
        name: 'Cetirizine 10mg',
        category: 'Antihistamines',
        price: 2100,
        description: 'Allergy relief medication',
        imageUrl: 'https://via.placeholder.com/300x300?text=Cetirizine',
        stock: 120,
      },
    ];

    await ProductModel.insertMany(demoProducts);
    console.log(`✅ Created ${demoProducts.length} demo products`);

    // Seed demo allocations
    console.log('📋 Creating demo allocations...');
    const demoAllocations: Allocation[] = [
      {
        id: 'alloc-001',
        title: 'Inventory Management Training',
        description: 'Complete training on proper inventory management procedures',
        assignedTo: 'student-001',
        assignedBy: 'supervisor-001',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        id: 'alloc-002',
        title: 'Customer Service Excellence',
        description: 'Learn and implement best practices for customer service',
        assignedTo: 'student-002',
        assignedBy: 'supervisor-001',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },
      {
        id: 'alloc-003',
        title: 'Quality Control Procedures',
        description: 'Master quality control procedures for pharmaceutical products',
        assignedTo: 'student-003',
        assignedBy: 'supervisor-001',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        id: 'alloc-004',
        title: 'Documentation Standards',
        description: 'Learn proper documentation standards for pharmaceutical operations',
        assignedTo: 'student-001',
        assignedBy: 'supervisor-001',
        status: 'PENDING',
        priority: 'LOW',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      },
    ];

    await AllocationModel.insertMany(demoAllocations);
    console.log(`✅ Created ${demoAllocations.length} demo allocations`);

    // Seed demo orders
    console.log('🛒 Creating demo orders...');
    const demoOrders: Order[] = [
      {
        id: 'order-001',
        userId: 'student-001',
        items: [
          {
            product: demoProducts[0], // Paracetamol
            quantity: 2,
            price: 2500,
          },
          {
            product: demoProducts[2], // Vitamin C
            quantity: 1,
            price: 3200,
          },
        ],
        total: 8200,
        status: 'DELIVERED',
        shippingAddress: {
          fullName: 'Student User',
          phone: '+2341234567890',
          address: '123 Main Street',
          city: 'Lagos',
          state: 'Lagos',
          postalCode: '100001',
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'order-002',
        userId: 'student-002',
        items: [
          {
            product: demoProducts[3], // Ibuprofen
            quantity: 3,
            price: 2800,
          },
        ],
        total: 8400,
        status: 'SHIPPED',
        shippingAddress: {
          fullName: 'John Doe',
          phone: '+2341234567891',
          address: '456 Oak Avenue',
          city: 'Abuja',
          state: 'FCT',
          postalCode: '900001',
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'order-003',
        userId: 'student-003',
        items: [
          {
            product: demoProducts[1], // Amoxicillin
            quantity: 1,
            price: 4500,
          },
          {
            product: demoProducts[5], // Cetirizine
            quantity: 2,
            price: 2100,
          },
        ],
        total: 8700,
        status: 'PENDING',
        shippingAddress: {
          fullName: 'Jane Smith',
          phone: '+2341234567892',
          address: '789 Pine Road',
          city: 'Port Harcourt',
          state: 'Rivers',
          postalCode: '500001',
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    await OrderModel.insertMany(demoOrders);
    console.log(`✅ Created ${demoOrders.length} demo orders`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Users: ${demoUsers.length}`);
    console.log(`   • Products: ${demoProducts.length}`);
    console.log(`   • Allocations: ${demoAllocations.length}`);
    console.log(`   • Orders: ${demoOrders.length}`);

    console.log('\n🔑 Demo Credentials:');
    console.log('   • Admin: admin@emzor.com / password');
    console.log('   • Supervisor: supervisor@emzor.com / password');
    console.log('   • Student: student@emzor.com / password');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
