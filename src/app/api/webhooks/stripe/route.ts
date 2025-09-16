import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "No webhook secret" }, { status: 500 });
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  try {
    const rawBody = await req.text();
    const Stripe = (await import("stripe")).default;
    const secretKey = process.env.STRIPE_SECRET_KEY as string | undefined;
    if (!secretKey) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
    const event = stripe.webhooks.constructEvent(rawBody, sig as string, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const itemsMeta = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
      const items = (itemsMeta || []).map((i: any) => ({
        productId: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        image: i.image || null,
      }));
      const subtotal = items.reduce((s: number, it: any) => s + (it.price || 0) * (it.qty || 0), 0);

      await dbConnect();
      if (items.length > 0) {
        await Order.create({
          customerName: session.customer_details?.name || "Guest",
          customerEmail: session.customer_details?.email || "guest@example.com",
          items,
          subtotal,
          status: "paid",
        });

        // Reduce stock for each product
        await Promise.all(
          items.map(async (it: any) => {
            try {
              await Product.updateOne({ _id: it.productId }, { $inc: { stock: -it.qty } });
            } catch (_) {}
          })
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Webhook error" }, { status: 400 });
  }
}
