import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ✅ import from lib
import dbConnect from "@/lib/dbConnect";
import Snapshot from "@/lib/models/Snapshot";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const snaps = await Snapshot.find({ userEmail: session.user.email })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(snaps);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const dataUrl = body?.dataUrl as string;
  if (!dataUrl) {
    return NextResponse.json({ error: "No dataUrl" }, { status: 400 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 });
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: new URLSearchParams({
        file: dataUrl,
        upload_preset: uploadPreset,
      }),
    }
  );

  const json = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: json?.error?.message || "Upload failed" },
      { status: 400 }
    );
  }

  await dbConnect();
  const created = await Snapshot.create({
    userEmail: session.user.email,
    url: json.secure_url,
  });

  return NextResponse.json(created, { status: 201 });
}









