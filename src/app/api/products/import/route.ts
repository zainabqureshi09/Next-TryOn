import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Readable } from "stream";
import csv from "csv-parser";

// ====================
// 📦 POST /api/products/import
// ====================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const readable = new Readable();
    readable.push(Buffer.from(await file.arrayBuffer()));
    readable.push(null);

    const results: any[] = [];
    await new Promise((resolve, reject) => {
      readable
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    let createdCount = 0;
    let updatedCount = 0;

    for (const product of results) {
      if (product._id) {
        await Product.findByIdAndUpdate(product._id, product, { upsert: true });
        updatedCount++;
      } else {
        await Product.create(product);
        createdCount++;
      }
    }

    return NextResponse.json({
      message: "Import successful",
      created: createdCount,
      updated: updatedCount,
    });
  } catch (error: any) {
    console.error("Error importing products:", error);
    return NextResponse.json(
      { error: error.message || "Failed to import products" },
      { status: 500 }
    );
  }
}
