"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Printer,
  XCircle
} from "lucide-react";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";

// Order type definition
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  frame?: string;
}

interface Order {
  _id: string;
  createdAt: string;
  total: number;
  status: string;
  items: OrderItem[];
  stripeSessionId: string;
  shippingAddress?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      postal_code: string;
      country: string;
    };
  };
}

function OrderDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch order details: ${res.status}`);
      }
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id, fetchOrderDetails]);

  // Remove these functions as they're replaced by the OrderStatusBadge component

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2">Loading order details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg shadow-md text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="mb-6">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-12">
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-6 rounded-lg shadow-md text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="mb-6">We couldn&apos;t find the order you&apos;re looking for.</p>
          <Button onClick={() => router.push('/account/orders')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center">
          <Button 
            onClick={() => router.push('/account/orders')} 
            variant="ghost" 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>

        <Card className="overflow-hidden shadow-md mb-8">
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex flex-wrap justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">Order #{order._id.substring(order._id.length - 8)}</h2>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <OrderStatusBadge status={order.status.toLowerCase() as any} size="md" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6">
            <h3 className="text-lg font-medium mb-4">Items</h3>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.productId} className="py-4 flex items-center">
                  <div className="w-20 h-20 relative bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-grow">
                    <Link href={`/product/${item.productId}`} className="font-medium hover:text-purple-600">
                      {item.name}
                    </Link>
                    {item.frame && <p className="text-sm text-gray-500">Frame: {item.frame}</p>}
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">$5.99</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>${(order.total + 5.99).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>

        {order.shippingAddress && (
          <Card className="overflow-hidden shadow-md mb-8">
            <div className="p-6 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-medium">Shipping Information</h3>
            </div>
            <div className="bg-white p-6">
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address.line1}</p>
                {order.shippingAddress.address.line2 && <p>{order.shippingAddress.address.line2}</p>}
                <p>
                  {order.shippingAddress.address.city}, {order.shippingAddress.address.state}{' '}
                  {order.shippingAddress.address.postal_code}
                </p>
                <p>{order.shippingAddress.address.country}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => window.print()}
            className="flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
          
          {(order.status === 'pending' || order.status === 'processing') && (
            <Button 
              variant="destructive"
              className="flex items-center"
              onClick={async () => {
                if (confirm('Are you sure you want to cancel this order?')) {
                  try {
                    const res = await fetch('/api/orders/cancel', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ orderId: order._id }),
                    });
                    
                    if (res.ok) {
                      // Refresh order data
                      fetchOrderDetails();
                      alert('Order cancelled successfully');
                    } else {
                      const error = await res.json();
                      alert(`Failed to cancel order: ${error.error}`);
                    }
                  } catch (err) {
                    console.error('Error cancelling order:', err);
                    alert('An error occurred while cancelling the order');
                  }
                }
              }}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
