import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";

export async function GET() {
  try {
    await dbConnect();

    const [productCount, orderCount, revenueAgg] = await Promise.all([
      Product.countDocuments().exec(),
      Order.countDocuments().exec(),
      Order.aggregate([
        { $match: { status: { $in: ["paid", "shipped"] } } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$subtotal" } } } }, // safe casting
      ]),
    ]);

    const revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    return NextResponse.json(
      { productCount, orderCount, revenue },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
