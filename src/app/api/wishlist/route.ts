import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Wishlist from "@/lib/models/Wishlist";
import Product from "@/lib/models/Product";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    
    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        userEmail: session.user.email!,
        items: []
      });
      await wishlist.save();
    }

    // Populate product details
    const productIds = wishlist.items.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    // Create a map for quick lookup
    const productMap = products.reduce((acc: any, product: any) => {
      acc[product._id.toString()] = product;
      return acc;
    }, {} as any);

    // Combine wishlist items with product details
    const itemsWithProducts = wishlist.items.map((item: any) => ({
      ...item,
      product: productMap[item.productId] || null
    })).filter((item: any) => item.product !== null); // Remove items for deleted products

    return NextResponse.json({
      success: true,
      data: {
        ...wishlist.toObject(),
        items: itemsWithProducts
      }
    });

  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, notes, notifyOnPriceDrop = false, notifyOnBack = false } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const userId = (session.user as any).id;
    
    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        userEmail: session.user.email!,
        items: []
      });
    }

    // Check if item already exists
    const existingItem = wishlist.items.find((item: any) => item.productId === productId);
    if (existingItem) {
      return NextResponse.json(
        { error: "Product is already in your wishlist" },
        { status: 400 }
      );
    }

    // Add item to wishlist
    wishlist.items.push({
      productId,
      notes: notes?.trim() || '',
      priceWhenAdded: product.price || 0,
      notifyOnPriceDrop,
      notifyOnBack,
      addedAt: new Date()
    });
    
    await wishlist.save();

    return NextResponse.json({
      success: true,
      data: wishlist,
      message: "Product added to wishlist"
    });

  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const action = searchParams.get('action'); // 'clear' to clear entire wishlist

    const userId = (session.user as any).id;
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );
    }

    if (action === 'clear') {
      // Clear entire wishlist
      wishlist.items = [];
      await wishlist.save();
      return NextResponse.json({
        success: true,
        data: wishlist,
        message: "Wishlist cleared"
      });
    }

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Remove specific item
    const itemIndex = wishlist.items.findIndex((item: any) => item.productId === productId);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Product not found in wishlist" },
        { status: 404 }
      );
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    return NextResponse.json({
      success: true,
      data: wishlist,
      message: "Product removed from wishlist"
    });

  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, isPublic } = body;

    const userId = (session.user as any).id;
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );
    }

    // Update wishlist settings
    if (name !== undefined) wishlist.name = name.trim();
    if (description !== undefined) wishlist.description = description.trim();
    if (isPublic !== undefined) wishlist.isPublic = isPublic;

    await wishlist.save();

    return NextResponse.json({
      success: true,
      data: wishlist,
      message: "Wishlist updated successfully"
    });

  } catch (error) {
    console.error("Wishlist PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}