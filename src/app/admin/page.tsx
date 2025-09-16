import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Users, Plus, Eye } from "lucide-react";

async function getStats() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/admin/stats`, { cache: "no-store" });
  if (!res.ok) {
    return { productCount: 0, orderCount: 0, revenue: 0, userCount: 0 };
  }
  return res.json();
}

export default async function AdminHome() {
  const stats = await getStats();

  const statCards = [
    {
      title: "Total Products",
      value: stats.productCount || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Orders",
      value: stats.orderCount || 0,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Revenue",
      value: `$${Number(stats.revenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Users",
      value: stats.userCount || 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const quickActions = [
    {
      title: "Add New Product",
      description: "Create a new product listing",
      href: "/admin/products/new",
      icon: Plus,
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Manage Products",
      description: "View and edit existing products",
      href: "/admin/products",
      icon: Package,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "View Orders",
      description: "Manage customer orders",
      href: "/admin/orders",
      icon: Eye,
      color: "bg-green-600 hover:bg-green-700",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the LensVision admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color} text-white`}>
                      <ActionIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card className="p-6">
          <p className="text-gray-600">Recent activity will be displayed here...</p>
        </Card>
      </div>
    </div>
  );
}
