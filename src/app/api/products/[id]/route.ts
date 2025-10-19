export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { productSchema } from "@/lib/validation";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Params {
  params: { id: string };
}

import { IProduct } from "@/lib/models/Product"; // Import IProduct

export async function GET(_req: NextRequest, ctx: any) {
  await dbConnect();
  const params = (ctx && ctx.params) ? await ctx.params : { id: undefined } as any;
  const product = await Product.findById(params?.id).lean() as any;
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // For products without explicit variations, create a default one for display purposes
  if (!product.variations || product.variations.length === 0) {
    return NextResponse.json({
      ...product,
      variations: [{
        _id: product._id, // Use product ID as variation ID for simplicity
        sku: product.sku || `SKU-${product._id}`, // Assuming sku might exist at base level for old data
        price: product.price || 0, // Assuming price might exist at base level for old data
        stock: product.stock || 0, // Assuming stock might exist at base level for old data
        image: product.image || null, // Assuming image might exist at base level for old data
        attributes: [{ name: "Default", value: "Default" }],
        isActive: product.isActive,
      }],
    });
  }
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, ctx: any) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const allowed = await rateLimit(keyFromRequest(req, "products:put"), { intervalMs: 60_000, max: 40 });
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  await dbConnect();
  const body = await req.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const params = (ctx && ctx.params) ? await ctx.params : { id: undefined } as any;
  const updated = await Product.findByIdAndUpdate(params?.id, parsed.data, { new: true }).lean() as any;
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // For products without explicit variations, create a default one for display purposes
  if (!updated.variations || updated.variations.length === 0) {
    return NextResponse.json({
      ...updated,
      variations: [{
        _id: updated._id, // Use product ID as variation ID for simplicity
        sku: updated.sku || `SKU-${updated._id}`, // Assuming sku might exist at base level for old data
        price: updated.price || 0, // Assuming price might exist at base level for old data
        stock: updated.stock || 0, // Assuming stock might exist at base level for old data
        image: updated.image || null, // Assuming image might exist at base level for old data
        attributes: [{ name: "Default", value: "Default" }],
        isActive: updated.isActive,
      }],
    });
  }

  return NextResponse.json(updated);
}

export async function PATCH(req: NextRequest, ctx: any) {
  const allowed = await rateLimit(keyFromRequest(req, "products:patch"), { intervalMs: 60_000, max: 40 });
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  await dbConnect();
  const body = await req.json();
  
  // Simple validation for common updates
  if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
    return NextResponse.json({ error: "isActive must be a boolean" }, { status: 400 });
  }
  
  const params = (ctx && ctx.params) ? await ctx.params : { id: undefined } as any;
  const updated = await Product.findByIdAndUpdate(
    params?.id, 
    { $set: body, updatedAt: new Date() }, 
    { new: true }
  ).lean() as any;
  
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Product updated successfully", product: updated });
}

export async function DELETE(req: NextRequest, ctx: any) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const allowed = await rateLimit(keyFromRequest(req, "products:delete"), { intervalMs: 60_000, max: 20 });
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  await dbConnect();
  const params = (ctx && ctx.params) ? await ctx.params : { id: undefined } as any;
  await Product.findByIdAndDelete(params?.id);
  return NextResponse.json({ ok: true });
}
