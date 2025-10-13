import { NextResponse } from "next/server";
import { rateLimit, keyFromRequest } from "@/lib/rateLimit";
import dbConnect from "@/lib/mongodb";
import Cart from "@/lib/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * 🛒 Cart API Route
 * Handles GET, POST, PATCH, DELETE
 * Works for both authenticated users (MongoDB)
 * and guest users (in-memory store)
 */

// Define proper types for cart items
interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  options?: Record<string, any>;
}

// Fallback in-memory cart for guests
let tempCart: CartItem[] = [];

// --- 🧮 Helper Functions ---
function calculateSubtotal(items: CartItem[] = []): number {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((total, item) => total + (item.price || 0) * (item.qty || 0), 0);
}

function calculateItemCount(items: CartItem[] = []): number {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((count, item) => count + (item.qty || 0), 0);
}

function normalizeItemPayload(payload: any): CartItem | null {
  if (!payload) return null;

  const id = String(payload.id || payload._id || "");
  const name = payload.name ? String(payload.name) : "";
  const price = payload.price !== undefined ? Number(payload.price) : NaN;
  const qty = payload.qty !== undefined ? Number(payload.qty) : 1;

  if (!id || !name || Number.isNaN(price)) return null;

  return {
    id,
    name,
    price,
    qty: Math.max(0, Math.floor(qty)),
    image: payload.image ? String(payload.image) : undefined,
    options: payload.options || undefined,
  };
}

// --- 📦 GET: Fetch all cart items ---
export async function GET(req: Request) {
  try {
    const key = keyFromRequest(req, "cart-get");
    const allowed = await rateLimit(key, { intervalMs: 60000, max: 100 });
    if (!allowed) {
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || session?.user?.email;

    if (userId) {
      await dbConnect();
      const userCart = await Cart.findOne({ userId }).lean();

      const items = Array.isArray(userCart?.items) ? ((userCart.items as any) as CartItem[]) : [];
      return NextResponse.json({
        success: true,
        cart: items,
        subtotal: calculateSubtotal(items),
        itemCount: calculateItemCount(items),
      });
    }

    // Guest user fallback
    return NextResponse.json({
      success: true,
      cart: tempCart,
      subtotal: calculateSubtotal(tempCart),
      itemCount: calculateItemCount(tempCart),
    });
  } catch (error: any) {
    if (error?.status === 429)
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });

    console.error("GET /api/cart error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}

// --- ➕ POST: Add or replace cart items ---
export async function POST(req: Request) {
  try {
    const key = keyFromRequest(req, "cart-post");
    const allowed = await rateLimit(key, { intervalMs: 60000, max: 50 });
    if (!allowed) {
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || session?.user?.email;

    const body = await req.json().catch(() => ({}));

    // Bulk update (replace)
    if (Array.isArray(body.items)) {
      const normalized: CartItem[] = body.items
        .map(normalizeItemPayload)
        .filter((i: any): i is CartItem => i !== null)
        .map((i: CartItem) => ({ ...i, qty: Math.min(99, Math.max(1, i.qty)) }));

      if (userId) {
        await dbConnect();
        const updated = await Cart.findOneAndUpdate(
          { userId },
          { userId, items: normalized, updatedAt: new Date() },
          { upsert: true, new: true }
        ).lean();

        const cartItems = ((updated?.items || []) as unknown) as CartItem[];
        return NextResponse.json({
          success: true,
          cart: cartItems,
          subtotal: calculateSubtotal(cartItems),
          itemCount: calculateItemCount(cartItems),
        });
      }

      tempCart = normalized;
      return NextResponse.json({
        success: true,
        cart: tempCart,
        subtotal: calculateSubtotal(tempCart),
        itemCount: calculateItemCount(tempCart),
      });
    }

    // Add single item
    if (body.id) {
      const normalized = normalizeItemPayload(body);
      if (!normalized) return NextResponse.json({ success: false, error: "Invalid item data" }, { status: 400 });
      normalized.qty = Math.max(1, Math.min(99, normalized.qty));

      if (userId) {
        await dbConnect();
        const existing = await Cart.findOne({ userId }).lean();
        const items: CartItem[] = Array.isArray(existing?.items) ? ([...existing.items] as unknown as CartItem[]) : [];

        const idx = items.findIndex((i) => i.id === normalized.id);
        if (idx >= 0) items[idx].qty = Math.min(99, items[idx].qty + normalized.qty);
        else items.push(normalized);

        const updated = await Cart.findOneAndUpdate(
          { userId },
          { userId, items, updatedAt: new Date() },
          { upsert: true, new: true }
        ).lean();

        const cartItems = ((updated?.items || []) as unknown) as CartItem[];
        return NextResponse.json({
          success: true,
          cart: cartItems,
          subtotal: calculateSubtotal(cartItems),
          itemCount: calculateItemCount(cartItems),
        });
      }

      // guest cart
      const idx = tempCart.findIndex((i) => i.id === normalized.id);
      if (idx >= 0) tempCart[idx].qty = Math.min(99, tempCart[idx].qty + normalized.qty);
      else tempCart.push(normalized);

      return NextResponse.json({
        success: true,
        cart: tempCart,
        subtotal: calculateSubtotal(tempCart),
        itemCount: calculateItemCount(tempCart),
      });
    }

    return NextResponse.json({ success: false, error: "Invalid request format" }, { status: 400 });
  } catch (error: any) {
    if (error?.status === 429)
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });

    console.error("POST /api/cart error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}


