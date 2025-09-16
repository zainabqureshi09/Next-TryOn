import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ✅ use lib/auth
import dbConnect from "@/lib/dbConnect";
import UserProfile from "@/lib/models/UserProfile";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const profile = await UserProfile.findOne({ userEmail: session.user.email }).lean();
  return NextResponse.json(profile || {});
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await dbConnect();
  const updated = await UserProfile.findOneAndUpdate(
    { userEmail: session.user.email },
    { userEmail: session.user.email, ...body },
    { new: true, upsert: true }
  );

  return NextResponse.json(updated);
}






