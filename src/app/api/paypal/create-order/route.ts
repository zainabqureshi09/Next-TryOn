import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { checkoutSchema } from "@/lib/validation";

// PayPal SDK temporarily disabled for build
// import { PayPalApi, CreateOrderRequest, PayPalEnvironment, LogLevel } from '@paypal/paypal-server-sdk';

/*
// PayPal client setup
function getPayPalClient() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const environment = process.env.NODE_ENV === 'production' 
    ? PayPalEnvironment.Live 
    : PayPalEnvironment.Sandbox;

  return new PayPalApi({
    clientCredentialsAuthCredentials: {
      oAuthClientId: clientId,
      oAuthClientSecret: clientSecret,
    },
    environment,
    logLevel: LogLevel.Info,
  });
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
    // Parse and validate request body
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items, customerEmail } = parsed.data;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Get authenticated user
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;
    const userEmail = (session?.user as any)?.email || customerEmail;

    // Calculate total
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + (item.price || 0) * item.qty,
      0
    );

    // Create PayPal order items
    const paypalItems = items.map((item: any) => ({
      name: item.name,
      quantity: item.qty.toString(),
      unit_amount: {
        currency_code: 'USD',
        value: (item.price || 0).toFixed(2),
      },
    }));

    // Save order in MongoDB
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
      paymentMethod: "paypal",
      paypalOrderId: null, // will be updated after PayPal order creation
      shippingAddress: null,
    });

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: order._id.toString(),
          amount: {
            currency_code: 'USD',
            value: subtotal.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: subtotal.toFixed(2),
              },
            },
          },
          items: paypalItems,
        },
      ],
      application_context: {
        brand_name: 'LensVision',
        landing_page: 'BILLING',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?payment=paypal&order_id=${order._id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      },
    });

    const response = await client().execute(request);

    // Update order with PayPal order ID
    order.paypalOrderId = response.result.id;
    await order.save();

    */
    
  } catch (error: any) {
    console.error("PayPal order creation error:", error);
    return NextResponse.json(
      { error: error.message || "PayPal integration temporarily disabled" },
      { status: 503 }
    );
  }
}
