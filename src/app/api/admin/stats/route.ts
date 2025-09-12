import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";

export async function GET() {
  await dbConnect();
  const [productCount, orderCount, revenueAgg] = await Promise.all([
    Product.countDocuments({}),
    Order.countDocuments({}),
    Order.aggregate([
      { $match: { status: { $in: ["paid", "shipped"] } } },
      { $group: { _id: null, total: { $sum: "$subtotal" } } },
    ]),
  ]);
  const revenue = revenueAgg[0]?.total || 0;
  return NextResponse.json({ productCount, orderCount, revenue });
}

