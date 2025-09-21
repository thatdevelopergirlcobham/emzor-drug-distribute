'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useUser } from '@/context/UserContext';
import { ShippingAddress, PaymentDetails } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, placeOrder, getCartTotal } = useUser();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = getCartTotal();
  const deliveryFee = cartTotal > 10000 ? 0 : 500;
  const finalTotal = cartTotal + deliveryFee;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Shipping validation
    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingAddress.address.trim()) newErrors.address = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    // Payment validation
    if (!paymentDetails.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!paymentDetails.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!paymentDetails.cvv.trim()) newErrors.cvv = 'CVV is required';
    if (!paymentDetails.cardHolderName.trim()) newErrors.cardHolderName = 'Card holder name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!state.isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    setIsProcessing(true);

    try {
      await placeOrder({
        shippingAddress,
        paymentDetails,
      });

      // Redirect to success page or home
      router.push('/?order=success');
    } catch (error) {
      console.error('Order placement failed:', error);
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string, section: 'shipping' | 'payment') => {
    if (section === 'shipping') {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
    } else {
      setPaymentDetails(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart before checkout.</p>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors px-6 py-3 rounded-lg font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Cart</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Truck className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value, 'shipping')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value, 'shipping')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) => handleInputChange('address', e.target.value, 'shipping')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => handleInputChange('city', e.target.value, 'shipping')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => handleInputChange('state', e.target.value, 'shipping')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value, 'shipping')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Holder Name *
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.cardHolderName}
                    onChange={(e) => handleInputChange('cardHolderName', e.target.value, 'payment')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.cardHolderName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.cardHolderName && <p className="text-red-500 text-sm mt-1">{errors.cardHolderName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value, 'payment')}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value, 'payment')}
                      placeholder="MM/YY"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value, 'payment')}
                      placeholder="123"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({state.cart.length} items)</span>
                  <span className="font-semibold">₦{cartTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                    {deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₦{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {!state.isAuthenticated && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700 text-sm">Please sign in to place your order</p>
                  <Link
                    href="/login"
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Sign in here
                  </Link>
                </div>
              )}

              {errors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || !state.isAuthenticated}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 transition-colors py-3 px-4 rounded-lg font-semibold text-center block mt-6"
              >
                {isProcessing ? 'Processing...' : `Place Order - ₦${finalTotal.toLocaleString()}`}
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Secure Checkout</span>
              </div>
              <p className="text-sm text-green-700">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
