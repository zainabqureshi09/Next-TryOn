import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import { productSchema } from "@/lib/validation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  const role = (session as any)?.user?.role;
  if (!session || role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const created = await Product.create(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
