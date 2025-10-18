"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Heart,
  ShoppingBag,
  MapPin,
  Settings,
  Package,
  Clock,
  Star,
  Edit3,
  Plus,
  Eye,
  Trash2,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface Order {
  _id: string;
  items: any[];
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface WishlistItem {
  productId: string;
  addedAt: string;
  priceWhenAdded: number;
  product: any;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    if (session) {
      fetchAccountData();
    }
  }, [session]);

  const fetchAccountData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.data || []);
      }

      // Fetch wishlist
      const wishlistRes = await fetch('/api/wishlist');
      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        setWishlist(wishlistData.data?.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch account data:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlist(prev => prev.filter(item => item.productId !== productId));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(order => order.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your orders, wishlist, and account settings</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{session.user?.name}</h3>
                    <p className="text-sm text-gray-600">{session.user?.email}</p>
                    {(session.user as any)?.role === 'admin' && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs mt-1">Admin</Badge>
                    )}
                  </div>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "overview" 
                        ? "bg-purple-100 text-purple-700" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "orders" 
                        ? "bg-purple-100 text-purple-700" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    Orders ({orders.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "wishlist" 
                        ? "bg-purple-100 text-purple-700" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    Wishlist ({wishlist.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "settings" 
                        ? "bg-purple-100 text-purple-700" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Spent</p>
                          <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Wishlist Items</p>
                          <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
                        </div>
                        <Heart className="w-8 h-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Orders</CardTitle>
                      <Button variant="outline" onClick={() => setActiveTab("orders")}>
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {recentOrders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No orders yet</p>
                        <Link href="/shop">
                          <Button className="mt-4">Start Shopping</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium">Order #{order._id.slice(-8)}</p>
                                <p className="text-sm text-gray-600">
                                  {order.items.length} items • ${order.total.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge 
                                className={
                                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Wishlist */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Wishlist</CardTitle>
                      <Button variant="outline" onClick={() => setActiveTab("wishlist")}>
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {wishlist.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Your wishlist is empty</p>
                        <Link href="/shop">
                          <Button className="mt-4">Discover Products</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {wishlist.slice(0, 4).map((item) => (
                          <div key={item.productId} className="group relative">
                            <Link href={`/product/${item.productId}`}>
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={item.product?.image || "/placeholder.png"}
                                  alt={item.product?.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                            </Link>
                            <button
                              onClick={() => removeFromWishlist(item.productId)}
                              className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                            <div className="mt-2">
                              <p className="font-medium text-sm truncate">{item.product?.name}</p>
                              <p className="text-sm text-gray-600">${item.product?.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
                </div>

                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                      <Link href="/shop">
                        <Button>Browse Products</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order._id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">Order #{order._id.slice(-8)}</h3>
                              <p className="text-sm text-gray-600">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge 
                                className={
                                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }
                              >
                                {order.status}
                              </Badge>
                              <p className="text-lg font-bold mt-1">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {order.items.map((item: any, index: number) => (
                              <div key={index} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.image || "/placeholder.png"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">
                                    Quantity: {item.qty} • ${item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                              {order.items.length} items
                            </p>
                            <Link href={`/account/orders/${order._id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                  {wishlist.length > 0 && (
                    <p className="text-gray-600">{wishlist.length} items</p>
                  )}
                </div>

                {wishlist.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-6">Save your favorite products to buy them later</p>
                      <Link href="/shop">
                        <Button>Discover Products</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.productId} className="relative">
                        <ProductCard
                          product={item.product}
                          isInWishlist={true}
                          onAddToWishlist={() => removeFromWishlist(item.productId)}
                        />
                        <div className="mt-2 text-xs text-gray-500">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                          {item.priceWhenAdded !== item.product.price && (
                            <span className="text-green-600 ml-2">
                              Price dropped!
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>

                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <p className="text-gray-900">{session.user?.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <p className="text-gray-900">{session.user?.email}</p>
                      </div>
                      <Button variant="outline">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive updates about orders and promotions</p>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Privacy Settings</p>
                          <p className="text-sm text-gray-600">Control your data and privacy preferences</p>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}