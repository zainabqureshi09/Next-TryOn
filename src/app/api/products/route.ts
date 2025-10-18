import { NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import { productSchema } from "@/lib/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";

// ====================
// 📦 GET /api/products
// ====================
export async function GET(req: Request) {
  try {
    await dbConnect();

    // Parse query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || undefined;
    const search = url.searchParams.get("search") || undefined;
    const sort = url.searchParams.get("sort") || "createdAt"; // createdAt | price | ratings
    const order = url.searchParams.get("order") || "desc";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "12", 10));
    const skip = (page - 1) * limit;

    // Additional filters
    const priceMin = url.searchParams.get("priceMin");
    const priceMax = url.searchParams.get("priceMax");
    const colors = url.searchParams.get("colors"); // comma-separated
    const brands = url.searchParams.get("brands"); // maps to style
    const materials = url.searchParams.get("materials"); // maps to frame
    const rating = url.searchParams.get("rating");
    const inStock = url.searchParams.get("inStock");
    const onSale = url.searchParams.get("onSale");

    // Build filter conditions
    const filter: Record<string, any> = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }
    if (colors) {
      const arr = colors.split(",").map((s) => s.trim()).filter(Boolean);
      if (arr.length) filter.color = { $in: arr };
    }
    if (brands) {
      const arr = brands.split(",").map((s) => s.trim()).filter(Boolean);
      if (arr.length) filter.style = { $in: arr };
    }
    if (materials) {
      const arr = materials.split(",").map((s) => s.trim()).filter(Boolean);
      if (arr.length) filter.frame = { $in: arr };
    }
    if (rating) {
      filter.ratings = { $gte: Number(rating) };
    }
    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }
    if (onSale === "true") {
      filter.discount = { $gt: 0 };
    }

    // Build sort option
    const sortOption: Record<string, 1 | -1> = {};
    sortOption[sort] = order === "desc" ? -1 : 1;

    // Query products
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    // For products without explicit variations, create a default one for display purposes
    const productsWithVariations = products.map(product => {
      if (!product.variations || product.variations.length === 0) {
        // Create a default variation if none exist (e.g., for old data or simple products)
        return {
          ...product,
          variations: [{
            _id: product._id, // Use product ID as variation ID for simplicity
            sku: product.sku || `SKU-${product._id}`,
            price: product.price || 0, // Fallback price
            stock: product.stock || 0, // Fallback stock
            image: product.image || null,
            attributes: [{ name: "Default", value: "Default" }],
            isActive: product.isActive,
          }],
        };
      }
      return product;
    });

    return NextResponse.json({
      products: productsWithVariations,
      pagination: {
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
        page,
        limit,
      },
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);

    // ✅ Fallback mock data (updated to include variations)
    const mockProducts = [
      {
        _id: "1",
        name: "Classic Aviator",
        images: ["/assets/frame1.jpg"],
        category: "Sunglasses",
        isActive: true,
        variations: [
          {
            _id: "1-v1",
            sku: "AVIATOR-BLK-M",
            price: 129.99,
            stock: 25,
            image: "/assets/frame1.jpg",
            attributes: [{ name: "Color", value: "Black" }, { name: "Size", value: "Medium" }],
            isActive: true,
          },
        ],
      },
      {
        _id: "2",
        name: "Round Frames",
        images: ["/assets/bluelight.jpg"],
        category: "Blue Light",
        isActive: true,
        variations: [
          {
            _id: "2-v1",
            sku: "ROUND-BLU-L",
            price: 99.99,
            stock: 15,
            image: "/assets/bluelight.jpg",
            attributes: [{ name: "Color", value: "Blue" }, { name: "Size", value: "Large" }],
            isActive: true,
          },
        ],
      },
    ];

    return NextResponse.json({
      products: mockProducts,
      pagination: {
        total: mockProducts.length,
        pages: 1,
        page: 1,
        limit: mockProducts.length,
      },
    });
  }
}

// ====================
// 🧾 POST /api/products
// ====================
export async function POST(req: Request) {
  try {
    // 🧾 Parse request body
    const body = await req.json();

    // Basic validation
    if (!body.name || !body.price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    if (!['men', 'women', 'sunglasses'].includes(body.category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // ✅ Ensure DB connected
    await dbConnect();

    // 🧩 Prepare product data for creation (simple structure)
    const productData = {
      name: body.name,
      description: body.description || "",
      category: body.category,
      style: body.style || "",
      color: body.color || "",
      price: parseFloat(body.price),
      stock: parseInt(body.stock) || 0,
      image: body.image || "",
      overlayImage: body.overlayImage || "/frames/glasses.png",
      isActive: body.isActive !== false,
      virtualTryOn: body.virtualTryOn !== false,
      rating: 4.5, // Default rating
      reviewCount: 0,
      specifications: body.specifications || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await Product.create(productData);

    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
