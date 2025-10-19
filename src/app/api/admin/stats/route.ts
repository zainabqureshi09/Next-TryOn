export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    await dbConnect();

    const [productCount, orderCount, userCount, revenueAgg, recentOrders] = await Promise.all([
      Product.countDocuments().exec(),
      Order.countDocuments().exec(),
      User.countDocuments().exec(),
      Order.aggregate([
        { $match: { status: { $in: ["paid", "shipped"] } } },
        { $group: { _id: null, total: { $sum: "$subtotal" } } },
      ]).exec(),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .exec(),
    ]);

    const revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;
    
    // Get low stock products (less than 5 items)
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } })
      .sort({ stock: 1 })
      .limit(5)
      .lean()
      .exec();

    return NextResponse.json(
      { 
        productCount, 
        orderCount, 
        userCount, 
        revenue,
        recentOrders,
        lowStockProducts
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats", message: error.message },
      { status: 500 }
    );
  }
}


