"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import useCart from "@/hooks/use-cart";
import useTranslation from "@/hooks/use-translation";
import PaymentMethods from "@/components/checkout/PaymentMethods";

// Define proper types for cart items
interface CartItem {
  id?: string;
  _id?: string;
  name: string;
  price: number | string;
  qty: number | string;
  image?: string;
  frame?: string;
}

export default function CheckoutPage() {
  const { items, count, isLoading: cartLoading, subtotal: cartSubtotal } = useCart();
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    address: "",
    city: "",
    postalCode: "",
    country: "US",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cartSubtotal();
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  // Payment event handlers
  const handlePaymentStart = () => {
    setError(null);
    toast.loading("Processing payment...");
  };

  const handlePaymentSuccess = (data: any) => {
    toast.dismiss();
    toast.success("Payment successful!");
  };

  const handlePaymentError = (errorMessage: string) => {
    toast.dismiss();
    setError(errorMessage);
    toast.error(errorMessage);
  };

  // Empty cart check
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-400" />
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart to proceed with checkout.</p>
          <Link href="/shop" className="inline-flex items-center px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/cart" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Secure Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your order with multiple payment options</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg">
              <p className="font-medium">Payment Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                  {items.map((item: CartItem) => (
                    <div key={item.id || item._id} className="py-3 flex items-center">
                      <div className="w-12 h-12 relative bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="ml-3 flex-grow">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      </div>
                      <div className="font-medium text-sm">${(parseFloat((item.price as unknown) as string) * parseInt((item.qty as unknown) as string)).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({count()} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Information */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" 
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" 
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <PaymentMethods
                items={items.map((item) => ({
                  id: item.id || item._id || '',
                  name: item.name,
                  price: parseFloat((item.price as unknown) as string) || 0,
                  qty: parseInt((item.qty as unknown) as string) || 1,
                  image: item.image || '',
                  frame: (item as any).frame || '',
                }))}
                customerEmail={formData.email || session?.user?.email || ''}
                total={total}
                onPaymentStart={handlePaymentStart}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
