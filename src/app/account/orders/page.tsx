"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { 
  Loader2, 
  Package, 
  ShoppingBag, 
  ExternalLink 
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

function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'newest',
    search: '',
    dateRange: 'all'
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.status && filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      if (filters.sortBy) {
        // Convert frontend sort options to match backend expectations
        let backendSortBy = filters.sortBy;
        if (filters.sortBy === 'highest') backendSortBy = 'highestTotal';
        if (filters.sortBy === 'lowest') backendSortBy = 'lowestTotal';
        queryParams.append('sortBy', backendSortBy);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.dateRange && filters.dateRange !== 'all') {
        queryParams.append('dateRange', filters.dateRange);
      }
      
      const res = await fetch(`/api/orders?${queryParams}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status}`);
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, fetchOrders]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="mb-6">Please sign in to view your order history.</p>
          <Link 
            href="/auth/signin" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">View and track your order history</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">You haven&apos;t placed any orders yet.</p>
            <Link 
              href="/shop" 
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-wrap justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold">Order #{order._id.substring(order._id.length - 8)}</h2>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <OrderStatusBadge status={order.status.toLowerCase() as any} />
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">
                      Total: <span className="font-bold">${order.total.toFixed(2)}</span>
                    </p>
                    <Link
                      href={`/account/orders/${order._id}`}
                      className="text-sm font-medium text-purple-600 hover:text-purple-500 flex items-center"
                    >
                      View Details <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
