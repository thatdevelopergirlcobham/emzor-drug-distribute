# Emzor Pharmaceutical Distribution System

A complete pharmaceutical distribution management system with role-based dashboards built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

## Features

### 🔐 Authentication & Authorization
- **Multi-Role Authentication**: Admin, Supervisor, and Student roles
- **Secure Login/Registration**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Conditional rendering based on user roles
- **Persistent Sessions**: Automatic login state management

### 👨‍💼 Admin Dashboard
- **User Management**: Create, edit, and delete user accounts
- **Product Management**: Full CRUD operations on products with live inventory tracking
- **Order Management**: View and manage all customer orders
- **System Statistics**: Real-time dashboard with MongoDB data
- **Allocation Management**: Oversee task allocations and assignments

### 👨‍🏫 Supervisor Dashboard
- **Task Allocation**: Create and assign tasks to students
- **Progress Tracking**: Monitor student progress on assigned tasks
- **Student Management**: View and manage assigned students
- **Performance Analytics**: Track completion rates and overdue tasks

### 🎓 Student Dashboard
- **Task Management**: View assigned tasks and update progress
- **Personal Dashboard**: Track personal performance and deadlines
- **Progress Updates**: Update task status and completion
- **Due Date Tracking**: Monitor upcoming and overdue assignments

### 🛍️ E-Commerce Features
- **Product Catalog**: Browse pharmaceutical products with categories
- **Shopping Cart**: Add and manage products (login required)
- **Order Processing**: Complete checkout with shipping details
- **User Accounts**: Registration and profile management

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom Emzor brand colors
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **State Management**: React Context API with custom hooks
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local installation or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emzor-distribution
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/emzor-distribution
   # or for cloud MongoDB:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/emzor-distribution

   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

### MongoDB Setup

1. **Local MongoDB**:
   - Install MongoDB Community Edition
   - Start MongoDB service: `mongod`
   - The app will automatically create the required collections

2. **Cloud MongoDB** (Recommended):
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string from the cluster settings
   - Replace `MONGODB_URI` in `.env.local`

### Initial Admin User

To create the first admin user, you can register through the application:
- Go to `/register`
- Select "Administrator" as the role
- Fill in your details
- Use the admin credentials to access the admin dashboard

## User Roles & Access

### 👨‍💼 Administrator
- **Access**: Full system access
- **Dashboard**: `/admin/dashboard`
- **Features**: User management, product management, order management, system statistics
- **Permissions**: Create/edit/delete users, products, orders, allocations

### 👨‍🏫 Supervisor
- **Access**: Task allocation and student management
- **Dashboard**: `/supervisor/dashboard`
- **Features**: Create allocations, monitor student progress, generate reports
- **Permissions**: Create/manage task allocations, view assigned students

### 🎓 Student
- **Access**: Personal task management
- **Dashboard**: `/student/dashboard`
- **Features**: View assigned tasks, update progress, track deadlines
- **Permissions**: Update task status, view personal assignments

## Authentication Flow

1. **Registration**: Users can register with any role (Admin/Supervisor/Student)
2. **Login**: Unified login page with role-based redirection
3. **Dashboard Access**: Automatic redirection to appropriate dashboard based on role
4. **Session Management**: JWT tokens stored in localStorage with automatic refresh

## Demo Credentials

Use these credentials to test the application:

### Administrator
- **Email**: `admin@emzor.com`
- **Password**: `password`
- **Access**: Admin dashboard with full system access

### Supervisor
- **Email**: `supervisor@emzor.com`
- **Password**: `password`
- **Access**: Supervisor dashboard for task allocation

### Student
- **Email**: `student@emzor.com`
- **Password**: `password`
- **Access**: Student dashboard for task management

## Project Structure

```
emzor-distribution/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin routes (protected)
│   ├── user/ 
│   ├── login/             # Authentication pages
│   ├── register/          # User registration
│   └── ...                # Other public pages
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ...               # Feature-specific components
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useUsers.ts       # User management hook
│   ├── useProducts.ts    # Product management hook
│   ├── useOrders.ts      # Order management hook
│   └── useAllocations.ts # Task allocation hook
├── lib/                  # Utility libraries
│   └── mongodb.ts        # Database connection and models
└── types/               # TypeScript type definitions
```

## API Integration

The application uses MongoDB as the backend database with the following models:

- **Users**: Authentication and role management
- **Products**: Pharmaceutical product catalog
- **Orders**: Customer order management
- **Allocations**: Task assignment system

All data operations are handled through custom React hooks that provide:
- Real-time data fetching
- Optimistic updates
- Error handling
- Loading states

## Development Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Features in Detail

### User Management
- ✅ Role-based user registration
- ✅ Secure password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Session persistence
- ✅ Role-based access control

### Dashboard Features
- ✅ Real-time data from MongoDB
- ✅ Role-specific dashboards
- ✅ Interactive data tables
- ✅ Statistics and analytics
- ✅ Progress tracking

### Task Allocation System
- ✅ Create and assign tasks
- ✅ Priority levels (Low/Medium/High)
- ✅ Due date tracking
- ✅ Status updates (Pending/In Progress/Completed)
- ✅ Overdue task alerts

## Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Server-side route protection
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Secure error messages without data leakage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to Emzor Pharmaceutical.

## Support

For technical support or questions, please contact the development team.
