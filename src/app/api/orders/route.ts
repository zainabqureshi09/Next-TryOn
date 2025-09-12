import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/lib/models/Order";
import { orderSchema } from "@/lib/validation";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";

export async function GET() {
  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const allowed = await rateLimit(keyFromRequest(req, "orders:post"), { intervalMs: 60_000, max: 10 });
    if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    await dbConnect();
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const subtotal = parsed.data.items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 0), 0);
    const created = await Order.create({ ...parsed.data, subtotal, status: "pending" });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create order" }, { status: 400 });
  }
}
