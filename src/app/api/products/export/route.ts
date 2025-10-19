export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ====================
// 📦 GET /api/products/export
// ====================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const products = await Product.find({}).lean();

    const csvHeader = "_id,name,price,category,stock,isActive\n";
    const csvBody = products
      .map(
        (p) =>
          `"${p._id}","${p.name}",${p.price},"${p.category}",${p.stock},${p.isActive}`
      )
      .join("\n");

    const csv = csvHeader + csvBody;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=products.csv",
      },
    });
  } catch (error: any) {
    console.error("Error exporting products:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export products" },
      { status: 500 }
    );
  }
}
