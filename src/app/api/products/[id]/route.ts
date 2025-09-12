import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import { productSchema } from "@/lib/validation";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  await dbConnect();
  const product = await Product.findById(params.id).lean();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: Params) {
  const allowed = await rateLimit(keyFromRequest(req, "products:put"), { intervalMs: 60_000, max: 40 });
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  await dbConnect();
  const body = await req.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await Product.findByIdAndUpdate(params.id, parsed.data, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
  const allowed = await rateLimit(keyFromRequest(req, "products:delete"), { intervalMs: 60_000, max: 20 });
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  await dbConnect();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
