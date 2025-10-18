import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ====================
// 📦 GET /api/orders
// ====================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!session || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Try to fetch from database first
    let orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

    // If no orders in database, return mock data for demonstration
    if (orders.length === 0) {
      const mockOrders = [
        {
          _id: '60f7a4a5c1234567890abcde',
          userId: userId,
          items: [
            {
              productId: '1',
              name: 'LensVision Aviator Sunglasses',
              price: 89.99,
              qty: 1,
              image: '/assets/frame1.jpg'
            }
          ],
          total: 89.99,
          status: 'delivered',
          paymentStatus: 'paid',
          createdAt: new Date('2024-01-15').toISOString(),
          deliveredAt: new Date('2024-01-18').toISOString(),
          __v: 0
        },
        {
          _id: '60f7a4a5c1234567890abcdf',
          userId: userId,
          items: [
            {
              productId: '2',
              name: 'LensVision Blue Light Glasses',
              price: 49.99,
              qty: 2,
              image: '/assets/homeMen.jpg'
            },
            {
              productId: '3',
              name: 'LensVision Classic Frames',
              price: 29.99,
              qty: 1,
              image: '/assets/female.jpg'
            }
          ],
          total: 129.97,
          status: 'shipped',
          paymentStatus: 'paid',
          createdAt: new Date('2024-02-01').toISOString(),
          shippedAt: new Date('2024-02-02').toISOString(),
          __v: 0
        },
        {
          _id: '60f7a4a5c1234567890abce0',
          userId: userId,
          items: [
            {
              productId: '4',
              name: 'LensVision Designer Frames',
              price: 199.99,
              qty: 1,
              image: '/assets/slideHome.jpg'
            }
          ],
          total: 199.99,
          status: 'processing',
          paymentStatus: 'paid',
          createdAt: new Date().toISOString(),
          __v: 0
        }
      ] as any[];
      orders = mockOrders;
    }

    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!session || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, total, paymentMethod } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!total || total <= 0) {
      return NextResponse.json(
        { error: 'Valid total is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const newOrder = new Order({
      userId,
      items,
      total,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'card',
      createdAt: new Date()
    });

    const savedOrder = await newOrder.save();
    
    return NextResponse.json({
      success: true,
      data: savedOrder
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
