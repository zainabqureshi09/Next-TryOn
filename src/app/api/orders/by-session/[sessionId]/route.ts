export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ====================
// 📦 GET /api/orders/by-session/[sessionId]
// ====================
export async function GET(_req: NextRequest, ctx: any) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const role = (session?.user as any)?.role;

    if (!session || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const params = (ctx && ctx.params) ? await ctx.params : { sessionId: undefined } as any;
    const order = await Order.findOne({ stripeSessionId: params?.sessionId }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Admins can view any order, users can only view their own
    if (role !== "admin" && (order as any).userId?.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error(`Error fetching order by session`, error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}
