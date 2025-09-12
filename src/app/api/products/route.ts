import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import { productSchema } from "@/lib/validation";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";

export async function GET() {
  await dbConnect();
  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const allowed = await rateLimit(keyFromRequest(req, "products:post"), { intervalMs: 60_000, max: 20 });
    if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    await dbConnect();
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const created = await Product.create(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create" }, { status: 400 });
  }
}
