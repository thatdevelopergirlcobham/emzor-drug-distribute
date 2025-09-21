'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ArrowRight, Shield, Truck, Phone } from 'lucide-react';
import Header from '@/components/layout/Header';
import ProductCard from '@/components/products/ProductCard';
import { useData } from '@/context/DataContext';

export default function Home() {
  const { state, fetchProducts } = useData();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = state.products.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl text-blue-600 md:text-6xl font-bold mb-6">
              Your Health, Our Priority
            </h1>
            <p className="text-xl text-black md:text-2xl mb-8 text-blue-60 max-w-3xl mx-auto">
              Trusted pharmaceutical products for better health and wellness.
              Quality medicines and healthcare solutions you can rely on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-blue-600 text-white transition-colors px-8 py-3 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/#about"
                className="border-2 border-white text-blue-600 transition-colors px-8 py-3 rounded-lg font-semibold text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">All products meet international quality standards and are approved by regulatory authorities.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery service to ensure you get your medications when you need them.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support from our qualified healthcare professionals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and trusted pharmaceutical products
            </p>
          </div>

          {state.loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-8 py-3 rounded-lg font-semibold"
            >
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Product Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find the right medication for your health needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Pain & Fever', icon: '💊', color: 'bg-red-100 text-red-600' },
              { name: 'Antibiotics', icon: '🦠', color: 'bg-blue-100 text-blue-600' },
              { name: 'Vitamins', icon: '🧴', color: 'bg-green-100 text-green-600' },
              { name: 'Cough & Cold', icon: '🤧', color: 'bg-purple-100 text-purple-600' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
              >
                <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Help Finding the Right Product?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Our qualified pharmacists are here to help you choose the right medication for your health needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+234-123-4567"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors px-8 py-3 rounded-lg font-semibold text-lg"
            >
              Call Now: +234-123-4567
            </a>
            <Link
              href="/#contact"
              className="border-2 border-white text-white hover:bg-white hover:text-primary transition-colors px-8 py-3 rounded-lg font-semibold text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-bold text-xl inline-block mb-4">
                EMZOR
              </div>
              <p className="text-gray-300">
                Your trusted partner for quality pharmaceutical products and healthcare solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/#categories" className="hover:text-white transition-colors">Categories</Link></li>
                <li><Link href="/#about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="tel:+234-123-4567" className="hover:text-white transition-colors">+234-123-4567</a></li>
                <li><a href="mailto:info@emzor.com" className="hover:text-white transition-colors">info@emzor.com</a></li>
                <li>Mon - Fri: 8AM - 6PM</li>
                <li>Sat: 9AM - 4PM</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Emzor Pharmaceutical. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
