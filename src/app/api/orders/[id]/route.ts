import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/lib/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Params { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
	const session: any = await getServerSession(authOptions as any);
	if (!session || session?.user?.role !== "admin") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	await dbConnect();
	const body = await req.json();
	const status = body?.status as string;
	if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });
	const updated = await Order.findByIdAndUpdate(params.id, { status }, { new: true });
	if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(updated);
}







