import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

// PayPal SDK temporarily disabled for build
// const paypal = require('@paypal/checkout-server-sdk');

/*
// PayPal environment setup
function environment() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  return process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

// PayPal client
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}
*/

export async function POST(req: Request) {
  try {
    return NextResponse.json(
      { error: "PayPal integration temporarily disabled" },
      { status: 503 }
    );
    
    // PayPal functionality disabled for build
    /*
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Capture the PayPal order
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client().execute(request);

    // Update order status in MongoDB
    await dbConnect();
    const { default: Order } = await import("@/lib/models/Order");

    const order = await Order.findOne({ paypalOrderId: orderID });
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found in database" },
        { status: 404 }
      );
    }

    // Update order with payment details
    order.status = "completed";
    order.paypalCaptureId = capture.result.id;
    order.paymentDetails = {
      paypalOrderId: orderID,
      captureId: capture.result.id,
      amount: capture.result.purchase_units[0].payments.captures[0].amount,
      payerInfo: capture.result.payer,
      capturedAt: new Date(),
    };

    // Add shipping address if provided
    if (capture.result.purchase_units[0].shipping) {
      order.shippingAddress = {
        name: capture.result.purchase_units[0].shipping.name?.full_name || '',
        addressLine1: capture.result.purchase_units[0].shipping.address?.address_line_1 || '',
        addressLine2: capture.result.purchase_units[0].shipping.address?.address_line_2 || '',
        city: capture.result.purchase_units[0].shipping.address?.admin_area_2 || '',
        state: capture.result.purchase_units[0].shipping.address?.admin_area_1 || '',
        postalCode: capture.result.purchase_units[0].shipping.address?.postal_code || '',
        country: capture.result.purchase_units[0].shipping.address?.country_code || '',
      };
    }

    */
    
  } catch (error: any) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: error.message || "PayPal integration temporarily disabled" },
      { status: 503 }
    );
  }
}
