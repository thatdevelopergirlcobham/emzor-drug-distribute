# Emzor Pharmaceutical E-Commerce Website

A complete and professional e-commerce website for Emzor Pharmaceutical built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🛍️ E-Commerce Functionality
- **Product Catalog**: Browse, search, and filter products
- **Shopping Cart**: Add, remove, and update quantities
- **Checkout Process**: Complete order placement with shipping and payment forms
- **Product Details**: Detailed product pages with images and descriptions
- **Category Navigation**: Organized product categories

### 👨‍💼 Admin Dashboard
- **Product Management**: Add, edit, and delete products
- **Inventory Tracking**: Monitor product inventory and statistics
- **User Authentication**: Secure admin login system
- **Order Management**: View and manage customer orders

### 🎨 Design & UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with Emzor branding
- **Interactive Elements**: Smooth animations and transitions
- **Accessibility**: Built with accessibility best practices

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom Emzor brand colors
- **Icons**: Lucide React
- **State Management**: React Context API
- **Backend**: JSON Server (mock API)
- **Development**: Concurrently for running multiple servers

## Getting Started

### Prerequisites

- Node.js 18+
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

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the JSON server (on port 3001) and the Next.js development server (on port 3000).

### Admin Access

To access the admin dashboard:

1. Go to `/login`
2. Click on "Admin Login" tab
3. Use the following credentials:
   - **Email**: `admin@emzor.com`
   - **Password**: `password`

### User Authentication

To test user authentication:

1. **Customer Login**: Go to `/login` and use "Customer Login" tab
   - **Email**: `user@example.com`
   - **Password**: `password`

2. **User Registration**: Go to `/register` to create new accounts

### Cart & Checkout Access

- **Cart**: `/cart` - Requires user authentication
- **Checkout**: `/checkout` - Requires user authentication
- Unauthenticated users will be redirected to login page

## Project Structure

```
emzor-distribution/
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin routes (protected)
│   ├── admin/login/       # Admin login page
│   ├── cart/              # Shopping cart page (protected)
│   ├── checkout/          # Checkout page (protected)
│   ├── login/             # User/Admin login page
│   ├── register/          # User registration page
│   ├── account/           # User account page
│   ├── products/          # Products listing and detail pages
│   └── ...                # Other pages
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── layout/           # Layout components (Header, etc.)
│   ├── products/         # Product-related components
│   └── shared/           # Shared/reusable components
├── context/              # React Context providers
│   ├── UserContext.tsx   # User authentication and cart
│   ├── AdminContext.tsx  # Admin authentication
│   └── DataContext.tsx   # Product data management
├── types/               # TypeScript type definitions
├── db.json             # Mock database
└── public/             # Static assets
```

## API Endpoints

The application uses JSON Server as a mock backend running on `http://localhost:3001`:

- **GET** `/products` - Get all products
- **GET** `/products/:id` - Get single product
- **POST** `/products` - Create new product
- **PUT** `/products/:id` - Update product
- **DELETE** `/products/:id` - Delete product
- **POST** `/orders` - Create new order
- **GET** `/users` - Get users (for admin authentication)

## Brand Guidelines

The application follows Emzor's official branding:

- **Primary Color**: `#0057b8` (Emzor Blue)
- **Secondary Color**: `#f37021` (Emzor Orange)
- **Typography**: Poppins font family
- **Theme**: Clean, professional light theme

## Development Scripts

- `npm run dev` - Start both JSON server and Next.js development server
- `npm run dev:server` - Start only JSON server (port 3001)
- `npm run dev:client` - Start only Next.js development server (port 3000)
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Features in Detail

### Customer Features
- ✅ Product browsing and search
- ✅ User registration and authentication
- ✅ Protected shopping cart (login required)
- ✅ Protected checkout process (login required)
- ✅ Responsive design for all devices
- ✅ Product categories and filtering
- ✅ Order placement and confirmation
- ✅ User account management

### Admin Features
- ✅ Secure admin login system
- ✅ Product CRUD operations
- ✅ Dashboard with statistics
- ✅ Product management interface
- ✅ Order management system

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
