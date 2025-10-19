export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/lib/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  options?: Record<string, any>;
}

let tempCart: CartItem[] = [];

function calculateSubtotal(items: CartItem[] = []): number {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((total, item) => total + (item.price || 0) * (item.qty || 0), 0);
}

function calculateItemCount(items: CartItem[] = []): number {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((count, item) => count + (item.qty || 0), 0);
}

// --- 🔄 PATCH: Update quantity ---
export async function PATCH(req: NextRequest, ctx: any) {
  try {

    const body = await req.json().catch(() => ({}));
    const params = (ctx && ctx.params) ? await ctx.params : { id: undefined } as any;
    const id = params?.id as string;
    const qty = Number(body.qty);

    if (!id) return NextResponse.json({ success: false, error: "Missing item ID" }, { status: 400 });
    if (Number.isNaN(qty) || qty < 0)
      return NextResponse.json({ success: false, error: "Invalid quantity" }, { status: 400 });

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || session?.user?.email;

    if (userId) {
      await dbConnect();
      const cart = await Cart.findOne({ userId }).lean();
      if (!cart) return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });

      const items = [...(cart.items as any)] as CartItem[];
      const index = items.findIndex((i) => i.id === id);
      if (index === -1) return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });

      if (qty === 0) items.splice(index, 1);
      else items[index].qty = Math.min(99, qty);

      await Cart.findOneAndUpdate({ userId }, { items, updatedAt: new Date() }, { upsert: true });

      return NextResponse.json({
        success: true,
        message: "Cart updated",
        cart: items,
        subtotal: calculateSubtotal(items),
        itemCount: calculateItemCount(items),
      });
    }

    // Guest
    const index = tempCart.findIndex((i) => i.id === id);
    if (index === -1) return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    if (qty === 0) tempCart.splice(index, 1);
    else tempCart[index].qty = Math.min(99, qty);

    return NextResponse.json({
      success: true,
      message: "Cart updated",
      cart: tempCart,
      subtotal: calculateSubtotal(tempCart),
      itemCount: calculateItemCount(tempCart),
    });
  } catch (error: any) {
    console.error("PATCH /api/cart error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}

// --- ❌ DELETE: Remove item or clear all ---
export async function DELETE(_req: NextRequest, ctx: any) {
  try {

    const params = (ctx && ctx.params) ? await ctx.params : { id: undefined } as any;
    const id = params?.id as string;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || session?.user?.email;

    if (!id) return NextResponse.json({ success: false, error: "Missing item ID" }, { status: 400 });

    if (userId) {
      await dbConnect();
      const cart = await Cart.findOne({ userId }).lean();
      if (!cart) return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });

      const items = ((cart.items as any) as CartItem[]).filter((i) => i.id !== id);
      await Cart.findOneAndUpdate({ userId }, { items, updatedAt: new Date() }, { upsert: true });

      return NextResponse.json({
        success: true,
        message: "Item removed",
        cart: items,
        subtotal: calculateSubtotal(items),
        itemCount: calculateItemCount(items),
      });
    }

    // Guest
    tempCart = tempCart.filter((i) => i.id !== id);

    return NextResponse.json({
      success: true,
      message: "Item removed",
      cart: tempCart,
      subtotal: calculateSubtotal(tempCart),
      itemCount: calculateItemCount(tempCart),
    });
  } catch (error: any) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}
