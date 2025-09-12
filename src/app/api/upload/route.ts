import { NextResponse } from "next/server";
import { uploadSchema } from "@/lib/validation";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const allowed = await rateLimit(keyFromRequest(req, "upload:post"), { intervalMs: 60_000, max: 20 });
    if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body = await req.json();
    const parsed = uploadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET; // unsigned preset recommended
    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 });
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: new URLSearchParams({ file: parsed.data.dataUrl, upload_preset: uploadPreset }),
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json({ error: json?.error?.message || "Upload failed" }, { status: 400 });

    return NextResponse.json({ url: json.secure_url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload error" }, { status: 400 });
  }
}
