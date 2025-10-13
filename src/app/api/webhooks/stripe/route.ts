import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
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
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await dbConnect();
        const order = await Order.findById(orderId);

        if (order) {
          order.status = "paid";
          order.shippingAddress = session.shipping_details;
          await order.save();

          // Reduce stock for each product
          await Promise.all(
            order.items.map(async (it: any) => {
              try {
                await Product.updateOne({ _id: it.productId }, { $inc: { stock: -it.quantity } });
              } catch (_) {}
            })
          );
        } else {
          console.error(`Order not found for orderId: ${orderId}`);
        }
      } else {
        console.error("No orderId in Stripe session metadata");
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Webhook error" }, { status: 400 });
  }
}
