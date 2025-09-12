import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validation";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const allowed = await rateLimit(keyFromRequest(req, "checkout:post"), { intervalMs: 60_000, max: 10 });
    if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { items, customerEmail } = parsed.data;

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const line_items = items.map((it: any) => ({
      quantity: it.qty,
      price_data: {
        currency: "usd",
        product_data: {
          name: it.name,
          images: it.image ? [it.image] : [],
        },
        unit_amount: Math.round((it.price || 0) * 100),
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: customerEmail,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "PK", "IN", "AU", "DE", "FR", "AE"] },
      billing_address_collection: "required",
      metadata: {
        items: JSON.stringify(items.map((i: any) => ({ id: (i as any).id || (i as any)._id, name: i.name, price: i.price, qty: i.qty, image: i.image || "" })) ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Checkout failed" }, { status: 400 });
  }
}
