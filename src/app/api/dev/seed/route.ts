import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";

export async function POST(req: Request) {
  const token = req.headers.get("x-seed-token");
  if (!process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const demo = [
    { name: "Aviator", price: 79.99, image: "/assets/products/sunglasses1.jpg", overlayImage: "/assets/products/sunglasses1.png", category: "sunglasses", stock: 20 },
    { name: "Blue Light", price: 59.99, image: "/assets/products/bluelight1.jpg", overlayImage: "/assets/products/bluelight1.png", category: "blue-light", stock: 30 },
    { name: "Round", price: 39.99, image: "/assets/products/round1.jpg", overlayImage: "/assets/products/round1.png", category: "eyeglasses", stock: 15 },
  ];

  await Product.deleteMany({});
  const created = await Product.insertMany(demo);
  return NextResponse.json({ count: created.length });
}

