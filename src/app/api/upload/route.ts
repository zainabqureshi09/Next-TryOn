import { NextResponse } from "next/server";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";

async function readBody(req: Request): Promise<{ dataUrl?: string; file?: Blob } | null> {
  const contentType = req.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const json = await req.json();
      if (json?.dataUrl) return { dataUrl: json.dataUrl };
    }

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (file instanceof Blob) return { file };

      const dataUrl = form.get("dataUrl");
      if (typeof dataUrl === "string") return { dataUrl };
    }
  } catch (err) {
    console.error("Body parse error:", err);
    return null;
  }

  return null;
}

export async function POST(req: Request) {
  try {
    // ✅ Rate limit
    const allowed = await rateLimit(keyFromRequest(req, "upload:post"), { intervalMs: 60_000, max: 20 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // ✅ Parse request
    const parsedBody = await readBody(req);
    if (!parsedBody) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    // ✅ Cloudinary env check
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 });
    }

    let bodyToSend: BodyInit;
    let headers: HeadersInit | undefined;

    if (parsedBody.dataUrl) {
      // ✅ Upload base64 / dataURL
      bodyToSend = new URLSearchParams({
        file: parsedBody.dataUrl,
        upload_preset: uploadPreset,
      });
      headers = { "Content-Type": "application/x-www-form-urlencoded" };
    } else if (parsedBody.file) {
      // ✅ Upload file (formData)
      const form = new FormData();
      form.append("file", parsedBody.file);
      form.append("upload_preset", uploadPreset);
      bodyToSend = form;
      headers = undefined; // Browser sets boundary
    } else {
      return NextResponse.json({ error: "No file or dataUrl provided" }, { status: 400 });
    }

    // ✅ Call Cloudinary
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: bodyToSend,
      headers,
    });

    const json = await res.json();

    if (!res.ok) {
      const message = json?.error?.message || "Upload failed";
      console.error("Cloudinary error:", message);
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // ✅ Return uploaded image URL
    return NextResponse.json({
      url: json.secure_url,
      public_id: json.public_id,
    });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: e?.message || "Upload error" }, { status: 400 });
  }
}
