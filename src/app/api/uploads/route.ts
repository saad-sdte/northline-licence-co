import { NextResponse } from "next/server";
import { cloudinaryConfigured, cloudinaryPreviewUrl, uploadDrivingLicence } from "@/lib/cloudinary";
import { isAllowedScanType, MAX_SCAN_BYTES } from "@/lib/documents";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!cloudinaryConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Document uploads are temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Upload must be multipart form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, message: "Please choose a driving licence image or PDF." }, { status: 400 });
  }
  if (file.size > MAX_SCAN_BYTES) {
    return NextResponse.json({ ok: false, message: "File must be 8 MB or smaller." }, { status: 400 });
  }

  const type = (file.type || "application/octet-stream").toLowerCase();
  if (!isAllowedScanType(type)) {
    return NextResponse.json(
      { ok: false, message: "Use a JPG, PNG, WEBP, HEIC, or PDF scan of your driving licence." },
      { status: 400 },
    );
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const uploaded = await uploadDrivingLicence({ bytes, mime: type });
    return NextResponse.json({
      ok: true,
      file: {
        publicId: uploaded.publicId,
        url: uploaded.url,
        previewUrl: cloudinaryPreviewUrl(uploaded.url, type),
        name: file.name || "driving-licence",
        type,
        size: uploaded.bytes,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "We could not store your scan. Please try again." },
      { status: 502 },
    );
  }
}
