import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validation";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Cart from "@/lib/models/Cart";

export async function POST(req: Request) {
  try {
    // 🔒 Rate limit protection
    const allowed = await rateLimit(keyFromRequest(req, "checkout:post"), {
      intervalMs: 60_000,
      max: 50,
    });

    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // 🧾 Parse and validate request body
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items, customerEmail } = parsed.data;

    // ✅ Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    for (const item of items) {
      const id = (item as any).id || (item as any)._id;
      if (
        !id ||
        typeof item.name !== "string" ||
        typeof item.price !== "number" ||
        typeof item.qty !== "number"
      ) {
        return NextResponse.json(
          {
            error: "Invalid item data",
            details: `Item ${item.name || "unknown"} has missing or invalid data`,
          },
          { status: 400 }
        );
      }
    }

    // 💳 Initialize Stripe
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    // 🔐 Get authenticated user
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;
    const userEmail = (session?.user as any)?.email || customerEmail;

    // 🧮 Create Stripe line items
    const line_items = items.map((it: any) => ({
      quantity: it.qty,
      price_data: {
        currency: "usd",
        product_data: {
          name: it.name,
          images: it.image ? [it.image] : [],
          metadata: {
            productId: it.id || it._id,
            frame: it.frame || "",
          },
        },
        unit_amount: Math.round((it.price || 0) * 100),
      },
    }));

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + (item.price || 0) * item.qty,
      0
    );

    // 🗄️ Save order in MongoDB
    await dbConnect();
    const { default: Order } = await import("@/lib/models/Order");

    const orderItems = items.map((item: any) => ({
      productId: item.id || item._id,
      name: item.name,
      price: item.price,
      quantity: item.qty,
      image: item.image || "",
      frame: item.frame || "",
    }));

    const order = await Order.create({
      userId,
      customerEmail: userEmail,
      items: orderItems,
      total: subtotal,
      status: "pending",
      stripeSessionId: null, // will be updated after session creation
      shippingAddress: null,
    });

    // 🧾 Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email: userEmail,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "PK", "IN", "AU", "DE", "FR", "AE"],
      },
      billing_address_collection: "required",
      metadata: {
        orderId: order._id.toString(),
        items: JSON.stringify(
          items.map((i: any) => ({
            id: i.id || i._id,
            name: i.name,
            price: i.price,
            qty: i.qty,
            image: i.image || "",
          }))
        ),
        customerEmail: userEmail,
      },
    });

    // Update order with stripe session id
    order.stripeSessionId = stripeSession.id;
    await order.save();

    // 🧹 Clear user's cart (if logged in)
    if (userId) {
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } },
        { upsert: true }
      );
    }

    // ✅ Return Stripe checkout URL
    return NextResponse.json({
      success: true,
      url: stripeSession.url,
      sessionId: stripeSession.id,
      orderId: order._id.toString(),
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process checkout" },
      { status: 500 }
    );
  }
}
