import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { checkoutSchema } from "@/lib/validation";

function getPaypalBase() {
  return process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const tokenUrl = `${getPaypalBase()}/v1/oauth2/token`;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to fetch PayPal access token: ${txt}`);
  }

  const data: any = await res.json();
  return data.access_token as string;
}

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items, customerEmail } = parsed.data as any;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Authenticated user (optional)
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;
    const userEmail = (session?.user as any)?.email || customerEmail;

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + (Number(item.price) || 0) * Number(item.qty || 0),
      0
    );

    // Save order in MongoDB
    await dbConnect();
    const { default: Order } = await import("@/lib/models/Order");

    const orderItems = items.map((item: any) => ({
      productId: item.id || item._id,
      name: item.name,
      price: Number(item.price) || 0,
      qty: Number(item.qty) || 1,
      image: item.image || "",
    }));

    const tax = 0;
    const shipping = 0;
    const total = subtotal + tax + shipping;

    const order = await Order.create({
      userId,
      customerEmail: userEmail,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      status: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      paypalOrderId: null,
      shippingAddress: null,
    });

    // Build PayPal order payload
    const paypalItems = items.map((item: any) => ({
      name: String(item.name),
      quantity: String(item.qty),
      unit_amount: {
        currency_code: "USD",
        value: (Number(item.price) || 0).toFixed(2),
      },
      category: "PHYSICAL_GOODS",
    }));

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order._id.toString(),
          amount: {
            currency_code: "USD",
            value: subtotal.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: subtotal.toFixed(2),
              },
            },
          },
          items: paypalItems,
        },
      ],
      application_context: {
        brand_name: "LensVision",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/success?payment=paypal&order_id=${order._id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/cancel`,
      },
    } as const;

    // Get access token and create order
    const accessToken = await getAccessToken();
    const res = await fetch(`${getPaypalBase()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const data: any = await res.json();

    if (!res.ok || !data?.id) {
      console.error("PayPal create-order error:", data);
      return NextResponse.json(
        { error: data?.message || "Failed to create PayPal order" },
        { status: 500 }
      );
    }

    // Update order with PayPal order ID
    order.paypalOrderId = data.id;
    await order.save();

    return NextResponse.json({ success: true, orderID: data.id, mongoOrderId: order._id.toString() });
  } catch (error: any) {
    console.error("PayPal create-order error:", error);
    return NextResponse.json(
      { error: error?.message || "PayPal integration error" },
      { status: 500 }
    );
  }
}
