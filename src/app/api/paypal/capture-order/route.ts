import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

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
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Capture order in PayPal
    const accessToken = await getAccessToken();
    const res = await fetch(`${getPaypalBase()}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({}),
    });

    const data: any = await res.json();

    if (!res.ok) {
      console.error("PayPal capture error:", data);
      return NextResponse.json(
        { error: data?.message || "Failed to capture PayPal payment" },
        { status: 500 }
      );
    }

    // Update order in DB
    await dbConnect();
    const { default: Order } = await import("@/lib/models/Order");

    const order = await Order.findOne({ paypalOrderId: orderID });
    if (!order) {
      return NextResponse.json(
        { error: "Order not found in database" },
        { status: 404 }
      );
    }

    order.status = "completed";
    order.paymentStatus = "paid";
    order.paypalCaptureId = data?.id;
    order.paymentDetails = {
      paypalOrderId: orderID,
      captureId: data?.id,
      amount: data?.purchase_units?.[0]?.payments?.captures?.[0]?.amount,
      payerInfo: data?.payer,
      capturedAt: new Date(),
    } as any;

    // Save shipping address if provided
    const shipping = data?.purchase_units?.[0]?.shipping;
    if (shipping) {
      order.shippingAddress = {
        name: shipping?.name?.full_name || "",
        addressLine1: shipping?.address?.address_line_1 || "",
        addressLine2: shipping?.address?.address_line_2 || "",
        city: shipping?.address?.admin_area_2 || "",
        state: shipping?.address?.admin_area_1 || "",
        postalCode: shipping?.address?.postal_code || "",
        country: shipping?.address?.country_code || "",
      } as any;
    }

    await order.save();

    return NextResponse.json({ success: true, mongoOrderId: order._id.toString() });
  } catch (error: any) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: error?.message || "PayPal integration error" },
      { status: 500 }
    );
  }
}
