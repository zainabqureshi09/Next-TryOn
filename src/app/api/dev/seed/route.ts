import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import User from "@/lib/models/User";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  // For development, allow seeding without token
  // In production, you should add proper authentication
  if (process.env.NODE_ENV === "production") {
    const token = req.headers.get("x-seed-token");
    if (!process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    await dbConnect();

    // Clear existing data (products/categories only)
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Create categories
    const categories = [
      { name: "Sunglasses", slug: "sunglasses", description: "Protect your eyes from UV rays in style" },
      { name: "Blue Light Glasses", slug: "blue-light", description: "Reduce eye strain from digital screens" },
      { name: "Eyeglasses", slug: "eyeglasses", description: "Classic prescription and reading glasses" },
      { name: "Men's Collection", slug: "men", description: "Stylish eyewear for men" },
      { name: "Women's Collection", slug: "women", description: "Elegant eyewear for women" },
    ];

    const createdCategories = await Category.insertMany(categories);

    // Create products
    const products = [
      {
        name: "Classic Aviator Sunglasses",
        title: "Premium Aviator Style",
        price: 129.99,
        description: "Timeless aviator sunglasses with UV protection and polarized lenses.",
        category: "sunglasses",
        image: "/assets/frame1.jpg",
        overlayImage: "/assets/frame1.jpg",
        stock: 25,
        isActive: true,
        images: ["/assets/frame1.jpg"],
      },
      {
        name: "Blue Light Filter Glasses",
        title: "Digital Eye Strain Relief",
        price: 89.99,
        description: "Reduce eye strain and improve sleep with our blue light filtering technology.",
        category: "blue-light",
        image: "/assets/bluelight.jpg",
        overlayImage: "/assets/bluelight.jpg",
        stock: 40,
        isActive: true,
        images: ["/assets/bluelight.jpg"],
      },
      {
        name: "Round Vintage Frames",
        title: "Retro Round Style",
        price: 79.99,
        description: "Classic round frames with a modern twist. Perfect for any face shape.",
        category: "eyeglasses",
        image: "/assets/female.jpg",
        overlayImage: "/assets/female.jpg",
        stock: 20,
        isActive: true,
        images: ["/assets/female.jpg"],
      },
      {
        name: "Men's Business Frames",
        title: "Professional Look",
        price: 149.99,
        description: "Sophisticated frames perfect for the modern professional.",
        category: "men",
        image: "/assets/homeMen.jpg",
        overlayImage: "/assets/homeMen.jpg",
        stock: 15,
        isActive: true,
        images: ["/assets/homeMen.jpg"],
      },
      {
        name: "Women's Cat Eye Frames",
        title: "Feminine Elegance",
        price: 119.99,
        description: "Elegant cat-eye frames that add a touch of glamour to any outfit.",
        category: "women",
        image: "/assets/slideHome.jpg",
        overlayImage: "/assets/slideHome.jpg",
        stock: 30,
        isActive: true,
        images: ["/assets/slideHome.jpg"],
      },
      {
        name: "Sport Sunglasses",
        title: "Active Lifestyle",
        price: 99.99,
        description: "Durable sunglasses designed for active lifestyles and outdoor adventures.",
        category: "sunglasses",
        image: "/assets/slide2home.jpg",
        overlayImage: "/assets/slide2home.jpg",
        stock: 18,
        isActive: true,
        images: ["/assets/slide2home.jpg"],
      },
    ];

    const createdProducts = await Product.insertMany(products);

    // Ensure an admin user exists (dev convenience)
    const adminEmail = "admin@lensvision.com";
    const existingAdmin = await User.findOne({ email: adminEmail }).lean();
    if (!existingAdmin) {
      const passwordHash = await hash("admin123", 10);
      await User.create({ name: "Admin", email: adminEmail, password: passwordHash, role: "admin" });
    }

    return NextResponse.json({ 
      message: "Database seeded successfully",
      categories: createdCategories.length,
      products: createdProducts.length,
      admin: adminEmail
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: error.message },
      { status: 500 }
    );
  }
}



